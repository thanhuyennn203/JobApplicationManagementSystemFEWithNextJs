"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
    ArrowLeft, Building2, MapPin, ShieldCheck, UserCircle, Users,
    Check, X, AlertCircle, FileText, FileX, ExternalLink,
    Edit, Trash2, Globe, CircleCheck,
} from "lucide-react";
import {
    getCompanyById,
    approveCompany,
    rejectCompany,
} from "@/services/companies/company.service";
import { getMembersByCompany } from "@/services/companies/member.service";
import { useToast } from "@/components/notification/ToastProvider";
import { Company, Member } from "@/types/company";
import { useLocation } from "@/context/LocationContext";

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
        PENDING: { cls: "bg-[#faeeda] text-[#854f0b]", icon: <AlertCircle size={11} />, label: "Pending review" },
    };
    const v = map[status ?? "PENDING"] ?? map["PENDING"];
    return (
        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${v.cls}`}>
            {v.icon}{v.label}
        </span>
    );
}

function SectionCard({
    icon,
    iconBg,
    title,
    badge,
    children,
}: {
    icon: React.ReactNode;
    iconBg: string;
    title: string;
    badge?: React.ReactNode;
    children: React.ReactNode;
}) {
    return (
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden mb-4">
            <div className="flex items-center gap-2.5 px-5 py-3.5 border-b border-gray-100">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${iconBg}`}>
                    {icon}
                </div>
                <span className="text-sm font-medium text-gray-900">{title}</span>
                {badge && <div className="ml-auto">{badge}</div>}
            </div>
            <div className="px-5 py-4">{children}</div>
        </div>
    );
}

function FieldGrid({ children }: { children: React.ReactNode }) {
    return <div className="grid grid-cols-2 gap-x-6 gap-y-4">{children}</div>;
}

