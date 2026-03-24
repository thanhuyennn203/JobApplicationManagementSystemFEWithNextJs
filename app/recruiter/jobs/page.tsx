"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import "@/styles/jobs/JobPage.css";
import { useRouter } from "next/navigation";
import StepJobcard from "@/components/recruiter/StepJobCard";
import StepGeneralInformation from "@/components/recruiter/StepGeneralInformation";
import StepDetail from "@/components/recruiter/StepDetail";
import { useLocation } from "@/context/LocationContext";

export default function ManageJobsPage() {
  const [view, setView] = useState<"TABLE" | "EDIT">("TABLE");
  const [selectedJobId, setSelectedJobId] = useState<number | null>(null);
  const router = useRouter();
  const auth = useAuth();
  const companyId = auth?.user?.companyId;
  const {getProvinceName, getWardNameFromList} = useLocation();

  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("ALL");

  const statusColors: Record<string, string> = {
    OPEN: "#d4edda",       // greenish
    CLOSED: "#f8d7da",     // reddish
    DRAFT: "#fff3cd",      // yellowish
    EXPIRED: "#e2e3e5",    // gray
  };

  //manage job page
  const [step, setStep] = useState(1);

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);

  const [statusChanges, setStatusChanges] = useState<Record<number, string>>({});
  const fetchJobs = async () => {
    try {
      const res = await fetch(
        `http://localhost:9191/api/jobs/company/${companyId}`
      );
      const data = await res.json();
      setJobs(data || []);
      console.log(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (companyId) fetchJobs();
  }, [companyId]);


  const updateStatus = async (id: number, status: string) => {
    try {
      await fetch(
        `http://localhost:9191/api/jobs/${id}/status?status=${status}`,
        { method: "PATCH" }
      );

      setJobs(prev =>
        prev.map(j =>
          j.id === id ? { ...j, status } : j
        )
      );

    } catch (err) {
      alert("Update failed");
    }
  };

  return (
   <div className="container">

  {/* Header + Tabs */}
  <div className="header">
    <h2>Jobs Management</h2>
    <div className="actions">
      {["ALL", "CREATE", "STATUS"].map(tab => (
        <button
          key={tab}
          className={`btn ${activeTab === tab ? "active" : ""}`}
          onClick={() => {
            setActiveTab(tab);
            setView("TABLE");
            setStep(1);
          }}
        >
          {tab === "CREATE" ? "+ Create Job" : tab === "ALL" ? "All Jobs" : "Change Status"}
        </button>
      ))}
    </div>
  </div>

  {/* ================= TABLE: ALL JOBS ================= */}
  {!loading && activeTab === "ALL" && view === "TABLE" && (
    <div className="table">

      {/* Header */}
      <div className="all-job-row head">
        <div></div>
        <div>Title</div>
        <div>Salary</div>
        <div>Location</div>
        <div>Experience</div>
        <div>Status</div>
        <div>Due Date</div>
        <div>Action</div>
      </div>

      {/* Rows */}
      {jobs.map(job => (
        <div key={job.id} className="all-job-row" style={{ alignItems: "center" }}>

          {/* Status color bar */}
          <div
            style={{
              width: "8px",
              height: "100%",
              backgroundColor: statusColors[job.status] || "#eee",
              borderRadius: "4px",
              marginRight: "8px"
            }}
          />

          <div>{job.title}</div>
          <div>${job.salary_min} - ${job.salary_max}</div>
          <div>{getWardNameFromList(job.locations?.[0]?.ward)}, {getProvinceName(job.locations?.[0]?.province) || "N/A"} </div>
          <div>{job.experienceRequired}</div>
          <div>
            <span className={`status ${job.status?.toLowerCase()}`}>{job.status}</span>
          </div>
          <div>{new Date(job.dueDate).toLocaleDateString()}</div>
          <div className="actions-btn">
            <button
              className="btn"
              onClick={() => {
                setSelectedJobId(job.id);
                setView("EDIT");
              }}
            >
              Edit
            </button>
          </div>

        </div>
      ))}

    </div>
  )}

  {/* ================= TABLE: CHANGE STATUS ================= */}
  {!loading && activeTab === "STATUS" && (
    <div className="table">

      <div className="row-status head">
        <div></div>
        <div>Title</div>
        <div>Status</div>
        {/* <div>Save at</div> */}
        <div>Change</div>
        
      </div>

      {jobs.map(job => (
        <div key={job.id} className="row-status" >

          {/* Left color bar */}
          <div
            style={{
              width: "8px",
              height: "30px",
              backgroundColor: statusColors[job.status] || "#eee",
              borderRadius: "4px",
              marginRight: "8px"
            }}
          />

          <div>{job.title}</div>
          <div>
            <span className={`status ${job.status?.toLowerCase()}`}>{job.status}</span>
          </div>
          <div style={{ display: "flex", gap: "8px" }}>
            <select
              value={statusChanges[job.id] || job.status}
              onChange={(e) =>
                setStatusChanges(prev => ({ ...prev, [job.id]: e.target.value }))
              }
            >
              {["OPEN", "CLOSED", "DRAFT", "EXPIRED"].map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>

            <button
              className="btn primary"
              disabled={!statusChanges[job.id] || statusChanges[job.id] === job.status}
              onClick={() => {
                if (confirm("Are you sure you want to change status?")) {
                  updateStatus(job.id, statusChanges[job.id]);
                }
              }}
            >
              Save
            </button>
          </div>

        </div>
      ))}

    </div>
  )}

  {/* ================= CREATE/EDIT STEPS ================= */}
  {view === "EDIT" || (activeTab === "CREATE" && view === "TABLE") ? (
    <div className="onboarding-container card-shadow">
      {step === 1 && <StepJobcard jobId={selectedJobId || undefined} nextStep={nextStep} />}
      {step === 2 && <StepGeneralInformation jobId={selectedJobId || undefined} prevStep={prevStep} nextStep={nextStep} />}
      {step === 3 && <StepDetail jobId={selectedJobId || undefined} prevStep={prevStep} />}
    </div>
  ) : null}

</div>
  );
}