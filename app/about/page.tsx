import Link from "next/link";
import { Badge } from "@/components/Badge";
import { getImportStatus } from "@/lib/importSources";

export default function AboutPage() {
  const importStatus = getImportStatus();

  return (
    <main className="space-y-8">
      <section className="rounded-[32px] border border-white/10 bg-[linear-gradient(145deg,rgba(251,146,60,0.16),rgba(12,16,22,0.94)_42%,rgba(56,189,248,0.08)_100%)] p-6 md:p-8">
        <div className="flex flex-wrap gap-2">
          <Badge tone="lv">Latvia-first product</Badge>
          <Badge tone="world">Scalable architecture</Badge>
        </div>
        <h1 className="mt-4 text-4xl font-black tracking-tight text-white md:text-5xl">About the project</h1>
        <p className="mt-4 max-w-3xl text-base leading-7 text-white/72">
          RaceHub is designed as a real motorsport product, not a one-page demo. The goal is to give Latvian fans a practical place to discover races, follow Latvian participation and still keep the biggest world series close at hand.
        </p>
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <div className="rounded-[28px] border border-white/10 bg-white/[0.045] p-6">
          <h2 className="text-2xl font-black tracking-tight text-white">What the platform does</h2>
          <div className="mt-5 grid gap-3 text-sm leading-6 text-white/72">
            <div className="rounded-2xl border border-white/10 bg-[#0b1016] p-4">Shows upcoming races in calendar and list formats.</div>
            <div className="rounded-2xl border border-white/10 bg-[#0b1016] p-4">Filters by Latvia, Baltics, world, series and Latvian participation.</div>
            <div className="rounded-2xl border border-white/10 bg-[#0b1016] p-4">Highlights Latvian drivers and links them to upcoming events.</div>
            <div className="rounded-2xl border border-white/10 bg-[#0b1016] p-4">Supports both manual curation and imported official calendars.</div>
          </div>
        </div>

        <div className="rounded-[28px] border border-white/10 bg-white/[0.045] p-6">
          <h2 className="text-2xl font-black tracking-tight text-white">How it is built</h2>
          <div className="mt-5 grid gap-3 text-sm leading-6 text-white/72">
            <div className="rounded-2xl border border-white/10 bg-[#0b1016] p-4">A unified race type powers all pages, filters and imports.</div>
            <div className="rounded-2xl border border-white/10 bg-[#0b1016] p-4">Local data fills Baltic and Latvia-specific gaps where official feeds are limited.</div>
            <div className="rounded-2xl border border-white/10 bg-[#0b1016] p-4">F1 and WRC support imported schedules, with fallback protection when a source is unavailable.</div>
            <div className="rounded-2xl border border-white/10 bg-[#0b1016] p-4">Favorites, recent views and ICS export add practical usefulness without overcomplicating the stack.</div>
          </div>
        </div>
      </section>

      <section className="rounded-[28px] border border-white/10 bg-white/[0.045] p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <div className="flex flex-wrap gap-2">
              <Badge tone={importStatus.liveImportsEnabled ? "lv" : "neutral"}>
                Live imports {importStatus.liveImportsEnabled ? "on" : "off"}
              </Badge>
              <Badge tone="world">{importStatus.timeoutMs}ms timeout</Badge>
            </div>
            <h2 className="mt-4 text-2xl font-black tracking-tight text-white">Automation and data sources</h2>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-white/68">
              RaceHub keeps fast curated fallback data by default. Set RACEHUB_ENABLE_LIVE_IMPORTS=true in production to let supported official F1 and WRC sources refresh automatically while keeping fallback protection.
            </p>
          </div>
          <Link
            href="/api/imports/status"
            className="rounded-2xl border border-white/10 bg-[#0b1016] px-4 py-2 text-sm text-white/75 transition hover:bg-white/10"
          >
            View JSON status
          </Link>
        </div>

        <div className="mt-5 grid gap-3 md:grid-cols-2">
          {importStatus.sources.map((source) => (
            <a
              key={source.id}
              href={source.url}
              target="_blank"
              rel="noreferrer"
              className="rounded-2xl border border-white/10 bg-[#0b1016] p-4 transition hover:bg-white/10"
            >
              <div className="flex flex-wrap gap-2">
                <Badge tone={source.status === "automated" ? "lv" : source.status === "available" ? "world" : "neutral"}>
                  {source.status}
                </Badge>
                <Badge tone="hot">{source.series}</Badge>
              </div>
              <div className="mt-3 text-lg font-bold text-white">{source.label}</div>
              <p className="mt-2 text-sm leading-6 text-white/60">{source.note}</p>
            </a>
          ))}
        </div>
      </section>
    </main>
  );
}
