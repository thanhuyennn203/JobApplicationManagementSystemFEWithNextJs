import SavedJobsList from "@/components/jobs/SavedJobsList";
import "@/styles/candidate/SavedJobsPage.css";

export default function SavedJobsPage() {

  return (
    <div className="saved-page">

      <div className="left">
        <SavedJobsList/>
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