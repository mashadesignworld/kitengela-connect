import { NextResponse } from "next/server";
import { getMpesaAccessToken } from "@/lib/mpesa";
import { prisma } from "@/lib/prisma";


export async function POST(req: Request) {
  try {
    const { phone, amount } = await req.json();

    if (!phone || !amount) {
      return NextResponse.json(
        { error: "Phone and amount required" },
        { status: 400 }
      );
    }

    // 1. Get Access Token
    const accessToken = await getMpesaAccessToken();

    // 2. Format Timestamp & Password
    const timestamp = new Date()
      .toISOString()
      .replace(/[^0-9]/g, "")
      .slice(0, 14);

    const password = Buffer.from(
      `${process.env.MPESA_SHORTCODE}${process.env.MPESA_PASSKEY}${timestamp}`
    ).toString("base64");

    // 3. Call Daraja STK Push API
    const stkRes = await fetch(
      "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          BusinessShortCode: process.env.MPESA_SHORTCODE,
          Password: password,
          Timestamp: timestamp,
          TransactionType: "CustomerPayBillOnline",
          Amount: Math.round(Number(amount)), // Ensure whole integer
          PartyA: phone,
          PartyB: process.env.MPESA_SHORTCODE,
          PhoneNumber: phone,
          CallBackURL: process.env.MPESA_CALLBACK_URL,
          AccountReference: "KitengelaConnect",
          TransactionDesc: "Internet Package Payment",
        }),
      }
    );

    const data = await stkRes.json();
    console.log("SAFARICOM RESPONSE:", data);

    // 4. Verify Safaricom Accepted Request
    if (data.ResponseCode !== "0") {
      return NextResponse.json(
        { 
          error: data.CustomerMessage || data.ResponseDescription || "STK Push rejected by Safaricom",
          data 
        },
        { status: 400 }
      );
    }

    // 5. Create Pending Record in Supabase via Prisma
    const payment = await prisma.payment.create({
      data: {
        phoneNumber: String(phone),
        amount: Number(amount),
        checkoutRequestID: data.CheckoutRequestID,
        status: "PENDING",
        callbackData: {},
      },
    });

    return NextResponse.json({
      success: true,
      checkoutRequestID: data.CheckoutRequestID,
      paymentId: payment.id,
    });

  } catch (error: any) {
    console.error("STK Push Route Error:", error);
    return NextResponse.json(
      { error: error.message || "STK Push failed" },
      { status: 500 }
    );
  }
}