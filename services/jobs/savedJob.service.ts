import { Job } from "@/types/jobs";
const API_URL = "http://localhost:9191/api/candidates"

export const getSavedJobs = async (candidateId: number): Promise<Job[]> => {

  const token = localStorage.getItem("token")

  const res = await fetch(`${API_URL}/${candidateId}/saved-jobs`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    }
  })

  if (!res.ok) {
    throw new Error("Failed to fetch saved jobs")
  }

  const data = await res.json()

  return data
}