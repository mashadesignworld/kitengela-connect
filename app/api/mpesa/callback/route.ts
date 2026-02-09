// ✅ Force Node.js runtime (Prisma CANNOT run in Edge)
export const runtime = "nodejs";

import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { grantWifiAccess } from "@/lib/wifiAccess";

export async function POST(req: Request) {
  try {
    console.log("🔥 [CALLBACK] ENDPOINT HIT");
    console.log("📁 DATABASE_URL =", process.env.DATABASE_URL || "NOT SET!");

    let rawBody;
    try {
      rawBody = await req.json();
      console.log("📦 Raw body received (stringified):", JSON.stringify(rawBody, null, 2));
    } catch (parseErr) {
      console.error("❌ Failed to parse request body as JSON:", parseErr);
      return NextResponse.json({ ResultCode: 0, ResultDesc: "Accepted" });
    }

    // Sanitize / deep copy (good practice)
    const body = JSON.parse(JSON.stringify(rawBody));
    console.log("📩 Parsed callback body:", JSON.stringify(body, null, 2));

    if (!body?.Body?.stkCallback) {
      console.error("⚠️ Invalid callback format - missing Body.stkCallback");
      return NextResponse.json({ ResultCode: 0, ResultDesc: "Accepted" });
    }

    const stkCallback = body.Body.stkCallback;
    console.log("🔍 stkCallback:", JSON.stringify(stkCallback, null, 2));

    const safeCallbackData = {
      MerchantRequestID: stkCallback.MerchantRequestID ?? null,
      CheckoutRequestID: stkCallback.CheckoutRequestID ?? null,
      ResultCode: stkCallback.ResultCode ?? null,
      ResultDesc: stkCallback.ResultDesc ?? null,
    };

    const resultCode = stkCallback.ResultCode;
    const resultDesc = stkCallback.ResultDesc;
    const checkoutRequestID = stkCallback.CheckoutRequestID;

    console.log(`📊 ResultCode = ${resultCode} | Desc = ${resultDesc} | CheckoutRequestID = ${checkoutRequestID}`);

    if (resultCode !== 0) {
      console.log("❌ Payment FAILED / CANCELLED:", resultDesc);

      const failedPayment = await prisma.payment.upsert({
        where: { checkoutRequestID },
        update: {
          status: "FAILED",
          wifiAccessGranted: false,
          amount: null,
          phoneNumber: "unknown",
          mpesaReceipt: null,
          callbackData: safeCallbackData,
        },
        create: {
          checkoutRequestID,
          status: "FAILED",
          wifiAccessGranted: false,
          amount: null,
          phoneNumber: null,
          mpesaReceipt: null,
          callbackData: safeCallbackData,
        },
      });

      console.log("💾 FAILED payment saved/updated → ID:", failedPayment.id);
      return NextResponse.json({ ResultCode: 0, ResultDesc: "Accepted" });
    }

    // ── SUCCESS PATH ────────────────────────────────────────────────
    console.log("✅ Payment appears SUCCESSFUL (ResultCode = 0)");

  
    
    const metadata = stkCallback.CallbackMetadata?.Item || [];
    console.log("📋 CallbackMetadata items:", metadata);

    const getValue = (name: string) =>
      metadata.find((i: any) => i.Name === name)?.Value ?? null;

    const amount       = getValue("Amount");
    const mpesaReceipt = getValue("MpesaReceiptNumber");
    const phoneNumber  = getValue("PhoneNumber");

    console.log("Extracted → Amount:", amount);
    console.log("Extracted → Receipt:", mpesaReceipt);
    console.log("Extracted → Phone:", phoneNumber);

    const safePhone = phoneNumber ? String(phoneNumber) : "unknown";

    console.log("👤 Normalizing phone →", safePhone);

    let user;
    try {
      user = await prisma.user.upsert({
        where: { phone: safePhone },
        update: {},
        create: { phone: safePhone },
      });
      console.log("👤 User upserted → ID:", user.id);
    } catch (userErr) {
      console.error("❌ Failed to upsert user:", userErr);
      // Still continue – don't block payment record
    }

    const payment = await prisma.payment.upsert({
      where: { checkoutRequestID },
      update: {
        amount,
        phoneNumber: safePhone,
        mpesaReceipt,
        status: "PAID",
        wifiAccessGranted: true,
        callbackData: safeCallbackData,
        userId: user?.id ?? null,
      },
      create: {
        checkoutRequestID,
        amount,
        phoneNumber: safePhone,
        mpesaReceipt,
        status: "PAID",
        wifiAccessGranted: true,
        callbackData: safeCallbackData,
        userId: user?.id ?? null,
      },
    });

    console.log("💾 SUCCESS payment saved/updated → ID:", payment.id);
 
 if (!payment.wifiAccessGranted) {
  await grantWifiAccess(payment.id);

  await prisma.payment.update({
    where: { id: payment.id },
    data: { wifiAccessGranted: true },
  });

  console.log("📶 Wi-Fi access granted");
} else {
  console.log("🔁 Wi-Fi already granted — skipping");
}



    return NextResponse.json({
      ResultCode: 0,
      ResultDesc: "Accepted",
    });
  } catch (error) {
    console.error("❌ [CALLBACK] CRITICAL ERROR:", error);
    console.error("Error stack:", error instanceof Error ? error.stack : "No stack");
    return NextResponse.json({
      ResultCode: 0,
      ResultDesc: "Accepted",
    });
  }
}