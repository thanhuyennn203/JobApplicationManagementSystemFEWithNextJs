import { JobDetail } from "@/types/jobs";

const API_URL = "http://localhost:9191/api/jobs";

const getAuthHeader = () => {
    const token = localStorage.getItem("token");

    return {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
    };
};

/**
 * Get job detail by job id
 */
export async function getJobDetailByJobId(
    jobId: number
): Promise<JobDetail | null> {

    try {

        const res = await fetch(
            `${API_URL}/${jobId}/details`,
            {
                headers: getAuthHeader()
            }
        );

        if (!res.ok) {
            return null;
        }

        return await res.json();

    } catch (error) {

        console.error(
            "Failed to fetch job detail",
            error
        );

        return null;
    }
}

/**
 * Create job detail
 */
export async function createJobDetail(
    jobId: number,
    formData: JobDetail
) {

    const res = await fetch(
        `${API_URL}/${jobId}/details`,
        {
            method: "POST",
            headers: getAuthHeader(),
            body: JSON.stringify(formData)
        }
    );

    if (!res.ok) {
        throw new Error(
            "Failed to create job detail"
        );
    }

    return await res.json();
}

/**
 * Update job detail
 */
export async function updateJobDetail(
    jobId: number,
    formData: JobDetail
) {

    const res = await fetch(
        `${API_URL}/${jobId}/details`,
        {
            method: "PATCH",
            headers: getAuthHeader(),
            body: JSON.stringify(formData)
        }
    );

    if (!res.ok) {
        throw new Error(
            "Failed to update job detail"
        );
    }

    return await res.json();
}

/**
 * Publish job
 */
export async function publishJob(
    jobId: number
) {
    console.log(jobId);
    const res = await fetch(
        `${API_URL}/${jobId}/open`,
        {
            method: "PATCH",
            headers: getAuthHeader()
        }
    );

   if (!res.ok) {
    const errorText = await res.text();
    console.log("BACKEND ERROR:", errorText);

    throw new Error(errorText);
}

    return await res.json();
}