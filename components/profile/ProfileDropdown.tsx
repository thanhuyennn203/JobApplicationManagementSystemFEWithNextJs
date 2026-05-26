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
    auth?.logout();
    router.push("/candidate/");
  };

  return (
    <div className="profile-wrapper" ref={ref}>
      {/* Avatar */}
      <div className="candidate-profile-img-box">
        <img
          src="/images/default-avatar.jpg"
          className="avatar"
          onClick={() => setOpen(!open)}
        />
      </div>

      {/* Dropdown */}
      {open && (
        <div className="profile_dropdown">

          {/* Profile */}
          <div className="profile-header">
            <img src="/avatar.png" className="avatar-large" />
            <div>
              <p className="name">{auth?.user?.email}</p>
              <p className="verify">Verified Account</p>
              <p className="email">{auth?.user?.email}</p>
            </div>
          </div>

          {/* Section 1 */}
          <div className="menu-section">
            <p
              className="menu-title"
              onClick={() => toggleSection("jobs")}
            >
              Job Management
              <i
                className={`fa-solid fa-chevron-down arrow ${
                  activeSection === "jobs" ? "rotate" : ""
                }`}
              ></i>
            </p>

            {activeSection === "jobs" && (
              <div className="menu-items">
                <Link href="/candidate/jobs/saved">
                  Saved Jobs
                </Link>
                <Link href="/candidate/jobs/applied">
                  Applied Jobs
                </Link>
                <a>Recommended Jobs</a>
                <a>Job Alerts Settings</a>
              </div>
            )}
          </div>

          {/* Section 2 */}
          <div className="menu-section">
            <p
              className="menu-title"
              onClick={() => toggleSection("cv")}
            >
              CV & Cover Letter
              <i
                className={`fa-solid fa-chevron-down arrow ${
                  activeSection === "cv" ? "rotate" : ""
                }`}
              ></i>
            </p>

            {activeSection === "cv" && (
              <div className="menu-items">
                <a>My CV</a>
                <a>My Cover Letters</a>
                <a>Employers Want to Connect</a>
                <a>Employers Viewed Profile</a>
              </div>
            )}
          </div>

          {/* Section 3 */}
          <div className="menu-section">
            <p
              className="menu-title"
              onClick={() => toggleSection("email")}
            >
              Email & Notifications
              <i
                className={`fa-solid fa-chevron-down arrow ${
                  activeSection === "email" ? "rotate" : ""
                }`}
              ></i>
            </p>

            {activeSection === "email" && (
              <div className="menu-items">
                <a>Email Settings</a>
                <a>System Notifications</a>
              </div>
            )}
          </div>

          {/* Section 4 */}
          <div className="menu-section">
            <p
              className="menu-title"
              onClick={() => toggleSection("security")}
            >
              Account & Security
              <i
                className={`fa-solid fa-chevron-down arrow ${
                  activeSection === "security" ? "rotate" : ""
                }`}
              ></i>
            </p>

            {activeSection === "security" && (
              <div className="menu-items">
                <Link href="/candidate/profile">Personal Information</Link>
                <a>Change Password</a>
              </div>
            )}
          </div>

          {/* Section 5 */}
          <div className="menu-section">
            <p
              className="menu-title"
              onClick={() => toggleSection("upgrade")}
            >
              Upgrade Account
              <i
                className={`fa-solid fa-chevron-down arrow ${
                  activeSection === "upgrade" ? "rotate" : ""
                }`}
              ></i>
            </p>

            {activeSection === "upgrade" && (
              <div className="menu-items">
                <a>TopCV Pro</a>
                <a>Account Benefits</a>
              </div>
            )}
          </div>

          <button className="logout" onClick={logout}>
            Logout
          </button>

        </div>
      )}
    </div>
  );
}
