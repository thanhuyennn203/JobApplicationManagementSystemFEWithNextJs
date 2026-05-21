"use client";

import { useEffect, useState } from "react";

import StepJobCard from "@/components/recruiter/StepJobCard";
import StepBasic from "@/components/recruiter/StepGeneralInformation";
import StepDetail from "@/components/recruiter/StepDetail";

import "@/styles/recruiter/JobOnboarding.css";

export default function CreateJobPage() {

    const [step, setStep] = useState(1);

    const [jobId, setJobId] = useState<number | null>(null);

    const [completedSteps, setCompletedSteps] = useState({
        step1: false,
        step2: false,
        step3: false
    });

    // =====================================
    // WARNING BEFORE LEAVING
    // =====================================

    useEffect(() => {

        const handleBeforeUnload = (
            e: BeforeUnloadEvent
        ) => {

            if (
                !completedSteps.step3
            ) {

                e.preventDefault();

                e.returnValue = "";

            }
        };

        window.addEventListener(
            "beforeunload",
            handleBeforeUnload
        );

        return () => {

            window.removeEventListener(
                "beforeunload",
                handleBeforeUnload
            );

        };

    }, [completedSteps]);

    return (

        <div className="onboarding-container">

            {/* ================================= */}
            {/* PROFESSIONAL STEPPER */}
            {/* ================================= */}

            <div className="stepper-container">

                <div className={`step-item ${step >= 1 ? "active" : ""}`}>
                    <div className="step-circle">
                        1
                    </div>
                    <p>Job Card</p>
                </div>

                <div className="step-line" />

                <div className={`step-item ${step >= 2 ? "active" : "locked"}`}>
                    <div className="step-circle">
                        2
                    </div>
                    <p>General Info</p>
                </div>

                <div className="step-line" />

                <div className={`step-item ${step >= 3 ? "active" : "locked"}`}>
                    <div className="step-circle">
                        3
                    </div>
                    <p>Job Detail</p>
                </div>

            </div>

            {/* ================================= */}
            {/* STEP 1 */}
            {/* ================================= */}

            {
                step === 1 && (

                    <StepJobCard
                        jobId={jobId || undefined}
                        setJobId={setJobId}
                        nextStep={() => {

                            setCompletedSteps(prev => ({
                                ...prev,
                                step1: true
                            }));

                            setStep(2);

                        }}
                    />

                )
            }

            {/* ================================= */}
            {/* STEP 2 */}
            {/* ================================= */}

            {
                step === 2 &&
                jobId &&
                completedSteps.step1 && (

                    <StepBasic
                        jobId={jobId}
                        prevStep={() => setStep(1)}
                        nextStep={() => {

                            setCompletedSteps(prev => ({
                                ...prev,
                                step2: true
                            }));

                            setStep(3);

                        }}
                    />

                )
            }

            {/* ================================= */}
            {/* STEP 3 */}
            {/* ================================= */}

            {
                step === 3 &&
                jobId &&
                completedSteps.step2 && (

                    <StepDetail
                        jobId={jobId}
                        prevStep={() => setStep(2)}
                        onPublished={() => {

                            setCompletedSteps({
                                step1: true,
                                step2: true,
                                step3: true
                            });

                        }}
                    />

                )
            }

        </div>

    );

}