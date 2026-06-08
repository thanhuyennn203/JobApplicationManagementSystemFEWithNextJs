import { GeneralInformation } from "@/types/jobs";

const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return {
    "Authorization": `Bearer ${token}`,
    "Content-Type": "application/json",
  };
};

export async function getGeneralInformationByJobId(
  jobId: number
): Promise<GeneralInformation | null> {
  try {
    const res = await fetch(
      `http://localhost:9191/api/jobs/${jobId}/general-information`, {
    headers: getAuthHeader(),
  }
    );

    if (!res.ok) return null;

    const response = await res.json();
    return response.data ?? response;
  } catch (error) {
    console.error("Failed to fetch general information", error);
    return null;
  }
}

