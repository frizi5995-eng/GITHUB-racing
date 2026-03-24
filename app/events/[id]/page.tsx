import Link from "next/link";
import { Badge } from "@/components/Badge";
import { drivers } from "@/lib/data";
import { getF1SessionType } from "@/lib/f1Sessions";
import { getRaceById } from "@/lib/races";
import { isoToDateLabel, raceLocationLabel } from "@/lib/utils";
import { getWRCEventDetails } from "@/lib/wrc";

function hashString(value: string) {
  let total = 0;
  for (const char of value) total += char.charCodeAt(0);
  return total;
}

function getFeaturedPeopleForRace(raceId: string, series: string) {
  const people = drivers.filter((person) => person.series === series);
  if (people.length === 0) return [];

  const competitors = people.filter((person) => person.role !== "Team Principal");
  const principalsOnly = people.filter((person) => person.role === "Team Principal");
  const offset = hashString(raceId);

  const featuredDrivers = competitors.length
    ? [competitors[offset % competitors.length], competitors[(offset + 5) % competitors.length]]
    : [];
  const featuredPrincipal = principalsOnly.length ? [principalsOnly[offset % principalsOnly.length]] : [];

  return [...featuredDrivers, ...featuredPrincipal].filter(Boolean);
}

function getEventStory(title: string, location: string, series: string) {
  if (series === "F1") {
    const sessionType = getF1SessionType(title);

    if (sessionType === "grand-prix") {
      return `This is the headline race session of the weekend in ${location}. Strategy, tyre management and late-race pressure usually decide the biggest storylines here.`;
    }

    if (sessionType === "qualifying") {
      return `Qualifying often defines the shape of the Grand Prix weekend. Track position, confidence on the limit and timing in changing conditions are usually the key talking points.`;
    }

    if (sessionType === "practice") {
      return `Practice sessions matter because teams build their setup direction here. Even when the result itself is not decisive, the pace trends can tell an interesting story before qualifying.`;
    }

    return `This session is part of the Formula 1 weekend at ${location}. Even smaller sessions can shift momentum, expose setup changes or hint at race-day form.`;
  }

  return `This event is part of the ${series} schedule in ${location}. Venue character, local conditions and championship context usually shape the story around the weekend.`;
}

function getPlaceSpotlight(raceTitle: string, location: string) {
  return `${raceTitle} takes the championship to ${location}. That makes the venue itself part of the story: atmosphere, layout character and local motorsport culture all change how the weekend feels.`;
}

