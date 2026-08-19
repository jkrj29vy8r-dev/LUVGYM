import { Dumbbell, HeartHandshake, MapPin, Sparkles } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/Button";
import { GlassCard } from "@/components/ui/GlassCard";

const stats = [
  { label: "Active Members", value: "48K+" },
  { label: "Verified Gyms", value: "1,200+" },
  { label: "Matches Made Daily", value: "3,400+" },
];

const features = [
  {
    icon: HeartHandshake,
    glow: "love" as const,
    title: "Compatibility Matching",
    description:
      "Our algorithm pairs you by training style, schedule, and relationship goals — not just a swipe.",
  },
  {
    icon: Dumbbell,
    glow: "energy" as const,
    title: "Gym-Verified Profiles",
    description:
      "Every profile links to a real gym check-in, so you know exactly who you're meeting.",
  },
  {
    icon: MapPin,
    glow: "love" as const,
    title: "Local Session Planner",
    description:
      "Book your first workout together at a partner gym near you, right inside the app.",
  },
];

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-obsidian">
      {/* Ambient background accents */}
      <div className="pointer-events-none absolute inset-0 bg-grid-glow" />
      <div className="pointer-events-none absolute -top-40 left-1/4 h-96 w-96 rounded-full bg-love/10 blur-[120px]" />
      <div className="pointer-events-none absolute top-96 right-0 h-80 w-80 rounded-full bg-energy/10 blur-[120px]" />

      <Header />

      <section className="relative mx-auto flex max-w-5xl flex-col items-center px-6 pb-24 pt-40 text-center sm:pt-48">
        <div className="animate-fade-in inline-flex items-center gap-2 rounded-full border border-glass-border bg-glass-surface px-4 py-1.5 text-xs font-medium text-obsidian-200 backdrop-blur-xl">
          <Sparkles size={13} className="text-love" />
          Now matching in 40+ cities
        </div>

        <h1
          className="mt-6 text-balance text-5xl font-semibold tracking-tight text-white sm:text-6xl md:text-7xl"
          style={{ animationDelay: "0.05s" }}
        >
          Find your match.
          <br />
          <span className="text-gradient-brand">Find your spot.</span>
        </h1>

        <p className="mt-6 max-w-xl text-balance text-base text-obsidian-300 sm:text-lg">
          LUVGYM connects you with people who train the way you train. Real
          gyms, real chemistry, real gains — together.
        </p>

        <div className="mt-9 flex flex-col items-center gap-3 sm:flex-row">
          <Button size="lg">Get Started Free</Button>
          <Button size="lg" variant="secondary">
            See How It Works
          </Button>
        </div>

        <div className="mt-16 flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-2xl font-semibold text-white">{stat.value}</p>
              <p className="text-xs uppercase tracking-wider text-obsidian-400">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="relative mx-auto max-w-5xl px-6 pb-32">
        <div className="grid gap-5 sm:grid-cols-3">
          {features.map((feature) => (
            <GlassCard key={feature.title} glow={feature.glow} className="animate-float-slow">
              <div
                className={
                  feature.glow === "love"
                    ? "flex h-11 w-11 items-center justify-center rounded-2xl bg-love/10 text-love"
                    : "flex h-11 w-11 items-center justify-center rounded-2xl bg-energy/10 text-energy"
                }
              >
                <feature.icon size={20} />
              </div>
              <h3 className="mt-5 text-lg font-semibold text-white">
                {feature.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-obsidian-300">
                {feature.description}
              </p>
            </GlassCard>
          ))}
        </div>
      </section>
    </main>
  );
}
