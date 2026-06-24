"use client";

import { useState, useEffect } from "react";
import "@/styles/candidate/JobSearch.css";
import { useLocation } from "@/context/LocationContext";
import { Province } from "@/services/locations/LocationService";
import { useRouter } from "next/navigation";
export default function JobSearch() {
  const [keyword, setKeyword] = useState("");
  const [searchType, setSearchType] = useState("ALL");

  const [openLocation, setOpenLocation] = useState(false);
  const [selectedLocation, setSelectedLocation] =
    useState<Province | null>(null);
  const router = useRouter();
  const { provinces, loading } = useLocation();


  useEffect(() => {
    const close = () => setOpenLocation(false);

    window.addEventListener("click", close);

    return () => window.removeEventListener("click", close);
  }, []);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const params = new URLSearchParams();

    if (searchType === "COMPANY" && keyword) {
      params.append("companyName", keyword);
    }

    if (searchType === "JOB" && keyword) {
      params.append("jobTitle", keyword);
    }

    if (searchType === "LOCATION" && selectedLocation) {
      params.append("province", selectedLocation.code);
    }


    if (searchType === "ALL") {
      if (keyword) {
        params.append("jobTitle", keyword);
        params.append("companyName", keyword);
      }

      if (selectedLocation) {
        params.append("province", selectedLocation.code);
      }
    }


    params.append("page", "0");
    params.append("size", "12");

    router.push(
      `/candidate/jobs/search?${params.toString()}`
    );
    // const res = await fetch(
    //   `http://localhost:9191/api/jobs/top-jobs/search?${params.toString()}`
    // );

    // const data = await res.json();

    // console.log(data);
  };


  return (
    <div className="header-content_search">

      <form
        className="group-search"
        onSubmit={handleSubmit}
      >


        {/* Search type */}
        <div className="item item-type">

          <select
            value={searchType}
            onChange={(e) => setSearchType(e.target.value)}
            className="form-control"
          >
            <option value="ALL">
              All
            </option>

            <option value="JOB">
              Job title
            </option>

            <option value="COMPANY">
              Company
            </option>

            <option value="LOCATION">
              Location
            </option>

          </select>

        </div>



        {/* Keyword */}
        {
          searchType !== "LOCATION" &&

          <div className="item item-search">

            <i className="fa-solid fa-magnifying-glass"></i>


            <input
              className="form-control"
              placeholder={
                searchType === "COMPANY"
                  ? "Search company..."
                  : "Search jobs..."
              }
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />


            {
              keyword &&
              <button
                type="button"
                className="btn-clear"
                onClick={() => setKeyword("")}
              >
                ×
              </button>
            }


          </div>
        }



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
              {
                selectedLocation
                  ? selectedLocation.nameEn
                  : "Location"
              }
            </span>

          </div>



          {
            openLocation &&

            <ul
              className="location-dropdown"
              onClick={(e) => e.stopPropagation()}
            >

              {
                loading &&
                <li>
                  Loading...
                </li>
              }


              {
                !loading &&
                provinces.map(loc => (

                  <li
                    key={loc.code}
                    onClick={() => {
                      setSelectedLocation(loc);
                      setOpenLocation(false);
                    }}
                  >
                    {loc.nameEn}
                  </li>

                ))
              }


            </ul>

          }


        </div>

        <div className="btn-search-job-wrapper">
          <button
            className="btn-search-job"
            onClick={handleSubmit}
            type="button"
          >

            <i className="fa-solid fa-magnifying-glass"></i>

            Search

          </button>

        </div>


      </form>

    </div>
  );
}