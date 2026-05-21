import { JobCategory } from "@/types/tagging";

const API_URL = "http://localhost:9191/api/jobs/categories";

const getAuthHeader = () => {
    const token = localStorage.getItem("token");

    return {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
    };
};

export const getCategories = async (): Promise<JobCategory[]> => {

    const res = await fetch(API_URL);

    if (!res.ok) {
        throw new Error("Failed to fetch categories");
    }

    return res.json();
};

export const createCategory = async (payload: {
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
        throw new Error("Failed to create category");
    }

    return res.json();
};