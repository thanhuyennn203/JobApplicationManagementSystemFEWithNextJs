"use client";

import { useState, useEffect } from "react";
import "@/styles/candidate/JobSearch.css";
import { getProvinces, Province } from "@/services/locations/LocationService";

export default function JobSearch() {
  const [keyword, setKeyword] = useState("");
  const [locations, setLocations] = useState<Province[]>([]);
  const [openLocation, setOpenLocation] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<Province | null>(null);

  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const data = await getProvinces();
        setLocations(data);
      } catch (err) {
        console.error("Error fetching provinces:", err);
      }
    };

    fetchProvinces();
  }, []);

  useEffect(() => {
    const close = () => setOpenLocation(false);
    window.addEventListener("click", close);
    return () => window.removeEventListener("click", close);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const searchPayload = {
      keyword,
      provinceId: selectedLocation?.code || null,
    };

    console.log("Search with:", searchPayload);
  };

   return (
    <div className="header-content_search">
      <form className="group-search" onSubmit={handleSubmit}>
        {/* Keyword search */}
        <div className="item item-search">
          <i className="fa-solid fa-magnifying-glass"></i>

          <input
            className="form-control"
            placeholder="Vị trí tuyển dụng, tên công ty"
            autoComplete="off"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />

          {keyword && (
            <button
              type="button"
              className="btn-clear"
              onClick={() => setKeyword("")}
            >
              ×
            </button>
          )}
        </div>

        {/* Location select */}
        <div
          className="item item-location"
          onClick={(e) => {
            e.stopPropagation();
            setOpenLocation(!openLocation);
          }}
        >
          <div className="select-multi-location">
            <i className="fa-solid fa-location-dot"></i>
            <span>{selectedLocation ? selectedLocation.name : "Địa điểm"}</span>
            {/* <span className="dropdown">
              <i className="fa-solid fa-chevron-down"></i>
            </span> */}
          </div>

          {openLocation && (
            <ul
              className="location-dropdown"
              onClick={(e) => e.stopPropagation()}
            >
              {locations.length === 0 && (
                <li className="loading">Đang tải...</li>
              )}

              {locations.map((loc) => (
                <li
                  key={loc.code}
                  onClick={() => {
                    setSelectedLocation(loc);
                    setOpenLocation(false);
                  }}
                >
                  {loc.name}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Search button */}
        <div className="btn-search-job-wrapper">
          <button className="btn-search-job" type="submit">
            <i className="fa-solid fa-magnifying-glass"></i>
            Tìm kiếm
          </button>
        </div>
      </form>
    </div>
  );
}