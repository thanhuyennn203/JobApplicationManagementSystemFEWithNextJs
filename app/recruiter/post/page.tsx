"use client";

import { useState } from "react";
import StepBasic from "./StepGeneralInformation";
import StepDetail from "./StepDetail";
import StepJobcard from "./StepJobCard";
import "@/styles/recruiter/JobOnboarding.css";

export default function CreateJobPage() {

  const [step, setStep] = useState(1);
  const [jobId, setJobId] = useState<number | null>(null);

  const nextStep = () => setStep((prev) => prev + 1);

  return (

    <div className="onboarding-container">

      {/* Steps */}

      {step === 1 && (
        <StepJobcard
          nextStep={nextStep}
          setJobId={setJobId}
        />
      )}

      {step === 2 && (
        <StepBasic
          jobId={jobId}
          nextStep={nextStep}
        />
      )}

      {step === 3 && (
        <StepDetail
          jobId={jobId}
        />
      )}

      {/* Progress Dots */}

      <div className="progress-dots">

        <span className={`dot ${step >= 1 ? "active" : ""}`} />
        <span className={`dot ${step >= 2 ? "active" : ""}`} />
        <span className={`dot ${step >= 3 ? "active" : ""}`} />

      </div>

    </div>

  );
}