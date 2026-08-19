"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Dumbbell, Heart, MessageCircle, Sparkles, X, Zap } from "lucide-react";
import { RippleButton } from "@/components/ui/RippleButton";
import { useAuth, type Profile } from "@/lib/auth/AuthProvider";
import { getFallbackGradient, getInitials } from "@/lib/avatar";

interface MatchModalProps {
  profile: Profile | null;
  matchId: string | null;
  onClose: () => void;
}

const PARTICLE_ICONS = [Heart, Dumbbell, Zap, Sparkles];
const PARTICLE_COLORS = ["#FF2A5F", "#00F2FE", "#FF6690", "#33F5FE", "#FFFFFF"];

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  delay: number;
  duration: number;
  Icon?: (typeof PARTICLE_ICONS)[number];
}

function generateBurst(count: number): Particle[] {
  return Array.from({ length: count }, (_, i) => {
    const isIcon = i % 5 === 0;
    const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.4;
    // Large enough that particles clear the match card's own footprint
    // while still opaque, rather than fading out underneath it.
    const distance = 220 + Math.random() * 260;
    return {
      id: i,
      x: Math.cos(angle) * distance,
      y: Math.sin(angle) * distance,
      size: isIcon ? 14 + Math.random() * 10 : 4 + Math.random() * 7,
      color: PARTICLE_COLORS[Math.floor(Math.random() * PARTICLE_COLORS.length)],
      delay: Math.random() * 0.12,
      duration: 0.75 + Math.random() * 0.55,
      Icon: isIcon ? PARTICLE_ICONS[Math.floor(Math.random() * PARTICLE_ICONS.length)] : undefined,
    };
  });
}

