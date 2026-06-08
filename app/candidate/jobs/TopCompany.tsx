"use client";

import { useEffect, useState } from "react";
import CompanyItem from "@/components/company/CompanyItem";
import { getTopCompanies } from "@/services/companies/company.service";
import FieldSlider from "@/components/company/FieldSlider";
import { useFollowCompany } from "@/hooks/useFollowCompany";

export default function TopCompanies() {
    const [companies, setCompanies] = useState<any[]>([]);

    useEffect(() => {
        const fetch = async () => {
            const data = await getTopCompanies();
            setCompanies(data);
        };

        fetch();
    }, []);

    const topCompany = companies[0];
    const { isFollowing, loading, toggleFollow } = useFollowCompany(topCompany?.id);

    return (
        <div className="top-company-page-wrapper">
            <FieldSlider />

            <div className="list-top-company-wrapper">
                <div className="banner-featured-company">

                    {/* Logo */}
                    <div className="banner-featured-company__image">
                        <img
                            src={topCompany?.logoUrl || "/images/company-logo-default.jpg"}
                            alt={topCompany?.name}
                        />
                    </div>

                    {/* Info */}
                    <div className="banner-featured-company__desc">
                        <h3
                            className="banner-featured-company__desc--name"
                            title={topCompany?.companyName}
                        >
                            <a href={`/candidate/company/${topCompany?.companyId}`} target="_blank">
                                {topCompany?.companyName}
                            </a>
                        </h3>

                        <div className="banner-featured-company__desc--field">
                            {topCompany?.industry || "Industry"}
                        </div>
                    </div>

                    {/* Bottom */}
                    <div className="banner-featured-company__info">
                        <div className="number-job">
                            <i className="fa-solid fa-briefcase"></i>
                            <span>{topCompany?.jobCount ?? 0} jobs</span>
                        </div>
                        {topCompany?.isPro && (
                            <span className="job-pro-icon">
                                Pro Company
                            </span>
                        )}
                        <button
                            className={`btn btn-follow ${isFollowing ? "following" : ""}`}
                            onClick={toggleFollow}
                            disabled={loading}
                        >
                            {loading
                                ? "Processing..."
                                : isFollowing
                                    ? "Following"
                                    : "+ Follow"}
                        </button>
                    </div>
                </div>
                {/* <div className="list-company"> */}
                {companies.slice(1, 10).map((company) => (
                    <CompanyItem key={company.id} company={company} />
                ))}
                {/* </div> */}
            </div>
        </div>
    );
}