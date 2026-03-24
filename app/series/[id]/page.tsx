import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge } from "@/components/Badge";
import { SeriesEventsClient } from "@/components/SeriesEventsClient";
import { getSeriesRaces } from "@/lib/races";
import { getSeriesConfigBySlug } from "@/lib/series";

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

  const seriesRaces = await getSeriesRaces(series.code);

  return (
    <main className="space-y-6">
      <section className="rounded-[24px] border border-[#1F2A36] bg-[#121821] p-6 shadow-[0_20px_80px_rgba(0,0,0,0.35)]">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-3">
            <Badge tone="world">{series.code}</Badge>
            <h1 className="text-3xl font-black tracking-tight md:text-4xl">{series.name}</h1>
            <p className="max-w-2xl text-[#9DA7B3]">{series.description}</p>
          </div>

          <Link
            href="/series"
            className="rounded-xl border border-[#1F2A36] bg-[#0F141B] px-4 py-2 text-sm text-[#E6EDF3] transition hover:bg-[#16202A]"
          >
            All series
          </Link>
        </div>
      </section>

      <SeriesEventsClient races={seriesRaces} seriesCode={series.code} seriesName={series.name} />
    </main>
  );
}
