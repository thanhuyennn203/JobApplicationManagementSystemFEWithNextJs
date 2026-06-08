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

      <div className="container" >
        <div className="admin-notification-bar">
          <NotificationBell variant="light" />
        </div>
        {/* Content */}
        <main className="recruiter-content">{children}</main>
      </div>
    </div>
  );
}
