import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LUVGYM — Find Your Match. Find Your Spot.",
  description:
    "LUVGYM pairs you with people who share your training goals — a premium dating and gym-partner matchmaking experience.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body id="top" className="min-h-screen bg-obsidian">
        {children}
      </body>
    </html>
  );
}
