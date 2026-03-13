"use client";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import "@/styles/candidate/ProfileDropdown.css";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function ProfileDropdown() {
  const [open, setOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const auth = useAuth();

  // close dropdown when click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
        setActiveSection(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleSection = (section: string) => {
    setActiveSection(activeSection === section ? null : section);
  };

  const logout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <div className="profile-wrapper" ref={ref}>

      {/* Avatar */}
      <img
        src="/avatar.png"
        className="avatar"
        onClick={() => setOpen(!open)}
      />

      {/* Dropdown */}
      {open && (
        <div className="dropdown">

          {/* Profile */}
          <div className="profile-header">
            <img src="/avatar.png" className="avatar-large" />
            <div>
              <p className="name">{auth?.user?.email}</p>
              <p className="verify">Tài khoản đã xác thực</p>
              <p className="email">{auth?.user?.email}</p>
            </div>
          </div>

          {/* Section 1 */}
          <div className="menu-section">
            <p
              className="menu-title"
              onClick={() => toggleSection("jobs")}
            >
              Quản lý tìm việc
              <i
                className={`fa-solid fa-chevron-down arrow ${activeSection === "jobs" ? "rotate" : ""
                  }`}
              ></i>
            </p>

            {activeSection === "jobs" && (
              <div className="menu-items">
                <Link href="/candidate/jobs/saved">
                  Việc làm đã lưu
                </Link>
                <a>Việc làm đã ứng tuyển</a>
                <a>Việc làm phù hợp với bạn</a>
                <a>Cài đặt gợi ý việc làm</a>
              </div>
            )}
          </div>

          {/* Section 2 */}
          <div className="menu-section">
            <p
              className="menu-title"
              onClick={() => toggleSection("cv")}
            >
              Quản lý CV & Cover letter
              <i
                className={`fa-solid fa-chevron-down arrow ${activeSection === "cv" ? "rotate" : ""
                  }`}
              ></i>
            </p>

            {activeSection === "cv" && (
              <div className="menu-items">
                <a>CV của tôi</a>
                <a>Cover Letter của tôi</a>
                <a>Nhà tuyển dụng muốn kết nối</a>
                <a>Nhà tuyển dụng xem hồ sơ</a>
              </div>
            )}
          </div>

          {/* Section 3 */}
          <div className="menu-section">
            <p
              className="menu-title"
              onClick={() => toggleSection("email")}
            >
              Cài đặt email & thông báo
              <i
                className={`fa-solid fa-chevron-down arrow ${activeSection === "email" ? "rotate" : ""
                  }`}
              ></i>
            </p>

            {activeSection === "email" && (
              <div className="menu-items">
                <a>Cài đặt email</a>
                <a>Thông báo hệ thống</a>
              </div>
            )}
          </div>

          {/* Section 4 */}
          <div className="menu-section">
            <p
              className="menu-title"
              onClick={() => toggleSection("security")}
            >
              Cá nhân & Bảo mật
              <i
                className={`fa-solid fa-chevron-down arrow ${activeSection === "security" ? "rotate" : ""
                  }`}
              ></i>
            </p>

            {activeSection === "security" && (
              <div className="menu-items">
                <a>Thông tin cá nhân</a>
                <a>Đổi mật khẩu</a>
              </div>
            )}
          </div>

          {/* Section 5 */}
          <div className="menu-section">
            <p
              className="menu-title"
              onClick={() => toggleSection("upgrade")}
            >
              Nâng cấp tài khoản
              <i
                className={`fa-solid fa-chevron-down arrow ${activeSection === "upgrade" ? "rotate" : ""
                  }`}
              ></i>
            </p>

            {activeSection === "upgrade" && (
              <div className="menu-items">
                <a>TopCV Pro</a>
                <a>Quyền lợi tài khoản</a>
              </div>
            )}
          </div>

          <button className="logout" onClick={logout}>
            Đăng xuất
          </button>

        </div>
      )}
    </div>
  );
}
