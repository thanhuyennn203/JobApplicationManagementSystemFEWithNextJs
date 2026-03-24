"use client";
import { getCompanyById } from "@/services/companies/company.service";
import { useEffect, useState } from "react";
import "@/styles/company/CompanyProfile.css";
import { useParams } from "next/navigation";
import { Company } from "@/types/company";
import { useLocation } from "@/context/LocationContext";
import { useAuth } from "@/context/AuthContext";
import { followCompany, unfollowCompany, checkFollowCompany } from "@/services/companies/company.service";
import { getJobByCompanyId } from "@/services/jobs/jobs.service";

export default function CompanyProfilePage() {
    const params = useParams();
    const id = params.id;
    const auth = useAuth();
    const [company, setCompany] = useState<Company | null>(null);
    const { getProvinceName, getWardNameFromList } = useLocation();
    const [isFollowing, setIsFollowing] = useState(false);
    const [loadingFollow, setLoadingFollow] = useState(false);
    useEffect(() => {
        if (!company?.id) return;

        const fetchJobs = async () => {
            try {
                const res = await getJobByCompanyId(company.id);
                setJobs(res || []);
            } catch (err) {
                console.error("Fetch jobs error:", err);
            }
        };

        fetchJobs();
    }, [company?.id]);
    const [jobs, setJobs] = useState<any[]>([]);
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

        if (!auth?.user || !company?.id) return;

        const checkFollow = async () => {
            try {
                const res = await checkFollowCompany(auth?.user?.candidateId, company?.id);
                setIsFollowing(res);
                // console.log("followed: ",res);
            } catch (err) {
                console.error(err);
            }
        };

        checkFollow();
    }, [id, auth?.user, company?.id]);

    const handleFollow = async () => {
        if (!auth?.user) {
            alert("You have to login first to follow this company");
            return;
        }

        if (auth.user.roles?.[0] !== "CANDIDATE") {
            alert("Only candidates can follow companies");
            return;
        }

        if (!company?.id) return;

        try {
            setLoadingFollow(true);

            if (isFollowing) {
                await unfollowCompany(auth?.user?.candidateId, company.id);

                setCompany(prev => prev ? {
                    ...prev,
                    followerNumber: Math.max(0, (prev.followerNumber || 0) - 1)
                } : prev);

                setIsFollowing(false);
            } else {
                await followCompany(auth?.user?.candidateId, company.id);

                setCompany(prev => prev ? {
                    ...prev,
                    followerNumber: (prev.followerNumber || 0) + 1
                } : prev);

                setIsFollowing(true);
            }

        } catch (err) {
            console.error("Follow error:", err);
        } finally {
            setLoadingFollow(false);
        }
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
                    className={`follow-btn ${isFollowing ? "following" : ""}`}
                    onClick={handleFollow}
                    disabled={loadingFollow}
                >
                    {loadingFollow
                        ? "Processing..."
                        : !auth?.user
                            ? "Login to follow"
                            : isFollowing
                                ? "Following"
                                : "+ Follow company"}
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
                    <div className="company-jobs">

                        <h2 className="job-title">JOB POSTINGS</h2>

                        {/* SEARCH BAR */}
                        <div className="job-search">
                            <input
                                type="text"
                                placeholder="job title, categories, salary..."
                            />

                            <select>
                                <option>All provonces/wards</option>
                            </select>

                            <button>
                                <i className="fa-solid fa-magnifying-glass"></i> Search
                            </button>
                        </div>

                        {/* JOB ITEMS */}
                        <div className="job-list">
                            {jobs.map((job) => (
                                <div className="job-card" key={job.id}>

                                    {/* LEFT LOGO */}
                                    <div className="job-logo">
                                        <img src={company?.logo_url || "/images/company-logo-default.jpg"} />
                                    </div>

                                    {/* MIDDLE CONTENT */}
                                    <div className="job-info">
                                        <h3>{job.title}</h3>

                                        <div className="job-company">
                                            <span className="pro-badge">Pro</span>
                                            {company?.name}
                                        </div>

                                        <div className="job-meta">
                                            <span>{job.location || "Vietnam"}</span>
                                            <span>Only {job.remainingDays || 20} day left</span>
                                        </div>
                                    </div>

                                    {/* RIGHT SIDE */}
                                    <div className="job-action">
                                        <div className="salary">$
                                            {job.salary_min} - {job.salary_max}
                                        </div>

                                        <button className="apply-btn">Apply</button>

                                        <button className="favorite-btn">
                                            <i className="fa-regular fa-heart"></i>
                                        </button>
                                    </div>

                                </div>
                            ))}
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

            {/* JOB LIST */}

        </div >
    );
}