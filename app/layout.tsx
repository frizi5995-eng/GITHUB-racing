import type { Metadata } from "next";
import "./globals.css";
import { Nav } from "@/components/Nav";
import { ThemeScript } from "@/components/ThemeScript";

export const metadata: Metadata = {
  title: "RaceHub Latvia",
  description: "Motorsport calendar and discovery platform for Latvia, the Baltics and world racing series.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <ThemeScript />
      </head>
      <body>
        <div className="min-h-screen">
          <Nav />
          <div className="mx-auto max-w-7xl px-4 py-8 md:px-6 md:py-10">{children}</div>
        </div>
      </body>
    </html>
  );
}
