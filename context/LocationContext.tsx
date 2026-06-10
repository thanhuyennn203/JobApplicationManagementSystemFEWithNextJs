"use client";

import { createContext, useContext, useEffect, useState } from "react";
import {
  getProvinces,
  getWardList,
  getWardsByProvince,
  Province,
  Ward,
} from "@/services/locations/LocationService";

type LocationContextType = {
  provinces: Province[];
  wardList: Ward[];
  wardsMap: Record<string, Ward[]>;
  loading: boolean;

  // actions
  getWards: (provinceCode: string) => Promise<void>;
  getWardNameFromList: (wardCode: string) => string;
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
  const [wardList, setWardList] = useState<Ward[]>([]);

  // Load provinces once
  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await getProvinces();
        setProvinces(data);

        const wardList = await getWardList();
        setWardList(wardList);
        // console.log(wardList);
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
      // console.log("found",wards);

    } catch (err) {
      console.error("Error fetching wards:", err);
    }
  };

  const getWardNameFromList = (wardCode: string) => {
    if (!wardList || !wardCode) return "";

    const found = wardList.find((w) => w.code === wardCode);
    return found?.nameEn || wardCode;
  };

  // Helpers (optional now)
  const getProvinceName = (code: string) => {
    if (code != null && code != undefined) {
      const found = provinces.find((p) => p.code === code);
      return found?.nameEn || code;
    } else return "";

  };

  const getWardName = (provinceCode: string | undefined, wardCode: string | undefined) => {
    if (provinceCode != null && provinceCode != undefined) {
      const wards = wardsMap[provinceCode] || [];
      console.log(wards);
      const found = wards.find((w) => w.code === wardCode);
      return found?.nameEn || wardCode;
    } else return "";
  };

  return (
    <LocationContext.Provider
      value={{
        provinces,
        wardList,
        wardsMap,
        loading,
        getWardNameFromList,
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