"use client";

import { FavoriteKind, useStoredFavorites } from "@/lib/clientStorage";

export function FavoriteButton({
  itemId,
  kind,
  label,
}: {
  itemId: string;
  kind: FavoriteKind;
  label?: string;
}) {
  const [ids, toggle] = useStoredFavorites(kind);
  const active = ids.includes(itemId);
  const activeLabel = kind === "series" ? "Saved series" : `Saved ${kind.slice(0, -1)}`;

  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={() => toggle(itemId)}
      className={`rounded-2xl border px-4 py-2 text-sm transition ${
        active
          ? "border-orange-400/40 bg-orange-500/15 text-white"
          : "border-white/10 bg-white/5 text-white/70 hover:bg-white/10"
      }`}
    >
      {active ? activeLabel : label ?? "Save"}
    </button>
  );
}
