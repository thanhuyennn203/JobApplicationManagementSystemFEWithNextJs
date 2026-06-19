import { Job, JobDetail } from "@/types/jobs";
import { JobGenerateContext } from "@/types/tagging";
import {
  PageResponse,
  TopJobRequest,
} from "@/types/TopJob";

const API_URL = "http://localhost:9191/api/jobs";

const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return {
    "Authorization": `Bearer ${token}`,
    "Content-Type": "application/json",
  };
};

export type FeaturedBoxFilterParams = {
  provinceId?: string;
  region?: string;
  minSalary?: number;
  maxSalary?: number;
  jobRank?: string;
  page?: number;
  size?: number;
};

export const getFeaturedBoxJobsWithFilters = async (
  params: FeaturedBoxFilterParams
): Promise<PageResponse<Job>> => {
  const queryParams = new URLSearchParams();

  if (params.provinceId) {
    queryParams.append("provinceId", params.provinceId);
  }

  if (params.region) {
    queryParams.append("region", params.region);
  }

  if (params.minSalary !== undefined) {
    queryParams.append("minSalary", params.minSalary.toString());
  }

  if (params.maxSalary !== undefined) {
    queryParams.append("maxSalary", params.maxSalary.toString());
  }

  if (params.jobRank) {
    queryParams.append("jobRank", params.jobRank);
  }

  queryParams.append("page", (params.page ?? 0).toString());
  queryParams.append("size", (params.size ?? 12).toString());

  const response = await fetch(
    `${API_URL}/top-jobs/featured-box/filter?${queryParams.toString()}`,
    {
      method: "GET",
      headers: getAuthHeader(),
    }
  );
  console.log("GET", queryParams.toString());
  if (!response.ok) {
    throw new Error("Failed to fetch featured box jobs");
  }

  return response.json();
};

export async function fetchJobs(): Promise<Job[]> {
  try {
    const res = await fetch(API_URL);

    if (!res.ok) throw new Error("Failed to fetch jobs");

    const data: Job[] = await res.json();
    return data;
  } catch (err) {
    console.error("Error fetching jobs:", err);
    return [];
  }
}

export async function fetchTopJobs(
  request: TopJobRequest
): Promise<PageResponse<Job>> {

  const params =
    new URLSearchParams();

  params.append(
    "page",
    request.page.toString()
  );

  params.append(
    "size",
    request.size.toString()
  );

  if (request.filterType) {

    params.append(
      "filterType",
      request.filterType
    );
  }

  if (request.province) {

    params.append(
      "province",
      request.province
    );
  }

  if (request.minSalary) {

    params.append(
      "minSalary",
      request.minSalary.toString()
    );
  }

  if (request.maxSalary) {

    params.append(
      "maxSalary",
      request.maxSalary.toString()
    );
  }

  if (
    request.experienceRequired
  ) {

    params.append(
      "experienceRequired",
      request.experienceRequired
    );
  }

  const res =
    await fetch(
      `${API_URL}/top-jobs?${params}`
    );

  if (!res.ok) {

    throw new Error(
      "Failed to fetch top jobs"
    );
  }

  return res.json();
}

export const getJobById = async (id: number) => {
  const res = await fetch(`http://localhost:9191/api/jobs/${id}`);
  if (!res.ok) throw new Error("Failed to fetch job");
  const data: Job = await res.json();
  return data;
};

export const getJobDetailById = async (id: number) => {
  const res = await fetch(`http://localhost:9191/api/jobs/${id}/details`);
  if (res.status === 404) return null;
  if (!res.ok) return null;
  const data: JobDetail = await res.json();
  return data;
};

export const getJobsByIds = async (ids: number[]) => {
  const query = ids.join(",");
  const res = await fetch(`http://localhost:9191/api/jobs/batch?ids=${query}`, {
    headers: getAuthHeader(),
  });
  return res.json();
};

export const getJobByCompanyId = async (companyId: number) => {
  try {
    const res = await fetch(
      `http://localhost:9191/api/jobs/company/${companyId}`
    );

    if (!res.ok) throw new Error("Failed to fetch jobs by company");

    const data: Job[] = await res.json();
    return data;
  } catch (err) {
    console.error("Error fetching jobs by company:", err);
    return [];
  }
};

