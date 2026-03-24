import Link from "next/link";
import { Race } from "@/lib/types";
import { isoToDateLabel, raceLocationLabel } from "@/lib/utils";
import { Badge } from "./Badge";

export function RaceCard({ race }: { race: Race }) {
  return (
    <Link
      href={`/events/${race.id}`}
      className="block rounded-2xl border border-white/10 bg-white/5 p-4 transition hover:bg-white/10"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-sm text-white/60">{isoToDateLabel(race.startDate)}</div>
          <div className="mt-1 text-base font-bold">{race.title}</div>
          <div className="mt-1 text-sm text-white/70">{raceLocationLabel(race)}</div>
        </div>
        <div className="flex flex-col items-end gap-2">
          <Badge tone={race.region === "World" ? "world" : "neutral"}>{race.region}</Badge>
          {race.latviaInvolved ? <Badge tone="lv">Latvia</Badge> : null}
          <Badge tone="hot">{race.series}</Badge>
        </div>
      </div>
    </Link>
  );
}
