"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Loader2, LogIn, RotateCcw, Sparkles } from "lucide-react";
import { useAuth, type Profile } from "@/lib/auth/AuthProvider";
import { useAuthModal } from "@/components/auth/AuthModalProvider";
import { createClient } from "@/lib/supabase/client";
import type { Database } from "@/lib/supabase/database.types";
import { MatchModal } from "./MatchModal";
import { SwipeCard, type SwipeCardHandle } from "./SwipeCard";
import { SwipeControls } from "./SwipeControls";
import type { SwipeDirection } from "./types";

const VISIBLE_STACK_SIZE = 3;
const PROFILES_PER_PAGE = 20;

type SwipeRow = Database["public"]["Enums"]["swipe_direction"];

const toDbDirection: Record<SwipeDirection, SwipeRow> = {
  left: "pass",
  right: "like",
  up: "super_like",
};

export function SwipeDeck() {
  const { user, loading: authLoading } = useAuth();
  const { openAuthModal } = useAuthModal();
  const supabase = useMemo(() => createClient(), []);

  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loadingProfiles, setLoadingProfiles] = useState(true);
  const [match, setMatch] = useState<{ profile: Profile; matchId: string } | null>(null);
  const topCardRef = useRef<SwipeCardHandle>(null);

  const loadProfiles = useCallback(async () => {
    if (!user) return;
    setLoadingProfiles(true);

    const { data: swiped } = await supabase
      .from("swipes")
      .select("swiped_id")
      .eq("swiper_id", user.id);
    const swipedIds = (swiped ?? []).map((row) => row.swiped_id);

    let query = supabase
      .from("profiles")
      .select("*")
      .neq("id", user.id)
      .limit(PROFILES_PER_PAGE);
    if (swipedIds.length > 0) {
      query = query.not("id", "in", `(${swipedIds.join(",")})`);
    }

    const { data } = await query;
    setProfiles(data ?? []);
    setLoadingProfiles(false);
  }, [user, supabase]);

  useEffect(() => {
    async function run() {
      if (user) await loadProfiles();
    }
    void run();
  }, [user, loadProfiles]);

  const visible = profiles.slice(0, VISIBLE_STACK_SIZE);
  const hasCards = visible.length > 0;

  const handleSwiped = useCallback(
    async (direction: SwipeDirection, profile: Profile) => {
      setProfiles((prev) => prev.filter((p) => p.id !== profile.id));

      const { data, error } = await supabase.rpc("record_swipe", {
        p_swiped_id: profile.id,
        p_direction: toDbDirection[direction],
      });

      const result = data?.[0];
      if (!error && result?.matched && result.match_id) {
        setMatch({ profile, matchId: result.match_id });
      }
    },
    [supabase]
  );

  const closeMatch = useCallback(() => setMatch(null), []);

  if (authLoading) {
    return (
      <div className="flex h-[600px] w-full max-w-sm items-center justify-center">
        <Loader2 size={24} className="animate-spin text-obsidian-400" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="glass-panel flex h-[420px] w-full max-w-sm flex-col items-center justify-center gap-4 p-8 text-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-love/10 text-love">
          <LogIn size={24} />
        </span>
        <div>
          <p className="text-lg font-semibold text-white">Sign in to start swiping</p>
          <p className="mt-1 text-sm text-obsidian-300">
            Create a free account to see gym buddies and matches near you.
          </p>
        </div>
        <button
          onClick={openAuthModal}
          className="focus-ring mt-2 inline-flex items-center gap-2 rounded-full bg-love-energy-gradient px-5 py-2.5 text-sm font-medium text-white shadow-glow-love-sm transition-shadow hover:shadow-glow-love"
        >
          Sign In / Sign Up
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center">
      <div className="relative h-[600px] w-full max-w-sm">
        {loadingProfiles ? (
          <div className="glass-panel flex h-full w-full items-center justify-center">
            <Loader2 size={24} className="animate-spin text-obsidian-400" />
          </div>
        ) : hasCards ? (
          visible.map((profile, index) => (
            <SwipeCard
              key={profile.id}
              ref={index === 0 ? topCardRef : undefined}
              profile={profile}
              isTop={index === 0}
              stackIndex={index}
              onSwiped={handleSwiped}
            />
          ))
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-panel flex h-full w-full flex-col items-center justify-center gap-4 p-8 text-center"
          >
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-love/10 text-love">
              <Sparkles size={24} />
            </span>
            <div>
              <p className="text-lg font-semibold text-white">You&apos;re all caught up</p>
              <p className="mt-1 text-sm text-obsidian-300">
                Check back soon for new gym buddies and matches nearby.
              </p>
            </div>
            <button
              onClick={() => void loadProfiles()}
              className="focus-ring mt-2 inline-flex items-center gap-2 rounded-full border border-glass-border bg-glass-surface px-5 py-2.5 text-sm font-medium text-white transition-colors hover:border-love/40"
            >
              <RotateCcw size={15} />
              Check Again
            </button>
          </motion.div>
        )}
      </div>

      <div className="mt-14">
        <SwipeControls
          disabled={!hasCards}
          onPass={() => topCardRef.current?.swipe("left")}
          onSuperLike={() => topCardRef.current?.swipe("up")}
          onLike={() => topCardRef.current?.swipe("right")}
        />
      </div>

      <MatchModal profile={match?.profile ?? null} matchId={match?.matchId ?? null} onClose={closeMatch} />
    </div>
  );
}
