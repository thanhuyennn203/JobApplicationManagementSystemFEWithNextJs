"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import "@/styles/recruiter/GeneralInformation.css";
import { saveJobPostingTags, updateJobCategoryAndTemplate } from "@/services/jobs/tagService";
import { getGeneralInformationByJobId, getJobGenerateContext, saveGeneralInformation } from "@/services/jobs/jobs.service";
import { createCategory } from "@/services/jobs/categoryService";
import { getTemplatesByCategory, createTemplate } from "@/services/jobs/templateService";
import {
    JobCategory,
    JobTemplate,
    TagDTO,
    TagCategory,
    SelectedTag,
    JobGenerateContext,
} from "@/types/tagging";
import SearchableSelect from "@/components/jobs/SearchableSelect";
import SearchableTagInput from "@/components/jobs/SearchableTagInput";
import {
    ArrowLeft,
    ChevronRight,
    Info,
} from "lucide-react";
// ─── Constants ────────────────────────────────────────────────────────────────

const TAG_CATEGORIES: TagCategory[] = ["SKILLS", "REQUIREMENTS", "BENEFITS"];
const MAX_TAGS_PER_CATEGORY = 6;
const MAX_CUSTOM_INPUT_LENGTH = 80;

// groupedTags keys from BE are already SKILLS/REQUIREMENTS/BENEFITS
const TAG_CATEGORY_SET = new Set<TagCategory>(["SKILLS", "REQUIREMENTS", "BENEFITS"]);

type SelectedTagsByCategory = Record<TagCategory, SelectedTag[]>;

const emptySelectedTags = (): SelectedTagsByCategory => ({
    SKILLS: [],
    REQUIREMENTS: [],
    BENEFITS: [],
});

// ─── Types ────────────────────────────────────────────────────────────────────

interface StepBasicProps {
    nextStep?: () => void;
    prevStep?: () => void;
    jobId?: number;
    currentUserId?: number;
}

