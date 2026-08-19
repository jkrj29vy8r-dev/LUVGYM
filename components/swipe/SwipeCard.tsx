"use client";

import { forwardRef, useImperativeHandle, useState, useCallback } from "react";
import type { PointerEvent as ReactPointerEvent, ComponentProps } from "react";
import {
  motion,
  useMotionValue,
  useTransform,
  useSpring,
  useAnimation,
  useMotionTemplate,
} from "framer-motion";
import { Clock, Dumbbell, Heart, MapPin, Sparkles, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { getFallbackGradient, getInitials } from "@/lib/avatar";
import type { Profile } from "@/lib/auth/AuthProvider";
import type { SwipeDirection } from "./types";

export interface SwipeCardHandle {
  swipe: (direction: SwipeDirection) => void;
}

interface SwipeCardProps {
  profile: Profile;
  isTop: boolean;
  stackIndex: number;
  onSwiped: (direction: SwipeDirection, profile: Profile) => void;
}

const SWIPE_THRESHOLD = 120;
const VELOCITY_THRESHOLD = 500;
const EXIT_DISTANCE_X = 560;
const EXIT_DISTANCE_Y = 460;
const HOVER_SPRING = { stiffness: 220, damping: 22, mass: 0.6 };
const DRAG_TILT_SPRING = { stiffness: 260, damping: 26, mass: 0.7 };
const EXIT_TRANSITION = { duration: 0.45, ease: [0.16, 1, 0.3, 1] as const };
const SNAP_BACK_TRANSITION = { type: "spring" as const, stiffness: 420, damping: 32 };

const modeCopy: Record<
  NonNullable<Profile["looking_for"]>,
  { label: string; icon: typeof Dumbbell; className: string }
> = {
  GYM_BUDDY: {
    label: "Looking for Gym Buddy",
    icon: Dumbbell,
    className: "border-energy/40 bg-energy/15 text-energy-100 shadow-glow-energy-sm",
  },
  DATING: {
    label: "Open for Dating",
    icon: Heart,
    className: "border-love/40 bg-love/15 text-love-100 shadow-glow-love-sm",
  },
  BOTH: {
    label: "Open to Both",
    icon: Sparkles,
    className: "border-white/25 bg-love-energy-gradient text-white shadow-glow-love-sm",
  },
};

export const SwipeCard = forwardRef<SwipeCardHandle, SwipeCardProps>(function SwipeCard(
  { profile, isTop, stackIndex, onSwiped },
  ref
) {
  const [isDragging, setIsDragging] = useState(false);
  const controls = useAnimation();

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const pointerX = useMotionValue(0.5);
  const pointerY = useMotionValue(0.5);

  const hoverRotateY = useSpring(useTransform(pointerX, [0, 1], [-14, 14]), HOVER_SPRING);
  const hoverRotateX = useSpring(useTransform(pointerY, [0, 1], [12, -12]), HOVER_SPRING);
  const dragRotateY = useSpring(useTransform(x, [-320, 0, 320], [26, 0, -26]), DRAG_TILT_SPRING);
  const dragRotateX = useSpring(useTransform(y, [-260, 0, 260], [-10, 0, 10]), DRAG_TILT_SPRING);

  const rotateY = useTransform<number, number>([dragRotateY, hoverRotateY], ([d, h]) => d + h);
  const rotateX = useTransform<number, number>([dragRotateX, hoverRotateX], ([d, h]) => d + h);

  // Shadow drifts opposite the tilt, as if catching a fixed overhead light —
  // the depth cue that sells the Vision-Pro-style "physical glass" feel.
  const shadowX = useTransform(rotateY, [-30, 30], [24, -24]);
  const shadowY = useTransform(rotateX, [-30, 30], [-18, 18]);
  const modeGlow = profile.looking_for === "GYM_BUDDY" ? "0,242,254" : "255,42,95";
  const boxShadow = useMotionTemplate`${shadowX}px ${shadowY}px 45px -12px rgba(0,0,0,0.6), 0 22px 60px -20px rgba(${modeGlow},0.35)`;

  const likeOpacity = useTransform(x, [40, 150], [0, 1]);
  const passOpacity = useTransform(x, [-150, -40], [1, 0]);
  const superOpacity = useTransform(y, [-150, -40], [1, 0]);

  const triggerSwipe = useCallback(
    async (direction: SwipeDirection) => {
      const target =
        direction === "left"
          ? { x: -EXIT_DISTANCE_X, y: 80 }
          : direction === "right"
            ? { x: EXIT_DISTANCE_X, y: 80 }
            : { x: 0, y: -EXIT_DISTANCE_Y };

      await controls.start({ ...target, opacity: 0, transition: EXIT_TRANSITION });
      onSwiped(direction, profile);
    },
    [controls, onSwiped, profile]
  );

  useImperativeHandle(ref, () => ({ swipe: triggerSwipe }), [triggerSwipe]);

  const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!isTop || isDragging) return;
    const rect = event.currentTarget.getBoundingClientRect();
    pointerX.set((event.clientX - rect.left) / rect.width);
    pointerY.set((event.clientY - rect.top) / rect.height);
  };

  const handlePointerLeave = () => {
    pointerX.set(0.5);
    pointerY.set(0.5);
  };

  const handleDragStart = () => {
    setIsDragging(true);
    pointerX.set(0.5);
    pointerY.set(0.5);
  };

  const handleDragEnd: ComponentProps<typeof motion.div>["onDragEnd"] = (_event, info) => {
    setIsDragging(false);
    const { offset, velocity } = info;

    if (Math.abs(offset.x) > Math.abs(offset.y)) {
      if (offset.x > SWIPE_THRESHOLD || velocity.x > VELOCITY_THRESHOLD) {
        void triggerSwipe("right");
        return;
      }
      if (offset.x < -SWIPE_THRESHOLD || velocity.x < -VELOCITY_THRESHOLD) {
        void triggerSwipe("left");
        return;
      }
    } else if (offset.y < -SWIPE_THRESHOLD || velocity.y < -VELOCITY_THRESHOLD) {
      void triggerSwipe("up");
      return;
    }

    controls.start({ x: 0, y: 0, transition: SNAP_BACK_TRANSITION });
  };

  const mode = profile.looking_for ? modeCopy[profile.looking_for] : null;
  const initials = getInitials(profile.full_name);
  const fallbackGradient = getFallbackGradient(profile.id);

  return (
    <motion.div
      className="absolute inset-0"
      style={{ zIndex: 20 - stackIndex }}
      initial={{
        scale: 1 - (stackIndex + 1) * 0.05,
        y: (stackIndex + 1) * 28,
        opacity: 0,
      }}
      animate={{
        // translateY is deliberately larger than the center-anchored scale's
        // own shrinkage, so each card behind peeks out below the one in
        // front instead of shrinking entirely inside its silhouette.
        scale: 1 - stackIndex * 0.05,
        y: stackIndex * 28,
        opacity: stackIndex > 2 ? 0 : 1,
      }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <motion.div
        drag={isTop}
        dragElastic={0.6}
        dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        animate={controls}
        style={{
          x,
          y,
          rotateX,
          rotateY,
          boxShadow,
          transformPerspective: 1000,
          touchAction: "none",
        }}
        whileHover={isTop ? { scale: 1.015 } : undefined}
        className={cn(
          "glass-surface relative h-full w-full select-none overflow-hidden rounded-4xl",
          isTop ? "cursor-grab active:cursor-grabbing" : "pointer-events-none"
        )}
      >
        {/* Photo layer — a real upload if present, otherwise a deterministic gradient */}
        <div className="absolute inset-0">
          {profile.avatar_url ? (
            // eslint-disable-next-line @next/next/no-img-element -- arbitrary remote/user-uploaded URL, fills a non-Image layout
            <img src={profile.avatar_url} alt="" className="h-full w-full object-cover" />
          ) : (
            <div className="absolute inset-0" style={{ background: fallbackGradient }}>
              <div className="absolute inset-0 bg-noise opacity-40 mix-blend-overlay" />
              <div className="absolute inset-0 flex items-center justify-center text-[9rem] font-bold text-white/10">
                {initials}
              </div>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/10 to-black/30" />
        </div>

        {/* Depth-popped content layer */}
        <div
          className="absolute inset-0 flex flex-col justify-between p-5"
          style={{ transform: "translateZ(40px)" }}
        >
          {/* Mode badge */}
          <div className="flex items-start justify-between">
            {mode && (
              <span
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-semibold backdrop-blur-xl",
                  mode.className
                )}
              >
                <mode.icon size={14} />
                {mode.label}
              </span>
            )}
          </div>

          {/* LIKE / PASS / SUPER LIKE stamps */}
          <motion.div
            style={{ opacity: likeOpacity }}
            className="pointer-events-none absolute left-6 top-24 -rotate-12 rounded-xl border-4 border-energy px-3 py-1 text-2xl font-black uppercase tracking-wider text-energy shadow-glow-energy"
          >
            Like
          </motion.div>
          <motion.div
            style={{ opacity: passOpacity }}
            className="pointer-events-none absolute right-6 top-24 rotate-12 rounded-xl border-4 border-obsidian-100 px-3 py-1 text-2xl font-black uppercase tracking-wider text-obsidian-100"
          >
            Pass
          </motion.div>
          <motion.div
            style={{ opacity: superOpacity }}
            className="pointer-events-none absolute left-1/2 top-16 -translate-x-1/2 rounded-xl border-4 border-energy px-3 py-1 text-xl font-black uppercase tracking-wider text-energy shadow-glow-energy"
          >
            Super Like
          </motion.div>

          {/* Identity + fitness badges */}
          <div>
            <h3 className="text-2xl font-bold text-white">{profile.full_name || "Anonymous"}</h3>
            {profile.bio && <p className="mt-1 text-sm text-white/80">{profile.bio}</p>}

            <div className="mt-3.5 flex flex-wrap gap-1.5">
              {profile.gym_chain && <InfoBadge icon={MapPin}>{profile.gym_chain}</InfoBadge>}
              {profile.workout_type && <InfoBadge icon={Zap}>{profile.workout_type}</InfoBadge>}
              {profile.preferred_schedule && (
                <InfoBadge icon={Clock}>{profile.preferred_schedule}</InfoBadge>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
});

function InfoBadge({ icon: Icon, children }: { icon: typeof MapPin; children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-black/30 px-2.5 py-1 text-[11px] font-medium text-white/90 backdrop-blur-xl">
      <Icon size={12} />
      {children}
    </span>
  );
}
