"use client";

import { useState } from "react";
import Link from "next/link";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-gradient-to-r from-blue-600 to-green-500 shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link href="/packages" className="text-white text-xl font-bold">
          Kitengela Connect
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-6 text-white font-medium items-center">
          <Link href="/packages">Packages</Link>
          <Link href="/about">About</Link>
          <Link href="/contact">Contact</Link>
          <Link
            href="/login"
            className="bg-white text-blue-600 px-4 py-1 rounded-md font-semibold hover:bg-gray-100"
          >
            Login
          </Link>
        </div>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden text-white"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-7 w-7"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            {open ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {open && (
        <div className="md:hidden bg-white shadow-md">
          <div className="flex flex-col px-4 py-4 space-y-4 font-medium">
            <Link
              href="/packages"
              onClick={() => setOpen(false)}
              className="text-gray-800"
            >
              Packages
            </Link>
            <Link
              href="/about"
              onClick={() => setOpen(false)}
              className="text-gray-800"
            >
              About
            </Link>
            <Link
              href="/contact"
              onClick={() => setOpen(false)}
              className="text-gray-800"
            >
              Contact
            </Link>
            <Link
              href="/login"
              onClick={() => setOpen(false)}
              className="bg-blue-600 text-white text-center py-2 rounded-md font-semibold"
            >
              Login
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
