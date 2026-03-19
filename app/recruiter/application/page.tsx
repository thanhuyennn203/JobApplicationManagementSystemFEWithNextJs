import AppliedJobsList from "@/components/jobs/AppliedJobList";
// import "@/styles/candidate/AppliedJobPage.css";
import "@/styles/candidate/SavedJobsPage.css";
import ApplicationCandidateList from "./ApplicationCandidateList";

export default function ApplicationCandidatesPage() {

  return (
    <div className="saved-page">

      <div className="left">
        <ApplicationCandidateList/>
      </div>

      <div className="right">
        <img
          src="/no-spotlight-mau-cv.png"
          className="banner"
        />

      </div>

    </div>
  )
}