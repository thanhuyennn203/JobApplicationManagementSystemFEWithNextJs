import ApplicationCandidateList from "./ApplicationCandidateList";
import ApplicationAnalysis from "./ApplicationAnalysis";

export default function ApplicationCandidatesPage() {
  return (
    <div className="p-6 bg-[#f6f7fb] min-h-screen space-y-6">

      {/* 🔥 ANALYSIS */}
      <ApplicationAnalysis />

      {/* LIST */}
      <ApplicationCandidateList />

    </div>
  );
}