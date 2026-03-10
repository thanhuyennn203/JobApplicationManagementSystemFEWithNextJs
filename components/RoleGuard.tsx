"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

type Props = {
  children: React.ReactNode;
  allow: string[];
};

export default function RoleGuard({ children, allow }: Props) {
  const router = useRouter();

  useEffect(() => {
    const role = localStorage.getItem("role");

    if (!role || !allow.includes(role)) {
      router.push("/unauthorized");
    }
  }, []);

  return <>{children}</>;
}

