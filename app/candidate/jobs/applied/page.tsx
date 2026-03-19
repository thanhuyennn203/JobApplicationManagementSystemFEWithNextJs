import AppliedJobsList from "@/components/jobs/AppliedJobList";
// import "@/styles/candidate/AppliedJobPage.css";
import "@/styles/candidate/SavedJobsPage.css";

export default function AppliedJobsPage() {

  return (
    <div className="saved-page">

      <div className="left">
        <AppliedJobsList/>
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