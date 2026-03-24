"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Race } from "@/lib/types";
import { isoToDateLabel, raceLocationLabel } from "@/lib/utils";

function ymd(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function startOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function endOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0);
}

function addDays(date: Date, n: number) {
  const d = new Date(date);
  d.setDate(d.getDate() + n);
  return d;
}

function startOfWeekMonday(date: Date) {
  const d = new Date(date);
  const day = (d.getDay() + 6) % 7;
  d.setDate(d.getDate() - day);
  d.setHours(0, 0, 0, 0);
  return d;
}

export function MonthCalendar({ races }: { races: Race[] }) {
  const [cursor, setCursor] = useState(() => new Date());

  const { weeks, title } = useMemo(() => {
    const first = startOfMonth(cursor);
    const last = endOfMonth(cursor);
    const gridStart = startOfWeekMonday(first);
    const gridEnd = addDays(startOfWeekMonday(last), 6);

    const days: Date[] = [];
    for (let d = new Date(gridStart); d <= gridEnd; d = addDays(d, 1)) {
      days.push(new Date(d));
    }

    const weeks: Date[][] = [];
    for (let i = 0; i < days.length; i += 7) {
      weeks.push(days.slice(i, i + 7));
    }

    const monthName = cursor.toLocaleString("lv-LV", { month: "long" });
    return { weeks, title: `${monthName} ${cursor.getFullYear()}` };
  }, [cursor]);

  const byDay = useMemo(() => {
    const map = new Map<string, Race[]>();

    for (const race of races) {
      map.set(race.startDate, [...(map.get(race.startDate) ?? []), race]);
    }

    for (const [key, list] of map) {
      list.sort((a, b) => a.title.localeCompare(b.title));
      map.set(key, list);
    }

    return map;
  }, [races]);

  const monthIndex = cursor.getMonth();

  return (
    <section className="rounded-3xl border border-white/10 bg-white/5 p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="text-lg font-black capitalize">{title}</div>
        <div className="flex gap-2">
          <button
            className="rounded-xl border border-white/10 bg-[#0b0b0f] px-3 py-2 text-sm hover:bg-white/5"
            onClick={() => setCursor(new Date())}
          >
            Today
          </button>
          <button
            className="rounded-xl border border-white/10 bg-[#0b0b0f] px-3 py-2 text-sm hover:bg-white/5"
            onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() - 1, 1))}
          >
            ←
          </button>
          <button
            className="rounded-xl border border-white/10 bg-[#0b0b0f] px-3 py-2 text-sm hover:bg-white/5"
            onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1))}
          >
            →
          </button>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-7 gap-2 text-xs text-white/60">
        {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
          <div key={day} className="px-2">
            {day}
          </div>
        ))}
      </div>

      <div className="mt-2 grid gap-2">
        {weeks.map((week, weekIndex) => (
          <div key={weekIndex} className="grid grid-cols-7 gap-2">
            {week.map((day) => {
              const key = ymd(day);
              const list = byDay.get(key) ?? [];
              const isOtherMonth = day.getMonth() !== monthIndex;

              return (
                <div
                  key={key}
                  className={`min-h-[110px] rounded-2xl border border-white/10 bg-[#0b0b0f] p-2 ${
                    isOtherMonth ? "opacity-50" : ""
                  }`}
                >
                  <div className="text-xs text-white/60">{day.getDate()}</div>

                  <div className="mt-2 space-y-1">
                    {list.slice(0, 3).map((race) => (
                      <Link
                        key={race.id}
                        href={`/events/${race.id}`}
                        className={`block rounded-lg border px-2 py-1 text-[11px] leading-tight hover:bg-white/5 ${
                          race.latviaInvolved
                            ? "border-red-500/30 bg-red-500/10"
                            : race.region === "World"
                              ? "border-sky-500/25 bg-sky-500/10"
                              : "border-white/10 bg-white/5"
                        }`}
                        title={`${race.title} • ${raceLocationLabel(race)} • ${isoToDateLabel(race.startDate)}`}
                      >
                        <div className="truncate">{race.title}</div>
                      </Link>
                    ))}
                    {list.length > 3 ? (
                      <div className="px-1 text-[11px] text-white/60">+{list.length - 3} more</div>
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
