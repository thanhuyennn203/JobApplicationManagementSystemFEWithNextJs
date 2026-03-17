"use client";

import "@/styles/candidate/Header.css";
import { useRouter } from "next/navigation";
import Link from "next/link";
import ProfileDropdown from "./profile/ProfileDropdown";
import { useAuth } from "@/context/AuthContext";

export default function CandidateHeader() {
  const router = useRouter();
  const auth = useAuth();

  const role = auth?.user?.roles?.[0];
  console.log("role now: ", role);

  return (
    <header className="header">
      <div className="header__container">

        {/* Logo */}
        <div className="header__left">
          <Link href="/">
            <img
              src="/topcv-logo.png"
              alt="TopCV"
              className="header__logo"
            />
          </Link>
        </div>

        {/* Navigation */}
        <nav className="header__nav">
          <Link href="/candidate/jobs" className="nav-item">
            Việc làm
          </Link>

          <Link href="/cv-builder" className="nav-item">
            Tạo CV
          </Link>

          <Link href="/tools" className="nav-item">
            Công cụ
          </Link>

          <Link href="/career-guide" className="nav-item">
            Cẩm nang nghề nghiệp
          </Link>

          <Link href="/pro" className="nav-item nav-item--pro">
            TopCV <span className="pro-badge">Pro</span>
          </Link>
        </nav>

        {/* Right Section */}
        <div className="header__right">
          {/* Candidate */}

          {!role && (
            <>
              <button
                className="btn btn-outline"
                onClick={() => router.push("/candidate/register")}
              >
                Đăng ký
              </button>

              <button
                className="btn btn-primary"
                onClick={() => router.push("/candidate/login")}
              >
                Đăng nhập
              </button>

              <button
                className="btn btn-gray"
                onClick={() => router.push("/recruiter/register")}
              >
                Đăng tuyển & tìm hồ sơ
              </button>
            </>

          )}

          {/* Guest */}
          {role && (
            <>
              <button className="icon-btn">
                <i className="fa-regular fa-bell"></i>
              </button>

              <button className="icon-btn">
                <i className="fa-regular fa-comment-dots"></i>
              </button>

              <ProfileDropdown />

              <div className="recruiter-link">
                <span>Bạn là nhà tuyển dụng?</span>
                <button
                  className="btn-link"
                  onClick={() => router.push("/landing")}
                >
                  Đăng tuyển ngay »
                </button>
              </div>
            </>
          )}



        </div>
      </div>
    </header>
  );
}



