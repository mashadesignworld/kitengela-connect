"use client";

import { useState, useEffect } from "react";

interface WifiPackage {
  name: string;
  price: number;
}

interface MpesaModalProps {
  pkg: WifiPackage;
  onClose: () => void;
  onCheckoutCreated: (checkoutRequestID: string) => void;
}

interface WifiDetails {
  ssid: string;
  password: string;
  duration: string;
}

type PaymentState = "idle" | "initiating" | "pending" | "success" | "error";

export default function MpesaModal({
  pkg,
  onClose,
  onCheckoutCreated,
}: MpesaModalProps) {
  const [phone, setPhone] = useState("");
  const [paymentState, setPaymentState] = useState<PaymentState>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [checkoutRequestId, setCheckoutRequestId] = useState<string | null>(null);
  const [wifiDetails, setWifiDetails] = useState<WifiDetails | null>(null);
  const [copied, setCopied] = useState(false);

  const copyToClipboard = (text: string) => {
    if (typeof window !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handlePayment = async () => {
    if (!phone) {
      setErrorMessage("Please enter your phone number.");
      return;
    }

    const normalizedPhone = phone.startsWith("0")
      ? "254" + phone.slice(1)
      : phone.startsWith("+254")
      ? phone.slice(1)
      : phone;

    try {
      setPaymentState("initiating");
      setErrorMessage("");

      const res = await fetch("/api/mpesa/stk-push", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone: normalizedPhone,
          amount: pkg.price,
          packageName: pkg.name,
        }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error("Server Error Response:", errorText);
        throw new Error(`Server returned status ${res.status}. Check terminal logs.`);
      }

      const data = await res.json();

      if (!data.checkoutRequestID) {
        setPaymentState("error");
        setErrorMessage("Unable to initiate payment. Try again.");
        return;
      }

      setCheckoutRequestId(data.checkoutRequestID);
      onCheckoutCreated(data.checkoutRequestID);
      setPaymentState("pending");
    } catch (error) {
      console.error(error);
      setPaymentState("error");
      setErrorMessage("Payment failed. Please try again.");
    }
  };

  // --- POLLING EFFECT FOR MPESA PAYMENT STATUS ---
  useEffect(() => {
    if (paymentState !== "pending" || !checkoutRequestId) return;

    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/mpesa/status?checkoutRequestID=${checkoutRequestId}`);
        if (!res.ok) return;

        const data = await res.json();

        // Standardize status checks based on callback responses
        if (data.status === "PAID" || data.status === "SUCCESS" || data.wifiAccessGranted) {
          setWifiDetails({
            ssid: data.wifiSSID || "Kitengela_Connect_5G",
            password: data.wifiPassword || "KiteNet#2026",
            duration: pkg.name,
          });
          setPaymentState("success");
          clearInterval(interval);
        } else if (data.status === "FAILED" || data.status === "CANCELLED") {
          setPaymentState("error");
          setErrorMessage("Transaction was cancelled or failed on phone.");
          clearInterval(interval);
        }
      } catch (err) {
        console.error("Polling status error:", err);
      }
    }, 2500);

    return () => clearInterval(interval);
  }, [paymentState, checkoutRequestId, pkg.name]);

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex justify-center items-center z-50 p-4">
      <div className="bg-slate-900 border border-slate-800 text-slate-100 rounded-2xl shadow-2xl w-full max-w-md p-6 sm:p-8 space-y-6 animate-fadeIn relative">
        {/* TOP-RIGHT CLOSE ICON BUTTON */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-2 rounded-lg hover:bg-slate-800 transition"
          aria-label="Close modal"
        >
          ✕
        </button>

        {/* HEADER */}
        <div className="text-center pr-6">
          <h2 className="text-2xl font-bold text-white tracking-tight">
            {paymentState === "success" ? "Access Activated!" : "Pay with M-Pesa"}
          </h2>
          {paymentState !== "success" && (
            <p className="text-slate-400 text-sm mt-1">
              <span className="text-slate-200 font-medium">{pkg.name}</span> —{" "}
              <span className="text-emerald-400 font-bold">KES {pkg.price}</span>
            </p>
          )}
        </div>

        {/* PHONE INPUT */}
        {paymentState === "idle" && (
          <>
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-300">
                Phone Number
              </label>
              <input
                type="tel"
                placeholder="07XXXXXXXX"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 text-white placeholder-slate-500 p-3.5 rounded-xl outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition text-sm font-medium"
              />
            </div>

            {errorMessage && (
              <p className="text-rose-400 text-xs font-medium bg-rose-500/10 border border-rose-500/20 p-3 rounded-xl">
                {errorMessage}
              </p>
            )}

            {/* DEV-ONLY MOCK SUCCESS TRIGGER */}
            <button
              type="button"
              onClick={() => {
                setWifiDetails({
                  ssid: "Kitengela_Connect_5G",
                  password: "KiteNet#2026",
                  duration: pkg.name,
                });
                setPaymentState("success");
              }}
              className="w-full py-2 bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-medium rounded-xl hover:bg-amber-500/20 transition"
            >
              🧪 Dev Test: Force Show Success Screen (Free)
            </button>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 transition text-sm font-medium"
              >
                Cancel
              </button>

              <button
                onClick={handlePayment}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-lg shadow-emerald-600/20 transition text-sm"
              >
                Pay Now
              </button>
            </div>
          </>
        )}

        {/* INITIATING */}
        {paymentState === "initiating" && (
          <div className="flex flex-col items-center space-y-4 py-4">
            <div className="h-10 w-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
            <p className="font-semibold text-white text-sm">Sending STK Push...</p>

            <button
              onClick={onClose}
              className="text-xs text-slate-400 hover:text-white transition pt-2"
            >
              Cancel
            </button>
          </div>
        )}

        {/* PENDING */}
        {paymentState === "pending" && (
          <div className="flex flex-col items-center space-y-4 text-center py-2">
            <div className="text-4xl animate-bounce">📲</div>
            <p className="font-semibold text-lg text-white">Check your phone</p>
            <p className="text-sm text-slate-400">
              Enter your M-Pesa PIN to complete payment.
            </p>
            <div className="flex items-center space-x-2 text-xs text-slate-500">
              <div className="h-2 w-2 bg-emerald-500 rounded-full animate-ping" />
              <span>Waiting for confirmation...</span>
            </div>

            <button
              onClick={onClose}
              className="mt-4 text-xs font-medium text-slate-400 hover:text-white px-4 py-2 rounded-lg bg-slate-800 transition"
            >
              Close
            </button>
          </div>
        )}

        {/* SUCCESS STATE: SHOW WI-FI CREDENTIALS */}
        {paymentState === "success" && wifiDetails && (
          <div className="space-y-5 py-2">
            <div className="flex flex-col items-center text-center space-y-2">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 text-2xl font-bold shadow-lg shadow-emerald-500/10">
                ✓
              </div>
              <p className="text-xs text-emerald-400 font-medium">
                Payment Received Successfully
              </p>
            </div>

            {/* Credential Card */}
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-4">
              <div className="flex justify-between items-center border-b border-slate-800/80 pb-3">
                <span className="text-xs text-slate-400 font-medium">
                  Wi-Fi Network
                </span>
                <span className="text-sm font-bold text-white">
                  {wifiDetails.ssid}
                </span>
              </div>

              <div>
                <span className="block text-xs text-slate-400 font-medium mb-1.5">
                  Password
                </span>
                <div className="flex items-center justify-between bg-slate-900 border border-slate-700/80 rounded-xl px-4 py-3">
                  <code className="text-lg font-mono font-bold text-emerald-400 tracking-wider">
                    {wifiDetails.password}
                  </code>
                  <button
                    onClick={() => copyToClipboard(wifiDetails.password)}
                    className="px-3 py-1.5 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/30 text-xs font-semibold rounded-lg transition"
                  >
                    {copied ? "Copied! ✓" : "Copy"}
                  </button>
                </div>
              </div>

              <div className="flex justify-between items-center text-[11px] text-slate-500 pt-1">
                <span>
                  Plan:{" "}
                  <strong className="text-slate-300">
                    {wifiDetails.duration}
                  </strong>
                </span>
                <span>
                  Status: <strong className="text-emerald-400">Active</strong>
                </span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-lg shadow-emerald-600/25 transition text-sm"
            >
              Done & Connect
            </button>
          </div>
        )}

        {/* ERROR */}
        {paymentState === "error" && (
          <div className="flex flex-col items-center space-y-4 text-center py-2">
            <div className="text-4xl text-rose-500">✖</div>
            <p className="font-semibold text-lg text-white">Payment Failed</p>
            <p className="text-sm text-rose-400 bg-rose-500/10 border border-rose-500/20 p-3 rounded-xl w-full">
              {errorMessage}
            </p>

            <div className="flex justify-center gap-3 w-full mt-4">
              <button
                onClick={onClose}
                className="flex-1 py-2.5 border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 text-xs font-semibold rounded-xl transition"
              >
                Close
              </button>

              <button
                onClick={() => setPaymentState("idle")}
                className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-xl transition"
              >
                Try Again
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}