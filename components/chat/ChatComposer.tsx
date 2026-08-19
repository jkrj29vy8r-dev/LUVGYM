"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUp, Calendar, Clock, Dumbbell, MapPin, X } from "lucide-react";

interface ChatComposerProps {
  onSendText: (text: string) => void;
  onSendInvite: (details: { date: string; time: string; location: string }) => void;
  autoOpenWorkoutComposer?: boolean;
}

export function ChatComposer({ onSendText, onSendInvite, autoOpenWorkoutComposer }: ChatComposerProps) {
  const [mode, setMode] = useState<"text" | "invite">(autoOpenWorkoutComposer ? "invite" : "text");
  const [text, setText] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [location, setLocation] = useState("");

  const handleTextSubmit = (event: FormEvent) => {
    event.preventDefault();
    const trimmed = text.trim();
    if (!trimmed) return;
    onSendText(trimmed);
    setText("");
  };

  const handleInviteSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!date.trim() || !time.trim() || !location.trim()) return;
    onSendInvite({ date: date.trim(), time: time.trim(), location: location.trim() });
    setDate("");
    setTime("");
    setLocation("");
    setMode("text");
  };

  return (
    <div className="border-t border-glass-border p-4">
      <AnimatePresence mode="wait">
        {mode === "text" ? (
          <motion.form
            key="text"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.15 }}
            onSubmit={handleTextSubmit}
            className="flex items-center gap-2"
          >
            <button
              type="button"
              onClick={() => setMode("invite")}
              aria-label="Propose a workout"
              className="focus-ring flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-glass-border text-obsidian-300 transition-colors hover:border-energy/40 hover:text-energy"
            >
              <Dumbbell size={16} />
            </button>
            <input
              value={text}
              onChange={(event) => setText(event.target.value)}
              placeholder="Message..."
              className="min-w-0 flex-1 rounded-full border border-glass-border bg-black/20 px-4 py-2.5 text-sm text-white placeholder:text-obsidian-500 focus:border-love/40 focus:outline-none"
            />
            <button
              type="submit"
              disabled={!text.trim()}
              aria-label="Send"
              className="focus-ring flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-love-energy-gradient text-white shadow-glow-love-sm transition-transform hover:scale-105 disabled:opacity-40 disabled:hover:scale-100"
            >
              <ArrowUp size={16} />
            </button>
          </motion.form>
        ) : (
          <motion.form
            key="invite"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.15 }}
            onSubmit={handleInviteSubmit}
            className="flex flex-col gap-2.5"
          >
            <div className="flex items-center justify-between">
              <p className="flex items-center gap-1.5 text-xs font-semibold text-white">
                <Dumbbell size={13} className="text-energy" /> Propose a workout session
              </p>
              <button
                type="button"
                onClick={() => setMode("text")}
                aria-label="Cancel"
                className="focus-ring flex h-6 w-6 items-center justify-center rounded-full text-obsidian-400 hover:text-white"
              >
                <X size={14} />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <InviteField icon={Calendar} type="date" value={date} onChange={setDate} />
              <InviteField icon={Clock} type="time" value={time} onChange={setTime} />
            </div>
            <InviteField
              icon={MapPin}
              type="text"
              value={location}
              onChange={setLocation}
              placeholder="Gym / location"
            />
            <button
              type="submit"
              disabled={!date.trim() || !time.trim() || !location.trim()}
              className="focus-ring mt-1 flex items-center justify-center gap-2 rounded-full bg-love-energy-gradient py-2.5 text-sm font-semibold text-white shadow-glow-love-sm transition-transform hover:scale-[1.01] disabled:opacity-40 disabled:hover:scale-100"
            >
              Send Invite
            </button>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}

function InviteField({
  icon: Icon,
  type,
  value,
  onChange,
  placeholder,
}: {
  icon: typeof Calendar;
  type: "date" | "time" | "text";
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <label className="flex items-center gap-2 rounded-xl border border-glass-border bg-black/20 px-3 py-2.5">
      <Icon size={13} className="shrink-0 text-obsidian-400" />
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="w-full min-w-0 bg-transparent text-xs text-white placeholder:text-obsidian-500 focus:outline-none [color-scheme:dark]"
      />
    </label>
  );
}
