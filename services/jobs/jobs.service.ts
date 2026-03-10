import { Job, JobDetail } from "@/types/jobs";
const API_URL = "http://localhost:9191/api/jobs";

export async function fetchJobs(): Promise<Job[]> {
  try {
    const res = await fetch(API_URL);

    if (!res.ok) {
      throw new Error("Failed to fetch jobs");
    }

    const data: Job[] = await res.json();
    // console.log(data);

    return data;
  } catch (err) {
    console.error("Error fetching jobs:", err);
    return [];
  }
}

export const getJobById = async (id: number) => {
  const res = await fetch(
    `http://localhost:9191/api/jobs/${id}`,
    { cache: "no-store" }
  );
  if (!res.ok) throw new Error("Failed to fetch job");
  const data: Job = await res.json();
  return data;
};

export const getJobDetailById = async (id: number) => {
  const res = await fetch(
    `http://localhost:9191/api/jobs/${id}/details`,
    { cache: "no-store" }

  );
  if (res.status === 404) return null;
  if (!res.ok) return null;
  const data: JobDetail = await res.json();
  return data;
};