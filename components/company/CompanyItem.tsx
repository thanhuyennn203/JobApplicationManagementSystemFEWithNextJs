"use client";

import "@/styles/company/CompanyItem.css";
import { Company } from "@/types/company";
import { useRouter } from "next/navigation";
import { useFollowCompany } from "@/hooks/useFollowCompany";

export default function CompanyItem({ company }: { company: Company }) {
    const router = useRouter();
    const { isFollowing, loading, toggleFollow } = useFollowCompany(company?.id);


    return (
        <div className="list-company__item" >
            <div>
                <div className="list-company__item--header company-header" onClick={() => router.push(`/candidate/company/${company.id}`)}>

                    {/* Logo */}
                    <div className="company-header__image">
                        <img
                            src={company.logo_url || "/images/company-logo-default.jpg"}
                            alt={company?.name}
                        />
                    </div>

                    {/* Info */}
                    <div className="company-header__desc">
                        <h3
                            className="company-header__desc--name"
                            title={company?.name}
                        >
                            {/* <a href={`/candidate/company/${company?.id}`} target="_blank"> */}
                            {company?.name}
                            {/* </a> */}
                        </h3>

                        <div className="company-header__desc--field">
                            {company?.industry || "Unknown"}
                        </div>
                    </div>
                </div>
            </div>


            {/* Bottom */}
            <div className="list-company__item--info">
                <div className="number-job">
                    <i className="fa-solid fa-briefcase"></i>

                    <span>{company.size} jobs</span>
                </div>

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
    );
}