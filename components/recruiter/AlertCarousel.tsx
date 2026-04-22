"use client";

import { useEffect, useState } from "react";

const banners = [
  { img: "/images/r-banner-1.jpg", link: "#" },
  { img: "/images/r-banner-2.jpg", link: "#" },
  { img: "/images/r-banner-3.jpg", link: "#" },
];

export default function AlertCarousel() {
  const [index, setIndex] = useState(0);

  // group 2 images per slide
  const grouped = [];
  for (let i = 0; i < banners.length; i += 2) {
    grouped.push(banners.slice(i, i + 2));
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % grouped.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [grouped.length]);

  const prev = () => {
    setIndex((index - 1 + grouped.length) % grouped.length);
  };

  const next = () => {
    setIndex((index + 1) % grouped.length);
  };

  return (
    <div className="relative w-full overflow-hidden">

      {/* SLIDE */}
      <div className="grid grid-cols-2 gap-4">
        {grouped[index].map((item, i) => (
          <a key={i} href={item.link}>
            <img
              src={item.img}
              className="w-full h-60 object-cover rounded-xl"
              alt="banner"
            />
          </a>
        ))}
      </div>

      {/* BUTTONS */}
      <button
        onClick={prev}
        className="absolute left-2 top-1/2 -translate-y-1/2 bg-white px-2 py-1 rounded shadow"
      >
        <i className="fa-solid fa-arrow-left"></i>
      </button>

      <button
        onClick={next}
        className="absolute right-2 top-1/2 -translate-y-1/2 bg-white px-2 py-1 rounded shadow"
      >
        <i className="fa-solid fa-arrow-right"></i>
      </button>

      {/* DOTS */}
      <div className="flex justify-center mt-3 gap-2">
        {grouped.map((_, i) => (
          <div
            key={i}
            onClick={() => setIndex(i)}
            className={`w-2 h-2 rounded-full cursor-pointer ${
              i === index ? "bg-black" : "bg-gray-300"
            }`}
          />
        ))}
      </div>
    </div>
  );
}