"use client";

import { useCallback, useRef, useState } from "react";
import { motion } from "framer-motion";
import { RotateCcw, Sparkles } from "lucide-react";
import { SAMPLE_PROFILES } from "./data";
import { MatchModal } from "./MatchModal";
import { SwipeCard, type SwipeCardHandle } from "./SwipeCard";
import { SwipeControls } from "./SwipeControls";
import type { SwipeDirection, SwipeProfile } from "./types";

const VISIBLE_STACK_SIZE = 3;

export function SwipeDeck() {
  const [profiles, setProfiles] = useState<SwipeProfile[]>(SAMPLE_PROFILES);
  const [matchedProfile, setMatchedProfile] = useState<SwipeProfile | null>(null);
  const topCardRef = useRef<SwipeCardHandle>(null);

  const visible = profiles.slice(0, VISIBLE_STACK_SIZE);
  const hasCards = visible.length > 0;

  const handleSwiped = useCallback((direction: SwipeDirection, profile: SwipeProfile) => {
    setProfiles((prev) => prev.filter((p) => p.id !== profile.id));
    if (direction !== "left" && profile.guaranteedMatch) {
      setMatchedProfile(profile);
    }
  }, []);

  const handleReset = useCallback(() => {
    setProfiles(SAMPLE_PROFILES);
  }, []);

  const closeMatch = useCallback(() => setMatchedProfile(null), []);

  return (
    <div className="flex flex-col items-center">
      <div className="relative h-[600px] w-full max-w-sm">
        {hasCards ? (
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
              onClick={handleReset}
              className="focus-ring mt-2 inline-flex items-center gap-2 rounded-full border border-glass-border bg-glass-surface px-5 py-2.5 text-sm font-medium text-white transition-colors hover:border-love/40"
            >
              <RotateCcw size={15} />
              Start Over
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

      <MatchModal
        profile={matchedProfile}
        onClose={closeMatch}
        onSendMessage={closeMatch}
        onProposeSession={closeMatch}
      />
    </div>
  );
}
