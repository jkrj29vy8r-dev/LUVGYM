"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface LogoProps {
  size?: number;
  className?: string;
  showWordmark?: boolean;
  wordmarkClassName?: string;
}

/**
 * Geometric mark: two "weight plate" circles joined by a barbell bar,
 * with their lower arcs converging to a point — read simultaneously as
 * a minimalist heart and a dumbbell. Gradient stroke runs love -> energy.
 */
export function Logo({
  size = 36,
  className,
  showWordmark = true,
  wordmarkClassName,
}: LogoProps) {
  return (
    <div className={cn("group flex items-center gap-2.5 select-none", className)}>
      <motion.div
        whileHover={{ scale: 1.06, rotate: -2 }}
        whileTap={{ scale: 0.96 }}
        transition={{ type: "spring", stiffness: 400, damping: 15 }}
        className="relative flex items-center justify-center"
      >
        {/* Ambient glow layer behind the mark, blooms on hover */}
        <div className="absolute inset-0 rounded-full bg-love/20 blur-lg opacity-0 scale-75 transition-all duration-500 group-hover:opacity-100 group-hover:scale-125" />

        <svg
          width={size}
          height={size}
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="relative transition-[filter] duration-300 group-hover:animate-neon-glow"
          role="img"
          aria-label="LUVGYM logo"
        >
          <defs>
            <linearGradient id="luvgym-logo-gradient" x1="4" y1="9" x2="44" y2="40" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#FF2A5F" />
              <stop offset="100%" stopColor="#00F2FE" />
            </linearGradient>
          </defs>

          {/* Barbell bar joining the two plates */}
          <line
            x1="18.5"
            y1="15"
            x2="29.5"
            y2="15"
            stroke="url(#luvgym-logo-gradient)"
            strokeWidth="2.5"
            strokeLinecap="round"
          />

          {/* Left plate / heart lobe */}
          <circle
            cx="13"
            cy="15"
            r="6.25"
            stroke="url(#luvgym-logo-gradient)"
            strokeWidth="2.5"
          />

          {/* Right plate / heart lobe */}
          <circle
            cx="35"
            cy="15"
            r="6.25"
            stroke="url(#luvgym-logo-gradient)"
            strokeWidth="2.5"
          />

          {/* Converging lines forming the heart's point / dumbbell stance */}
          <path
            d="M8.5 20.5C8.5 20.5 10 32 24 41C38 32 39.5 20.5 39.5 20.5"
            stroke="url(#luvgym-logo-gradient)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </motion.div>

      {showWordmark && (
        <span
          className={cn(
            "font-display text-xl font-semibold tracking-tight text-white",
            wordmarkClassName
          )}
        >
          LUV<span className="text-gradient-brand">GYM</span>
        </span>
      )}
    </div>
  );
}
