import CandidateHeader from "@/components/CandidateHeader";
import Footer from "@/components/Footer";

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
      <Footer />
    </>
  );
}