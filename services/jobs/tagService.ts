import { SuggestedTagsResponse, SelectedTag } from "@/types/tagging";

const API_URL = "http://localhost:9191/api/jobs/posting-tags";

const getAuthHeader = () => {
    const token = localStorage.getItem("token");
    return {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
    };
};

/**
 * Get suggested tags for a template
 */
export const getSuggestedTags = async (
    templateId: number
): Promise<SuggestedTagsResponse> => {
    const res = await fetch(
        `http://localhost:9191/api/jobs/postings/templates/${templateId}/suggested-tags`
    );
    if (!res.ok) {
        throw new Error("Failed to fetch suggested tags");
    }
    return res.json();
};

/**
 * Get popular tags across all job postings
 */
export const getPopularTags = async (): Promise<SuggestedTagsResponse> => {
    const res = await fetch(
        `http://localhost:9191/api/jobs/postings/popular`
    );
    if (!res.ok) {
        throw new Error("Failed to fetch popular tags");
    }
    return res.json();
};

/**
 * Save all tags for a job posting in batch
 * This is the main endpoint called when user clicks Save
 */
export const saveJobPostingTags = async (
    jobPostingId: number,
    tags: SelectedTag[],
    userId: number,
    jobTypeTemplateId: number
) => {

    console.log("saveJobPostingTags INPUT:", {
        jobPostingId,
        tags,
        userId,
        jobTypeTemplateId
    });

    const bodyData = {
        jobPostingId,
        tags: tags.map(tag => ({
            id: null,
            category: tag.category,
            tagText: tag.tagText,
            isUserCreated: tag.isUserCreated
        })),
        userId,
        jobTypeTemplateId
    };

    console.log("FINAL REQUEST BODY:", bodyData);

    const res = await fetch(API_URL, {
        method: "POST",
        headers: {
            ...getAuthHeader(),
            "Content-Type": "application/json"
        },
        body: JSON.stringify(bodyData),
    });

    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to save tags");
    }

    return res.json();
};

/**
 * Get all tags for a job posting
 */
export const getJobPostingTags = async (
    jobPostingId: number
) => {
    const res = await fetch(
        `${API_URL}/${jobPostingId}`,
        {
            headers: getAuthHeader(),
        }
    );
    if (!res.ok) {
        throw new Error("Failed to fetch job posting tags");
    }

    const response = await res.json();
    return response.data ?? response;
};

/**
 * Delete all tags for a job posting
 */
export const deleteJobPostingTags = async (
    jobPostingId: number
) => {
    const res = await fetch(
        `${API_URL}/${jobPostingId}`,
        {
            method: "DELETE",
            headers: getAuthHeader(),
        }
    );
    if (!res.ok) {
        throw new Error("Failed to delete tags");
    }
    return res.text();
};

/**
 * Validate user-created tag
 * Max 18 characters
 */
export const validateTagLength = (tagText: string): boolean => {
    const maxLength = 18;
    return tagText.trim().length > 0 && tagText.trim().length <= maxLength;
};

/**
 * Validate tag format (alphanumeric, spaces, hyphens, underscores, dots)
 */
export const validateTagFormat = (tagText: string): boolean => {
    return /^[a-zA-Z0-9\s\-_.]*$/.test(tagText);
};

