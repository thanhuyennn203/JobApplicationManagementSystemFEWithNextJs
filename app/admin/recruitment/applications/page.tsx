"use client";

import { useEffect, useState, useMemo } from "react";
import {
    Download, Search, Eye, Check, X,
    ArrowLeft, ArrowRight, Clock, FileText, Phone,
    CalendarDays, FileX, CircleCheck, CircleX,
} from "lucide-react";
import {
    getAllApplications,
    updateApplicationStatus,
} from "@/services/application/application.service";
import { useToast } from "@/components/notification/ToastProvider";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Application {
    id?: number;
    jobId?: number;
    fullName?: string;
    email?: string;
    phone?: string;
    appliedDate?: Date;
    cvFileUrl?: string;
    letter?: string;
    status?: string;
    companyId?: number;
}

type StatusFilter = "ALL" | "PENDING" | "REVIEWING" | "ACCEPTED" | "REJECTED";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function initials(name?: string) {
    return (name ?? "??").split(" ").slice(-2).map((w) => w[0]).join("").toUpperCase();
}

const AVATAR_COLORS: [string, string][] = [
    ["#e1f5ee", "#0f6e56"],
    ["#e6f1fb", "#185fa5"],
    ["#eeedfe", "#534ab7"],
    ["#faeeda", "#854f0b"],
];
function avatarColor(id?: number): [string, string] {
    return AVATAR_COLORS[(id ?? 0) % AVATAR_COLORS.length];
}

// ─── Sub-components ───────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<string, { cls: string; icon: React.ReactNode; label: string }> = {
    PENDING: { cls: "bg-[#faeeda] text-[#854f0b]", icon: <Clock size={11} />, label: "Pending" },
    REVIEWING: { cls: "bg-[#e6f1fb] text-[#185fa5]", icon: <Eye size={11} />, label: "Reviewing" },
    ACCEPTED: { cls: "bg-[#eaf3de] text-[#3b6d11]", icon: <CircleCheck size={11} />, label: "Accepted" },
    REJECTED: { cls: "bg-[#fcebeb] text-[#a32d2d]", icon: <CircleX size={11} />, label: "Rejected" },
};

