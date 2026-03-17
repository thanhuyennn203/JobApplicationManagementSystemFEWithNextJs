"use client";

import { createContext, useContext, useEffect, useState } from "react";
import {
  getProvinces,
  getWardsByProvince,
  Province,
  Ward,
} from "@/services/locations/LocationService";

type LocationContextType = {
  provinces: Province[];
  wardsMap: Record<string, Ward[]>;
  loading: boolean;

  // actions
  getWards: (provinceCode: string) => Promise<void>;

  // helpers (for forms only)
  getProvinceName: (code: string) => string;
  getWardName: (provinceCode: string, wardCode: string) => string;
};

const LocationContext = createContext<LocationContextType | null>(null);

export const LocationProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [wardsMap, setWardsMap] = useState<Record<string, Ward[]>>({});
  const [loading, setLoading] = useState(true);

  // Load provinces once
  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await getProvinces();
        setProvinces(data);
      } catch (err) {
        console.error("Error fetching provinces:", err);
      } finally {
        setLoading(false);
      }
    };

    fetch();
  }, []);

  // Lazy load wards
  const getWards = async (provinceCode: string) => {
    if (wardsMap[provinceCode]) return;

    try {
      const wards = await getWardsByProvince(provinceCode);

      setWardsMap((prev) => ({
        ...prev,
        [provinceCode]: wards,
      }));
    } catch (err) {
      console.error("Error fetching wards:", err);
    }
  };

  // Helpers (optional now)
  const getProvinceName = (code: string) => {
    const found = provinces.find((p) => p.code === code);
    return found?.nameEn || code;
  };

  const getWardName = (provinceCode: string, wardCode: string) => {
    const wards = wardsMap[provinceCode] || [];
    const found = wards.find((w) => w.code === wardCode);
    return found?.nameEn || wardCode;
  };

  return (
    <LocationContext.Provider
      value={{
        provinces,
        wardsMap,
        loading,
        getWards,
        getProvinceName,
        getWardName,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = () => {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error("useLocation must be used within LocationProvider");
  }
  return context;
};