export default async function EventPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const race = await getRaceById(id);

  if (!race) {
    return <div className="text-white/70">Not found</div>;
  }

  const latvian = drivers.filter((driver) => race.latvianDrivers.includes(driver.id));
  const featuredPeople = getFeaturedPeopleForRace(race.id, race.series);
  const location = raceLocationLabel(race);
  const wrcDetails =
    race.series === "WRC" && race.links?.official?.includes("wrc.com")
      ? await getWRCEventDetails(race.links.official)
      : null;
  const eventStory = wrcDetails?.about ?? getEventStory(race.title, location, race.series);
  const placeSpotlight = wrcDetails?.servicePark
    ? `${race.title} is centered around ${wrcDetails.servicePark}. Surface: ${wrcDetails.surface ?? "TBA"}. Stages: ${wrcDetails.stages ?? "TBA"}.`
    : getPlaceSpotlight(race.title, location);
  const officialLink = wrcDetails?.website ?? race.links?.official;
  const ticketsLink = wrcDetails?.tickets ?? race.links?.tickets;
  const streamLink = wrcDetails?.liveStream ?? race.links?.stream;

  return (
    <main className="space-y-6">
      <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
        <div className="flex flex-wrap gap-2">
          <Badge tone="hot">{race.series}</Badge>
          <Badge tone={race.region === "World" ? "world" : "neutral"}>{race.region}</Badge>
          {race.latviaInvolved ? <Badge tone="lv">Latvia involved</Badge> : null}
        </div>

        <h1 className="mt-3 text-2xl font-black">{race.title}</h1>

        <div className="mt-2 text-white/70">
          {isoToDateLabel(race.startDate)} • {location}
        </div>

        {race.description ? <p className="mt-4 text-white/75">{race.description}</p> : null}
        {wrcDetails?.standfirst ? <p className="mt-3 text-sm text-white/60">{wrcDetails.standfirst}</p> : null}

        <div className="mt-5 flex flex-wrap gap-2">
          {officialLink ? (
            <a
              className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 hover:bg-white/10"
              href={officialLink}
              target="_blank"
              rel="noreferrer"
            >
              Official
            </a>
          ) : null}

          {ticketsLink ? (
            <a
              className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 hover:bg-white/10"
              href={ticketsLink}
              target="_blank"
              rel="noreferrer"
            >
              Tickets
            </a>
          ) : null}

          {streamLink ? (
            <a
              className="rounded-xl border border-orange-500/30 bg-orange-500/15 px-4 py-2 hover:bg-orange-500/20"
              href={streamLink}
              target="_blank"
              rel="noreferrer"
            >
              Stream
            </a>
          ) : null}

          <Link
            className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 hover:bg-white/10"
            href="/calendar"
          >
            Back to calendar
          </Link>
        </div>
      </div>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-lg font-bold">Weekend Update</h2>
          <p className="mt-3 text-white/75">{eventStory}</p>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-lg font-bold">Place Spotlight</h2>
          <p className="mt-3 text-white/75">{placeSpotlight}</p>
        </div>
      </section>

      {wrcDetails ? (
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {wrcDetails.servicePark ? (
            <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
              <div className="text-xs uppercase tracking-[0.16em] text-white/50">Service Park</div>
              <div className="mt-2 font-semibold">{wrcDetails.servicePark}</div>
            </div>
          ) : null}
          {wrcDetails.surface ? (
            <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
              <div className="text-xs uppercase tracking-[0.16em] text-white/50">Surface</div>
              <div className="mt-2 font-semibold">{wrcDetails.surface}</div>
            </div>
          ) : null}
          {wrcDetails.stages ? (
            <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
              <div className="text-xs uppercase tracking-[0.16em] text-white/50">Stages</div>
              <div className="mt-2 font-semibold">{wrcDetails.stages}</div>
            </div>
          ) : null}
          {wrcDetails.liveStream ? (
            <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
              <div className="text-xs uppercase tracking-[0.16em] text-white/50">Watch</div>
              <a
                className="mt-2 inline-block font-semibold text-orange-300 hover:text-orange-200"
                href={wrcDetails.liveStream}
                target="_blank"
                rel="noreferrer"
              >
                Rally.TV stream →
              </a>
            </div>
          ) : null}
        </section>
      ) : null}

      {featuredPeople.length > 0 ? (
        <section className="rounded-3xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-lg font-bold">Featured People</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {featuredPeople.map((person) => (
              <Link
                key={person.id}
                href={`/drivers/${person.id}`}
                className="rounded-2xl border border-white/10 bg-[#0b0f14] p-4 transition hover:bg-white/5"
              >
                <div className="flex flex-wrap gap-2">
                  {person.role ? <Badge tone={person.role === "Team Principal" ? "neutral" : "hot"}>{person.role}</Badge> : null}
                  {person.team ? <Badge tone="world">{person.team}</Badge> : null}
                </div>
                <div className="mt-3 font-semibold">{person.name}</div>
                <div className="mt-1 text-sm text-white/60">
                  {person.nationality ?? person.discipline}
                </div>
                {person.bio ? <p className="mt-3 text-sm text-white/75">{person.bio}</p> : null}
              </Link>
            ))}
          </div>
        </section>
      ) : null}

      <section className="rounded-3xl border border-white/10 bg-white/5 p-6">
        <h2 className="text-lg font-bold">Latvian drivers in this event</h2>

        {latvian.length === 0 ? (
          <div className="mt-2 text-white/60">None.</div>
        ) : (
          <ul className="mt-3 space-y-2">
            {latvian.map((driver) => (
              <li
                key={driver.id}
                className="flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-[#0b0b0f] p-4"
              >
                <div>
                  <div className="font-semibold">{driver.name}</div>
                  <div className="text-sm text-white/70">{driver.discipline}</div>
                </div>

                <Link className="text-orange-300 hover:text-orange-200" href={`/drivers/${driver.id}`}>
                  Profile →
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
