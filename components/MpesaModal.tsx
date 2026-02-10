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

export default function MpesaModal({ pkg, onClose, onCheckoutCreated }: MpesaModalProps) {
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  if(loading) return; 
  const handlePayment = async () => {
    if (!phone) {
      alert("Please enter your phone number");
      return;
    }

    // 🔥 NORMALIZE NUMBER FOR SAFARICOM
    const normalizedPhone = phone.startsWith("0")
      ? "254" + phone.slice(1)
      : phone.startsWith("+254")
      ? phone.slice(1)
      : phone;

    try {
      setLoading(true);

      const res = await fetch("/api/mpesa/stk-push", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone: normalizedPhone,   // 👈 SEND NORMALIZED NUMBER
          amount: pkg.price,
          packageName: pkg.name,
        }),
      });

      const data = await res.json();
     if (!data.checkoutRequestID) {
  alert("Failed to initiate payment");
  return;
}

onCheckoutCreated(data.checkoutRequestID);

alert(
  data.CustomerMessage ||
    "STK Push sent. Enter your M-Pesa PIN."
);

      onClose();
    } catch (error) {
      console.error(error);
      alert("Payment failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-xl w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Pay with M-Pesa</h2>

        <input
          type="tel"
          placeholder="07XXXXXXXX"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full border p-2 rounded-lg mb-4"
        />

        <div className="flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 border rounded-lg">
            Cancel
          </button>
          <button
            onClick={handlePayment}
            disabled={loading}
            className="px-4 py-2 bg-green-600 text-white rounded-lg"
          >
            {loading ? "Processing..." : "Pay Now"}
          </button>
        </div>
      </div>
    </div>
  );
}
