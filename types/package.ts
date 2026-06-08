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
