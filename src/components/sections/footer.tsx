"use client";

import { motion } from "framer-motion";

const socials = [
  {
    href: "mailto:inirainnovations@gmail.com",
    label: "Email",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.6">
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="M3 7l9 7 9-7" />
      </svg>
    ),
  },
  {
    href: "https://instagram.com/inira_innovations",
    label: "Instagram",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.6">
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" />
      </svg>
    ),
  },
  {
    href: "https://linkedin.com/company/inira-innovations",
    label: "LinkedIn",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
        <path d="M6.5 9H4V20h2.5V9zM5.25 4A1.5 1.5 0 103.76 5.5 1.5 1.5 0 005.25 4zM20 20h-2.5v-5.6c0-1.8-.7-2.4-1.7-2.4s-1.8.8-1.8 2.5V20H11.5V9H14v1.3c.5-.9 1.6-1.6 3.1-1.6 2.3 0 2.9 1.5 2.9 4.3z" />
      </svg>
    ),
  },
];

export function Footer() {
  return (
    <motion.footer
      className="border-t border-cream/10 bg-charcoal-deep px-6 py-14"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-8 md:flex-row">
        <div className="text-center md:text-left">
          <p className="font-serif text-xl italic">Tech Evolved.</p>
          <a
            href="mailto:inirainnovations@gmail.com"
            className="muted mt-2 inline-block text-sm nav-underline"
            data-cursor="hover"
          >
            inirainnovations@gmail.com
          </a>
        </div>
        <div className="flex items-center gap-3">
          {socials.map((s) => (
            <motion.a
              key={s.href}
              href={s.href}
              target={s.href.startsWith("http") ? "_blank" : undefined}
              rel={s.href.startsWith("http") ? "noreferrer" : undefined}
              aria-label={s.label}
              data-cursor="hover"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-cream/15 text-cream/70"
              whileHover={{ scale: 1.12, backgroundColor: "rgba(201,122,61,0.22)", color: "#F5F0E8", borderColor: "rgba(201,122,61,0.7)" }}
              transition={{ type: "spring", stiffness: 380, damping: 18 }}
            >
              {s.icon}
            </motion.a>
          ))}
        </div>
      </div>
      <p className="muted mx-auto mt-10 max-w-6xl text-center text-xs tracking-widest uppercase">
        Instagram @inira_innovations
      </p>
    </motion.footer>
  );
}
