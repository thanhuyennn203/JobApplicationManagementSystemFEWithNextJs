"use client";

import { useParams } from "next/navigation";
import { useState } from "react";

import StepJobcard from "@/components/recruiter/StepJobCard";
import StepGeneralInformation from "@/components/recruiter/StepGeneralInformation";
import StepDetail from "@/components/recruiter/StepDetail";

import "@/styles/recruiter/JobOnboarding.css";

export default function EditJobPage() {

  const { jobId } = useParams();

  const [step, setStep] = useState(1);

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev -1 );

  return (

    <div className="onboarding-container">

      {step === 1 && (
        <StepJobcard
          jobId={Number(jobId)}
          nextStep={nextStep}
        />
      )}

      {step === 2 && (
        <StepGeneralInformation
          jobId={Number(jobId)}
          prevStep={prevStep}
          nextStep={nextStep}
        />
      )}

      {step === 3 && (
        <StepDetail
        prevStep={prevStep}
          jobId={Number(jobId)}
        />
      )}

    </div>

  );
}