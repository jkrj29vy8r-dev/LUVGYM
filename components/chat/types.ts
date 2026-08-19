import type { Tables } from "@/lib/supabase/database.types";

export type Message = Tables<"messages">;

export interface WorkoutDetails {
  date: string;
  time: string;
  location: string;
  status: "pending" | "accepted" | "declined";
}
