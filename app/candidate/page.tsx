// import RoleGuard from "@/components/RoleGuard";

import Footer from "@/components/Footer";
import JobsPage from "./jobs/page";

export default async function CandidatePage() {

  return (
    // <RoleGuard allow={["CANDIDATE"]}>
      <div className="bg-gray-50">
        <JobsPage />
      </div>
    // </RoleGuard>
  );
}
