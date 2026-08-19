"use client";

import { motion } from "framer-motion";
import { Heart, Star, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface SwipeControlsProps {
  onPass: () => void;
  onSuperLike: () => void;
  onLike: () => void;
  disabled?: boolean;
}

export function SwipeControls({ onPass, onSuperLike, onLike, disabled }: SwipeControlsProps) {
  return (
    <div className="flex items-center justify-center gap-5">
      <ControlButton
        label="Pass"
        onClick={onPass}
        disabled={disabled}
        size="md"
        className="border-white/15 text-white/80 hover:border-white/40 hover:text-white"
      >
        <X size={22} strokeWidth={2.5} />
      </ControlButton>

      <ControlButton
        label="Super Like"
        onClick={onSuperLike}
        disabled={disabled}
        size="sm"
        className="border-energy/40 text-energy hover:border-energy/80 hover:shadow-glow-energy"
      >
        <Star size={18} strokeWidth={2.5} fill="currentColor" />
      </ControlButton>

      <ControlButton
        label="Like"
        onClick={onLike}
        disabled={disabled}
        size="lg"
        className="border-love/40 bg-love-energy-gradient text-white hover:shadow-glow-love-lg"
      >
        <Heart size={26} strokeWidth={2.5} fill="currentColor" />
      </ControlButton>
    </div>
  );
}

function ControlButton({
  label,
  onClick,
  disabled,
  size,
  className,
  children,
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  size: "sm" | "md" | "lg";
  className?: string;
  children: React.ReactNode;
}) {
  const sizeClass = { sm: "h-11 w-11", md: "h-14 w-14", lg: "h-16 w-16" }[size];

  return (
    <motion.button
      type="button"
      aria-label={label}
      onClick={onClick}
      disabled={disabled}
      whileHover={disabled ? undefined : { scale: 1.08, y: -3 }}
      whileTap={disabled ? undefined : { scale: 0.92 }}
      transition={{ type: "spring", stiffness: 450, damping: 22 }}
      className={cn(
        "focus-ring flex items-center justify-center rounded-full border bg-glass-surface backdrop-blur-xl transition-[box-shadow,border-color,color] duration-300 disabled:opacity-30",
        sizeClass,
        className
      )}
    >
      {children}
    </motion.button>
  );
}
