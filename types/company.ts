export interface Company {
  id?: number;
  name?: string;
  industry?: string;
  size?: number;
  province?: string;
  ward?: string;
  description?: string;
  logo_url?: string;
  followerNumber?: number;
  backgroundUrl?: string;
  website?: string;
  certificateUrl?: string;
  verificationStatus?: string;
  rejectionReason?: string;
}

export interface Member {
    id?: number;
    companyId?: number;
    userId?: number;
    position?: string;
    department?: string;
    description?: string;
    gender?: string;
    phone?: string;
    email?: string;
    fullName?: string;
    creatAt?: Date;
}