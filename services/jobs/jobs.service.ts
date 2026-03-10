import { Job } from "../../types/jobs";

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
