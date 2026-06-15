import JobSearch from "@/components/jobs/JobSearch";
import TopCompanies from "./TopCompany";
import CenterBanner from "@/components/Banner";
import FeaturedBoxJobsWithFilters from "./FeaturedBoxJobsWithFilers";
import TopJobCategories from "./TopCategorySection";
import SuggestJobs from "./SuggestJobs";

export default async function JobsPage() {

  return (
    <div className="container">
      <JobSearch />
      <div className="main-container">
        <FeaturedBoxJobsWithFilters /> 
        <CenterBanner />
        <TopCompanies />
        <SuggestJobs />
        <TopJobCategories />

       <div>
        <img src="/images/tuvan.png" alt="" />
       </div>
      </div>
    </div>
  );
}
