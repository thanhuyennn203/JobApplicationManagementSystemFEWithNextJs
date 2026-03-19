"use client";

import "@/styles/company/FieldSlider.css";
import { useEffect, useState, useRef } from "react";
const fields = [
    "Tất cả",
    "Ngân hàng",
    "Bất động sản",
    "Xây dựng",
    "IT - Phần mềm",
    "Tài chính",
    "Bán lẻ - FMCG",
    "Sản xuất",
    "Logistics - Vận tải",
    "Viễn thông",
    "Bảo hiểm",
    "Nhà hàng / Khách sạn",
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