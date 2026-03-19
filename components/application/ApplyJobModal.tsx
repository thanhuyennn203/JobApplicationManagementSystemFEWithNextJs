"use client";

import { useState } from "react";
import "@/styles/application/ApplicationForm.css";
import { applyJob } from "@/services/application/application.service";
import { useAuth } from "@/context/AuthContext";

interface Props {
    jobId: number;
    jobTitle: string;
    onClose: () => void;
}

export default function ApplyJobModal({ jobId, jobTitle, onClose }: Props) {
    const auth = useAuth();
    const candidateId = auth?.user?.candidateId;

    const [file, setFile] = useState<File | null>(null);
    const [form, setForm] = useState({
        fullName: "",
        email: "",
        phone: "",
        letter: "",
        agree: false,
    });

    const handleChange = (e: any) => {
        const { name, value, type, checked } = e.target;
        setForm({
            ...form,
            [name]: type === "checkbox" ? checked : value,
        });
    };

    const handleFileChange = (e: any) => {
        setFile(e.target.files[0]);
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("jobId", String(jobId));
        formData.append("fullName", form.fullName);
        formData.append("email", form.email);
        formData.append("phone", form.phone);
        formData.append("letter", form.letter);
        formData.append("candidateId", String(candidateId));

        if (file) formData.append("cvFile", file);

        try {
            await applyJob(formData);
            alert("Application submitted successfully!");
            onClose();
        } catch (err) {
            console.error(err);
            alert("Failed to apply!");
        }
    };

    return (
        <div className="modal" id="modal-apply-cv">
            <div className="modal-dialog">
                <div className="modal-content">
                    <form onSubmit={handleSubmit}>
                        {/* HEADER */}
                        <div className="modal-header">
                            <button type="button" className="close" onClick={onClose}>
                                ✕
                            </button>
                            <h4 className="modal-title">
                                Apply for <span className="text-highlight">{jobTitle}</span>
                            </h4>
                        </div>

                        {/* BODY */}
                        <div className="modal-body">
                            <div className="apply-content">

                                {/* Upload */}
                                <div className="apply-content_tab">
                                    <div className="apply-content_tab-title">
                                        <span>Select CV</span>
                                    </div>

                                    <div className="select-tab mt-10">
                                        <div className="select-tab_item upload-box">
                                            <input
                                                type="file"
                                                accept=".doc,.docx,.pdf"
                                                onChange={handleFileChange}
                                            />
                                        </div>

                                        <div className="form-info">
                                            <div className="form-info_header">
                                                <div className="form-info_header-title">
                                                    Please fill in your information
                                                </div>
                                                <div className="form-info_header-note">
                                                    * Required
                                                </div>
                                            </div>

                                            <div className="form-group">
                                                <label className="form-title">
                                                    Full Name <span className="text-danger">*</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    name="fullName"
                                                    value={form.fullName}
                                                    onChange={handleChange}
                                                />
                                            </div>

                                            <div className="form-group">
                                                <label className="form-title">
                                                    Email <span className="text-danger">*</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    name="email"
                                                    value={form.email}
                                                    onChange={handleChange}
                                                />
                                            </div>

                                            <div className="form-group">
                                                <label className="form-title">
                                                    Phone <span className="text-danger">*</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    name="phone"
                                                    value={form.phone}
                                                    onChange={handleChange}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Cover letter */}
                                <div className="apply-content_tab">
                                    <div className="apply-content_tab-title">
                                        <span>Cover Letter</span>
                                    </div>

                                    <textarea
                                        name="letter"
                                        value={form.letter}
                                        onChange={handleChange}
                                        rows={3}
                                        placeholder="Write a short introduction..."
                                    />
                                </div>
                            </div>
                        </div>

                        {/* FOOTER */}
                        <div className="modal-footer">
                            <label>
                                <input
                                    type="checkbox"
                                    name="agree"
                                    checked={form.agree}
                                    onChange={handleChange}
                                />
                                I agree to terms
                            </label>

                            <div className="modal-footer__button-group">
                                <button className="cancel-btn" type="button" onClick={onClose}>
                                    Cancel
                                </button>
                                <button className="submit-btn" type="submit">Apply</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}