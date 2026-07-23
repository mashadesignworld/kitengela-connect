// ✅ Force Node.js runtime (Prisma CANNOT run in Edge)
export const runtime = "nodejs";

import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { grantWifiAccess } from "@/lib/wifiAccess";

export async function POST(req: Request) {
  try {
    console.log("🔥 [CALLBACK] ENDPOINT HIT");

    let rawBody;
    try {
      rawBody = await req.json();
      console.log("📦 Raw body:", JSON.stringify(rawBody, null, 2));
    } catch (parseErr) {
      console.error("❌ Failed to parse JSON:", parseErr);
      return NextResponse.json({ ResultCode: 0, ResultDesc: "Accepted" });
    }

    const body = JSON.parse(JSON.stringify(rawBody));

    if (!body?.Body?.stkCallback) {
      console.error("⚠️ Invalid callback format - missing Body.stkCallback");
      return NextResponse.json({ ResultCode: 0, ResultDesc: "Accepted" });
    }

    const stkCallback = body.Body.stkCallback;
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

    // Extract metadata
    const metadata = stkCallback.CallbackMetadata?.Item || [];
    const getValue = (name: string) => metadata.find((i: any) => i.Name === name)?.Value ?? null;

    const amount       = getValue("Amount");
    const mpesaReceipt = getValue("MpesaReceiptNumber");
    const phoneNumber  = getValue("PhoneNumber");
    const safePhone    = phoneNumber ? String(phoneNumber) : null;

    console.log("Extracted → Amount:", amount);
    console.log("Extracted → Receipt:", mpesaReceipt);
    console.log("Extracted → Phone:", safePhone);

    // Upsert user only if phone exists
    let user;
    if (safePhone) {
      try {
        user = await prisma.user.upsert({
          where: { phone: safePhone },
          update: {},
          create: { phone: safePhone },
        });
        console.log("👤 User upserted → ID:", user.id);
      } catch (userErr) {
        console.error("❌ Failed to upsert user:", userErr);
      }
    }

    if (resultCode !== 0) {
      console.log("❌ Payment FAILED / CANCELLED:", resultDesc);

      // Update only status and callbackData; preserve phoneNumber if already exists
      const failedPayment = await prisma.payment.upsert({
        where: { checkoutRequestID },
        update: {
          status: "FAILED",
          wifiAccessGranted: false,
          amount: null,
          mpesaReceipt: null,
          callbackData: safeCallbackData,
          // ✅ phoneNumber is preserved
        },
        create: {
          checkoutRequestID,
          status: "FAILED",
          wifiAccessGranted: false,
          amount: null,
          mpesaReceipt: null,
          callbackData: safeCallbackData,
          phoneNumber: safePhone ?? "unknown", // fallback if never stored
        },
      });

      console.log("💾 FAILED payment saved/updated → ID:", failedPayment.id);
      return NextResponse.json({ ResultCode: 0, ResultDesc: "Accepted" });
    }

    // ── SUCCESS PATH ────────────────────────────────────────────────
    console.log("✅ Payment appears SUCCESSFUL (ResultCode = 0)");

    const payment = await prisma.payment.upsert({
      where: { checkoutRequestID },
      update: {
        amount,
        phoneNumber: safePhone ?? undefined, // update only if available
        mpesaReceipt,
        status: "PAID",
        wifiAccessGranted: true,
        callbackData: safeCallbackData,
        userId: user?.id ?? null,
      },
      create: {
        checkoutRequestID,
        amount,
        phoneNumber: safePhone ?? "unknown",
        mpesaReceipt,
        status: "PAID",
        wifiAccessGranted: true,
        callbackData: safeCallbackData,
        userId: user?.id ?? null,
      },
    });

    console.log("💾 SUCCESS payment saved/updated → ID:", payment.id);

    // Grant Wi-Fi only if not already granted
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
    return NextResponse.json({ ResultCode: 0, ResultDesc: "Accepted" });
  }
}
