import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("📩 RAW CALLBACK:", JSON.stringify(body, null, 2));

    // Safety check
    if (!body?.Body?.stkCallback) {
      console.error("⚠️ Invalid callback format");
      return NextResponse.json({
        ResultCode: 0,
        ResultDesc: "Accepted"
      });
    }

    const stkCallback = body.Body.stkCallback;

    const resultCode = stkCallback.ResultCode;
    const resultDesc = stkCallback.ResultDesc;
    const checkoutRequestID = stkCallback.CheckoutRequestID;

    // ❌ Failed or cancelled
    if (resultCode !== 0) {
      console.log("❌ Payment Failed:", resultDesc);

      return NextResponse.json({
        ResultCode: 0,
        ResultDesc: "Accepted"
      });
    }

    // ✅ Successful payment
    const metadata = stkCallback.CallbackMetadata?.Item || [];

    const amount = metadata.find((i: any) => i.Name === "Amount")?.Value;
    const mpesaReceipt = metadata.find((i: any) => i.Name === "MpesaReceiptNumber")?.Value;
    const phoneNumber = metadata.find((i: any) => i.Name === "PhoneNumber")?.Value;

    console.log("✅ PAYMENT SUCCESSFUL");
    console.log("Amount:", amount);
    console.log("Receipt:", mpesaReceipt);
    console.log("Phone:", phoneNumber);
    console.log("Checkout ID:", checkoutRequestID);

    // Save to DB here

    return NextResponse.json({
      ResultCode: 0,
      ResultDesc: "Accepted"
    });

  } catch (error) {
    console.error("❌ CALLBACK ERROR:", error);

    // NEVER return 500 to Safaricom
    return NextResponse.json({
      ResultCode: 0,
      ResultDesc: "Accepted"
    });
  }
}
