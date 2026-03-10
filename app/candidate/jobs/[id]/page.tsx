import { getJobById, getJobDetailById } from "@/services/jobs/jobs.service";
import JobRequirement from "@/components/jobs/JobRequirement";
import JobDetailHeader from "@/components/jobs/JobDetailHeader";
import "@/styles/JobDetail.css";
import JobCompanyCard from "@/components/jobs/JobCompanyCard";
import { getCompanyById } from "@/services/companies/company.service";
import { getGeneralInformationByJobId } from "@/services/jobs/jobGeneralInfor.service";
import JobGeneralInformation from "@/components/jobs/JobGeneralInformation";

interface Props {
  params: {
    id: number;
  };
}

export default async function JobDetailPage({ params }: Props) {
  const { id: jobId } = await params;

  const [job, jobDetail] = await Promise.all([
    getJobById(jobId),
    getJobDetailById(jobId),
  ]);

  // console.log("job: ",job);
  // console.log("job detail: ", jobDetail);
  const company = await getCompanyById(job?.company_id);
  const generalInfo = await getGeneralInformationByJobId(jobId);

  if (!jobDetail) {
    return (
      <div className="job-detail__wrapper">
        <p>Chưa có thông tin chi tiết cho công việc này.</p>
      </div>
    );
  }

  return (
    <div className="job-detail__wrapper">
      <div className="job-detail-body">
        <div className="job-detail__body-left">

          {/* HEADER */}
          <JobDetailHeader
            data={{
              jobId,
              title: job.title,
              income:
                job.salary_min && job.salary_max
                  ? `${job.salary_min} - ${job.salary_max}`
                  : "Negotiable",

              locations: job.locations?.map((l: any) => l.province) ?? [],
              experience: job.experienceRequired
                ? job.experienceRequired.split("\n")[0]
                : "Not required",
              due_date: job.dueDate,
            }} />

          {/* BODY */}
          <section className="job-detail-box__left">
            <JobRequirement title="Job Description" content={jobDetail.description || "Not specified"} />
            <JobRequirement title="Candidate Requirements" content={jobDetail.requirement || "Not specified"} />
            <JobRequirement title="Benefits" content={jobDetail.interest || "Not specified"} />
            <JobRequirement title="Allowance" content={jobDetail.allowance || "Not specified"} />
            <JobRequirement title="Income" content={jobDetail.income || "Negotiable"} />
            <JobRequirement title="Working Time" content={jobDetail.working_time || "Not specified"} />

            <ul >
            <h3>Working Locations</h3>

              {job?.locations?.map((loc) => (
                <li key={loc.id}>
                  - {loc.detailAddress}, {loc.ward}, {loc.province}
                </li>
              ))}
            </ul>

            <JobRequirement title="How to Apply" content={jobDetail.apply_by || "Not specified"} />

            <div className="job-section">
              <h3>
                Application Deadline:{" "}
                <span>
                  {jobDetail.due_date
                    ? new Date(jobDetail.due_date).toLocaleDateString("en-US")
                    : "Not specified"}
                </span>
              </h3>
            </div>

            <div className="group-btn">
              <button className="apply-btn">
                Apply Now
              </button>

              {/* <button className="save-btn">
      Save Job
    </button> */}
            </div>
          </section>
        </div>
        <div className="job-detail__body-right">
          <JobCompanyCard company={company} />
          <JobGeneralInformation data={generalInfo} />
        </div>
      </div>
    </div>
  );
}

