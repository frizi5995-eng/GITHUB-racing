"use client";

import { useMemo, useState } from "react";
import { Filters, FiltersState } from "@/components/Filters";
import { RaceCard } from "@/components/RaceCard";
import { SectionTitle } from "@/components/SectionTitle";
import { Race, Series } from "@/lib/types";
import { compareByDateAsc, isUpcoming } from "@/lib/utils";

export function EventsPageClient({ races }: { races: Race[] }) {
  const [state, setState] = useState<FiltersState>({
    q: "",
    region: "All",
    series: "All",
    latviaOnly: false,
  });

  const seriesOptions = useMemo(() => races.map((race) => race.series) as Series[], [races]);

  const filtered = useMemo(() => {
    const q = state.q.trim().toLowerCase();
    return races
      .filter((race) => isUpcoming(race.startDate))
      .slice()
      .sort(compareByDateAsc)
      .filter((race) => (state.region === "All" ? true : race.region === state.region))
      .filter((race) => (state.series === "All" ? true : race.series === state.series))
      .filter((race) => (state.latviaOnly ? race.latviaInvolved : true))
      .filter((race) => {
        if (!q) return true;
        const haystack =
          `${race.title} ${race.location ?? ""} ${race.city} ${race.country} ${race.series}`.toLowerCase();
        return haystack.includes(q);
      });
  }, [races, state]);

  return (
    <main className="space-y-6">
      <SectionTitle>Events</SectionTitle>
      <Filters state={state} setState={setState} seriesOptions={seriesOptions} />

      <div className="grid gap-4 md:grid-cols-2">
        {filtered.map((race) => (
          <RaceCard key={race.id} race={race} />
        ))}
      </div>

      {filtered.length === 0 ? <div className="text-white/60">Nav atrasts.</div> : null}
    </main>
  );
}
