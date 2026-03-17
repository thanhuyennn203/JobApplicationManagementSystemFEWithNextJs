"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

interface User {
  userId: number;
  email: string;
  roles: string[];
  candidateId?: number;
  companyId?: number;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  // 🔹 Load token when app starts
  useEffect(() => {
    const storedToken = localStorage.getItem("token");

    if (storedToken) {
      try {
        const decoded: any = jwtDecode(storedToken);

        setUser({
          userId: decoded.userId,
          email: decoded.email,
          roles: decoded.roles,
          candidateId: decoded.candidateId,
          companyId: decoded.companyId,
        });

        setToken(storedToken);
      } catch {
        localStorage.removeItem("token");
      }
    }
  }, []);

  const login = (newToken: string) => {
    localStorage.setItem("token", newToken);

    const decoded: any = jwtDecode(newToken);
    console.log("Decoded JWT:", decoded)
    setUser({
      userId: decoded.userId,
      email: decoded.email,
      roles: decoded.roles,
      candidateId: decoded.candidateId,
      companyId: decoded.companyId,
    });

    setToken(newToken);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};