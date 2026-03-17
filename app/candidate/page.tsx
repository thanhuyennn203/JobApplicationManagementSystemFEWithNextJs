// import RoleGuard from "@/components/RoleGuard";

import JobsPage from "./jobs/page";

export default async function CandidatePage() {

  return (
    // <RoleGuard allow={["CANDIDATE"]}>
      <div>
        <JobsPage />
      </div>
    // </RoleGuard>
  );
}
