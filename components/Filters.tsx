"use client";

import { Region, Series } from "@/lib/types";

export type FiltersState = {
  q: string;
  region: "All" | Region;
  series: "All" | Series;
  latviaOnly: boolean;
};

export function Filters({
  state,
  setState,
  seriesOptions,
}: {
  state: FiltersState;
  setState: (next: FiltersState) => void;
  seriesOptions: Series[];
}) {
  const seriesList = Array.from(new Set(seriesOptions)).sort();

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
      <div className="grid gap-3 md:grid-cols-4">
        <input
          className="w-full rounded-xl border border-white/10 bg-[#0b0b0f] px-3 py-2 text-sm outline-none focus:border-orange-400/60"
          placeholder="Search (title/city/country)…"
          value={state.q}
          onChange={(e) => setState({ ...state, q: e.target.value })}
        />

        <select
          className="w-full rounded-xl border border-white/10 bg-[#0b0b0f] px-3 py-2 text-sm outline-none focus:border-orange-400/60"
          value={state.region}
          onChange={(e) => setState({ ...state, region: e.target.value as FiltersState["region"] })}
        >
          <option value="All">All regions</option>
          <option value="Latvia">Latvia</option>
          <option value="Baltics">Baltics</option>
          <option value="World">World</option>
        </select>

        <select
          className="w-full rounded-xl border border-white/10 bg-[#0b0b0f] px-3 py-2 text-sm outline-none focus:border-orange-400/60"
          value={state.series}
          onChange={(e) => setState({ ...state, series: e.target.value as FiltersState["series"] })}
        >
          <option value="All">All series</option>
          {seriesList.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>

        <label className="flex items-center gap-2 rounded-xl border border-white/10 bg-[#0b0b0f] px-3 py-2 text-sm">
          <input
            type="checkbox"
            checked={state.latviaOnly}
            onChange={(e) => setState({ ...state, latviaOnly: e.target.checked })}
          />
          Tikai ar Latvijas dalību
        </label>
      </div>
    </div>
  );
}
