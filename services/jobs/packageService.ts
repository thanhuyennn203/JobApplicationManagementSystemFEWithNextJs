import { PackageData } from "@/types/package";

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