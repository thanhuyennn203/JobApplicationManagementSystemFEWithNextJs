import CandidateHeader from "@/components/CandidateHeader";
import Footer from "@/components/Footer";

export default function CandidateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="no-crollbar">
      {/* <Header /> */}
      <CandidateHeader />
      {children}
      {/* <Footer /> */}
    </div>
  );
}