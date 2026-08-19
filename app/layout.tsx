import type { Metadata } from "next";
import { AuthProvider } from "@/lib/auth/AuthProvider";
import { AuthModalProvider } from "@/components/auth/AuthModalProvider";
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
        <AuthProvider>
          <AuthModalProvider>{children}</AuthModalProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
