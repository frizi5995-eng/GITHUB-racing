import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge } from "@/components/Badge";
import { FavoriteButton } from "@/components/FavoriteButton";
import { LiveCountdown } from "@/components/LiveCountdown";
import { SectionTitle } from "@/components/SectionTitle";
import { SeriesEventsClient } from "@/components/SeriesEventsClient";
import { getSeriesRaces } from "@/lib/races";
import { getSeriesConfigBySlug } from "@/lib/series";
import { isUpcoming } from "@/lib/utils";

export default async function SeriesDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const series = getSeriesConfigBySlug(id);

  if (!series) {
    notFound();
  }

  const races = await getSeriesRaces(series.code);
  const upcoming = races.filter((race) => isUpcoming(race.startDate));
  const regionDistribution = races.reduce<Record<string, number>>((accumulator, race) => {
    accumulator[race.region] = (accumulator[race.region] ?? 0) + 1;
    return accumulator;
  }, {});

  return (
    <main className="space-y-8">
      <section className="rounded-[32px] border border-white/10 bg-[linear-gradient(145deg,rgba(56,189,248,0.16),rgba(12,16,22,0.94)_38%,rgba(251,146,60,0.12)_100%)] p-6 md:p-8">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
          <div className="max-w-3xl">
            <div className="flex flex-wrap gap-2">
              <Badge tone="world">{series.code}</Badge>
              <Badge tone="hot">{upcoming.length} upcoming</Badge>
            </div>
            <h1 className="mt-4 text-4xl font-black tracking-tight text-white md:text-5xl">{series.name}</h1>
            <p className="mt-4 text-base leading-7 text-white/72">{series.description}</p>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-white/58">{series.spotlight}</p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/series"
              className="rounded-2xl border border-white/10 bg-white/6 px-5 py-3 text-sm text-white/78 transition hover:bg-white/10"
            >
              All series
            </Link>
            <FavoriteButton itemId={series.slug} kind="series" label="Save series" />
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <div className="rounded-[24px] border border-white/10 bg-white/[0.045] p-5">
          <div className="text-xs uppercase tracking-[0.2em] text-white/45">Upcoming events</div>
          <div className="mt-3 text-4xl font-black tracking-tight text-white">{upcoming.length}</div>
        </div>
        <div className="rounded-[24px] border border-white/10 bg-white/[0.045] p-5">
          <div className="text-xs uppercase tracking-[0.2em] text-white/45">Total events</div>
          <div className="mt-3 text-4xl font-black tracking-tight text-white">{races.length}</div>
        </div>
        <div className="rounded-[24px] border border-white/10 bg-white/[0.045] p-5">
          <div className="text-xs uppercase tracking-[0.2em] text-white/45">Region spread</div>
          <div className="mt-4 flex flex-wrap gap-2">
            {Object.entries(regionDistribution).map(([region, count]) => (
              <Badge key={region} tone={region === "World" ? "world" : region === "Latvia" ? "lv" : "neutral"}>
                {region} {count}
              </Badge>
            ))}
          </div>
        </div>
      </section>

      {upcoming[0] ? <LiveCountdown targetDate={upcoming[0].startDate} label="Next event countdown" /> : null}

      <section className="space-y-4">
        <SectionTitle subtitle={series.shortDescription}>Series overview</SectionTitle>
        <div className="rounded-[28px] border border-white/10 bg-white/[0.045] p-6 text-white/72">
          {series.spotlight}
        </div>
      </section>

      <SeriesEventsClient races={races} seriesName={series.name} />
    </main>
  );
}
