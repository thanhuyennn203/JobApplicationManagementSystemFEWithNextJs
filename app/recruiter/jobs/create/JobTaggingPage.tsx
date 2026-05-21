import { useEffect, useState } from "react";
import CategorySelector from "@/components/recruiter/CategorySelector";
import TemplateSelector from "@/components/recruiter/TemplateSelector";
import TagSection from "@/components/recruiter/TagSection";
import CustomTagInput from "@/components/recruiter/CustomTagInput";

import {
    JobCategory,
    JobTemplate,
    SuggestedTagsResponse
} from "@/types/tagging";

import {
    getCategories,
    createCategory
} from "@/services/jobs/categoryService";

import {
    createTemplate,
    getTemplatesByCategory
} from "@/services/jobs/templateService";

import {
    getSuggestedTags,
    saveTag
} from "@/services/jobs/tagService";

export default function JobTaggingPage() {

    const [categories, setCategories] =
        useState<JobCategory[]>([]);

    const [templates, setTemplates] =
        useState<JobTemplate[]>([]);

    const [selectedCategory, setSelectedCategory] =
        useState<number | null>(null);

    const [selectedTemplate, setSelectedTemplate] =
        useState<number | null>(null);

    const [suggestedTags, setSuggestedTags] =
        useState<SuggestedTagsResponse>({
            skills: [],
            requirements: [],
            benefits: []
        });

    const [selectedSkills, setSelectedSkills] =
        useState<string[]>([]);

    const [selectedRequirements, setSelectedRequirements] =
        useState<string[]>([]);

    const [selectedBenefits, setSelectedBenefits] =
        useState<string[]>([]);

    useEffect(() => {

        loadCategories();

    }, []);

    const loadCategories = async () => {

        try {

            const data = await getCategories();
            setCategories(data);

        } catch (error) {
            console.error(error);
        }
    };

    const handleSelectCategory = async (
        categoryId: number
    ) => {

        setSelectedCategory(categoryId);

        const data = await getTemplatesByCategory(categoryId);

        setTemplates(data);
    };

    const handleSelectTemplate = async (
        templateId: number
    ) => {

        setSelectedTemplate(templateId);

        const data = await getSuggestedTags(templateId);

        setSuggestedTags(data);
    };

    const toggleTag = (
        tag: string,
        state: string[],
        setter: any
    ) => {

        const exists = state.includes(tag);

        if(exists) {
            setter(state.filter(item => item !== tag));
            return;
        }

        if(state.length >= 6) {
            alert("Maximum 6 tags allowed");
            return;
        }

        setter([...state, tag]);
    };

    const saveAllTags = async () => {

        const jobPostingId = 1;

        try {

            for(const tag of selectedSkills) {

                await saveTag(jobPostingId, {
                    category: "SKILLS",
                    tagText: tag,
                    isUserCreated: false
                });
            }

            for(const tag of selectedRequirements) {

                await saveTag(jobPostingId, {
                    category: "REQUIREMENTS",
                    tagText: tag,
                    isUserCreated: false
                });
            }

            for(const tag of selectedBenefits) {

                await saveTag(jobPostingId, {
                    category: "BENEFITS",
                    tagText: tag,
                    isUserCreated: false
                });
            }

            alert("Tags saved successfully");

        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-8">

            <div className="max-w-7xl mx-auto space-y-10">

                <div>
                    <h1 className="text-3xl font-bold">
                        Job Tagging System
                    </h1>

                    <p className="text-gray-500 mt-2">
                        Select categories, templates and tags
                    </p>
                </div>

                <CategorySelector
                    categories={categories}
                    selectedCategory={selectedCategory}
                    onSelect={handleSelectCategory}
                />

                {selectedCategory && (
                    <TemplateSelector
                        templates={templates}
                        selectedTemplate={selectedTemplate}
                        onSelect={handleSelectTemplate}
                    />
                )}

                {selectedTemplate && (
                    <div className="space-y-10 bg-white rounded-3xl p-8">

                        <TagSection
                            title="Skills"
                            tags={suggestedTags.skills}
                            selectedTags={selectedSkills}
                            onToggle={(tag) =>
                                toggleTag(
                                    tag,
                                    selectedSkills,
                                    setSelectedSkills
                                )
                            }
                        />

                        <CustomTagInput
                            onAdd={(value) =>
                                toggleTag(
                                    value,
                                    selectedSkills,
                                    setSelectedSkills
                                )
                            }
                        />

                        <TagSection
                            title="Requirements"
                            tags={suggestedTags.requirements}
                            selectedTags={selectedRequirements}
                            onToggle={(tag) =>
                                toggleTag(
                                    tag,
                                    selectedRequirements,
                                    setSelectedRequirements
                                )
                            }
                        />

                        <CustomTagInput
                            onAdd={(value) =>
                                toggleTag(
                                    value,
                                    selectedRequirements,
                                    setSelectedRequirements
                                )
                            }
                        />

                        <TagSection
                            title="Benefits"
                            tags={suggestedTags.benefits}
                            selectedTags={selectedBenefits}
                            onToggle={(tag) =>
                                toggleTag(
                                    tag,
                                    selectedBenefits,
                                    setSelectedBenefits
                                )
                            }
                        />

                        <CustomTagInput
                            onAdd={(value) =>
                                toggleTag(
                                    value,
                                    selectedBenefits,
                                    setSelectedBenefits
                                )
                            }
                        />

                        <div className="pt-6 border-t">

                            <button
                                onClick={saveAllTags}
                                className="
                                    px-8 py-3 rounded-2xl
                                    bg-black text-white font-medium
                                "
                            >
                                Save Tags
                            </button>

                        </div>

                    </div>
                )}

            </div>

        </div>
    );
}