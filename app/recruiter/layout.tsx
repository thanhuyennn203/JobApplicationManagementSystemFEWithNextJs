import RecruiterSidebar from "@/components/recruiter/RecruiterSidebar";
import "@/styles/recruiter/layout.css";

export default function RecruiterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="recruiter-layout">
      <RecruiterSidebar />

      <main className="recruiter-content">
        {children}
      </main>
    </div>
  );
}