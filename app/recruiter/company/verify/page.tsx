"use client";

import "@/styles/recruiter/RecruiterVerify.css";
import { useRouter } from "next/navigation";

export default function EmployerVerify() {
    return (
        <div className="employer-verify-box">

            {/* LEFT */}
            <div className="employer-verify-box__image">
                <div className="background-container">
                    <img
                        src="/images/verify-bg.jpg"
                        className="background-img"
                    />

                    <div className="background-content">
                        <div className="header-container">
                            <img src="/images/price-tag.jpg" className="icon" />

                            <div>
                                <p className="small-text">
                                    You are recruiting for a position in:
                                </p>
                                <h2 className="big-text">Business/Sales</h2>
                            </div>
                        </div>

                        <h3 className="headline">Post your job on TopCV now!</h3>
                        <p className="sub">Superior performance - Rapid response</p>

                        <div className="item-wrapper">
                            <Item text="Over 143,135 applications are received for Business/Sales positions each month." imgUrl="/images/item-icon-1.svg" />
                            <Item text="Reach potential candidates from over 347,849 profiles in the Business/Sales job category." imgUrl="/images/item-icon-2.svg" />
                            <Item text="Typical employers who choose to post job openings in the Business/Sales category on TopCV include: FPT, Viettel, Misa, ..." imgUrl="/images/item-icon-3.svg" />
                        </div>
                    </div>
                </div>
            </div>

            {/* RIGHT */}
            <div className="employer-verify-box__content">
                <h2>
                    Hello, <span className="text-primary">Tran Van Quyen</span>
                </h2>

                <p className="desc">
                    Follow steps to secure your account and get
                    <span className="text-primary"> +2 Top Points</span>
                </p>

                {/* COUNTDOWN */}
                {/* <div className="countdown">
                    <CountdownItem value="13" label="Day" />
                    <CountdownItem value="12" label="Hour" />
                    <CountdownItem value="17" label="Minute" />
                </div> */}

                {/* PROGRESS */}
                <div className="progress-box">
                    <div className="progress-header">
                        <span>Verify information</span>
                        <span className="text-primary">0%</span>
                    </div>
                    <div className="progress">
                        <div className="progress-bar" style={{ width: "0%" }} />
                    </div>
                </div>

                {/* STEPS */}
                <div className="verify-content">
                    <VerifyItem title="Phone number verification" />
                    <VerifyItem title="Update company information" url="/recruiter/company/" />
                    <VerifyItem title="Update Business Registration Certificate" url="/recruiter/verify/verify-upload/" />
                    {/* <VerifyItem title="Update Personal Data Processing Agreement" /> */}
                    <VerifyItem title="Post your first job advertisement (+2)" disabled />
                </div>

                <p className="skip">I will verify later.</p>
            </div>
        </div>
    );
}

function Item({ text, imgUrl }: { text: string, imgUrl: string }) {
    return (
        <div className="item-container" >
            <div className="item-img-box">
                <img src={imgUrl} alt="" />
            </div>
            <div className="item-text"><p>{text}</p></div>
        </div>
    );
}

function CountdownItem({ value, label }: any) {
    return (
        <div className="countdown__item">
            <span className="number">{value}</span>
            <span className="label">{label}</span>
        </div>
    );
}

function VerifyItem({ title, disabled, url }: any) {
    const router = useRouter();

    return (
        <div className={`verify-item ${disabled ? "disable" : ""}`}>
            <div className="left">
                <span className="circle"></span>
                <span>{title}</span>
            </div>
            <div className="arrow-box" onClick={() => router.push(url)}>
                <span className="arrow">→</span>
            </div>

        </div>
    );
}