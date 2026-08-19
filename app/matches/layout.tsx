import { Header } from "@/components/layout/Header";
import { MatchesSidebar } from "@/components/chat/MatchesSidebar";

export default function MatchesLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="relative flex h-dvh flex-col overflow-hidden bg-obsidian">
      <div className="pointer-events-none fixed inset-0 bg-grid-glow" />
      <Header />
      <div className="relative mx-auto flex w-full max-w-6xl flex-1 overflow-hidden px-4 pb-6 pt-24 sm:px-6 sm:pt-28">
        <div className="glass-panel flex w-full overflow-hidden">
          <MatchesSidebar />
          <div className="flex flex-1 flex-col overflow-hidden">{children}</div>
        </div>
      </div>
    </main>
  );
}
