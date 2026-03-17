"use client";

import { useState } from "react";

import StepJobcard from "@/components/recruiter/StepJobCard";
import StepGeneralInformation from "@/components/recruiter/StepGeneralInformation";
import StepDetail from "@/components/recruiter/StepDetail";
import "@/styles/recruiter/JobOnboarding.css";

export default function CreateJobPage() {
    
  const [step, setStep] = useState(1);
  const [jobId, setJobId] = useState<number | null>(null);

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev -1 );


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
        <StepGeneralInformation
        prevStep={prevStep}
          jobId={jobId}
          nextStep={nextStep}
        />
      )}

      {step === 3 && (
        <StepDetail prevStep={prevStep}
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