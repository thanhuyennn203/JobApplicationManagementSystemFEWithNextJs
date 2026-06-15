"use client";

import { getJobById, getJobDetailById } from "@/services/jobs/jobs.service";
import JobDetailHeaderClient from "@/components/jobs/JobDetailHeaderClient";
import "@/styles/candidate/JobDetail.css";
import JobCompanyCard from "@/components/jobs/JobCompanyCard";
import { getCompanyById } from "@/services/companies/company.service";
import { getGeneralInformationByJobId } from "@/services/jobs/jobs.service";
import JobGeneralInformation from "@/components/jobs/JobGeneralInformation";
import { useEffect, useState } from "react";
import { Company } from "@/types/company";
import { GeneralInformation, Job, JobDetail } from "@/types/jobs";
import { useParams } from "next/navigation";
import ApplyJobModal from "@/components/application/ApplyJobModal";

export default function JobDetailPage() {
  // const { id: jobId } = params;
  const params = useParams();
  const jobId = Number(params.id);
  // console.log(params.id);

  const [company, setCompany] = useState<Company | null>(null);
  const [job, setJob] = useState<Job | null>(null);
  const [jobDetail, setJobDetail] = useState<JobDetail | null>(null);
  const [generalInfo, setGeneralInfo] = useState<GeneralInformation | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const jobData = await getJobById(jobId);
        setJob(jobData);

        const jobDetailData = await getJobDetailById(jobId);
        setJobDetail(jobDetailData);

      } catch (err) {
        console.error("Fetch company error:", err);
      }
    };

    fetchJob();
  }, [jobId]);

  // console.log("companyId in detail:" ,job?.company_id);

  useEffect(() => {
    if (!job?.company_id) return;

    const fetchMoreDetail = async () => {
      try {
        const companyData = await getCompanyById(job.company_id);
        setCompany(companyData);

        const generalInfoData = await getGeneralInformationByJobId(jobId);
        setGeneralInfo(generalInfoData);
      } catch (err) {
        console.error("Fetch more detail error:", err);
      }
    };

    fetchMoreDetail();
  }, [job?.company_id, jobId]);


  const sections = [
    { title: "Job Description", value: jobDetail?.description },
    { title: "Candidate Requirements", value: jobDetail?.requirement },
    { title: "Benefits", value: jobDetail?.interest },
    { title: "Allowance", value: jobDetail?.allowance },
    { title: "Income", value: jobDetail?.income || "Negotiable" },
    { title: "Working Time", value: jobDetail?.working_time },
    { title: "How to Apply", value: jobDetail?.apply_by },
  ];

  return (
    <div className="job-detail__wrapper">
      <div className="job-detail-body">
        <div className="job-detail__body-left">
          <JobDetailHeaderClient job={job} jobId={jobId} />
          {/* BODY */}
          <section className="job-detail-box__left">
            {sections.map((sec, idx) => (
              <div className="job-section" key={idx}>
                <h3>{sec.title}</h3>

                <ul>
                  {(sec.value || "Not specified")
                    .split("\n")
                    .filter((item: string) => item.trim() !== "")
                    .map((item: string, i: number) => (
                      <li key={i}>{item}</li>
                    ))}
                </ul>
              </div>
            ))}

            {/* Locations */}
            <div className="job-section">
              <h3>Working Locations</h3>
              <ul>
                {job?.locations?.map((loc: any) => (
                  <li key={loc.id}>
                    {loc.detailAddress}, {loc.ward}, {loc.province}
                  </li>
                ))}
              </ul>
            </div>

            {/* Deadline */}
            <div className="job-section deadline">
              <h3>Application Deadline</h3>
              <p>
                {jobDetail?.due_date
                  ? new Date(jobDetail.due_date).toLocaleDateString("en-US")
                  : "Not specified"}
              </p>
            </div>

            <div className="group-btn" onClick={() => setShowModal(true)}>
              <button className="apply-btn">Apply Now</button>
            </div>
          </section>
        </div>
        <div className="job-detail__body-right">
          <JobCompanyCard company={company} />
          <JobGeneralInformation data={generalInfo} />
        </div>


      </div>
      {showModal && (
        <>
          <div className="modal-backdrop" onClick={() => setShowModal(false)}></div>
          <ApplyJobModal
            jobTitle={job?.title || ""}
            jobId={jobId}
            companyId={job?.company_id}
            onClose={() => setShowModal(false)}
          />
        </>
      )}
    </div>
  );
}

