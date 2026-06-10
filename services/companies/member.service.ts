import { Member } from "@/types/company";

const API_URL = "http://localhost:9191/api/companies/members";
const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return {
    "Authorization": `Bearer ${token}`,
    "Content-Type": "application/json",
  };
};
export const getMembersByCompany = async (
    companyId: number,
): Promise<Member[]> => {

    const response = await fetch(
        `${API_URL}/company/${companyId}`,
        {
            method: "GET",
            headers: getAuthHeader(),
        }
    );

    if (!response.ok) {
        throw new Error("Failed to fetch members");
    }

    return response.json();
};