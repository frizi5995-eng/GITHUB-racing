import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge } from "@/components/Badge";
import { FavoriteButton } from "@/components/FavoriteButton";
import { LiveCountdown } from "@/components/LiveCountdown";
import { RaceCard } from "@/components/RaceCard";
import { RecentViewTracker } from "@/components/RecentViewTracker";
import { ShareButton } from "@/components/ShareButton";
import { getLatvianDrivers, getRaceById, getRelatedRaceGroups } from "@/lib/races";
import { getSeriesLinkByCode } from "@/lib/series";
import {
  formatDateRange,
  getRaceStatus,
  getRaceStatusLabel,
  getRaceStatusTone,
  getRegionTone,
  getSeriesTone,
  raceLocationLabel,
} from "@/lib/utils";
import { getWRCEventDetails } from "@/lib/wrc";

function DetailItem({ label, value }: { label: string; value?: string }) {
  if (!value) return null;

  return (
    <div className="rounded-[24px] border border-white/10 bg-[#0b1016] p-4">
      <div className="text-xs uppercase tracking-[0.18em] text-white/45">{label}</div>
      <div className="mt-2 text-sm leading-6 text-white/82">{value}</div>
    </div>
  );
}

export default async function EventPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const race = await getRaceById(id);

  if (!race) {
    notFound();
  }

  const [relatedGroups, latvianDrivers, wrcDetails] = await Promise.all([
    getRelatedRaceGroups(race),
    Promise.resolve(getLatvianDrivers().filter((driver) => race.latvianDrivers.includes(driver.id))),
    race.series === "WRC" && race.links?.official?.includes("wrc.com")
      ? getWRCEventDetails(race.links.official)
      : Promise.resolve(null),
  ]);

  const status = getRaceStatus(race);
  const facts = [
    { label: "Date", value: formatDateRange(race.startDate, race.endDate) },
    { label: "City", value: race.city },
    { label: "Country", value: race.country },
    { label: "Venue", value: race.venue },
    { label: "Region", value: race.region },
    { label: "Series", value: race.series },
    { label: "Status", value: getRaceStatusLabel(status) },
    { label: "Source", value: race.source.label },
  ];

  const icsHref = `/api/events/${race.id}/ics`;
  const mapHref = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(raceLocationLabel(race))}`;
  const officialLink = wrcDetails?.website ?? race.links?.official;
  const ticketsLink = wrcDetails?.tickets ?? race.links?.tickets;
  const streamLink = wrcDetails?.liveStream ?? race.links?.stream;

  return (
    <main className="space-y-8">
      <RecentViewTracker kind="events" itemId={race.id} />

      <section className="rounded-[36px] border border-white/10 bg-[linear-gradient(145deg,rgba(248,113,113,0.18),rgba(12,16,22,0.94)_38%,rgba(56,189,248,0.08)_100%)] p-6 md:p-8">
        <div className="flex flex-wrap gap-2">
          <Badge tone={getSeriesTone(race.series)}>{race.series}</Badge>
          <Badge tone={getRegionTone(race.region)}>{race.region}</Badge>
          <Badge tone={getRaceStatusTone(status)}>{getRaceStatusLabel(status)}</Badge>
          {race.latviaInvolved ? <Badge tone="lv">Latvia involved</Badge> : null}
          <Badge tone="world">{race.source.label}</Badge>
        </div>

        <h1 className="mt-4 text-4xl font-black tracking-tight text-white md:text-5xl">{race.title}</h1>
        <p className="mt-3 max-w-3xl text-base leading-7 text-white/74">
          {race.description ?? `${race.title} is part of the RaceHub calendar for Latvia, the Baltics and world motorsport.`}
        </p>
        {wrcDetails?.standfirst ? <p className="mt-4 text-sm text-white/58">{wrcDetails.standfirst}</p> : null}

        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href={icsHref}
            className="rounded-2xl border border-orange-400/30 bg-orange-500/15 px-4 py-2 text-sm text-white transition hover:bg-orange-500/22"
          >
            Add to calendar
          </Link>
          {officialLink ? (
            <a
              href={officialLink}
              target="_blank"
              rel="noreferrer"
              className="rounded-2xl border border-white/10 bg-white/6 px-4 py-2 text-sm text-white/78 transition hover:bg-white/10"
            >
              Official site
            </a>
          ) : null}
          {ticketsLink ? (
            <a
              href={ticketsLink}
              target="_blank"
              rel="noreferrer"
              className="rounded-2xl border border-white/10 bg-white/6 px-4 py-2 text-sm text-white/78 transition hover:bg-white/10"
            >
              Tickets
            </a>
          ) : null}
          {streamLink ? (
            <a
              href={streamLink}
              target="_blank"
              rel="noreferrer"
              className="rounded-2xl border border-sky-400/30 bg-sky-500/12 px-4 py-2 text-sm text-white transition hover:bg-sky-500/18"
            >
              Stream
            </a>
          ) : null}
          <FavoriteButton itemId={race.id} kind="events" label="Save event" />
          <ShareButton title={race.title} />
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {facts.map((fact) => (
          <DetailItem key={fact.label} label={fact.label} value={fact.value} />
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.3fr_0.9fr]">
        <div className="space-y-6">
          <div className="rounded-[28px] border border-white/10 bg-white/[0.045] p-6">
            <h2 className="text-2xl font-black tracking-tight text-white">Event overview</h2>
            <p className="mt-4 text-sm leading-7 text-white/72">
              {wrcDetails?.about ??
                race.description ??
                `${race.title} sits inside the ${race.series} calendar and is surfaced here with region tags, driver links and practical actions for planning.`}
            </p>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-white/[0.045] p-6">
            <h2 className="text-2xl font-black tracking-tight text-white">Latvian drivers participating</h2>
            {latvianDrivers.length === 0 ? (
              <p className="mt-4 text-sm text-white/60">
                No Latvian drivers are currently attached to this event in the local dataset.
              </p>
            ) : (
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                {latvianDrivers.map((driver) => (
                  <Link
                    key={driver.id}
                    href={`/drivers/${driver.id}`}
                    className="rounded-[24px] border border-white/10 bg-[#0b1016] p-4 transition hover:bg-white/10"
                  >
                    <div className="flex flex-wrap gap-2">
                      <Badge tone="lv">Latvia</Badge>
                      {driver.active ? <Badge tone="hot">Active</Badge> : null}
                    </div>
                    <div className="mt-3 text-lg font-bold text-white">{driver.name}</div>
                    <div className="mt-1 text-sm text-white/60">{driver.discipline}</div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          <section className="space-y-4">
            <h2 className="text-2xl font-black tracking-tight text-white">Related content</h2>
            <div className="grid gap-6">
              {relatedGroups.sameSeries.length > 0 ? (
                <div className="space-y-3">
                  <h3 className="text-lg font-bold text-white">More from the same series</h3>
                  <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {relatedGroups.sameSeries.map((relatedRace) => (
                      <RaceCard key={relatedRace.id} race={relatedRace} compact />
                    ))}
                  </div>
                </div>
              ) : null}
              {relatedGroups.sameRegion.length > 0 ? (
                <div className="space-y-3">
                  <h3 className="text-lg font-bold text-white">More from the same region</h3>
                  <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {relatedGroups.sameRegion.map((relatedRace) => (
                      <RaceCard key={relatedRace.id} race={relatedRace} compact />
                    ))}
                  </div>
                </div>
              ) : null}
              {relatedGroups.comingSoon.length > 0 ? (
                <div className="space-y-3">
                  <h3 className="text-lg font-bold text-white">Coming soon after this event</h3>
                  <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {relatedGroups.comingSoon.map((relatedRace) => (
                      <RaceCard key={relatedRace.id} race={relatedRace} compact />
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          </section>
        </div>

        <div className="space-y-6">
          <LiveCountdown targetDate={race.startDate} label="Event countdown" />

          <div className="rounded-[28px] border border-white/10 bg-white/[0.045] p-6">
            <h2 className="text-2xl font-black tracking-tight text-white">Useful links</h2>
            <div className="mt-4 grid gap-3">
              <a
                href={mapHref}
                target="_blank"
                rel="noreferrer"
                className="rounded-2xl border border-white/10 bg-[#0b1016] p-4 text-sm text-white/78 transition hover:bg-white/10"
              >
                Open map
              </a>
              <Link
                href={getSeriesLinkByCode(race.series)}
                className="rounded-2xl border border-white/10 bg-[#0b1016] p-4 text-sm text-white/78 transition hover:bg-white/10"
              >
                Explore {race.series}
              </Link>
              <Link
                href="/calendar"
                className="rounded-2xl border border-white/10 bg-[#0b1016] p-4 text-sm text-white/78 transition hover:bg-white/10"
              >
                Back to calendar
              </Link>
            </div>
          </div>

          {(wrcDetails?.servicePark || wrcDetails?.surface || wrcDetails?.stages) ? (
            <div className="rounded-[28px] border border-white/10 bg-white/[0.045] p-6">
              <h2 className="text-2xl font-black tracking-tight text-white">WRC event facts</h2>
              <div className="mt-4 grid gap-3">
                <DetailItem label="Service park" value={wrcDetails?.servicePark} />
                <DetailItem label="Surface" value={wrcDetails?.surface} />
                <DetailItem label="Stages" value={wrcDetails?.stages} />
              </div>
            </div>
          ) : null}

          <div className="rounded-[28px] border border-white/10 bg-white/[0.045] p-6">
            <h2 className="text-2xl font-black tracking-tight text-white">Location snapshot</h2>
            <p className="mt-4 text-sm leading-7 text-white/70">
              {`${race.title} runs ${formatDateRange(race.startDate, race.endDate)} in ${raceLocationLabel(race)}.`}
            </p>
            <div className="mt-4 rounded-[24px] border border-dashed border-white/10 bg-[#0b1016] p-5 text-sm text-white/58">
              Map preview placeholder. The quick action above opens the location directly in Google Maps.
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
