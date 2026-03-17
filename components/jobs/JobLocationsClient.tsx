"use client";

import { useLocation } from "@/context/LocationContext";

export default function JobLocationsClient({ locations }: any) {
  const { provinces } = useLocation();

  const provinceMap = Object.fromEntries(
    provinces.map((p) => [p.code, p.name])
  );

  return (
    <ul>
      <h3>Working Locations</h3>

      {locations?.map((loc: any) => {
        const provinceName = provinceMap[loc.province] || loc.province;

        return (
          <li key={loc.id}>
            - {loc.detailAddress}, {loc.ward}, {provinceName}
          </li>
        );
      })}
    </ul>
  );
}