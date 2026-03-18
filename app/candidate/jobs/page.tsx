import JobSearch from "@/components/jobs/JobSearch";
import JobsByLocation from "./JobByLocation";
import TopCompanies from "./TopCompany";

export default async function JobsPage() {

  return (
    <div className="container">
      <JobSearch />
      <div className="main-container">
        <JobsByLocation />
        <TopCompanies />
      </div>
    </div>
  );
}
