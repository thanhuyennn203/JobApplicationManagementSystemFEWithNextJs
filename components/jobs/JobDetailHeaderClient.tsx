"use client";

import JobDetailHeader from "@/components/jobs/JobDetailHeader";
import { useLocation } from "@/context/LocationContext";

export default function JobDetailHeaderClient({ job, jobId }: any) {
  const { provinces } = useLocation();

  // map code -> name
  const provinceMap = Object.fromEntries(
    provinces.map((p) => [p.code, p.nameEn])
  );

  const locations =
    job.locations?.map((l: any) => provinceMap[l.province] || l.province) || [];

  return (
    <JobDetailHeader
      data={{
        jobId,
        title: job.title,
        income:
          job.salary_min && job.salary_max
            ? `${job.salary_min} - ${job.salary_max}`
            : "Negotiable",
        locations,
        experience: job.experienceRequired
          ? job.experienceRequired.split("\n")[0]
          : "Not required",
        due_date: job.dueDate,
      }}
    />
  );
}