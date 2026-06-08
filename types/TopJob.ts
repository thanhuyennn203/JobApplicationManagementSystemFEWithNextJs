export enum TopJobFilterType {
  DEFAULT = "DEFAULT",
  RANDOM = "RANDOM",
  LOCATION = "LOCATION",
  SALARY = "SALARY",
  EXPERIENCE = "EXPERIENCE",
}

export interface PageResponse<T> {
  content: T[];

  pageable: {
    pageNumber: number;
    pageSize: number;
    sort: any[];
    offset: number;
    paged: boolean;
    unpaged: boolean;
  };

  last: boolean;
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
  numberOfElements: number;
  first: boolean;
  sort: any[];
  empty: boolean;
}

export interface TopJobRequest {
  page: number;
  size: number;

  filterType?: TopJobFilterType;

  province?: string;

  minSalary?: number;
  maxSalary?: number;

  experienceRequired?: string;
}

export interface PageResponse<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  number: number;
}