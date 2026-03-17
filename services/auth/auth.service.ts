const API_URL = "http://localhost:9191/api/auth";

export async function register(data: {
  fullName: string;
  email: string;
  password: string;
}) {

  const res = await fetch(`${API_URL}/candidate/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error("Register failed");
  }

  return res.json();
}

export async function login(email: string, password: string) {
  const res = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      password,
    }),
  });

  if (!res.ok) {
    throw new Error("Login failed");
  }

  return res.json();
}

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