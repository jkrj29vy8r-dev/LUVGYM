"use client";

import { cn } from "@/lib/utils";
import { formatClockTime } from "@/lib/time";
import { WorkoutInviteCard } from "./WorkoutInviteCard";
import type { Message } from "./types";

interface MessageBubbleProps {
  message: Message;
  isOwn: boolean;
  onRespondToInvite: (status: "accepted" | "declined") => void;
  responding: boolean;
}

export function MessageBubble({ message, isOwn, onRespondToInvite, responding }: MessageBubbleProps) {
  return (
    <div className={cn("flex flex-col", isOwn ? "items-end" : "items-start")}>
      {message.is_workout_invite ? (
        <WorkoutInviteCard
          message={message}
          isOwn={isOwn}
          onRespond={onRespondToInvite}
          responding={responding}
        />
      ) : (
        <div
          className={cn(
            "max-w-[75%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed",
            isOwn
              ? "rounded-br-md bg-love-energy-gradient text-white"
              : "rounded-bl-md border border-glass-border bg-white/[0.04] text-obsidian-100"
          )}
        >
          {message.text}
        </div>
      )}
      <span className="mt-1 px-1 text-[10px] text-obsidian-500">
        {formatClockTime(message.created_at)}
      </span>
    </div>
  );
}
