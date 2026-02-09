import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const checkoutRequestID = searchParams.get("checkoutRequestID");

  if (!checkoutRequestID) {
    return NextResponse.json(
      { error: "checkoutRequestID is required" },
      { status: 400 }
    );
  }

  const payment = await prisma.payment.findUnique({
    where: { checkoutRequestID },
  });

  if (!payment) {
    return NextResponse.json({ status: "PENDING" });
  }

  return NextResponse.json({ 
    status: payment.status,               // PAID | FAILED | PENDING
    wifiAccessGranted: payment.wifiAccessGranted,
    amount: payment.amount,
  });
}
