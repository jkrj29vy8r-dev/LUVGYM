"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Dumbbell, Loader2, LogIn, MessagesSquare } from "lucide-react";
import { useAuth, type Profile } from "@/lib/auth/AuthProvider";
import { useAuthModal } from "@/components/auth/AuthModalProvider";
import { createClient } from "@/lib/supabase/client";
import { getFallbackGradient, getInitials } from "@/lib/avatar";
import { formatRelativeTime } from "@/lib/time";
import { cn } from "@/lib/utils";

interface MatchListItem {
  id: string;
  otherProfile: Profile;
  lastMessage: string | null;
  lastMessageAt: string | null;
  isInvite: boolean;
}

export function MatchesSidebar() {
  const { user, loading: authLoading } = useAuth();
  const { openAuthModal } = useAuthModal();
  const pathname = usePathname();
  const supabase = useMemo(() => createClient(), []);
  const [items, setItems] = useState<MatchListItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      if (!user) {
        setLoading(false);
        return;
      }

      setLoading(true);
      const { data: matches } = await supabase
        .from("matches")
        .select(
          "id, matched_at, user_1, user_2, profile_1:profiles!matches_user_1_fkey(*), profile_2:profiles!matches_user_2_fkey(*)"
        )
        .or(`user_1.eq.${user.id},user_2.eq.${user.id}`)
        .order("matched_at", { ascending: false });

      if (!matches || matches.length === 0) {
        if (!cancelled) setItems([]);
        if (!cancelled) setLoading(false);
        return;
      }

      const matchIds = matches.map((m) => m.id);
      const { data: recentMessages } = await supabase
        .from("messages")
        .select("match_id, text, is_workout_invite, created_at")
        .in("match_id", matchIds)
        .order("created_at", { ascending: false });

      const previewByMatch = new Map<
        string,
        { text: string | null; isInvite: boolean; createdAt: string }
      >();
      for (const message of recentMessages ?? []) {
        if (!previewByMatch.has(message.match_id)) {
          previewByMatch.set(message.match_id, {
            text: message.text,
            isInvite: message.is_workout_invite,
            createdAt: message.created_at,
          });
        }
      }

      const list: MatchListItem[] = matches.map((m) => {
        const otherProfile = (m.user_1 === user.id ? m.profile_2 : m.profile_1) as Profile;
        const preview = previewByMatch.get(m.id);
        return {
          id: m.id,
          otherProfile,
          lastMessage: preview?.text ?? null,
          lastMessageAt: preview?.createdAt ?? m.matched_at,
          isInvite: preview?.isInvite ?? false,
        };
      });

      if (!cancelled) setItems(list);
      if (!cancelled) setLoading(false);
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, [user, supabase]);

  return (
    <aside className="flex w-full max-w-[280px] shrink-0 flex-col border-r border-glass-border sm:max-w-[320px]">
      <div className="border-b border-glass-border px-5 py-4">
        <h1 className="text-base font-bold text-white">Matches</h1>
        <p className="text-xs text-obsidian-400">Your gym buddies &amp; connections</p>
      </div>

      <div className="flex-1 overflow-y-auto">
        {authLoading || loading ? (
          <div className="flex h-32 items-center justify-center">
            <Loader2 size={18} className="animate-spin text-obsidian-400" />
          </div>
        ) : !user ? (
          <div className="flex flex-col items-center gap-3 px-5 py-10 text-center">
            <LogIn size={20} className="text-obsidian-400" />
            <p className="text-xs text-obsidian-400">Sign in to see your matches.</p>
            <button
              onClick={openAuthModal}
              className="focus-ring rounded-full border border-glass-border px-3.5 py-1.5 text-xs font-medium text-white hover:border-love/40"
            >
              Sign In
            </button>
          </div>
        ) : items.length === 0 ? (
          <div className="flex flex-col items-center gap-2 px-5 py-10 text-center">
            <MessagesSquare size={20} className="text-obsidian-400" />
            <p className="text-xs text-obsidian-400">
              No matches yet — go swipe on the Discover page.
            </p>
          </div>
        ) : (
          <ul>
            {items.map((item) => {
              const isActive = pathname === `/matches/${item.id}`;
              const initials = getInitials(item.otherProfile?.full_name);
              return (
                <li key={item.id}>
                  <Link
                    href={`/matches/${item.id}`}
                    className={cn(
                      "flex items-center gap-3 px-5 py-3 transition-colors",
                      isActive ? "bg-white/[0.06]" : "hover:bg-white/[0.03]"
                    )}
                  >
                    <div className="h-11 w-11 shrink-0 overflow-hidden rounded-full">
                      {item.otherProfile?.avatar_url ? (
                        // eslint-disable-next-line @next/next/no-img-element -- user-uploaded, arbitrary remote URL
                        <img
                          src={item.otherProfile.avatar_url}
                          alt=""
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div
                          className="flex h-full w-full items-center justify-center text-xs font-semibold text-white"
                          style={{ background: getFallbackGradient(item.otherProfile?.id ?? item.id) }}
                        >
                          {initials}
                        </div>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <p className="truncate text-sm font-semibold text-white">
                          {item.otherProfile?.full_name || "New match"}
                        </p>
                        {item.lastMessageAt && (
                          <span className="shrink-0 text-[10px] text-obsidian-500">
                            {formatRelativeTime(item.lastMessageAt)}
                          </span>
                        )}
                      </div>
                      <p className="mt-0.5 truncate text-xs text-obsidian-400">
                        {item.isInvite ? (
                          <span className="inline-flex items-center gap-1">
                            <Dumbbell size={11} /> Workout invite
                          </span>
                        ) : (
                          item.lastMessage || "Say hi \u{1F44B}"
                        )}
                      </p>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </aside>
  );
}
