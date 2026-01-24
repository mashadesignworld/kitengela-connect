"use client";

import { InternetPackage } from "@/types/package";

interface MpesaModalProps {
  pkg: InternetPackage;
  onClose: () => void;
}

export default function MpesaModal({ pkg, onClose }: MpesaModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-md rounded-xl bg-white p-6">
        <h2 className="text-xl font-bold">Pay with M-Pesa</h2>

        <div className="mt-4 space-y-2">
          <p><strong>Package:</strong> {pkg.name}</p>
          <p><strong>Duration:</strong> {pkg.duration}</p>
          <p className="text-lg font-bold">KSh {pkg.price}</p>
        </div>

        <input
          type="tel"
          placeholder="07XXXXXXXX"
          className="mt-4 w-full rounded-lg border px-4 py-2"
        />

        <div className="mt-6 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 rounded-lg border py-2"
          >
            Cancel
          </button>

          <button
            className="flex-1 rounded-lg bg-green-600 py-2 font-semibold text-white hover:bg-green-700"
          >
            Pay Now
          </button>
        </div>
      </div>
    </div>
  );
}
