import JobSearch from "@/components/jobs/JobSearch";
import JobsByLocation from "./JobByLocation";
import TopCompanies from "./TopCompany";
import CenterBanner from "@/components/Banner";

export default async function JobsPage() {

  return (
    <div className="container">
      <JobSearch />
      <div className="main-container">
        <JobsByLocation /> 
        <CenterBanner />
        <TopCompanies />
       <div>
        <img src="/images/tuvan.png" alt="" />
       </div>
      </div>
    </div>
  );
}
