"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { HeartHandshake, LogOut, UserCog, X } from "lucide-react";
import { useAuth } from "@/lib/auth/AuthProvider";
import { EditProfileModal } from "@/components/profile/EditProfileModal";
import { getFallbackGradient, getInitials } from "@/lib/avatar";
import { cn } from "@/lib/utils";

interface ProfileDrawerProps {
  open: boolean;
  onClose: () => void;
}

export function ProfileDrawer({ open, onClose }: ProfileDrawerProps) {
  const { user, profile, signOut } = useAuth();
  const [editOpen, setEditOpen] = useState(false);

  if (!user) return null;

  const initials = getInitials(profile?.full_name);

  const handleSignOut = async () => {
    await signOut();
    onClose();
  };

  return (
    <>
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
                    {profile?.avatar_url ? (
                      // eslint-disable-next-line @next/next/no-img-element -- user-uploaded, arbitrary remote URL
                      <img
                        src={profile.avatar_url}
                        alt=""
                        className="h-16 w-16 rounded-full object-cover"
                      />
                    ) : (
                      <div
                        className="flex h-16 w-16 items-center justify-center rounded-full text-lg font-semibold text-white shadow-glow-love-sm"
                        style={{ background: getFallbackGradient(user.id) }}
                      >
                        {initials}
                      </div>
                    )}
                    <span className="absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full border-2 border-obsidian-800 bg-energy shadow-glow-energy-sm" />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-base font-semibold text-white">
                      {profile?.full_name || "Complete your profile"}
                    </p>
                    <p className="truncate text-sm text-obsidian-300">
                      {profile?.gym_chain || user.email}
                    </p>
                  </div>
                </div>

                {/* Menu */}
                <nav className="mt-8 flex flex-col gap-1">
                  <button
                    onClick={() => setEditOpen(true)}
                    className="focus-ring group flex items-center gap-3 rounded-2xl px-4 py-3 text-sm text-obsidian-100 transition-colors hover:bg-white/5"
                  >
                    <UserCog
                      size={18}
                      className="text-obsidian-300 transition-colors group-hover:text-love"
                    />
                    Edit Profile
                  </button>
                  <Link
                    href="/matches"
                    onClick={onClose}
                    className="focus-ring group flex items-center gap-3 rounded-2xl px-4 py-3 text-sm text-obsidian-100 transition-colors hover:bg-white/5"
                  >
                    <HeartHandshake
                      size={18}
                      className="text-obsidian-300 transition-colors group-hover:text-love"
                    />
                    My Matches
                  </Link>
                </nav>

                <div className="mt-auto border-t border-glass-border pt-4">
                  <button
                    onClick={handleSignOut}
                    className="focus-ring group flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm text-obsidian-300 transition-colors hover:bg-white/5 hover:text-love"
                  >
                    <LogOut size={18} />
                    Sign out
                  </button>
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <EditProfileModal open={editOpen} onClose={() => setEditOpen(false)} />
    </>
  );
}
