"use client";

import { useEffect, useState } from "react";
import { Race } from "@/lib/types";
import { formatDateRange, getRacePopularityScore } from "@/lib/utils";

export function PaddockTicker({ races }: { races: Race[] }) {
  const messages = races
    .slice()
    .sort((a, b) => getRacePopularityScore(b) - getRacePopularityScore(a))
    .slice(0, 8)
    .map((race) => `${race.series}: ${race.title} | ${formatDateRange(race.startDate, race.endDate)} | ${race.city}`);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (messages.length <= 1) return;

    const interval = window.setInterval(() => {
      setIndex((current) => (current + 1) % messages.length);
    }, 3200);

    return () => window.clearInterval(interval);
  }, [messages.length]);

  if (messages.length === 0) return null;

  return (
    <div className="overflow-hidden rounded-[24px] border border-orange-400/20 bg-orange-500/10 px-4 py-3">
      <div className="flex items-center gap-3">
        <span className="h-2 w-2 shrink-0 animate-pulse rounded-full bg-orange-300" />
        <div className="min-w-0 text-sm font-medium text-orange-100">
          <span className="text-white/55">Live paddock pulse:</span>{" "}
          <span className="transition-opacity">{messages[index]}</span>
        </div>
      </div>
    </div>
  );
}
