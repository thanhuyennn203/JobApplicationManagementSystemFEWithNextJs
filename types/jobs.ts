export interface Location {
  id: number;
  detailAddress: string;
  ward: string;
  province: string;
}

export interface Job {
  id: number;
  title: string;
  company_id: number;
  company_name: string;
  salary_min: number;
  salary_max: number;
  locations?: Location[];
  logo?: string;
  tags?: string[];
}


export interface JobDetail {
  requirement: string;
  income: string;
  working_time: string;
  working_location: string;
  apply_by: string;
  due_date: Date;
}