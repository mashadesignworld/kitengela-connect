"use client";

import { useState } from "react";
import Link from "next/link";
import { Zap, ShieldCheck, ArrowRight, Smartphone, Clock, Sparkles } from "lucide-react";
import MpesaModal from "@/components/MpesaModal"; // Adjust path if your modal is in another folder

export default function Home() {
  const [selectedPackage, setSelectedPackage] = useState<{
    name: string;
    price: number;
  } | null>(null);

  const [checkoutRequestID, setCheckoutRequestID] = useState<string | null>(null);

  const handleQuickPay50 = () => {
    setSelectedPackage({
      name: "24-Hour Pass",
      price: 1,
    });
  };

  return (
    <div className="min-h-[calc(100vh-73px)] bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-blue-500 selection:text-white">
      {/* Main Content */}
      <main className="px-6 py-10 max-w-xl mx-auto flex-1 flex flex-col justify-center items-center text-center">
        
        {/* Status Badge */}
        <div className="mb-4 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-950/60 border border-blue-800/50 text-blue-300 text-xs font-medium shadow-inner">
          <Zap className="w-3.5 h-3.5 text-blue-400 animate-pulse" /> Instant M-Pesa Network Access
        </div>

        {/* Main Heading */}
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white leading-[1.15]">
          High-Speed Wi-Fi  <br />
          <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-cyan-400 bg-clip-text text-transparent">
            Kitengela
          </span>
        </h1>

        <p className="mt-3 text-base text-slate-400 max-w-md font-normal leading-relaxed">
          Get instant 24-hour unlimited high-speed internet access directly on your device.
        </p>

        {/* FEATURED DIRECT CTA CARD: KSH 50 / 24-HOUR PASS */}
        <div className="mt-8 w-full bg-gradient-to-b from-blue-900/40 via-slate-900/80 to-slate-950 border-2 border-blue-500/50 rounded-3xl p-6 shadow-2xl shadow-blue-600/20 relative overflow-hidden group">
          {/* Subtle Glow Background */}
          <div className="absolute -top-12 -right-12 w-32 h-32 bg-blue-500/20 rounded-full blur-2xl pointer-events-none" />
          
          {/* Header row */}
          <div className="flex justify-between items-center mb-4">
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-300 border border-blue-500/30">
              <Sparkles className="w-3.5 h-3.5 text-blue-400" /> Most Popular
            </span>
            <span className="text-xs font-medium text-slate-400 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" /> Valid 24 Hours
            </span>
          </div>

          {/* Package Info */}
          <div className="text-left mb-6">
            <h2 className="text-xl font-bold text-white">Full Day Unlimited Pass</h2>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-4xl font-extrabold text-white tracking-tight">KES 50</span>
              <span className="text-sm text-slate-400">/ 24 Hours</span>
            </div>
            <p className="text-xs text-slate-400 mt-1">Unlimited streaming, browsing, and downloads.</p>
          </div>

          {/* Trigger MpesaModal */}
          <button
            onClick={handleQuickPay50}
            className="w-full inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-lg shadow-xl shadow-blue-600/30 transform hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
          >
            Get 24hr Pass Now
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>

        {/* Secondary Link */}
        <div className="mt-4">
          <Link
            href="/packages"
            className="text-sm text-slate-400 hover:text-white underline underline-offset-4 transition-colors"
          >
            Looking for weekly or monthly plans? View all packages
          </Link>
        </div>

        {/* Feature Highlights */}
        <div className="mt-10 grid grid-cols-3 gap-3 w-full border-t border-slate-800/80 pt-8">
          <div className="flex flex-col items-center p-3 rounded-xl bg-slate-900/50 border border-slate-800/50">
            <Zap className="w-5 h-5 text-amber-400 mb-2" />
            <span className="text-xs font-semibold text-slate-200">Instant</span>
            <span className="text-[10px] text-slate-400 mt-0.5">STK Push</span>
          </div>
          <div className="flex flex-col items-center p-3 rounded-xl bg-slate-900/50 border border-slate-800/50">
            <ShieldCheck className="w-5 h-5 text-blue-400 mb-2" />
            <span className="text-xs font-semibold text-slate-200">Reliable</span>
            <span className="text-[10px] text-slate-400 mt-0.5">Fiber Speed</span>
          </div>
          <div className="flex flex-col items-center p-3 rounded-xl bg-slate-900/50 border border-slate-800/50">
            <Smartphone className="w-5 h-5 text-emerald-400 mb-2" />
            <span className="text-xs font-semibold text-slate-200">Easy</span>
            <span className="text-[10px] text-slate-400 mt-0.5">Auto Password</span>
          </div>
        </div>
      </main>

      {/* REUSED MPESA MODAL */}
      {selectedPackage && (
        <MpesaModal
          pkg={selectedPackage}
          onClose={() => setSelectedPackage(null)}
          onCheckoutCreated={(checkoutID) => {
            setCheckoutRequestID(checkoutID);
            // Optionally redirect to your polling page or handle state here:
            // router.push(`/payment-status?checkoutID=${checkoutID}`);
          }}
        />
      )}

      {/* Footer */}
      <footer className="py-6 text-center border-t border-slate-900 text-xs text-slate-500">
        <p>© {new Date().getFullYear()} Kitengela Connect. Powered by Fast Fiber Network.</p>
      </footer>
    </div>
  );
}