"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { formatF1SessionLabel, getF1SessionType, isPrimaryF1Session } from "@/lib/f1Sessions";
import { Race, Series } from "@/lib/types";
import { isoToDateLabel, isUpcoming, raceLocationLabel } from "@/lib/utils";

type ViewMode = "grid" | "list";
type StatusTab = "upcoming" | "past";

type TimelineMonth = {
  key: string;
  label: string;
  count: number;
};

function getMonthKey(iso: string) {
  return iso.slice(0, 7);
}

function getMonthLabel(iso: string) {
  const [year, month] = iso.split("-");
  const date = new Date(Number(year), Number(month) - 1, 1);
  return date.toLocaleString("en-US", { month: "short" });
}

function eventTone(race: Race, tab: StatusTab) {
  if (tab === "past") {
    return {
      badge: "bg-[#1A232E] text-[#7D8896] border-[#263241]",
      edge: "from-[#556171] to-[#3E4A58]",
      glow: "hover:shadow-[0_16px_45px_rgba(90,106,125,0.14)]",
    };
  }

  if (race.series === "WRC") {
    return {
      badge: "bg-orange-500/15 text-orange-200 border-orange-400/30",
      edge: "from-orange-400 to-orange-600",
      glow: "hover:shadow-[0_18px_45px_rgba(249,115,22,0.18)]",
    };
  }

  const type = getF1SessionType(race.title);

  if (type === "grand-prix") {
    return {
      badge: "bg-orange-500/15 text-orange-200 border-orange-400/30",
      edge: "from-orange-400 to-orange-600",
      glow: "hover:shadow-[0_18px_45px_rgba(249,115,22,0.18)]",
    };
  }

  return {
    badge: "bg-blue-500/15 text-blue-200 border-blue-400/30",
    edge: "from-[#3B82F6] to-[#60A5FA]",
    glow: "hover:shadow-[0_18px_45px_rgba(59,130,246,0.16)]",
  };
}

function getCountryMark(race: Race) {
  const text = race.country && race.country !== "TBA" ? race.country : race.city;
  return text.slice(0, 2).toUpperCase();
}

function EventCard({
  race,
  tab,
  viewMode,
}: {
  race: Race;
  tab: StatusTab;
  viewMode: ViewMode;
}) {
  const type = getF1SessionType(race.title);
  const tone = eventTone(race, tab);
  const metaLabel = race.series === "F1" ? formatF1SessionLabel(type) : race.series;

  return (
    <Link
      href={`/events/${race.id}`}
      className={`group relative overflow-hidden rounded-2xl border border-[#1F2A36] bg-[#121821] p-5 transition duration-300 hover:scale-[1.02] hover:bg-[#16202A] ${tone.glow} ${
        viewMode === "list" ? "flex flex-col gap-4 md:flex-row md:items-center md:justify-between" : "block"
      }`}
    >
      <div className={`absolute inset-x-0 top-0 h-px bg-gradient-to-r ${tone.edge} opacity-80`} />

      <div className="flex items-start gap-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#263241] bg-[#0F141B] text-sm font-semibold text-[#9DA7B3]">
          {getCountryMark(race)}
        </div>

        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className={`rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] ${tone.badge}`}>
              {tab === "past" ? "Past" : "Upcoming"}
            </span>
            <span className="rounded-full border border-[#263241] bg-[#0F141B] px-2.5 py-1 text-[11px] font-medium text-[#9DA7B3]">
              {metaLabel}
            </span>
          </div>

          <h3 className="mt-3 text-[19px] font-bold leading-tight text-[#E6EDF3]">{race.title}</h3>
          <div className="mt-2 text-[15px] font-medium text-[#C8D2DC]">{isoToDateLabel(race.startDate)}</div>
          <div className="mt-1 text-[13px] text-[#9DA7B3]">{raceLocationLabel(race)}</div>
        </div>
      </div>

      <div className={`mt-5 flex items-end justify-between gap-3 ${viewMode === "list" ? "md:mt-0 md:min-w-[220px] md:justify-end" : ""}`}>
        <div className="text-[12px] text-[#7D8896]">
          {race.region} • {race.series}
        </div>
        <div className="text-[12px] font-medium text-[#9FBFFF] transition group-hover:text-white">Open details →</div>
      </div>
    </Link>
  );
}

