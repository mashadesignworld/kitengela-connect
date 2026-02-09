// lib/wifiAccess.ts
export async function grantWifiAccess(paymentId: string) {
  console.log("📡 Granting Wi-Fi access for payment:", paymentId);

  // SIMULATION MODE
  if (process.env.WIFI_MODE === "SIMULATOR") {
    console.log("🧪 [SIMULATOR] Wi-Fi access granted");
    return { success: true, mode: "SIMULATOR" };
  }

  // REAL ROUTER MODE (future)
  throw new Error("Real router not configured");
}
