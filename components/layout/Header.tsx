"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Bell, CalendarDays, Compass, Dumbbell, Flame, Menu, X } from "lucide-react";
import { Logo } from "@/components/logo/Logo";
import { ProfileDrawer } from "@/components/layout/ProfileDrawer";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Discover", href: "#discover", icon: Compass },
  { label: "Matches", href: "#matches", icon: Flame },
  { label: "Gyms", href: "#gyms", icon: Dumbbell },
  { label: "Events", href: "#events", icon: CalendarDays },
];

export function Header() {
  const [activeItem, setActiveItem] = useState(navItems[0].label);
  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-4 sm:pt-6">
        <div className="flex w-full max-w-5xl flex-col items-center">
          <div className="glass-surface flex w-full items-center justify-between gap-3 rounded-full px-3 py-2.5 sm:px-4">
            <a href="#top" className="shrink-0">
              <Logo size={32} wordmarkClassName="text-base sm:text-lg" />
            </a>

            {/* Center floating pill navigation (desktop) */}
            <nav
              aria-label="Primary"
              className="relative hidden items-center gap-1 rounded-full border border-white/[0.06] bg-black/20 p-1 md:flex"
            >
              {navItems.map((item) => {
                const isActive = activeItem === item.label;
                return (
                  <a
                    key={item.label}
                    href={item.href}
                    onClick={() => setActiveItem(item.label)}
                    className={cn(
                      "focus-ring relative z-10 flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-colors duration-200",
                      isActive ? "text-white" : "text-obsidian-300 hover:text-white"
                    )}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="nav-active-pill"
                        transition={{ type: "spring", stiffness: 380, damping: 32 }}
                        className="absolute inset-0 -z-10 rounded-full bg-white/[0.08] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]"
                      />
                    )}
                    <item.icon size={15} className={cn(isActive && "text-love")} />
                    {item.label}
                  </a>
                );
              })}
            </nav>

            {/* Right cluster: notifications + avatar */}
            <div className="flex items-center gap-2">
              <button
                aria-label="Notifications"
                className="focus-ring relative hidden h-10 w-10 items-center justify-center rounded-full text-obsidian-300 transition-colors hover:bg-white/5 hover:text-white sm:flex"
              >
                <Bell size={18} />
                <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-love shadow-glow-love-sm" />
              </button>

              <button
                onClick={() => setProfileOpen(true)}
                aria-label="Open profile menu"
                aria-haspopup="dialog"
                className="focus-ring relative flex h-10 w-10 items-center justify-center rounded-full ring-1 ring-white/10 transition-transform hover:scale-105 active:scale-95"
              >
                <span className="flex h-full w-full items-center justify-center rounded-full bg-love-energy-gradient text-xs font-semibold text-white">
                  AK
                </span>
                <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-obsidian-900 bg-energy" />
              </button>

              {/* Mobile menu toggle */}
              <button
                onClick={() => setMobileOpen((v) => !v)}
                aria-label="Toggle menu"
                aria-expanded={mobileOpen}
                className="focus-ring flex h-10 w-10 items-center justify-center rounded-full text-obsidian-300 transition-colors hover:bg-white/5 hover:text-white md:hidden"
              >
                {mobileOpen ? <X size={18} /> : <Menu size={18} />}
              </button>
            </div>
          </div>

          {/* Mobile nav panel */}
          <AnimatePresence>
            {mobileOpen && (
              <motion.nav
                aria-label="Primary mobile"
                initial={{ opacity: 0, y: -8, height: 0 }}
                animate={{ opacity: 1, y: 0, height: "auto" }}
                exit={{ opacity: 0, y: -8, height: 0 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="glass-surface mt-2 flex w-full flex-col gap-1 overflow-hidden rounded-3xl p-2 md:hidden"
              >
                {navItems.map((item) => {
                  const isActive = activeItem === item.label;
                  return (
                    <a
                      key={item.label}
                      href={item.href}
                      onClick={() => {
                        setActiveItem(item.label);
                        setMobileOpen(false);
                      }}
                      className={cn(
                        "focus-ring flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-colors",
                        isActive
                          ? "bg-white/[0.08] text-white"
                          : "text-obsidian-300 hover:bg-white/5 hover:text-white"
                      )}
                    >
                      <item.icon size={16} className={cn(isActive && "text-love")} />
                      {item.label}
                    </a>
                  );
                })}
              </motion.nav>
            )}
          </AnimatePresence>
        </div>
      </header>

      <ProfileDrawer open={profileOpen} onClose={() => setProfileOpen(false)} />
    </>
  );
}