export function SeriesEventsClient({
  races,
  seriesCode,
  seriesName,
}: {
  races: Race[];
  seriesCode: Series;
  seriesName: string;
}) {
  const isF1 = seriesCode === "F1";
  const [showAllSessions, setShowAllSessions] = useState(false);
  const [tab, setTab] = useState<StatusTab>("upcoming");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const seasons = Array.from(new Set(races.map((race) => race.startDate.slice(0, 4)))).sort();
  const [season, setSeason] = useState(seasons[0] ?? "2026");

  const seasonRaces = useMemo(
    () => races.filter((race) => race.startDate.startsWith(`${season}-`)),
    [races, season],
  );

  const timelineMonths = useMemo<TimelineMonth[]>(() => {
    const map = new Map<string, number>();

    for (const race of seasonRaces) {
      const key = getMonthKey(race.startDate);
      map.set(key, (map.get(key) ?? 0) + 1);
    }

    return Array.from(map.entries()).map(([key, count]) => ({
      key,
      label: getMonthLabel(`${key}-01`),
      count,
    }));
  }, [seasonRaces]);

  const filteredRaces = useMemo(() => {
    const base = seasonRaces.filter((race) => (tab === "upcoming" ? isUpcoming(race.startDate) : !isUpcoming(race.startDate)));
    if (!isF1 || showAllSessions) return base;
    return base.filter(isPrimaryF1Session);
  }, [isF1, seasonRaces, showAllSessions, tab]);

  if (!isF1) {
    return (
      <section className="space-y-4">
        <div className="rounded-[24px] border border-[#1F2A36] bg-[#121821] p-5 shadow-[0_18px_70px_rgba(0,0,0,0.28)]">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
              <div>
                <div className="text-[12px] uppercase tracking-[0.2em] text-[#7D8896]">{seriesName} Calendar</div>
                <div className="mt-1 text-[15px] text-[#9DA7B3]">
                  Upcoming and past events for the {seriesName} series.
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <div className="rounded-2xl border border-[#1F2A36] bg-[#0F141B] p-1">
                  <button
                    type="button"
                    onClick={() => setTab("upcoming")}
                    className={`rounded-xl px-4 py-2 text-sm transition ${
                      tab === "upcoming" ? "bg-[#3B82F6] text-white" : "text-[#9DA7B3] hover:text-white"
                    }`}
                  >
                    Upcoming
                  </button>
                  <button
                    type="button"
                    onClick={() => setTab("past")}
                    className={`rounded-xl px-4 py-2 text-sm transition ${
                      tab === "past" ? "bg-[#3B82F6] text-white" : "text-[#9DA7B3] hover:text-white"
                    }`}
                  >
                    Past
                  </button>
                </div>

                <div className="flex items-center gap-2 rounded-2xl border border-[#1F2A36] bg-[#0F141B] px-3 py-2">
                  <span className="text-xs uppercase tracking-[0.16em] text-[#7D8896]">Season</span>
                  <select
                    className="bg-transparent text-sm text-[#E6EDF3] outline-none"
                    value={season}
                    onChange={(event) => setSeason(event.target.value)}
                  >
                    {seasons.map((value) => (
                      <option key={value} value={value} className="bg-[#0F141B]">
                        {value}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center gap-2 rounded-2xl border border-[#1F2A36] bg-[#0F141B] p-1">
                  <button
                    type="button"
                    onClick={() => setViewMode("grid")}
                    className={`rounded-xl px-3 py-2 text-sm transition ${
                      viewMode === "grid" ? "bg-[#16202A] text-white" : "text-[#9DA7B3] hover:text-white"
                    }`}
                  >
                    Grid
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode("list")}
                    className={`rounded-xl px-3 py-2 text-sm transition ${
                      viewMode === "list" ? "bg-[#16202A] text-white" : "text-[#9DA7B3] hover:text-white"
                    }`}
                  >
                    List
                  </button>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto pb-2">
              <div className="flex min-w-max items-center gap-3">
                {timelineMonths.map((month) => (
                  <div
                    key={month.key}
                    className="rounded-2xl border border-[#1F2A36] bg-[#0F141B] px-4 py-3 text-left"
                  >
                    <div className="text-[11px] uppercase tracking-[0.16em] text-[#7D8896]">{month.label}</div>
                    <div className="mt-1 text-[17px] font-semibold text-[#E6EDF3]">{month.count}</div>
                    <div className="text-[12px] text-[#9DA7B3]">events</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {filteredRaces.length === 0 ? (
          <div className="rounded-2xl border border-[#1F2A36] bg-[#121821] p-5 text-[#9DA7B3]">
            No events in this view yet.
          </div>
        ) : (
          <div
            className={
              viewMode === "grid"
                ? "grid gap-6 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4"
                : "grid gap-6"
            }
          >
            {filteredRaces.map((race) => (
              <EventCard key={race.id} race={race} tab={tab} viewMode={viewMode} />
            ))}
          </div>
        )}
      </section>
    );
  }

  return (
    <section className="space-y-6">
      <div className="rounded-[24px] border border-[#1F2A36] bg-[#121821] p-5 shadow-[0_18px_70px_rgba(0,0,0,0.28)]">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <div className="text-[12px] uppercase tracking-[0.2em] text-[#7D8896]">{seriesName} Control Center</div>
              <div className="mt-1 text-[15px] text-[#9DA7B3]">
                Premium season view with clean default filtering and fast event scanning.
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <div className="rounded-2xl border border-[#1F2A36] bg-[#0F141B] p-1">
                <button
                  type="button"
                  onClick={() => setTab("upcoming")}
                  className={`rounded-xl px-4 py-2 text-sm transition ${
                    tab === "upcoming" ? "bg-[#3B82F6] text-white" : "text-[#9DA7B3] hover:text-white"
                  }`}
                >
                  Upcoming
                </button>
                <button
                  type="button"
                  onClick={() => setTab("past")}
                  className={`rounded-xl px-4 py-2 text-sm transition ${
                    tab === "past" ? "bg-[#3B82F6] text-white" : "text-[#9DA7B3] hover:text-white"
                  }`}
                >
                  Past
                </button>
              </div>

              <div className="flex items-center gap-2 rounded-2xl border border-[#1F2A36] bg-[#0F141B] px-3 py-2">
                <span className="text-xs uppercase tracking-[0.16em] text-[#7D8896]">Season</span>
                <select
                  className="bg-transparent text-sm text-[#E6EDF3] outline-none"
                  value={season}
                  onChange={(event) => setSeason(event.target.value)}
                >
                  {seasons.map((value) => (
                    <option key={value} value={value} className="bg-[#0F141B]">
                      {value}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2 rounded-2xl border border-[#1F2A36] bg-[#0F141B] p-1">
                <button
                  type="button"
                  onClick={() => setViewMode("grid")}
                  className={`rounded-xl px-3 py-2 text-sm transition ${
                    viewMode === "grid" ? "bg-[#16202A] text-white" : "text-[#9DA7B3] hover:text-white"
                  }`}
                >
                  Grid
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode("list")}
                  className={`rounded-xl px-3 py-2 text-sm transition ${
                    viewMode === "list" ? "bg-[#16202A] text-white" : "text-[#9DA7B3] hover:text-white"
                  }`}
                >
                  List
                </button>
              </div>

              <button
                type="button"
                onClick={() => setShowAllSessions((value) => !value)}
                className={`rounded-2xl border px-4 py-2 text-sm transition ${
                  showAllSessions
                    ? "border-[#3B82F6]/40 bg-[#3B82F6]/15 text-white"
                    : "border-[#1F2A36] bg-[#0F141B] text-[#9DA7B3] hover:bg-[#16202A] hover:text-white"
                }`}
              >
                {showAllSessions ? "Main sessions only" : "Show all sessions"}
              </button>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <span className="rounded-full border border-orange-400/25 bg-orange-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-orange-200">
              Orange = important
            </span>
            <span className="rounded-full border border-blue-400/25 bg-blue-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-blue-200">
              Blue = standard
            </span>
            <span className="rounded-full border border-[#2A3441] bg-[#0F141B] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#9DA7B3]">
              Gray = past
            </span>
            {!showAllSessions ? (
              <span className="rounded-full border border-[#2A3441] bg-[#0F141B] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#9DA7B3]">
                Default: Grand Prix + Qualifying
              </span>
            ) : null}
          </div>
        </div>
      </div>

      <div className="rounded-[24px] border border-[#1F2A36] bg-[#121821] p-5">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <h2 className="text-[20px] font-bold text-[#E6EDF3]">Season Timeline</h2>
            <div className="mt-1 text-[13px] text-[#9DA7B3]">Horizontal month markers for fast season scanning.</div>
          </div>
          <div className="text-[12px] uppercase tracking-[0.18em] text-[#7D8896]">{season}</div>
        </div>

        <div className="overflow-x-auto pb-2">
          <div className="flex min-w-max items-center gap-3">
            {timelineMonths.map((month) => (
              <button
                key={month.key}
                type="button"
                className="rounded-2xl border border-[#1F2A36] bg-[#0F141B] px-4 py-3 text-left transition hover:border-[#33506D] hover:bg-[#16202A]"
              >
                <div className="text-[11px] uppercase tracking-[0.16em] text-[#7D8896]">{month.label}</div>
                <div className="mt-1 text-[17px] font-semibold text-[#E6EDF3]">{month.count}</div>
                <div className="text-[12px] text-[#9DA7B3]">events</div>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex items-end justify-between gap-4">
        <div>
          <h2 className="text-[20px] font-bold text-[#E6EDF3]">{tab === "upcoming" ? "Upcoming events" : "Past events"}</h2>
          <div className="mt-1 text-[13px] text-[#9DA7B3]">
            {filteredRaces.length} events visible
            {showAllSessions ? " across all session types." : " with clutter removed by default."}
          </div>
        </div>
      </div>

      {filteredRaces.length === 0 ? (
        <div className="rounded-[24px] border border-[#1F2A36] bg-[#121821] p-6 text-[#9DA7B3]">
          No events match the current view.
        </div>
      ) : (
        <div
          className={
            viewMode === "grid"
              ? "grid gap-6 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4"
              : "grid gap-6"
          }
        >
          {filteredRaces.map((race) => (
            <EventCard key={race.id} race={race} tab={tab} viewMode={viewMode} />
          ))}
        </div>
      )}
    </section>
  );
}