export function MatchModal({ profile, matchId, onClose }: MatchModalProps) {
  const router = useRouter();
  const { profile: currentUserProfile, user } = useAuth();

  const goToChat = (compose?: "workout") => {
    if (!matchId) return;
    onClose();
    router.push(compose ? `/matches/${matchId}?compose=${compose}` : `/matches/${matchId}`);
  };

  return (
    <AnimatePresence>
      {profile && (
        <motion.div
          key="match-modal-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          role="dialog"
          aria-modal="true"
          aria-label={`It's a match with ${profile.full_name ?? "your new match"}`}
          className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-obsidian-950/85 p-6 backdrop-blur-md"
          onClick={onClose}
        >
          {/* Pulsing brand-colored glow behind everything */}
          <div
            className="animate-pulse-glow pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(circle at 50% 45%, rgba(255,42,95,0.35) 0%, rgba(0,242,254,0.18) 35%, rgba(10,11,16,0) 65%)",
            }}
          />

          {/* Expanding shockwave ring — opacity is kept high past the point
              the ring clears the card's own footprint (~0.55 of the way
              through), then fades, so it reads as a visible pulse instead
              of dissolving while still hidden behind the card. */}
          <motion.div
            initial={{ scale: 0, opacity: 0.8 }}
            animate={{ scale: 7, opacity: [0.8, 0.8, 0] }}
            transition={{
              scale: { duration: 1.1, ease: "easeOut" },
              opacity: { duration: 1.1, times: [0, 0.55, 1] },
            }}
            className="pointer-events-none absolute h-24 w-24 rounded-full border-2 border-love"
          />

          {/* Neon particle burst — keyed by profile so each new match rolls a fresh burst */}
          <ParticleBurst key={`particles-${profile.id}`} />

          {/* Content card */}
          <motion.div
            key={`card-${profile.id}`}
            initial={{ opacity: 0, scale: 0.75, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 10 }}
            transition={{ type: "spring", stiffness: 320, damping: 24 }}
            onClick={(event) => event.stopPropagation()}
            className="glass-panel relative w-full max-w-md overflow-hidden p-8 text-center shadow-glass-lg"
          >
            <button
              onClick={onClose}
              aria-label="Dismiss"
              className="focus-ring absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full text-obsidian-300 transition-colors hover:bg-white/5 hover:text-white"
            >
              <X size={16} />
            </button>

            {/* Colliding avatars */}
            <div className="flex items-center justify-center">
              <motion.div
                initial={{ x: -70, rotate: -20, opacity: 0 }}
                animate={{ x: -14, rotate: -8, opacity: 1 }}
                transition={{ type: "spring", stiffness: 260, damping: 18, delay: 0.1 }}
                className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-full text-lg font-bold text-white shadow-glow-love-lg ring-4 ring-obsidian-900"
                style={currentUserProfile?.avatar_url ? undefined : { background: getFallbackGradient(user?.id ?? "you") }}
              >
                {currentUserProfile?.avatar_url ? (
                  // eslint-disable-next-line @next/next/no-img-element -- user-uploaded, arbitrary remote URL
                  <img src={currentUserProfile.avatar_url} alt="" className="h-full w-full object-cover" />
                ) : (
                  getInitials(currentUserProfile?.full_name)
                )}
              </motion.div>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 14, delay: 0.3 }}
                className="z-10 -mx-3 flex h-9 w-9 items-center justify-center rounded-full bg-white text-love shadow-glow-love"
              >
                <Heart size={18} fill="currentColor" />
              </motion.div>
              <motion.div
                initial={{ x: 70, rotate: 20, opacity: 0 }}
                animate={{ x: 14, rotate: 8, opacity: 1 }}
                transition={{ type: "spring", stiffness: 260, damping: 18, delay: 0.1 }}
                className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-full text-lg font-bold text-white shadow-glow-energy-lg ring-4 ring-obsidian-900"
                style={profile.avatar_url ? undefined : { background: getFallbackGradient(profile.id) }}
              >
                {profile.avatar_url ? (
                  // eslint-disable-next-line @next/next/no-img-element -- user-uploaded, arbitrary remote URL
                  <img src={profile.avatar_url} alt="" className="h-full w-full object-cover" />
                ) : (
                  getInitials(profile.full_name)
                )}
              </motion.div>
            </div>

            <motion.h2
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.4 }}
              className="mt-6 text-4xl font-black tracking-tight text-gradient-hero"
            >
              BOOM! It&apos;s a Match
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45, duration: 0.4 }}
              className="mt-2 text-sm text-obsidian-300"
            >
              You and{" "}
              <span className="font-semibold text-white">{profile.full_name || "your match"}</span>{" "}
              both swiped right. Time to lock in a session.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55, duration: 0.4 }}
              className="mt-7 flex flex-col gap-3 sm:flex-row"
            >
              <RippleButton
                theme="crimson"
                className="flex-1"
                icon={<MessageCircle size={17} />}
                onClick={() => goToChat()}
              >
                Send Message
              </RippleButton>
              <RippleButton
                theme="cyan"
                className="flex-1"
                icon={<Dumbbell size={17} />}
                onClick={() => goToChat("workout")}
              >
                Propose Workout
              </RippleButton>
            </motion.div>

            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.65 }}
              onClick={onClose}
              className="focus-ring mt-5 text-xs font-medium text-obsidian-400 transition-colors hover:text-white"
            >
              Keep Swiping
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/** Remounted (via a `key`) for every new match so its random burst re-rolls. */
function ParticleBurst() {
  const particles = useMemo(() => generateBurst(28), []);

  return (
    <div className="pointer-events-none absolute left-1/2 top-1/2 h-0 w-0">
      {particles.map((p) => (
        <motion.span
          key={p.id}
          initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
          animate={{ x: p.x, y: p.y, opacity: [1, 1, 0], scale: [1, 0.9, 0.25] }}
          transition={{
            x: { duration: p.duration, delay: p.delay, ease: "easeOut" },
            y: { duration: p.duration, delay: p.delay, ease: "easeOut" },
            // Position/scale race ahead on their own easeOut curve; opacity
            // is a separate keyframe track that stays lit until 0.6 of the
            // flight (by when x/y have carried it clear of the card), then
            // fades — instead of dissolving in lockstep with the outward
            // motion and disappearing while still behind the card.
            opacity: { duration: p.duration, delay: p.delay, times: [0, 0.6, 1] },
            scale: { duration: p.duration, delay: p.delay, times: [0, 0.6, 1] },
          }}
          className="absolute -translate-x-1/2 -translate-y-1/2"
        >
          {p.Icon ? (
            <p.Icon size={p.size} color={p.color} fill={p.color} />
          ) : (
            <span
              className="block rounded-full"
              style={{ width: p.size, height: p.size, backgroundColor: p.color }}
            />
          )}
        </motion.span>
      ))}
    </div>
  );
}
