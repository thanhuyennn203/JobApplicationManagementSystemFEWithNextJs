import JobSearch from "@/components/jobs/JobSearch";
import TopCompanies from "./TopCompany";
import CenterBanner from "@/components/Banner";
import FeaturedBoxJobsWithFilters from "./FeaturedBoxJobsWithFilers";
import TopJobCategories from "./TopCategorySection";
import SuggestJobs from "./SuggestJobs";
// import { useAuth } from "@/context/AuthContext";

export default async function JobsPage() {
  // const auth = useAuth();
  // const logined = auth?.user?.candidateId;
  return (
    <div className="container">
      <JobSearch />
      <div className="main-container">
        <FeaturedBoxJobsWithFilters />
        <CenterBanner />
        <TopCompanies />
        < SuggestJobs />
        <TopJobCategories />

        {/* <div>
        <img src="/images/tuvan.png" alt="" />
       </div> */}
      </div>
    </div>
  );
}
