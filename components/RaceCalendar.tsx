"use client";

import { MonthCalendar } from "@/components/MonthCalendar";
import { Race } from "@/lib/types";

export function RaceCalendar({ races }: { races: Race[] }) {
  return <MonthCalendar races={races} />;
}
