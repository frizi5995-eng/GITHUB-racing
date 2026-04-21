"use client";

import Link from "next/link";
import { DriverCard } from "@/components/DriverCard";
import { FeaturedRaceCard } from "@/components/FeaturedRaceCard";
import { LatviaModeToggle } from "@/components/LatviaModeToggle";
import { LiveCountdown } from "@/components/LiveCountdown";
import { PaddockTicker } from "@/components/PaddockTicker";
import { RaceCard } from "@/components/RaceCard";
import { SectionTitle } from "@/components/SectionTitle";
import { Badge } from "@/components/Badge";
import { useLatviaModePreference, useStoredFavorites, useStoredRecent } from "@/lib/clientStorage";
import { Driver, Race } from "@/lib/types";
import { compareByDateAsc, getRacePopularityScore, isUpcoming, isWithinNextDays } from "@/lib/utils";

type SeriesOverviewItem = {
  config?: {
    slug: string;
    code: string;
    name: string;
    popularity: number;
    regionFocus: string;
  } | null;
  count: number;
  upcomingCount: number;
  nextRace?: Race;
  regionSpread: string[];
  popularityScore: number;
  monthlyPopularity: number;
};

function pickByIds<T extends { id: string }>(ids: string[], items: T[]) {
  return ids
    .map((id) => items.find((item) => item.id === id))
    .filter(Boolean) as T[];
}

