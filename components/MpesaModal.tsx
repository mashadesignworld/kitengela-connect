"use client";
import { useState } from "react";

interface WifiPackage {
  name: string;
  price: number;
}

interface MpesaModalProps {
  pkg: WifiPackage;
  onClose: () => void;
  onCheckoutCreated: (checkoutRequestID: string) => void;
}

type PaymentState = "idle" | "initiating" | "pending" | "error";

export default function MpesaModal({
  pkg,
  onClose,
  onCheckoutCreated,
}: MpesaModalProps) {
  const [phone, setPhone] = useState("");
  const [paymentState, setPaymentState] = useState<PaymentState>("idle");
  const [errorMessage, setErrorMessage] = useState("");

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

      const data = await res.json();

      if (!data.checkoutRequestID) {
        setPaymentState("error");
        setErrorMessage("Unable to initiate payment. Try again.");
        return;
      }

      onCheckoutCreated(data.checkoutRequestID);
      setPaymentState("pending");
    } catch (error) {
      console.error(error);
      setPaymentState("error");
      setErrorMessage("Payment failed. Please try again.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 space-y-6 animate-fadeIn">

        {/* HEADER */}
        <div className="text-center">
          <h2 className="text-2xl font-bold">Pay with M-Pesa</h2>
          <p className="text-gray-500 text-sm">
            {pkg.name} — KES {pkg.price}
          </p>
        </div>

        {/* PHONE INPUT */}
        {paymentState === "idle" && (
          <>
            <input
              type="tel"
              placeholder="07XXXXXXXX"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 p-3 rounded-xl outline-none transition"
            />

            {errorMessage && (
              <p className="text-red-500 text-sm">{errorMessage}</p>
            )}

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-xl border hover:bg-gray-100 transition"
              >
                Cancel
              </button>

              <button
                onClick={handlePayment}
                className="px-5 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl shadow-md transition"
              >
                Pay Now
              </button>
            </div>
          </>
        )}

        {/* INITIATING */}
        {paymentState === "initiating" && (
          <div className="flex flex-col items-center space-y-4">
            <div className="h-10 w-10 border-4 border-green-600 border-t-transparent rounded-full animate-spin" />
            <p className="font-medium">Sending STK Push...</p>
          </div>
        )}

        {/* PENDING */}
        {paymentState === "pending" && (
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="text-4xl animate-pulse">📲</div>
            <p className="font-semibold text-lg">
              Check your phone
            </p>
            <p className="text-sm text-gray-500">
              Enter your M-Pesa PIN to complete payment.
            </p>

            <button
              onClick={onClose}
              className="mt-4 text-sm text-gray-400 hover:text-gray-600 transition"
            >
              Close
            </button>
          </div>
        )}

        {/* ERROR */}
        {paymentState === "error" && (
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="text-4xl text-red-500">✖</div>
            <p className="font-semibold text-lg">Payment Failed</p>
            <p className="text-sm text-gray-500">{errorMessage}</p>

            <button
              onClick={() => setPaymentState("idle")}
              className="mt-4 px-4 py-2 bg-gray-200 rounded-xl hover:bg-gray-300 transition"
            >
              Try Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
