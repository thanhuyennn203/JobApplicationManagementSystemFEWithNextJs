// hooks/useOverflowCheck.ts
"use client";
import { useEffect, useRef, useState } from "react";

const A4_HEIGHT_MM = 297;

export function useOverflowCheck<T>(dep: T) {
  const measureRef = useRef<HTMLDivElement>(null);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const [overflowMm, setOverflowMm] = useState(0);

  useEffect(() => {
    const el = measureRef.current;
    if (!el) return;

    let raf: number;
    const check = () => {
      const rect = el.getBoundingClientRect();
      if (rect.width === 0) return;
      const pxPerMm = rect.width / 210; // measure div width = 210mm
      const heightMm = rect.height / pxPerMm;
      setIsOverflowing(heightMm > A4_HEIGHT_MM);
      setOverflowMm(Math.max(0, heightMm - A4_HEIGHT_MM));
    };

    // Đợi font load + layout ổn định trước khi đo lần đầu
    raf = requestAnimationFrame(() => requestAnimationFrame(check));

    const ro = new ResizeObserver(check);
    ro.observe(el);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [dep]);

  return { measureRef, isOverflowing, overflowMm };
}