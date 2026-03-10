"use client";

import { useAuth as useContextAuth } from "@/context/AuthContext";
import * as AuthService from "@/services/auth/auth.service";

export default function useAuth() {
  const auth = useContextAuth();

  const login = async (email: string, password: string) => {
    const data = await AuthService.login(email, password);

    // save token to AuthContext
    auth?.login(data.token);

    return data;
  };

  return {
    ...auth,
    login,
  };
}
