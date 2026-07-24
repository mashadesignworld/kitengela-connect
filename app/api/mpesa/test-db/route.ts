import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      include: { payments: true },
    });

    const payments = await prisma.payment.findMany({
      orderBy: { createdAt: "desc" },
    });

    const sessions = await prisma.wifiSession.findMany();

    return NextResponse.json({
      summary: {
        totalUsers: users.length,
        totalPayments: payments.length,
        totalSessions: sessions.length,
      },
      payments,
      users,
      sessions,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Database query failed", details: error.message },
      { status: 500 }
    );
  }
}