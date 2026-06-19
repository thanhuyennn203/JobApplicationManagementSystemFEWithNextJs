"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { X, Tag, Sparkles, Loader2, ExternalLink, PackageX } from "lucide-react";
import { PackageBenefit } from "@/types/package";

// ─── Types ──────────────────────────────────────────────────────────────────

export interface CompanyPackageData {
    companyId: number;
    packageId: number;
    packageCode: string;
    packageName: string;
    categoryCode: string;
    startDate: string;
    endDate: string;
    status: "ACTIVE" | "PENDING" | "EXPIRED";
    id: number;
    // NOTE: not part of the original type you shared. The card needs a couple
    // of small benefit "tags" to render (per your spec: "show code + small
    // benefit tags, +N if more"). If your /company-packages endpoint doesn't
    // return this, either (a) extend it to include a thin benefits array, or
    // (b) fetch /package/{packageId} per card. Left optional so the component
    // degrades gracefully (just hides the tag row) if it's missing.
    benefits?: PackageBenefit[];
}

interface PromoteJobModalProps {
    open: boolean;
    onClose: () => void;
    companyId: number;
    jobId: number;
    onPromoted?: () => void; // called after a successful promote, before close
}

// ─── Service calls (adjust import paths to match your project) ────────────
// Expected to live in e.g. "@/services/companyPackageService" and
// "@/services/topJobService" respectively.
import { getActivePackages } from "@/services/jobs/packageService";
import { useToast } from "../notification/ToastProvider";
import { promoteJob } from "@/services/jobs/jobs.service";
// ─── Helpers ────────────────────────────────────────────────────────────────

function formatDate(value: string) {
    const d = new Date(value);
    if (isNaN(d.getTime())) return value;
    return d.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
}

function StatusPill({ status }: { status: CompanyPackageData["status"] }) {
    const map: Record<CompanyPackageData["status"], string> = {
        ACTIVE: "bg-[#eafaf1] text-[#00b14f]",
        PENDING: "bg-amber-50 text-amber-600",
        EXPIRED: "bg-gray-100 text-gray-400",
    };
    return (
        <span
            className={`text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full ${map[status]}`}
        >
            {status}
        </span>
    );
}

// ─── Main component ────────────────────────────────────────────────────────

