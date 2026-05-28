"use client";

import { useEffect, useState } from "react";
import "@/styles/recruiter/GeneralInformation.css";
import {
    getSuggestedTags,
    saveJobPostingTags
} from "@/services/jobs/tagService";
import { getJobGenerateContext, saveGeneralInformation } from "@/services/jobs/jobs.service";
import { createCategory } from "@/services/jobs/categoryService";
import { getTemplatesByCategory, createTemplate } from "@/services/jobs/templateService";
import { getGeneralInformationByJobId } from "@/services/jobs/jobGeneralInfor.service";
import { getJobPostingTags } from "@/services/jobs/tagService";
import {
    JobCategory,
    JobTemplate,
    SuggestedTagsResponse,
    SelectedTag,
    TagDTO
} from "@/types/tagging";
import { useTagValidation } from "@/hooks/useTagValidation";
import SearchableSelect from "@/components/jobs/SearchableSelect";
import SearchableTagInput from "@/components/jobs/SearchableTagInput";

type SupportedTagCategory = "SKILLS" | "REQUIREMENTS" | "BENEFITS";

type SelectedTagsByCategory = Record<SupportedTagCategory, SelectedTag[]>;

interface StepBasicProps {
    nextStep?: () => void;
    prevStep?: () => void;
    jobId?: number;
    currentUserId?: number;
}

const SUPPORTED_TAG_CATEGORIES: SupportedTagCategory[] = [
    "SKILLS",
    "REQUIREMENTS",
    "BENEFITS"
];

