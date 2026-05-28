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
  loading: boolean; // ← add this
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true); // ← start as true

  // 🔹 Load token when app starts
  useEffect(() => {
    const storedToken = localStorage.getItem("token");

    if (storedToken) {
      try {
        const decoded: any = jwtDecode(storedToken);

        setUser({
          userId: Number(decoded.sub),
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

    setLoading(false); // ← done loading regardless of token
  }, []);

  const login = (newToken: string) => {
    localStorage.setItem("token", newToken);
    const decoded: any = jwtDecode(newToken);
    console.log("Decoded JWT:", decoded);
    setUser({
      userId: Number(decoded.sub),
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
    <AuthContext.Provider value={{ user, token, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};