"use client";

import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { MagneticButton } from "@/components/ui/magnetic-button";
import { useIsTouchDevice, usePrefersReducedMotion } from "@/hooks/use-media-query";

const HEADLINE = "Tech Evolved.";

export function Hero() {
  const reduced = usePrefersReducedMotion();
  const touch = useIsTouchDevice();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const pointer = useRef({ x: 0, y: 0 });
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const firstVisit = !sessionStorage.getItem("inira-intro-seen");
    const delay = firstVisit && !reduced ? 900 : 40;
    const t = window.setTimeout(() => setReady(true), delay);
    return () => window.clearTimeout(t);
  }, [reduced]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const section = sectionRef.current;
    if (!canvas || !section || reduced || touch) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let raf = 0;
    let visible = true;
    const dots: Array<{ x: number; y: number; ox: number; oy: number; r: number; a: number }> = [];

    const resize = () => {
      const { width, height } = section.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      dots.length = 0;
      const gap = 42;
      for (let y = 0; y < height + gap; y += gap) {
        for (let x = 0; x < width + gap; x += gap) {
          dots.push({
            x,
            y,
            ox: x,
            oy: y,
            r: 1.1,
            a: 0.08 + Math.random() * 0.12,
          });
        }
      }
    };

    const onMove = (e: PointerEvent) => {
      const rect = section.getBoundingClientRect();
      pointer.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    };

    const draw = (t: number) => {
      if (!visible) {
        raf = requestAnimationFrame(draw);
        return;
      }
      const { width, height } = section.getBoundingClientRect();
      ctx.clearRect(0, 0, width, height);
      const px = pointer.current.x || width / 2;
      const py = pointer.current.y || height / 2;
      const time = t * 0.00035;

      for (const d of dots) {
        const dx = px - d.ox;
        const dy = py - d.oy;
        const dist = Math.hypot(dx, dy) || 1;
        const pull = Math.min(18, 280 / dist);
        d.x = d.ox + (dx / dist) * pull + Math.sin(time + d.ox * 0.01) * 1.4;
        d.y = d.oy + (dy / dist) * pull + Math.cos(time + d.oy * 0.01) * 1.4;
        ctx.beginPath();
        ctx.fillStyle = `rgba(201, 122, 61, ${d.a})`;
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fill();
      }
      raf = requestAnimationFrame(draw);
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
      },
      { threshold: 0.05 },
    );
    io.observe(section);

    resize();
    window.addEventListener("resize", resize);
    section.addEventListener("pointermove", onMove);
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener("resize", resize);
      section.removeEventListener("pointermove", onMove);
    };
  }, [reduced, touch]);

  return (
    <section
      ref={sectionRef}
      id="top"
      className="relative flex min-h-[100svh] items-center justify-center overflow-hidden px-6 pt-24"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-80"
        style={{
          background:
            "radial-gradient(900px 500px at 50% 35%, rgba(201,122,61,0.16), transparent 60%), radial-gradient(700px 400px at 80% 80%, rgba(201,122,61,0.08), transparent 55%)",
        }}
      />
      {!reduced && !touch ? <canvas ref={canvasRef} className="pointer-events-none absolute inset-0" /> : null}

      <div className="relative z-10 mx-auto max-w-4xl text-center">
        <h1 className="font-serif text-[clamp(3.4rem,12vw,8.5rem)] leading-[0.9] tracking-tight">
          {HEADLINE.split("").map((char, i) => (
            <motion.span
              key={`${char}-${i}`}
              className="inline-block"
              initial={reduced ? false : { opacity: 0, y: 28, filter: "blur(8px)" }}
              animate={ready ? { opacity: 1, y: 0, filter: "blur(0px)" } : undefined}
              transition={{
                duration: 0.7,
                delay: 0.08 + i * 0.045,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              {char === " " ? "\u00A0" : char}
            </motion.span>
          ))}
        </h1>
        <motion.p
          className="muted mx-auto mt-8 max-w-xl text-base leading-relaxed md:text-lg"
          initial={reduced ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.85, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          We&apos;re building something new. Quietly, deliberately — and almost ready.
        </motion.p>

        <motion.div
          className="mt-12 flex justify-center"
          initial={reduced ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.05, duration: 0.6 }}
        >
          <MagneticButton>
            <a
              href="#access"
              className="inline-flex items-center rounded-full border border-accent/50 bg-accent/15 px-8 py-3.5 text-sm font-medium tracking-wide text-cream shadow-[0_0_0_0_rgba(201,122,61,0.4)] transition-[box-shadow,transform,background] duration-300 hover:bg-accent/25 hover:shadow-[0_0_32px_rgba(201,122,61,0.35)] active:scale-[0.97]"
            >
              Join the Waitlist
            </a>
          </MagneticButton>
        </motion.div>
      </div>

      <a
        href="#signal"
        data-cursor="hover"
        className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2 text-[10px] tracking-[0.28em] uppercase text-cream/45"
        aria-label="Scroll"
      >
        <span className="h-10 w-px origin-top bg-gradient-to-b from-accent to-transparent motion-safe:animate-bounce" />
        <span>↓</span>
      </a>
    </section>
  );
}
