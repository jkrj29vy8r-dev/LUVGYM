import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface GlassCardProps extends HTMLAttributes<HTMLDivElement> {
  glow?: "love" | "energy" | "none";
}

export function GlassCard({ className, glow = "none", children, ...props }: GlassCardProps) {
  return (
    <div
      className={cn(
        "glass-panel relative overflow-hidden p-6 transition-all duration-300",
        glow === "love" && "hover:border-love/30 hover:shadow-glow-love",
        glow === "energy" && "hover:border-energy/30 hover:shadow-glow-energy",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
