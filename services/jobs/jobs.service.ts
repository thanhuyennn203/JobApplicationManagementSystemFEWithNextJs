import { Job, JobDetail } from "@/types/jobs";

const API_URL = "http://localhost:9191/api/jobs";

const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return {
    "Authorization": `Bearer ${token}`,
    "Content-Type": "application/json",
  };
};

export async function fetchJobs(): Promise<Job[]> {
  try {
    const res = await fetch(API_URL);

    if (!res.ok) throw new Error("Failed to fetch jobs");

    const data: Job[] = await res.json();
    return data;
  } catch (err) {
    console.error("Error fetching jobs:", err);
    return [];
  }
}

export const getJobById = async (id: number) => {
  const res = await fetch(`http://localhost:9191/api/jobs/${id}`);
  if (!res.ok) throw new Error("Failed to fetch job");
  const data: Job = await res.json();
  return data;
};

export const getJobDetailById = async (id: number) => {
  const res = await fetch(`http://localhost:9191/api/jobs/${id}/details`);
  if (res.status === 404) return null;
  if (!res.ok) return null;
  const data: JobDetail = await res.json();
  return data;
};

export const getJobsByIds = async (ids: number[]) => {
  const query = ids.join(",");
  const res = await fetch(`http://localhost:9191/api/jobs/batch?ids=${query}`, {
    headers: getAuthHeader(),
  });
  return res.json();
};

export const getJobByCompanyId = async (companyId: number) => {
  try {
    const res = await fetch(
      `http://localhost:9191/api/jobs/company/${companyId}`
    );

    if (!res.ok) throw new Error("Failed to fetch jobs by company");

    const data: Job[] = await res.json();
    return data;
  } catch (err) {
    console.error("Error fetching jobs by company:", err);
    return [];
  }
};

export async function getAllJobs() {
  const res = await fetch(API_URL, {
    headers: getAuthHeader(),
  });

  if (!res.ok) throw new Error("Failed to fetch jobs");

  return res.json();
}