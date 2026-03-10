const API_URL = "http://localhost:9191/api/candidates";

export async function getCandidateByUserId(userId: number) {
  const res = await fetch(`${API_URL}/user/${userId}`);

  if (!res.ok) {
    throw new Error("Cannot get candidate");
  }

  return res.json();
}