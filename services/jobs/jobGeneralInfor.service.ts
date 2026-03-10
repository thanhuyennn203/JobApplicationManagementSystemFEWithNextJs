export interface GeneralInformation {
  rank: string;
  education: string;
  numberOfRecruitment: number;
  workingStyle: string;
}

export async function getGeneralInformationByJobId(
  jobId: string
): Promise<GeneralInformation | null> {
  try {
    const res = await fetch(
      `http://localhost:9191/api/jobs/${jobId}/general-information`,
      { cache: "no-store" }
    );

    if (!res.ok) return null;
    return res.json();
  } catch (error) {
    console.error("Failed to fetch general information", error);
    return null;
  }
}
