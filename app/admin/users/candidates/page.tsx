"use client";

import { useEffect, useState } from "react";

export interface CandidateAdmin {
    userId: number;
    email: string;
    fullName: string;
    candidateId?: number;
    firstName?: string;
    lastName?: string;
    phone?: string;
    headline?: string;
    profileUrl?: string;
}

// Replace with your real import: import { getAllCandidates } from "@/services/candidate";
const getAllCandidates = async (): Promise<CandidateAdmin[]> => {
    return Array.from({ length: 47 }, (_, i) => ({
        userId: i + 1,
        email: `candidate${i + 1}@email.com`,
        fullName: `Candidate ${i + 1}`,
        candidateId: i % 3 !== 0 ? 100 + i : undefined,
        phone: i % 2 === 0 ? `090${String(i).padStart(7, "0")}` : undefined,
        headline: ["Frontend Developer", "Product Manager", "Backend Engineer", "UX Designer", "Data Analyst"][i % 5],
        profileUrl: i % 3 !== 0 ? `/profile/${i + 1}` : undefined,
    }));
};

const PAGE_SIZE = 10;

const AVATAR_COLORS = [
    "bg-indigo-500", "bg-violet-500", "bg-pink-500", "bg-amber-500",
    "bg-emerald-500", "bg-blue-500", "bg-red-500", "bg-teal-500",
];

function getInitials(name: string) {
    return name.split(" ").map((n) => n[0]).slice(-2).join("").toUpperCase();
}

function filterCandidates(list: CandidateAdmin[], query: string, filter: string) {
    let result = list;
    if (query) {
        const q = query.toLowerCase();
        result = result.filter(
            (c) =>
                c.fullName.toLowerCase().includes(q) ||
                c.email.toLowerCase().includes(q) ||
                c.headline?.toLowerCase().includes(q)
        );
    }
    if (filter === "complete") result = result.filter((c) => c.candidateId);
    if (filter === "incomplete") result = result.filter((c) => !c.candidateId);
    return result;
}

function Pagination({
    page, totalPages, onChange,
}: { page: number; totalPages: number; onChange: (p: number) => void }) {
    if (totalPages <= 1) return null;

    const pages: (number | "...")[] = [];
    if (totalPages <= 7) {
        for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
        pages.push(1);
        if (page > 3) pages.push("...");
        for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) pages.push(i);
        if (page < totalPages - 2) pages.push("...");
        pages.push(totalPages);
    }

    const btn = (label: React.ReactNode, target: number, disabled = false, active = false) => (
        <button
            key={String(label)}
            onClick={() => !disabled && onChange(target)}
            disabled={disabled}
            className={`min-w-[32px] h-8 px-2 rounded-md text-xs font-medium transition-all ${
                active
                    ? "bg-indigo-600 text-white shadow-sm"
                    : disabled
                    ? "text-gray-300 cursor-not-allowed"
                    : "text-gray-500 hover:bg-gray-100 hover:text-gray-700"
            }`}
        >
            {label}
        </button>
    );

    return (
        <div className="flex items-center gap-1">
            {btn(
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M15 18l-6-6 6-6"/></svg>,
                page - 1, page === 1
            )}
            {pages.map((p, i) =>
                p === "..."
                    ? <span key={`ellipsis-${i}`} className="text-xs text-gray-400 px-1">…</span>
                    : btn(p, p as number, false, p === page)
            )}
            {btn(
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 18l6-6-6-6"/></svg>,
                page + 1, page === totalPages
            )}
        </div>
    );
}

