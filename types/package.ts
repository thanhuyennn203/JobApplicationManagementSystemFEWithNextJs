export interface PackageBenefit {
  code: string;
  title: string;
  value: string;
  enabled: boolean;
  description?: string;
}


export interface PackageData {
    id: number;
    code: string;
    name: string;
    price: number;
    displayDays: number;
    serviceDays: number;
    vip: boolean;
    descriptions: string;
    benefits: PackageBenefit[];
}

export interface CompanyPackageData {
    companyId: number;
    packageId: number;
    packageCode: string;
    packageName: string;
    categoryCode: string;
    startDate: string;
    endDate: string;
    status: "ACTIVE" | "PENDING" | "EXPIRED";
    id: number;
}