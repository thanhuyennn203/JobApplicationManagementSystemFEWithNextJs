"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import "@/styles/recruiter/RecruiterSidebar.css";

export default function RecruiterSidebar() {

  const pathname = usePathname();
  const router = useRouter();
  const auth = useAuth();
  const user = auth?.user;

  const menu = [
    {
      name: "Dashboard",
      icon: "fa-solid fa-chart-line",
      path: "/admin/dashboard",
    },
    {
      name: "Jobs Posting",
      icon: "fa-solid fa-briefcase",
      path: "/admin/job",
    },
    {
      name: "Applications",
      icon: "fa-solid fa-file-lines",
      path: "/admin/application",
    },
    {
      name: "Companies",
      icon: "fa-solid fa-building",
      path: "/admin/company",
    },
  ];

  const handleLogout = () => {
    auth?.logout(); // call your context logout
    router.push("/recruiter/login"); // redirect after logout
  };

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

      {/* Logout */}
      <div className="sidebar-item logout" onClick={handleLogout}>
        <i className="fa-solid fa-right-from-bracket"></i>
        <span className="sidebar-text">Logout</span>
      </div>

    </aside>
  );
}