function Field({
    label,
    value,
    full,
    href,
}: {
    label: string;
    value?: string | number | null;
    full?: boolean;
    href?: string;
}) {
    return (
        <div className={full ? "col-span-2" : ""}>
            <div className="text-xs text-gray-400 uppercase tracking-wide mb-1">{label}</div>
            {value ? (
                href ? (
                    <a href={href} target="_blank" className="text-sm font-medium text-[#0f6e56] hover:underline break-all flex items-center gap-1">
                        {String(value).replace(/^https?:\/\//, "")}<ExternalLink size={11} />
                    </a>
                ) : (
                    <p className="text-sm font-medium text-gray-900">{String(value)}</p>
                )
            ) : (
                <p className="text-sm text-gray-400">—</p>
            )}
        </div>
    );
}

export default function CompanyDetailPage() {
    const params = useParams();
    const router = useRouter();
    const toast = useToast();
    const {getProvinceName, getWardNameFromList} = useLocation();

    const [company, setCompany] = useState<Company | null>(null);
    const [members, setMembers] = useState<Member[]>([]);
    const [loading, setLoading] = useState(true);
    const [rejectOpen, setRejectOpen] = useState(false);
    const [rejectReason, setRejectReason] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const provinceName = getProvinceName(company?.province);
    const wardName = getWardNameFromList(company?.ward);

    const id = Number(params?.id);

    useEffect(() => {
        if (!id) return;
        Promise.all([getCompanyById(id), getMembersByCompany(id)])
            .then(([comp, mems]) => {
                setCompany(comp);
                setMembers(mems || []);
            })
            .catch(console.error)
            .finally(() => setLoading(false));

    }, [id]);

    const handleApprove = async () => {
        if (!company?.id) return;
        setSubmitting(true);
        try {
            await approveCompany(company.id);
            setCompany((c) => c ? { ...c, verificationStatus: "APPROVED", rejectionReason: "" } : c);
            setRejectOpen(false);
            toast.success("Company approved.");
        } catch {
            toast.error("Approve failed.");
        } finally {
            setSubmitting(false);
        }
    };

    const handleReject = async () => {
        if (!company?.id || !rejectReason.trim()) return;
        setSubmitting(true);
        try {
            await rejectCompany(company.id, rejectReason.trim());
            setCompany((c) => c ? { ...c, verificationStatus: "REJECTED", rejectionReason: rejectReason.trim() } : c);
            setRejectOpen(false);
            setRejectReason("");
            toast.success("Company rejected.");
        } catch {
            toast.error("Reject failed.");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full text-sm text-gray-400">
                Loading company details…
            </div>
        );
    }

    if (!company) {
        return (
            <div className="flex flex-col items-center justify-center h-full gap-3">
                <Building2 size={40} className="text-gray-200" />
                <p className="text-sm text-gray-400">Company not found.</p>
                <button onClick={() => router.back()} className="text-sm text-[#0f6e56] hover:underline">
                    Go back
                </button>
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-full bg-gray-50">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 px-6 py-3.5 bg-white border-b border-gray-100 text-sm text-gray-500">
                <button onClick={() => router.back()} className="hover:text-gray-700 transition-colors">
                    <ArrowLeft size={15} />
                </button>
                <span className="text-gray-300">›</span>
                <button onClick={() => router.push("/admin/users/recruiters")} className="hover:text-gray-700 transition-colors">
                    Companies
                </button>
                <span className="text-gray-300">›</span>
                <span className="text-gray-900 font-medium truncate max-w-[200px]">{company.name}</span>
            </div>

            {/* Hero */}
            <div className="relative h-36 bg-[#e1f5ee] overflow-hidden">
                {/* {company.backgroundUrl ? (
                    <img src={company.backgroundUrl} alt="" className="w-full h-full object-cover" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        <Building2 size={48} className="text-[#9fe1cb]" />
                    </div>
                )} */}

                 <div className="w-full h-full flex items-center justify-center">
                        <Building2 size={48} className="text-[#9fe1cb]" />
                    </div>
                <div className="absolute -bottom-6 left-6 w-14 h-14 rounded-xl border-[3px] border-white bg-white flex items-center justify-center text-base font-medium text-gray-500 overflow-hidden shadow-sm">
                    {company.logo_url ? (
                        <img src={company.logo_url} alt="" className="w-full h-full object-contain" />
                    ) : (
                        initials(company.name)
                    )}
                </div>
            </div>

            {/* Page header */}
            <div className="bg-white border-b border-gray-100 px-6 pt-9 pb-4 flex items-end justify-between">
                <div>
                    <h1 className="text-xl font-medium text-gray-900">{company.name}</h1>
                    <p className="text-sm text-gray-500 mt-0.5">
                        {company.industry}{company.province ? ` · ${company.province}` : ""}{company.ward ? ` · ${company.ward}` : ""}
                    </p>
                </div>
                <div className="flex gap-2">
                    <button className="flex items-center gap-1.5 px-3.5 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors">
                        <Edit size={14} />Edit
                    </button>
                    <button className="flex items-center gap-1.5 px-3.5 py-2 border border-red-100 rounded-lg text-sm text-red-600 bg-red-50 hover:bg-red-100 transition-colors">
                        <Trash2 size={14} />Delete
                    </button>
                </div>
            </div>

            {/* Body: 2-col layout */}
            <div className="flex gap-4 px-6 py-5 items-start">

                {/* Left column */}
                <div className="flex-1 min-w-0">

                    {/* Basic information */}
                    <SectionCard
                        icon={<Building2 size={15} className="text-[#0f6e56]" />}
                        iconBg="bg-[#e1f5ee]"
                        title="Basic information"
                    >
                        {/* Stats */}
                        <div className="grid grid-cols-3 gap-2.5 mb-5">
                            {[
                                { num: (company.followerNumber ?? 0).toLocaleString(), label: "Followers" },
                                { num: company.size ?? "—", label: "Employees" },
                                { num: members.length, label: "Members" },
                            ].map(({ num, label }) => (
                                <div key={label} className="bg-gray-50 rounded-lg py-3 text-center">
                                    <div className="text-lg font-medium text-gray-900">{num}</div>
                                    <div className="text-xs text-gray-400 mt-0.5">{label}</div>
                                </div>
                            ))}
                        </div>

                        <FieldGrid>
                            <Field label="Company name" value={company.name} />
                            <Field label="Industry" value={company.industry} />
                            <Field label="Company size" value={company.size ? `${company.size} employees` : null} />
                            <Field label="Website" value={company.website} href={company.website} />
                            {company.description && (
                                <div className="col-span-2">
                                    <div className="text-xs text-gray-400 uppercase tracking-wide mb-1.5">Description</div>
                                    <p className="text-sm text-gray-600 leading-relaxed">{company.description}</p>
                                </div>
                            )}
                        </FieldGrid>
                    </SectionCard>

                    {/* Address(this for one location a company only) */}
                    
                    <SectionCard
                        icon={<MapPin size={15} className="text-[#534ab7]" />}
                        iconBg="bg-[#eeedfe]"
                        title="Address"
                    >
                        <FieldGrid>
                            <Field label="Province / City" value={provinceName} />
                            <Field label="District" value={wardName} />
                        </FieldGrid>
                    </SectionCard>

                    {/* Members */}
                    <SectionCard
                        icon={<Users size={15} className="text-[#3b6d11]" />}
                        iconBg="bg-[#eaf3de]"
                        title="Members"
                        badge={
                            <span className="text-xs text-gray-400">{members.length} total</span>
                        }
                    >
                        {members.length === 0 ? (
                            <div className="text-center py-5">
                                <Users size={24} className="text-gray-200 mx-auto mb-2" />
                                <p className="text-xs text-gray-400">No members yet</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-gray-50">
                                {members.map((m) => (
                                    <div key={m.id} className="flex items-center gap-2.5 py-2.5 first:pt-0 last:pb-0">
                                        <div className="w-9 h-9 rounded-full bg-[#e1f5ee] flex items-center justify-center text-xs font-medium text-[#0f6e56] shrink-0">
                                            {initials(m.fullName)}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="text-sm font-medium text-gray-900 truncate">{m.email}</div>
                                            <div className="text-xs text-gray-400 truncate">
                                                {m.position}{m.department ? ` · ${m.department}` : ""}
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-end gap-1 shrink-0">
                                            <span className="text-xs px-2 py-0.5 rounded-full bg-gray-50 text-gray-500">
                                                {m.gender === "MALE" ? "Male" : m.gender === "FEMALE" ? "Female" : m.gender ?? "—"}
                                            </span>
                                            {m.phone && (
                                                <span className="text-xs text-gray-400">{m.phone}</span>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </SectionCard>

                </div>

                {/* Right column */}
                <div className="w-80 shrink-0">

                    {/* Verification */}
                    <SectionCard
                        icon={<ShieldCheck size={15} className="text-[#854f0b]" />}
                        iconBg="bg-[#faeeda]"
                        title="Verification"
                        badge={<StatusBadge status={company.verificationStatus} />}
                    >
                        {/* Rejection reason */}
                        {company.verificationStatus === "REJECTED" && company.rejectionReason && (
                            <div className="flex gap-2 bg-[#fcebeb] rounded-lg p-3 mb-3">
                                <AlertCircle size={14} className="text-[#a32d2d] shrink-0 mt-0.5" />
                                <p className="text-xs text-[#a32d2d] leading-relaxed">
                                    <span className="font-medium">Rejection reason:</span> {company.rejectionReason}
                                </p>
                            </div>
                        )}

                        {/* Certificate */}
                        <div className={`flex items-center gap-3 border border-gray-100 rounded-lg p-3 ${company.verificationStatus !== "APPROVED" ? "mb-4" : ""}`}>
                            {company.certificateUrl ? (
                                <>
                                    <div className="w-9 h-9 rounded-lg bg-[#e1f5ee] flex items-center justify-center shrink-0">
                                        <FileText size={16} className="text-[#0f6e56]" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="text-xs font-medium text-gray-900">Business certificate</div>
                                        <div className="text-xs text-gray-400 mt-0.5">Document uploaded</div>
                                    </div>
                                    <a
                                        href={company.certificateUrl}
                                        target="_blank"
                                        className="text-xs font-medium text-[#0f6e56] hover:underline flex items-center gap-1 shrink-0"
                                    >
                                        <ExternalLink size={11} />View
                                    </a>
                                </>
                            ) : (
                                <>
                                    <div className="w-9 h-9 rounded-lg bg-[#faeeda] flex items-center justify-center shrink-0">
                                        <FileX size={16} className="text-[#854f0b]" />
                                    </div>
                                    <div>
                                        <div className="text-xs font-medium text-gray-900">No certificate</div>
                                        <div className="text-xs text-gray-400 mt-0.5">Not provided</div>
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Actions */}
                        {company.verificationStatus === "APPROVED" ? (
                            <div className="flex items-center gap-2 text-[#3b6d11] text-xs">
                                <CircleCheck size={14} />Company is verified.
                            </div>
                        ) : (
                            <div className="flex flex-col gap-2">
                                <div className="flex gap-2">
                                    <button
                                        onClick={handleApprove}
                                        disabled={submitting}
                                        className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-sm bg-[#1e5538] text-white hover:bg-[#164228] disabled:opacity-50 transition-colors"
                                    >
                                        <Check size={13} />Approve
                                    </button>
                                    {company.verificationStatus !== "REJECTED" && (
                                        <button
                                            onClick={() => setRejectOpen((o) => !o)}
                                            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-sm bg-[#fcebeb] text-[#a32d2d] border border-[#f7c1c1] hover:bg-[#f7c1c1] transition-colors"
                                        >
                                            <X size={13} />Reject
                                        </button>
                                    )}
                                </div>

                                {/* Reject form */}
                                {rejectOpen && (
                                    <div className="mt-1">
                                        <label className="text-xs text-gray-400 block mb-1.5">Rejection reason</label>
                                        <textarea
                                            rows={3}
                                            value={rejectReason}
                                            onChange={(e) => setRejectReason(e.target.value)}
                                            placeholder="Describe the reason…"
                                            className="w-full text-sm px-3 py-2 border border-gray-200 rounded-lg outline-none focus:border-gray-400 resize-y text-gray-900 bg-white"
                                        />
                                        <div className="flex gap-2 mt-2">
                                            <button
                                                onClick={handleReject}
                                                disabled={!rejectReason.trim() || submitting}
                                                className="flex-1 flex items-center justify-center gap-1 py-1.5 text-sm rounded-lg bg-[#fcebeb] text-[#a32d2d] border border-[#f7c1c1] hover:bg-[#f7c1c1] disabled:opacity-50 transition-colors"
                                            >
                                                <X size={12} />Confirm
                                            </button>
                                            <button
                                                onClick={() => { setRejectOpen(false); setRejectReason(""); }}
                                                className="flex-1 py-1.5 text-sm rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </SectionCard>

                    {/* Account */}
                    <SectionCard
                        icon={<UserCircle size={15} className="text-[#185fa5]" />}
                        iconBg="bg-[#e6f1fb]"
                        title="Account"
                    >
                        <FieldGrid>
                            <Field label="Full name" value={members[0]?.fullName} />
                            <Field label="Email" value={members[0]?.email} />
                        </FieldGrid>
                    </SectionCard>

                </div>
            </div>
        </div>
    );
}