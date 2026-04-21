"use client";

import { useDeferredValue, useMemo, useState } from "react";
import { EmptyState } from "@/components/EmptyState";
import { Filters } from "@/components/Filters";
import { LatviaModeToggle } from "@/components/LatviaModeToggle";
import { RaceCard } from "@/components/RaceCard";
import { SectionTitle } from "@/components/SectionTitle";
import { useLatviaModePreference } from "@/lib/clientStorage";
import { Race, RaceFilters, RaceSort } from "@/lib/types";
import { filterRaces, getDiscoveredSeries, sortRaces } from "@/lib/utils";

const PAGE_SIZE = 12;

export function EventsPageClient({ races }: { races: Race[] }) {
  const [latviaMode, setLatviaMode] = useLatviaModePreference();
  const [filters, setFilters] = useState<RaceFilters>({
    q: "",
    region: "All",
    series: "All",
    latviaOnly: latviaMode,
    status: "upcoming",
  });
  const [sort, setSort] = useState<RaceSort>("date-asc");
  const [visible, setVisible] = useState(PAGE_SIZE);

  const deferredFilters = useDeferredValue({ ...filters, latviaOnly: latviaMode });
  const seriesOptions = useMemo(() => getDiscoveredSeries(races), [races]);
  const filtered = useMemo(
    () => sortRaces(filterRaces(races, deferredFilters), sort),
    [deferredFilters, races, sort],
  );

  const visibleRaces = filtered.slice(0, visible);

  return (
    <main className="space-y-8">
      <section className="rounded-[32px] border border-white/10 bg-[linear-gradient(135deg,rgba(14,165,233,0.12),rgba(18,24,33,0.92)_45%,rgba(251,146,60,0.12))] p-6 md:p-8">
        <p className="text-xs uppercase tracking-[0.28em] text-sky-100/80">Events catalogue</p>
        <h1 className="mt-3 text-4xl font-black tracking-tight text-white md:text-5xl">
          Browse the full motorsport schedule with useful filters.
        </h1>
        <p className="mt-4 max-w-3xl text-base leading-7 text-white/72">
          This is the deep catalogue view: region, series, search, Latvia-involved only, date status and sorting all work together without breaking the page.
        </p>
        <div className="mt-5">
          <LatviaModeToggle />
        </div>
      </section>

      <Filters
        state={{ ...filters, latviaOnly: latviaMode }}
        setState={(next) => {
          setLatviaMode(next.latviaOnly);
          setVisible(PAGE_SIZE);
          setFilters(next);
        }}
        seriesOptions={seriesOptions}
        sort={sort}
        setSort={(next) => {
          setVisible(PAGE_SIZE);
          setSort(next);
        }}
        showSort
        onClear={() => {
          setVisible(PAGE_SIZE);
          setFilters({
            q: "",
            region: "All",
            series: "All",
            latviaOnly: latviaMode,
            status: "upcoming",
          });
        }}
      />

      <section className="space-y-4">
        <SectionTitle subtitle={`${filtered.length} races matched by the current catalogue filters.`}>
          All races
        </SectionTitle>

        {visibleRaces.length === 0 ? (
          <EmptyState
            title="No events match this view"
            description="Try changing the date status, removing filters, switching region, or turning off Latvia mode."
            actions={
              <>
              <button
                type="button"
                onClick={() => {
                  setVisible(PAGE_SIZE);
                  setFilters({
                    q: "",
                    region: "All",
                    series: "All",
                    latviaOnly: latviaMode,
                    status: "all",
                  });
                }}
                className="rounded-2xl border border-white/10 bg-[#0b1016] px-4 py-2 text-sm text-white/75 transition hover:bg-white/10"
              >
                View all events
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
          <>
            <div className="grid gap-4 md:grid-cols-2">
              {visibleRaces.map((race) => (
                <RaceCard key={race.id} race={race} searchQuery={filters.q} />
              ))}
            </div>

            {visible < filtered.length ? (
              <div className="flex justify-center">
                <button
                  type="button"
                  onClick={() => setVisible((count) => count + PAGE_SIZE)}
                  className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm text-white/80 transition hover:bg-white/10"
                >
                  Load more races
                </button>
              </div>
            ) : null}
          </>
        )}
      </section>
    </main>
  );
}
