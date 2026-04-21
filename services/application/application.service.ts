import { Application } from "@/types/application";

const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return {
    "Authorization": `Bearer ${token}`,
    "Content-Type": "application/json",
  };
};

export const applyJob = async (data: FormData) => {
  const token = localStorage.getItem("token");
  const res = await fetch("http://localhost:9191/api/applications/apply", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`, // no Content-Type for FormData
    },
    body: data,
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(errorText || "Failed to apply");
  }

  return res.text();
};

export const getAppliedJobByCandidateId = async (id: number) => {
  const res = await fetch(
    `http://localhost:9191/api/applications/candidate/${id}`,
    {
      cache: "no-store",
      headers: getAuthHeader(),
    }
  );
  if (!res.ok) throw new Error("Failed to fetch job");
  const data: Application = await res.json();
  return data;
};

export const getAppliedJobByJobId = async (id: number) => {
  const res = await fetch(
    `http://localhost:9191/api/applications/job/${id}`,
    {
      cache: "no-store",
      headers: getAuthHeader(),
    }
  );
  if (!res.ok) throw new Error("Failed to fetch job");
  const data: Application[] = await res.json();
  return data;
};

export const getAppliedJobByCompanyId = async (id: number) => {
  const res = await fetch(
    `http://localhost:9191/api/applications/company/${id}`,
    {
      cache: "no-store",
      headers: getAuthHeader(),
    }
  );
  if (!res.ok) throw new Error("Failed to fetch job");
  const data: Application[] = await res.json();
  return data;
};

export const updateApplicationStatus = async (applicationId: number, status: string) => {
  const res = await fetch(
    `http://localhost:9191/api/applications/${applicationId}/status?status=${status}`,
    {
      method: "PATCH",
      headers: getAuthHeader(),
    }
  );

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(errorText || "Failed to update application status");
  }

  const data: Application = await res.json();
  return data;
};

export const getAppliedFormByCandidateId = async (
  id: number
): Promise<Application[]> => {
  const res = await fetch(
    `http://localhost:9191/api/applications/candidate/${id}`,
    {
      cache: "no-store",
      headers: getAuthHeader(),
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch applications");
  }

  const data: Application[] = await res.json();
  return data;
};

export async function getAllApplications() {
  const res = await fetch("http://localhost:9191/api/applications", {
    headers: getAuthHeader(),
  });
  if (!res.ok) throw new Error("Failed to fetch applications");
  return res.json();
}