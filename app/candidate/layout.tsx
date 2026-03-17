import CandidateHeader from "@/components/CandidateHeader";

export default function CandidateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* <Header /> */}
      <CandidateHeader />
      {children}
    </>
  );
}