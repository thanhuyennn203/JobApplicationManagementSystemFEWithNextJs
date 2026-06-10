import { Candidate, CandidateUpdatePayload } from "@/types/candidate";
import { CandidateAdmin } from "@/types/auth";

const API_URL = "http://localhost:9191/api/candidates";

type CandidateApiResponse = Candidate & {
  data?: CandidateApiResponse;
  firstName?: string;
  lastName?: string;
  profile_url?: string;
  avatar?: string;
  dateOfBirth?: string;
  dob?: string;
  DOB?: string;
};

const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return {
    "Authorization": `Bearer ${token}`,
    "Content-Type": "application/json",
  };
};

const unwrapCandidate = (response: CandidateApiResponse): CandidateApiResponse => {
  return response.data ?? response;
};

const normalizeCandidate = (response: CandidateApiResponse): Candidate => {
  const data = unwrapCandidate(response);

  return {
    ...data,
    first_name: data.first_name ?? data.firstName ?? "",
    last_name: data.last_name ?? data.lastName ?? "",
    dOB: data.dOB ?? data.dob ?? data.DOB ?? data.dateOfBirth ?? "",
    profileUrl: data.profileUrl ?? data.profile_url ?? data.avatar ?? "",
  };
};

const toCandidateRequest = (payload: CandidateUpdatePayload) => ({
  ...payload,
  dob: payload.dOB,
  DOB: payload.dOB,
});

export async function getCandidateByUserId(userId: number): Promise<Candidate> {
  const res = await fetch(`${API_URL}/user/${userId}`, {
    headers: getAuthHeader(),
  });

  if (!res.ok) {
    throw new Error("Cannot get candidate");
  }

  return normalizeCandidate(await res.json());
}

export async function getCandidateById(candidateId: number): Promise<Candidate> {
  const res = await fetch(`${API_URL}/${candidateId}`, {
    method: "GET",
    headers: getAuthHeader(),
  });

  if (!res.ok) {
    throw new Error("Cannot get candidate");
  }

  return normalizeCandidate(await res.json());
}

export async function getCandidateProfileById(candidateId: number): Promise<Candidate> {
  const res = await fetch(`${API_URL}/profile/${candidateId}`, {
    method: "GET",
    headers: getAuthHeader(),
  });

  if (!res.ok) {
    throw new Error("Cannot get candidate");
  }

  return normalizeCandidate(await res.json());
}

export async function updateCandidate(
  candidateId: number,
  payload: CandidateUpdatePayload
): Promise<Candidate> {
  const res = await fetch(`${API_URL}/${candidateId}`, {
    method: "PATCH",
    headers: getAuthHeader(),
    body: JSON.stringify(toCandidateRequest(payload)),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(errorText || "Cannot update candidate");
  }

  const responseText = await res.text();
  if (!responseText) {
    return getCandidateProfileById(candidateId);
  }

  try {
    const updated = normalizeCandidate(JSON.parse(responseText));
    return getCandidateProfileById(Number(updated.id ?? candidateId));
  } catch {
    return getCandidateProfileById(candidateId);
  }
}


