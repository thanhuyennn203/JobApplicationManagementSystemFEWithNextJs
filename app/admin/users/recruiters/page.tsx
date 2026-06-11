"use client";

import { useEffect, useState } from "react";
import {
    Check, X, Eye, Plus, Download, Search, Filter,
    ChevronDown, Building2, FileText, FileX, AlertCircle,
    Globe, Users, MapPin, ArrowLeft, ArrowRight,
} from "lucide-react";
import {
    getAllCompanies,
    approveCompany,
    rejectCompany,
} from "@/services/companies/company.service";
import { useToast } from "@/components/notification/ToastProvider";
import { Company } from "@/types/company";
import { useRouter } from "next/navigation";

type StatusFilter = "ALL" | "PENDING" | "APPROVED" | "REJECTED";

const STATUS_FILTERS: StatusFilter[] = ["ALL", "PENDING", "APPROVED", "REJECTED"];

function initials(name?: string) {
    return (
        name
            ?.split(" ")
            .slice(-2)
            .map((w) => w[0])
            .join("")
            .toUpperCase() ?? "??"
    );
}

function StatusBadge({ status }: { status?: string }) {
    const map: Record<string, { cls: string; icon: React.ReactNode; label: string }> = {
        APPROVED: { cls: "bg-[#eaf3de] text-[#3b6d11]", icon: <Check size={11} />, label: "Approved" },
        REJECTED: { cls: "bg-[#fcebeb] text-[#a32d2d]", icon: <X size={11} />, label: "Rejected" },
        PENDING: { cls: "bg-[#faeeda] text-[#854f0b]", icon: <AlertCircle size={11} />, label: "Pending" },
    };
    const v = map[status ?? "PENDING"] ?? map["PENDING"];
    return (
        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${v.cls}`}>
            {v.icon}{v.label}
        </span>
    );
}

const PER_PAGE = 10;

export default function CompanyPage() {
    const router = useRouter();
    const toast = useToast();
    const [companies, setCompanies] = useState<Company[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");
    const [page, setPage] = useState(1);
    const [modal, setModal] = useState<Company | null>(null);
    const [rejectTarget, setRejectTarget] = useState<number | null>(null);
    const [rejectReason, setRejectReason] = useState("");

    useEffect(() => {
        getAllCompanies()
            .then((data) => setCompanies(data || []))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    const filtered = companies.filter((c) => {
        const q = search.toLowerCase();
        const matchQ =
            !q ||
            c.name?.toLowerCase().includes(q) ||
            c.industry?.toLowerCase().includes(q) ||
            c.province?.toLowerCase().includes(q);
        const matchS =
            statusFilter === "ALL" || c.verificationStatus === statusFilter;
        return matchQ && matchS;
    });

    const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
    const currentPage = Math.min(page, totalPages);
    const pageRows = filtered.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE);

    const counts = {
        total: companies.length,
        APPROVED: companies.filter((c) => c.verificationStatus === "APPROVED").length,
        PENDING: companies.filter((c) => c.verificationStatus === "PENDING").length,
        REJECTED: companies.filter((c) => c.verificationStatus === "REJECTED").length,
    };

    const handleApprove = async (id: number) => {
        try {
            await approveCompany(id);
            setCompanies((prev) =>
                prev.map((c) =>
                    c.id === id ? { ...c, verificationStatus: "APPROVED", rejectionReason: "" } : c
                )
            );
            if (modal?.id === id) setModal((m) => m ? { ...m, verificationStatus: "APPROVED", rejectionReason: "" } : m);
            toast.success("Company approved.");
        } catch {
            toast.error("Approve failed.");
        }
    };

    const handleReject = async (id: number) => {
        if (!rejectReason.trim()) return;
        try {
            await rejectCompany(id, rejectReason.trim());
            setCompanies((prev) =>
                prev.map((c) =>
                    c.id === id ? { ...c, verificationStatus: "REJECTED", rejectionReason: rejectReason.trim() } : c
                )
            );
            if (modal?.id === id)
                setModal((m) => m ? { ...m, verificationStatus: "REJECTED", rejectionReason: rejectReason.trim() } : m);
            toast.success("Company rejected.");
            setRejectTarget(null);
            setRejectReason("");
        } catch {
            toast.error("Reject failed.");
        }
    };

    return (
        <div className="flex flex-col bg-white">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                <div>
                    <h1 className="text-xl font-medium text-gray-900">Companies</h1>
                    <p className="text-sm text-gray-500 mt-0.5">Manage and verify company registrations</p>
                </div>
                <div className="flex gap-2">
                    <button className="flex items-center gap-1.5 px-3.5 py-2 bg-[#1e5538] text-white text-sm rounded-lg hover:bg-[#164228] transition-colors">
                        <Plus size={15} />Add new
                    </button>
                    <button className="flex items-center gap-1.5 px-3.5 py-2 border border-gray-200 text-sm rounded-lg text-gray-600 hover:bg-gray-50 transition-colors">
                        <Download size={15} />Export
                    </button>
                </div>
            </div>

            {/* Stats */}
            <div className="flex gap-3 px-6 py-3 border-b border-gray-100">
                {[
                    { label: "Total", value: counts.total, cls: "text-gray-900" },
                    { label: "Approved", value: counts.APPROVED, cls: "text-[#0f6e56]" },
                    { label: "Pending", value: counts.PENDING, cls: "text-[#854f0b]" },
                    { label: "Rejected", value: counts.REJECTED, cls: "text-[#a32d2d]" },
                ].map(({ label, value, cls }) => (
                    <div key={label} className="bg-gray-50 rounded-lg px-4 py-2.5 flex-1">
                        <div className="text-xs text-gray-500 mb-1">{label}</div>
                        <div className={`text-xl font-medium ${cls}`}>{value}</div>
                    </div>
                ))}
            </div>

            {/* Filters */}
            <div className="flex items-center gap-3 px-6 py-3 border-b border-gray-100">
                <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2 bg-white w-64">
                    <Search size={14} className="text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search name, industry, location…"
                        value={search}
                        onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                        className="flex-1 text-sm outline-none text-gray-900 placeholder-gray-400"
                    />
                </div>
                <div className="flex gap-1">
                    {STATUS_FILTERS.map((s) => (
                        <button
                            key={s}
                            onClick={() => { setStatusFilter(s); setPage(1); }}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${statusFilter === s
                                    ? "bg-[#1e5538] text-white"
                                    : "border border-gray-200 text-gray-600 hover:bg-gray-50"
                                }`}
                        >
                            {s === "ALL" ? "All" : s.charAt(0) + s.slice(1).toLowerCase()}
                        </button>
                    ))}
                </div>
                <span className="ml-auto text-xs text-gray-400">{filtered.length} result{filtered.length !== 1 ? "s" : ""}</span>
            </div>

            {/* Table */}
            <div className="flex-1 overflow-auto px-6">
                {loading ? (
                    <div className="py-16 text-center text-sm text-gray-400">Loading companies…</div>
                ) : pageRows.length === 0 ? (
                    <div className="py-16 text-center">
                        <Building2 size={32} className="text-gray-300 mx-auto mb-3" />
                        <p className="text-sm text-gray-400">No companies match your filters.</p>
                    </div>
                ) : (
                    <table className="w-full text-sm border-collapse">
                        <thead>
                            <tr className="border-b border-gray-100">
                                <th className="py-2.5 text-left text-xs text-gray-400 font-medium uppercase tracking-wide pr-3 w-12"></th>
                                <th className="py-2.5 text-left text-xs text-gray-400 font-medium uppercase tracking-wide pr-4">Company</th>
                                <th className="py-2.5 text-left text-xs text-gray-400 font-medium uppercase tracking-wide pr-4">Industry</th>
                                <th className="py-2.5 text-left text-xs text-gray-400 font-medium uppercase tracking-wide pr-4">Size</th>
                                <th className="py-2.5 text-left text-xs text-gray-400 font-medium uppercase tracking-wide pr-4">Status</th>
                                <th className="py-2.5 text-left text-xs text-gray-400 font-medium uppercase tracking-wide">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pageRows.map((c) => (
                                <tr key={c.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                                    <td className="py-3 pr-3">
                                        <div className="w-10 h-10 rounded-lg border border-gray-100 bg-gray-50 flex items-center justify-center text-xs font-medium text-gray-500 overflow-hidden">
                                            {c.logo_url ? (
                                                <img src={c.logo_url} alt="" className="w-full h-full object-contain" />
                                            ) : (
                                                initials(c.name)
                                            )}
                                        </div>
                                    </td>
                                    <td className="py-3 pr-4">
                                        <div className="font-medium text-gray-900 text-sm">{c.name}</div>
                                        <div className="text-xs text-gray-400 mt-0.5">
                                            {c.province}{c.ward ? ` · ${c.ward}` : ""}
                                        </div>
                                    </td>
                                    <td className="py-3 pr-4 text-gray-500">{c.industry}</td>
                                    <td className="py-3 pr-4 text-gray-500">{c.size ? `${c.size} ppl` : "—"}</td>
                                    <td className="py-3 pr-4">
                                        <StatusBadge status={c.verificationStatus} />
                                    </td>
                                    <td className="py-3">
                                        <div className="flex items-center gap-1.5">
                                            <button
                                                onClick={() => router.push(`/admin/users/recruiters/${c.id}`)}
                                                className="flex items-center gap-1 px-2.5 py-1.5 border border-gray-200 rounded-lg text-xs text-gray-600 hover:bg-gray-100 transition-colors"
                                            >
                                                <Eye size={12} />Details
                                            </button>
                                            {c.verificationStatus !== "APPROVED" && (
                                                <button
                                                    onClick={() => handleApprove(c.id!)}
                                                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs text-[#0f6e56] bg-[#e1f5ee] border border-[#9fe1cb] hover:bg-[#9fe1cb] transition-colors"
                                                >
                                                    <Check size={12} />Approve
                                                </button>
                                            )}
                                            {c.verificationStatus !== "REJECTED" && (
                                                <button
                                                    onClick={() => { setModal(c); setRejectTarget(c.id!); setRejectReason(""); }}
                                                    className="flex items-center gap-1 px-2 py-1.5 rounded-lg text-xs text-[#a32d2d] bg-[#fcebeb] border border-[#f7c1c1] hover:bg-[#f7c1c1] transition-colors"
                                                >
                                                    <X size={12} />
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center gap-1.5 px-6 py-3 border-t border-gray-100">
                    <button
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                        <ArrowLeft size={14} />
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                        <button
                            key={n}
                            onClick={() => setPage(n)}
                            className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm transition-colors ${n === currentPage
                                    ? "border border-gray-300 text-gray-900 font-medium"
                                    : "text-gray-500 hover:bg-gray-100"
                                }`}
                        >
                            {n}
                        </button>
                    ))}
                    <button
                        onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                        className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                        <ArrowRight size={14} />
                    </button>
                    <span className="ml-auto text-xs text-gray-400">Page {currentPage} of {totalPages}</span>
                </div>
            )}

            {/* Detail Modal */}
            {modal && (
                <div
                    className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4"
                    onClick={(e) => { if (e.target === e.currentTarget) { setModal(null); setRejectTarget(null); setRejectReason(""); } }}
                >
                    <div className="bg-white rounded-xl border border-gray-100 w-full max-w-lg max-h-[90vh] overflow-y-auto">
                        {/* Modal header */}
                        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                            <h2 className="text-base font-medium text-gray-900">Company details</h2>
                            <button
                                onClick={() => { setModal(null); setRejectTarget(null); setRejectReason(""); }}
                                className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-500 transition-colors"
                            >
                                <X size={16} />
                            </button>
                        </div>

                        {/* Background + logo */}
                        <div className="relative h-28 bg-[#e1f5ee] flex items-center justify-center">
                            {modal.backgroundUrl ? (
                                <img src={modal.backgroundUrl} alt="" className="w-full h-full object-cover" />
                            ) : (
                                <Building2 size={36} className="text-[#0f6e56]" />
                            )}
                            <div className="absolute -bottom-5 left-5 w-12 h-12 rounded-xl border-2 border-white bg-white flex items-center justify-center text-sm font-medium text-gray-500 overflow-hidden">
                                {modal.logo_url ? (
                                    <img src={modal.logo_url} alt="" className="w-full h-full object-contain" />
                                ) : (
                                    initials(modal.name)
                                )}
                            </div>
                        </div>

                        <div className="px-5 pt-8 pb-4">
                            {/* Name + status */}
                            <div className="flex items-start justify-between gap-3 mb-4">
                                <div>
                                    <h3 className="text-lg font-medium text-gray-900">{modal.name}</h3>
                                    <p className="text-sm text-gray-500">{modal.industry} · {modal.province}</p>
                                </div>
                                <StatusBadge status={modal.verificationStatus} />
                            </div>

                            {/* Rejection reason */}
                            {modal.verificationStatus === "REJECTED" && modal.rejectionReason && (
                                <div className="flex gap-2 bg-[#fcebeb] rounded-lg p-3 mb-4">
                                    <AlertCircle size={15} className="text-[#a32d2d] shrink-0 mt-0.5" />
                                    <p className="text-sm text-[#a32d2d] leading-relaxed">
                                        <span className="font-medium">Rejection reason:</span> {modal.rejectionReason}
                                    </p>
                                </div>
                            )}

                            {/* Detail grid */}
                            <div className="grid grid-cols-2 gap-2.5 mb-4">
                                {[
                                    { label: "Company size", value: modal.size ? `${modal.size} employees` : "N/A", icon: <Users size={13} /> },
                                    { label: "Followers", value: (modal.followerNumber ?? 0).toLocaleString(), icon: <Users size={13} /> },
                                    { label: "Location", value: [modal.province, modal.ward].filter(Boolean).join(", ") || "N/A", icon: <MapPin size={13} /> },
                                    { label: "Website", value: modal.website, isLink: true, icon: <Globe size={13} /> },
                                ].map(({ label, value, isLink, icon }) => (
                                    <div key={label} className="bg-gray-50 rounded-lg p-3">
                                        <div className="flex items-center gap-1 text-xs text-gray-400 mb-1">{icon}{label}</div>
                                        {isLink && value ? (
                                            <a href={value} target="_blank" className="text-sm font-medium text-[#0f6e56] hover:underline break-all">
                                                {value.replace("https://", "")}
                                            </a>
                                        ) : (
                                            <div className="text-sm font-medium text-gray-900">{value || "N/A"}</div>
                                        )}
                                    </div>
                                ))}
                            </div>

                            {/* Description */}
                            {modal.description && (
                                <div className="bg-gray-50 rounded-lg p-3 mb-4">
                                    <div className="text-xs text-gray-400 mb-1.5">About</div>
                                    <p className="text-sm text-gray-600 leading-relaxed">{modal.description}</p>
                                </div>
                            )}

                            {/* Certificate */}
                            <div className="border border-gray-100 rounded-lg p-3 flex items-center gap-3 mb-4">
                                {modal.certificateUrl ? (
                                    <>
                                        <div className="w-9 h-9 rounded-lg bg-[#e1f5ee] flex items-center justify-center shrink-0">
                                            <FileText size={18} className="text-[#0f6e56]" />
                                        </div>
                                        <div className="flex-1">
                                            <div className="text-sm font-medium text-gray-900">Business certificate</div>
                                            <div className="text-xs text-gray-400 mt-0.5">Verification document uploaded</div>
                                        </div>
                                        <a
                                            href={modal.certificateUrl}
                                            target="_blank"
                                            className="text-xs font-medium text-[#0f6e56] hover:underline flex items-center gap-1 shrink-0"
                                        >
                                            <Eye size={12} />View
                                        </a>
                                    </>
                                ) : (
                                    <>
                                        <div className="w-9 h-9 rounded-lg bg-[#faeeda] flex items-center justify-center shrink-0">
                                            <FileX size={18} className="text-[#854f0b]" />
                                        </div>
                                        <div>
                                            <div className="text-sm font-medium text-gray-900">No certificate uploaded</div>
                                            <div className="text-xs text-gray-400 mt-0.5">Company has not provided verification document</div>
                                        </div>
                                    </>
                                )}
                            </div>

                            {/* Inline reject form */}
                            {rejectTarget === modal.id && (
                                <div className="mb-4">
                                    <label className="text-xs text-gray-500 mb-1.5 block">Rejection reason</label>
                                    <textarea
                                        rows={3}
                                        value={rejectReason}
                                        onChange={(e) => setRejectReason(e.target.value)}
                                        placeholder="Enter reason for rejection…"
                                        className="w-full text-sm px-3 py-2 border border-gray-200 rounded-lg resize-y outline-none focus:border-gray-400 text-gray-900 bg-white"
                                    />
                                    <div className="flex gap-2 mt-2">
                                        <button
                                            onClick={() => handleReject(modal.id!)}
                                            disabled={!rejectReason.trim()}
                                            className="flex items-center gap-1.5 px-4 py-2 text-sm rounded-lg bg-[#fcebeb] text-[#a32d2d] border border-[#f7c1c1] hover:bg-[#f7c1c1] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                        >
                                            <X size={13} />Confirm rejection
                                        </button>
                                        <button
                                            onClick={() => { setRejectTarget(null); setRejectReason(""); }}
                                            className="px-3 py-2 text-sm rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Modal footer */}
                        <div className="flex justify-end gap-2 px-5 py-3 border-t border-gray-100">
                            {modal.verificationStatus !== "REJECTED" && rejectTarget !== modal.id && (
                                <button
                                    onClick={() => { setRejectTarget(modal.id!); setRejectReason(""); }}
                                    className="flex items-center gap-1.5 px-4 py-2 text-sm rounded-lg bg-[#fcebeb] text-[#a32d2d] border border-[#f7c1c1] hover:bg-[#f7c1c1] transition-colors"
                                >
                                    <X size={13} />Reject
                                </button>
                            )}
                            {modal.verificationStatus !== "APPROVED" && (
                                <button
                                    onClick={() => handleApprove(modal.id!)}
                                    className="flex items-center gap-1.5 px-4 py-2 text-sm rounded-lg bg-[#1e5538] text-white hover:bg-[#164228] transition-colors"
                                >
                                    <Check size={13} />Approve
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}