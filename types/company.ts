export interface Company {
  companyId?: number;
  companyName?: string;
  industry?: string;
  size?: number;
  province?: string;
  ward?: string;
  description?: string;
  logoUrl?: string;
  followers?: number;
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