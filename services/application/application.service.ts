import { TopJobByApplicationDto } from "@/types/analytic";
import { Application } from "@/types/application";

const API_URL = "http://localhost:9191/api/applications";

const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return {
    "Authorization": `Bearer ${token}`,
    "Content-Type": "application/json",
  };
};

export const applyJob = async (data: FormData) => {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API_URL}/apply`, {
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
    `${API_URL}/candidate/${id}`,
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
    `${API_URL}/job/${id}`,
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
    `${API_URL}/company/${id}`,
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
    `${API_URL}/${applicationId}/status?status=${status}`,
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
    `${API_URL}/candidate/${id}`,
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
  const res = await fetch(`${API_URL}`, {
    headers: getAuthHeader(),
  });
  if (!res.ok) throw new Error("Failed to fetch applications");
  return res.json();
}

export async function getTopJobByApplication(): Promise<TopJobByApplicationDto[]> {

    const res = await fetch(
        `${API_URL}/top-job`,
        {
            method: "GET",
            headers: getAuthHeader(),
            cache: "no-store",
        }
    );
    if(!res.ok){
        throw new Error(
            "Failed to fetch top jobs"
        );
    }

    return await res.json();

}
export async function getApplicationStatus()
: Promise<ApplicationStatus[]> {


    const res = await fetch(
        `${API_URL}/admin/analytics/status`,
        {
            method: "GET",
            headers: getAuthHeader(),
            cache: "no-store",
        }
    );

    if(!res.ok){

        throw new Error(
            "Failed to fetch application status"
        );

    }
    return await res.json();

}

export interface ApplicationStatus {
  name: string;
  value: number;
}