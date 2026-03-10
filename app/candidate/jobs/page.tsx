import JobSearch from "@/components/jobs/JobSearch";
import JobGrid from "./JobGrid";

export default async function JobsPage() {

  return (
    <div className="container">
      <JobSearch />
      <JobGrid/>
    </div>
  );
}
