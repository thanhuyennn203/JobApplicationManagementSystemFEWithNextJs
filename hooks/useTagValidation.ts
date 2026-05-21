

import { useState, useCallback } from "react";
import { validateTagFormat, validateTagLength } from "@/services/jobs/tagService";

interface ValidationError {
    field: string;
    message: string;
}

export const useTagValidation = () => {
    const [errors, setErrors] = useState<ValidationError[]>([]);

    const validateUserTag = useCallback((tagText: string): boolean => {
        const newErrors: ValidationError[] = [];

        // Check empty
        if (!tagText.trim()) {
            newErrors.push({
                field: "tagText",
                message: "Tag cannot be empty"
            });
        }

        // Check length
        if (!validateTagLength(tagText)) {
            newErrors.push({
                field: "tagText",
                message: "Tag must be between 1 and 18 characters"
            });
        }

        // Check format
        if (tagText.trim() && !validateTagFormat(tagText)) {
            newErrors.push({
                field: "tagText",
                message: "Tag contains invalid characters. Only alphanumeric, spaces, hyphens, underscores and dots are allowed"
            });
        }

        setErrors(newErrors);
        return newErrors.length === 0;
    }, []);

    const validateGeneralInfo = useCallback((formData: any): boolean => {
        const newErrors: ValidationError[] = [];

        if (!formData.rank?.trim()) {
            newErrors.push({
                field: "rank",
                message: "Rank is required"
            });
        }

        if (!formData.education?.trim()) {
            newErrors.push({
                field: "education",
                message: "Education is required"
            });
        }

        if (!formData.numberOfRecruitment || formData.numberOfRecruitment < 1) {
            newErrors.push({
                field: "numberOfRecruitment",
                message: "Number of recruitment must be at least 1"
            });
        }

        if (!formData.workingStyle?.trim()) {
            newErrors.push({
                field: "workingStyle",
                message: "Working style is required"
            });
        }

        setErrors(newErrors);
        return newErrors.length === 0;
    }, []);

    const validateCategory = useCallback((selectedCategory: number | null): boolean => {
        const newErrors: ValidationError[] = [];

        if (!selectedCategory) {
            newErrors.push({
                field: "category",
                message: "Please select a category"
            });
        }

        setErrors(newErrors);
        return newErrors.length === 0;
    }, []);

    const validateTemplate = useCallback((selectedTemplate: number | null): boolean => {
        const newErrors: ValidationError[] = [];

        if (!selectedTemplate) {
            newErrors.push({
                field: "template",
                message: "Please select a template"
            });
        }

        setErrors(newErrors);
        return newErrors.length === 0;
    }, []);

    const validateTagSelection = useCallback((selectedTags: any): boolean => {
        const newErrors: ValidationError[] = [];

        const hasAtLeastOneTag =
            (selectedTags.SKILLS && selectedTags.SKILLS.length > 0) ||
            (selectedTags.REQUIREMENTS && selectedTags.REQUIREMENTS.length > 0) ||
            (selectedTags.BENEFITS && selectedTags.BENEFITS.length > 0);

        if (!hasAtLeastOneTag) {
            newErrors.push({
                field: "tags",
                message: "Please select at least one tag"
            });
        }

        setErrors(newErrors);
        return newErrors.length === 0;
    }, []);

    const validateMaxTagsPerCategory = useCallback((categoryTags: string[], maxTags: number = 6): boolean => {
        if (categoryTags.length > maxTags) {
            setErrors([{
                field: "tags",
                message: `Maximum ${maxTags} tags allowed per category`
            }]);
            return false;
        }
        return true;
    }, []);

    const clearErrors = useCallback(() => {
        setErrors([]);
    }, []);

    const getError = useCallback((field: string): string | undefined => {
        return errors.find(e => e.field === field)?.message;
    }, [errors]);

    return {
        errors,
        validateUserTag,
        validateGeneralInfo,
        validateCategory,
        validateTemplate,
        validateTagSelection,
        validateMaxTagsPerCategory,
        clearErrors,
        getError
    };
};