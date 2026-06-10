export interface MetricDto {
    total: number;
    current: number;
    previous: number;
    growthPercent: number;
    predictionNextMonth: number;
}


export interface TotalMonthlyAnalytics {

    openJobs: MetricDto;

    appliedApplications: MetricDto;

    newCandidates: MetricDto;

    newEmployers: MetricDto;

}

export interface TopJobByApplicationDto {

    jobId: number;

    jobTitle: string;

    companyName: string;

    applicationCount: number;

}