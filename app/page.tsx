import Link from "next/link";
import { Badge } from "@/components/Badge";
import { RaceCard } from "@/components/RaceCard";
import { SectionTitle } from "@/components/SectionTitle";
import { races } from "@/lib/data";
import { compareByDateAsc, isUpcoming } from "@/lib/utils";

export default function HomePage() {
  const upcoming = races.filter((race) => isUpcoming(race.startDate)).slice().sort(compareByDateAsc);

  const latviaHighlights = upcoming.filter((race) => race.region === "Latvia").slice(0, 4);
  const balticHighlights = upcoming.filter((race) => race.region === "Baltics").slice(0, 3);
  const kartingHighlights = upcoming.filter((race) => race.series === "Karting").slice(0, 3);

  return (
    <main className="space-y-10">
      <section className="rounded-3xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] p-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-black tracking-wide">
              Racing calendar <span className="text-orange-400">Latvia • Baltics • World</span>
            </h1>
            <p className="mt-2 text-white/70">
              Fast overview on the homepage, with deeper official schedules inside each series page.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Link
              className="rounded-xl border border-orange-500/30 bg-orange-500/15 px-4 py-2 hover:bg-orange-500/20"
              href="/series/f1"
            >
              Open F1
            </Link>
            <Link
              className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 hover:bg-white/10"
              href="/series/wrc"
            >
              Open WRC
            </Link>
            <Link
              className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 hover:bg-white/10"
              href="/calendar"
            >
              Full calendar
            </Link>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          <Badge tone="world">Fast homepage</Badge>
          <Badge tone="hot">F1 official import</Badge>
          <Badge tone="hot">WRC official import</Badge>
          <Badge tone="lv">Latvia highlights</Badge>
          <Badge tone="neutral">More local events</Badge>
        </div>
      </section>

      <section className="space-y-4">
        <SectionTitle>Upcoming Events</SectionTitle>
        <div className="grid gap-4 xl:grid-cols-2">
          <div className="rounded-3xl border border-sky-500/20 bg-sky-500/10 p-6">
            <div className="space-y-3">
              <Badge tone="world">F1</Badge>
              <h2 className="text-2xl font-black">Formula 1</h2>
              <p className="max-w-2xl text-white/70">
                Open the F1 series page to load the full official 2026 calendar, key sessions and event details.
              </p>
              <Link
                className="inline-flex rounded-xl border border-sky-400/30 bg-sky-400/15 px-5 py-3 font-semibold hover:bg-sky-400/20"
                href="/series/f1"
              >
                View upcoming F1 races →
              </Link>
            </div>
          </div>

          <div className="rounded-3xl border border-orange-500/20 bg-orange-500/10 p-6">
            <div className="space-y-3">
              <Badge tone="hot">WRC</Badge>
              <h2 className="text-2xl font-black">World Rally Championship</h2>
              <p className="max-w-2xl text-white/70">
                Open the WRC series page to load official rally rounds and enriched event pages from wrc.com.
              </p>
              <Link
                className="inline-flex rounded-xl border border-orange-400/30 bg-orange-400/15 px-5 py-3 font-semibold hover:bg-orange-400/20"
                href="/series/wrc"
              >
                View upcoming WRC rallies →
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          <SectionTitle>Latvia Highlights</SectionTitle>
          <Link className="text-sm text-orange-300 hover:text-orange-200" href="/calendar">
            Open full local calendar →
          </Link>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {latviaHighlights.map((race) => (
            <RaceCard key={race.id} race={race} />
          ))}
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <div className="space-y-4">
          <SectionTitle>Baltics</SectionTitle>
          <div className="grid gap-4">
            {balticHighlights.map((race) => (
              <RaceCard key={race.id} race={race} />
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <SectionTitle>Karting</SectionTitle>
          <div className="grid gap-4">
            {kartingHighlights.map((race) => (
              <RaceCard key={race.id} race={race} />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
