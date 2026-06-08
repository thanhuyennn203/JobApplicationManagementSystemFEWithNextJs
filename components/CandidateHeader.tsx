"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import ProfileDropdown from "./profile/ProfileDropdown";
import { useAuth } from "@/context/AuthContext";
import NotificationBell from "./notification/NotificationBell";

export default function CandidateHeader() {
  const router = useRouter();
  const auth = useAuth();

  const role = auth?.user?.roles?.[0];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-10 py-4">
        {/* LEFT */}
        <div className="flex items-center">
          {/* Logo */}
          {/*
          <Link href="/">
            <img
              src="/topcv-logo.png"
              alt="TopCV"
              className="h-9 cursor-pointer"
            />
          </Link>
          */}
        </div>

        {/* CENTER NAV */}
        <nav className="flex items-center gap-6">
          <Link
            href="/candidate/jobs"
            className="text-sm font-medium text-gray-800 hover:text-green-600 transition"
          >
            Job
          </Link>

          <Link
            href="/cv-builder"
            className="text-sm font-medium text-gray-800 hover:text-green-600 transition"
          >
            Create CV
          </Link>

          <Link
            href="/tools"
            className="text-sm font-medium text-gray-800 hover:text-green-600 transition"
          >
            Tools
          </Link>

          <Link
            href="/career-guide"
            className="text-sm font-medium text-gray-800 hover:text-green-600 transition"
          >
            Career Resources
          </Link>

          <Link
            href="/pro"
            className="flex items-center gap-2 text-sm font-medium text-gray-800 hover:text-green-600 transition"
          >
            TopCV

            <span className="rounded-full bg-orange-100 px-2 py-0.5 text-xs font-semibold text-orange-600">
              Pro
            </span>
          </Link>
        </nav>

        {/* RIGHT */}
        <div className="flex items-center gap-3">
          {!role ? (
            <>
              <button
                onClick={() => router.push("/candidate/register")}
                className="rounded-full border border-green-600 px-4 py-2 text-sm font-medium text-green-600 hover:bg-green-50 transition"
              >
                Register
              </button>

              <button
                onClick={() => router.push("/candidate/login")}
                className="rounded-full bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 transition"
              >
                Login
              </button>

              <button
                onClick={() => router.push("/register")}
                className="rounded-full bg-gray-100 px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-200 transition"
              >
                Post Jobs & Find Candidates
              </button>
            </>
          ) : (
            <>
              <NotificationBell variant="light" />

              <button className="cursor-pointer text-lg text-gray-700 hover:text-green-600 transition">
                <i className="fa-regular fa-comment-dots"></i>
              </button>

              <ProfileDropdown />

              <div className="ml-3 text-sm">
                <span className="text-gray-500">
                  Are you hiring?
                </span>

                <button
                  onClick={() => router.push("/")}
                  className="ml-1 font-semibold text-green-600 hover:text-green-700"
                >
                  Post a job now »
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}