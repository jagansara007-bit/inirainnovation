"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";
import { usePrefersReducedMotion } from "@/hooks/use-media-query";

const FLAG = "inira-intro-seen";

export function Preloader({ onDone }: { onDone: () => void }) {
  const reduced = usePrefersReducedMotion();
  const [show, setShow] = useState(false);

  useEffect(() => {
    const seen = sessionStorage.getItem(FLAG);
    if (seen || reduced) {
      onDone();
      return;
    }
    setShow(true);
    const t = window.setTimeout(() => {
      sessionStorage.setItem(FLAG, "1");
      setShow(false);
    }, 1100);
    return () => window.clearTimeout(t);
  }, [onDone, reduced]);

  return (
    <AnimatePresence onExitComplete={onDone}>
      {show ? (
        <motion.div
          className="fixed inset-0 z-[90] flex items-center justify-center bg-charcoal"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.92, filter: "blur(8px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <Image src="/logo.jpg" alt="Inira Innovations" width={220} height={220} priority />
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
