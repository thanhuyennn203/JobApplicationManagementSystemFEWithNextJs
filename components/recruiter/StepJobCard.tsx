"use client";

import { useEffect, useState } from "react";
import "@/styles/recruiter/CreateJob.css";
import { useAuth } from "@/context/AuthContext";
import { useLocation } from "@/context/LocationContext";

interface StepJobCardProps {
    nextStep: () => void;
    setJobId?: (id: number) => void;
    jobId?: number;
}

export default function StepJobCard({ nextStep, setJobId, jobId }: StepJobCardProps) {
    const auth = useAuth();
    const companyId = auth?.user?.companyId;

    const { provinces, wardList, wardsMap, getWards } = useLocation();

    const [success, setSuccess] = useState(false);

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        salary_min: "",
        salary_max: "",
        experienceRequired: "",
        dueDate: "",
        postedDate: "",
        status: "DRAFT",
        locations: [{ province: "", ward: "", detailAddress: "" }],
    });

    // Fetch job if editing
    useEffect(() => {
        if (!jobId) return;

        const fetchJob = async () => {
            try {
                const res = await fetch(`http://localhost:9191/api/jobs/${jobId}`);
                const data = await res.json();

                setFormData({
                    title: data.title || "",
                    description: data.description || "",
                    salary_min: data.salary_min || "",
                    salary_max: data.salary_max || "",
                    experienceRequired: data.experienceRequired || "",
                    dueDate: data.dueDate || "",
                    postedDate: data.postedDate || "",
                    status: data.status || "DRAFT",
                    locations: data.locations?.length
                        ? data.locations
                        : [{ province: "", ward: "", detailAddress: "" }],
                });
            } catch (err) {
                console.error("Failed to fetch job", err);
            }
        };

        fetchJob();
    }, [jobId]);

    // Handle form field changes
    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    // Handle location changes
    const handleLocationChange = async (index: number, field: string, value: string) => {
        const updatedLocations = [...formData.locations];
        updatedLocations[index][field] = value;

        setFormData((prev) => ({ ...prev, locations: updatedLocations }));

        // Lazy load wards if province changed
        if (field === "province" && value) {
            await getWards(value);
            updatedLocations[index].ward = "";
        }
    };

    const addLocation = () => {
        if (formData.locations.length >= 3) return;
        setFormData((prev) => ({
            ...prev,
            locations: [...prev.locations, { province: "", ward: "", detailAddress: "" }],
        }));
    };

    const removeLocation = (index: number) => {
        if (formData.locations.length <= 1) return;
        const updated = formData.locations.filter((_, i) => i !== index);
        setFormData((prev) => ({ ...prev, locations: updated }));
    };

    // Submit job card
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const payload = {
                ...formData,
                company_id: companyId,
                postedDate: new Date().toISOString(),
            };

            const url = jobId
                ? `http://localhost:9191/api/jobs/${jobId}`
                : "http://localhost:9191/api/jobs";
            const method = jobId ? "PUT" : "POST";

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const data = await res.json();

            if (!jobId && setJobId) setJobId(data.id);

            setSuccess(true);
        } catch (err) {
            console.error(err);
        }
    };

    if (success) {
        return (
            <div className="step-success">
                <h2>Job Card Saved</h2>
                <p>Your job basic information has been saved.</p>
                <button onClick={nextStep} className="next-btn">
                    Continue
                </button>
            </div>
        );
    }

    return (
        <div className="step-container">
            <div className="create-job-container">
                <form onSubmit={handleSubmit} className="job-form">
                    <h1 className="page-title">{jobId ? "Edit Job Posting" : "Create Job Posting"}</h1>

                    {/* Job Title */}
                    <div className="form-group">
                        <label>Job Title</label>
                        <input
                            type="text"
                            name="title"
                            placeholder="Frontend Developer..."
                            value={formData.title}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {/* Locations */}
                    <h3>Job Locations (max 3)</h3>
                    {formData.locations.map((loc, index) => (
                        <div key={index} className="location-card">
                            <div className="row">
                                <div>
                                    <label>Province *</label>
                                    <select
                                        value={loc.province}
                                        onChange={(e) => handleLocationChange(index, "province", e.target.value)}
                                        required
                                    >
                                        <option value="">Select province</option>
                                        {provinces.map((p) => (
                                            <option key={p.code} value={p.code}>
                                                {p.nameEn}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label>Ward *</label>
                                    <select
                                        value={loc.ward}
                                        onChange={(e) => handleLocationChange(index, "ward", e.target.value)}
                                        disabled={!loc.province}
                                        required
                                    >
                                        <option value="">Select ward</option>
                                        {((loc.province && wardsMap[loc.province]) || []).map((w) => (
                                            <option key={w.code} value={w.code}>
                                                {w.nameEn}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Detail Address *</label>
                                <input
                                    type="text"
                                    placeholder="Street, building..."
                                    value={loc.detailAddress}
                                    onChange={(e) => handleLocationChange(index, "detailAddress", e.target.value)}
                                    required
                                />
                            </div>

                            {formData.locations.length > 1 && (
                                <button type="button" className="remove-location" onClick={() => removeLocation(index)}>
                                    Remove
                                </button>
                            )}
                        </div>
                    ))}

                    {formData.locations.length < 3 && (
                        <button type="button" className="add-location-btn" onClick={addLocation}>
                            + Add Another Location
                        </button>
                    )}

                    {/* Salary */}
                    <div className="salary-group">
                        <div className="form-group">
                            <label>Salary Min ($)</label>
                            <input
                                type="number"
                                name="salary_min"
                                value={formData.salary_min}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="form-group">
                            <label>Salary Max ($)</label>
                            <input
                                type="number"
                                name="salary_max"
                                value={formData.salary_max}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    {/* Experience */}
                    <div className="form-group">
                        <label>Experience Required</label>
                        <select name="experienceRequired" value={formData.experienceRequired} onChange={handleChange}>
                            <option value="">Select experience</option>
                            <option value="No experience">No experience</option>
                            <option value="1 year">1 year</option>
                            <option value="2 years">2 years</option>
                            <option value="3+ years">3+ years</option>
                            <option value="5+ years">5+ years</option>
                            <option value="10+ years">10+ years</option>
                        </select>
                    </div>

                    {/* Due Date */}
                    <div className="form-group">
                        <label>Application Deadline</label>
                        <input type="date" name="dueDate" value={formData.dueDate} onChange={handleChange} />
                    </div>

                    {/* Status */}
                    <div className="form-group">
                        <label>Status</label>
                        <select name="status" value={formData.status} onChange={handleChange}>
                            <option value="OPEN">Open</option>
                            <option value="CLOSED">Closed</option>
                            <option value="DRAFT">Draft</option>
                        </select>
                    </div>

                    {/* Description */}
                    <div className="form-group">
                        <label>Job Description</label>
                        <textarea
                            name="description"
                            rows={6}
                            placeholder="Describe responsibilities..."
                            value={formData.description}
                            onChange={handleChange}
                        />
                    </div>

                    <button type="submit" className="submit-btn">
                        {jobId ? "Update Job Card" : "Save Job Card"}
                    </button>
                </form>

                <div className="job-form-step-btn">
                    <button onClick={nextStep} className="job-edit next-btn">
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
}