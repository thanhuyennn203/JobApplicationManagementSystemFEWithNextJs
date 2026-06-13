"use client";

import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import ProfileDropdown from "./profile/ProfileDropdown";
import { useAuth } from "@/context/AuthContext";
import NotificationBell from "./notification/NotificationBell";

const navLinks = [
  { href: "/candidate/jobs", label: "Jobs" },
  { href: "/candidate/cv", label: "Create CV" },
  { href: "/candidate/tools", label: "Tools" },
  { href: "/candidate/career-guide", label: "Career Resources" },
];

export default function CandidateHeader() {
  const router = useRouter();
  const pathname = usePathname();
  const auth = useAuth();

  const role = auth?.user?.roles?.[0];

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + "/");

  return (
    <header className="sticky top-0 z-50 w-full bg-white shadow-sm border-b border-gray-100">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-0 h-16">

        {/* LEFT — Logo */}
        <div className="flex items-center flex-shrink-0">
          <Link href="/" className="flex items-center gap-1.5">
            <span className="text-xl font-extrabold tracking-tight text-green-600">
              Top<span className="text-gray-900">CV</span>
            </span>
          </Link>
        </div>

        {/* CENTER NAV */}
        <nav className="hidden md:flex items-center h-full gap-3">
          {navLinks.map(({ href, label }) => {
            const active = isActive(href);
            return (
              <Link
                key={href}
                href={href}
                className={`relative flex items-center h-16 px-4 text-sm font-medium transition-colors
                  ${active
                    ? "text-green-600"
                    : "text-gray-600 hover:text-green-600"
                  }`}
              >
                {label}
                {/* Active underline indicator */}
                {active && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-green-600 rounded-t-full" />
                )}
              </Link>
            );
          })}

          {/* Pro link — special treatment */}
          <Link
            href="/pro"
            className={`relative flex items-center gap-1.5 h-16 px-4 text-sm font-medium transition-colors
              ${isActive("/pro")
                ? "text-green-600"
                : "text-gray-600 hover:text-green-600"
              }`}
          >
            TopCV
            <span className="rounded-full bg-orange-100 px-2 py-0.5 text-xs font-semibold text-orange-500">
              Pro
            </span>
            {isActive("/pro") && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-green-600 rounded-t-full" />
            )}
          </Link>
        </nav>

        {/* RIGHT */}
        <div className="flex items-center gap-2">
          {!role ? (
            <>
              <button
                onClick={() => router.push("/candidate/register")}
                className="rounded-full border border-green-600 px-4 py-1.5 text-sm font-medium text-green-600 hover:bg-green-50 transition"
              >
                Register
              </button>

              <button
                onClick={() => router.push("/candidate/login")}
                className="rounded-full bg-green-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-green-700 transition"
              >
                Login
              </button>

              <button
                onClick={() => router.push("/register")}
                className="hidden lg:flex rounded-full bg-gray-100 px-4 py-1.5 text-sm font-medium text-gray-800 hover:bg-gray-200 transition"
              >
                Post Jobs & Find Candidates
              </button>
            </>
          ) : (
            <>
              <NotificationBell variant="light" />

              <button
                className="flex items-center justify-center w-9 h-9 rounded-full text-gray-500 hover:text-green-600 hover:bg-green-50 transition"
                title="Messages"
              >
                <i className="fa-regular fa-comment-dots text-lg" />
              </button>

              <ProfileDropdown />

              <div className="hidden lg:flex items-center ml-2 pl-3 border-l border-gray-200 text-sm whitespace-nowrap">
                <span className="text-gray-400">Hiring?</span>
                <button
                  onClick={() => router.push("/")}
                  className="ml-1 font-semibold text-green-600 hover:text-green-700 transition"
                >
                  Post a job »
                </button>
              </div>
            </>
          )}
        </div>

      </div>
    </header>
  );
}