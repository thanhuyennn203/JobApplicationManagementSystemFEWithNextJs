
import "@/styles/JobGeneralInformation.css";
import { GeneralInformation } from "@/services/jobs/jobGeneralInfor.service";

interface Props {
  data: GeneralInformation | null;
}

const EMPTY_TEXT = "Đang cập nhật";

function display(value?: string | number) {
  if (value === null || value === undefined || value === "") {
    return EMPTY_TEXT;
  }
  return value;
}

export default function JobGeneralInformation({ data }: Props) {
  return (
    <div className="general-info-card">
      <h3 className="general-info-title">Thông tin chung</h3>

      <div className="general-info-item">
        <div className="icon green">
          <i className="fa-solid fa-briefcase"></i>
        </div>
        <div>
          <span className="label">Cấp bậc</span>
          <p className="value">{display(data?.rank)}</p>
        </div>
      </div>

      <div className="general-info-item">
        <div className="icon green">
          <i className="fa-solid fa-graduation-cap"></i>
        </div>
        <div>
          <span className="label">Học vấn</span>
          <p className="value">{display(data?.education)}</p>
        </div>
      </div>

      <div className="general-info-item">
        <div className="icon green">
          <i className="fa-solid fa-users"></i>
        </div>
        <div>
          <span className="label">Số lượng tuyển</span>
          <p className="value">
            {data?.numberOfRecruitment
              ? `${data.numberOfRecruitment} người`
              : EMPTY_TEXT}
          </p>
        </div>
      </div>

      <div className="general-info-item">
        <div className="icon green">
          <i className="fa-solid fa-clock"></i>
        </div>
        <div>
          <span className="label">Hình thức làm việc</span>
          <p className="value">{display(data?.workingStyle)}</p>
        </div>
      </div>
    </div>
  );
}
