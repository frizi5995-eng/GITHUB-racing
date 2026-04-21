"use client";

import Link from "next/link";
import { useMemo } from "react";
import { EmptyState } from "@/components/EmptyState";
import { useStoredFavorites } from "@/lib/clientStorage";
import { Driver, Race } from "@/lib/types";
import { formatDateRange, getDriverSeries } from "@/lib/utils";
import { Badge } from "./Badge";

type SeriesOverviewItem = {
  config?: {
    slug: string;
    code: string;
    name: string;
    regionFocus: string;
  } | null;
  upcomingCount: number;
};

export function WatchlistClient({
  races,
  drivers,
  seriesOverview,
}: {
  races: Race[];
  drivers: Driver[];
  seriesOverview: SeriesOverviewItem[];
}) {
  const [eventIds] = useStoredFavorites("events");
  const [driverIds] = useStoredFavorites("drivers");
  const [seriesIds] = useStoredFavorites("series");

  const savedRaces = useMemo(
    () => eventIds.map((id) => races.find((race) => race.id === id)).filter(Boolean) as Race[],
    [eventIds, races],
  );
  const savedDrivers = useMemo(
    () => driverIds.map((id) => drivers.find((driver) => driver.id === id)).filter(Boolean) as Driver[],
    [driverIds, drivers],
  );
  const savedSeries = useMemo(
    () =>
      seriesIds
        .map((id) => seriesOverview.find((item) => item.config?.slug === id))
        .filter(Boolean) as SeriesOverviewItem[],
    [seriesIds, seriesOverview],
  );

  return (
    <main className="space-y-8">
      <section className="rounded-[32px] border border-white/10 bg-white/[0.045] p-6">
        <Badge tone="hot">Favorites</Badge>
        <h1 className="mt-4 text-4xl font-black tracking-tight text-white">Saved motorsport picks</h1>
        <p className="mt-3 max-w-2xl text-white/68">
          Keep events, drivers and series you care about in one place. These favorites live in your browser, so they are fast and personal.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-black tracking-tight text-white">Saved events</h2>
        {savedRaces.length === 0 ? (
          <EmptyState
            title="No saved events yet"
            description="Open any event page and use the save button to build your favorites."
          />
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {savedRaces.map((race) => (
              <Link
                key={race.id}
                href={`/events/${race.id}`}
                className="rounded-[24px] border border-white/10 bg-white/[0.045] p-5 transition hover:bg-white/[0.075]"
              >
                <div className="flex flex-wrap gap-2">
                  <Badge tone="hot">{race.series}</Badge>
                  {race.latviaInvolved ? <Badge tone="lv">Latvia involved</Badge> : null}
                </div>
                <div className="mt-4 text-xl font-bold text-white">{race.title}</div>
                <div className="mt-2 text-sm text-white/65">{formatDateRange(race.startDate, race.endDate)}</div>
                <div className="mt-1 text-sm text-white/55">{race.city}, {race.country}</div>
              </Link>
            ))}
          </div>
        )}
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-black tracking-tight text-white">Saved drivers</h2>
        {savedDrivers.length === 0 ? (
          <EmptyState
            title="No saved drivers yet"
            description="Save drivers or riders you want to keep tracking and they will appear here."
          />
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {savedDrivers.map((driver) => (
              <Link
                key={driver.id}
                href={`/drivers/${driver.id}`}
                className="rounded-[24px] border border-white/10 bg-white/[0.045] p-5 transition hover:bg-white/[0.075]"
              >
                <div className="flex flex-wrap gap-2">
                  <Badge tone={driver.nationality === "Latvia" ? "lv" : "world"}>
                    {driver.nationality ?? "International"}
                  </Badge>
                  {driver.active ? <Badge tone="hot">Active</Badge> : null}
                </div>
                <div className="mt-4 text-xl font-bold text-white">{driver.name}</div>
                <div className="mt-2 text-sm text-white/65">{driver.discipline}</div>
                {getDriverSeries(driver)[0] ? (
                  <div className="mt-1 text-sm text-white/55">{getDriverSeries(driver).join(" | ")}</div>
                ) : null}
              </Link>
            ))}
          </div>
        )}
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-black tracking-tight text-white">Saved series</h2>
        {savedSeries.length === 0 ? (
          <EmptyState
            title="No saved series yet"
            description="Save a series from the series hub to keep its calendar close by."
          />
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {savedSeries.map((series) => (
              <Link
                key={series.config?.slug}
                href={`/series/${series.config?.slug}`}
                className="rounded-[24px] border border-white/10 bg-white/[0.045] p-5 transition hover:bg-white/[0.075]"
              >
                <div className="flex flex-wrap gap-2">
                  <Badge tone="world">{series.config?.code}</Badge>
                  <Badge tone="hot">{series.upcomingCount} upcoming</Badge>
                </div>
                <div className="mt-4 text-xl font-bold text-white">{series.config?.name}</div>
                <div className="mt-2 text-sm text-white/65">{series.config?.regionFocus}</div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
