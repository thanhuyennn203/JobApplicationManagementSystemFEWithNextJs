"use client";

import "@/styles/company/FieldSlider.css";
import { useEffect, useState, useRef } from "react";
const fields = [
  "All",
  "Banking",
  "Real Estate",
  "Construction",
  "IT - Software",
  "Finance",
  "Retail - FMCG",
  "Manufacturing",
  "Logistics - Transportation",
  "Telecommunications",
  "Insurance",
  "Restaurant / Hotel",
];

export default function FieldSlider() {
    const [active, setActive] = useState(0);
    const listRef = useRef<HTMLDivElement>(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(true);

    const checkScroll = () => {
        const el = listRef.current;
        if (!el) return;

        setCanScrollLeft(el.scrollLeft > 0);
        setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth);
    };

    useEffect(() => {
        const el = listRef.current;
        if (!el) return;

        checkScroll();
        el.addEventListener("scroll", checkScroll);

        return () => el.removeEventListener("scroll", checkScroll);
    }, []);
    
    const scroll = (direction: "left" | "right") => {
        if (!listRef.current) return;

        const scrollAmount = 200;
        listRef.current.scrollBy({
            left: direction === "left" ? -scrollAmount : scrollAmount,
            behavior: "smooth",
        });
    };

    return (
        <div className="box-field">

            <div className="box-field__list" ref={listRef}>
                {fields.map((item, index) => (
                    <div
                        key={index}
                        className={`box-field__list--item ${active === index ? "active" : ""}`}
                        onClick={() => setActive(index)}
                    >
                        {item}
                    </div>
                ))}
            </div>

            <button className="box-field__btn-prev" onClick={() => scroll("left")}>
                <i className="fa-solid fa-angle-left"></i>
            </button>

            <button className="box-field__btn-next" onClick={() => scroll("right")}>
                <i className="fa-solid fa-angle-right"></i>
            </button>

        </div>
    );
}