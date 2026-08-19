import { Dumbbell, HeartHandshake, MapPin } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { HeroSection } from "@/components/hero/HeroSection";
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
      {/* Ambient background accent, carries the glow past the hero's 3D canvas */}
      <div className="pointer-events-none absolute inset-0 bg-grid-glow" />

      <Header />

      <HeroSection />

      <section className="relative mx-auto -mt-8 flex max-w-5xl flex-wrap items-center justify-center gap-x-10 gap-y-4 px-6 pb-20 text-center">
        {stats.map((stat) => (
          <div key={stat.label} className="text-center">
            <p className="text-2xl font-semibold text-white">{stat.value}</p>
            <p className="text-xs uppercase tracking-wider text-obsidian-400">
              {stat.label}
            </p>
          </div>
        ))}
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
