"use client";

import { useRef, useState } from "react";
import type { ReactNode } from "react";
import { AnimatePresence, motion, type HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

type RippleTheme = "cyan" | "crimson";

interface RippleButtonProps extends Omit<HTMLMotionProps<"button">, "ref"> {
  theme?: RippleTheme;
  icon?: ReactNode;
  children: ReactNode;
}

interface Ripple {
  id: number;
  x: number;
  y: number;
  size: number;
}

const themeStyles: Record<RippleTheme, { border: string; glow: string; ripple: string; dot: string }> = {
  cyan: {
    border: "border-energy/40 hover:border-energy/80",
    glow: "hover:shadow-glow-energy-lg",
    ripple: "bg-energy/45",
    dot: "bg-energy shadow-glow-energy-sm",
  },
  crimson: {
    border: "border-love/40 hover:border-love/80",
    glow: "hover:shadow-glow-love-lg",
    ripple: "bg-love/45",
    dot: "bg-love shadow-glow-love-sm",
  },
};

export function RippleButton({
  theme = "crimson",
  icon,
  children,
  className,
  onPointerDown,
  ...props
}: RippleButtonProps) {
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const rippleId = useRef(0);
  const styles = themeStyles[theme];

  const handlePointerDown: React.PointerEventHandler<HTMLButtonElement> = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height) * 2.2;
    const id = rippleId.current++;
    setRipples((prev) => [
      ...prev,
      {
        id,
        x: event.clientX - rect.left - size / 2,
        y: event.clientY - rect.top - size / 2,
        size,
      },
    ]);
    onPointerDown?.(event);
  };

  const removeRipple = (id: number) => {
    setRipples((prev) => prev.filter((r) => r.id !== id));
  };

  return (
    <motion.button
      whileHover={{ scale: 1.03, y: -2 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 420, damping: 24 }}
      onPointerDown={handlePointerDown}
      className={cn(
        "focus-ring group relative isolate flex items-center justify-center gap-2.5 overflow-hidden rounded-full border bg-white/[0.03] px-8 py-4 text-sm font-semibold tracking-tight text-white backdrop-blur-xl transition-[box-shadow,border-color] duration-300",
        styles.border,
        styles.glow,
        className
      )}
      {...props}
    >
      <span className={cn("h-1.5 w-1.5 shrink-0 rounded-full transition-transform duration-300 group-hover:scale-125", styles.dot)} />
      <span className="relative z-10">{children}</span>
      {icon && <span className="relative z-10 shrink-0">{icon}</span>}

      <span className="pointer-events-none absolute inset-0 overflow-hidden rounded-full">
        <AnimatePresence>
          {ripples.map((ripple) => (
            <motion.span
              key={ripple.id}
              initial={{ scale: 0, opacity: 0.55 }}
              animate={{ scale: 1, opacity: 0 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              onAnimationComplete={() => removeRipple(ripple.id)}
              className={cn("absolute rounded-full", styles.ripple)}
              style={{ left: ripple.x, top: ripple.y, width: ripple.size, height: ripple.size }}
            />
          ))}
        </AnimatePresence>
      </span>
    </motion.button>
  );
}
