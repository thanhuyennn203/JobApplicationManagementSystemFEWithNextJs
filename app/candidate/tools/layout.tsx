"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface ToolLayoutProps {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  children: React.ReactNode;
}

export default function ToolLayout({ icon, title, subtitle, children }: ToolLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 sm:py-12">
        <Link
          href="/tools"
          className="mb-8 inline-flex items-center gap-1.5 text-sm text-gray-400 transition hover:text-green-600"
        >
          <ArrowLeft size={15} />
          All tools
        </Link>

        <div className="mb-8 flex items-start gap-4">
          <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-green-50 text-green-600">
            {icon}
          </div>
          <div>
            <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
            <p className="mt-0.5 text-sm text-gray-500">{subtitle}</p>
          </div>
        </div>

        {children}
      </div>
    </div>
  );
}