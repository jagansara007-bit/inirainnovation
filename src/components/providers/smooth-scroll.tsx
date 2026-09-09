"use client";

import { useEffect } from "react";
import { usePrefersReducedMotion } from "@/hooks/use-media-query";

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (reduced) return;

    let lenis: { destroy: () => void } | null = null;
    let ticker: ((time: number) => void) | null = null;
    let gsapCleanup: { ticker: { remove: (fn: (time: number) => void) => void } } | null = null;

    const start = async () => {
      const Lenis = (await import("lenis")).default;
      const gsap = (await import("gsap")).default;
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);

      const instance = new Lenis({
        duration: 1.15,
        smoothWheel: true,
        wheelMultiplier: 0.9,
      });
      instance.on("scroll", () => ScrollTrigger.update());
      ticker = (time: number) => {
        instance.raf(time * 1000);
      };
      gsap.ticker.add(ticker);
      gsap.ticker.lagSmoothing(0);
      lenis = instance;
      gsapCleanup = gsap;
    };

    void start();

    return () => {
      if (ticker && gsapCleanup) gsapCleanup.ticker.remove(ticker);
      lenis?.destroy();
    };
  }, [reduced]);

  return <>{children}</>;
}
