"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useLocation } from "@/context/LocationContext";
import { getJobById, createJob, updateJob } from "@/services/jobs/jobs.service";
import { useToast } from "@/components/notification/ToastProvider";
import {
    ArrowLeft,
    Briefcase,
    MapPin,
    DollarSign,
    Clock,
    CalendarDays,
    Plus,
    Trash2,
    ChevronRight,
    Info,
    CheckCircle2,
} from "lucide-react";

interface StepJobCardProps {
    nextStep: () => void;
    setJobId?: (id: number) => void;
    jobId?: number;
}

export default function StepJobCard({ nextStep, setJobId, jobId }: StepJobCardProps) {
    const auth = useAuth();
    const toast = useToast();
    const router = useRouter();
    const companyId = auth?.user?.companyId;

    const { provinces, wardsMap, getWards } = useLocation();

    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        salary_min: "",
        salary_max: "",
        experienceRequired: "",
        dueDate: "",
        postedDate: "",
        status: "DRAFT",
        locations: [{ province: "", ward: "", detailAddress: "" }],
    });
    

    useEffect(() => {
        if (!jobId) return;
        
        const fetchJob = async () => {
            try {
                const data = await getJobById(jobId);
                setFormData({
                    title: data.title || "",
                    description: data.description || "",
                    salary_min: data.salary_min || "",
                    salary_max: data.salary_max || "",
                    experienceRequired: data.experienceRequired || "",
                    dueDate: data.dueDate || "",
                    postedDate: data.postedDate || "",
                    status: data.status || "DRAFT",
                    locations: data.locations?.length
                        ? data.locations
                        : [{ province: "", ward: "", detailAddress: "" }],
                });
            } catch (err) {
                console.error("Failed to fetch job", err);
            }
        };
        fetchJob();
    }, [jobId]);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleLocationChange = async (index: number, field: string, value: string) => {
        const updatedLocations = [...formData.locations];
        updatedLocations[index] = { ...updatedLocations[index], [field]: value };
        if (field === "province") {
            updatedLocations[index].ward = "";
            if (value) await getWards(value);
        }
        setFormData((prev) => ({ ...prev, locations: updatedLocations }));
    };

    const addLocation = () => {
        if (formData.locations.length >= 3) return;
        setFormData((prev) => ({
            ...prev,
            locations: [...prev.locations, { province: "", ward: "", detailAddress: "" }],
        }));
    };

    const removeLocation = (index: number) => {
        if (formData.locations.length <= 1) return;
        setFormData((prev) => ({ ...prev, locations: prev.locations.filter((_, i) => i !== index) }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const confirmed = window.confirm(
            jobId
                ? "Update this Job Card?"
                : "Are you sure you want to save this Job Card? Core information will become restricted after saving."
        );
        if (!confirmed) return;

        try {
            setLoading(true);
            const payload = {
                ...formData,
                company_id: companyId,
                postedDate: new Date().toLocaleString("sv-SE").replace(" ", "T"),
                status: "DRAFT",
            };

            if (jobId) {
                await updateJob(jobId, payload);
                toast.success("Job card updated successfully");
                return;
            }

            const data = await createJob(payload);
            if (setJobId) setJobId(data.id);
            toast.success("Job card saved successfully");
            nextStep();
        } catch (err) {
            console.error("Failed to save job", err);
            toast.error("Failed to save job");
        } finally {
            setLoading(false);
        }
    };

    const handleNextStep = () => {
        if (!jobId) {
            toast.warning("Please save Job Card first");
            return;
        }
        nextStep();
    };

    return (
        <div className="min-h-screen bg-gray-50">

            {/* ── Top Navigation Bar ── */}
            <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
                <div className="max-w-4xl mx-auto px-4 h-14 flex items-center gap-3">
                    <button
                        type="button"
                        onClick={() => router.push("/recruiter/jobs")}
                        className="flex items-center gap-2 text-sm text-gray-500 hover:text-[#00b14f] transition-colors group"
                    >
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
                        <span>Back to Jobs</span>
                    </button>

                    <span className="text-gray-300">|</span>

                    {/* Breadcrumb */}
                    <div className="flex items-center gap-1.5 text-sm">
                        <span className="text-gray-400">Recruiter</span>
                        <ChevronRight className="w-3.5 h-3.5 text-gray-300" />
                        <span className="text-gray-400">Jobs</span>
                        <ChevronRight className="w-3.5 h-3.5 text-gray-300" />
                        <span className="font-medium text-gray-700">
                            {jobId ? "Edit Job" : "Create Job"}
                        </span>
                    </div>

                    {/* Status pill */}
                    <div className="ml-auto flex items-center gap-1.5 text-xs font-medium text-amber-600 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full">
                        <Info className="w-3.5 h-3.5" />
                        DRAFT
                    </div>
                </div>
            </div>

            {/* ── Page Body ── */}
            <div className="max-w-4xl mx-auto px-4 py-8">

                {/* Page header */}
                <div className="mb-6">
                    <h1 className="text-lg font-bold text-gray-900">
                        Basic job card
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Fill in the details below. Fields marked with <span className="text-red-500">*</span> are required.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">

                    {/* ── Section: Basic Info ── */}
                    <SectionCard
                        icon={<Briefcase className="w-5 h-5 text-[#00b14f]" />}
                        title="Basic Information"
                    >
                        {/* Job Title */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                Job Title <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="title"
                                placeholder="e.g. Senior Frontend Developer"
                                value={formData.title}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00b14f]/40 focus:border-[#00b14f] transition"
                            />
                        </div>

                        {/* Experience & Deadline in a row */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                    <span className="flex items-center gap-1.5">
                                        <Clock className="w-4 h-4 text-gray-400" />
                                        Experience Required
                                    </span>
                                </label>
                                <select
                                    name="experienceRequired"
                                    value={formData.experienceRequired}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#00b14f]/40 focus:border-[#00b14f] transition bg-white"
                                >
                                    <option value="">Select experience level</option>
                                    <option value="No experience">No experience</option>
                                    <option value="1 year">1 year</option>
                                    <option value="2 years">2 years</option>
                                    <option value="3+ years">3+ years</option>
                                    <option value="5+ years">5+ years</option>
                                    <option value="10+ years">10+ years</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                    <span className="flex items-center gap-1.5">
                                        <CalendarDays className="w-4 h-4 text-gray-400" />
                                        Application Deadline
                                    </span>
                                </label>
                                <input
                                    name="dueDate"
                                    readOnly
                                    value={"Due day will be set automaticly 30 days after public day."}
                                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#00b14f]/40 focus:border-[#00b14f] transition"
                                />
                            </div>
                        </div>
                    </SectionCard>

                    {/* ── Section: Salary ── */}
                    <SectionCard
                        icon={<DollarSign className="w-5 h-5 text-[#00b14f]" />}
                        title="Salary Range"
                        badge="Attract more candidates"
                    >
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                    Minimum Salary (USD)
                                </label>
                                <div className="relative">
                                    {/* <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium">$</span> */}
                                    <input
                                        type="number"
                                        name="salary_min"
                                        placeholder="e.g. 1000"
                                        value={formData.salary_min}
                                        onChange={handleChange}
                                        className="pl-2.5 w-full pl-7 pr-4 py-2.5 rounded-lg border border-gray-300 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00b14f]/40 focus:border-[#00b14f] transition"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                    Maximum Salary (USD)
                                </label>
                                <div className="relative">
                                    {/* <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium">$</span> */}
                                    <input
                                        type="number"
                                        name="salary_max"
                                        placeholder="e.g. 3000"
                                        value={formData.salary_max}
                                        onChange={handleChange}
                                        className="w-full pl-7 pr-4 py-2.5 rounded-lg border border-gray-300 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00b14f]/40 focus:border-[#00b14f] transition"
                                    />
                                </div>
                            </div>
                        </div>
                        <p className="mt-3 text-xs text-gray-400 flex items-center gap-1.5">
                            <Info className="w-3.5 h-3.5" />
                            Jobs with a visible salary range get up to 3× more applicants.
                        </p>
                    </SectionCard>

                    {/* ── Section: Locations ── */}
                    <SectionCard
                        icon={<MapPin className="w-5 h-5 text-[#00b14f]" />}
                        title="Job Locations"
                        badge={`${formData.locations.length}/3`}
                    >
                        <div className="space-y-4">
                            {formData.locations.map((loc, index) => (
                                <div
                                    key={index}
                                    className="relative bg-gray-50 border border-gray-200 rounded-xl p-4"
                                >
                                    {/* Location index label */}
                                    <div className="flex items-center justify-between mb-3">
                                        <span className="text-xs font-semibold text-[#00b14f] uppercase tracking-wide">
                                            Location {index + 1}
                                        </span>
                                        {formData.locations.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => removeLocation(index)}
                                                className="flex items-center gap-1 text-xs text-red-400 hover:text-red-600 transition"
                                            >
                                                <Trash2 className="w-3.5 h-3.5" />
                                                Remove
                                            </button>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                                        <div>
                                            <label className="block text-xs font-medium text-gray-600 mb-1">
                                                Province <span className="text-red-500">*</span>
                                            </label>
                                            <select
                                                value={loc.province}
                                                onChange={(e) => handleLocationChange(index, "province", e.target.value)}
                                                required
                                                className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#00b14f]/40 focus:border-[#00b14f] transition bg-white"
                                            >
                                                <option value="">Select province</option>
                                                {provinces.map((p) => (
                                                    <option key={p.code} value={p.code}>{p.nameEn}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-gray-600 mb-1">
                                                Ward <span className="text-red-500">*</span>
                                            </label>
                                            <select
                                                value={loc.ward}
                                                onChange={(e) => handleLocationChange(index, "ward", e.target.value)}
                                                disabled={!loc.province}
                                                required
                                                className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#00b14f]/40 focus:border-[#00b14f] transition bg-white disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                <option value="">Select ward</option>
                                                {((loc.province && wardsMap[loc.province]) || []).map((w) => (
                                                    <option key={w.code} value={w.code}>{w.nameEn}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-medium text-gray-600 mb-1">
                                            Street / Building <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="e.g. 123 Nguyen Trai, District 1"
                                            value={loc.detailAddress}
                                            onChange={(e) => handleLocationChange(index, "detailAddress", e.target.value)}
                                            required
                                            className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00b14f]/40 focus:border-[#00b14f] transition"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>

                        {formData.locations.length < 3 && (
                            <button
                                type="button"
                                onClick={addLocation}
                                className="mt-3 flex items-center gap-2 text-sm font-medium text-[#00b14f] hover:text-[#009944] border border-dashed border-[#00b14f]/50 hover:border-[#00b14f] rounded-xl px-4 py-2.5 w-full justify-center transition"
                            >
                                <Plus className="w-4 h-4" />
                                Add Another Location
                            </button>
                        )}
                    </SectionCard>

                    {/* ── Action Buttons ── */}
                    <div className="flex flex-col sm:flex-row gap-3 pt-2 pb-10">
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 flex items-center justify-center gap-2 bg-[#00b14f] hover:bg-[#009944] text-white font-semibold py-3 rounded-xl transition disabled:opacity-50 disabled:cursor-not-allowed shadow-sm shadow-[#00b14f]/30 text-sm"
                        >
                            {loading ? (
                                <>
                                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Saving...
                                </>
                            ) : jobId ? (
                                <>
                                    <CheckCircle2 className="w-4 h-4" />
                                    Update Job Card
                                </>
                            ) : (
                                <>
                                    <CheckCircle2 className="w-4 h-4" />
                                    Save &amp; Continue
                                </>
                            )}
                        </button>

                        {jobId && (
                            <button
                                type="button"
                                onClick={handleNextStep}
                                className="flex-1 flex items-center justify-center gap-2 border border-gray-300 bg-white text-gray-800 font-semibold py-3 rounded-xl transition hover:bg-gray-50 text-sm"
                            >
                                Next Step
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
}

/* ── Helper: Section Card ── */
function SectionCard({
    icon,
    title,
    badge,
    children,
}: {
    icon: React.ReactNode;
    title: string;
    badge?: string;
    children: React.ReactNode;
}) {
    return (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            {/* Section header */}
            <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-100 bg-gray-50/60">
                <div className="w-8 h-8 rounded-lg bg-[#00b14f]/10 flex items-center justify-center">
                    {icon}
                </div>
                <h2 className="text-sm font-semibold text-gray-800">{title}</h2>
                {badge && (
                    <span className="ml-auto text-xs font-medium text-[#00b14f] bg-[#00b14f]/10 px-2.5 py-0.5 rounded-full">
                        {badge}
                    </span>
                )}
            </div>
            {/* Section body */}
            <div className="px-6 py-5">{children}</div>
        </div>
    );
}