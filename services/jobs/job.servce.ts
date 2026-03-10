export const getJobById = async (id: string) => {
  const res = await fetch(
    `http://localhost:9191/api/jobs/${id}`,
    { cache: "no-store" }
  );
  if (!res.ok) throw new Error("Failed to fetch job");
  return res.json();
};