interface FormData {
    rank: string;
    education: string;
    numberOfRecruitment: number;
    workingStyle: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const toNum = (v: unknown): number | null => {
    if (typeof v === "number" && !Number.isNaN(v)) return v;
    if (typeof v === "string" && v.trim()) {
        const n = Number(v);
        return Number.isNaN(n) ? null : n;
    }
    return null;
};

const normalizeCategoryName = (c: JobCategory) =>
    c.name ?? c.categoryName ?? c.displayName ?? c.title ?? "";

const normalizeTemplateName = (t: JobTemplate) =>
    t.name ?? t.templateName ?? t.displayName ?? t.title ?? "";

const normalizeCategoryId = (t: JobTemplate): number =>
    toNum(t.categoryId) ??
    toNum(t.jobCategoryId) ??
    toNum(t.category_id) ??
    toNum(t.job_category_id) ??
    toNum(t.category?.id) ??
    toNum(t.jobCategory?.id) ??
    toNum(t.jobCategoryResponse?.id) ??
    0;

const getErrMsg = (err: unknown, fallback: string) =>
    err instanceof Error ? err.message : fallback;

// ─── Component ────────────────────────────────────────────────────────────────

export default function StepBasic({
    nextStep = () => undefined,
    prevStep = () => undefined,
    jobId,
    currentUserId,
}: StepBasicProps) {
    // ── Form ──────────────────────────────────────────────────────────────────
    const [formData, setFormData] = useState<FormData>({
        rank: "",
        education: "",
        numberOfRecruitment: 1,
        workingStyle: "",
    });

    useEffect(() => {
        if (!jobId) return;
        const fetchJobGeneralInfor = async () => {
            try {
                const data = await getGeneralInformationByJobId(jobId);
                setFormData({
                    rank: data?.rank,
                    education: data?.education,
                    numberOfRecruitment: data?.numberOfRecruitment,
                    workingStyle: data?.workingStyle
                });

            } catch (err) {
                console.error("Failed to fetch job", err);
            }

        };

        fetchJobGeneralInfor();

    }, [jobId]);

    // ── Category ──────────────────────────────────────────────────────────────
    const [categories, setCategories] = useState<JobCategory[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

    // new category form
    const [showNewCategory, setShowNewCategory] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState("");
    const [pendingNewCategory, setPendingNewCategory] = useState<{ name: string } | null>(null);

    // ── Template ──────────────────────────────────────────────────────────────
    const [allTemplates, setAllTemplates] = useState<JobTemplate[]>([]);
    const [filteredTemplates, setFilteredTemplates] = useState<JobTemplate[]>([]);
    const [selectedTemplate, setSelectedTemplate] = useState<number | null>(null);

    // new template form
    const [showNewTemplate, setShowNewTemplate] = useState(false);
    const [newTemplateName, setNewTemplateName] = useState("");
    const [pendingNewTemplate, setPendingNewTemplate] = useState<{ name: string; categoryId: number } | null>(null);

    // ── Tags ──────────────────────────────────────────────────────────────────
    // All tags available from current template (from groupedTags)
    const [availableTags, setAvailableTags] = useState<SelectedTagsByCategory>(emptySelectedTags());
    // Tags the user has actively selected
    const [selectedTags, setSelectedTags] = useState<SelectedTagsByCategory>(emptySelectedTags());
    // Context ref to restore selected state from selectedTagIds
    const contextRef = useRef<JobGenerateContext | null>(null);

    // ── UI ────────────────────────────────────────────────────────────────────
    const [loading, setLoading] = useState(false);
    const [initializing, setInitializing] = useState(true);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");
    const [fieldErrors, setFieldErrors] = useState<Partial<Record<string, string>>>({});

    // ─────────────────────────────────────────────────────────────────────────
    // Helpers
    // ─────────────────────────────────────────────────────────────────────────

    /** Convert groupedTags from context into SelectedTagsByCategory */
    const buildAvailableTagsFromContext = useCallback(
        (ctx: JobGenerateContext): SelectedTagsByCategory => {
            const result = emptySelectedTags();
            const grouped = ctx.groupedTags ?? {};

            for (const [rawKey, dtos] of Object.entries(grouped)) {
                const cat = rawKey.toUpperCase() as TagCategory;
                if (!TAG_CATEGORY_SET.has(cat) || !Array.isArray(dtos)) continue;

                result[cat] = dtos.map<SelectedTag>((dto) => ({
                    category: cat,
                    tagText: dto.tagText ?? dto.tagName ?? dto.name ?? dto.text ?? dto.value ?? "",
                    isUserCreated: Boolean(dto.isUserCreated),
                })).filter((t) => t.tagText)
                    .filter((t, i, arr) => arr.findIndex((x) => x.tagText === t.tagText) === i); // dedupe
            }

            return result;
        },
        []
    );

    /** Restore previously-selected tags using selectedTagIds + userCreatedTags */
    const buildSelectedTagsFromIds = useCallback(
        (ctx: JobGenerateContext, available: SelectedTagsByCategory): SelectedTagsByCategory => {
            const result = emptySelectedTags();
            const ids = new Set((ctx.selectedTagIds ?? []).map(Number));

            // Restore system tags by matching id in groupedTags
            if (ids.size > 0) {
                const grouped = ctx.groupedTags ?? {};
                for (const [rawKey, dtos] of Object.entries(grouped)) {
                    const cat = rawKey.toUpperCase() as TagCategory;
                    if (!TAG_CATEGORY_SET.has(cat) || !Array.isArray(dtos)) continue;
                    result[cat] = dtos
                        .filter((dto) => dto.id != null && ids.has(Number(dto.id)))
                        .map<SelectedTag>((dto) => ({
                            category: cat,
                            tagText: dto.tagText ?? "",
                            isUserCreated: false,
                        }))
                        .filter((t) => t.tagText);
                }
            }

            // Restore user-created tags by tagText directly
            const userCreated: TagDTO[] = (ctx as any).userCreatedTags ?? [];
            for (const dto of userCreated) {
                const cat = String(dto.category ?? "").toUpperCase() as TagCategory;
                if (!TAG_CATEGORY_SET.has(cat)) continue;
                const tagText = dto.tagText ?? "";
                if (!tagText) continue;
                if (!result[cat].some((t) => t.tagText === tagText)) {
                    result[cat].push({ category: cat, tagText, isUserCreated: true });
                }
            }

            return result;
        },
        []
    );

    // ─────────────────────────────────────────────────────────────────────────
    // Load context on mount
    // ─────────────────────────────────────────────────────────────────────────

    useEffect(() => {
        const init = async () => {
            setInitializing(true);
            try {
                const ctx = await getJobGenerateContext(jobId) as JobGenerateContext;
                console.log(ctx);
                contextRef.current = ctx;

                const normalized = {
                    categories: (ctx.categories ?? []).map((c) => ({
                        ...c,
                        name: normalizeCategoryName(c),
                    })),
                    templates: (ctx.templates ?? []).map((t) => ({
                        ...t,
                        categoryId: normalizeCategoryId(t),
                        name: normalizeTemplateName(t),
                    })),
                };

                setCategories(normalized.categories);
                setAllTemplates(normalized.templates);

                // Restore available tags from groupedTags immediately
                const available = buildAvailableTagsFromContext(ctx);
                setAvailableTags(available);

                // Restore selected tags from selectedTagIds
                if ((ctx.selectedTagIds ?? []).length > 0) {
                    const restored = buildSelectedTagsFromIds(ctx, available);
                    setSelectedTags(restored);
                }

                // Restore category & template selections (after tags so useEffect
                // on selectedTemplate doesn't clobber availableTags before we set them)
                const catId = toNum(ctx.selectedCategoryId);
                const tplId = toNum(ctx.selectedTemplateId);

                if (catId) setSelectedCategory(catId);
                if (tplId) setSelectedTemplate(tplId);
            } catch (err) {
                setError(getErrMsg(err, "Failed to load job context"));
            } finally {
                setInitializing(false);
            }
        };

        init();
    }, [jobId, buildAvailableTagsFromContext, buildSelectedTagsFromIds]);

    // ─────────────────────────────────────────────────────────────────────────
    // Filter templates when category changes
    // ─────────────────────────────────────────────────────────────────────────

    useEffect(() => {
        if (!selectedCategory) {
            setFilteredTemplates([]);
            setSelectedTemplate(null);
            return;
        }

        const local = allTemplates.filter((t) => t.categoryId === selectedCategory);

        if (local.length > 0) {
            setFilteredTemplates(local);
            // keep selectedTemplate if still valid
            setSelectedTemplate((prev) =>
                prev && local.some((t) => t.id === prev) ? prev : null
            );
            return;
        }

        // fetch from server if not cached
        getTemplatesByCategory(selectedCategory)
            .then((data) => {
                const normalized = data.map((t: JobTemplate) => ({
                    ...t,
                    categoryId: normalizeCategoryId(t),
                    name: normalizeTemplateName(t),
                }));
                setFilteredTemplates(normalized);
                setAllTemplates((prev) => {
                    const ids = new Set(prev.map((t) => t.id));
                    return [...prev, ...normalized.filter((t: JobTemplate) => !ids.has(t.id))];
                });
                setSelectedTemplate((prev) =>
                    prev && normalized.some((t: JobTemplate) => t.id === prev) ? prev : null
                );
            })
            .catch(() => setError("Failed to load templates"));
    }, [selectedCategory, allTemplates]);

    // ─────────────────────────────────────────────────────────────────────────
    // Reload available tags when template changes
    // ─────────────────────────────────────────────────────────────────────────

    useEffect(() => {
        // Skip if no template selected or no context yet
        if (!selectedTemplate || !contextRef.current) return;

        // groupedTags from context = global tag pool for suggestions.
        // Always show them as available regardless of which template is selected.
        // (When BE adds per-template tags endpoint, replace this with a fetch call)
        const available = buildAvailableTagsFromContext(contextRef.current!);
        setAvailableTags(available);
    }, [selectedTemplate, buildAvailableTagsFromContext]);

    // ─────────────────────────────────────────────────────────────────────────
    // Form handlers
    // ─────────────────────────────────────────────────────────────────────────

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: name === "numberOfRecruitment" ? Number(value) : value,
        }));
        setFieldErrors((prev) => ({ ...prev, [name]: undefined }));
    };

    // ─────────────────────────────────────────────────────────────────────────
    // Tag handlers
    // ─────────────────────────────────────────────────────────────────────────

    const toggleTag = (category: TagCategory, tagText: string, isUserCreated = false) => {
        setSelectedTags((prev) => {
            const list = prev[category];
            const exists = list.some((t) => t.tagText === tagText);

            if (exists) {
                return { ...prev, [category]: list.filter((t) => t.tagText !== tagText) };
            }

            if (list.length >= MAX_TAGS_PER_CATEGORY) {
                setError(`Maximum ${MAX_TAGS_PER_CATEGORY} tags per category`);
                return prev;
            }

            return {
                ...prev,
                [category]: [...list, { category, tagText, isUserCreated }],
            };
        });
        setError("");
    };

    const addCustomTag = (category: TagCategory, value: string) => {
        const tagText = value.trim();

        if (!tagText) {
            setError("Tag cannot be empty");
            return;
        }

        if (tagText.length > MAX_CUSTOM_INPUT_LENGTH) {
            setError(`Tag must be under ${MAX_CUSTOM_INPUT_LENGTH} characters`);
            return;
        }

        const exists = selectedTags[category].some(
            (t) => t.tagText.toLowerCase() === tagText.toLowerCase()
        );

        if (exists) {
            setError("Tag already added");
            return;
        }

        if (selectedTags[category].length >= MAX_TAGS_PER_CATEGORY) {
            setError(`Maximum ${MAX_TAGS_PER_CATEGORY} tags per category`);
            return;
        }

        toggleTag(category, tagText, true);
    };

    const removeTag = (category: TagCategory, tagText: string) => {
        setSelectedTags((prev) => ({
            ...prev,
            [category]: prev[category].filter((t) => t.tagText !== tagText),
        }));
    };

    // ─────────────────────────────────────────────────────────────────────────
    // New Category
    // ─────────────────────────────────────────────────────────────────────────

    const handleAddNewCategory = () => {
        const name = newCategoryName.trim();
        if (!name) {
            setError("Category name is required");
            return;
        }
        if (name.length > MAX_CUSTOM_INPUT_LENGTH) {
            setError(`Category name must be under ${MAX_CUSTOM_INPUT_LENGTH} characters`);
            return;
        }
        // Store as pending — will be created on save
        setPendingNewCategory({ name });
        // Show as a temporary option in the list with id = -1
        const tempCat: JobCategory = { id: -1, name, system: false };
        setCategories((prev) => [...prev.filter((c) => c.id !== -1), tempCat]);
        setSelectedCategory(-1);
        setShowNewCategory(false);
        setNewCategoryName("");
        setError("");
    };

    // ─────────────────────────────────────────────────────────────────────────
    // New Template
    // ─────────────────────────────────────────────────────────────────────────

    const handleAddNewTemplate = () => {
        const name = newTemplateName.trim();
        if (!name) {
            setError("Template name is required");
            return;
        }
        if (name.length > MAX_CUSTOM_INPUT_LENGTH) {
            setError(`Template name must be under ${MAX_CUSTOM_INPUT_LENGTH} characters`);
            return;
        }
        if (!selectedCategory) {
            setError("Select a category first");
            return;
        }

        setPendingNewTemplate({ name, categoryId: selectedCategory });
        const tempTpl: JobTemplate = {
            id: -1,
            categoryId: selectedCategory,
            name,
            system: false,
        };
        setAllTemplates((prev) => [...prev.filter((t) => t.id !== -1), tempTpl]);
        setFilteredTemplates((prev) => [...prev.filter((t) => t.id !== -1), tempTpl]);
        setSelectedTemplate(-1);
        setSelectedTags(emptySelectedTags());
        setAvailableTags(emptySelectedTags());
        setShowNewTemplate(false);
        setNewTemplateName("");
        setError("");
    };

    // ─────────────────────────────────────────────────────────────────────────
    // Validation
    // ─────────────────────────────────────────────────────────────────────────

    const validate = (): boolean => {
        const errs: Record<string, string> = {};

        if (!formData.rank) errs.rank = "Rank is required";
        if (!formData.education) errs.education = "Education is required";
        if (!formData.numberOfRecruitment || formData.numberOfRecruitment < 1)
            errs.numberOfRecruitment = "Must be at least 1";
        if (!formData.workingStyle) errs.workingStyle = "Working style is required";
        if (!selectedCategory) errs.category = "Please select a category";
        if (!selectedTemplate) errs.template = "Please select a template";

        const totalTags = TAG_CATEGORIES.reduce(
            (sum, cat) => sum + selectedTags[cat].length, 0
        );
        if (totalTags === 0) errs.tags = "Please select at least one tag";

        setFieldErrors(errs);
        if (Object.keys(errs).length > 0) {
            setError("Please fill in all required fields");
            return false;
        }

        setError("");
        return true;
    };

    // ─────────────────────────────────────────────────────────────────────────
    // Submit
    // ─────────────────────────────────────────────────────────────────────────

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!jobId) { setError("Job ID is missing"); return; }
        if (!validate()) return;

        if (!window.confirm("Save all General Information and Tags?")) return;

        setLoading(true);
        setError("");

        try {
            let resolvedCategoryId = selectedCategory!;
            let resolvedTemplateId = selectedTemplate!;

            // Step 1: Create new category if pending
            if (pendingNewCategory && selectedCategory === -1) {
                const created = await createCategory({ name: pendingNewCategory.name });
                resolvedCategoryId = created.id;
                setPendingNewCategory(null);
                setCategories((prev) =>
                    prev.map((c) => (c.id === -1 ? { ...c, id: created.id } : c))
                );
                setSelectedCategory(created.id);
            }

            // Step 2: Create new template if pending
            if (pendingNewTemplate && selectedTemplate === -1) {
                const created = await createTemplate({
                    categoryId: resolvedCategoryId,
                    name: pendingNewTemplate.name,
                });
                resolvedTemplateId = created.id;
                setPendingNewTemplate(null);
                setAllTemplates((prev) =>
                    prev.map((t) => (t.id === -1 ? { ...t, id: created.id } : t))
                );
                setFilteredTemplates((prev) =>
                    prev.map((t) => (t.id === -1 ? { ...t, id: created.id } : t))
                );
                setSelectedTemplate(created.id);
            }

            // Step 3: Save category + template link
            await updateJobCategoryAndTemplate(jobId, resolvedCategoryId, resolvedTemplateId);

            // Step 4: Save general information
            await saveGeneralInformation(jobId, {
                ...formData,
                jobCategoryId: resolvedCategoryId,
                jobTemplateId: resolvedTemplateId,
                currentStep: 2,
            });

            // Step 5: Save tags in batch
            const allTags: SelectedTag[] = [
                ...selectedTags.SKILLS,
                ...selectedTags.REQUIREMENTS,
                ...selectedTags.BENEFITS,
            ];

            const tagResponse = await saveJobPostingTags(
                jobId,
                allTags,
                currentUserId ?? 1,
                resolvedTemplateId
            );

            if (!tagResponse.success) {
                throw new Error(tagResponse.message || "Failed to save tags");
            }

            setSuccess(true);
            setTimeout(() => nextStep(), 1000);

        } catch (err) {
            setError(getErrMsg(err, "Failed to save. Please try again."));
        } finally {
            setLoading(false);
        }
    };

    const handleNextStep = () => {
        if (!validate()) return;
        nextStep();
    };

    // ─────────────────────────────────────────────────────────────────────────
    // Render helpers
    // ─────────────────────────────────────────────────────────────────────────

    const FieldError = ({ field }: { field: string }) =>
        fieldErrors[field] ? (
            <p className="text-red-500 text-xs mt-1">{fieldErrors[field]}</p>
        ) : null;

    const inputCls = (field: string) =>
        `w-full ${fieldErrors[field] ? "border-red-400 focus:ring-red-300" : ""}`;

    // ─────────────────────────────────────────────────────────────────────────
    // Loading skeleton
    // ─────────────────────────────────────────────────────────────────────────

    if (initializing) {
        return (
            <div className="generalInfo-container">
                <div className="general-info-container">
                    <div className="space-y-4 animate-pulse p-8">
                        <div className="h-6 bg-gray-100 rounded w-48" />
                        <div className="grid grid-cols-2 gap-4">
                            {[...Array(4)].map((_, i) => (
                                <div key={i} className="h-12 bg-gray-100 rounded-xl" />
                            ))}
                        </div>
                        <div className="h-32 bg-gray-100 rounded-2xl" />
                    </div>
                </div>
            </div>
        );
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Main render
    // ─────────────────────────────────────────────────────────────────────────

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

            <div className="general-info-container">
                <form className="general-info-form" onSubmit={handleSubmit}>
                    {/* Page header */}
                    <div className="mb-6">
                        <h1 className="text-lg font-bold text-gray-900">
                           General Infomation
                        </h1>
                        <p className="text-sm text-gray-500 mt-1">
                            Fill in the details below. Fields marked with <span className="text-red-500">*</span> are required.
                        </p>
                    </div>
                    {/* ── Basic Fields ── */}
                    <div className="grid-2">
                        <div className="form-group">
                            <label>Rank <span className="text-red-500">*</span></label>
                            <select
                                name="rank"
                                value={formData.rank}
                                onChange={handleChange}
                                className={inputCls("rank")}
                            >
                                <option value="">Select Rank</option>
                                {["Intern", "Staff", "Junior", "Middle", "Senior", "Lead"].map((r) => (
                                    <option key={r} value={r}>{r}</option>
                                ))}
                            </select>
                            <FieldError field="rank" />
                        </div>

                        <div className="form-group">
                            <label>Education <span className="text-red-500">*</span></label>
                            <select
                                name="education"
                                value={formData.education}
                                onChange={handleChange}
                                className={inputCls("education")}
                            >
                                <option value="">Select Education</option>
                                {["College", "Bachelor", "Master"].map((e) => (
                                    <option key={e} value={e}>{e}</option>
                                ))}
                            </select>
                            <FieldError field="education" />
                        </div>
                    </div>

                    <div className="grid-2">
                        <div className="form-group">
                            <label>Number of Recruitment <span className="text-red-500">*</span></label>
                            <input
                                type="number"
                                min={1}
                                name="numberOfRecruitment"
                                value={formData.numberOfRecruitment}
                                onChange={handleChange}
                                className={inputCls("numberOfRecruitment")}
                            />
                            <FieldError field="numberOfRecruitment" />
                        </div>

                        <div className="form-group">
                            <label>Working Style <span className="text-red-500">*</span></label>
                            <select
                                name="workingStyle"
                                value={formData.workingStyle}
                                onChange={handleChange}
                                className={inputCls("workingStyle")}
                            >
                                <option value="">Select Style</option>
                                {["Remote", "Hybrid", "On-site"].map((s) => (
                                    <option key={s} value={s}>{s}</option>
                                ))}
                            </select>
                            <FieldError field="workingStyle" />
                        </div>
                    </div>

                    {/* ── Category ── */}
                    <div className="rounded-3xl bg-white p-7 shadow-sm border border-gray-100 mb-2.5">
                        <div className="mb-6 flex items-start justify-between">
                            <div>
                                <h2 className="text-lg font-semibold text-gray-800">Job Category</h2>
                                <p className="mt-1 text-sm text-gray-500">
                                    Select the category that best fits this role.
                                </p>
                            </div>
                            {!showNewCategory && (
                                <button
                                    type="button"
                                    onClick={() => setShowNewCategory(true)}
                                    className="
                                        text-sm font-medium text-[#00b14f]
                                        hover:text-[#009245] transition
                                        flex items-center gap-1 mt-1
                                    "
                                >
                                    <span className="text-lg leading-none">+</span> New Category
                                </button>
                            )}
                        </div>

                        {/* New category inline form */}
                        {showNewCategory && (
                            <div className="mb-5 flex gap-2 items-center">
                                <input
                                    type="text"
                                    placeholder={`Category name (max ${MAX_CUSTOM_INPUT_LENGTH} chars)`}
                                    maxLength={MAX_CUSTOM_INPUT_LENGTH}
                                    maxTags={MAX_TAGS_PER_CATEGORY}
                                    value={newCategoryName}
                                    onChange={(e) => setNewCategoryName(e.target.value)}
                                    className="flex-1 rounded-xl border border-gray-200 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#00b14f]/30"
                                />
                                <button
                                    type="button"
                                    onClick={handleAddNewCategory}
                                    className="px-4 py-2 rounded-xl bg-[#00b14f] text-white text-sm font-medium hover:bg-[#009245] transition"
                                >
                                    Add
                                </button>
                                <button
                                    type="button"
                                    onClick={() => { setShowNewCategory(false); setNewCategoryName(""); }}
                                    className="px-4 py-2 rounded-xl border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition"
                                >
                                    Cancel
                                </button>
                            </div>
                        )}

                        <SearchableSelect
                            label="Category"
                            placeholder="Search category..."
                            items={categories}
                            selectedItem={categories.find((c) => c.id === selectedCategory) || null}
                            displayKey="name"
                            onSelect={(item) => {
                                setSelectedCategory(item.id);
                                setSelectedTemplate(null);
                                setSelectedTags(emptySelectedTags());
                                setAvailableTags(emptySelectedTags());
                                setFieldErrors((prev) => ({ ...prev, category: undefined }));
                            }}
                        />
                        <FieldError field="category" />

                        {/* Pending category badge */}
                        {pendingNewCategory && selectedCategory === -1 && (
                            <p className="mt-2 text-xs text-amber-600">
                                ⚠ "{pendingNewCategory.name}" will be created when you save.
                            </p>
                        )}
                    </div>

                    {/* ── Template ── */}
                    {selectedCategory && (
                        <div className="rounded-3xl bg-white p-7 shadow-sm border border-gray-100 mb-2.5">
                            <div className="mb-6 flex items-start justify-between">
                                <div>
                                    <h2 className="text-lg font-semibold text-gray-800">Job Template</h2>
                                    <p className="mt-1 text-sm text-gray-500">
                                        Select a hiring template for this category.
                                    </p>
                                </div>
                                {!showNewTemplate && (
                                    <button
                                        type="button"
                                        onClick={() => setShowNewTemplate(true)}
                                        className="
                                            text-sm font-medium text-[#00b14f]
                                            hover:text-[#009245] transition
                                            flex items-center gap-1 mt-1
                                        "
                                    >
                                        <span className="text-lg leading-none">+</span> New Template
                                    </button>
                                )}
                            </div>

                            {/* New template inline form */}
                            {showNewTemplate && (
                                <div className="mb-5 flex gap-2 items-center">
                                    <input
                                        type="text"
                                        placeholder={`Template name (max ${MAX_CUSTOM_INPUT_LENGTH} chars)`}
                                        maxLength={MAX_CUSTOM_INPUT_LENGTH}
                                        maxTags={MAX_TAGS_PER_CATEGORY}
                                        value={newTemplateName}
                                        onChange={(e) => setNewTemplateName(e.target.value)}
                                        className="flex-1 rounded-xl border border-gray-200 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#00b14f]/30"
                                    />
                                    <button
                                        type="button"
                                        onClick={handleAddNewTemplate}
                                        className="px-4 py-2 rounded-xl bg-[#00b14f] text-white text-sm font-medium hover:bg-[#009245] transition"
                                    >
                                        Add
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => { setShowNewTemplate(false); setNewTemplateName(""); }}
                                        className="px-4 py-2 rounded-xl border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            )}

                            <SearchableSelect
                                label="Template"
                                placeholder="Search template..."
                                items={filteredTemplates}
                                selectedItem={filteredTemplates.find((t) => t.id === selectedTemplate) || null}
                                displayKey="name"
                                onSelect={(item) => {
                                    if (item.id !== selectedTemplate) {
                                        setSelectedTags(emptySelectedTags());
                                    }
                                    setSelectedTemplate(item.id);
                                    setFieldErrors((prev) => ({ ...prev, template: undefined }));
                                }}
                            />
                            <FieldError field="template" />

                            {pendingNewTemplate && selectedTemplate === -1 && (
                                <p className="mt-2 text-xs text-amber-600">
                                    ⚠ "{pendingNewTemplate.name}" will be created when you save.
                                </p>
                            )}
                        </div>
                    )}

                    {/* ── Tags ── */}
                    {selectedTemplate && (
                        <div className="rounded-3xl bg-white p-7 shadow-sm border border-gray-100 space-y-8">
                            <div>
                                <h2 className="text-lg font-semibold text-gray-800">Smart Tags</h2>
                                <p className="mt-1 text-sm text-gray-500">
                                    Add searchable tags to improve candidate matching.
                                    Max {MAX_TAGS_PER_CATEGORY} per section · Custom tags max {MAX_CUSTOM_INPUT_LENGTH} chars.
                                </p>
                            </div>

                            {TAG_CATEGORIES.map((cat) => (
                                <SearchableTagInput
                                    key={cat}
                                    title={cat.charAt(0) + cat.slice(1).toLowerCase()}
                                    suggestions={availableTags[cat].map((t) => t.tagText)}
                                    selectedTags={selectedTags[cat].map((t) => t.tagText)}
                                    maxLength={MAX_CUSTOM_INPUT_LENGTH}
                                    maxTags={MAX_TAGS_PER_CATEGORY}
                                    onAdd={(tag) => {
                                        const isFromSuggestions = availableTags[cat].some(
                                            (t) => t.tagText === tag
                                        );
                                        toggleTag(cat, tag, !isFromSuggestions);
                                    }}
                                    onRemove={(tag) => removeTag(cat, tag)}
                                />
                            ))}

                            {fieldErrors.tags && (
                                <p className="text-red-500 text-sm">{fieldErrors.tags}</p>
                            )}
                        </div>
                    )}

                    {/* ── Actions ── */}
                    <div className="flex items-center gap-4 mt-12">
                        <button
                            type="button"
                            onClick={prevStep}
                            className="
                                px-6 py-3 rounded-xl border border-gray-300
                                bg-white text-gray-800 font-medium
                                hover:bg-gray-100 transition
                            "
                        >
                            Back
                        </button>

                        <button
                            type="submit"
                            disabled={loading}
                            className="
                                flex-1 bg-[#00b14f] hover:bg-[#009245]
                                text-white py-3 rounded-xl font-semibold
                                transition disabled:opacity-50 disabled:cursor-not-allowed
                            "
                        >
                            {loading ? "Saving..." : "Save & Continue"}
                        </button>

                        <button
                            type="button"
                            onClick={handleNextStep}
                            className="
                                px-6 py-3 rounded-xl bg-gray-100
                                text-gray-900 font-medium
                                hover:bg-gray-200 transition
                            "
                        >
                            Next Step
                        </button>
                    </div>

                    {/* ── Messages ── */}
                    {success && (
                        <p className="text-green-600 mt-4 text-sm font-medium">
                            ✓ Saved successfully!
                        </p>
                    )}
                    {error && (
                        <p className="text-red-500 mt-4 text-sm font-medium">✗ {error}</p>
                    )}
                </form>
            </div>
        </div>
    );
}