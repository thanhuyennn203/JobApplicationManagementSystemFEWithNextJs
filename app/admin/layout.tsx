"use client";

import RecruiterSidebar from "@/components/recruiter/RecruiterSidebar";
import "@/styles/recruiter/layout.css";
import { usePathname } from "next/navigation";
import Link from "next/link";
import NotificationBell from "@/components/notification/NotificationBell";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="recruiter-layout">
      <RecruiterSidebar />

      <div className="container" style={{ width: "100%" }}>
        <div className="admin-notification-bar">
          <NotificationBell variant="light" />
        </div>

        {/* Tabs */}
        {/* <div className="tabs">
          <Link
            href="/admin"
            className={`tab ${pathname === "/admin" ? "active" : ""}`}
          >
            Home
          </Link>

          <Link
            href="/admin/company"
            className={`tab ${
              pathname.startsWith("/admin/company") ? "active" : ""
            }`}
          >
            Company
          </Link>

          <Link
            href="/admin/user"
            className={`tab ${
              pathname.startsWith("/admin/user") ? "active" : ""
            }`}
          >
            User
          </Link>

          <Link
            href="/admin/job"
            className={`tab ${
              pathname.startsWith("/admin/job") ? "active" : ""
            }`}
          >
            Job
          </Link>

          <Link
            href="/admin/application"
            className={`tab ${
              pathname.startsWith("/admin/application") ? "active" : ""
            }`}
          >
            Application
          </Link>
        </div> */}

        {/* Content */}
        <main className="recruiter-content">{children}</main>
      </div>
    </div>
  );
}
