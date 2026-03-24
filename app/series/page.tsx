import Link from "next/link";
import { Badge } from "@/components/Badge";
import { SectionTitle } from "@/components/SectionTitle";
import { getAllRaces } from "@/lib/races";
import { SERIES_CONFIG } from "@/lib/series";
import { compareByDateAsc, isUpcoming, isoToDateLabel } from "@/lib/utils";

export default async function SeriesPage() {
  const races = await getAllRaces();

  return (
    <main className="space-y-6">
      <SectionTitle>Browse By Series</SectionTitle>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {SERIES_CONFIG.map((series) => {
          const seriesRaces = races.filter((race) => race.series === series.code).slice().sort(compareByDateAsc);
          const upcoming = seriesRaces.filter((race) => isUpcoming(race.startDate));
          const nextRace = upcoming[0];

          return (
            <div key={series.slug} className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <div className="flex items-center justify-between gap-3">
                <div className="text-lg font-bold">{series.name}</div>
                <Badge tone={series.code === "WRC" ? "hot" : "world"}>{series.code}</Badge>
              </div>

              <p className="mt-2 text-white/70">{series.description}</p>

              <div className="mt-4 flex flex-wrap gap-2">
                <Badge tone="neutral">{seriesRaces.length} total</Badge>
                <Badge tone="neutral">{upcoming.length} upcoming</Badge>
              </div>

              {nextRace ? (
                <div className="mt-4 rounded-xl border border-white/10 bg-[#0f141b] p-3">
                  <div className="text-xs uppercase tracking-[0.16em] text-white/50">Next event</div>
                  <div className="mt-2 font-semibold">{nextRace.title}</div>
                  <div className="mt-1 text-sm text-white/60">{isoToDateLabel(nextRace.startDate)}</div>
                </div>
              ) : null}

              <Link
                className="mt-4 inline-block text-orange-300 hover:text-orange-200"
                href={`/series/${series.slug}`}
              >
                Open calendar →
              </Link>
            </div>
          );
        })}
      </div>
    </main>
  );
}
