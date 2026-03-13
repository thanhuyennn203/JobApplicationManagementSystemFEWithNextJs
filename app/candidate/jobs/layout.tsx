import Header from "@/components/CandidateHeader";

export default function JobLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* <Header /> */}
      {children}
    </>
  );
}