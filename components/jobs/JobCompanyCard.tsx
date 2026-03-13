import "@/styles/candidate/JobCompanyCard.css";

interface Props {
  company: {
    name: string;
    description?: string;
    size?: number;
    industry?: string;
    headquarters_city?: string;
    logo_url?: string;
  };
}

export default function JobCompanyCard({ company }: Props) {
  //  if (!company) return null;
   
  return (
    <div className="job-company-card">
      <div className="company-header">
        <img
          src={company?.logo_url || "/default-company.png"}
          alt={company?.name}
          className="company-logo"
        />

        <h3 className="company-name">{company?.name ?? "Loading..."}</h3>
      </div>

      <div className="company-info">
        <InfoRow icon="fa-users" label="Quy mô" value={String(company?.size ?? "")} />
        <InfoRow icon="fa-box" label="Lĩnh vực" value={company?.industry} />
        <InfoRow icon="fa-location-dot" label="Địa điểm" value={company?.headquarters_city} />
      </div>
<a
          href={company?.logo_url}
          target="_blank"
          rel="noopener noreferrer"
          className="company-link"
        >
          Xem trang công ty{" "}
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
        {value && value.trim() !== "" ? value : "Đang cập nhật"}
      </span>
    </div>
  );
}
