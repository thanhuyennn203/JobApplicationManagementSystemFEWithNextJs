import RecruiterHeader from "@/components/recruiter/RecruiterHeader";
// import "@/styles/recruiter/RecruiterHeader.css";
import { CartProvider } from "@/context/CartContext";

export default function RecruiterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CartProvider>
      <div className="recruiter-layout">
        <RecruiterHeader />
        <main className="recruiter-content">
          {children}
        </main>
      </div>
    </CartProvider>

  );
}