export default function CandidatesPage() {
    const [candidates, setCandidates] = useState<CandidateAdmin[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [query, setQuery] = useState("");
    const [filter, setFilter] = useState("all");
    const [selected, setSelected] = useState<CandidateAdmin | null>(null);
    const [page, setPage] = useState(1);

    useEffect(() => {
        setLoading(true);
        getAllCandidates()
            .then(setCandidates)
            .catch(() => setError("Failed to load candidates."))
            .finally(() => setLoading(false));
    }, []);

    // Reset to page 1 when search/filter changes
    useEffect(() => { setPage(1); }, [query, filter]);

    const filtered = filterCandidates(candidates, query, filter);
    const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
    const displayed = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    const stats = {
        total: candidates.length,
        complete: candidates.filter((c) => c.candidateId).length,
        incomplete: candidates.filter((c) => !c.candidateId).length,
    };

    const from = filtered.length === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
    const to = Math.min(page * PAGE_SIZE, filtered.length);

    return (
        <div className="p-6 h-full flex flex-col gap-5">

            {/* Header */}
            <div>
                <h1 className="text-xl font-bold text-gray-900 tracking-tight">Candidates</h1>
                <p className="text-sm text-gray-500 mt-0.5">Manage all candidate accounts in the system</p>
            </div>

            {/* Stat cards */}
            <div className="grid grid-cols-3 gap-4">
                {[
                    { label: "Total Candidates", value: stats.total, color: "text-indigo-600" },
                    { label: "Profile Complete", value: stats.complete, color: "text-emerald-600" },
                    { label: "Incomplete Profile", value: stats.incomplete, color: "text-amber-600" },
                ].map((s) => (
                    <div key={s.label} className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
                        <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
                        <div className="text-xs text-gray-500 mt-1">{s.label}</div>
                    </div>
                ))}
            </div>

            {/* Search + Filter */}
            <div className="flex items-center gap-3 flex-wrap">
                <div className="relative flex-1 min-w-[200px]">
                    <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
                    </svg>
                    <input
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search by name, email, or headline…"
                        className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 text-gray-800 placeholder-gray-400"
                    />
                </div>
                <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
                    {[
                        { key: "all", label: "All" },
                        { key: "complete", label: "Complete" },
                        { key: "incomplete", label: "Incomplete" },
                    ].map((f) => (
                        <button
                            key={f.key}
                            onClick={() => setFilter(f.key)}
                            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                                filter === f.key
                                    ? "bg-white text-indigo-600 shadow-sm border border-indigo-200"
                                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                            }`}
                        >
                            {f.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Table + Detail panel */}
            <div className="flex flex-1 bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm min-h-0">

                {/* Table */}
                <div className="flex-1 flex flex-col overflow-hidden">
                    {loading ? (
                        <div className="flex-1 flex flex-col items-center justify-center text-gray-400 gap-2">
                            <div className="w-6 h-6 border-2 border-indigo-300 border-t-indigo-600 rounded-full animate-spin" />
                            <span className="text-sm">Loading candidates…</span>
                        </div>
                    ) : error ? (
                        <div className="flex-1 flex flex-col items-center justify-center text-red-400 gap-2 text-sm">
                            <span className="text-2xl">⚠️</span>{error}
                        </div>
                    ) : (
                        <>
                            <div className="overflow-auto flex-1">
                                <table className="w-full text-sm">
                                    <thead className="sticky top-0 z-10">
                                        <tr className="bg-gray-50 border-b border-gray-100">
                                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Candidate</th>
                                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Contact</th>
                                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {displayed.length === 0 ? (
                                            <tr>
                                                <td colSpan={3} className="text-center py-12 text-gray-400 text-sm">
                                                    No candidates found.
                                                </td>
                                            </tr>
                                        ) : displayed.map((c) => (
                                            <tr
                                                key={c.userId}
                                                onClick={() => setSelected(selected?.userId === c.userId ? null : c)}
                                                className={`border-b border-gray-50 cursor-pointer transition-colors ${
                                                    selected?.userId === c.userId ? "bg-indigo-50" : "hover:bg-gray-50"
                                                }`}
                                            >
                                                <td className="px-4 py-3">
                                                    <div className="flex items-center gap-3">
                                                        <div className={`w-8 h-8 rounded-full ${AVATAR_COLORS[c.userId % AVATAR_COLORS.length]} text-white flex items-center justify-center text-xs font-bold shrink-0`}>
                                                            {getInitials(c.fullName)}
                                                        </div>
                                                        <div>
                                                            <div className="font-semibold text-gray-800">{c.fullName}</div>
                                                            {c.headline && <div className="text-xs text-gray-400 mt-0.5">{c.headline}</div>}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3 text-gray-500">
                                                    <div>{c.email}</div>
                                                    {c.phone && <div className="text-xs text-gray-400 mt-0.5">{c.phone}</div>}
                                                </td>
                                                <td className="px-4 py-3">
                                                    {c.candidateId ? (
                                                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700">
                                                            ✓ Complete
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-700">
                                                            ⚠ Incomplete
                                                        </span>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination footer */}
                            <div className="flex items-center justify-between px-4 py-2.5 border-t border-gray-100 shrink-0">
                                <span className="text-xs text-gray-400">
                                    {filtered.length === 0
                                        ? "No results"
                                        : `Showing ${from}–${to} of ${filtered.length} candidates`}
                                </span>
                                <Pagination page={page} totalPages={totalPages} onChange={setPage} />
                            </div>
                        </>
                    )}
                </div>

                {/* Detail panel */}
                {selected && (
                    <div className="w-64 border-l border-gray-100 flex flex-col shrink-0 overflow-y-auto">
                        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                            <span className="text-xs font-semibold text-gray-700 uppercase tracking-wider">Details</span>
                            <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-gray-600 text-lg leading-none">×</button>
                        </div>

                        <div className="flex flex-col items-center px-4 py-5 gap-2 border-b border-gray-100">
                            <div className={`w-14 h-14 rounded-full ${AVATAR_COLORS[selected.userId % AVATAR_COLORS.length]} text-white flex items-center justify-center text-xl font-bold`}>
                                {getInitials(selected.fullName)}
                            </div>
                            <div className="font-bold text-gray-800 text-center text-sm">{selected.fullName}</div>
                            {selected.headline && <div className="text-xs text-gray-500 text-center">{selected.headline}</div>}
                            {selected.candidateId ? (
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700">✓ Complete</span>
                            ) : (
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-700">⚠ Incomplete</span>
                            )}
                        </div>

                        <div className="flex flex-col gap-4 px-4 py-4 flex-1">
                            {[
                                { label: "User ID", val: String(selected.userId) },
                                { label: "Candidate ID", val: selected.candidateId ? String(selected.candidateId) : "—" },
                                { label: "Email", val: selected.email },
                                { label: "Phone", val: selected.phone || "—" },
                            ].map((row) => (
                                <div key={row.label}>
                                    <div className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 mb-0.5">{row.label}</div>
                                    <div className="text-sm text-gray-700 break-all">{row.val}</div>
                                </div>
                            ))}
                        </div>

                        {selected.profileUrl && (
                            <div className="px-4 pb-4">
                                <a
                                    href={selected.profileUrl}
                                    className="block w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg text-center transition-colors"
                                >
                                    View Profile →
                                </a>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}