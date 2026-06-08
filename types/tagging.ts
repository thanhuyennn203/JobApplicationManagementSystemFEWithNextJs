
export interface JobCategory {
    id: number;
    name: string;
    categoryName?: string;
    displayName?: string;
    title?: string;
    description?: string;
    icon?: string;
    system: boolean;
}

export interface JobTemplate {
    id: number;
    categoryId: number;
    jobCategoryId?: number;
    category?: {
        id?: number;
    };
    category_id?: number;
    jobCategory?: {
        id?: number;
    };
    jobCategoryResponse?: {
        id?: number;
    };
    job_category_id?: number;
    name: string;
    templateName?: string;
    displayName?: string;
    title?: string;
    description?: string;
    icon?: string;
    system: boolean;
}

export type TagCategory =
    | "SKILLS"
    | "REQUIREMENTS"
    | "BENEFITS";

/**
 * SelectedTag - stores a tag selected/created by user
 */
export interface SelectedTag {
    category: TagCategory;
    tagText: string;
    isUserCreated: boolean;
}

/**
 * TagDTO sent to backend
 */
export interface TagDTO {
    id?: number | null;
    category: TagCategory;
    tagText: string;
    name?: string;
    text?: string;
    tagName?: string;
    value?: string;
    isUserCreated: boolean;
}

export interface JobGenerateContext {
    categories: JobCategory[];
    templates: JobTemplate[];
    groupedTags: {
        SKILL: TagDTO[];
        BENEFIT: TagDTO[];
        REQUIREMENT: TagDTO[];
    };
    selectedTagIds: number[];
    userCreatedTags: TagDTO[];
    selectedTemplateId: number | null;
    selectedCategoryId: number | null;
}

/**
 * Response from backend when saving tags
 */
export interface JobPostingTagResponseDTO {
    jobPostingId: number;
    tagIds: number[];
    message: string;
    success: boolean;
}
