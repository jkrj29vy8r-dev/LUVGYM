"use client";

import { Calendar, Check, Clock, Dumbbell, Loader2, MapPin, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Message, WorkoutDetails } from "./types";

interface WorkoutInviteCardProps {
  message: Message;
  isOwn: boolean;
  onRespond: (status: "accepted" | "declined") => void;
  responding: boolean;
}

export function WorkoutInviteCard({ message, isOwn, onRespond, responding }: WorkoutInviteCardProps) {
  const details = message.workout_details as unknown as WorkoutDetails | null;
  if (!details) return null;

  const status = details.status;
  const isPending = status === "pending";

  return (
    <div
      className={cn(
        "w-full max-w-[280px] overflow-hidden rounded-2xl border backdrop-blur-xl",
        isPending && "border-love/40 bg-love/10",
        status === "accepted" && "border-energy/40 bg-energy/10",
        status === "declined" && "border-white/10 bg-white/5 opacity-70"
      )}
    >
      <div className="flex items-center gap-2 border-b border-white/10 px-4 py-2.5">
        <span
          className={cn(
            "flex h-6 w-6 shrink-0 items-center justify-center rounded-full",
            isPending && "bg-love/20 text-love",
            status === "accepted" && "bg-energy/20 text-energy",
            status === "declined" && "bg-white/10 text-obsidian-400"
          )}
        >
          <Dumbbell size={13} />
        </span>
        <span className="text-xs font-semibold text-white">Workout Invite</span>
      </div>

      <div className="flex flex-col gap-1.5 px-4 py-3 text-xs text-obsidian-200">
        <InviteRow icon={Calendar}>{details.date}</InviteRow>
        <InviteRow icon={Clock}>{details.time}</InviteRow>
        <InviteRow icon={MapPin}>{details.location}</InviteRow>
      </div>

      <div className="px-4 pb-3.5">
        {isPending && !isOwn && (
          <div className="flex gap-2">
            <button
              onClick={() => onRespond("declined")}
              disabled={responding}
              className="focus-ring flex flex-1 items-center justify-center gap-1.5 rounded-full border border-white/15 py-1.5 text-xs font-medium text-obsidian-200 transition-colors hover:border-white/30 hover:text-white disabled:opacity-50"
            >
              <X size={13} /> Decline
            </button>
            <button
              onClick={() => onRespond("accepted")}
              disabled={responding}
              className="focus-ring flex flex-1 items-center justify-center gap-1.5 rounded-full bg-love-energy-gradient py-1.5 text-xs font-semibold text-white shadow-glow-love-sm transition-transform hover:scale-[1.02] disabled:opacity-50"
            >
              {responding ? <Loader2 size={13} className="animate-spin" /> : <Check size={13} />}
              Accept
            </button>
          </div>
        )}
        {isPending && isOwn && (
          <p className="text-center text-[11px] text-obsidian-400">Waiting for response…</p>
        )}
        {status === "accepted" && (
          <p className="flex items-center justify-center gap-1.5 text-[11px] font-medium text-energy">
            <Check size={12} /> Workout confirmed
          </p>
        )}
        {status === "declined" && (
          <p className="text-center text-[11px] text-obsidian-400">Invite declined</p>
        )}
      </div>
    </div>
  );
}

function InviteRow({ icon: Icon, children }: { icon: typeof Calendar; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2">
      <Icon size={12} className="shrink-0 text-obsidian-400" />
      <span>{children}</span>
    </div>
  );
}
