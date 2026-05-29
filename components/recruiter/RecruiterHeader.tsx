"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import NotificationBell from "@/components/notification/NotificationBell";

import {
  ApplicationEmailNotificationPreference,
  updateApplicationEmailNotificationPreference,
  getApplicationEmailNotificationPreference
} from "@/services/notification/companyNotification.service";

export default function RecruiterHeader() {

  const pathname = usePathname();
  const auth = useAuth();
  const router = useRouter();

  const [open, setOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  const [emailPreference, setEmailPreference] =
    useState<ApplicationEmailNotificationPreference | null>(null);

  useEffect(() => {

    const fetchPreference = async () => {

      try {

        if (!auth?.user?.companyId) return;

        const data =
          await getApplicationEmailNotificationPreference(
            Number(auth.user.companyId)
          );

        setEmailPreference(data);
        console.log("data: ",data);
      } catch (error) {
        console.error(error);
      }

    };

    fetchPreference();

  }, [auth?.user?.companyId]);

  const navItems = [
    {
      href: "/recruiter/market",
      icon: "fa-chart-line",
      label: "Market",
    },
    {
      href: "/recruiter/jobs",
      icon: "fa-briefcase",
      label: "Jobs",
    },
    {
      href: "/recruiter/application",
      icon: "fa-file-lines",
      label: "Applications",
    },
    {
      href: "/recruiter/search",
      icon: "fa-magnifying-glass",
      label: "Search",
    },
    {
      href: "/recruiter/company",
      icon: "fa-building",
      label: "Company",
    },
  ];

  const handleLogout = () => {
    auth?.logout();
    router.push("/recruiter/login");
  };

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

  const handleUpdateEmailPreference = async (
    preference: ApplicationEmailNotificationPreference
  ) => {

    try {

      setEmailPreference(preference);

      if (!auth?.user?.companyId) {
        alert("Please login.");
        return;
      }

      await updateApplicationEmailNotificationPreference(
        Number(auth.user.companyId),
        preference
      );

    } catch (error) {
      console.error(error);
    }

  };

  return (
    <header className="sticky top-0 z-50 h-16 border-b border-slate-200 bg-white/95 backdrop-blur-md">

      <div className="mx-auto flex h-full max-w-[1600px] items-center justify-between px-6">

        {/* LEFT */}
        <div className="flex items-center gap-10">

          <Link
            href="/recruiter/jobs"
            className="flex items-center gap-2"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500 text-white font-bold">
              R
            </div>

            <div>
              <p className="text-sm font-semibold text-slate-900">
                Recruiter
              </p>

              <p className="text-xs text-slate-500">
                Hiring Dashboard
              </p>
            </div>
          </Link>

          {/* NAV */}
          <nav className="flex items-center gap-2">

            {navItems.map((item) => {

              const active = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`
                    flex items-center gap-4 rounded-xl px-4 py-2 text-base font-medium transition-all
                    ${active
                      ? "bg-slate-900 text-white shadow-md"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                    }
                  `}
                >
                  <i className={`fa-solid ${item.icon} text-sm`}></i>
                  {item.label}
                </Link>
              );
            })}

          </nav>

        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-4">

          <NotificationBell variant="dark" />

          {/* CART */}
          <button className="relative flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-100">
            <i className="fa-solid fa-cart-shopping text-sm"></i>

            <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
              0
            </span>
          </button>

          {/* AVATAR */}
          <div
            ref={dropdownRef}
            className="relative"
          >

            <button
              onClick={() => setOpen(!open)}
              className="flex items-center gap-3 rounded-full border border-slate-200 bg-white px-2 py-1.5 shadow-sm transition hover:bg-slate-50"
            >

              <img
                src="/images/company-logo-default.jpg"
                className="h-9 w-9 rounded-full object-cover"
              />

              <div className="hidden text-left md:block">
                <p className="text-sm font-semibold text-slate-800">
                  Recruiter
                </p>

                <p className="text-xs text-slate-500">
                  Company account
                </p>
              </div>

              <i className="fa-solid fa-chevron-down text-xs text-slate-500"></i>

            </button>

            {/* DROPDOWN */}
            {open && (
              <div className="absolute right-0 mt-3 w-[340px] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">

                {/* TOP */}
                <div className="border-b border-slate-100 p-4">

                  <div className="flex items-center gap-3">

                    <img
                      src="/images/company-logo-default.jpg"
                      className="h-12 w-12 rounded-full"
                    />

                    <div>
                      <p className="font-semibold text-slate-800">
                        Recruiter Account
                      </p>

                      <p className="text-sm text-slate-500">
                        Manage your hiring activity
                      </p>
                    </div>

                  </div>

                </div>

                {/* MENU */}
                <div className="p-2">

                  <button
                    onClick={() => router.push("/recruiter/company/verify")}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm text-slate-700 transition hover:bg-slate-100"
                  >
                    <i className="fa-regular fa-circle-check"></i>
                    Verify Company
                  </button>

                  <button
                    onClick={() => router.push("/recruiter/account")}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm text-slate-700 transition hover:bg-slate-100"
                  >
                    <i className="fa-regular fa-user"></i>
                    Account Settings
                  </button>

                </div>

                {/* EMAIL SETTINGS */}
                <div className="border-t border-slate-100 p-4">

                  <p className="mb-4 text-xs font-bold uppercase tracking-wider text-slate-400">
                    Email Notifications
                  </p>

                  <div className="space-y-3">

                    {/* DAILY */}
                    <label className="flex cursor-pointer items-start justify-between rounded-xl border border-slate-200 p-3 transition hover:border-slate-300 hover:bg-slate-50">

                      <div>
                        <p className="text-sm font-semibold text-slate-800">
                          Daily at 9:00 AM
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          Receive daily hiring summary email
                        </p>
                      </div>

                      <input
                        type="radio"
                        checked={
                          emailPreference ===
                          ApplicationEmailNotificationPreference.DAILY
                        }
                        onChange={() =>
                          handleUpdateEmailPreference(
                            ApplicationEmailNotificationPreference.DAILY
                          )
                        }
                        className="mt-1 h-4 w-4"
                      />

                    </label>

                    {/* EVERY */}
                    <label className="flex cursor-pointer items-start justify-between rounded-xl border border-slate-200 p-3 transition hover:border-slate-300 hover:bg-slate-50">

                      <div>
                        <p className="text-sm font-semibold text-slate-800">
                          Each applicant
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          Get instant email when someone applies
                        </p>
                      </div>

                      <input
                        type="radio"
                        checked={
                          emailPreference ===
                          ApplicationEmailNotificationPreference.EACH_APPLICATION
                        }
                        onChange={() =>
                          handleUpdateEmailPreference(
                            ApplicationEmailNotificationPreference.EACH_APPLICATION
                          )
                        }
                        className="mt-1 h-4 w-4"
                      />

                    </label>

                    {/* NONE */}
                    <label className="flex cursor-pointer items-start justify-between rounded-xl border border-slate-200 p-3 transition hover:border-slate-300 hover:bg-slate-50">

                      <div>
                        <p className="text-sm font-semibold text-slate-800">
                          No email
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          Disable all application emails
                        </p>
                      </div>

                      <input
                        type="radio"
                        checked={
                          emailPreference ===
                          ApplicationEmailNotificationPreference.NONE
                        }
                        onChange={() =>
                          handleUpdateEmailPreference(
                            ApplicationEmailNotificationPreference.NONE
                          )
                        }
                        className="mt-1 h-4 w-4"
                      />

                    </label>

                  </div>

                </div>

                {/* LOGOUT */}
                <div className="border-t border-slate-100 p-2">

                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-red-500 transition hover:bg-red-50"
                  >
                    <i className="fa-solid fa-right-from-bracket"></i>
                    Logout
                  </button>

                </div>

              </div>
            )}

          </div>

        </div>

      </div>

    </header>
  );
}