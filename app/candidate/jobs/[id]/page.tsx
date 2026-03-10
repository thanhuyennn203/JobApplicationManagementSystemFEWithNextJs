import { getJobById } from "@/services/jobs/job.servce";
import { getJobDetailById } from "@/services/jobs/jobDetail.service";
import JobRequirement from "@/components/jobs/JobRequirement";
import JobDetailHeader from "@/components/jobs/JobDetailHeader";
import "@/styles/JobDetail.css";
import JobCompanyCard from "@/components/jobs/JobCompanyCard";
import { getCompanyById } from "@/services/companies/company.service";
import { getGeneralInformationByJobId } from "@/services/jobs/jobGeneralInfor.service";
import JobGeneralInformation from "@/components/jobs/JobGeneralInformation";

interface Props {
  params: {
    id: string;
  };
}

export default async function JobDetailPage({ params }: Props) {
  const { id: jobId } = await params;
  // console.log("job id: ",jobId);
  // fetch data in parallel (faster)
  const [job, jobDetail] = await Promise.all([
    getJobById(jobId),
    getJobDetailById(jobId),
  ]);

  const company = await getCompanyById(job?.company_id);
  const generalInfo = await getGeneralInformationByJobId(jobId);
  // console.log("company id: ",company_id);
  // console.log(company);
  // console.log(jobDetail);
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
              income: jobDetail.income || "Thoả thuận",
              locations: job.locations?.map((l: any) => l.province) ?? [],
              experience: job.experienceRequired
                ? jobDetail.requirement.split("\n")[0]
                : "Không yêu cầu",
              due_date: jobDetail.due_date,
            }} />

          {/* BODY */}
          <section className="job-detail-box__left">
            <JobRequirement title="Mô tả công việc" content={jobDetail.description} />
            <JobRequirement title="Yêu cầu ứng viên" content={jobDetail.requirement} />
            <JobRequirement title="Quyền lợi" content={jobDetail.interest} />
            <JobRequirement title="Phụ cấp" content={jobDetail.allowance} />
            <JobRequirement title="Thu nhập" content={jobDetail.income} />
            <JobRequirement title="Thời gian làm việc" content={jobDetail.working_time} />
            <JobRequirement title="Địa điểm" content={jobDetail.working_location} />
            <JobRequirement title="Cách ứng tuyển" content={jobDetail.apply_by} />
            <div className="job-section">
              <h3>Hạn nộp hồ sơ: <span>{new Date(jobDetail.due_date).toLocaleDateString("vi-VN")}</span></h3>
            </div>

            <div className="group-btn">
              <button className="apply-btn">
                Ứng tuyển ngay
              </button>

              {/* <button className="save-btn">
                Lưu tin
              </button> */}
            </div>
            {/* <div className="job-info-grid">
              <Info label="Thu nhập" value={jobDetail.income} />
              <Info label="Thời gian làm việc" value={jobDetail.working_time} />
              <Info label="Địa điểm" value={jobDetail.working_location} />
              <Info label="Cách ứng tuyển" value={jobDetail.apply_by} />
              <Info
                label="Hạn nộp hồ sơ"
                value={
                  jobDetail.due_date
                    ? new Date(jobDetail.due_date).toLocaleDateString("vi-VN")
                    : undefined
                }
              />
            </div> */}
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

// function Info({ label, value }: { label: string; value?: string }) {
//   if (!value) return null;
//   return (
//     <div className="job-info">
//       <span className="label">{label}</span>
//       <span className="value">{value}</span>
//     </div>
//   );
// }
