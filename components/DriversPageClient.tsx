"use client";

import { useMemo, useState } from "react";
import { DriverCard } from "@/components/DriverCard";
import { EmptyState } from "@/components/EmptyState";
import { SectionTitle } from "@/components/SectionTitle";
import { Driver, DriverSort, SERIES, Series } from "@/lib/types";
import { getDriverSearchText, getDriverSeries, sortDrivers } from "@/lib/utils";

export function DriversPageClient({
  drivers,
  upcomingCountByDriver,
}: {
  drivers: Driver[];
  upcomingCountByDriver: Record<string, number>;
}) {
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<DriverSort>("active");
  const [activeOnly, setActiveOnly] = useState(false);
  const [seriesFilter, setSeriesFilter] = useState<Series | "All">("All");
  const [latviaOnly, setLatviaOnly] = useState(false);

  const filtered = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    const base = drivers.filter((driver) => {
      if (activeOnly && !driver.active) return false;
      if (latviaOnly && driver.nationality !== "Latvia") return false;
      if (seriesFilter !== "All" && !getDriverSeries(driver).includes(seriesFilter)) return false;
      if (!normalizedQuery) return true;
      return getDriverSearchText(driver).includes(normalizedQuery);
    });

    return sortDrivers(base, sort, (id) => upcomingCountByDriver[id] ?? 0);
  }, [activeOnly, drivers, latviaOnly, query, seriesFilter, sort, upcomingCountByDriver]);

  const featured = filtered.filter((driver) => driver.featured).slice(0, 3);
  const latvianCount = drivers.filter((driver) => driver.nationality === "Latvia").length;
  const activeCount = drivers.filter((driver) => driver.active).length;
  const seriesCount = new Set(drivers.flatMap((driver) => getDriverSeries(driver))).size;

  return (
    <main className="space-y-8">
      <section className="rounded-[32px] border border-white/10 bg-[linear-gradient(135deg,rgba(248,113,113,0.16),rgba(18,24,33,0.92)_46%,rgba(251,146,60,0.1))] p-6 md:p-8">
        <p className="text-xs uppercase tracking-[0.28em] text-red-100/80">Driver database</p>
        <h1 className="mt-3 text-4xl font-black tracking-tight text-white md:text-5xl">
          Follow drivers and riders across Latvia, the Baltics and world racing.
        </h1>
        <p className="mt-4 max-w-3xl text-base leading-7 text-white/72">
          Latvia remains the heart of the product, but the directory now also covers the major series on the calendar: F1, WRC, Formula E, MotoGP, NASCAR and WEC.
        </p>
        <div className="mt-6 grid gap-3 md:grid-cols-4">
          {[
            ["Profiles", drivers.length],
            ["Active", activeCount],
            ["Series", seriesCount],
            ["Latvian", latvianCount],
          ].map(([label, value]) => (
            <div key={label} className="rounded-2xl border border-white/10 bg-black/20 p-4">
              <div className="text-xs uppercase tracking-[0.2em] text-white/45">{label}</div>
              <div className="mt-2 text-3xl font-black tracking-tight text-white">{value}</div>
            </div>
          ))}
        </div>
      </section>

      <div className="rounded-[28px] border border-white/10 bg-white/[0.045] p-4">
        <div className="grid gap-3 md:grid-cols-5">
          <input
            className="rounded-2xl border border-white/10 bg-[#0b1016] px-4 py-3 text-sm text-white outline-none transition focus:border-orange-400/50 md:col-span-2"
            placeholder="Search name, country, team, discipline or series"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
          <select
            className="rounded-2xl border border-white/10 bg-[#0b1016] px-4 py-3 text-sm text-white outline-none transition focus:border-orange-400/50"
            value={seriesFilter}
            onChange={(event) => setSeriesFilter(event.target.value as Series | "All")}
          >
            <option value="All">All series</option>
            {SERIES.map((series) => (
              <option key={series} value={series}>{series}</option>
            ))}
          </select>
          <select
            className="rounded-2xl border border-white/10 bg-[#0b1016] px-4 py-3 text-sm text-white outline-none transition focus:border-orange-400/50"
            value={sort}
            onChange={(event) => setSort(event.target.value as DriverSort)}
          >
            <option value="active">Active first</option>
            <option value="upcoming">Most upcoming races</option>
            <option value="name">Name</option>
          </select>
          <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-[#0b1016] px-4 py-3 text-sm text-white/80">
            <input type="checkbox" checked={activeOnly} onChange={(event) => setActiveOnly(event.target.checked)} />
            Active only
          </label>
          <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-[#0b1016] px-4 py-3 text-sm text-white/80 md:col-span-2">
            <input type="checkbox" checked={latviaOnly} onChange={(event) => setLatviaOnly(event.target.checked)} />
            Latvia only
          </label>
        </div>
      </div>

      {featured.length > 0 ? (
        <section className="space-y-4">
          <SectionTitle subtitle="Featured Latvian and world-series profiles worth opening first.">Driver spotlight</SectionTitle>
          <div className="grid gap-4 xl:grid-cols-3">
            {featured.map((driver) => (
              <DriverCard
                key={driver.id}
                driver={driver}
                upcomingCount={upcomingCountByDriver[driver.id] ?? 0}
              />
            ))}
          </div>
        </section>
      ) : null}

      <section className="space-y-4">
        <SectionTitle subtitle={`${filtered.length} profiles match the current filters.`}>
          Driver and rider directory
        </SectionTitle>

        {filtered.length === 0 ? (
          <EmptyState
            title="No profiles match those filters"
            description="Try clearing the series filter, switching off Latvia only, or searching by team, country or discipline."
          />
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {filtered.map((driver) => (
              <DriverCard
                key={driver.id}
                driver={driver}
                upcomingCount={upcomingCountByDriver[driver.id] ?? 0}
              />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
