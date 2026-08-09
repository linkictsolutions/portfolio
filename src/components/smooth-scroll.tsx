"use client";

import { useEffect } from "react";
import Lenis from "lenis";

let globalLenis: Lenis | null = null;

/** Access the active Lenis instance (e.g. for anchor scrolling). */
export function getLenis(): Lenis | null {
  return globalLenis;
}

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (prefersReduced) {
      return;
    }

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.6,
    });

    globalLenis = lenis;

    let rafId = 0;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    // Dispatch a scroll event so GSAP ScrollTrigger / listeners stay in sync.
    lenis.on("scroll", () => {
      window.dispatchEvent(new Event("lenis-scroll"));
    });

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      globalLenis = null;
    };
  }, []);

  return <>{children}</>;
}
