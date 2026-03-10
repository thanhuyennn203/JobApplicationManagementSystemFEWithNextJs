export interface RecruiterRegisterRequest {
  email: string;
  password: string;

  recruiterInfo: {
    fullName: string;
    gender: string;
    phone: string;
    company: string;
    city: string;
    ward: string;
  };
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