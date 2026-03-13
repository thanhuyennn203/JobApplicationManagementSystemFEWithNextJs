"use client";

import "@/styles/recruiter/LandingHeader.css";
import { useRouter } from "next/navigation";
import Link from "next/link";
import ProfileDropdown from "./profile/ProfileDropdown";
import { useAuth } from "@/context/AuthContext";

export default function LandingHeader() {
  const router = useRouter();
  const auth = useAuth();

  const role = auth?.user?.roles?.[0];

  return (
    <header className="header">
      <div className="header__container">

        {/* Logo */}
        <div className="header__left">
          <Link href="/">
            <img src="/topcv-logo.png" alt="TopCV" className="header__logo" />
          </Link>
        </div>

        {/* Navigation */}
        <nav className="header__nav">
          <Link href="#" className="nav-item active">About</Link>
          <Link href="#" className="nav-item">Service</Link>
          <Link href="#" className="nav-item">Pricing</Link>
          <Link href="#" className="nav-item">Support</Link>
          <Link href="#" className="nav-item">Recruitment news</Link>
        </nav>

        {/* Right Section */}
        <div className="header__right">

          {/* Language
          <div className="language">
            <img src="/flags/en.png" alt="English" />
          </div> */}

          <div className="consultation">
            <i className="fa-solid fa-phone"></i>
            <span>Get recruitment consultation</span>
          </div>

          {/* Guest */}
            <>
              <button
                className="btn-login"
                onClick={() => router.push("recruiter/login")}
              >
                Login
              </button>

              <button
                className="btn-post"
                onClick={() => router.push("/recruiter/register")}
              >
                Post a job now
              </button>
            </>

        </div>
      </div>
    </header>
  );
}