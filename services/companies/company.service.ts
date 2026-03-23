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

export const followCompany = async (candidateId: number, companyId: number) => {
  const res = await fetch(`http://localhost:9191/api/candidates/follow-company`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      candidateId,
      companyId,
    }),
  });

  if (!res.ok) {
    throw new Error("Follow failed");
  }

  return res.json();
};

export const unfollowCompany = async (candidateId: number, companyId: number) => {
  const res = await fetch(`http://localhost:9191/api/candidates/follow-company`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      candidateId,
      companyId,
    }),
  });

  if (!res.ok) {
    throw new Error("Unfollow failed");
  }

  return res.json();
};

export const checkFollowCompany = async (candidateId: number, companyId: number) => {
  const res = await fetch(`http://localhost:9191/api/candidates/follow-company/check`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      candidateId,
      companyId,
    }),
  });

  if (!res.ok) {
    throw new Error("Check follow failed");
  }

  return res.json();
};

export async function uploadCertificate(
  file: File,
  companyId: number
) {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(
    `http://localhost:9191/api/companies/${companyId}/certificate`,
    {
      method: "POST",
      body: formData,
    }
  );

  if (!res.ok) {
    throw new Error("Upload failed");
  }

  return res.json(); // ✅ correct
}


export const getAllCompanies = async () => {
  const res = await fetch(
    `http://localhost:9191/api/companies`,
    { cache: "no-store" }
  );
  if (res.status === 404) return null;
  if (!res.ok) {
    throw new Error("Failed to fetch company");
  }

  return res.json();
};


const BASE_URL = "http://localhost:9191/api/companies";

export const approveCompany = async (id: number) => {
  const res = await fetch(`${BASE_URL}/admin/${id}/approve`, {
    method: "POST",
  });

  if (!res.ok) {
    throw new Error("Approve failed");
  }

  return res.json();
};

export const rejectCompany = async (id: number, reason: string) => {
  const res = await fetch(
    `${BASE_URL}/admin/${id}/reject?reason=${encodeURIComponent(reason)}`,
    {
      method: "POST",
    }
  );

  if (!res.ok) {
    throw new Error("Reject failed");
  }

  return res.json();
};