export default function StepBasic({
    nextStep = () => undefined,
    prevStep = () => undefined,
    jobId,
    currentUserId
}: StepBasicProps) {

    // Validation Hook
    const {
        validateUserTag,
        validateGeneralInfo,
        validateCategory,
        validateTemplate,
        validateTagSelection,
        clearErrors,
        getError
    } = useTagValidation();

    // General Info
    const [formData, setFormData] = useState({
        rank: "",
        education: "",
        numberOfRecruitment: 1,
        workingStyle: ""
    });

    // Category / Template
    const [categories, setCategories] = useState<JobCategory[]>([]);
    const [templates, setTemplates] = useState<JobTemplate[]>([]);
    const [allTemplates, setAllTemplates] = useState<JobTemplate[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
    const [selectedTemplate, setSelectedTemplate] = useState<number | null>(null);

    // Create Category / Template
    const [newCategoryName, setNewCategoryName] = useState("");
    const [newTemplateName, setNewTemplateName] = useState("");

    // Tags - All stored locally until save
    const [suggestedTags, setSuggestedTags] = useState<SuggestedTagsResponse>({
        skills: [],
        requirements: [],
        benefits: []
    });

    const [popularTags, setPopularTags] = useState<SuggestedTagsResponse>({
        skills: [],
        requirements: [],
        benefits: []
    });

    const [selectedTags, setSelectedTags] = useState<SelectedTagsByCategory>({
        SKILLS: [],
        REQUIREMENTS: [],
        BENEFITS: []
    });


    // UI States
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");
    const [creatingCategory, setCreatingCategory] = useState(false);
    const [creatingTemplate, setCreatingTemplate] = useState(false);

    const toNumberOrNull = (value: unknown): number | null => {
        if (typeof value === "number") {
            return value;
        }

        if (typeof value === "string" && value.trim()) {
            const parsed = Number(value);
            return Number.isNaN(parsed) ? null : parsed;
        }

        return null;
    };

    const normalizeCategory = (category: JobCategory): JobCategory => ({
        ...category,
        id: toNumberOrNull(category.id) ?? 0,
        name:
            category.name ??
            category.categoryName ??
            category.displayName ??
            category.title ??
            ""
    });

    const normalizeTemplate = (template: JobTemplate): JobTemplate => ({
        ...template,
        id: toNumberOrNull(template.id) ?? 0,
        categoryId:
            toNumberOrNull(template.categoryId) ??
            toNumberOrNull(template.jobCategoryId) ??
            toNumberOrNull(template.category_id) ??
            toNumberOrNull(template.job_category_id) ??
            toNumberOrNull(template.category?.id) ??
            toNumberOrNull(template.jobCategory?.id) ??
            toNumberOrNull(template.jobCategoryResponse?.id) ??
            0,
        name:
            template.name ??
            template.templateName ??
            template.displayName ??
            template.title ??
            ""
    });

    const toSuggestionTags = (tags: TagDTO[] = []): SuggestedTagsResponse => {
        return tags.reduce<SuggestedTagsResponse>(
            (acc, tag) => {
                const category = String(tag.category ?? "").toUpperCase();
                const tagText =
                    tag.tagText ??
                    tag.tagName ??
                    tag.name ??
                    tag.text ??
                    tag.value ??
                    "";

                if (!tagText) {
                    return acc;
                }

                if (category === "SKILLS") {
                    acc.skills.push(tagText);
                }

                if (category === "REQUIREMENTS") {
                    acc.requirements.push(tagText);
                }

                if (category === "BENEFITS") {
                    acc.benefits.push(tagText);
                }

                return acc;
            },
            {
                skills: [],
                requirements: [],
                benefits: []
            }
        );
    };

    const toSelectedTags = (tags: TagDTO[] = []) => {
        return tags.reduce<SelectedTagsByCategory>(
            (acc, tag) => {
                const category = String(tag.category ?? "").toUpperCase();
                const tagText =
                    tag.tagText ??
                    tag.tagName ??
                    tag.name ??
                    tag.text ??
                    tag.value ??
                    "";

                if (
                    !tagText ||
                    !SUPPORTED_TAG_CATEGORIES.includes(category as SupportedTagCategory)
                ) {
                    return acc;
                }

                const supportedCategory = category as SupportedTagCategory;

                acc[supportedCategory].push({
                    category: supportedCategory,
                    tagText,
                    isUserCreated: Boolean(tag.isUserCreated)
                });

                return acc;
            },
            {
                SKILLS: [],
                REQUIREMENTS: [],
                BENEFITS: []
            }
        );
    };

    const clearSelectedTags = () => {
        setSelectedTags({
            SKILLS: [],
            REQUIREMENTS: [],
            BENEFITS: []
        });
    };

    const getErrorMessage = (
        err: unknown,
        fallback: string
    ) => err instanceof Error ? err.message : fallback;

    // Fetch context and existing data
    useEffect(() => {
        const fetchContext = async () => {
            try {
                const [context, existingGeneralInfo, existingTagsResponse] =
                    await Promise.all([
                        getJobGenerateContext(jobId),
                        jobId
                            ? getGeneralInformationByJobId(jobId)
                            : Promise.resolve(null),
                        jobId
                            ? getJobPostingTags(jobId).catch(() => null)
                            : Promise.resolve(null)
                    ]);

                const normalizedCategories = (context.categories ?? [])
                    .map(normalizeCategory);
                const normalizedTemplates = (context.templates ?? [])
                    .map(normalizeTemplate);

                setCategories(normalizedCategories);
                setAllTemplates(normalizedTemplates);
                setPopularTags(toSuggestionTags(context.tags ?? []));

                const generalInfo =
                    existingGeneralInfo ??
                    context.generalInformation;

                if (generalInfo) {
                    setFormData({
                        rank: generalInfo.rank ?? "",
                        education: generalInfo.education ?? "",
                        numberOfRecruitment: generalInfo.numberOfRecruitment ?? 1,
                        workingStyle: generalInfo.workingStyle ?? ""
                    });

                    setSelectedCategory(
                        toNumberOrNull(generalInfo.jobCategoryId) ??
                        toNumberOrNull(generalInfo.categoryID) ??
                        toNumberOrNull(generalInfo.categoryId) ??
                        toNumberOrNull(generalInfo.job_category_id) ??
                        toNumberOrNull(generalInfo.category?.id) ??
                        toNumberOrNull(generalInfo.jobCategory?.id) ??
                        null
                    );

                    setSelectedTemplate(
                        toNumberOrNull(generalInfo.jobTemplateId) ??
                        toNumberOrNull(generalInfo.templateID) ??
                        toNumberOrNull(generalInfo.templateId) ??
                        toNumberOrNull(generalInfo.jobTypeTemplateId) ??
                        toNumberOrNull(generalInfo.job_template_id) ??
                        toNumberOrNull(generalInfo.template?.id) ??
                        toNumberOrNull(generalInfo.jobTemplate?.id) ??
                        null
                    );
                }

                const existingTags =
                    Array.isArray(existingTagsResponse)
                        ? existingTagsResponse
                        : existingTagsResponse?.tags ?? [];

                const selectedTagSource =
                    existingTags.length > 0
                        ? existingTags
                        : context.tags ?? [];

                if (selectedTagSource.length > 0) {
                    setSelectedTags(toSelectedTags(selectedTagSource));
                }
            } catch (err) {
                console.error("Error fetching job generate context:", err);
                setError("Failed to load job context");
            }
        };

        fetchContext();
    }, [jobId]);

    // Fetch Templates When Category Changes
    useEffect(() => {
        if (!selectedCategory) {
            setTemplates([]);
            setSelectedTemplate(null);
            return;
        }

        const matchingTemplates = allTemplates
            .filter(template => template.categoryId === selectedCategory);

        if (matchingTemplates.length > 0) {
            setTemplates(matchingTemplates);
            setSelectedTemplate(prev =>
                prev && matchingTemplates.some(template => template.id === prev)
                    ? prev
                    : null
            );
            return;
        }

        const fetchTemplates = async () => {
            try {
                const data = await getTemplatesByCategory(selectedCategory);
                setTemplates(data.map(normalizeTemplate));
                setSelectedTemplate(prev =>
                    prev && data.some(template => template.id === prev)
                        ? prev
                        : null
                );
            } catch (err) {
                console.error("Error fetching templates:", err);
                setError("Failed to load templates");
            }
        };

        fetchTemplates();
    }, [allTemplates, selectedCategory]);

    // Fetch Suggested Tags When Template Changes
    useEffect(() => {
        if (!selectedTemplate) {
            setSuggestedTags({
                skills: [],
                requirements: [],
                benefits: []
            });
            return;
        }

        const fetchTags = async () => {
            try {
                const data = await getSuggestedTags(selectedTemplate);
                setSuggestedTags(data);
            } catch (err) {
                console.error("Error fetching suggested tags:", err);
            }
        };

        fetchTags();
    }, [selectedTemplate]);

    // Handle Change
    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]:
                name === "numberOfRecruitment"
                    ? Number(value)
                    : value
        }));
        if (getError(name)) {
            clearErrors();
        }
    };

    // Merge Tags (deduplicate)
    const mergeTags = (popular: string[], suggested: string[]) => {
        return [
            ...new Set([
                ...suggested,
                ...popular
            ])
        ];
    };

    // Toggle Tag
    const toggleTag = (
        category: SupportedTagCategory,
        tag: string
    ) => {
        const exists = selectedTags[category]
            .some(t => t.tagText === tag);

        if (exists) {
            setSelectedTags(prev => ({
                ...prev,
                [category]:
                    prev[category]
                        .filter(
                            t => t.tagText !== tag
                        )
            }));
            return;
        }

        if (selectedTags[category].length >= 6) {
            alert("Maximum 6 tags per category");
            return;
        }

        setSelectedTags(prev => ({
            ...prev,
            [category]: [
                ...prev[category],
                {
                    category,
                    tagText: tag,
                    isUserCreated: false
                }
            ]
        }));
    };

    // Add Custom Tag
    const addCustomTag = (
        category: SupportedTagCategory,
        value: string
    ) => {
        if (!validateUserTag(value)) {
            setError(getError("tagText") || "Invalid tag");
            return;
        }

        const tagText = value.trim();

        const exists = selectedTags[category]
            .some(t => t.tagText.toLowerCase() === tagText.toLowerCase());

        if (exists) {
            setError("Tag already selected");
            return;
        }

        if (selectedTags[category].length >= 6) {
            setError("Maximum 6 tags per category");
            return;
        }

        setSelectedTags(prev => ({
            ...prev,
            [category]: [
                ...prev[category],
                {
                    category,
                    tagText,
                    isUserCreated: true
                }
            ]
        }));

        clearErrors();
        setError("");
    };

    // Remove Tag
    const removeTag = (
        category: SupportedTagCategory,
        tagText: string
    ) => {
        setSelectedTags(prev => ({
            ...prev,
            [category]:
                prev[category]
                    .filter(
                        t => t.tagText !== tagText
                    )
        }));
    };

    // Create Category
    const handleCreateCategory = async () => {
        if (!newCategoryName.trim()) {
            setError("Category name is required");
            return;
        }

        setCreatingCategory(true);
        clearErrors();
        setError("");

        try {
            const created = await createCategory({
                name: newCategoryName.trim()
            });

            setCategories(prev => [
                ...prev,
                created
            ]);

            setSelectedCategory(created.id);
            setNewCategoryName("");
            setSuccess(true);
            setTimeout(() => setSuccess(false), 2000);

        } catch (err) {
            console.error("Error creating category:", err);
            setError(getErrorMessage(err, "Failed to create category"));
        } finally {
            setCreatingCategory(false);
        }
    };

    // Create Template
    const handleCreateTemplate = async () => {
        if (!newTemplateName.trim()) {
            setError("Template name is required");
            return;
        }

        if (!selectedCategory) {
            setError("Please select a category first");
            return;
        }

        setCreatingTemplate(true);
        clearErrors();
        setError("");

        try {
            const created = await createTemplate({
                categoryId: selectedCategory,
                name: newTemplateName.trim()
            });

            setTemplates(prev => [
                ...prev,
                created
            ]);
            setAllTemplates(prev => [
                ...prev,
                normalizeTemplate(created)
            ]);

            setSelectedTemplate(created.id);
            clearSelectedTags();
            setNewTemplateName("");
            setSuccess(true);
            setTimeout(() => setSuccess(false), 2000);

        } catch (err) {
            console.error("Error creating template:", err);
            setError(getErrorMessage(err, "Failed to create template"));
        } finally {
            setCreatingTemplate(false);
        }
    };

    // Validate All Before Save
    const validateAllBeforeSave = (): boolean => {
        clearErrors();
        setError("");

        if (!validateGeneralInfo(formData)) {
            setError("Please fill in all required fields");
            return false;
        }

        if (!validateCategory(selectedCategory)) {
            setError("Please select a category");
            return false;
        }

        if (!validateTemplate(selectedTemplate)) {
            setError("Please select a template");
            return false;
        }

        if (!validateTagSelection(selectedTags)) {
            setError("Please select at least one tag");
            return false;
        }

        return true;
    };

    // Save All (General Info + Tags)
    const handleSubmit = async (
        e: React.FormEvent
    ) => {
        e.preventDefault();

        if (!jobId) {
            setError("Job ID is missing");
            return;
        }

        if (!validateAllBeforeSave()) {
            return;
        }

        const confirmed = window.confirm(
            "Save all General Information and Tags?"
        );

        if (!confirmed) {
            return;
        }

        setLoading(true);
        clearErrors();
        setError("");

        try {
            // Step 1: Save general information
            await saveGeneralInformation(
                jobId,
                {
                    ...formData,
                    jobCategoryId: selectedCategory,
                    jobTemplateId: selectedTemplate,
                    currentStep: 2
                }
            );

            // Step 2: Prepare all tags
            const allTagsForSave: SelectedTag[] = [
                ...selectedTags.SKILLS,
                ...selectedTags.REQUIREMENTS,
                ...selectedTags.BENEFITS
            ];

            // Step 3: Save all tags in batch
            const tagResponse = await saveJobPostingTags(
                jobId,
                allTagsForSave,
                currentUserId || 1,
                selectedTemplate!
            );

            if (!tagResponse.success) {
                throw new Error(tagResponse.message || "Failed to save tags");
            }

            setSuccess(true);

            // Navigate to next step after success
            setTimeout(() => {
                nextStep();
            }, 1000);

        } catch (err) {
            console.error("Error saving:", err);
            setError(
                getErrorMessage(err, "Failed to save information and tags")
            );
        } finally {
            setLoading(false);
        }
    };

    // Handle Next Step (without saving)
    const handleNextStep = () => {
        if (!validateAllBeforeSave()) {
            return;
        }
        nextStep();
    };

    // UI
    return (
        <div className="step-container">
            <div className="general-info-container">
                <form
                    className="general-info-form"
                    onSubmit={handleSubmit}
                >
                    <h2 className="page-title">
                        General Information
                    </h2>

                    {/* BASIC FIELDS */}
                    <div className="grid-2">
                        <div className="form-group">
                            <label>
                                Rank <span className="text-red-500">*</span>
                            </label>
                            <select
                                name="rank"
                                value={formData.rank}
                                onChange={handleChange}
                                className={getError("rank") ? "border-red-500" : ""}
                            >
                                <option value="">Select Rank</option>
                                <option value="Intern">Intern</option>
                                <option value="Junior">Junior</option>
                                <option value="Middle">Middle</option>
                                <option value="Senior">Senior</option>
                                <option value="Lead">Lead</option>
                            </select>
                            {getError("rank") && (
                                <p className="text-red-500 text-sm mt-1">
                                    {getError("rank")}
                                </p>
                            )}
                        </div>

                        <div className="form-group">
                            <label>
                                Education <span className="text-red-500">*</span>
                            </label>
                            <select
                                name="education"
                                value={formData.education}
                                onChange={handleChange}
                                className={getError("education") ? "border-red-500" : ""}
                            >
                                <option value="">Select Education</option>
                                <option value="College">College</option>
                                <option value="Bachelor">Bachelor</option>
                                <option value="Master">Master</option>
                            </select>
                            {getError("education") && (
                                <p className="text-red-500 text-sm mt-1">
                                    {getError("education")}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="grid-2">
                        <div className="form-group">
                            <label>
                                Number of Recruitment <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="number"
                                min={1}
                                name="numberOfRecruitment"
                                value={formData.numberOfRecruitment}
                                onChange={handleChange}
                                className={getError("numberOfRecruitment") ? "border-red-500" : ""}
                            />
                            {getError("numberOfRecruitment") && (
                                <p className="text-red-500 text-sm mt-1">
                                    {getError("numberOfRecruitment")}
                                </p>
                            )}
                        </div>

                        <div className="form-group">
                            <label>
                                Working Style <span className="text-red-500">*</span>
                            </label>
                            <select
                                name="workingStyle"
                                value={formData.workingStyle}
                                onChange={handleChange}
                                className={getError("workingStyle") ? "border-red-500" : ""}
                            >
                                <option value="">Select Style</option>
                                <option value="Remote">Remote</option>
                                <option value="Hybrid">Hybrid</option>
                                <option value="On-site">On-site</option>
                            </select>
                            {getError("workingStyle") && (
                                <p className="text-red-500 text-sm mt-1">
                                    {getError("workingStyle")}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* CATEGORY SECTION */}
                    {/* <div className="mt-10">
                        <CategorySelector
                            categories={categories}
                            selectedCategory={selectedCategory}
                            onSelect={setSelectedCategory}
                        />
                        {getError("category") && (
                            <p className="text-red-500 text-sm mt-2">
                                {getError("category")}
                            </p>
                        )}

                        <div className="flex gap-3 mt-4">
                            <input
                                value={newCategoryName}
                                onChange={(e) => {
                                    setNewCategoryName(e.target.value);
                                    if (error) setError("");
                                }}
                                placeholder="Create new category"
                                className="
                                    flex-1
                                    border
                                    rounded-xl
                                    px-4
                                    py-3
                                    focus:outline-none
                                    focus:ring-2
                                    focus:ring-black
                                "
                            />
                            <button
                                type="button"
                                onClick={handleCreateCategory}
                                disabled={creatingCategory}
                                className="
                                    px-5
                                    rounded-xl
                                    bg-black
                                    text-white
                                    disabled:opacity-50
                                    disabled:cursor-not-allowed
                                "
                            >
                                {creatingCategory ? "Creating..." : "Create"}
                            </button>
                        </div>
                    </div> */}

                    <div className="rounded-3xl bg-white p-7 shadow-sm border border-gray-100">

                        <div className="mb-6">
                            <h2 className="text-xl font-semibold text-gray-800">
                                Job Category
                            </h2>

                            <p className="mt-1 text-sm text-gray-500">
                                Search and select category for this job.
                            </p>
                        </div>

                        <SearchableSelect
                            label="Category"
                            placeholder="Search category..."
                            items={categories}
                            selectedItem={
                                categories.find(
                                    c => c.id === selectedCategory
                                ) || null
                            }
                            displayKey="name"
                            onSelect={(item) => {
                                if (item.id !== selectedCategory) {
                                    setSelectedTemplate(null);
                                    clearSelectedTags();
                                }

                                setSelectedCategory(item.id);
                            }}
                        />

                    </div>
                    {/* TEMPLATE SECTION */}
                    {/* {selectedCategory && (
                        <div className="mt-10">
                            <TemplateSelector
                                templates={templates}
                                selectedTemplate={selectedTemplate}
                                onSelect={setSelectedTemplate}
                            />
                            {getError("template") && (
                                <p className="text-red-500 text-sm mt-2">
                                    {getError("template")}
                                </p>
                            )}

                            <div className="flex gap-3 mt-4">
                                <input
                                    value={newTemplateName}
                                    onChange={(e) => {
                                        setNewTemplateName(e.target.value);
                                        if (error) setError("");
                                    }}
                                    placeholder="Create new template"
                                    className="
                                        flex-1
                                        border
                                        rounded-xl
                                        px-4
                                        py-3
                                        focus:outline-none
                                        focus:ring-2
                                        focus:ring-black
                                    "
                                />
                                <button
                                    type="button"
                                    onClick={handleCreateTemplate}
                                    disabled={creatingTemplate}
                                    className="
                                        px-5
                                        rounded-xl
                                        bg-black
                                        text-white
                                        disabled:opacity-50
                                        disabled:cursor-not-allowed
                                    "
                                >
                                    {creatingTemplate ? "Creating..." : "Create"}
                                </button>
                            </div>
                        </div>
                    )} */}

                    {selectedCategory && (

                        <div className="rounded-3xl bg-white p-7 shadow-sm border border-gray-100">

                            <div className="mb-6">
                                <h2 className="text-xl font-semibold text-gray-800">
                                    Job Template
                                </h2>

                                <p className="mt-1 text-sm text-gray-500">
                                    Select suitable hiring template.
                                </p>
                            </div>

                            <SearchableSelect
                                label="Template"
                                placeholder="Search template..."
                                items={templates}
                                selectedItem={
                                    templates.find(
                                        t => t.id === selectedTemplate
                                    ) || null
                                }
                            displayKey="name"
                            onSelect={(item) => {
                                if (item.id !== selectedTemplate) {
                                    clearSelectedTags();
                                }

                                setSelectedTemplate(item.id);
                            }}
                        />

                        </div>

                    )}

                    {/* TAGS SECTION */}
                    {selectedTemplate && (

                        <div className="
        rounded-3xl
        bg-white
        p-7
        shadow-sm
        border
        border-gray-100
        space-y-8
    ">

                            <div>
                                <h2 className="text-xl font-semibold text-gray-800">
                                    Smart Tags
                                </h2>

                                <p className="mt-1 text-sm text-gray-500">
                                    Add searchable tags to improve candidate matching.
                                </p>
                            </div>

                            <SearchableTagInput
                                title="Skills"
                                suggestions={mergeTags(
                                    popularTags.skills || [],
                                    suggestedTags.skills || []
                                )}
                                selectedTags={
                                    selectedTags.SKILLS.map(
                                        t => t.tagText
                                    )
                                }
                                onAdd={(tag) =>
                                    toggleTag("SKILLS", tag)
                                }
                                onRemove={(tag) =>
                                    removeTag("SKILLS", tag)
                                }
                            />

                            <SearchableTagInput
                                title="Requirements"
                                suggestions={mergeTags(
                                    popularTags.requirements || [],
                                    suggestedTags.requirements || []
                                )}
                                selectedTags={
                                    selectedTags.REQUIREMENTS.map(
                                        t => t.tagText
                                    )
                                }
                                onAdd={(tag) =>
                                    toggleTag("REQUIREMENTS", tag)
                                }
                                onRemove={(tag) =>
                                    removeTag("REQUIREMENTS", tag)
                                }
                            />

                            <SearchableTagInput
                                title="Benefits"
                                suggestions={mergeTags(
                                    popularTags.benefits || [],
                                    suggestedTags.benefits || []
                                )}
                                selectedTags={
                                    selectedTags.BENEFITS.map(
                                        t => t.tagText
                                    )
                                }
                                onAdd={(tag) =>
                                    toggleTag("BENEFITS", tag)
                                }
                                onRemove={(tag) =>
                                    removeTag("BENEFITS", tag)
                                }
                            />

                        </div>

                    )}

                    {getError("tags") && (
                        <p className="text-red-500 text-sm mt-4">
                            {getError("tags")}
                        </p>
                    )}

                    {/* ACTIONS */}
                    <div className="
                        flex
                        items-center
                        gap-4
                        mt-12
                    ">
                        <button
                            type="button"
                            onClick={prevStep}
                            className="
                                px-6
                                py-3
                                rounded-xl
                                border
                                border-gray-300
                                bg-white
                                text-gray-800
                                font-medium
                                hover:bg-gray-100
                                transition
                            "
                        >
                            Back
                        </button>

                        <button
                            type="submit"
                            disabled={loading}
                            className="
                                flex-1
                                bg-[#00b14f]
                                hover:bg-[#009245]
                                focus:ring-[#00b14f]/10
                                text-white
                                py-3
                                rounded-xl
                                font-semibold
                                transition
                                disabled:opacity-50
                                disabled:cursor-not-allowed
                            "
                        >
                            {loading ? "Saving..." : "Save & Continue"}
                        </button>

                        <button
                            type="button"
                            onClick={handleNextStep}
                            className="
                                px-6
                                py-3
                                rounded-xl
                                bg-gray-100
                                text-gray-900
                                font-medium
                                hover:bg-gray-200
                                transition
                            "
                        >
                            Next Step
                        </button>
                    </div>

                    {/* MESSAGES */}
                    {success && (
                        <p className="
                            text-green-600
                            mt-4
                            text-sm
                            font-medium
                        ">
                            ✓ Saved successfully!
                        </p>
                    )}

                    {error && (
                        <p className="
                            text-red-500
                            mt-4
                            text-sm
                            font-medium
                        ">
                            ✗ {error}
                        </p>
                    )}

                </form>
            </div>
        </div>
    );
}
