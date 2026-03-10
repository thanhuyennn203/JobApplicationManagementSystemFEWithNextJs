export interface SavedJob {
  jobId: number
  title: string
  company: string
  logo: string
  salary: string
  locations: string[]
  experience: string
  savedDate: string
  updatedAt: string
}

const API_URL = "http://localhost:9191/api/candidates"

export const getSavedJobs = async (candidateId: number): Promise<SavedJob[]> => {

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