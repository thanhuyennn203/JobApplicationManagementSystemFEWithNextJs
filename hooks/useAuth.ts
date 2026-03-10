"use client";

import { useAuth as useContextAuth } from "@/context/AuthContext";
import * as AuthService from "@/services/auth/auth.service";

interface RegisterPayload {
  fullName: string;
  email: string;
  password: string;
}

export default function useAuth() {
  const auth = useContextAuth();

  const login = async (email: string, password: string) => {
    const data = await AuthService.login(email, password);

    // save token to AuthContext
    auth?.login(data.data.token);

    return data;
  };

  const register = async ({ fullName, email, password }: RegisterPayload) => {
    const data = await AuthService.register({fullName, email, password});

    return data;
  };

  return {
    ...auth,
    login,
    register,
  };
}