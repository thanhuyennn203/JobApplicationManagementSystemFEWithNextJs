import RecruiterHeader from "@/components/recruiter/RecruiterHeader";
// import "@/styles/recruiter/RecruiterHeader.css";

export default function RecruiterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="recruiter-layout">
      <RecruiterHeader />

      <main className="recruiter-content">
        {children}
      </main>
    </div>
  );
}