"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Loader2, MessagesSquare } from "lucide-react";
import { useAuth, type Profile } from "@/lib/auth/AuthProvider";
import { createClient } from "@/lib/supabase/client";
import { getFallbackGradient, getInitials } from "@/lib/avatar";
import { MessageBubble } from "./MessageBubble";
import { ChatComposer } from "./ChatComposer";
import type { Message, WorkoutDetails } from "./types";

interface ChatThreadProps {
  matchId: string;
  autoOpenWorkoutComposer?: boolean;
}

export function ChatThread({ matchId, autoOpenWorkoutComposer }: ChatThreadProps) {
  const { user, loading: authLoading } = useAuth();
  const supabase = useMemo(() => createClient(), []);

  const [otherProfile, setOtherProfile] = useState<Profile | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [respondingId, setRespondingId] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      if (!user) {
        setLoading(false);
        return;
      }

      setLoading(true);
      const { data: match } = await supabase
        .from("matches")
        .select(
          "id, user_1, user_2, profile_1:profiles!matches_user_1_fkey(*), profile_2:profiles!matches_user_2_fkey(*)"
        )
        .eq("id", matchId)
        .maybeSingle();

      if (!match) {
        if (!cancelled) {
          setNotFound(true);
          setLoading(false);
        }
        return;
      }

      const other = (match.user_1 === user.id ? match.profile_2 : match.profile_1) as Profile;

      const { data: history } = await supabase
        .from("messages")
        .select("*")
        .eq("match_id", matchId)
        .order("created_at", { ascending: true });

      if (!cancelled) {
        setOtherProfile(other);
        setMessages(history ?? []);
        setLoading(false);
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, [user, supabase, matchId]);

  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel(`messages:${matchId}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages", filter: `match_id=eq.${matchId}` },
        (payload) => {
          const incoming = payload.new as Message;
          setMessages((prev) => (prev.some((m) => m.id === incoming.id) ? prev : [...prev, incoming]));
        }
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "messages", filter: `match_id=eq.${matchId}` },
        (payload) => {
          const updated = payload.new as Message;
          setMessages((prev) => prev.map((m) => (m.id === updated.id ? updated : m)));
        }
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [user, supabase, matchId]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages.length]);

  const sendText = useCallback(
    async (text: string) => {
      if (!user) return;
      await supabase.from("messages").insert({ match_id: matchId, sender_id: user.id, text });
    },
    [supabase, matchId, user]
  );

  const sendInvite = useCallback(
    async (details: { date: string; time: string; location: string }) => {
      if (!user) return;
      await supabase.from("messages").insert({
        match_id: matchId,
        sender_id: user.id,
        is_workout_invite: true,
        workout_details: { ...details, status: "pending" },
      });
    },
    [supabase, matchId, user]
  );

  const respondToInvite = useCallback(
    async (message: Message, status: "accepted" | "declined") => {
      const existing = message.workout_details as unknown as WorkoutDetails | null;
      if (!existing) return;
      setRespondingId(message.id);
      await supabase
        .from("messages")
        .update({ workout_details: { ...existing, status } })
        .eq("id", message.id);
      setRespondingId(null);
    },
    [supabase]
  );

  if (authLoading || loading) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <Loader2 size={20} className="animate-spin text-obsidian-400" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-1 items-center justify-center p-8 text-center text-sm text-obsidian-400">
        Sign in to view this conversation.
      </div>
    );
  }

  if (notFound || !otherProfile) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-3 p-8 text-center">
        <MessagesSquare size={24} className="text-obsidian-400" />
        <p className="text-sm text-obsidian-300">This conversation doesn&apos;t exist.</p>
        <Link
          href="/matches"
          className="focus-ring rounded-full border border-glass-border px-3.5 py-1.5 text-xs font-medium text-white hover:border-love/40"
        >
          Back to matches
        </Link>
      </div>
    );
  }

  const initials = getInitials(otherProfile.full_name);

  return (
    <>
      <div className="flex items-center gap-3 border-b border-glass-border px-5 py-3.5">
        <Link
          href="/matches"
          aria-label="Back to matches"
          className="focus-ring flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-obsidian-300 hover:bg-white/5 hover:text-white sm:hidden"
        >
          <ArrowLeft size={16} />
        </Link>
        <div className="h-9 w-9 shrink-0 overflow-hidden rounded-full">
          {otherProfile.avatar_url ? (
            // eslint-disable-next-line @next/next/no-img-element -- user-uploaded, arbitrary remote URL
            <img src={otherProfile.avatar_url} alt="" className="h-full w-full object-cover" />
          ) : (
            <div
              className="flex h-full w-full items-center justify-center text-xs font-semibold text-white"
              style={{ background: getFallbackGradient(otherProfile.id) }}
            >
              {initials}
            </div>
          )}
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-white">
            {otherProfile.full_name || "New match"}
          </p>
          {otherProfile.gym_chain && (
            <p className="truncate text-xs text-obsidian-400">{otherProfile.gym_chain}</p>
          )}
        </div>
      </div>

      <div ref={scrollRef} className="min-h-0 flex-1 overflow-y-auto px-5 py-4">
        {messages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center gap-2 text-center">
            <p className="text-sm font-medium text-white">
              You matched with {otherProfile.full_name || "each other"}!
            </p>
            <p className="text-xs text-obsidian-400">
              Say hi, or propose a workout session to break the ice.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {messages.map((message) => (
              <MessageBubble
                key={message.id}
                message={message}
                isOwn={message.sender_id === user.id}
                responding={respondingId === message.id}
                onRespondToInvite={(status) => void respondToInvite(message, status)}
              />
            ))}
          </div>
        )}
      </div>

      <ChatComposer
        onSendText={(text) => void sendText(text)}
        onSendInvite={(details) => void sendInvite(details)}
        autoOpenWorkoutComposer={autoOpenWorkoutComposer}
      />
    </>
  );
}
