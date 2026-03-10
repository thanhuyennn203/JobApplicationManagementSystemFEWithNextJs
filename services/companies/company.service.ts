export const getCompanyById = async (id: number) => {
  const res = await fetch(
    `http://localhost:9191/api/companies/${id}`,
    { cache: "no-store" }
  );
if (res.status === 404) return null;
  if (!res.ok) {
    throw new Error("Failed to fetch company");
  }

  return res.json();
};
