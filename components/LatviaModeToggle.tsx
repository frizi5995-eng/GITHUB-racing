"use client";

import { useLatviaModePreference } from "@/lib/clientStorage";

export function LatviaModeToggle({
  label = "Show only Latvia involved",
}: {
  label?: string;
}) {
  const [enabled, setEnabled] = useLatviaModePreference();

  return (
    <button
      type="button"
      onClick={() => setEnabled(!enabled)}
      className={`rounded-2xl border px-4 py-2 text-sm transition ${
        enabled
          ? "border-red-400/35 bg-red-500/14 text-white"
          : "border-white/10 bg-white/6 text-white/72 hover:bg-white/10"
      }`}
    >
      {enabled ? "Latvia mode on" : label}
    </button>
  );
}
