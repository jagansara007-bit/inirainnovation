"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { usePrefersReducedMotion } from "@/hooks/use-media-query";

const PHRASE = "TECH EVOLVED · ";

export function Vision() {
  const reduced = usePrefersReducedMotion();
  const ref = useRef<HTMLParagraphElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });
  const strip = Array.from({ length: 12 }, () => PHRASE).join("");

  return (
    <section className="vision-band relative overflow-hidden py-20 sm:py-28 md:py-36">
      <div className="pointer-events-none absolute inset-0 flex items-center opacity-[0.12]" aria-hidden>
        <div className="marquee-track flex w-max whitespace-nowrap font-serif text-[16vw] md:text-[12vw] leading-none tracking-tight">
          <span>{strip}</span>
          <span>{strip}</span>
        </div>
      </div>
      <div className="relative z-10 mx-auto max-w-4xl px-5 text-center sm:px-6">
        <motion.p
          ref={ref}
          className="font-serif text-2xl leading-relaxed text-cream sm:text-3xl sm:leading-snug md:text-5xl"
          initial={reduced ? false : { opacity: 0.4, scale: 0.95, filter: "blur(4px)" }}
          animate={
            inView || reduced
              ? { opacity: 1, scale: 1, filter: "blur(0px)" }
              : { opacity: 0.4, scale: 0.95, filter: "blur(4px)" }
          }
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        >
          Built for a world that moves faster than the systems meant to support it.
        </motion.p>
      </div>
    </section>
  );
}
