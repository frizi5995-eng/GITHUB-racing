"use client";

import { useDeferredValue } from "react";
import { RaceFilters, RaceSort, Series } from "@/lib/types";

export function Filters({
  state,
  setState,
  seriesOptions,
  sort,
  setSort,
  showSort = false,
  onClear,
}: {
  state: RaceFilters;
  setState: (next: RaceFilters) => void;
  seriesOptions: Series[];
  sort?: RaceSort;
  setSort?: (sort: RaceSort) => void;
  showSort?: boolean;
  onClear?: () => void;
}) {
  const deferredQuery = useDeferredValue(state.q);

  return (
    <div className="rounded-[28px] border border-white/10 bg-white/[0.045] p-4">
      <div className="mb-3 flex flex-wrap gap-2">
        {[
          { label: "All", action: () => setState({ ...state, region: "All" }) },
          { label: "Latvia", action: () => setState({ ...state, region: "Latvia" }) },
          { label: "Baltics", action: () => setState({ ...state, region: "Baltics" }) },
          { label: "World", action: () => setState({ ...state, region: "World" }) },
          { label: "Latvia involved", action: () => setState({ ...state, latviaOnly: true }) },
        ].map((preset) => (
          <button
            key={preset.label}
            type="button"
            onClick={preset.action}
            className="rounded-full border border-white/10 bg-[#0b1016] px-3 py-1.5 text-xs text-white/72 transition hover:bg-white/10"
          >
            {preset.label}
          </button>
        ))}
        {onClear ? (
          <button
            type="button"
            onClick={onClear}
            className="rounded-full border border-orange-400/20 bg-orange-500/10 px-3 py-1.5 text-xs text-orange-100 transition hover:bg-orange-500/16"
          >
            Reset filters
          </button>
        ) : null}
      </div>

      <div className="grid gap-3 lg:grid-cols-6">
        <input
          className="w-full rounded-2xl border border-white/10 bg-[#0b1016] px-4 py-3 text-sm text-white outline-none transition focus:border-orange-400/50"
          placeholder="Search by title, city, country or venue"
          value={state.q}
          onChange={(event) => setState({ ...state, q: event.target.value })}
        />

        <select
          className="w-full rounded-2xl border border-white/10 bg-[#0b1016] px-4 py-3 text-sm text-white outline-none transition focus:border-orange-400/50"
          value={state.region}
          onChange={(event) => setState({ ...state, region: event.target.value as RaceFilters["region"] })}
        >
          <option value="All">All regions</option>
          <option value="Latvia">Latvia</option>
          <option value="Baltics">Baltics</option>
          <option value="World">World</option>
        </select>

        <select
          className="w-full rounded-2xl border border-white/10 bg-[#0b1016] px-4 py-3 text-sm text-white outline-none transition focus:border-orange-400/50"
          value={state.series}
          onChange={(event) => setState({ ...state, series: event.target.value as RaceFilters["series"] })}
        >
          <option value="All">All series</option>
          {seriesOptions.map((series) => (
            <option key={series} value={series}>
              {series}
            </option>
          ))}
        </select>

        <select
          className="w-full rounded-2xl border border-white/10 bg-[#0b1016] px-4 py-3 text-sm text-white outline-none transition focus:border-orange-400/50"
          value={state.status}
          onChange={(event) => setState({ ...state, status: event.target.value as RaceFilters["status"] })}
        >
          <option value="upcoming">Upcoming</option>
          <option value="past">Past</option>
          <option value="all">All dates</option>
        </select>

        <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-[#0b1016] px-4 py-3 text-sm text-white/80">
          <input
            type="checkbox"
            checked={state.latviaOnly}
            onChange={(event) => setState({ ...state, latviaOnly: event.target.checked })}
          />
          Only events with Latvian participation
        </label>

        {showSort && sort && setSort ? (
          <select
            className="w-full rounded-2xl border border-white/10 bg-[#0b1016] px-4 py-3 text-sm text-white outline-none transition focus:border-orange-400/50"
            value={sort}
            onChange={(event) => setSort(event.target.value as RaceSort)}
          >
            <option value="date-asc">Date ascending</option>
            <option value="date-desc">Date descending</option>
            <option value="region">Region</option>
            <option value="series">Series</option>
          </select>
        ) : (
          <div className="rounded-2xl border border-white/10 bg-[#0b1016] px-4 py-3 text-sm text-white/65">
            Filters sync with calendar and list views.
          </div>
        )}
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-3 text-xs text-white/55">
        <div className="flex flex-wrap gap-2">
          <span className="rounded-full border border-white/10 px-3 py-1">Latvia</span>
          <span className="rounded-full border border-white/10 px-3 py-1">Baltics</span>
          <span className="rounded-full border border-white/10 px-3 py-1">World</span>
          <span className="rounded-full border border-red-400/20 bg-red-500/10 px-3 py-1 text-red-100">
            Latvia involved
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={state.latviaOnly}
              onChange={(event) => setState({ ...state, latviaOnly: event.target.checked })}
            />
            Latvia involved only
          </label>
          <span>Live search: {deferredQuery.trim() ? `"${deferredQuery.trim()}"` : "off"}</span>
        </div>
      </div>
    </div>
  );
}
