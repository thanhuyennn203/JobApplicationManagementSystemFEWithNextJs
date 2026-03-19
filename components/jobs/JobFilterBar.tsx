"use client";

import { useState, useRef,useEffect } from "react";
import "@/styles/jobs/JobFilterBar.css";

const FILTER_OPTIONS = ["Location", "Salary", "Experience", "Category"];

const FILTER_VALUES: any = {
    Location: ["All", "Hanoi", "Ho Chi Minh", "North", "South"],
    Salary: ["< $500", "$500 - $1000", "$1000 - $2000", "> $2000"],
    Experience: ["Intern", "Fresher", "Junior", "Middle", "Senior", "Manager"],
    Category: ["IT", "Marketing", "Finance"]
};

export default function JobFilterBar({ onFilterChange }: any) {
    const [open, setOpen] = useState(false);
    const [selectedFilter, setSelectedFilter] = useState("Location");
    const [activeValue, setActiveValue] = useState("All");
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(true);
    const listRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const el = listRef.current;
        if (!el) return;

        checkScroll();
        el.addEventListener("scroll", checkScroll);

        return () => el.removeEventListener("scroll", checkScroll);
    }, []);
    const checkScroll = () => {
        const el = listRef.current;
        if (!el) return;

        setCanScrollLeft(el.scrollLeft > 0);
        setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth);
    };

    const scroll = (direction: "left" | "right") => {
        if (!listRef.current) return;

        const scrollAmount = 200;
        listRef.current.scrollBy({
            left: direction === "left" ? -scrollAmount : scrollAmount,
            behavior: "smooth",
        });
    };
    const handleSelectFilter = (filter: string) => {
        setSelectedFilter(filter);

        const firstValue = FILTER_VALUES[filter][0];
        setActiveValue(firstValue);

        onFilterChange?.(filter, firstValue); // optional

        setOpen(false);
    };

    const handleSelectValue = (value: string) => {
        setActiveValue(value);
        onFilterChange?.(selectedFilter, value);
    };

    return (
        <div className="job-filter-bar">

            {/* LEFT DROPDOWN */}
            <div className="filter-wrapper">
                <div
                    className={`filter-box ${open ? "active" : ""}`}
                    onClick={() => setOpen(!open)}
                >
                    <div className="filter-left">
                        <i className="fa-solid fa-sliders"></i>
                        <span className="label">Filter by:</span>
                        <span className="value">{selectedFilter}</span>
                    </div>
                    <i className={`fa-solid fa-chevron-${open ? "up" : "down"}`}></i>
                </div>

                {open && (
                    <div className="dropdown">
                        {FILTER_OPTIONS.map((item) => (
                            <div
                                key={item}
                                className={`dropdown-item ${selectedFilter === item ? "selected" : ""
                                    }`}
                                onClick={() => handleSelectFilter(item)}
                            >
                                {item}
                                {selectedFilter === item && (
                                    <i className="fa-solid fa-check"></i>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* RIGHT CHIPS */}
            <div className="filter-values-box">

                {/* LEFT ARROW */}
                <div className="prev-location btn-slick-arrow" onClick={() => scroll("left")}>
                    <i className="fa-solid fa-angle-left"></i>
                </div>

                {/* SCROLL AREA */}
                <div className="filter-values" ref={listRef}>
                    {FILTER_VALUES[selectedFilter].map((item: string) => (
                        <button
                            key={item}
                            className={`chip ${activeValue === item ? "active" : ""}`}
                            onClick={() => handleSelectValue(item)}
                        >
                            {item}
                        </button>
                    ))}
                </div>

                {/* RIGHT ARROW */}
                <div className="next-location btn-slick-arrow" onClick={() => scroll("right")}>
                    <i className="fa-solid fa-angle-right" ></i>
                </div>

            </div>
        </div >
    );
}