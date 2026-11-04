"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";

const links = [
  { href: "#signal", label: "More soon." },
  { href: "#access", label: "Get Notified" },
];

export function Navbar() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setProgress(Math.min(1, y / 280));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const bg = `rgba(45, 42, 38, ${progress * 0.92})`;
  const blur = 2 + progress * 14;

  return (
    <header
      className="fixed top-0 left-0 z-50 w-full transition-[background-color,border-color] duration-200"
      style={{
        backgroundColor: bg,
        backdropFilter: `blur(${blur}px)`,
        WebkitBackdropFilter: `blur(${blur}px)`,
        borderBottom: `1px solid rgba(245, 240, 232, ${progress * 0.08})`,
      }}
    >
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-2.5 sm:px-6 sm:py-3 md:px-8">
        <a
          href="#top"
          className="logo-idle group inline-flex items-center"
          data-cursor="hover"
          aria-label="Inira Innovations"
        >
          <Image
            src="/logo.jpg"
            alt="Inira Innovations"
            width={148}
            height={148}
            className="h-10 w-auto object-contain transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:rotate-[2deg] sm:h-12 md:h-[4.75rem]"
            priority
          />
        </a>
        <div className="flex items-center gap-4 text-sm tracking-wide sm:gap-6 md:gap-10">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              data-cursor="hover"
              className={cn(
                "transition-all duration-300 font-medium italic",
                link.href === "#access"
                  ? "rounded-full border border-accent/40 bg-accent/15 px-3.5 py-1.5 text-xs text-cream active:scale-95 sm:border-transparent sm:bg-transparent sm:px-0 sm:py-0 sm:text-sm sm:text-cream nav-underline"
                  : "muted hidden sm:inline nav-underline",
              )}
            >
              {link.label}
            </a>
          ))}
        </div>
      </nav>
    </header>
  );
}
