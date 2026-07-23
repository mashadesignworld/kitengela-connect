"use client";

import { useState } from "react";
import Link from "next/link";
import { Wifi, Menu, X } from "lucide-react";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="p-2 bg-blue-600 rounded-xl text-white shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform">
            <Wifi className="w-5 h-5 animate-pulse" />
          </div>
          <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
            Kitengela<span className="text-blue-500">Connect</span>
          </span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-8 text-sm font-medium text-slate-300">
          <Link href="/packages" className="hover:text-white transition-colors">
            Packages
          </Link>
          {/*<Link href="/about" className="hover:text-white transition-colors">
            About
          </Link>
          <Link href="/contact" className="hover:text-white transition-colors">
            Contact
          </Link>
          <Link
            href="/login"
            className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold shadow-md shadow-blue-600/20 transition-all"
          >
            Login
          </Link>*/}
        </div>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden p-2 text-slate-300 hover:text-white rounded-lg bg-slate-900 border border-slate-800"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Dropdown */}
      {open && (
        <div className="md:hidden bg-slate-900/95 border-b border-slate-800 px-6 py-5 space-y-4 font-medium text-slate-200">
          <Link
            href="/packages"
            onClick={() => setOpen(false)}
            className="block py-2 hover:text-blue-400 transition-colors"
          >
            Packages
          </Link>
           {/*<Link
            href="/about"
            onClick={() => setOpen(false)}
            className="block py-2 hover:text-blue-400 transition-colors"
          >
            About
          </Link>
          <Link
            href="/contact"
            onClick={() => setOpen(false)}
            className="block py-2 hover:text-blue-400 transition-colors"
          >
            Contact
          </Link>
          <Link
            href="/login"
            onClick={() => setOpen(false)}
            className="block w-full text-center py-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl shadow-lg shadow-blue-600/20"
          >
            Login
          </Link>*/}
        </div>
      )}
    </nav>
  );
}