function StatusBadge({ status }: { status?: string }) {
    const v = STATUS_CONFIG[status ?? "PENDING"] ?? STATUS_CONFIG["PENDING"];
    return (
        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium ${v.cls}`}>
            {v.icon}{v.label}
        </span>
    );
}

function Avatar({ name, id, size = "sm" }: { name?: string; id?: number; size?: "sm" | "lg" }) {
    const [bg, fg] = avatarColor(id);
    const dim = size === "lg" ? "w-12 h-12 text-base" : "w-9 h-9 text-xs";
    return (
        <div className={`${dim} rounded-full flex items-center justify-center font-medium shrink-0`} style={{ background: bg, color: fg }}>
            {initials(name)}
        </div>
    );
}

// ─── Detail Drawer ────────────────────────────────────────────────────────────

function DetailDrawer({
    app,
    onClose,
    onUpdateStatus,
}: {
    app: Application;
    onClose: () => void;
    onUpdateStatus: (id: number, status: string) => Promise<void>;
}) {
    const canAct = app.status === "PENDING" || app.status === "REVIEWING";

    return (
        <div
            className="fixed inset-0 bg-black/30 z-50 flex justify-end"
            onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
            <div className="w-96 h-full bg-white border-l border-gray-100 flex flex-col shadow-xl">
                {/* Header */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                    <h2 className="text-sm font-medium text-gray-900">Application detail</h2>
                    <button
                        onClick={onClose}
                        className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-500 transition-colors"
                    >
                        <X size={15} />
                    </button>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto p-5">
                    {/* Candidate summary */}
                    <div className="flex flex-col items-center mb-5">
                        <Avatar name={app.fullName} id={app.id} size="lg" />
                        <h3 className="text-base font-medium text-gray-900 mt-2.5">{app.fullName}</h3>
                        <p className="text-sm text-gray-500 mt-0.5">{app.email}</p>
                        <div className="flex items-center gap-2 mt-3">
                            <StatusBadge status={app.status} />
                            <span className="bg-gray-50 text-gray-500 text-xs px-2 py-0.5 rounded font-mono">
                                #{app.jobId}
                            </span>
                        </div>
                    </div>

                    {/* Contact info */}
                    <div className="text-xs text-gray-400 uppercase tracking-wide mb-2">Contact info</div>
                    <div className="grid grid-cols-2 gap-2 mb-4">
                        <div className="bg-gray-50 rounded-lg p-3">
                            <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-1">
                                <Phone size={11} />Phone
                            </div>
                            <p className="text-sm font-medium text-gray-900">{app.phone || "—"}</p>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-3">
                            <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-1">
                                <CalendarDays size={11} />Applied
                            </div>
                            <p className="text-sm font-medium text-gray-900">
                                {app.appliedDate ? new Date(app.appliedDate).toLocaleDateString("vi-VN") : "—"}
                            </p>
                        </div>
                    </div>

                    {/* CV */}
                    <div className="text-xs text-gray-400 uppercase tracking-wide mb-2">CV</div>
                    {app.cvFileUrl ? (
                        <button
                            onClick={() =>
                                window.open(
                                    `http://localhost:9191/uploads/${app.cvFileUrl}`,
                                    "_blank"
                                )
                            }
                            className="inline-flex items-center gap-2 px-3 py-2 border border-[#9fe1cb] bg-[#e1f5ee] text-[#0f6e56] text-sm font-medium rounded-lg hover:bg-[#9fe1cb] transition-colors mb-4"
                        >
                            <FileText size={14} />View CV document
                        </button>
                    ) : (
                        <div className="flex items-center gap-2 text-sm text-gray-400 mb-4">
                            <FileX size={14} />No CV uploaded
                        </div>
                    )}

                    {/* Cover letter */}
                    {app.letter && (
                        <>
                            <div className="text-xs text-gray-400 uppercase tracking-wide mb-2">Cover letter</div>
                            <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-600 leading-relaxed">
                                {app.letter}
                            </div>
                        </>
                    )}
                </div>

                {/* Footer */}
                <div className="flex gap-2 px-5 py-3.5 border-t border-gray-100">
                    {canAct ? (
                        <>
                            <button
                                onClick={async () => { await onUpdateStatus(app.id!, "ACCEPTED"); onClose(); }}
                                className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-sm font-medium bg-[#1e5538] text-white hover:bg-[#164228] transition-colors"
                            >
                                <Check size={14} />Accept
                            </button>
                            <button
                                onClick={async () => { await onUpdateStatus(app.id!, "REJECTED"); onClose(); }}
                                className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-sm font-medium bg-[#fcebeb] text-[#a32d2d] border border-[#f7c1c1] hover:bg-[#f7c1c1] transition-colors"
                            >
                                <X size={14} />Reject
                            </button>
                        </>
                    ) : (
                        <button
                            onClick={onClose}
                            className="flex-1 py-2.5 rounded-lg text-sm border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
                        >
                            Close
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

// ─── Constants ────────────────────────────────────────────────────────────────

const PER_PAGE = 10;

const STATUS_TABS: [StatusFilter, string][] = [
    ["ALL", "All"], ["PENDING", "Pending"], ["REVIEWING", "Reviewing"],
    ["ACCEPTED", "Accepted"], ["REJECTED", "Rejected"],
];

// ─── Main page ────────────────────────────────────────────────────────────────

export default function ApplicationPage() {
    const toast = useToast();

    const [applications, setApplications] = useState<Application[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");
    const [page, setPage] = useState(1);
    const [drawer, setDrawer] = useState<Application | null>(null);

    // Fetch
    useEffect(() => {
        getAllApplications()
            .then((data) => setApplications(data || []))
            .catch(() => toast.error("Failed to load applications."))
            .finally(() => setLoading(false));
    }, []);

    // Fix page overflow when list shrinks
    useEffect(() => {
        const tp = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
        if (page > tp) setPage(tp);
    }, [applications, search, statusFilter]);

    // Filter
    const filtered = useMemo(() => {
        const q = search.toLowerCase();
        return applications.filter((a) => {
            const mq = !q
                || a.fullName?.toLowerCase().includes(q)
                || a.email?.toLowerCase().includes(q)
                || (a.phone ?? "").includes(q)
                || String(a.jobId).includes(q);
            const ms = statusFilter === "ALL" || a.status === statusFilter;
            return mq && ms;
        });
    }, [applications, search, statusFilter]);

    const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
    const currentPage = Math.min(page, totalPages);
    const pageRows = filtered.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE);

    const counts = {
        total: applications.length,
        PENDING: applications.filter((a) => a.status === "PENDING").length,
        REVIEWING: applications.filter((a) => a.status === "REVIEWING").length,
        ACCEPTED: applications.filter((a) => a.status === "ACCEPTED").length,
        REJECTED: applications.filter((a) => a.status === "REJECTED").length,
    };

    // Handlers
    const handleUpdateStatus = async (id: number, status: string) => {
        try {
            await updateApplicationStatus(id, status);
            setApplications((prev) => prev.map((a) => a.id === id ? { ...a, status } : a));
            if (drawer?.id === id) setDrawer((d) => d ? { ...d, status } : d);
            toast.success("Status updated.");
        } catch {
            toast.error("Update failed.");
        }
    };

    return (
        <div className="flex flex-col min-h-full bg-white">

            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                <div>
                    <h1 className="text-xl font-medium text-gray-900">Applications</h1>
                    <p className="text-sm text-gray-500 mt-0.5">Review and manage all job applications</p>
                </div>
                <button className="flex items-center gap-1.5 px-3.5 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors">
                    <Download size={14} />Export
                </button>
            </div>

            {/* Stats */}
            <div className="flex gap-2.5 px-6 py-3 border-b border-gray-100">
                {([
                    ["Total", counts.total, "text-gray-900"],
                    ["Pending", counts.PENDING, "text-[#854f0b]"],
                    ["Reviewing", counts.REVIEWING, "text-[#185fa5]"],
                    ["Accepted", counts.ACCEPTED, "text-[#0f6e56]"],
                    ["Rejected", counts.REJECTED, "text-[#a32d2d]"],
                ] as const).map(([label, value, cls]) => (
                    <div key={label} className="bg-gray-50 rounded-lg px-4 py-2.5 flex-1">
                        <div className={`text-lg font-medium ${cls}`}>{value}</div>
                        <div className="text-xs text-gray-400 mt-0.5">{label}</div>
                    </div>
                ))}
            </div>

            {/* Filters */}
            <div className="flex items-center gap-2 px-6 py-2.5 border-b border-gray-100 flex-wrap">
                <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-1.5 bg-white w-60">
                    <Search size={14} className="text-gray-400 shrink-0" />
                    <input
                        type="text"
                        placeholder="Search name, email, phone, job ID…"
                        value={search}
                        onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                        className="flex-1 text-sm outline-none text-gray-900 placeholder-gray-400"
                    />
                </div>
                <div className="flex gap-1">
                    {STATUS_TABS.map(([v, l]) => (
                        <button
                            key={v}
                            onClick={() => { setStatusFilter(v); setPage(1); }}
                            className={`px-3 py-1 rounded-full text-xs transition-colors ${statusFilter === v ? "bg-[#1e5538] text-white" : "text-gray-500 hover:bg-gray-100"}`}
                        >
                            {l}
                        </button>
                    ))}
                </div>
                <span className="ml-auto text-xs text-gray-400">
                    {filtered.length} application{filtered.length !== 1 ? "s" : ""}
                </span>
            </div>

            {/* Table */}
            <div className="flex-1 overflow-auto px-6">
                {loading ? (
                    <div className="py-20 text-center text-sm text-gray-400">Loading applications…</div>
                ) : pageRows.length === 0 ? (
                    <div className="py-20 text-center">
                        <FileText size={32} className="text-gray-200 mx-auto mb-3" />
                        <p className="text-sm text-gray-400">No applications found.</p>
                    </div>
                ) : (
                    <table className="w-full text-sm border-collapse">
                        <thead>
                            <tr className="border-b border-gray-100">
                                {["", "Candidate", "Job ID", "Cover letter", "Applied", "CV", "Status", "Actions"].map((h) => (
                                    <th key={h} className="py-2.5 px-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wide whitespace-nowrap first:w-10">
                                        {h}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {pageRows.map((app) => {
                                const canAct = app.status === "PENDING" || app.status === "REVIEWING";
                                return (
                                    <tr key={app.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                                        {/* Avatar */}
                                        <td className="py-3 px-2">
                                            <Avatar name={app.fullName} id={app.id} />
                                        </td>

                                        {/* Candidate */}
                                        <td className="py-3 px-2" style={{ minWidth: 180 }}>
                                            <div className="font-medium text-gray-900">{app.fullName}</div>
                                            <div className="text-xs text-gray-400 mt-0.5">{app.email}</div>
                                        </td>

                                        {/* Job ID */}
                                        <td className="py-3 px-2">
                                            <span className="bg-gray-50 text-gray-500 text-xs px-2 py-0.5 rounded font-mono">#{app.jobId}</span>
                                        </td>

                                        {/* Cover letter preview */}
                                        <td className="py-3 px-2" style={{ maxWidth: 180 }}>
                                            {app.letter ? (
                                                <p className="text-xs text-gray-500 italic truncate max-w-[170px]">{app.letter}</p>
                                            ) : (
                                                <span className="text-xs text-gray-300 italic">No cover letter</span>
                                            )}
                                        </td>

                                        {/* Applied date */}
                                        <td className="py-3 px-2 whitespace-nowrap">
                                            <span className="text-xs text-gray-500">
                                                {app.appliedDate ? new Date(app.appliedDate).toLocaleDateString("vi-VN") : "—"}
                                            </span>
                                        </td>

                                        {/* CV */}
                                        <td className="py-3 px-2">
                                            {app.cvFileUrl ? (
                                                <span
                                                    onClick={() =>
                                                        window.open(
                                                            `http://localhost:9191/uploads/${app.cvFileUrl}`,
                                                            "_blank"
                                                        )
                                                    }
                                                    className="inline-flex items-center gap-1 px-2 py-1 border border-[#9fe1cb] bg-[#e1f5ee] text-[#0f6e56] text-xs font-medium rounded-lg hover:bg-[#9fe1cb] transition-colors"
                                                >
                                                    <FileText size={11} />CV
                                                </span>
                                            ) : (
                                                <span className="text-xs text-gray-300">—</span>
                                            )}
                                        </td>

                                        {/* Status */}
                                        <td className="py-3 px-2">
                                            <StatusBadge status={app.status} />
                                        </td>

                                        {/* Actions */}
                                        <td className="py-3 px-2">
                                            <div className="flex items-center gap-1">
                                                <button
                                                    onClick={() => setDrawer(app)}
                                                    className="flex items-center gap-1 px-2.5 py-1.5 border border-gray-200 rounded-lg text-xs text-gray-600 hover:bg-gray-100 transition-colors"
                                                >
                                                    <Eye size={12} />Detail
                                                </button>
                                                {canAct && (
                                                    <>
                                                        <button
                                                            onClick={() => handleUpdateStatus(app.id!, "ACCEPTED")}
                                                            className="p-1.5 rounded-lg text-[#0f6e56] bg-[#e1f5ee] border border-[#9fe1cb] hover:bg-[#9fe1cb] transition-colors"
                                                            title="Accept"
                                                        >
                                                            <Check size={12} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleUpdateStatus(app.id!, "REJECTED")}
                                                            className="p-1.5 rounded-lg text-[#a32d2d] bg-[#fcebeb] border border-[#f7c1c1] hover:bg-[#f7c1c1] transition-colors"
                                                            title="Reject"
                                                        >
                                                            <X size={12} />
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
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
                            className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm transition-colors ${n === currentPage ? "border border-gray-300 font-medium text-gray-900" : "text-gray-500 hover:bg-gray-100"}`}
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
                    <span className="ml-auto text-xs text-gray-400">
                        Page {currentPage} of {totalPages} · {filtered.length} total
                    </span>
                </div>
            )}

            {/* Detail drawer */}
            {drawer && (
                <DetailDrawer
                    app={drawer}
                    onClose={() => setDrawer(null)}
                    onUpdateStatus={handleUpdateStatus}
                />
            )}
        </div>
    );
}