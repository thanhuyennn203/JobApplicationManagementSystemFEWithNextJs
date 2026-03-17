import JobSearch from "@/components/jobs/JobSearch";
import JobGrid from "./JobGrid";
import JobsByLocation from "./JobByLocation";

export default async function JobsPage() {

  return (
    <div className="container">
      <JobSearch />
      <JobGrid/>
      <JobsByLocation />
    </div>
  );
}
