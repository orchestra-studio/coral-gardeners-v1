"use client";

import { useEffect } from "react";
import Lenis from "lenis";

type LenisScrollProps = {
  duration?: number; // seconds, default per Lenis is ~1
  smoothWheel?: boolean;
};

export default function LenisScrollProvider({
  duration = 1.0,
  smoothWheel = true,
}: LenisScrollProps) {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({
      duration,
      smoothWheel,
    });

    let rafId = 0;

    const raf = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, [duration, smoothWheel]);

  return null;
}
