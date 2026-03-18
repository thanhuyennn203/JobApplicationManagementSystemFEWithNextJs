"use client";

import "@/styles/company/CompanyProfile.css";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { getCompanyById, updateCompany } from "@/services/companies/company.service";
import { Company } from "@/types/company";
import { uploadFile } from "@/services/upload";
import { useLocation } from "@/context/LocationContext";

export default function CompanyProfilePage() {
    const auth = useAuth();
    const { getProvinceName, getWardNameFromList } = useLocation();
    const [company, setCompany] = useState<Company | null>(null);
    const [originalCompany, setOriginalCompany] = useState<Company | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [showEdit, setShowEdit] = useState(false);
    const [formData, setFormData] = useState<Company | null>(null);

    useEffect(() => {
        if (company) setFormData(company);
    }, [company]);

    const [preview, setPreview] = useState<{
        file: File;
        url: string;
        type: "logo" | "cover";
    } | null>(null);

    // ================= FETCH =================
    useEffect(() => {
        if (!auth?.user?.companyId) return;

        const fetchCompany = async () => {
            try {
                const data = await getCompanyById(auth.user.companyId);
                setCompany(data);
                console.log(data);
                setOriginalCompany(data);
            } catch (err) {
                console.error("Fetch company error:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchCompany();
    }, [auth]);

    // ================= FILE PICK =================
    const handleEdit = (type: "logo" | "cover") => {
        document.getElementById(`${type}Input`)?.click();
    };
    const handleChange = (key: keyof Company, value: any) => {
        setFormData((prev) => prev ? { ...prev, [key]: value } : prev);
    };

    const handleUpdateCompany = async () => {
        if (!formData || !company?.id) return;

        try {
            setSaving(true);

            await updateCompany(company.id, formData);
            console.log("Form data: ", formData);
            setCompany(formData);
            setOriginalCompany(formData);
            setShowEdit(false);
        } catch (err) {
            console.error("Update failed:", err);
        } finally {
            setSaving(false);
        }
    };
    const handleFileChange = (
        e: React.ChangeEvent<HTMLInputElement>,
        type: "logo" | "cover"
    ) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const previewUrl = URL.createObjectURL(file);

        setCompany((prev) => {
            if (!prev) return prev;

            return type === "logo"
                ? { ...prev, logo_url: previewUrl }
                : { ...prev, backgroundUrl: previewUrl };
        });

        setPreview({
            file,
            url: previewUrl,
            type,
        });

        e.target.value = "";
    };
    // ================= SAVE =================
    const handleSaveImage = async () => {
        if (!preview || !company) return;

        try {
            setSaving(true);

            const uploadRes = await uploadFile(preview.file);
            const imageUrl = uploadRes.url || uploadRes;

            const payload: any =
                preview.type === "logo"
                    ? { logo_url: imageUrl }
                    : { backgroundUrl: imageUrl };

            await updateCompany(company.id, payload);

            // update UI + original
            setCompany((prev) => {
                if (!prev) return prev;

                return preview.type === "logo"
                    ? { ...prev, logo_url: imageUrl }
                    : { ...prev, backgroundUrl: imageUrl };
            });

            setOriginalCompany((prev) => {
                if (!prev) return prev;

                return preview.type === "logo"
                    ? { ...prev, logo_url: imageUrl }
                    : { ...prev, backgroundUrl: imageUrl };
            });

            setPreview(null);

        } catch (err) {
            console.error("Upload failed:", err);
        } finally {
            setSaving(false);
        }
    };

    // ================= CANCEL =================
    const handleCancelImage = () => {
        if (!originalCompany) return;

        setCompany(originalCompany);
        setPreview(null);
    };

    // ================= CLEANUP =================
    useEffect(() => {
        return () => {
            if (preview?.url) {
                URL.revokeObjectURL(preview.url);
            }
        };
    }, [preview]);

    // ================= UI =================
    if (loading) return <p>Loading company...</p>;
    if (!company) return <p>No company found</p>;

    return (
        <div className="company-container">

            {/* ACTION BAR */}
            {preview && (
                <div className="image-action-bar">
                    <button
                        className="save-btn"
                        onClick={handleSaveImage}
                        disabled={saving}
                    >
                        {saving ? "Saving..." : "Save"}
                    </button>

                    <button
                        className="cancel-btn"
                        onClick={handleCancelImage}
                        disabled={saving}
                    >
                        Cancel
                    </button>
                </div>
            )}

            {/* INPUT */}
            <input
                type="file"
                accept="image/*"
                id="logoInput"
                hidden
                onChange={(e) => handleFileChange(e, "logo")}
            />

            <input
                type="file"
                accept="image/*"
                id="coverInput"
                hidden
                onChange={(e) => handleFileChange(e, "cover")}
            />

            {/* COVER */}
            <div className="company-cover">
                <img
                    src={
                        company.backgroundUrl ||
                        "/images/company-background-default.jpg"
                    }
                />

                <div
                    className="edit-btn cover-edit"
                    onClick={() => handleEdit("cover")}
                >
                    <i className="fa-solid fa-pen-to-square"></i>
                </div>
            </div>

            {/* HEADER */}
            <div className="company-header">

                <div className="company-logo-wrapper">
                    <img
                        src={
                            company.logo_url ||
                            "/images/company-logo-default.jpg"
                        }
                        className="company-logo"
                    />

                    <div
                        className="edit-btn logo-edit"
                        onClick={() => handleEdit("logo")}
                    >
                        <i className="fa-solid fa-pen-to-square"></i>
                    </div>
                </div>

                <div className="company-info">
                    <h1 className="company-name">{company.name}</h1>

                    <div className="company-meta">
                        <span><a href={company?.website}>
                            <i className="fa-solid fa-globe meta-icon"></i>
                            {company.website || "Not available"}
                        </a></span>

                        <span>
                            <i className="fa-solid fa-users meta-icon"></i>
                            {company.size} staffs
                        </span>

                        <span>
                            <i className="fa-solid fa-user-group meta-icon"></i>
                            {company.followerNumber || 0} followers
                        </span>
                    </div>
                </div>
            </div >

            {/* CONTENT */}
            < div className="company-content" >

                <div className="company-left">
                    <div className="card">
                        <div className="company-card">

                            <div className="card-title">
                                <span>About company</span>
                                {/* <i className="fa-solid fa-pen-to-square edit-icon"></i> */}
                            </div>

                            <div className="card-body">
                                <p>{company.description}</p>
                            </div>

                        </div>
                    </div>
                </div>

                <div className="company-right">
                    <div className="card">
                        <div className="company-card">

                            <div className="card-title">
                                <span>Contact</span>
                                {/* <i className="fa-solid fa-pen-to-square edit-icon"></i> */}
                            </div>

                            <div className="card-body">
                                <h4>
                                    <i className="fa-solid fa-location-dot info-icon"></i>
                                    Company Location
                                </h4>

                                <p>{getWardNameFromList(company?.ward)}, {getProvinceName(company?.province)}</p>

                                <p>
                                    <i className="fa-solid fa-globe info-icon"></i>
                                    {company.website}
                                </p>
                            </div>

                        </div>

                        <div className="map">
                            <iframe
                                src={`https://maps.google.com/maps?q=${company.province || "Vietnam"}&output=embed`}
                            ></iframe>
                        </div>
                    </div>
                </div>
                <button className="fab-edit" onClick={() => setShowEdit(true)}>
                    <i className="fa-solid fa-pen"></i>
                </button>
            </div >

            {showEdit && formData && (
                <div className="edit-modal">
                    <div className="edit-content">

                        <h2>Edit Company</h2>

                        <input
                            value={formData.name || ""}
                            onChange={(e) => handleChange("name", e.target.value)}
                            placeholder="Company Name"
                        />

                        <input
                            value={formData.website || ""}
                            onChange={(e) => handleChange("website", e.target.value)}
                            placeholder="Website"
                        />

                        <input
                            value={formData.industry || ""}
                            onChange={(e) => handleChange("industry", e.target.value)}
                            placeholder="Industry"
                        />

                        <input
                            type="number"
                            value={formData.size || ""}
                            onChange={(e) => handleChange("size", Number(e.target.value))}
                            placeholder="Company Size"
                        />

                        <textarea
                            value={formData.description || ""}
                            onChange={(e) => handleChange("description", e.target.value)}
                            placeholder="Description"
                        />

                        <div className="edit-actions">
                            <button onClick={handleUpdateCompany} disabled={saving}>
                                {saving ? "Saving..." : "Save"}
                            </button>

                            <button onClick={() => setShowEdit(false)}>
                                Cancel
                            </button>
                        </div>

                    </div>
                </div>
            )
            }
        </div >

    );
}