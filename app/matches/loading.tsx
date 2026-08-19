import { Loader2 } from "lucide-react";

export default function MatchesLoading() {
  return (
    <div className="flex flex-1 items-center justify-center">
      <Loader2 size={20} className="animate-spin text-obsidian-400" />
    </div>
  );
}
