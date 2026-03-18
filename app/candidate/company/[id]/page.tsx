"use client";
import { getCompanyById } from "@/services/companies/company.service";
import { useEffect, useState } from "react";
import "@/styles/company/CompanyProfile.css";
import { useParams } from "next/navigation";
import { Company } from "@/types/company";
import { useLocation } from "@/context/LocationContext";
import { useAuth } from "@/context/AuthContext";

export default function CompanyProfilePage() {
    const params = useParams();
    const id = params.id;
    const auth = useAuth();
    const [company, setCompany] = useState<Company | null>(null);
    const { getProvinceName, getWardNameFromList } = useLocation();

    useEffect(() => {
        if (!id) return;

        const fetchCompany = async () => {
            try {
                const data = await getCompanyById(id);
                setCompany(data);
                // console.log(data);
            } catch (err) {
                console.error("Fetch company error:", err);
            }
        };

        fetchCompany();
    }, [id]);

    const handleFollow = () => {
        if (!auth?.user) {
            alert("You have to login first to follow this company");
            return;
        }

        // Optional: check role (only candidate can follow)
        if (auth.user.roles?.[0] !== "CANDIDATE") {
            alert("Only candidates can follow companies");
            return;
        }

        // TODO: call API follow company
        console.log("Follow company:", company?.id);
    };

    return (
        <div className="company-container">

            {/* COVER */}
            <div className="company-cover">
                <img
                    src={
                        company?.backgroundUrl ||
                        "/images/company-background-default.jpg"
                    }
                />
            </div>

            {/* HEADER */}
            <div className="company-header">

                <div className="company-logo-wrapper">
                    <img
                        src={
                            company?.logo_url ||
                            "/images/company-logo-default.jpg"
                        }
                        className="company-logo"
                    />
                </div>

                <div className="company-info">
                    <h1 className="company-name">{company?.name}</h1>

                    <div className="company-meta">
                        <span><a href={company?.website}>
                            <i className="fa-solid fa-globe meta-icon"></i>
                            {company?.website || "Not available"}
                        </a></span>

                        <span>
                            <i className="fa-solid fa-users meta-icon"></i>
                            {company?.size} staffs
                        </span>

                        <span>
                            <i className="fa-solid fa-user-group meta-icon"></i>
                            {company?.followerNumber || 0} followers
                        </span>
                    </div>
                </div>
                <button
                    className="follow-btn"
                    onClick={handleFollow}
                >
                    {auth?.user ? "+ Follow company" : "Login to follow"}
                </button>
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
                                <p>{company?.description}</p>
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
                                    {company?.website}
                                </p>
                            </div>

                        </div>

                        <div className="map">
                            <iframe
                                src={`https://maps.google.com/maps?q=${company?.province || "Vietnam"}&output=embed`}
                            ></iframe>
                        </div>
                    </div>
                </div>
            </div >
        </div >
    );
}