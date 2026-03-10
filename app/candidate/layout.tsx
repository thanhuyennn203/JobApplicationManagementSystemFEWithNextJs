import Header from "@/components/Header";

export default function CandidateLayout({
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