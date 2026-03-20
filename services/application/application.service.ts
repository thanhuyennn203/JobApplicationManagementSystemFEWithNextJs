import { Application } from "@/types/application";

export const applyJob = async (data: FormData) => {
  const res = await fetch("http://localhost:9191/api/applications/apply", {
    method: "POST",
    body: data,
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(errorText || "Failed to apply");
  }

  return res.text(); // or res.json() if your BE returns JSON
};

export const getAppliedJobByCandidateId = async (id: number) => {
  const res = await fetch(
    `http://localhost:9191/api/applications/candidate/${id}`,
    { cache: "no-store" }
  );
  if (!res.ok) throw new Error("Failed to fetch job");
  const data: Application = await res.json();
  return data;
};

export const getAppliedJobByJobId = async (id: number) => {
  const res = await fetch(
    `http://localhost:9191/api/applications/job/${id}`,
    { cache: "no-store" }
  );
  if (!res.ok) throw new Error("Failed to fetch job");
  const data: Application[] = await res.json();
  return data;
};

export const getAppliedJobByCompanyId = async (id: number) => {
  const res = await fetch(
    `http://localhost:9191/api/applications/company/${id}`,
    { cache: "no-store" }
  );
  if (!res.ok) throw new Error("Failed to fetch job");
  const data: Application[] = await res.json();
  return data;
};
