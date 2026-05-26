export interface Candidate {
  id?: number;
  userId?: number;
  first_name?: string;
  last_name?: string;
  headline?: string;
  bio?: string;
  email?: string;
  phone?: string;
  gender?: string;
  dOB?: string;
  dob?: string;
  DOB?: string;
  profileUrl?: string;
}

export type CandidateUpdatePayload = {
  first_name: string;
  last_name: string;
  headline: string;
  bio: string;
  phone: string;
  gender: string;
  dOB: string;
  profileUrl: string;
};
