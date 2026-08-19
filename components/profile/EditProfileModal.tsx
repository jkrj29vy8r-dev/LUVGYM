"use client";

import { useMemo, useRef, useState } from "react";
import type { FormEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Camera, Dumbbell, Heart, Loader2, Sparkles, X } from "lucide-react";
import { useAuth } from "@/lib/auth/AuthProvider";
import { createClient } from "@/lib/supabase/client";
import { getFallbackGradient, getInitials } from "@/lib/avatar";
import { RippleButton } from "@/components/ui/RippleButton";
import { cn } from "@/lib/utils";
import type { Database } from "@/lib/supabase/database.types";

interface EditProfileModalProps {
  open: boolean;
  onClose: () => void;
}

type LookingFor = Database["public"]["Enums"]["looking_for_type"];

const LOOKING_FOR_OPTIONS: { value: LookingFor; label: string; icon: typeof Heart }[] = [
  { value: "GYM_BUDDY", label: "Gym Buddy", icon: Dumbbell },
  { value: "DATING", label: "Dating", icon: Heart },
  { value: "BOTH", label: "Both", icon: Sparkles },
];

export function EditProfileModal({ open, onClose }: EditProfileModalProps) {
  const { user, profile, refreshProfile } = useAuth();
  const supabase = useMemo(() => createClient(), []);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [fullName, setFullName] = useState(profile?.full_name ?? "");
  const [bio, setBio] = useState(profile?.bio ?? "");
  const [gymChain, setGymChain] = useState(profile?.gym_chain ?? "");
  const [workoutType, setWorkoutType] = useState(profile?.workout_type ?? "");
  const [lookingFor, setLookingFor] = useState<LookingFor | null>(profile?.looking_for ?? null);
  const [preferredSchedule, setPreferredSchedule] = useState(profile?.preferred_schedule ?? "");
  const [avatarUrl, setAvatarUrl] = useState(profile?.avatar_url ?? null);

  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Re-seed local form state whenever the modal opens with the latest profile.
  const [seededFor, setSeededFor] = useState<string | null>(null);
  if (open && profile && seededFor !== profile.id) {
    setFullName(profile.full_name ?? "");
    setBio(profile.bio ?? "");
    setGymChain(profile.gym_chain ?? "");
    setWorkoutType(profile.workout_type ?? "");
    setLookingFor(profile.looking_for);
    setPreferredSchedule(profile.preferred_schedule ?? "");
    setAvatarUrl(profile.avatar_url);
    setSeededFor(profile.id);
  }

  if (!user) return null;

  const handleAvatarChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setError(null);
    setUploading(true);

    const ext = file.name.split(".").pop() ?? "jpg";
    const path = `${user.id}/avatar-${Date.now()}.${ext}`;
    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(path, file, { upsert: true, cacheControl: "3600" });

    if (uploadError) {
      setError(uploadError.message);
      setUploading(false);
      return;
    }

    const { data } = supabase.storage.from("avatars").getPublicUrl(path);
    setAvatarUrl(data.publicUrl);
    setUploading(false);
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    setSaving(true);

    const { error: updateError } = await supabase
      .from("profiles")
      .update({
        full_name: fullName.trim() || null,
        bio: bio.trim() || null,
        gym_chain: gymChain.trim() || null,
        workout_type: workoutType.trim() || null,
        looking_for: lookingFor,
        preferred_schedule: preferredSchedule.trim() || null,
        avatar_url: avatarUrl,
      })
      .eq("id", user.id);

    setSaving(false);

    if (updateError) {
      setError(updateError.message);
      return;
    }

    await refreshProfile();
    onClose();
  };

  const initials = getInitials(fullName || profile?.full_name);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="edit-profile-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label="Edit profile"
          className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-obsidian-950/85 p-6 backdrop-blur-md"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 8 }}
            transition={{ type: "spring", stiffness: 340, damping: 28 }}
            onClick={(event) => event.stopPropagation()}
            className="glass-panel relative my-auto w-full max-w-md p-8"
          >
            <button
              onClick={onClose}
              aria-label="Close"
              className="focus-ring absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full text-obsidian-300 transition-colors hover:bg-white/5 hover:text-white"
            >
              <X size={16} />
            </button>

            <h2 className="text-lg font-bold text-white">Edit Profile</h2>
            <p className="text-xs text-obsidian-400">
              This is what gym buddies and matches will see.
            </p>

            <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
              {/* Avatar */}
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  aria-label="Change avatar"
                  className="focus-ring group relative h-16 w-16 shrink-0 overflow-hidden rounded-full ring-2 ring-white/10"
                >
                  {avatarUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element -- user-uploaded, arbitrary remote URL
                    <img src={avatarUrl} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <div
                      className="flex h-full w-full items-center justify-center text-base font-semibold text-white"
                      style={{ background: getFallbackGradient(user.id) }}
                    >
                      {initials}
                    </div>
                  )}
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                    {uploading ? (
                      <Loader2 size={16} className="animate-spin text-white" />
                    ) : (
                      <Camera size={16} className="text-white" />
                    )}
                  </div>
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                />
                <p className="text-xs text-obsidian-400">
                  Click the avatar to upload a photo.
                </p>
              </div>

              <TextField label="Full name" value={fullName} onChange={setFullName} placeholder="Alex Kane" />
              <TextArea label="Bio" value={bio} onChange={setBio} placeholder="PR on deadlifts last week..." />

              <div className="grid grid-cols-2 gap-3">
                <TextField label="Gym / chain" value={gymChain} onChange={setGymChain} placeholder="World Class" />
                <TextField label="Workout focus" value={workoutType} onChange={setWorkoutType} placeholder="Crossfit" />
              </div>

              <TextField
                label="Preferred schedule"
                value={preferredSchedule}
                onChange={setPreferredSchedule}
                placeholder="Mornings, 7–9am"
              />

              <div>
                <span className="mb-1.5 block text-xs font-medium text-obsidian-300">Looking for</span>
                <div className="grid grid-cols-3 gap-2">
                  {LOOKING_FOR_OPTIONS.map(({ value, label, icon: Icon }) => {
                    const isActive = lookingFor === value;
                    return (
                      <button
                        key={value}
                        type="button"
                        onClick={() => setLookingFor(value)}
                        className={cn(
                          "focus-ring flex flex-col items-center gap-1.5 rounded-2xl border px-2 py-3 text-xs font-medium transition-colors",
                          isActive
                            ? "border-love/50 bg-love/10 text-white shadow-glow-love-sm"
                            : "border-glass-border text-obsidian-300 hover:border-white/20"
                        )}
                      >
                        <Icon size={16} className={isActive ? "text-love" : undefined} />
                        {label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {error && <p className="text-xs text-love-300">{error}</p>}

              <RippleButton type="submit" theme="crimson" disabled={saving} className="mt-2 justify-center">
                {saving ? <Loader2 size={16} className="animate-spin" /> : "Save Changes"}
              </RippleButton>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function TextField({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-obsidian-300">{label}</span>
      <input
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="w-full rounded-2xl border border-glass-border bg-black/20 px-3.5 py-2.5 text-sm text-white placeholder:text-obsidian-500 transition-colors focus:border-love/40 focus:outline-none"
      />
    </label>
  );
}

function TextArea({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-obsidian-300">{label}</span>
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        rows={3}
        className="w-full resize-none rounded-2xl border border-glass-border bg-black/20 px-3.5 py-2.5 text-sm text-white placeholder:text-obsidian-500 transition-colors focus:border-love/40 focus:outline-none"
      />
    </label>
  );
}
