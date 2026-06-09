"use client";

import AdminSidebar from "@/components/admin/AdminSideBar";
import NotificationBell from "@/components/notification/NotificationBell";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      <AdminSidebar />

      {/* Main content area */}
      <div className="flex flex-col flex-1 overflow-hidden bg-white">
        {/* Top notification bar */}
        <div className="flex items-center justify-end px-5 py-3 border-b border-gray-100">
          <NotificationBell variant="light" />
        </div>

        {/* Page content */}
        <main className="flex-1 pl-[60px] overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}