const BASE_URL = "http://localhost:9191/api/candidates";

export const checkSavedJob = async (candidateId: number, jobId: number) => {
  const res = await fetch(`${BASE_URL}/${candidateId}/saved-jobs/${jobId}`);

  if (!res.ok) {
    throw new Error("Failed to check saved job");
  }

  return res.json(); // true or false
};

export const saveJob = async (candidateId: number, jobId: number) => {
  const res = await fetch(`${BASE_URL}/${candidateId}/saved-jobs/${jobId}`, {
    method: "POST",
  });

  if (!res.ok) {
    throw new Error("Failed to save job");
  }
};

export const removeSavedJob = async (candidateId: number, jobId: number) => {
  const res = await fetch(`${BASE_URL}/${candidateId}/saved-jobs/${jobId}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    throw new Error("Failed to remove saved job");
  }
};