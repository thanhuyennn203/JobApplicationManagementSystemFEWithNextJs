export interface JobCategory {
    id: number;
    name: string;
    description?: string;
    icon?: string;
    system: boolean;
}

export interface JobTemplate {
    id: number;
    categoryId: number;
    name: string;
    description?: string;
    icon?: string;
    system: boolean;
}

export type TagCategory =
    | "SKILLS"
    | "REQUIREMENTS"
    | "BENEFITS"
    | "RESPONSIBILITIES";

export interface SuggestedTagsResponse {
    skills: string[];
    requirements: string[];
    benefits: string[];
    responsibilities?: string[];
}

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
    isUserCreated: boolean;
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