"use client";

import dynamic from "next/dynamic";
import { motion, type Variants } from "framer-motion";
import { Dumbbell, Heart, Sparkles } from "lucide-react";
import { RippleButton } from "@/components/ui/RippleButton";

const HeroCanvas = dynamic(() => import("./HeroCanvas"), { ssr: false });

const container: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.14, delayChildren: 0.15 },
  },
};

const item: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
  },
};

export function HeroSection() {
  return (
    <section
      id="top-hero"
      aria-label="LUVGYM introduction"
      className="relative flex min-h-[100svh] w-full flex-col items-center justify-center overflow-hidden px-6 pb-20 pt-32 sm:pt-36"
    >
      {/* Live 3D layer: glowing heart + reactive particle dust. Click-through
          so the CTAs below stay fully interactive. */}
      <div className="absolute inset-0 z-0">
        <HeroCanvas />
      </div>

      {/* Readability scrim: keeps text legible without hiding the 3D scene */}
      <div className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-b from-obsidian/10 via-transparent to-obsidian" />
      <div
        className="pointer-events-none absolute inset-0 z-[1]"
        style={{
          background:
            "radial-gradient(55% 40% at 50% 52%, rgba(10,11,16,0.4) 0%, rgba(10,11,16,0) 70%)",
        }}
      />

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="relative z-10 flex max-w-3xl flex-col items-center text-center"
      >
        <motion.div
          variants={item}
          className="inline-flex items-center gap-2 rounded-full border border-glass-border bg-glass-surface px-4 py-1.5 text-xs font-medium text-obsidian-200 backdrop-blur-xl"
        >
          <Sparkles size={13} className="text-love" />
          Where fitness culture meets connection
        </motion.div>

        <motion.h1
          variants={item}
          className="mt-7 text-balance text-5xl font-bold leading-[1.05] tracking-tight sm:text-6xl md:text-7xl"
        >
          <span className="text-gradient-hero block">Find Your Match.</span>
          <span className="text-gradient-hero block">Lift Your Vibe.</span>
        </motion.h1>

        <motion.p
          variants={item}
          className="mt-7 max-w-xl text-balance text-base text-obsidian-300 sm:text-lg"
        >
          The ultimate Dating &amp; Gym Partner platform where fitness culture
          meets genuine connection.
        </motion.p>

        <motion.div
          variants={item}
          className="mt-10 flex flex-col items-center gap-4 sm:flex-row"
        >
          <RippleButton theme="cyan" icon={<Dumbbell size={17} />}>
            Find Gym Partner
          </RippleButton>
          <RippleButton theme="crimson" icon={<Heart size={17} />}>
            Dating &amp; Romance
          </RippleButton>
        </motion.div>
      </motion.div>
    </section>
  );
}
