import JobSearch from "@/components/jobs/JobSearch";
import TopCompanies from "./TopCompany";
import CenterBanner from "@/components/Banner";
import FeaturedBoxJobsWithFilters from "./FeaturedBoxJobsWithFilers";

export default async function JobsPage() {

  return (
    <div className="container">
      <JobSearch />
      <div className="main-container">
        <FeaturedBoxJobsWithFilters /> 
        <CenterBanner />
        <TopCompanies />
       <div>
        <img src="/images/tuvan.png" alt="" />
       </div>
      </div>
    </div>
  );
}
