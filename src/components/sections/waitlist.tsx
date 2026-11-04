"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { MagneticButton } from "@/components/ui/magnetic-button";

type Status = "idle" | "loading" | "success" | "error";

export function Waitlist() {
  const [email, setEmail] = useState("");
  const [focused, setFocused] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const floated = focused || email.length > 0;

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (status === "loading" || status === "success") return;
    setStatus("loading");
    setErrorMessage("");
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        throw new Error(data?.error || "Failed to submit. Please try again.");
      }
      setStatus("success");
    } catch (err: unknown) {
      setStatus("error");
      setErrorMessage(err instanceof Error ? err.message : "Please try again in a moment.");
    }
  }

  return (
    <section id="access" className="relative bg-charcoal px-4 py-20 sm:px-6 sm:py-28 md:py-36">
      <div className="mx-auto max-w-lg text-center">
        <p className="muted text-xs tracking-[0.24em] uppercase sm:text-sm">Get Notified</p>
        <h2 className="font-serif mt-3 text-2xl sm:mt-4 sm:text-3xl md:text-5xl">Join the Waitlist</h2>
        <p className="muted mt-3 text-sm sm:mt-4 sm:text-base">Be the first to know when we launch.</p>

        <form onSubmit={onSubmit} className="relative mt-8 pt-4 text-left sm:mt-10 sm:pt-6">
          <div
            className={`input-glow rounded-full border px-4 py-3.5 transition-colors sm:px-5 sm:py-4 ${
              focused ? "border-accent bg-cream/5" : "border-cream/20 bg-cream/[0.03]"
            }`}
          >
            <label className="relative block">
              <span
                className={`pointer-events-none absolute left-0 text-cream/50 transition-all duration-300 ${
                  floated ? "-top-5 text-[10px] tracking-widest uppercase sm:-top-6 sm:text-[11px]" : "top-1 text-sm sm:text-base"
                }`}
              >
                Email
              </span>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                className="mt-1 w-full bg-transparent pt-2 text-base text-cream outline-none"
                autoComplete="email"
                disabled={status === "success"}
              />
            </label>
          </div>

          <div className="mt-5 flex justify-center sm:mt-6">
            <MagneticButton className="w-full sm:w-auto">
              <motion.button
                type="submit"
                disabled={status === "loading" || status === "success"}
                className="relative w-full overflow-hidden rounded-full bg-accent px-8 py-3.5 text-sm font-medium tracking-wide text-charcoal active:scale-95 sm:w-auto sm:px-10"
                whileTap={{ scale: 0.97 }}
              >
                <AnimatePresence mode="wait" initial={false}>
                  {status === "loading" ? (
                    <motion.span
                      key="loading"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      className="inline-flex items-center gap-2"
                    >
                      <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-charcoal/30 border-t-charcoal" />
                    </motion.span>
                  ) : status === "success" ? (
                    <motion.span
                      key="ok"
                      initial={{ scale: 0.6, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="inline-flex h-5 w-5 items-center justify-center"
                    >
                      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.4">
                        <motion.path
                          d="M5 12.5l5 5L19 7"
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: 1 }}
                          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                        />
                      </svg>
                    </motion.span>
                  ) : (
                    <motion.span key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                      Get Notified
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
            </MagneticButton>
          </div>

          <AnimatePresence>
            {status === "success" ? (
              <motion.span
                key="ripple"
                className="pointer-events-none absolute left-1/2 top-[70%] h-8 w-8 -translate-x-1/2 rounded-full bg-accent/40"
                initial={{ scale: 0.4, opacity: 0.7 }}
                animate={{ scale: 8, opacity: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              />
            ) : null}
          </AnimatePresence>
          {status === "error" ? (
            <p className="mt-4 text-center text-xs text-accent sm:text-sm">{errorMessage || "Please try again in a moment."}</p>
          ) : null}
        </form>
      </div>
    </section>
  );
}
