import { MessagesSquare } from "lucide-react";

export default function MatchesIndexPage() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-3 p-8 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-love/10 text-love">
        <MessagesSquare size={24} />
      </span>
      <div>
        <p className="text-lg font-semibold text-white">Select a conversation</p>
        <p className="mt-1 text-sm text-obsidian-300">
          Pick a match from the list to start chatting.
        </p>
      </div>
    </div>
  );
}
