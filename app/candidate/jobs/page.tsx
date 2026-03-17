import JobSearch from "@/components/jobs/JobSearch";
import JobsByLocation from "./JobByLocation";

export default async function JobsPage() {

  return (
    <div className="container">
      <JobSearch />
      <div className="main_container">
        <JobsByLocation />
        
      </div>
    </div>
  );
}
