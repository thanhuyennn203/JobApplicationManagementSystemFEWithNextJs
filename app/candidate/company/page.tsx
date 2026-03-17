"use client";

import "@/styles/company/CompanyProfile.css";
import { useState } from "react";

export default function CompanyProfilePage() {

    const [company, setCompany] = useState({
        name: "CÔNG TY CỔ PHẦN OPEN HEALTHCARE VIỆT NAM",
        website: "https://www.ohvn.vn/",
        employees: "25-99 nhân viên",
        followers: 19,
        description:
            "Open Healthcare Việt Nam được thành lập mang đến dịch vụ K-Medical với mục tiêu nâng cao sức khỏe người dân Việt Nam.",
        address:
            "Số 7 - Dãy 6 khu giãn dân Yên Phúc, Tổ 5, Phường Hà Đông, Thành phố Hà Nội",
        phone: "1900 638 839"
    });

    const handleEdit = (section: string) => {
        alert("Edit " + section);
    };

    return (
        <div className="company-container">

            {/* COVER */}
            <div className="company-cover">

                <img src="/images/company-background-default.jpg" />

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

                    <img src="/images/company-logo-default.jpg"  className="company-logo" />

                    <div
                        className="edit-btn logo-edit"
                        onClick={() => handleEdit("logo")}
                    >
                        <i className="fa-solid fa-pen-to-square"></i>
                    </div>

                </div>

                <div className="company-info">

                    <h1 className="company-name">
                        {company.name}
                    </h1>

                    <div className="company-meta">

                        <span>
                            <i className="fa-solid fa-globe meta-icon"></i>
                            {company.website}
                        </span>

                        <span>
                            <i className="fa-solid fa-users meta-icon"></i>
                            {company.employees}
                        </span>

                        <span>
                            <i className="fa-solid fa-user-group meta-icon"></i>
                            {company.followers} người theo dõi
                        </span>

                    </div>
                </div>

                <button className="follow-btn">
                    + Theo dõi công ty
                </button>

            </div>

            {/* CONTENT */}
            <div className="company-content">

                {/* LEFT */}
                <div className="company-left">

                    <div className="card">
                        <div className="company-card">

                            <div className="card-title">
                                <span>Giới thiệu công ty</span>

                                <i className="fa-solid fa-pen-to-square edit-icon"></i>
                            </div>

                            <div className="card-body">
                                <p>{company.description}</p>
                            </div>

                        </div>

                    </div>

                </div>

                {/* RIGHT */}
                <div className="company-right">

                    <div className="card">
                        <div className="company-card">

                            <div className="card-title">
                                <span>Thông tin liên hệ</span>

                                <i className="fa-solid fa-pen-to-square edit-icon"></i>
                            </div>

                            <div className="card-body">
                                <h4><i className="fa-solid fa-location-dot info-icon"></i> Company Location</h4>
                                <p>
                                    {company.address}
                                </p>

                                <p>
                                    <i className="fa-solid fa-phone info-icon"></i>
                                    {company.phone}
                                </p>

                            </div>

                        </div>


                        <div className="map">

                            <iframe
                                src="https://maps.google.com/maps?q=hanoi&t=&z=13&ie=UTF8&iwloc=&output=embed"
                            ></iframe>

                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
}