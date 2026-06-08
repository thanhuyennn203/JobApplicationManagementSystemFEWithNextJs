"use client";

import { useEffect, useState } from "react";
import { fetchPackages, Package } from "@/services/jobs/packageService";

// Map benefit codes to display labels + icons
// const BENEFIT_META: Record<string, { label: string; icon: string }> = {
//   BEST_JOB_BOX: { label: "Featured in Best Jobs Box", icon: "⭐" },
//   PRIORITY_ALL_JOB_LIST: { label: "Priority in all job listing pages", icon: "🚀" },
//   TOP_GOLDEN_HOUR: { label: "Top Golden Hour Boost", icon: "⏰" },
//   AI_CV_RECOMMENDATION: { label: "AI-powered CV recommendation", icon: "🤖" },
//   JOB_MATCH_NOTIFICATION: { label: "Job match notification to candidates", icon: "🔔" },
//   SERVICE_GUARANTEE: { label: "Service guarantee with priority benefits", icon: "🛡️" },
//   REPUTATION_POINTS: { label: "Reputation Points", icon: "💎" },
//   IMPRESSION_PRIORITY: { label: "Impression Priority boost", icon: "📈" },
//   HIGHLIGHT_LEVEL: { label: "Highlighted listing", icon: "✨" },
//   RELATED_JOB_PRIORITY: { label: "Priority in related job display", icon: "🎯" },
// };

// Render a human-friendly value for specific benefits
// function benefitLabel(code: string, value: string): string {
//   if (code === "TOP_GOLDEN_HOUR") return `${value}× Golden Hour Boost`;
//   if (code === "IMPRESSION_PRIORITY") return `${value}× Impression Priority`;
//   if (code === "REPUTATION_POINTS") return `+${value} Reputation Points`;
//   if (code === "HIGHLIGHT_LEVEL") return `${value.replace("_", " ")} Highlight`;
//   return BENEFIT_META[code]?.label ?? code;
// }

// const HIGHLIGHT_COLORS: Record<string, string> = {
//   YELLOW: "bg-yellow-100 text-yellow-800 border-yellow-300",
//   GREEN: "bg-green-100 text-green-800 border-green-300",
//   GREEN_PLUS: "bg-emerald-100 text-emerald-800 border-emerald-300",
// };

// Determine card accent style
function cardAccent(pkg: Package) {
  if (pkg.code === "TOP_MAX_PLUS") {
    return {
      border: "border-[#00b14f]",
      badge: "bg-[#00b14f] text-white",
      button: "bg-[#00b14f] hover:bg-[#009640] text-white",
      header: "bg-[#003d1f] text-white",
      ring: "ring-2 ring-[#00b14f]",
      popular: true,
    };
  }
  if (pkg.code === "TOP_MAX") {
    return {
      border: "border-gray-800",
      badge: "bg-gray-800 text-white",
      button: "bg-white hover:bg-gray-50 text-gray-800 border border-gray-300",
      header: "bg-gray-900 text-white",
      ring: "",
      popular: false,
    };
  }
  return {
    border: "border-orange-400",
    badge: "bg-orange-500 text-white",
    button: "bg-white hover:bg-gray-50 text-gray-800 border border-gray-300",
    header: "bg-orange-600 text-white",
    ring: "",
    popular: false,
  };
}

function PackageCard({ pkg }: { pkg: Package }) {
  const accent = cardAccent(pkg);
  const enabledBenefits = pkg.benefits.filter((b) => b.enabled);
console.log(pkg);
  return (
    <div
      className={`relative flex flex-col rounded-2xl border ${accent.border} ${accent.ring} overflow-hidden shadow-lg transition-transform hover:-translate-y-1 hover:shadow-xl bg-white`}
    >
      {accent.popular && (
        <div className="absolute top-3 right-3 z-10">
          <span className="bg-[#00b14f] text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide shadow">
            Most Popular
          </span>
        </div>
      )}

      {/* Card Header */}
      <div className={`${accent.header} px-6 py-5`}>
        <div className="flex items-center gap-2 mb-3">
          <span className="text-sm font-bold tracking-widest uppercase">{pkg.name}</span>
          {pkg.vip && (
            <span className="bg-white/20 text-white text-[10px] font-bold px-2 py-0.5 rounded border border-white/30 uppercase">
              VIP
            </span>
          )}
        </div>
        <div className="flex items-end gap-1">
          <span className="text-3xl font-black">
            {pkg.price.toLocaleString("vi-VN")}
          </span>
          <span className="text-sm font-semibold mb-1 opacity-80">dollars</span>
        </div>
        <p className="text-xs opacity-60 mt-1">* Price excludes VAT</p>
        <p className="text-xs opacity-70 mt-0.5">
          {pkg.displayDays}-day display · {pkg.serviceDays}-day service
        </p>
      </div>

      {/* CTA */}
      <div className="px-6 pt-5 pb-3">
        <button
          className={`w-full py-2.5 rounded-xl text-sm font-semibold transition-colors ${accent.button}`}
        >
          Contact for Consultation
        </button>
      </div>

      {/* Benefits */}
      <div className="px-6 pb-6 flex-1">
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3 mt-2">
          Special Benefits
        </p>
        <ul className="space-y-2.5">
          {enabledBenefits.map((b) => (
            <li key={b.code} className="flex items-start gap-2.5">
              <svg
                className="w-4 h-4 text-[#00b14f] shrink-0 mt-0.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span className="text-sm text-gray-700 leading-snug">
              {b.description}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function PackageCardSkeleton() {
  return (
    <div className="rounded-2xl border border-gray-200 overflow-hidden animate-pulse">
      <div className="bg-gray-200 h-36" />
      <div className="p-6 space-y-3">
        <div className="h-10 bg-gray-100 rounded-xl" />
        <div className="space-y-2 mt-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-4 bg-gray-100 rounded w-5/6" />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function TopJobsSection() {
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPackages()
      .then(setPackages)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="mb-20">
      {/* Section intro */}
      <div className="mb-2">
        <span className="text-xs font-semibold text-[#00b14f] uppercase tracking-widest">
          TOP JOBS &amp; TOP STANDARD
        </span>
      </div>
      <h2 className="text-3xl font-black text-gray-900 mb-1 border-l-4 border-[#00b14f] pl-4">
        Post a Job
      </h2>
      <p className="text-gray-500 text-sm mb-8 pl-5">
        Harness the power of technology to achieve breakthrough recruitment results for your business.
      </p>

      {/* Top Jobs label */}
      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-900">Top Jobs</h3>
        <p className="text-sm text-[#00b14f] font-medium">High-Performance Job Postings</p>
      </div>

      {/* Cards grid */}
      {error ? (
        <div className="text-center py-12 text-red-500 text-sm">
          <p>Failed to load packages: {error}</p>
          <p className="text-gray-400 mt-1">Please check the API server at localhost:9191</p>
        </div>
      ) : loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => <PackageCardSkeleton key={i} />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {packages.map((pkg) => (
            <PackageCard key={pkg.id} pkg={pkg} />
          ))}
        </div>
      )}
    </section>
  );
}