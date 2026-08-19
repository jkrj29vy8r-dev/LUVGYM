"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Dumbbell, HeartHandshake, LogOut, Settings, User, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProfileDrawerProps {
  open: boolean;
  onClose: () => void;
}

const menuItems = [
  { label: "My Profile", icon: User, href: "#profile" },
  { label: "My Matches", icon: HeartHandshake, href: "#matches" },
  { label: "Gym Preferences", icon: Dumbbell, href: "#preferences" },
  { label: "Settings", icon: Settings, href: "#settings" },
];

export function ProfileDrawer({ open, onClose }: ProfileDrawerProps) {
  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            key="drawer-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
            className="fixed inset-0 z-[60] bg-obsidian-950/70 backdrop-blur-sm"
            aria-hidden="true"
          />

          {/* Drawer panel */}
          <motion.aside
            key="drawer-panel"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 340, damping: 34 }}
            role="dialog"
            aria-modal="true"
            aria-label="Profile menu"
            className={cn(
              "fixed right-0 top-0 z-[70] h-full w-full max-w-sm",
              "border-l border-glass-border bg-obsidian-800/90 backdrop-blur-2xl shadow-glass-lg"
            )}
          >
            <div className="flex h-full flex-col p-6">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium uppercase tracking-wider text-obsidian-300">
                  Account
                </span>
                <button
                  onClick={onClose}
                  aria-label="Close profile menu"
                  className="focus-ring flex h-9 w-9 items-center justify-center rounded-full text-obsidian-300 transition-colors hover:bg-white/5 hover:text-white"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Identity block */}
              <div className="mt-8 flex items-center gap-4">
                <div className="relative">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-love-energy-gradient text-lg font-semibold text-white shadow-glow-love-sm">
                    AK
                  </div>
                  <span className="absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full border-2 border-obsidian-800 bg-energy shadow-glow-energy-sm" />
                </div>
                <div>
                  <p className="text-base font-semibold text-white">Alex Kane</p>
                  <p className="text-sm text-obsidian-300">Downtown Barbell Club</p>
                </div>
              </div>

              {/* Menu */}
              <nav className="mt-8 flex flex-col gap-1">
                {menuItems.map(({ label, icon: Icon, href }) => (
                  <a
                    key={label}
                    href={href}
                    className="focus-ring group flex items-center gap-3 rounded-2xl px-4 py-3 text-sm text-obsidian-100 transition-colors hover:bg-white/5"
                  >
                    <Icon
                      size={18}
                      className="text-obsidian-300 transition-colors group-hover:text-love"
                    />
                    {label}
                  </a>
                ))}
              </nav>

              <div className="mt-auto border-t border-glass-border pt-4">
                <button className="focus-ring group flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm text-obsidian-300 transition-colors hover:bg-white/5 hover:text-love">
                  <LogOut size={18} />
                  Sign out
                </button>
              </div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
