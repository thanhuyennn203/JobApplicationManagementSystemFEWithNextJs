"use client";

import { useState, useEffect } from "react";
import "@/styles/recruiter/GeneralInformation.css";
import { useAuth } from "@/context/AuthContext";

export default function StepBasic({ prevStep, nextStep, jobId }: any) {

    const auth = useAuth();
    const companyId = auth?.user?.companyId;

    const [formData, setFormData] = useState({
        rank: "",
        education: "",
        numberOfRecruitment: 1,
        workingStyle: ""
    });

    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {

        const { name, value } = e.target;

        setFormData(prev => ({
            ...prev,
            [name]: name === "numberOfRecruitment" ? Number(value) : value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {

        e.preventDefault();

        setLoading(true);
        setError("");
        setSuccess(false);

        try {

            const res = await fetch(
                `http://localhost:9191/api/jobs/${jobId}/general-information`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(formData)
                }
            );

            if (!res.ok) {
                throw new Error("Failed to save general information");
            }

            const data = await res.json();

            console.log("Saved:", data);

            setSuccess(true);

        } catch (err: any) {

            setError(err.message);

        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {

    if (!jobId) return;

    const fetchGeneralInformation = async () => {

        try {

            const res = await fetch(
                `http://localhost:9191/api/jobs/${jobId}/general-information`
            );

            if (!res.ok) return;

            const data = await res.json();

            console.log("Fetched general info:", data);

            setFormData({
                rank: data.rank || "",
                education: data.education || "",
                numberOfRecruitment: data.numberOfRecruitment || 1,
                workingStyle: data.workingStyle || ""
            });

        } catch (err) {
            console.error("Failed to fetch general information", err);
        }

    };

    fetchGeneralInformation();

}, [jobId]);

    return (

        <div className="step-container">

            <h2>Job Basic Information</h2>

            <div className="general-info-container">

                <h2 className="section-title">General Information</h2>

                <form className="general-info-form" onSubmit={handleSubmit}>

                    <div className="grid-2">

                        <div className="form-group">
                            <label>Rank</label>

                            <select
                                name="rank"
                                value={formData.rank}
                                onChange={handleChange}
                            >
                                <option value="">Select rank</option>
                                <option value="Intern">Intern</option>
                                <option value="Fresher">Fresher</option>
                                <option value="Junior">Junior</option>
                                <option value="Middle">Middle</option>
                                <option value="Senior">Senior</option>
                                <option value="Manager">Manager</option>
                            </select>
                        </div>

                        <div className="form-group">

                            <label>Education</label>

                            <select
                                name="education"
                                value={formData.education}
                                onChange={handleChange}
                            >
                                <option value="">Select education</option>
                                <option value="High School">High School</option>
                                <option value="College">College</option>
                                <option value="Bachelor">Bachelor</option>
                                <option value="Master">Master</option>
                                <option value="PhD">PhD</option>
                            </select>

                        </div>

                    </div>

                    <div className="grid-2">

                        <div className="form-group">
                            <label>Number of Recruitment</label>

                            <input
                                type="number"
                                name="numberOfRecruitment"
                                min="1"
                                value={formData.numberOfRecruitment}
                                onChange={handleChange}
                            />

                        </div>

                        <div className="form-group">

                            <label>Working Style</label>

                            <select
                                name="workingStyle"
                                value={formData.workingStyle}
                                onChange={handleChange}
                            >
                                <option value="">Select working style</option>
                                <option value="On-site">On-site</option>
                                <option value="Remote">Remote</option>
                                <option value="Hybrid">Hybrid</option>
                            </select>

                        </div>

                    </div>

                    <button className="save-btn" disabled={loading}>
                        {loading ? "Saving..." : "Save General Information"}
                    </button>

                    {success && (
                        <p className="success-msg">
                            ✅ General information saved successfully
                        </p>
                    )}

                    {error && (
                        <p className="error-msg">
                            ❌ {error}
                        </p>
                    )}

                </form>

            </div>

            <div className="btn-group">

                <button onClick={prevStep} className="back-btn">
                    Back
                </button>

                <button
                    onClick={nextStep}
                    className="next-btn"
                    // disabled={!success}
                >
                    Next
                </button>

            </div>

        </div>
    );
}