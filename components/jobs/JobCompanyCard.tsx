import "@/styles/candidate/JobCompanyCard.css";
import { Company } from "@/types/company";
import { useRouter } from "next/navigation";

interface Props {
  company: Company | null;
}

export default function JobCompanyCard({ company }: Props) {
  const router = useRouter();
  return (
    <div className="job-company-card">
      <div className="company-header" onClick={() => router.push(`/candidate/company/${company?.id}`)}>
        <div className="company-logo-img-box">
          <img
            src={company?.logo_url || "/images/company-logo-default.jpg"}
            alt={company?.name}
            className="company-logo"
          />
        </div>


        <h3 className="company-name">{company?.name ?? "Loading..."}</h3>
      </div>

      <div className="company-info">
        <InfoRow icon="fa-users" label="Scale" value={String(company?.size ?? "")} />
        <InfoRow icon="fa-box" label="Industry" value={company?.industry} />
        <InfoRow icon="fa-location-dot" label="Location" value={company?.province} />
      </div>
      <a
        href={company?.website}
        target="_blank"
        rel="noopener noreferrer"
        className="company-link"
      >
        Visit company website{" "}
        <i className="fa-solid fa-arrow-up-right-from-square" />
      </a>
      {/* {company.logo_url && (
        <a
          href={company.logo_url}
          target="_blank"
          rel="noopener noreferrer"
          className="company-link"
        >
          Xem trang công ty{" "}
          <i className="fa-solid fa-arrow-up-right-from-square" />
        </a>
      )} */}
    </div>
  );
}

// function InfoRow({
//   icon,
//   label,
//   value,
// }: {
//   icon: string;
//   label: string;
//   value?: string;
// }) {
//   if (!value) return null;

//   return (
//     <div className="company-row">
//       <i className={`fa-solid ${icon}`} />
//       <span className="label">{label}</span>
//       <span className="value">{value}</span>
//     </div>
//   );
// }

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: string;
  label: string;
  value?: string;
}) {
  return (
    <div className="company-row">
      <i className={`fa-solid ${icon}`} />
      <span className="label">{label}</span>
      <span className="value">
        {value && value.trim() !== "" ? value : "Loading..."}
      </span>
    </div>
  );
}
