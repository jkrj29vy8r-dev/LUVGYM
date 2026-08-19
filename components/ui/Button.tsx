"use client";

import { forwardRef } from "react";
import { motion, type HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "ghost" | "outline";
type ButtonSize = "sm" | "md" | "lg" | "icon";

interface ButtonProps extends Omit<HTMLMotionProps<"button">, "ref"> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-love-energy-gradient text-white shadow-glow-love-sm hover:shadow-glow-love transition-shadow",
  secondary:
    "glass-surface text-white hover:border-white/20",
  ghost: "text-obsidian-200 hover:text-white hover:bg-white/5",
  outline:
    "border border-white/15 text-white hover:border-love/50 hover:shadow-glow-love-sm",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "h-8 px-3.5 text-xs rounded-full",
  md: "h-10 px-5 text-sm rounded-full",
  lg: "h-12 px-7 text-base rounded-full",
  icon: "h-10 w-10 rounded-full",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", children, ...props }, ref) => {
    return (
      <motion.button
        ref={ref}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        transition={{ type: "spring", stiffness: 500, damping: 25 }}
        className={cn(
          "focus-ring inline-flex items-center justify-center gap-2 font-medium tracking-tight transition-colors duration-200 disabled:opacity-40 disabled:pointer-events-none",
          variantStyles[variant],
          sizeStyles[size],
          className
        )}
        {...props}
      >
        {children}
      </motion.button>
    );
  }
);
Button.displayName = "Button";
