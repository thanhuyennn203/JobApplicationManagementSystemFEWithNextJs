"use client";

import { useState } from "react";
import Link from "next/link";

const navLinks = [
  { label: "About Us", href: "/" },
  { label: "Services", href: "/services" },
  { label: "Pricing", href: "/pricing", active: true },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-1">
            <span className="text-2xl font-black text-[#1a1a1a] tracking-tight">
              top<span className="text-[#00b14f]">cv</span>
              <span className="text-[#00b14f] text-xs align-super">®</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-7">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className={`text-sm font-medium transition-colors ${
                  link.active
                    ? "text-[#00b14f] font-semibold"
                    : "text-gray-600 hover:text-[#00b14f]"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="hidden md:flex items-center gap-3">
            {/* Language */}
            {/* <button className="flex items-center gap-1.5 px-2 py-1 rounded-full border border-gray-200 text-sm text-gray-600 hover:border-gray-300 transition">
              <span className="text-base">🇻🇳</span>
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button> */}

            {/* Consulting */}
            <button className="flex items-center gap-2 text-sm text-[#00b14f] font-semibold hover:text-[#009640] transition">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              Recruitment Consulting
            </button>

            {/* CTA */}
            <Link
              href="/register"
              className="bg-[#00b14f] hover:bg-[#009640] text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
            >
              Post Jobs & Find CVs
            </Link>

            {/* Candidate */}
            <Link
              href="/candidate"
              className="hover:bg-[#009640] text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
            >
              Find & Apply jobs
            </Link>
            
          </div>
          

          {/* Mobile menu toggle */}
          <button
            className="md:hidden p-2 text-gray-600"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={mobileOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 pb-4">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className={`block py-2.5 text-sm font-medium ${link.active ? "text-[#00b14f]" : "text-gray-600"}`}
            >
              {link.label}
            </Link>
          ))}
          <div className="mt-3 flex flex-col gap-2">
            <button className="text-sm text-[#00b14f] font-semibold text-left">Recruitment Consulting</button>
            <Link href="#" className="bg-[#00b14f] text-white text-sm font-semibold px-4 py-2 rounded-lg text-center">Post Jobs & Find CVs</Link>
          </div>
        </div>
      )}
    </header>
  );
}