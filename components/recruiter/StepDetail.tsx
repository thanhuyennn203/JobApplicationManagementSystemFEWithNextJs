"use client";

import { useState, useEffect } from "react";
import "@/styles/recruiter/CreateJobDetail.css";
import { useRouter } from "next/navigation";

export default function StepDetail({ jobId, prevStep, nextStep }: any) {
    const router = useRouter();

    const [formData, setFormData] = useState({
        description: "",
        requirement: "",
        income: "",
        interest: "",
        allowance: "",
        working_equipment: "",
        working_location: "",
        working_time: "",
        apply_by: "",
        due_date: ""
    });
    console.log(jobId)

    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");
    const [hasDetail, setHasDetail] = useState(false);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {

        const { name, value } = e.target;

        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

    };

    const handleSubmit = async (e: React.FormEvent) => {

        e.preventDefault();

        setLoading(true);
        setError("");
        setSuccess(false);

        try {

            const method = hasDetail ? "PATCH" : "POST";

            const res = await fetch(
                `http://localhost:9191/api/jobs/${jobId}/details`,
                {
                    method: method,
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(formData)
                }
            );

            if (!res.ok) {
                throw new Error("Failed to save job detail");
            }

            const data = await res.json();

            console.log("Saved job detail:", data);

            setSuccess(true);

        } catch (err: any) {

            setError(err.message);

        } finally {

            setLoading(false);

        }

    };

    useEffect(() => {

        if (!jobId) return;

        const fetchJobDetail = async () => {

            try {

                const res = await fetch(
                    `http://localhost:9191/api/jobs/${jobId}/details`
                );

                if (!res.ok) return;

                const data = await res.json();

                console.log("Fetched job detail:", data);

                setFormData({
                    description: data.description || "",
                    requirement: data.requirement || "",
                    income: data.income || "",
                    interest: data.interest || "",
                    allowance: data.allowance || "",
                    working_equipment: data.working_equipment || "",
                    working_location: data.working_location || "",
                    working_time: data.working_time || "",
                    apply_by: data.apply_by || "",
                    due_date: data.due_date || ""
                });

                setHasDetail(true);
                setSuccess(true);

            } catch (err) {

                console.error("Failed to fetch job detail", err);

            }

        };

        fetchJobDetail();

    }, [jobId]);
    return (

        <div className="step-container">

            <h2>Job Detail</h2>

            <div className="job-detail-container">

                <h1 className="page-title">Job Detail</h1>

                <form className="job-detail-form" onSubmit={handleSubmit}>

                    <div className="form-section">
                        <h3>Job Description</h3>

                        <textarea
                            name="description"
                            rows={6}
                            placeholder="Describe the job responsibilities..."
                            value={formData.description}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-section">
                        <h3>Job Requirements</h3>

                        <textarea
                            name="requirement"
                            rows={6}
                            placeholder="Skills, experience, education..."
                            value={formData.requirement}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-section">
                        <h3>Income</h3>

                        <textarea
                            name="income"
                            rows={4}
                            placeholder="Salary details, bonuses..."
                            value={formData.income}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-section">
                        <h3>Benefits</h3>

                        <textarea
                            name="interest"
                            rows={4}
                            placeholder="Insurance, bonus, holidays..."
                            value={formData.interest}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-section">
                        <h3>Allowance</h3>

                        <textarea
                            name="allowance"
                            rows={3}
                            placeholder="Lunch allowance, transportation..."
                            value={formData.allowance}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-section">
                        <h3>Working Equipment</h3>

                        <textarea
                            name="working_equipment"
                            rows={3}
                            placeholder="Laptop, monitor, software..."
                            value={formData.working_equipment}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="grid-2">

                        <div>
                            <label>Working Location</label>

                            <input
                                type="text"
                                name="working_location"
                                placeholder="Office location"
                                value={formData.working_location}
                                onChange={handleChange}
                            />
                        </div>

                        <div>
                            <label>Working Time</label>

                            <input
                                type="text"
                                name="working_time"
                                placeholder="Mon - Fri, 9AM - 6PM"
                                value={formData.working_time}
                                onChange={handleChange}
                            />
                        </div>

                    </div>

                    <div className="grid-2">

                        <div>
                            <label>Apply Method</label>

                            <input
                                type="text"
                                name="apply_by"
                                placeholder="Send CV to email or apply via system"
                                value={formData.apply_by}
                                onChange={handleChange}
                            />
                        </div>

                        <div>
                            <label>Application Deadline</label>

                            <input
                                type="date"
                                name="due_date"
                                value={formData.due_date}
                                onChange={handleChange}
                            />
                        </div>

                    </div>
                    <button className="submit-btn" disabled={loading}> {loading ? "Saving..." : hasDetail ? "Update Job Detail" : "Create Job Detail"} </button>

                    {success && (
                        <p className="success-msg">
                            {/* ✅ Job detail saved successfully */}
                        </p>
                    )}

                    {error && (
                        <p className="error-msg">
                            {/* ❌ {error} */}
                        </p>
                    )}

                </form>

            </div>

            <div className="btn-group">

                <button onClick={prevStep} className="back-btn">
                    Back
                </button>

                <button
                    onClick={() => router.push("/recruiter/jobs/")}
                    className="submit-btn"
                // disabled={!success}
                >
                    Publish
                </button>

            </div>

        </div>

    );
}