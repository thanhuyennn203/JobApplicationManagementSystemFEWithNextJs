"use client";

import { useState } from "react";
import { deleteJob } from "@/services/jobs/jobs.service";
import { Briefcase, Clock, MapPin, Eye, Pencil, Trash2, Sparkles } from "lucide-react";
import { useLocation } from "@/context/LocationContext";
import { useToast } from "@/components/notification/ToastProvider";
import PromoteJobModal from "@/components/jobs/PromoteJobModal";

export default function JobCard({
    job,
    router,
    onChangeStatus,
    changingStatusId, onDeleted
}: any) {

    const toast = useToast();
    const { getProvinceName } = useLocation();
    const [promoteOpen, setPromoteOpen] = useState(false);

    const handleDelete = async () => {
        if (!confirm("Are you sure you want to delete this job?")) return;
        try {
            await deleteJob(job.company_id, job.id);
            onDeleted?.(job.id);
            toast.success("Deleted job successfully.")
        } catch {
            toast.error("Failed to delete job.");
        }
    };

    const handlePromote = () => {
        setPromoteOpen(true);
    };

    return (
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition overflow-hidden">

            {/* TOP */}
            <div className="p-4">
                <div className="flex gap-3">

                    {/* LOGO */}
                    <div className="w-24 h-24 rounded-2xl bg-gray-50 overflow-hidden border border-gray-200 flex items-center justify-center shrink-0">
                        {job.logo_url ? (
                            <img
                                src={job.logo_url}
                                alt="company"
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <Briefcase size={22} className="text-gray-400" />
                        )}
                    </div>

                    {/* INFO */}
                    <div className="flex-1 min-w-0">

                        {/* Company + posted time */}
                        <div className="flex items-center justify-between gap-2">
                            <span className="text-sm font-semibold text-[#00b14f] truncate">
                                {job.company_name}
                            </span>
                            <span className="flex items-center gap-1 text-xs text-gray-400 shrink-0">
                                <Clock size={12} />
                                {formatTimeAgo(job.createdAt || job.dueDate)}
                            </span>
                        </div>

                        {/* Title */}
                        <h3 className="text-base font-bold text-gray-900 leading-tight mt-0.5 truncate">
                            {job.title}
                        </h3>

                        {/* Description */}
                        <p className="text-sm text-gray-500 mt-1 line-clamp-1">
                            {job.description}
                        </p>

                        {/* Tags + location */}
                        <div className="flex items-center justify-between gap-2 mt-2 flex-wrap">
                            <div className="flex flex-wrap gap-1.5">
                                {(job?.tags || []).slice(0, 3).map((tag: string) => (
                                    <span
                                        key={tag}
                                        className="px-2.5 py-1 rounded-lg bg-[#eef2ff] text-[#3b4cb8] text-xs font-medium"
                                    >
                                        {tag}
                                    </span>
                                ))}
                                {job?.experienceRequired && (
                                    <span className="px-2.5 py-1 rounded-lg bg-[#eef2ff] text-[#3b4cb8] text-xs font-medium">
                                        {job.experienceRequired}
                                    </span>
                                )}
                                 {job?.salary_min && (
                                    <span className="px-2.5 py-1 rounded-lg bg-[#eef2ff] text-[#3b4cb8] text-xs font-medium">
                                       $ {job.salary_min} - {job.salary_max}
                                    </span>
                                )}
                            </div>

                            <span className="flex items-center gap-1 text-xs text-gray-400 shrink-0">
                                <MapPin size={12} />
                                {job.locations?.length > 0
                                    ? job.locations
                                        .map((l: any) => getProvinceName(l.province))
                                        .join(", ")
                                    : "Remote"}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* STATUS + ACTIONS (single row) */}
            <div className="px-4 py-3 bg-[#fafbfc] border-t border-gray-100 flex items-center justify-between gap-3 flex-wrap">

                <div className="flex items-center gap-2 flex-wrap">
                    <StatusStages status={job.status} />

                    {job.status === "DRAFT" && (
                        <button
                            disabled={changingStatusId === job.id}
                            onClick={() => onChangeStatus(job.id, "OPEN")}
                            className="bg-[#00b14f] hover:bg-[#009245] disabled:opacity-50 text-white px-3 py-1.5 rounded-lg text-xs font-semibold"
                        >
                            Publish
                        </button>
                    )}

                    {job.status === "OPEN" && (
                        <button
                            disabled={changingStatusId === job.id}
                            onClick={() => onChangeStatus(job.id, "CLOSED")}
                            className="bg-red-400 hover:bg-red-600 disabled:opacity-50 text-white px-3 py-1.5 rounded-lg text-xs font-semibold"
                        >
                            Close
                        </button>
                    )}

                    {job.status === "OPEN" && (
                        job.promoted ? (
                            <span className="bg-amber-50 border border-amber-200 text-amber-600 px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1">
                                <Sparkles size={13} />
                                Promoted
                            </span>
                        ) : (
                            <button
                                onClick={handlePromote}
                                className="bg-amber-500 hover:bg-amber-600 text-white px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1"
                            >
                                <Sparkles size={13} />
                                Promote
                            </button>
                        )
                    )}
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={() => router.push(`/candidate/jobs/${job.id}`)}
                        className="border border-gray-200 hover:bg-gray-100 text-gray-600 p-2 rounded-lg"
                        title="View Detail"
                    >
                        <Eye size={15} />
                    </button>

                    {job.status === "DRAFT" && (
                        <button
                            onClick={() => router.push(`/recruiter/jobs/edit/${job.id}`)}
                            className="border border-gray-200 hover:bg-gray-100 text-gray-600 p-2 rounded-lg"
                            title="Edit Job"
                        >
                            <Pencil size={15} />
                        </button>
                    )}

                    {job.status !== "OPEN" && (
                        <button
                            onClick={handleDelete}
                            className="border border-red-200 hover:bg-red-50 text-red-500 p-2 rounded-lg"
                            title="Delete"
                        >
                            <Trash2 size={15} />
                        </button>
                    )}
                </div>
            </div>

            <PromoteJobModal
                open={promoteOpen}
                onClose={() => setPromoteOpen(false)}
                companyId={job.company_id}
                jobId={job.id}
            />
        </div>
    );
}

function formatTimeAgo(date: any) {
    if (!date) return "";
    const diffMs = Date.now() - new Date(date).getTime();
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    if (hours < 1) return "Just now";
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
}

function StatusStages({ status }: { status: string }) {
    const stages = [
        { key: "DRAFT", label: "Draft" },
        { key: "OPEN", label: "Open" },
        { key: "CLOSED", label: "Closed" },
        { key: "EXPIRED", label: "Expired" },
    ];

    const activeStyles: any = {
        DRAFT: "bg-gray-700 text-white border-gray-700",
        OPEN: "bg-green-600 text-white border-green-600",
        CLOSED: "bg-red-500 text-white border-red-500",
        EXPIRED: "bg-yellow-500 text-white border-yellow-500",
    };
// console.log(status);
    return (
        <div className="flex items-center gap-1.5">
            {stages.map((s) => {
                const isActive = s.key === status;
                return (
                    <span
                        key={s.key}
                        className={`px-2.5 py-1 rounded-lg border text-xs font-semibold ${isActive
                            ? activeStyles[s.key]
                            : "bg-white text-gray-300 border-gray-100"
                            }`}
                    >
                        {s.label}
                    </span>
                );
            })}
        </div>
    );
}