export function HomePageClient({
  races,
  drivers,
  upcomingCountByDriver,
  seriesOverview,
}: {
  races: Race[];
  drivers: Driver[];
  upcomingCountByDriver: Record<string, number>;
  seriesOverview: SeriesOverviewItem[];
}) {
  const [latviaMode] = useLatviaModePreference();
  const [favoriteEvents] = useStoredFavorites("events");
  const [favoriteDrivers] = useStoredFavorites("drivers");
  const [favoriteSeries] = useStoredFavorites("series");
  const recentEventIds = useStoredRecent("events");
  const recentDriverIds = useStoredRecent("drivers");

  const visibleRaces = latviaMode ? races.filter((race) => race.latviaInvolved) : races;
  const upcoming = visibleRaces.filter((race) => isUpcoming(race.startDate));
  const nextMajorRace = upcoming
    .slice()
    .sort(
      (a, b) =>
        Number(b.featured) - Number(a.featured) ||
        getRacePopularityScore(b) - getRacePopularityScore(a) ||
        compareByDateAsc(a, b),
    )[0];
  const featured = upcoming
    .filter((race) => race.featured)
    .slice()
    .sort((a, b) => getRacePopularityScore(b) - getRacePopularityScore(a) || compareByDateAsc(a, b))
    .slice(0, 3);
  const trending = upcoming
    .filter((race) => isWithinNextDays(race.startDate, 30))
    .slice()
    .sort((a, b) => getRacePopularityScore(b) - getRacePopularityScore(a) || compareByDateAsc(a, b))
    .slice(0, 4);
  const weeklyGroups = {
    Latvia: upcoming.filter((race) => race.region === "Latvia" && isWithinNextDays(race.startDate, 7)),
    Baltics: upcoming.filter((race) => race.region === "Baltics" && isWithinNextDays(race.startDate, 7)),
    World: upcoming.filter((race) => race.region === "World" && isWithinNextDays(race.startDate, 7)),
  };
  const recentEvents = pickByIds(recentEventIds, races).slice(0, 3);
  const recentDrivers = pickByIds(recentDriverIds, drivers).slice(0, 3);
  const latvianDrivers = drivers.filter((driver) => driver.nationality === "Latvia");
  const topDrivers = latvianDrivers
    .slice()
    .sort(
      (a, b) =>
        (upcomingCountByDriver[b.id] ?? 0) - (upcomingCountByDriver[a.id] ?? 0) ||
        Number(b.featured) - Number(a.featured) ||
        a.name.localeCompare(b.name),
    )
    .slice(0, 3);
  const favoriteSummary = [
    { label: "Saved races", value: favoriteEvents.length },
    { label: "Saved drivers", value: favoriteDrivers.length },
    { label: "Saved series", value: favoriteSeries.length },
  ];
  const seriesThisMonth = seriesOverview
    .filter((item) => item.monthlyPopularity > 0)
    .slice()
    .sort((a, b) => b.monthlyPopularity - a.monthlyPopularity)
    .slice(0, 3);

  return (
    <main className="space-y-10">
      <section className="rounded-[36px] border border-white/10 bg-[linear-gradient(140deg,rgba(248,113,113,0.22),rgba(12,16,22,0.94)_35%,rgba(56,189,248,0.08)_100%)] p-6 md:p-10">
        <div className="grid gap-8 xl:grid-cols-[1.35fr_0.85fr]">
          <div className="max-w-3xl">
            <div className="flex flex-wrap gap-2">
              <Badge tone="lv">Latvia-first</Badge>
              <Badge tone="hot">Featured racing</Badge>
              <Badge tone="world">Live countdowns</Badge>
            </div>
            <h1 className="mt-5 text-4xl font-black tracking-tight text-white md:text-6xl">
              A motorsport platform built to keep fans exploring.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-white/74 md:text-lg">
              Featured races, weekly overview, live countdowns, recently viewed pages and persistent Latvia mode make RaceHub feel more like a product you return to than a simple schedule grid.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/calendar"
                className="rounded-2xl border border-orange-400/30 bg-orange-500/16 px-5 py-3 text-sm font-semibold text-white transition hover:bg-orange-500/22"
              >
                Open calendar
              </Link>
              <Link
                href="/favorites"
                className="rounded-2xl border border-white/10 bg-white/6 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Open favorites
              </Link>
              <LatviaModeToggle />
            </div>

            <div className="mt-5">
              <PaddockTicker races={upcoming} />
            </div>
          </div>

          <div className="grid gap-4">
            {nextMajorRace ? (
              <div className="rounded-[28px] border border-white/10 bg-black/20 p-5">
                <div className="text-xs uppercase tracking-[0.22em] text-white/45">Next major race</div>
                <div className="mt-3 text-2xl font-black tracking-tight text-white">{nextMajorRace.title}</div>
                <div className="mt-1 text-sm text-white/60">{nextMajorRace.city}, {nextMajorRace.country}</div>
                <div className="mt-4">
                  <LiveCountdown targetDate={nextMajorRace.startDate} label="Starts in" compact />
                </div>
              </div>
            ) : null}

            <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-1">
              {favoriteSummary.map((stat) => (
                <div key={stat.label} className="rounded-[24px] border border-white/10 bg-black/20 p-5">
                  <div className="text-xs uppercase tracking-[0.22em] text-white/45">{stat.label}</div>
                  <div className="mt-3 text-4xl font-black tracking-tight text-white">{stat.value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {featured.length > 0 ? (
        <section className="space-y-4">
          <SectionTitle subtitle="The biggest or most useful races are promoted with stronger visuals and live countdown context.">
            Featured events
          </SectionTitle>
          <div className="grid gap-5">
            {featured.map((race) => (
              <FeaturedRaceCard key={race.id} race={race} />
            ))}
          </div>
        </section>
      ) : null}

      <section className="space-y-4">
        <SectionTitle subtitle="Grouped by Latvia, Baltics and world, with Latvia mode respected automatically.">
          This week in motorsport
        </SectionTitle>
        <div className="grid gap-4 xl:grid-cols-3">
          {(["Latvia", "Baltics", "World"] as const).map((region) => (
            <div key={region} className="rounded-[28px] border border-white/10 bg-white/[0.045] p-5">
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-xl font-black tracking-tight text-white">{region}</h3>
                <Badge tone={region === "Latvia" ? "lv" : region === "World" ? "world" : "neutral"}>
                  {weeklyGroups[region].length}
                </Badge>
              </div>
              <div className="mt-4 grid gap-3">
                {weeklyGroups[region].length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-white/10 bg-[#0b1016] p-4 text-sm text-white/55">
                    No races in this region over the next 7 days.
                  </div>
                ) : (
                  weeklyGroups[region].map((race) => (
                    <Link
                      key={race.id}
                      href={`/events/${race.id}`}
                      className="rounded-2xl border border-white/10 bg-[#0b1016] p-4 transition hover:bg-white/10"
                    >
                      <div className="flex flex-wrap gap-2">
                        <Badge tone="hot">{race.series}</Badge>
                        {race.latviaInvolved ? <Badge tone="lv">Latvia involved</Badge> : null}
                      </div>
                      <div className="mt-3 text-lg font-bold text-white">{race.title}</div>
                      <div className="mt-1 text-sm text-white/60">{race.city}, {race.country}</div>
                    </Link>
                  ))
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-8 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-4">
          <SectionTitle subtitle="Races that should attract the most clicks this month.">Trending races</SectionTitle>
          <div className="grid gap-4 md:grid-cols-2">
            {trending.map((race) => (
              <RaceCard key={race.id} race={race} compact />
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <SectionTitle subtitle="Latvian drivers with the strongest upcoming activity.">Top drivers this month</SectionTitle>
          <div className="grid gap-4">
            {topDrivers.map((driver) => (
              <DriverCard
                key={driver.id}
                driver={driver}
                upcomingCount={upcomingCountByDriver[driver.id] ?? 0}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-8 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-4">
          <SectionTitle subtitle="Recently opened content helps users keep exploring without losing context.">
            Recently viewed
          </SectionTitle>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-[28px] border border-white/10 bg-white/[0.045] p-5">
              <h3 className="text-xl font-black tracking-tight text-white">Events</h3>
              <div className="mt-4 grid gap-3">
                {recentEvents.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-white/10 bg-[#0b1016] p-4 text-sm text-white/55">
                    Open a few event pages and they will appear here.
                  </div>
                ) : (
                  recentEvents.map((race) => <RaceCard key={race.id} race={race} compact />)
                )}
              </div>
            </div>

            <div className="rounded-[28px] border border-white/10 bg-white/[0.045] p-5">
              <h3 className="text-xl font-black tracking-tight text-white">Drivers</h3>
              <div className="mt-4 grid gap-3">
                {recentDrivers.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-white/10 bg-[#0b1016] p-4 text-sm text-white/55">
                    Recently viewed drivers and riders will show up here.
                  </div>
                ) : (
                  recentDrivers.map((driver) => (
                    <DriverCard
                      key={driver.id}
                      driver={driver}
                      upcomingCount={upcomingCountByDriver[driver.id] ?? 0}
                    />
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <SectionTitle subtitle="Useful shortcuts that encourage return visits and deeper browsing.">
            Quick access
          </SectionTitle>
          <div className="grid gap-4">
            <Link href="/favorites" className="rounded-[28px] border border-white/10 bg-white/[0.045] p-5 transition hover:bg-white/[0.075]">
              <div className="flex flex-wrap gap-2">
                <Badge tone="hot">Favorites</Badge>
                <Badge tone="world">{favoriteEvents.length + favoriteDrivers.length + favoriteSeries.length} saved</Badge>
              </div>
              <div className="mt-4 text-2xl font-black tracking-tight text-white">Saved events, drivers and series</div>
              <p className="mt-3 text-sm leading-6 text-white/68">Keep a personal shortlist and jump back in quickly.</p>
            </Link>

            <Link href="/feedback" className="rounded-[28px] border border-white/10 bg-white/[0.045] p-5 transition hover:bg-white/[0.075]">
              <div className="flex flex-wrap gap-2">
                <Badge tone="lv">Community tips</Badge>
                <Badge tone="neutral">Mail-ready</Badge>
              </div>
              <div className="mt-4 text-2xl font-black tracking-tight text-white">Suggest an event or idea</div>
              <p className="mt-3 text-sm leading-6 text-white/68">Send missing races, driver updates, or product feedback straight from the site.</p>
            </Link>

            <div className="rounded-[28px] border border-white/10 bg-white/[0.045] p-5">
              <div className="flex flex-wrap gap-2">
                <Badge tone="world">Popular this month</Badge>
              </div>
              <div className="mt-4 grid gap-3">
                {seriesThisMonth.map((item) => (
                  <Link
                    key={item.config?.slug}
                    href={`/series/${item.config?.slug}`}
                    className="rounded-2xl border border-white/10 bg-[#0b1016] p-4 transition hover:bg-white/10"
                  >
                    <div className="text-lg font-bold text-white">{item.config?.name}</div>
                    <div className="mt-1 text-sm text-white/58">{item.config?.regionFocus}</div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
