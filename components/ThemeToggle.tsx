"use client";

import { useThemePreference } from "@/lib/clientStorage";

export function ThemeToggle() {
  const [theme, setTheme] = useThemePreference();
  const nextTheme = theme === "dark" ? "light" : "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(nextTheme)}
      className="rounded-2xl border border-white/10 bg-white/6 px-4 py-2 text-sm text-white/72 transition hover:bg-white/10 hover:text-white"
      aria-label={`Switch to ${nextTheme} mode`}
    >
      {theme === "dark" ? "Light mode" : "Dark mode"}
    </button>
  );
}
