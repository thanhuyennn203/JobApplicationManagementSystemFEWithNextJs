export const getJobDetailById = async (id: string) => {
  const res = await fetch(
    `http://localhost:9191/api/jobs/${id}/details`,
    { cache: "no-store" }
    
  );
  if (res.status === 404) return null;
  if (!res.ok) return null;

  return res.json();
};