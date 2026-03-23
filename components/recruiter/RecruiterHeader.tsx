"use client";

import { useState, useRef, useEffect } from "react";
import "@/styles/recruiter/RecruiterHeader.css";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function RecruiterHeader() {

  const pathname = usePathname();
  const auth = useAuth();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleLogout = () => {
    auth?.logout();
    router.push("/recruiter/login")
    // call logout from context
  };

  // close dropdown when click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className="recruiter-header">

      {/* Left */}
      <div className="header-left">
        {/* <i className="fa-solid fa-bars menu-icon"></i> */}

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
          href="/recruiter/jobs"
          className={`nav-pill ${pathname === "/recruiter/jobs" ? "active" : ""}`}
        >
          <i className="fa-solid fa-briefcase"></i>
          Posting Job
        </Link>

        <Link
          href="/recruiter/application"
          className={`nav-pill ${pathname === "/recruiter/application" ? "active" : ""}`}
        >
          <i className="fa-solid fa-file-lines"></i>
          Applications
        </Link>

        <Link
          href="/recruiter/search"
          className={`nav-pill ${pathname === "/recruiter/search" ? "active" : ""}`}
        >
          <i className="fa-solid fa-magnifying-glass"></i>
          Search
        </Link>

        <Link
          href="/recruiter/company"
          className={`nav-pill ${pathname === "/recruiter/company" ? "active" : ""}`}
        >
          <i className="fa-solid fa-building"></i>
          About company
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

        {/* Avatar */}
        <div
          className="avatar"
          onClick={() => setOpen(!open)}
          ref={dropdownRef}
        >
          <img src={"/images/company-logo-default.jpg"} />
          <i className="fa-solid fa-chevron-down"></i>

          {open && (
            <div className="avatar-dropdown">

              <div className="dropdown-item" onClick={()=> router.push("/recruiter/company/verify")}>
                <i className="fa-regular fa-circle-question"></i>
                <p>Verify Company</p>
              </div>

              <div
                className="dropdown-item logout"
                onClick={handleLogout}
              >
                <i className="fa-solid fa-right-from-bracket"></i>
                <p>Logout</p>
              </div>

            </div>
          )}

        </div>

      </div>

    </header>
  );
}