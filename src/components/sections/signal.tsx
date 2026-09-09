"use client";

import { useEffect, useRef } from "react";
import { useIsTouchDevice, usePrefersReducedMotion } from "@/hooks/use-media-query";

const LINES = [
  "Some problems have been solved the same way for too long.",
  "We're rethinking one of them from the ground up.",
  "More soon.",
];

export function Signal() {
  const reduced = usePrefersReducedMotion();
  const touch = useIsTouchDevice();
  const pinRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const linesRef = useRef<HTMLParagraphElement[]>([]);
  const pointer = useRef({ x: 0.5, y: 0.5 });

  useEffect(() => {
    const section = pinRef.current;
    const canvas = canvasRef.current;
    if (!section) return;

    let ctx: CanvasRenderingContext2D | null = null;
    let raf = 0;
    let nodes: Array<{ x: number; y: number; vx: number; vy: number }> = [];
    let visible = false;
    let progress = 0;

    const setupCanvas = () => {
      if (!canvas || reduced || touch) return;
      ctx = canvas.getContext("2d");
      if (!ctx) return;
      const rect = section.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = rect.width * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      nodes = Array.from({ length: 28 }, () => ({
        x: Math.random() * rect.width,
        y: Math.random() * window.innerHeight,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
      }));
    };

    const draw = () => {
      if (!ctx || !canvas || !visible) {
        raf = requestAnimationFrame(draw);
        return;
      }
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      ctx.clearRect(0, 0, w, h);
      const maxLink = 140 * progress;

      for (const n of nodes) {
        n.x += n.vx + (pointer.current.x - 0.5) * 0.15;
        n.y += n.vy + (pointer.current.y - 0.5) * 0.15;
        if (n.x < 0 || n.x > w) n.vx *= -1;
        if (n.y < 0 || n.y > h) n.vy *= -1;
      }

      ctx.strokeStyle = "rgba(201,122,61,0.28)";
      ctx.lineWidth = 0.6;
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i];
          const b = nodes[j];
          const d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d < maxLink) {
            ctx.globalAlpha = (1 - d / 180) * progress;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }
      ctx.globalAlpha = 1;
      ctx.fillStyle = "rgba(245,240,232,0.45)";
      for (const n of nodes) {
        ctx.beginPath();
        ctx.arc(n.x, n.y, 1.2, 0, Math.PI * 2);
        ctx.fill();
      }
      raf = requestAnimationFrame(draw);
    };

    let cleanupGsap: (() => void) | undefined;

    const start = async () => {
      setupCanvas();
      if (!reduced && !touch) raf = requestAnimationFrame(draw);

      const gsap = (await import("gsap")).default;
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);

      const lines = linesRef.current.filter(Boolean);
      gsap.set(lines, { opacity: reduced ? 1 : 0.08, y: reduced ? 0 : 24, filter: reduced ? "none" : "blur(6px)" });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "+=160%",
          pin: true,
          scrub: true,
          onUpdate: (self) => {
            progress = self.progress;
          },
          onToggle: (self) => {
            visible = self.isActive;
          },
        },
      });

      lines.forEach((line, i) => {
        tl.to(
          line,
          { opacity: 1, y: 0, filter: "blur(0px)", duration: 1, ease: "power2.out" },
          i * 0.7,
        );
      });

      cleanupGsap = () => {
        tl.scrollTrigger?.kill();
        tl.kill();
      };
    };

    const onMove = (e: PointerEvent) => {
      const rect = section.getBoundingClientRect();
      pointer.current = {
        x: (e.clientX - rect.left) / rect.width,
        y: (e.clientY - rect.top) / rect.height,
      };
    };

    section.addEventListener("pointermove", onMove);
    window.addEventListener("resize", setupCanvas);
    void start();

    return () => {
      cancelAnimationFrame(raf);
      cleanupGsap?.();
      section.removeEventListener("pointermove", onMove);
      window.removeEventListener("resize", setupCanvas);
    };
  }, [reduced, touch]);

  return (
    <section id="signal" className="relative bg-charcoal-lift">
      <div ref={pinRef} className="relative flex min-h-[100svh] items-center justify-center px-6">
        {!reduced && !touch ? <canvas ref={canvasRef} className="pointer-events-none absolute inset-0" /> : null}
        <div className="relative z-10 mx-auto max-w-3xl space-y-8 md:space-y-10">
          {LINES.map((line, i) => (
            <p
              key={line}
              ref={(el) => {
                if (el) linesRef.current[i] = el;
              }}
              className={`font-serif leading-[1.15] tracking-tight text-cream ${
                i === 2 ? "text-3xl italic md:text-5xl" : "text-3xl md:text-5xl"
              }`}
            >
              {line}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}
