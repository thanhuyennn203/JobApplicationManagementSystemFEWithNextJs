"use client";

import { useEffect, useRef } from "react";
import "@/styles/Banner.css";
interface Banner {
  id: number;
  image: string;
  link: string;
  title: string;
}

const banners: Banner[] = [
  {
    id: 1,
    image: "/images/banner-1.jpg",
    link: "#",
    title: "Bee Logistics",
  },
  {
    id: 2,
    image: "/images/banner-2.jpg",
    link: "#",
    title: "Misa",
  },
  {
    id: 3,
    image: "/images/banner-3.jpg",
    link: "#",
    title: "HelloWorld",
  },
  {
    id: 4,
    image: "/images/banner-4.jpg",
    link: "#",
    title: "Language Link",
  },
  {
    id: 5,
    image: "/images/banner-5.jpg",
    link: "#",
    title: "Language Link",
  },
  {
    id: 6,
    image: "/images/banner-6.jpg",
    link: "#",
    title: "Language Link",
  },
];

export default function CenterBanner() {
  const containerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (!containerRef.current) return;

    const width = containerRef.current.offsetWidth;
    containerRef.current.scrollBy({
      left: direction === "left" ? -width : width,
      behavior: "smooth",
    });
  };

  // autoplay
  useEffect(() => {
    const interval = setInterval(() => {
      scroll("right");
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full">
      {/* Slider */}
      <div
        ref={containerRef}
        className="flex overflow-x-auto scroll-smooth snap-x snap-mandatory no-scrollbar"
      >
        {banners.map((banner) => (
          <div
            key={banner.id}
            className="min-w-[33.33%] px-2 snap-start"
          >
            <a href={banner.link} target="_blank">
              <img
                src={banner.image || "/images/banner-1.jpg"}
                alt={banner.title}
                className="w-full h-[180px] object-cover rounded-xl"
              />
            </a>
          </div>
        ))}
      </div>

      {/* Buttons */}
      <button
        onClick={() => scroll("left")}
        className="absolute left-2 top-1/2 -translate-y-1/2 bg-white shadow px-3 py-2 rounded-full"
      >
        ◀
      </button>

      <button
        onClick={() => scroll("right")}
        className="absolute right-2 top-1/2 -translate-y-1/2 bg-white shadow px-3 py-2 rounded-full"
      >
        ▶
      </button>
    </div>
  );
}