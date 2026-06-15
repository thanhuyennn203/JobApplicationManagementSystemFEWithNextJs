"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
    createJobDetail, updateJobDetail, getJobDetailByJobId,
    publishJob
} from "@/services/jobs/jobDetailService";
import { JobDetail } from "@/types/jobs";
import { useToast } from "@/components/notification/ToastProvider";
import { ArrowLeft, ChevronRight, Info,Sparkles } from "lucide-react";
import { generateJobDetailByAI } from "@/services/jobs/jobDetailService";
import { getJobById, getGeneralInformationByJobId } from "@/services/jobs/jobs.service"; // adjust to your real function

export default function StepDetail({ jobId, prevStep, onPublished }: any) {
    const router = useRouter();
    const toast = useToast();
    const [formData, setFormData] = useState<JobDetail>({
        description: "",
        requirement: "",
        income: "",
        interest: "",
        allowance: "",
        working_equipment: "",
        working_location: "",
        working_time: "",
        apply_by: "",
        due_date: "",
        job_id: null,
        id: null,
    });

    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");
    const [hasDetail, setHasDetail] = useState(false);
    const [generating, setGenerating] = useState(false);
    // TEMP UI DEMO MODE
    // đổi false -> true nếu muốn test không cần BE
    const DEMO_MODE = false;

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {

        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));

    };
    const handleGenerateAI = async () => {
        if (!jobId) {
            toast.error("Job ID not found.");
            return;
        }

        setGenerating(true);

        try {
            // 1. Fetch job + general information
            const [job, generalInfo] = await Promise.all([
                getJobById(jobId),
                getGeneralInformationByJobId(jobId),
            ]);

            // 2. Call Groq to get suggestions
            const suggestion = await generateJobDetailByAI(job, generalInfo);

            // 3. Check if any field already has content
            const fields: (keyof JobDetail)[] = [
                "description",
                "requirement",
                "income",
                "interest",
                "allowance",
                "working_equipment",
                "working_location",
                "working_time",
                "apply_by",
            ];

            const hasExistingContent = fields.some(
                (field) => formData[field] && String(formData[field]).trim() !== ""
            );

            let overwrite = true;

            if (hasExistingContent) {
                overwrite = window.confirm(
                    "Some fields already have content. Do you want to overwrite them with the AI-generated suggestions?\n\nClick OK to overwrite, or Cancel to only fill in the empty fields."
                );
            }

            // 4. Merge into formData
            setFormData((prev) => {
                const updated = { ...prev };

                fields.forEach((field) => {
                    const current = prev[field];
                    const suggested = (suggestion as any)[field];

                    if (!suggested) return;

                    const isEmpty = !current || String(current).trim() === "";

                    if (isEmpty || overwrite) {
                        (updated as any)[field] = suggested;
                    }
                });

                return updated;
            });

            toast.success("AI suggestions generated successfully!");

        } catch (err: any) {
            console.error(err);
            toast.error(err.message || "Failed to generate AI suggestions.");
        } finally {
            setGenerating(false);
        }
    };

    const handleSubmit = async (
        e: React.FormEvent
    ) => {

        e.preventDefault();

        setLoading(true);
        setError("");
        setSuccess(false);

        try {

            // DEMO MODE
            if (DEMO_MODE) {

                await new Promise((resolve) =>
                    setTimeout(resolve, 1200)
                );

                setSuccess(true);
                setHasDetail(true);
                toast.success("Job detail saved successfully.");
                return;
            }

            let data;
            // console.log(hasDetail);
            if (hasDetail) {

                data = await updateJobDetail(
                    jobId,
                    formData
                );

            } else {

                data = await createJobDetail(
                    jobId,
                    formData
                );

            }
            setSuccess(true);
            toast.success("Job detail saved successfully.");

        } catch (err: any) {

            setError(err.message);
            toast.error(err.message || "Failed to save job detail.");

        } finally {

            setLoading(false);

        }

    };

    const handlePublish = async () => {

        const confirmed = window.confirm(
            "Ready to publish this job?"
        );

        if (!confirmed) return;

        try {

            // DEMO MODE
            if (DEMO_MODE) {

                toast.success("Job published successfully!");
                router.push("/recruiter/jobs");
                return;
            }

            await publishJob(jobId);
            toast.success("Job published successfully!");

            router.push(
                "/recruiter/jobs"
            );

        } catch (err : any) {

            console.error(err);
            toast.error(err.message || "Failed to publish job.");

        }

    };

    useEffect(() => {

        if (!jobId || DEMO_MODE) return;

        const fetchJobDetail = async () => {

            try {

                const data =
                    await getJobDetailByJobId(jobId);
                console.log("có details", data);
                if (!data) return;

                setFormData({
                    description: data.description || "",
                    requirement: data.requirement || "",
                    income: data.income || "",
                    interest: data.interest || "",
                    allowance: data.allowance || "",
                    working_equipment: data.working_equipment || "",
                    working_location: data.working_location || "",
                    working_time: data.working_time || "",
                    apply_by: data.apply_by || "",
                    due_date: data.due_date || "",
                    id: data.id || null,
                    job_id: data.job_id || null
                });

                setHasDetail(true);

            } catch (err) {

                console.error(
                    "Failed to fetch job detail",
                    err
                );

            }

        };

        fetchJobDetail();
    }, [jobId]);

    return (
        <div className="min-h-screen bg-[#f4f7fb]">
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

            <div className="mx-auto max-w-4xl mt-3">
                {/* HEADER */}
                <div className="mb-8 flex items-center justify-between">
                    <div className="mb-8 flex items-center justify-between">
                        <div>
                            <h1 className="text-xl font-bold text-[#1f2937]">
                                Job Details
                            </h1>
                            <p className="mt-2 text-sm text-gray-500">
                                Complete detailed information to attract better candidates.
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={handleGenerateAI}
                            disabled={generating}
                            className="flex items-center gap-2 rounded-2xl bg-[#00b14f]/10 border border-[#00b14f]/30 px-5 py-2.5 text-sm font-semibold text-[#00b14f] transition-all hover:bg-[#00b14f]/20 disabled:opacity-50"
                        >
                            <Sparkles className={`w-4 h-4 ${generating ? "animate-spin" : ""}`} />
                            {generating ? "Generating..." : "Generate by AI"}
                        </button>
                    </div>
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="space-y-3"
                >

                    {/* JOB DESCRIPTION */}
                    <div className="rounded-3xl bg-white p-7 shadow-sm border border-gray-100">

                        <div className="mb-5">
                            <h2 className="text-lg font-semibold text-gray-800">
                                Job Description
                            </h2>

                            <p className="mt-1 text-sm text-gray-500">
                                Describe responsibilities and role overview.
                            </p>
                        </div>

                        <textarea
                            name="description"
                            rows={7}
                            placeholder="Write detailed responsibilities..."
                            value={formData.description}
                            onChange={handleChange}
                            className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-4 text-sm outline-none transition-all focus:border-[#00b14f] focus:bg-white"
                        />

                    </div>

                    {/* REQUIREMENTS */}
                    <div className="rounded-3xl bg-white p-7 shadow-sm border border-gray-100">

                        <div className="mb-5">
                            <h2 className="text-lg font-semibold text-gray-800">
                                Job Requirements
                            </h2>

                            <p className="mt-1 text-sm text-gray-500">
                                Skills, experience, education requirements.
                            </p>
                        </div>

                        <textarea
                            name="requirement"
                            rows={7}
                            placeholder="Required skills and experience..."
                            value={formData.requirement}
                            onChange={handleChange}
                            className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-4 text-sm outline-none transition-all focus:border-[#00b14f] focus:bg-white"
                        />

                    </div>

                    {/* GRID */}
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">

                        {/* LEFT */}
                        <div className="space-y-6">

                            {/* INCOME */}
                            <div className="rounded-3xl bg-white p-7 shadow-sm border border-gray-100">

                                <h2 className="mb-4 text-lg font-semibold text-gray-800">
                                    Income
                                </h2>

                                <textarea
                                    name="income"
                                    rows={5}
                                    placeholder="Salary, bonus, compensation..."
                                    value={formData.income}
                                    onChange={handleChange}
                                    className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-4 text-sm outline-none transition-all focus:border-[#00b14f] focus:bg-white"
                                />

                            </div>

                            {/* BENEFITS */}
                            <div className="rounded-3xl bg-white p-7 shadow-sm border border-gray-100">

                                <h2 className="mb-4 text-lg font-semibold text-gray-800">
                                    Benefits
                                </h2>

                                <textarea
                                    name="interest"
                                    rows={5}
                                    placeholder="Insurance, holidays, bonus..."
                                    value={formData.interest}
                                    onChange={handleChange}
                                    className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-4 text-sm outline-none transition-all focus:border-[#00b14f] focus:bg-white"
                                />

                            </div>

                        </div>

                        {/* RIGHT */}
                        <div className="space-y-6">

                            {/* ALLOWANCE */}
                            <div className="rounded-3xl bg-white p-7 shadow-sm border border-gray-100">

                                <h2 className="mb-4 text-lg font-semibold text-gray-800">
                                    Allowance
                                </h2>

                                <textarea
                                    name="allowance"
                                    rows={5}
                                    placeholder="Transportation, lunch allowance..."
                                    value={formData.allowance}
                                    onChange={handleChange}
                                    className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-4 text-sm outline-none transition-all focus:border-[#00b14f] focus:bg-white"
                                />

                            </div>

                            {/* EQUIPMENT */}
                            <div className="rounded-3xl bg-white p-7 shadow-sm border border-gray-100">

                                <h2 className="mb-4 text-lg font-semibold text-gray-800">
                                    Working Equipment
                                </h2>

                                <textarea
                                    name="working_equipment"
                                    rows={5}
                                    placeholder="Laptop, monitor, software..."
                                    value={formData.working_equipment}
                                    onChange={handleChange}
                                    className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-4 text-sm outline-none transition-all focus:border-[#00b14f] focus:bg-white"
                                />

                            </div>

                        </div>

                    </div>

                    {/* EXTRA INFORMATION */}
                    <div className="rounded-3xl bg-white p-7 shadow-sm border border-gray-100">

                        <div className="mb-6">
                            <h2 className="text-lg font-semibold text-gray-800">
                                Additional Information
                            </h2>

                            <p className="mt-1 text-sm text-gray-500">
                                Workplace, application and schedule details.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                    Working Location
                                </label>

                                <input
                                    type="text"
                                    name="working_location"
                                    placeholder="Office location"
                                    value={formData.working_location}
                                    onChange={handleChange}
                                    className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition-all focus:border-[#00b14f] focus:bg-white"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                    Working Time
                                </label>

                                <input
                                    type="text"
                                    name="working_time"
                                    placeholder="Mon - Fri, 9AM - 6PM"
                                    value={formData.working_time}
                                    onChange={handleChange}
                                    className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition-all focus:border-[#00b14f] focus:bg-white"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                    Apply Method
                                </label>

                                <input
                                    type="text"
                                    name="apply_by"
                                    placeholder="Apply via email or system"
                                    value={formData.apply_by}
                                    onChange={handleChange}
                                    className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition-all focus:border-[#00b14f] focus:bg-white"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                    Application Deadline
                                </label>

                                <input
                                    readOnly
                                    value={"Applcation Deadline will be 30 days after posted day."}
                                    name="due_date"
                                    className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition-all focus:border-[#00b14f] focus:bg-white"
                                />
                            </div>

                        </div>

                    </div>

                    {/* ALERT */}
                    {success && (

                        <div className="rounded-2xl border border-[#00b14f]/20 bg-[#00b14f]/10 px-5 py-4 text-sm font-medium text-[#00b14f]">
                            Job detail saved successfully.
                        </div>

                    )}

                    {error && (

                        <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-medium text-red-600">
                            {error}
                        </div>

                    )}

                    {/* ACTION BUTTONS */}
                    <div className="sticky bottom-4 z-50">

                        <div className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-gray-200 bg-white p-5 shadow-xl backdrop-blur">

                            <button
                                onClick={prevStep}
                                type="button"
                                className="rounded-2xl border border-gray-200 px-6 py-3 text-sm font-semibold text-gray-700 transition-all hover:bg-gray-100"
                            >
                                ← Back
                            </button>

                            <div className="flex items-center gap-3">

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="rounded-2xl bg-gray-100 px-6 py-3 text-sm font-semibold text-gray-700 transition-all hover:bg-gray-200"
                                >
                                    {
                                        loading
                                            ? "Saving..."
                                            : "Save Detail"
                                    }
                                </button>

                                <button
                                    type="button"
                                    onClick={handlePublish}
                                    className="rounded-2xl bg-[#00b14f] px-7 py-3 text-sm font-semibold text-white shadow-lg shadow-[#00b14f]/30 transition-all hover:scale-[1.02] hover:bg-[#009245]"
                                >
                                    Publish Job →
                                </button>

                            </div>

                        </div>

                    </div>

                </form>

            </div>

        </div>

    );

}