export async function getAllJobs() {
  const res = await fetch(API_URL, {
    headers: getAuthHeader(),
  });

  if (!res.ok) throw new Error("Failed to fetch jobs");

  return res.json();
}


export const createJob = async (payload: any) => {

  const res = await fetch(API_URL, {
    method: "POST",
    headers: getAuthHeader(),
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error("Failed to create job");
  }

  return res.json();
};

export const updateJob = async (id: number, payload: any) => {

  console.log("data sent: ", payload);
  const res = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: getAuthHeader(),
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error("Failed to update job");
  }

  return res.json();
};

import { GeneralInformation } from "@/types/jobs";

export async function getGeneralInformationByJobId(
  jobId: number
): Promise<GeneralInformation | null> {
  try {
    const res = await fetch(
      `${API_URL}/${jobId}/general-information`, {
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

export const saveGeneralInformation = async (
  jobId: number,
  payload: any
) => {

  const res = await fetch(
    `${API_URL}/${jobId}/general-information`,
    {
      method: "POST",
      headers: getAuthHeader(),
      body: JSON.stringify(payload),
    }
  );

  if (!res.ok) {
    throw new Error("Failed to save general information");
  }

  return res.json();
};

export const getJobGenerateContext = async (
  jobId?: number
): Promise<JobGenerateContext> => {

  const url = jobId
    ? `${API_URL}/generate/context?jobPostingId=${jobId}`
    : `${API_URL}/generate/context`;

  const res = await fetch(url, {
    headers: getAuthHeader(),
  });
  if (!res.ok) {
    throw new Error("Failed to fetch job generate context");
  }

  const data = await res.json();
  // console.log(data);

  return {
    categories: data.categories ?? [],
    templates: data.templates ?? [],
    groupedTags: data.groupedTags ?? [],
    selectedTagIds: data.selectedTagIds ?? [],
    userCreatedTags: data.userCreatedTags ?? [],
    selectedTemplateId: data.selectedTemplateId,
    selectedCategoryId: data.selectedCategoryId
  };
};

export const updateJobStatus = async (
  jobId: number,
  status: string
) => {

  let endpoint = "";

  switch (status) {

    case "OPEN":
      endpoint = "open";
      break;

    case "CLOSED":
      endpoint = "close";
      break;

    case "DRAFT":
      endpoint = "draft";
      break;

    default:
      throw new Error(
        "Unsupported status"
      );
  }

  const res = await fetch(
    `${API_URL}/${jobId}/${endpoint}`,
    {
      method: "PATCH",
      headers: getAuthHeader(),
    }
  );

  if (!res.ok) {
    throw new Error(
      "Failed to update job status"
    );
  }

  return res.json();
};

import { TotalMonthlyAnalytics } from "@/types/analytic";

export async function getTotalMonthlyAnalytics(): Promise<TotalMonthlyAnalytics> {

  const res = await fetch(
    `${API_URL}/admin/analytic`,
    {
      method: "GET",
      headers: getAuthHeader(),
      cache: "no-store",
    }
  );
  if (!res.ok) {
    throw new Error(
      "Failed to fetch dashboard analytics"
    );
  }
  return await res.json();

}
export const deleteJob = async (
  companyId: number,
  jobId: number
): Promise<void> => {
  const response = await fetch(
    `${API_URL}/${jobId}`,
    {
      method: "DELETE",
      headers: getAuthHeader(),
    }
  );

  if (!response.ok) throw new Error("Failed to delete job");
};

/**
 * Promote a job using a company's package.
 *
 * Maps to:
 * POST /promote/{jobId}?companyId={companyId}&companyPackageId={companyPackageId}
 */
export async function promoteJob(
  companyId: number,
  jobId: number,
  companyPackageId: number
): Promise<void> {
  const params = new URLSearchParams({
    companyId: String(companyId),
    companyPackageId: String(companyPackageId),
  });

  const res = await fetch(
    `${API_URL}/top-jobs/promote/${jobId}?${params.toString()}`,
    {
      method: "POST",
      headers: getAuthHeader(),
    }
  );

  if (!res.ok) {
    throw new Error(`Failed to promote job: ${res.status} ${res.statusText}`);
  }
}