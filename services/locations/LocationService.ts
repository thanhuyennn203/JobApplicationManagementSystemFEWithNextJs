// /services/locations/location.service.ts

export type Province = {
  code: string;
  name: string;
  nameEn: string
};

export type Ward = {
  code: string;
  name: string;
  nameEn: string;
};

const BASE_URL = "http://localhost:9191/api/locations";

// Get all provinces
export const getProvinces = async (): Promise<Province[]> => {
  const res = await fetch(`${BASE_URL}/provinces`);

  if (!res.ok) {
    throw new Error("Failed to fetch provinces");
  }

  return res.json();
};

// Get wards by province code
export const getWardsByProvince = async (
  provinceCode: string
): Promise<Ward[]> => {
  const res = await fetch(`${BASE_URL}/provinces/${provinceCode}/wards`);

  if (!res.ok) {
    throw new Error("Failed to fetch wards");
  }

  return res.json();
};

// Get all wards
export const getWardList = async (): Promise<Ward[]> => {
  const res = await fetch(`${BASE_URL}/wards`);

  if (!res.ok) {
    throw new Error("Failed to fetch wards");
  }

  return res.json();
};