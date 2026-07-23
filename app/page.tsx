import Link from "next/link";
import { Zap, ShieldCheck, ArrowRight, Smartphone, CheckCircle2 } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-[calc(100vh-73px)] bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-blue-500 selection:text-white">
      {/* Hero Section */}
      <main className="px-6 py-12 max-w-xl mx-auto flex-1 flex flex-col justify-center items-center text-center">
        {/* Status Badge */}
        <div className="mb-6 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-950/60 border border-blue-800/50 text-blue-300 text-xs font-medium shadow-inner">
          <Zap className="w-3.5 h-3.5 text-blue-400" /> Instant M-Pesa Access
        </div>

        {/* Main Heading */}
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white leading-[1.15]">
          High-Speed Wi-Fi for <br />
          <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-cyan-400 bg-clip-text text-transparent">
            Kitengela Residents
          </span>
        </h1>

        <p className="mt-4 text-base sm:text-lg text-slate-400 max-w-md font-normal leading-relaxed">
          Connect seamlessly to unlimited fast internet. Pick a package, pay via M-Pesa, and get connected in seconds.
        </p>

        {/* Hero Banner Image */}
        <div className="mt-8 relative w-full rounded-2xl overflow-hidden border border-slate-800 shadow-2xl shadow-blue-950/50 group">
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent z-10 opacity-80" />
          <img
            src="https://streamwifi.co.ke/wp-content/uploads/2019/01/family-using-stream-wifi-scaled-jpg.webp"
            alt="Family enjoying fast Kitengela Connect Wi-Fi"
            className="w-full h-48 object-cover object-center transform group-hover:scale-105 transition duration-500"
          />
          <div className="absolute bottom-3 left-4 right-4 z-20 flex justify-between items-center text-xs text-slate-300">
            <span className="flex items-center gap-1 font-medium text-emerald-400">
              <CheckCircle2 className="w-4 h-4" /> 99.9% Uptime
            </span>
            <span className="text-slate-400">Low Latency Fiber</span>
          </div>
        </div>

        {/* Primary CTA Button */}
        <div className="mt-8 w-full sm:w-auto">
          <Link
            href="/packages"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-lg shadow-xl shadow-blue-600/25 hover:shadow-blue-600/40 transform hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
          >
            View Wi-Fi Packages
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>

        {/* Feature Grid */}
        <div className="mt-12 grid grid-cols-3 gap-3 w-full border-t border-slate-800/80 pt-8">
          <div className="flex flex-col items-center p-3 rounded-xl bg-slate-900/50 border border-slate-800/50">
            <Zap className="w-5 h-5 text-amber-400 mb-2" />
            <span className="text-xs font-semibold text-slate-200">Instant</span>
            <span className="text-[10px] text-slate-400 mt-0.5">STK Push</span>
          </div>
          <div className="flex flex-col items-center p-3 rounded-xl bg-slate-900/50 border border-slate-800/50">
            <ShieldCheck className="w-5 h-5 text-blue-400 mb-2" />
            <span className="text-xs font-semibold text-slate-200">Reliable</span>
            <span className="text-[10px] text-slate-400 mt-0.5">24/7 Speeds</span>
          </div>
          <div className="flex flex-col items-center p-3 rounded-xl bg-slate-900/50 border border-slate-800/50">
            <Smartphone className="w-5 h-5 text-emerald-400 mb-2" />
            <span className="text-xs font-semibold text-slate-200">Easy</span>
            <span className="text-[10px] text-slate-400 mt-0.5">One-tap Connect</span>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 text-center border-t border-slate-900 text-xs text-slate-500">
        <p>© {new Date().getFullYear()} Kitengela Connect. Powered by Fast Fiber Network.</p>
      </footer>
    </div>
  );
}