export default function PromoteJobModal({
    open,
    onClose,
    companyId,
    jobId,
    onPromoted,
}: PromoteJobModalProps) {
    const router = useRouter();
    const toast = useToast();

    const [packages, setPackages] = useState<CompanyPackageData[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [promotingId, setPromotingId] = useState<number | null>(null);

    useEffect(() => {
        if (!open) return;

        let cancelled = false;
        setLoading(true);
        setError(null);

        getActivePackages(companyId)
            .then((data: CompanyPackageData[]) => {
                if (cancelled) return;
                // Only usable packages make sense to show here.
                setPackages(data.filter((p) => p.status === "ACTIVE"));
            })
            .catch(() => {
                if (cancelled) return;
                setError("Failed to load your packages.");
            })
            .finally(() => {
                if (!cancelled) setLoading(false);
            });

        return () => {
            cancelled = true;
        };
    }, [open, companyId]);

    if (!open) return null;

    const handleUse = async (companyPackageId: number) => {
        setPromotingId(companyPackageId);
        try {
            await promoteJob(companyId, jobId, companyPackageId);
            toast.success("Job promoted successfully.");
            onPromoted?.();
            onClose();
        } catch {
            toast.error("Failed to promote job.");
        } finally {
            setPromotingId(null);
        }
    };

    const goToDetail = (packageId: number) => {
        router.push(`/package/${packageId}`);
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-3xl shadow-xl w-full max-w-lg max-h-[85vh] overflow-hidden flex flex-col"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <span className="w-9 h-9 rounded-xl bg-amber-50 flex items-center justify-center">
                            <Sparkles size={18} className="text-amber-500" />
                        </span>
                        <div>
                            <h2 className="font-semibold text-sm text-gray-900">Promote this job</h2>
                            <p className="text-xs text-gray-400">Pick a package to boost visibility</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-700 transition-colors"
                        aria-label="Close"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto px-6 py-5">
                    {loading && (
                        <div className="flex flex-col items-center justify-center py-12 text-gray-400 gap-2">
                            <Loader2 size={22} className="animate-spin" />
                            <p className="text-xs">Loading your packages…</p>
                        </div>
                    )}

                    {!loading && error && (
                        <div className="flex flex-col items-center justify-center py-12 text-center gap-2">
                            <PackageX size={28} className="text-gray-300" />
                            <p className="text-sm text-gray-500">{error}</p>
                        </div>
                    )}

                    {!loading && !error && packages.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-12 text-center gap-2">
                            <PackageX size={28} className="text-gray-300" />
                            <p className="text-sm text-gray-500">No active packages available.</p>
                            <p className="text-xs text-gray-400">Purchase a package to promote this job.</p>
                        </div>
                    )}

                    {!loading && !error && packages.length > 0 && (
                        <ul className="flex flex-col gap-3">
                            {packages.map((pkg) => {
                                const benefits = (pkg.benefits || []).filter((b) => b.enabled);
                                const visibleBenefits = benefits.slice(0, 3);
                                const extraCount = benefits.length - visibleBenefits.length;
                                const isPromoting = promotingId === pkg.id;

                                return (
                                    <li
                                        key={pkg.id}
                                        onClick={() => goToDetail(pkg.packageId)}
                                        className="group cursor-pointer border border-gray-100 hover:border-[#00b14f]/40 hover:bg-[#fafffc] rounded-2xl p-4 transition-colors"
                                    >
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    {/* Code styled like a coupon code */}
                                                    <span className="inline-flex items-center gap-1.5 bg-[#eafaf1] text-[#00b14f] text-xs font-bold tracking-wide px-2.5 py-1 rounded-lg">
                                                        <Tag size={12} />
                                                        {pkg.packageCode}
                                                    </span>
                                                    <StatusPill status={pkg.status} />
                                                </div>

                                                <p className="text-sm font-semibold text-gray-900 mt-2">
                                                    {pkg.packageName}
                                                </p>

                                                <p className="text-xs text-gray-400 mt-0.5">
                                                    Valid until {formatDate(pkg.endDate)}
                                                </p>

                                                {/* Benefit tags */}
                                                {(visibleBenefits.length > 0 || extraCount > 0) && (
                                                    <div className="flex flex-wrap gap-1.5 mt-3">
                                                        {visibleBenefits.map((b) => (
                                                            <span
                                                                key={b.code}
                                                                className="text-[11px] font-medium text-gray-600 bg-gray-50 border border-gray-100 px-2 py-0.5 rounded-full"
                                                            >
                                                                {b.title}
                                                            </span>
                                                        ))}
                                                        {extraCount > 0 && (
                                                            <span className="text-[11px] font-medium text-gray-400 bg-gray-50 border border-gray-100 px-2 py-0.5 rounded-full">
                                                                +{extraCount}
                                                            </span>
                                                        )}
                                                    </div>
                                                )}

                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        goToDetail(pkg.packageId);
                                                    }}
                                                    className="inline-flex items-center gap-1 text-[11px] text-gray-400 hover:text-[#00b14f] mt-3 font-medium transition-colors"
                                                >
                                                    View detail
                                                    <ExternalLink size={11} />
                                                </button>
                                            </div>

                                            {/* Use button */}
                                            <button
                                                disabled={promotingId !== null}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleUse(pkg.id);
                                                }}
                                                className="flex-shrink-0 bg-[#00b14f] hover:bg-[#009245] disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-semibold px-4 py-2 rounded-xl transition-colors flex items-center gap-1.5"
                                            >
                                                {isPromoting && <Loader2 size={13} className="animate-spin" />}
                                                {isPromoting ? "Using…" : "Use"}
                                            </button>
                                        </div>
                                    </li>
                                );
                            })}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
}