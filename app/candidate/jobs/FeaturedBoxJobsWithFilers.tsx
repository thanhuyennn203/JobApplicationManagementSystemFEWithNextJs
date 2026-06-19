"use client";

import { useEffect, useState } from "react";
import JobCard from "@/components/jobs/JobCard";
import Pagination from "@/components/jobs/Pagination";
import "@/styles/jobs/JobsByLocations.css";
import { getFeaturedBoxJobsWithFilters } from "@/services/jobs/jobs.service";
import { Job } from "@/types/jobs";
import JobFilterBar from "@/components/jobs/JobFilterBar";
import { PageResponse } from "@/types/TopJob";

export default function FeaturedBoxJobsWithFilters() {
  // const [jobs, setJobs] = useState<Job[]>([]);
  const [page, setPage] = useState(1);
  const [jobsPage, setJobsPage] =
    useState<PageResponse<Job> | null>(null);

  const [filters, setFilters] = useState({
    provinceId: undefined as string | undefined,
    region: undefined as string | undefined,
    minSalary: undefined as number | undefined,
    maxSalary: undefined as number | undefined,
    jobRank: undefined as string | undefined,
  });

  const EMPTY_FILTERS = {
    provinceId: undefined,
    region: undefined,
    minSalary: undefined,
    maxSalary: undefined,
    jobRank: undefined,
  };

  useEffect(() => {
    const loadJobs = async () => {
      const response =
        await getFeaturedBoxJobsWithFilters({
          ...filters,
          page: page - 1,
          size: 9,
        });

      setJobsPage(response);
    };

    loadJobs();

  }, [filters, page]);
// console.log(jobsPage?.content);

  return (
    <div className="jobs-by-locations">
      <div className="left">

        <JobFilterBar
          onFilterChange={(type: string, value: any) => {

            if (type === "Location") {

              if (value.code === "") {
                setFilters(EMPTY_FILTERS);
              }

              else if (
                value.code === "NORTH" ||
                value.code === "SOUTH"
              ) {
                setFilters({
                  ...EMPTY_FILTERS,
                  region: value.code,
                });
              }

              else {
                setFilters({
                  ...EMPTY_FILTERS,
                  provinceId: value.code,
                });
              }

              setPage(1);
            }

            if (type === "Salary") {
              const salary = getSalaryRange(value.code);
              setFilters({
                ...EMPTY_FILTERS,
                minSalary: salary.minSalary,
                maxSalary: salary.maxSalary,
              });

              setPage(1);
            }

            if (type === "Experience") {

              setFilters({
                ...EMPTY_FILTERS,
                jobRank: value.code,
              });

              setPage(1);
            }
          }} />
        {/* job grid */}
        <div className="job-grid">
          {jobsPage?.content.map((job) => (
            <JobCard key={job.id} job={job} />
            
          ))}
        </div>

        {/* pagination */}
        <Pagination
          page={page}
          totalPages={jobsPage?.totalPages || 0}
          setPage={setPage}
        />
      </div>

      {/* <div className="right">
        <img src="/no-spotlight-mau-cv.png" alt="" />
      </div> */}
    </div>
  );
}