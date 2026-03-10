import JobSearch from "@/components/jobs/JobSearch";
import JobGrid from "./JobGrid";
import { fetchJobs } from "@/services/jobs/jobs.service";
import { Job } from "@/types/jobs";

export default async function JobsPage() {
  const jobs: Job[] = await fetchJobs();

  return (
    <div className="container">
      <JobSearch />
      <JobGrid jobs={jobs} />
    </div>
  );
}
