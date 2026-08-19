export type SwipeMode = "gym-buddy" | "dating";
export type SwipeDirection = "left" | "right" | "up";

export interface SwipeProfile {
  id: string;
  name: string;
  age: number;
  mode: SwipeMode;
  gymLocation: string;
  workoutFocus: string;
  preferredTimeLabel: string;
  preferredTimeRange: string;
  bio: string;
  distanceKm: number;
  verified?: boolean;
  /** Demo-only: guarantees a mutual match celebration when liked. */
  guaranteedMatch?: boolean;
  /** Placeholder "photo" — a CSS gradient standing in for a real upload. */
  photoGradient: string;
  initials: string;
}
