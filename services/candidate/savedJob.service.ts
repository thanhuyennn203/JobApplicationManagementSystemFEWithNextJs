const BASE_URL = "http://localhost:9191/api/candidates";

const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return {
    "Authorization": `Bearer ${token}`,
    "Content-Type": "application/json",
  };
};

export const checkSavedJob = async (candidateId: number, jobId: number) => {
  const res = await fetch(`${BASE_URL}/${candidateId}/saved-jobs/${jobId}`, {
    headers: getAuthHeader(),
  });

  if (!res.ok) throw new Error("Failed to check saved job");

  return res.json();
};

export const saveJob = async (candidateId: number, jobId: number) => {
  const res = await fetch(`${BASE_URL}/${candidateId}/saved-jobs/${jobId}`, {
    method: "POST",
    headers: getAuthHeader(),
  });

  if (!res.ok) throw new Error("Failed to save job");
};

export const removeSavedJob = async (candidateId: number, jobId: number) => {
  const res = await fetch(`${BASE_URL}/${candidateId}/saved-jobs/${jobId}`, {
    method: "DELETE",
    headers: getAuthHeader(),
  });

  if (!res.ok) throw new Error("Failed to remove saved job");
};