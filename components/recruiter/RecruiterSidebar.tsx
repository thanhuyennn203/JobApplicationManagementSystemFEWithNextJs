"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import "@/styles/recruiter/RecruiterSidebar.css";

export default function RecruiterSidebar() {

  const pathname = usePathname();
  const auth = useAuth();
  const user = auth?.user;

  const menu = [
    {
      name: "Dashboard",
      icon: "fa-solid fa-chart-line",
      path: "/recruiter/dashboard",
    },
    {
      name: "Jobs Posting",
      icon: "fa-solid fa-briefcase",
      path: "/recruiter/jobs",
    },
    {
      name: "Applications",
      icon: "fa-solid fa-file-lines",
      path: "/recruiter/applications",
    },
    {
      name: "Company",
      icon: "fa-solid fa-building",
      path: "/recruiter/company",
    },
  ];

  return (
    <aside className="sidebar">

      {/* User info */}
      <div className="sidebar-user">

        <img
          src={user?.avatar || "/images/default-avatar.jpg"}
          alt="avatar"
          className="sidebar-avatar"
        />

        <div className="sidebar-user-info">

          <div className="sidebar-name">
            {user?.name || "Recruiter"}
          </div>

          <div className="sidebar-email">
            {user?.email || "email@example.com"}
          </div>

        </div>

      </div>

      {/* Menu */}
      {menu.map((item) => {

        const isActive = pathname.startsWith(item.path);

        return (
          <Link
            key={item.path}
            href={item.path}
            className={`sidebar-item ${isActive ? "active" : ""}`}
          >
            <i className={item.icon}></i>
            <span className="sidebar-text">{item.name}</span>
          </Link>
        );
      })}

    </aside>
  );
}