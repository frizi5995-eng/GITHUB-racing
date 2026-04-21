import Link from "next/link";
import { Race } from "@/lib/types";
import {
  formatCountdown,
  formatDateRange,
  getRaceStatus,
  getRaceStatusLabel,
  getRaceStatusTone,
  getRegionTone,
  getSeriesTone,
  raceLocationLabel,
} from "@/lib/utils";
import { Badge } from "./Badge";
import { HighlightedText } from "./HighlightedText";

export function RaceCard({
  race,
  compact = false,
  searchQuery,
}: {
  race: Race;
  compact?: boolean;
  searchQuery?: string;
}) {
  const status = getRaceStatus(race);

  return (
    <Link
      href={`/events/${race.id}`}
      className={`group block rounded-[28px] border bg-white/[0.045] p-5 transition duration-300 hover:border-orange-400/30 hover:bg-white/[0.075] hover:shadow-[0_24px_70px_rgba(0,0,0,0.35)] ${
        race.featured ? "border-orange-400/20" : "border-white/10"
      }`}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          <Badge tone={getSeriesTone(race.series)}>{race.series}</Badge>
          <Badge tone={getRegionTone(race.region)}>{race.region}</Badge>
          <Badge tone={getRaceStatusTone(status)}>{getRaceStatusLabel(status)}</Badge>
          {race.latviaInvolved ? <Badge tone="lv">Latvia involved</Badge> : null}
          {race.source.type === "imported" ? <Badge tone="world">Official import</Badge> : null}
          {race.featured ? <Badge tone="hot">Featured</Badge> : null}
        </div>
        <div className="text-xs font-medium text-orange-200/80">{formatCountdown(race.startDate)}</div>
      </div>

      <div className="mt-4 flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h3 className="text-xl font-bold tracking-tight text-white">
            <HighlightedText text={race.title} query={searchQuery} />
          </h3>
          <p className="mt-2 text-sm text-white/65">{formatDateRange(race.startDate, race.endDate)}</p>
          <p className="mt-1 text-sm text-white/65">
            <HighlightedText text={raceLocationLabel(race)} query={searchQuery} />
          </p>
          {!compact && race.description ? (
            <p className="mt-4 line-clamp-3 text-sm leading-6 text-white/72">{race.description}</p>
          ) : null}
        </div>

        <div className="hidden h-14 w-14 shrink-0 rounded-2xl border border-white/10 bg-[radial-gradient(circle_at_20%_20%,rgba(251,146,60,0.4),transparent_45%),linear-gradient(145deg,rgba(255,255,255,0.06),rgba(255,255,255,0.02))] md:block" />
      </div>

      <div className="mt-5 flex items-center justify-between gap-3 text-sm text-white/55">
        <span>{race.city}</span>
        <span className="text-orange-200 transition group-hover:text-white">
          Open event
        </span>
      </div>
    </Link>
  );
}
