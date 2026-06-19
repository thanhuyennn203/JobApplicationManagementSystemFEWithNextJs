import { PackageData, CompanyPackageData } from "@/types/package";

export async function fetchPackages(): Promise<PackageData[]> {
  const response = await fetch(
    "http://localhost:9191/api/companies/members/packages",
    {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch packages: ${response.status}`);
  }

  return response.json();
}

export async function fetchPackageById(id : number): Promise<PackageData> {
  const response = await fetch(
    `http://localhost:9191/api/companies/members/packages/${id}`,
    {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch packages: ${response.status}`);
  }

  return response.json();
}

// services/companies/company.service.ts

const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return {
    "Authorization": `Bearer ${token}`,
    "Content-Type": "application/json",
  };
};

const BASE_URL = "http://localhost:9191/api/companies/packages"

export const getActivePackages = async (
    companyId: number
): Promise<CompanyPackageData[]> => {
    const response = await fetch(
        `${BASE_URL}/company/${companyId}`, 
        {
          method: "GET",
          headers: getAuthHeader(),
        }
    );
    if (!response.ok) throw new Error("Failed to fetch active packages");
    return response.json();
};

