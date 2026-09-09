"use client";

import { Navbar } from "@/components/layout/navbar";
import { CustomCursor } from "@/components/motion/custom-cursor";
import { Preloader } from "@/components/motion/preloader";
import { ScrollProgress } from "@/components/motion/scroll-progress";
import { SectionDivider } from "@/components/motion/section-divider";
import { SmoothScroll } from "@/components/providers/smooth-scroll";
import { Footer } from "@/components/sections/footer";
import { Hero } from "@/components/sections/hero";
import { Signal } from "@/components/sections/signal";
import { Vision } from "@/components/sections/vision";
import { Waitlist } from "@/components/sections/waitlist";

export default function Home() {
  return (
    <SmoothScroll>
      <Preloader onDone={() => undefined} />
      <ScrollProgress />
      <CustomCursor />
      <Navbar />
      <main>
        <Hero />
        <SectionDivider />
        <Signal />
        <SectionDivider />
        <Vision />
        <SectionDivider />
        <Waitlist />
        <Footer />
      </main>
    </SmoothScroll>
  );
}
