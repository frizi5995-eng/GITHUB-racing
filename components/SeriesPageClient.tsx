"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Badge } from "@/components/Badge";
import { FavoriteButton } from "@/components/FavoriteButton";
import { SectionTitle } from "@/components/SectionTitle";
import { formatDateRange } from "@/lib/utils";

type SeriesOverviewItem = {
  config?: {
    slug: string;
    code: string;
    name: string;
    description: string;
    shortDescription: string;
    popularity: number;
    regionFocus: string;
  } | null;
  count: number;
  upcomingCount: number;
  nextRace?: {
    title: string;
    startDate: string;
    endDate?: string;
    city: string;
    country: string;
  };
  regionSpread: string[];
  popularityScore: number;
  monthlyPopularity: number;
};

export function SeriesPageClient({ overview }: { overview: SeriesOverviewItem[] }) {
  const [popularityFilter, setPopularityFilter] = useState<"all" | "top" | "regional">("all");

  const filtered = useMemo(() => {
    if (popularityFilter === "top") {
      return overview.filter((item) => item.popularityScore >= 140);
    }

    if (popularityFilter === "regional") {
      return overview.filter((item) => item.regionSpread.includes("Latvia") || item.regionSpread.includes("Baltics"));
    }

    return overview;
  }, [overview, popularityFilter]);

  const popularThisMonth = useMemo(
    () =>
      overview
        .filter((item) => item.monthlyPopularity > 0)
        .slice()
        .sort((a, b) => b.monthlyPopularity - a.monthlyPopularity)
        .slice(0, 3),
    [overview],
  );

  return (
    <main className="space-y-8">
      <section className="rounded-[32px] border border-white/10 bg-[linear-gradient(140deg,rgba(56,189,248,0.14),rgba(12,16,22,0.94)_36%,rgba(248,113,113,0.1)_100%)] p-6 md:p-8">
        <p className="text-xs uppercase tracking-[0.28em] text-sky-100/80">Series hub</p>
        <h1 className="mt-3 text-4xl font-black tracking-tight text-white md:text-5xl">
          Explore world championships and local racing categories from one place.
        </h1>
        <p className="mt-4 max-w-3xl text-base leading-7 text-white/72">
          Filter by popularity, spot what is hot this month, and save favorite series for faster return visits.
        </p>
      </section>

      <div className="rounded-[28px] border border-white/10 bg-white/[0.045] p-4">
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => setPopularityFilter("all")}
            className={`rounded-2xl px-4 py-2 text-sm transition ${
              popularityFilter === "all" ? "bg-orange-500/16 text-white" : "bg-[#0b1016] text-white/70 hover:bg-white/10"
            }`}
          >
            All series
          </button>
          <button
            type="button"
            onClick={() => setPopularityFilter("top")}
            className={`rounded-2xl px-4 py-2 text-sm transition ${
              popularityFilter === "top" ? "bg-orange-500/16 text-white" : "bg-[#0b1016] text-white/70 hover:bg-white/10"
            }`}
          >
            High popularity
          </button>
          <button
            type="button"
            onClick={() => setPopularityFilter("regional")}
            className={`rounded-2xl px-4 py-2 text-sm transition ${
              popularityFilter === "regional" ? "bg-orange-500/16 text-white" : "bg-[#0b1016] text-white/70 hover:bg-white/10"
            }`}
          >
            Latvia and Baltics focus
          </button>
        </div>
      </div>

      {popularThisMonth.length > 0 ? (
        <section className="space-y-4">
          <SectionTitle subtitle="Series currently carrying the strongest month-level activity and popularity.">
            Popular this month
          </SectionTitle>
          <div className="grid gap-4 xl:grid-cols-3">
            {popularThisMonth.map((item) => (
              <Link
                key={item.config!.slug}
                href={`/series/${item.config!.slug}`}
                className="rounded-[28px] border border-white/10 bg-white/[0.045] p-5 transition hover:bg-white/[0.075]"
              >
                <div className="flex flex-wrap gap-2">
                  <Badge tone="world">{item.config!.code}</Badge>
                  <Badge tone="hot">{item.monthlyPopularity} monthly score</Badge>
                </div>
                <div className="mt-4 text-2xl font-black tracking-tight text-white">{item.config!.name}</div>
                <div className="mt-2 text-sm text-white/60">{item.config!.regionFocus}</div>
              </Link>
            ))}
          </div>
        </section>
      ) : null}

      <section className="space-y-4">
        <SectionTitle subtitle="Descriptions, coverage footprint and quick stats for every trackable series.">
          Popular series
        </SectionTitle>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((item) => (
            <div
              key={item.config!.slug}
              className="group rounded-[28px] border border-white/10 bg-white/[0.045] p-5 transition hover:border-orange-400/30 hover:bg-white/[0.075]"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex flex-wrap gap-2">
                  <Badge tone="world">{item.config!.code}</Badge>
                  <Badge tone="neutral">{item.config!.regionFocus}</Badge>
                </div>
                <FavoriteButton itemId={item.config!.slug} kind="series" label="Save series" />
              </div>

              <Link href={`/series/${item.config!.slug}`} className="block">
                <h2 className="mt-4 text-2xl font-black tracking-tight text-white">{item.config!.name}</h2>
                <p className="mt-3 text-sm leading-6 text-white/68">{item.config!.description}</p>

                <div className="mt-5 flex flex-wrap gap-2">
                  <Badge tone="neutral">{item.count} events</Badge>
                  <Badge tone="hot">{item.upcomingCount} upcoming</Badge>
                  <Badge tone="world">Popularity {item.popularityScore}</Badge>
                </div>

                {item.nextRace ? (
                  <div className="mt-5 rounded-2xl border border-white/10 bg-[#0b1016] p-4">
                    <div className="text-xs uppercase tracking-[0.18em] text-white/45">Next event</div>
                    <div className="mt-2 text-lg font-bold text-white">{item.nextRace.title}</div>
                    <div className="mt-1 text-sm text-white/55">
                      {formatDateRange(item.nextRace.startDate, item.nextRace.endDate)} | {item.nextRace.city}, {item.nextRace.country}
                    </div>
                  </div>
                ) : null}

                <div className="mt-5 text-sm text-orange-200 transition group-hover:text-white">Open series page</div>
              </Link>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
