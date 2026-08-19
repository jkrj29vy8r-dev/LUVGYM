"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Heart, Loader2, Lock, Mail, User as UserIcon, X } from "lucide-react";
import { useAuth } from "@/lib/auth/AuthProvider";
import { RippleButton } from "@/components/ui/RippleButton";
import { cn } from "@/lib/utils";

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
}

type Mode = "sign-in" | "sign-up";

export function AuthModal({ open, onClose }: AuthModalProps) {
  const { signInWithPassword, signUpWithPassword } = useAuth();
  const [mode, setMode] = useState<Mode>("sign-in");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [confirmationSent, setConfirmationSent] = useState(false);

  const reset = () => {
    setFullName("");
    setEmail("");
    setPassword("");
    setError(null);
    setConfirmationSent(false);
    setSubmitting(false);
  };

  const handleClose = () => {
    onClose();
    // Delay so the exit animation doesn't visibly flash back to sign-in.
    setTimeout(reset, 200);
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    setSubmitting(true);

    if (mode === "sign-in") {
      const { error: signInError } = await signInWithPassword(email, password);
      if (signInError) setError(signInError);
      else handleClose();
    } else {
      const { error: signUpError, needsEmailConfirmation } = await signUpWithPassword(
        email,
        password,
        fullName
      );
      if (signUpError) setError(signUpError);
      else if (needsEmailConfirmation) setConfirmationSent(true);
      else handleClose();
    }
    setSubmitting(false);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="auth-modal-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={handleClose}
          role="dialog"
          aria-modal="true"
          aria-label={mode === "sign-in" ? "Sign in" : "Create your account"}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-obsidian-950/85 p-6 backdrop-blur-md"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 8 }}
            transition={{ type: "spring", stiffness: 340, damping: 28 }}
            onClick={(event) => event.stopPropagation()}
            className="glass-panel relative w-full max-w-sm p-8"
          >
            <button
              onClick={handleClose}
              aria-label="Close"
              className="focus-ring absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full text-obsidian-300 transition-colors hover:bg-white/5 hover:text-white"
            >
              <X size={16} />
            </button>

            {confirmationSent ? (
              <div className="py-2 text-center">
                <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-energy/10 text-energy">
                  <Mail size={22} />
                </span>
                <h2 className="mt-4 text-xl font-bold text-white">Check your inbox</h2>
                <p className="mt-2 text-sm text-obsidian-300">
                  We sent a confirmation link to <span className="text-white">{email}</span>.
                  Click it to activate your account, then sign in.
                </p>
                <button
                  onClick={handleClose}
                  className="focus-ring mt-6 text-sm font-medium text-love transition-colors hover:text-love-300"
                >
                  Got it
                </button>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-love-energy-gradient text-white">
                    {mode === "sign-in" ? <Lock size={16} /> : <Heart size={16} />}
                  </span>
                  <div>
                    <h2 className="text-lg font-bold text-white">
                      {mode === "sign-in" ? "Welcome back" : "Join LUVGYM"}
                    </h2>
                    <p className="text-xs text-obsidian-400">
                      {mode === "sign-in" ? "Sign in to keep swiping" : "Find your match. Lift your vibe."}
                    </p>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-3.5">
                  {mode === "sign-up" && (
                    <Field
                      icon={UserIcon}
                      label="Full name"
                      type="text"
                      value={fullName}
                      onChange={setFullName}
                      placeholder="Alex Kane"
                      required
                    />
                  )}
                  <Field
                    icon={Mail}
                    label="Email"
                    type="email"
                    value={email}
                    onChange={setEmail}
                    placeholder="you@example.com"
                    required
                  />
                  <Field
                    icon={Lock}
                    label="Password"
                    type="password"
                    value={password}
                    onChange={setPassword}
                    placeholder="••••••••"
                    required
                    minLength={6}
                  />

                  {error && <p className="text-xs text-love-300">{error}</p>}

                  <RippleButton
                    type="submit"
                    theme="crimson"
                    disabled={submitting}
                    className="mt-1 justify-center"
                  >
                    {submitting ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : mode === "sign-in" ? (
                      "Sign In"
                    ) : (
                      "Create Account"
                    )}
                  </RippleButton>
                </form>

                <p className="mt-5 text-center text-xs text-obsidian-400">
                  {mode === "sign-in" ? "New to LUVGYM?" : "Already have an account?"}{" "}
                  <button
                    type="button"
                    onClick={() => {
                      setMode(mode === "sign-in" ? "sign-up" : "sign-in");
                      setError(null);
                    }}
                    className="focus-ring font-semibold text-white transition-colors hover:text-love"
                  >
                    {mode === "sign-in" ? "Create an account" : "Sign in"}
                  </button>
                </p>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Field({
  icon: Icon,
  label,
  type,
  value,
  onChange,
  placeholder,
  required,
  minLength,
}: {
  icon: typeof Mail;
  label: string;
  type: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  required?: boolean;
  minLength?: number;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-obsidian-300">{label}</span>
      <div
        className={cn(
          "flex items-center gap-2.5 rounded-2xl border border-glass-border bg-black/20 px-3.5 py-2.5",
          "transition-colors focus-within:border-love/40"
        )}
      >
        <Icon size={15} className="shrink-0 text-obsidian-400" />
        <input
          type={type}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          required={required}
          minLength={minLength}
          autoComplete={type === "password" ? "current-password" : type === "email" ? "email" : "name"}
          className="w-full bg-transparent text-sm text-white placeholder:text-obsidian-500 focus:outline-none"
        />
      </div>
    </label>
  );
}
