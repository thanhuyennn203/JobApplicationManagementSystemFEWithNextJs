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

export const updateCompany = async (id: number, payload: any) => {
  const res = await fetch(`http://localhost:9191/api/companies/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) throw new Error("Update failed");

  return res.json();
};

export const getTopCompanies = async () => {
  const res = await fetch(
    `http://localhost:9191/api/companies/top`,
    { cache: "no-store" }
  );
  if (res.status === 404) return null;
  if (!res.ok) {
    throw new Error("Failed to fetch company");
  }

  return res.json();
};