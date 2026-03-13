export interface RecruiterRegisterRequest {
  fullName: string,
  email: string;
  password: string;

  recruiterInfo: {
    gender: string;
    phone: string;
  };

  companyInfor:{
    name: string;
    province: string;
    ward: string;
  }
}

export const recruiterRegister = async (
  data: RecruiterRegisterRequest
) => {

  const response = await fetch(
    "http://localhost:9191/api/auth/recruiter/register",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  );

  if (!response.ok) {
    throw new Error("Register failed");
  }

  return response.json();
};