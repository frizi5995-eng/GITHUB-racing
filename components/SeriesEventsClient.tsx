"use client";

import { useMemo, useState } from "react";
import { Race } from "@/lib/types";
import { formatDateRange, monthKey, raceLocationLabel } from "@/lib/utils";
import { Badge } from "./Badge";

export function SeriesEventsClient({
  races,
  seriesName,
}: {
  races: Race[];
  seriesName: string;
}) {
  const seasons = Array.from(new Set(races.map((race) => race.startDate.slice(0, 4)))).sort();
  const [season, setSeason] = useState(seasons[0] ?? "2026");
  const [status, setStatus] = useState<"upcoming" | "past" | "all">("upcoming");

  const filtered = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10);
    return races.filter((race) => {
      if (!race.startDate.startsWith(season)) return false;
      if (status === "upcoming") return race.startDate >= today;
      if (status === "past") return race.startDate < today;
      return true;
    });
  }, [races, season, status]);

  const distribution = useMemo(() => {
    return filtered.reduce<Record<string, number>>((accumulator, race) => {
      accumulator[race.region] = (accumulator[race.region] ?? 0) + 1;
      return accumulator;
    }, {});
  }, [filtered]);

  const months = useMemo(() => {
    return Array.from(new Set(filtered.map((race) => monthKey(race.startDate))));
  }, [filtered]);

  return (
    <section className="space-y-6">
      <div className="rounded-[28px] border border-white/10 bg-white/[0.045] p-5">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <div className="text-xs uppercase tracking-[0.24em] text-white/45">{seriesName} events</div>
            <h2 className="mt-2 text-2xl font-black tracking-tight text-white">Upcoming races and season view</h2>
          </div>

          <div className="flex flex-wrap gap-3">
            <select
              className="rounded-2xl border border-white/10 bg-[#0b1016] px-4 py-3 text-sm text-white outline-none"
              value={season}
              onChange={(event) => setSeason(event.target.value)}
            >
              {seasons.map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
            <select
              className="rounded-2xl border border-white/10 bg-[#0b1016] px-4 py-3 text-sm text-white outline-none"
              value={status}
              onChange={(event) => setStatus(event.target.value as "upcoming" | "past" | "all")}
            >
              <option value="upcoming">Upcoming</option>
              <option value="past">Past</option>
              <option value="all">All</option>
            </select>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          <Badge tone="world">{months.length} active months</Badge>
          {Object.entries(distribution).map(([region, count]) => (
            <Badge key={region} tone={region === "World" ? "world" : region === "Latvia" ? "lv" : "neutral"}>
              {region} {count}
            </Badge>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-[28px] border border-dashed border-white/10 bg-white/[0.03] p-6 text-white/60">
          No events are available for this series view yet.
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((race) => (
            <a
              key={race.id}
              href={`/events/${race.id}`}
              className="rounded-[24px] border border-white/10 bg-white/[0.045] p-5 transition hover:bg-white/[0.075]"
            >
              <div className="flex flex-wrap gap-2">
                <Badge tone="hot">{race.series}</Badge>
                <Badge tone={race.region === "World" ? "world" : race.region === "Latvia" ? "lv" : "neutral"}>
                  {race.region}
                </Badge>
              </div>
              <div className="mt-4 text-xl font-bold text-white">{race.title}</div>
              <div className="mt-2 text-sm text-white/65">{formatDateRange(race.startDate, race.endDate)}</div>
              <div className="mt-1 text-sm text-white/55">{raceLocationLabel(race)}</div>
            </a>
          ))}
        </div>
      )}
    </section>
  );
}
