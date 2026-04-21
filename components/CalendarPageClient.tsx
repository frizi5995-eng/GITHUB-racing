"use client";

import { useDeferredValue, useMemo, useState } from "react";
import { EmptyState } from "@/components/EmptyState";
import { Filters } from "@/components/Filters";
import { LatviaModeToggle } from "@/components/LatviaModeToggle";
import { MonthCalendar } from "@/components/MonthCalendar";
import { RaceCard } from "@/components/RaceCard";
import { SectionTitle } from "@/components/SectionTitle";
import { useLatviaModePreference } from "@/lib/clientStorage";
import { Race, RaceFilters } from "@/lib/types";
import { filterRaces, getDiscoveredSeries, sortRaces } from "@/lib/utils";

export function CalendarPageClient({ races }: { races: Race[] }) {
  const [latviaMode, setLatviaMode] = useLatviaModePreference();
  const [filters, setFilters] = useState<RaceFilters>({
    q: "",
    region: "All",
    series: "All",
    latviaOnly: latviaMode,
    status: "upcoming",
  });

  const deferredFilters = useDeferredValue({ ...filters, latviaOnly: latviaMode });
  const seriesOptions = useMemo(() => getDiscoveredSeries(races), [races]);
  const filtered = useMemo(
    () => sortRaces(filterRaces(races, deferredFilters), "date-asc"),
    [deferredFilters, races],
  );
  const featured = filtered.filter((race) => race.featured).slice(0, 3);

  return (
    <main className="space-y-8">
      <section className="rounded-[32px] border border-white/10 bg-[linear-gradient(135deg,rgba(255,110,64,0.15),rgba(18,24,33,0.92)_45%,rgba(56,189,248,0.08))] p-6 md:p-8">
        <div className="max-w-3xl">
          <p className="text-xs uppercase tracking-[0.28em] text-orange-200/85">Calendar</p>
          <h1 className="mt-3 text-4xl font-black tracking-tight text-white md:text-5xl">
            One calendar for Latvia, the Baltics and world motorsport.
          </h1>
          <p className="mt-4 text-base leading-7 text-white/72">
            The calendar view and list view stay in sync, so you can spot a race on the month grid and immediately open the full event page with links, drivers and metadata.
          </p>
          <div className="mt-5">
            <LatviaModeToggle />
          </div>
        </div>
      </section>

      <Filters
        state={{ ...filters, latviaOnly: latviaMode }}
        setState={(next) => {
          setLatviaMode(next.latviaOnly);
          setFilters(next);
        }}
        seriesOptions={seriesOptions}
        onClear={() =>
          setFilters({
            q: "",
            region: "All",
            series: "All",
            latviaOnly: latviaMode,
            status: "upcoming",
          })
        }
      />

      <MonthCalendar races={filtered} />

      {featured.length > 0 ? (
        <section className="space-y-4">
          <SectionTitle subtitle="Fast picks surfaced from the current filter state.">Featured in this view</SectionTitle>
          <div className="grid gap-4 xl:grid-cols-3">
            {featured.map((race) => (
              <RaceCard key={race.id} race={race} compact searchQuery={filters.q} />
            ))}
          </div>
        </section>
      ) : null}

      <section className="space-y-4">
        <SectionTitle subtitle="Every event below uses the same filters as the calendar above.">
          Upcoming and filtered races
        </SectionTitle>

        {filtered.length === 0 ? (
          <EmptyState
            title="No races match this calendar view"
            description="Remove filters, switch region, or turn off Latvia mode to widen the calendar."
            actions={
              <>
              <button
                type="button"
                onClick={() =>
                  setFilters({
                    q: "",
                    region: "All",
                    series: "All",
                    latviaOnly: latviaMode,
                    status: "upcoming",
                  })
                }
                className="rounded-2xl border border-white/10 bg-[#0b1016] px-4 py-2 text-sm text-white/75 transition hover:bg-white/10"
              >
                Remove filters
              </button>
              <button
                type="button"
                onClick={() => setLatviaMode(false)}
                className="rounded-2xl border border-white/10 bg-[#0b1016] px-4 py-2 text-sm text-white/75 transition hover:bg-white/10"
              >
                Switch off Latvia mode
              </button>
              </>
            }
          />
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {filtered.map((race) => (
              <RaceCard key={race.id} race={race} searchQuery={filters.q} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
