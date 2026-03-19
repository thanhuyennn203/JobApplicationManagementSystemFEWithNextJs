"use client";

import { useState, useEffect } from "react";
import "@/styles/candidate/JobSearch.css";
import { useLocation } from "@/context/LocationContext";
import { Province } from "@/services/locations/LocationService";

export default function JobSearch() {
  const [keyword, setKeyword] = useState("");
  const [openLocation, setOpenLocation] = useState(false);
  const [selectedLocation, setSelectedLocation] =
    useState<Province | null>(null);

  const { provinces, loading } = useLocation();

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
        {/* Keyword */}
        <div className="item item-search">
          <i className="fa-solid fa-magnifying-glass"></i>

          <input
            className="form-control"
            placeholder="Search for postions, locations, industries,..."
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

        {/* Location */}
        <div
          className="item item-location"
          onClick={(e) => {
            e.stopPropagation();
            setOpenLocation(!openLocation);
          }}
        >
          <div className="select-multi-location">
            <i className="fa-solid fa-location-dot"></i>
            <span>
              {selectedLocation ? selectedLocation.name : "Location"}
            </span>
          </div>

          {openLocation && (
            <ul
              className="location-dropdown"
              onClick={(e) => e.stopPropagation()}
            >
              {loading && <li className="loading">Loading...</li>}

              {!loading &&
                provinces.map((loc) => (
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

        {/* Button */}
        <div className="btn-search-job-wrapper">
          <button className="btn-search-job" type="submit">
            <i className="fa-solid fa-magnifying-glass"></i>
            Search
          </button>
        </div>
      </form>
    </div>
  );
}