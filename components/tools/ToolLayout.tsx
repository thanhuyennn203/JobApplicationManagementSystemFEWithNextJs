"use client";

import Link from "next/link";

interface ToolLayoutProps {
  title: string;
  description: string;
  icon: string;
  children: React.ReactNode;
}

export default function ToolLayout({ title, description, icon, children }: ToolLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-3xl px-6 py-10">
        <Link
          href="/tools"
          className="mb-8 inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-green-600 transition-colors"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          All Tools
        </Link>

        <div className="mb-8 flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-3xl shadow-sm border border-gray-100">
            {icon}
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">{title}</h1>
            <p className="mt-0.5 text-sm text-gray-500">{description}</p>
          </div>
        </div>

        {children}
      </div>
    </div>
  );
}