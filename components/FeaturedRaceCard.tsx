import Link from "next/link";
import { Race } from "@/lib/types";
import {
  formatDateRange,
  getRaceStatus,
  getRaceStatusLabel,
  getRaceStatusTone,
  getRegionTone,
  getSeriesTone,
  raceLocationLabel,
} from "@/lib/utils";
import { Badge } from "./Badge";
import { LiveCountdown } from "./LiveCountdown";

export function FeaturedRaceCard({ race }: { race: Race }) {
  const status = getRaceStatus(race);

  return (
    <Link
      href={`/events/${race.id}`}
      className="group block overflow-hidden rounded-[32px] border border-white/10 bg-[linear-gradient(150deg,rgba(248,113,113,0.14),rgba(12,16,22,0.94)_38%,rgba(56,189,248,0.08))] p-6 transition duration-300 hover:border-orange-400/30 hover:shadow-[0_28px_80px_rgba(0,0,0,0.38)]"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          <Badge tone={getSeriesTone(race.series)}>{race.series}</Badge>
          <Badge tone={getRegionTone(race.region)}>{race.region}</Badge>
          <Badge tone={getRaceStatusTone(status)}>{getRaceStatusLabel(status)}</Badge>
          {race.latviaInvolved ? <Badge tone="lv">Latvia involved</Badge> : null}
        </div>
        <div className="rounded-full border border-white/10 bg-white/6 px-3 py-1 text-xs text-white/60">
          Featured event
        </div>
      </div>

      <div className="mt-5 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div>
          <h3 className="text-3xl font-black tracking-tight text-white">{race.title}</h3>
          <p className="mt-3 text-sm text-white/72">{formatDateRange(race.startDate, race.endDate)}</p>
          <p className="mt-1 text-sm text-white/60">{raceLocationLabel(race)}</p>
          {race.description ? <p className="mt-4 max-w-2xl text-sm leading-7 text-white/72">{race.description}</p> : null}
        </div>

        <div className="rounded-[24px] border border-white/10 bg-black/20 p-4">
          <LiveCountdown targetDate={race.startDate} label="Starts in" compact />
          <div className="mt-4 text-sm text-orange-200 transition group-hover:text-white">Open featured event</div>
        </div>
      </div>
    </Link>
  );
}
