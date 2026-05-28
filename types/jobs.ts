export interface Location {
  id: number;
  detailAddress: string;
  ward: string;
  province: string;
  provinceName: string;
  wardName: string;
  
}

export interface Job {
  id: number;
  title: string;
  company_id: number;
  company_name: string;
  salary_min: number;
  salary_max: number;
  locations?: Location[];
  logo_url?: string;
  tags?: string[];
  description?: string;
  dueDate: Date;
  experienceRequired: string;
  posted_date: Date;
  savedAt: Date;
  createStatus: String;
}

export interface JobDetail {
  id: number | null;
  job_id: number | null;
  description: string | null;
  requirement: string | null;
  income: string | null;
  interest: string | null;
  allowance: string | null;
  working_equipment: string | null;
  working_location: string | null;
  working_time: string | null;
  apply_by: string | null;
  due_date: string | null;
}

export interface GeneralInformation {
  rank: string;
  education: string;
  numberOfRecruitment: number;
  workingStyle: string;
  jobCategoryId?: number;
  categoryID?: number;
  categoryId?: number;
  job_category_id?: number;
  category?: {
    id?: number;
  };
  jobCategory?: {
    id?: number;
  };
  jobTemplateId?: number;
  templateID?: number;
  templateId?: number;
  jobTypeTemplateId?: number;
  job_template_id?: number;
  template?: {
    id?: number;
  };
  jobTemplate?: {
    id?: number;
  };
}

