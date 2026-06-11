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
  const [jobs, setJobs] = useState<Job[]>([]);
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

  const loadFakeJobs = () => {
    const topJobs: Job[] = [
      {
        id: 1,
        title: "Senior Frontend Developer",
        company_id: 101,
        company_name: "TechNova Solutions",
        salary_min: 2500,
        salary_max: 4500,
        locations: [
          {
            id: 1,
            name: "Ho Chi Minh City"
          }
        ],
        logo_url: "/images/company1.png",
        tags: ["React", "Next.js", "TypeScript"],
        description: "Build modern web applications using React and Next.js.",
        dueDate: "2026-07-15",
        experienceRequired: "3+ years",
        posted_date: new Date("2026-06-10"),
        savedAt: new Date("2026-06-11"),
        createStatus: "APPROVED",
        status: "OPEN"
      },
      {
        id: 2,
        title: "Backend Java Developer",
        company_id: 102,
        company_name: "Global Fintech",
        salary_min: 3000,
        salary_max: 5500,
        locations: [
          {
            id: 2,
            name: "Hanoi"
          }
        ],
        logo_url: "/images/company2.png",
        tags: ["Java", "Spring Boot", "Microservices"],
        description: "Develop scalable backend systems and APIs.",
        dueDate: "2026-07-20",
        experienceRequired: "2+ years",
        posted_date: new Date("2026-06-09"),
        savedAt: new Date("2026-06-10"),
        createStatus: "APPROVED",
        status: "OPEN"
      },
      {
        id: 3,
        title: "UI/UX Designer",
        company_id: 103,
        company_name: "Creative Studio",
        salary_min: 1200,
        salary_max: 2500,
        locations: [
          {
            id: 3,
            name: "Da Nang"
          }
        ],
        logo_url: "/images/company3.png",
        tags: ["Figma", "UX Research", "Design System"],
        description: "Design user-friendly digital products.",
        dueDate: "2026-07-05",
        experienceRequired: "1+ years",
        posted_date: new Date("2026-06-08"),
        savedAt: new Date("2026-06-09"),
        createStatus: "APPROVED",
        status: "OPEN"
      },
      {
        id: 4,
        title: "DevOps Engineer",
        company_id: 104,
        company_name: "CloudX Technology",
        salary_min: 3500,
        salary_max: 6500,
        locations: [
          {
            id: 4,
            name: "Ho Chi Minh City"
          }
        ],
        logo_url: "/images/company4.png",
        tags: ["Docker", "Kubernetes", "AWS"],
        description: "Manage cloud infrastructure and deployment pipelines.",
        dueDate: "2026-07-25",
        experienceRequired: "4+ years",
        posted_date: new Date("2026-06-07"),
        savedAt: new Date("2026-06-08"),
        createStatus: "APPROVED",
        status: "OPEN"
      }
    ];
    setJobs(topJobs);
  }

  useEffect(() => {
    const loadJobs = async () => {
      const response =
        await getFeaturedBoxJobsWithFilters({
          ...filters,
          page: page - 1,
          size: 8,
        });

      setJobsPage(response);
    };

    // loadJobs();
    loadFakeJobs();

  }, [filters, page]);

  const getSalaryRange = (code: string) => {
    switch (code) {
      case "UNDER_500":
        return {
          minSalary: undefined,
          maxSalary: 500,
        };

      case "500_1000":
        return {
          minSalary: 500,
          maxSalary: 1000,
        };

      case "1000_2000":
        return {
          minSalary: 1000,
          maxSalary: 2000,
        };

      case "OVER_2000":
        return {
          minSalary: 2000,
          maxSalary: undefined,
        };

      default:
        return {
          minSalary: undefined,
          maxSalary: undefined,
        };
    }
  };

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

      <div className="right">
        <img src="/no-spotlight-mau-cv.png" alt="" />
      </div>
    </div>
  );
}