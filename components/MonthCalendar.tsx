"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Race } from "@/lib/types";
import { formatMonthLabel, raceLocationLabel } from "@/lib/utils";
import { Badge } from "./Badge";

function ymd(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function addDays(date: Date, days: number) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

function startOfWeekMonday(date: Date) {
  const next = new Date(date);
  const day = (next.getDay() + 6) % 7;
  next.setDate(next.getDate() - day);
  next.setHours(0, 0, 0, 0);
  return next;
}

function startOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function endOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0);
}

function getDayTone(races: Race[]) {
  if (races.some((race) => race.latviaInvolved)) return "lv";
  if (races.some((race) => race.region === "World")) return "world";
  if (races.some((race) => race.region === "Baltics")) return "neutral";
  return "hot";
}

export function MonthCalendar({ races }: { races: Race[] }) {
  const [cursor, setCursor] = useState(() => startOfMonth(new Date()));
  const todayIso = ymd(new Date());

  const { weeks, monthIndex } = useMemo(() => {
    const first = startOfMonth(cursor);
    const last = endOfMonth(cursor);
    const gridStart = startOfWeekMonday(first);
    const gridEnd = addDays(startOfWeekMonday(last), 6);

    const days: Date[] = [];
    for (let day = new Date(gridStart); day <= gridEnd; day = addDays(day, 1)) {
      days.push(new Date(day));
    }

    const weeks: Date[][] = [];
    for (let index = 0; index < days.length; index += 7) {
      weeks.push(days.slice(index, index + 7));
    }

    return {
      weeks,
      monthIndex: cursor.getMonth(),
    };
  }, [cursor]);

  const racesByDay = useMemo(() => {
    const map = new Map<string, Race[]>();

    for (const race of races) {
      const key = race.startDate;
      const current = map.get(key) ?? [];
      current.push(race);
      map.set(key, current);
    }

    return map;
  }, [races]);

  return (
    <section className="overflow-x-auto rounded-[32px] border border-white/10 bg-white/[0.045] p-4 md:p-5">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="text-xs uppercase tracking-[0.24em] text-white/45">Month calendar</div>
          <h2 className="mt-2 text-3xl font-black tracking-tight text-white">{formatMonthLabel(ymd(cursor))}</h2>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setCursor(startOfMonth(new Date()))}
            className="rounded-2xl border border-white/10 bg-[#0b1016] px-4 py-2 text-sm text-white/75 transition hover:bg-white/10"
          >
            This month
          </button>
          <button
            type="button"
            onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() - 1, 1))}
            className="rounded-2xl border border-white/10 bg-[#0b1016] px-4 py-2 text-sm text-white/75 transition hover:bg-white/10"
          >
            Previous
          </button>
          <button
            type="button"
            onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1))}
            className="rounded-2xl border border-white/10 bg-[#0b1016] px-4 py-2 text-sm text-white/75 transition hover:bg-white/10"
          >
            Next
          </button>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <Badge tone="lv">Latvia involved</Badge>
        <Badge tone="hot">Latvia</Badge>
        <Badge tone="neutral">Baltics</Badge>
        <Badge tone="world">World</Badge>
      </div>

      <div className="mt-6 grid min-w-[720px] grid-cols-7 gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-white/45">
        {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
          <div key={day} className="px-2 py-1">
            {day}
          </div>
        ))}
      </div>

      <div className="mt-2 grid min-w-[720px] gap-2">
        {weeks.map((week, weekIndex) => (
          <div key={weekIndex} className="grid grid-cols-7 gap-2">
            {week.map((day) => {
              const key = ymd(day);
              const dayRaces = racesByDay.get(key) ?? [];
              const isCurrentMonth = day.getMonth() === monthIndex;
              const tone = getDayTone(dayRaces);

              return (
                <div
                  key={key}
                  className={`min-h-[128px] rounded-[24px] border p-2 md:p-3 ${
                    isCurrentMonth
                      ? "border-white/10 bg-[#0b1016]"
                      : "border-white/5 bg-[#0b1016]/50 text-white/35"
                  } ${key === todayIso ? "ring-1 ring-orange-400/30" : ""}`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-semibold text-white/65">{day.getDate()}</span>
                    {dayRaces.length > 0 ? <Badge tone={tone}>{dayRaces.length}</Badge> : null}
                  </div>

                  <div className="mt-2 space-y-1.5">
                    {dayRaces.slice(0, 2).map((race) => (
                      <Link
                        key={race.id}
                        href={`/events/${race.id}`}
                        className={`block rounded-xl border px-2 py-1.5 text-[11px] leading-tight transition hover:bg-white/10 ${
                          race.latviaInvolved
                            ? "border-red-400/25 bg-red-500/10 text-red-100"
                            : race.region === "World"
                              ? "border-sky-400/25 bg-sky-500/10 text-sky-100"
                              : race.region === "Baltics"
                                ? "border-white/10 bg-white/5 text-white/80"
                                : "border-orange-400/25 bg-orange-500/10 text-orange-100"
                        }`}
                        title={`${race.title} | ${raceLocationLabel(race)}`}
                      >
                        <div className="truncate font-semibold">{race.title}</div>
                      </Link>
                    ))}

                    {dayRaces.length > 2 ? (
                      <div className="px-1 text-[11px] text-white/45">+{dayRaces.length - 2} more</div>
                    ) : null}
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </section>
  );
}
