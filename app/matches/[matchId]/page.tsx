"use client";

import { useParams, useSearchParams } from "next/navigation";
import { ChatThread } from "@/components/chat/ChatThread";

export default function MatchThreadPage() {
  const params = useParams<{ matchId: string }>();
  const searchParams = useSearchParams();
  const autoCompose = searchParams.get("compose") === "workout";

  return <ChatThread matchId={params.matchId} autoOpenWorkoutComposer={autoCompose} />;
}
