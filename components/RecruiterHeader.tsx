"use client";

import "@/styles/recruiter/RecruiterHeader.css";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function RecruiterHeader() {

  const pathname = usePathname();

  return (
    <header className="recruiter-header">

      {/* Left */}
      <div className="header-left">
        <i className="fa-solid fa-bars menu-icon"></i>

        <Link href="/">
          <img src="/topcv-logo-white.png" className="logo" />
        </Link>
      </div>

      {/* Center Navigation */}
      <div className="header-center">

        <Link
          href="/recruiter/market"
          className={`nav-pill highlight ${pathname === "/recruiter/market" ? "active" : ""}`}
        >
          <i className="fa-solid fa-chart-line"></i>
          Market report 2026
        </Link>

        <Link
          href="/recruiter/post"
          className={`nav-pill ${pathname === "/recruiter/post" ? "active" : ""}`}
        >
          <i className="fa-solid fa-pen"></i>
          Posting Job
        </Link>

        <Link
          href="/recruiter/search"
          className={`nav-pill ${pathname === "/recruiter/search" ? "active" : ""}`}
        >
          <i className="fa-solid fa-magnifying-glass"></i>
          Search for CV
        </Link>

        <Link
          href="/recruiter/connect"
          className={`nav-pill ${pathname === "/recruiter/connect" ? "active" : ""}`}
        >
          <i className="fa-solid fa-comment-dots"></i>
          Connect
        </Link>

        <Link
          href="/recruiter/insights"
          className={`nav-pill ${pathname === "/recruiter/insights" ? "active" : ""}`}
        >
          <i className="fa-solid fa-lightbulb"></i>
          Insights
          <span className="dot"></span>
        </Link>

      </div>

      {/* Right */}
      <div className="header-right">

        <div className="icon-btn">
          <i className="fa-regular fa-bell"></i>
        </div>

        <div className="icon-btn cart">
          <i className="fa-solid fa-cart-shopping"></i>
          <span className="badge">0</span>
        </div>

        <div className="avatar">
          <img src="/default-avatar.png" />
          <i className="fa-solid fa-chevron-down"></i>
        </div>

      </div>

    </header>
  );
}