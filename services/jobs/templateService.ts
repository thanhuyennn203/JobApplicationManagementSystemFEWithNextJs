import { JobTemplate } from "@/types/tagging";

const API_URL = "http://localhost:9191/api/jobs/templates";

const getAuthHeader = () => {
    const token = localStorage.getItem("token");

    return {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
    };
};

export const getTemplatesByCategory = async (
    categoryId: number
): Promise<JobTemplate[]> => {

    const res = await fetch(
        `${API_URL}/category/${categoryId}`
    );

    if (!res.ok) {
        throw new Error("Failed to fetch templates");
    }

    return res.json();
};

export const createTemplate = async (payload: {
    categoryId: number;
    name: string;
    description?: string;
    icon?: string;
}) => {

    const res = await fetch(API_URL, {
        method: "POST",
        headers: getAuthHeader(),
        body: JSON.stringify(payload),
    });

    if (!res.ok) {
        throw new Error("Failed to create template");
    }

    return res.json();
};