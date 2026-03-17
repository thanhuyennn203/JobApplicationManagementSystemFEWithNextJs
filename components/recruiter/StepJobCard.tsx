"use client";

import { useState, useEffect } from "react";
import "@/styles/recruiter/CreateJob.css";
import {
    getProvinces,
    getWardsByProvince,
    Province,
    Ward
} from "@/services/locations/LocationService";
import { useAuth } from "@/context/AuthContext"


export default function StepJobCard({ nextStep, setJobId, jobId }: any) {
    const auth = useAuth();
    // const candidateId = auth?.user?.candidateId;
    const companyId = auth?.user?.companyId;
    const [success, setSuccess] = useState(false);
    const [provinces, setProvinces] = useState<Province[]>([]);
    const [wards, setWards] = useState<{ [key: number]: Ward[] }>({});

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        salary_min: "",
        salary_max: "",
        experienceRequired: "",
        dueDate: "",
        postedDate: "",
        status: "OPEN",
        locations: [
            { province: "", ward: "", detailAddress: "" }
        ]
    });

    useEffect(() => {

        if (!jobId) return;

        const fetchJob = async () => {

            try {

                const res = await fetch(`http://localhost:9191/api/jobs/${jobId}`);
                const data = await res.json();

                console.log("Fetched job:", data);

                setFormData({
                    title: data.title || "",
                    description: data.description || "",
                    salary_min: data.salary_min || "",
                    salary_max: data.salary_max || "",
                    experienceRequired: data.experienceRequired || "",
                    dueDate: data.dueDate || "",
                    postedDate: data.postedDate || "",
                    status: data.status || "OPEN",
                    locations: data.locations || [
                        { province: "", ward: "", detailAddress: "" }
                    ]
                });

            } catch (err) {
                console.error("Failed to fetch job", err);
            }

        };

        fetchJob();

    }, [jobId]);

    // Load provinces
    useEffect(() => {
        const fetchProvinces = async () => {
            try {
                const data = await getProvinces();
                setProvinces(data);
            } catch (err) {
                console.error("Failed to fetch provinces", err);
            }
        };

        fetchProvinces();
    }, []);

    // Handle normal form fields
    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => {

        const { name, value } = e.target;

        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

    };

    // Handle location fields
    const handleLocationChange = async (
        index: number,
        field: string,
        value: string
    ) => {

        const updatedLocations = [...formData.locations];
        updatedLocations[index][field] = value;

        setFormData(prev => ({
            ...prev,
            locations: updatedLocations
        }));

        if (field === "province") {

            try {

                const wardsData = await getWardsByProvince(value);

                setWards(prev => ({
                    ...prev,
                    [index]: wardsData
                }));

                updatedLocations[index].ward = "";

            } catch (err) {
                console.error(err);
            }

        }

    };

    const addLocation = () => {

        if (formData.locations.length >= 3) return;

        setFormData(prev => ({
            ...prev,
            locations: [
                ...prev.locations,
                { province: "", ward: "", detailAddress: "" }
            ]
        }));

    };

    const removeLocation = (index: number) => {

        if (formData.locations.length <= 1) return;

        const updated = formData.locations.filter((_, i) => i !== index);

        setFormData(prev => ({
            ...prev,
            locations: updated
        }));

    };

    const handleSubmit = async (e: React.FormEvent) => {

        e.preventDefault();

        try {

            const payload = {
                ...formData,
                company_id: companyId,
                postedDate: new Date().toISOString()
            };

            const url = jobId
                ? `http://localhost:9191/api/jobs/${jobId}`
                : "http://localhost:9191/api/jobs";

            const method = jobId ? "PUT" : "POST";

            const res = await fetch(url, {
                method: method,
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(payload)
            });

            const data = await res.json();

            console.log("result job:", data);

            if (!jobId) {
                setJobId(data.id);
            }

            setSuccess(true);

        } catch (err) {
            console.error(err);
        }

    };

    if (success) {

        return (

            <div className="step-success">

                <h2>✅ Job Card Created</h2>
                <p>Your job basic information has been saved.</p>

                <button onClick={nextStep} className="next-btn">
                    Continue
                </button>

            </div>

        );

    }

    return (

        <div className="step-container">

            <h2>Publish Job</h2>

            <div className="create-job-container">

                <h1 className="page-title">Create Job Posting</h1>

                <form onSubmit={handleSubmit} className="job-form">

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

                    {formData.locations.map((location, index) => (

                        <div key={index} className="location-card">

                            <div className="row">

                                <div>

                                    <label>Province *</label>

                                    <select
                                        value={location.province}
                                        onChange={(e) =>
                                            handleLocationChange(index, "province", e.target.value)
                                        }
                                        required
                                    >

                                        <option value="">Select province</option>

                                        {provinces.map((province) => (
                                            <option key={province.code} value={province.code}>
                                                {province.name}
                                            </option>
                                        ))}

                                    </select>

                                </div>

                                <div>

                                    <label>Ward *</label>

                                    <select
                                        value={location.ward}
                                        onChange={(e) =>
                                            handleLocationChange(index, "ward", e.target.value)
                                        }
                                        disabled={!location.province}
                                        required
                                    >

                                        <option value="">Select ward</option>

                                        {(wards[index] || []).map((ward) => (
                                            <option key={ward.code} value={ward.code}>
                                                {ward.name}
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
                                    value={location.detailAddress}
                                    onChange={(e) =>
                                        handleLocationChange(index, "detailAddress", e.target.value)
                                    }
                                    required
                                />

                            </div>

                            {formData.locations.length > 1 && (

                                <button
                                    type="button"
                                    className="remove-location"
                                    onClick={() => removeLocation(index)}
                                >
                                    Remove
                                </button>

                            )}

                        </div>

                    ))}

                    {formData.locations.length < 3 && (

                        <button
                            type="button"
                            className="add-location-btn"
                            onClick={addLocation}
                        >
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

                        <select
                            name="experienceRequired"
                            value={formData.experienceRequired}
                            onChange={handleChange}
                        >

                            <option value="">Select experience</option>
                            <option value="No experience">No experience</option>
                            <option value="1 year">1 year</option>
                            <option value="2 years">2 years</option>
                            <option value="3+ years">3+ years</option>
                            <option value="5+ years">5+ years</option>

                        </select>

                    </div>

                    {/* Due Date */}

                    <div className="form-group">

                        <label>Application Deadline</label>

                        <input
                            type="date"
                            name="dueDate"
                            value={formData.dueDate}
                            onChange={handleChange}
                        />

                    </div>

                    {/* Status */}

                    <div className="form-group">

                        <label>Status</label>

                        <select
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                        >

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

                <div className="btn-group">

                {/* <button onClick={prevStep} className="back-btn">
                    Back
                </button> */}

                <button
                    onClick={nextStep}
                    className="next-btn"
                    // disabled={!success}
                >
                    Next
                </button>

            </div>
            </div>

        </div>

    );

}