const API_URL = "http://localhost:9191/api/candidates";

const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return {
    "Authorization": `Bearer ${token}`,
    "Content-Type": "application/json",
  };
};

export async function getCandidateByUserId(userId: number) {
  const res = await fetch(`${API_URL}/user/${userId}`, {
    headers: getAuthHeader(),
  });

  if (!res.ok) {
    throw new Error("Cannot get candidate");
  }

  return res.json();
}