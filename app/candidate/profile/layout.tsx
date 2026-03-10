export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: "flex" }}>
      <aside>Profile Menu</aside>
      <section>{children}</section>
    </div>
  );
}
