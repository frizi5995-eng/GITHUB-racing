import Link from "next/link";
import { Badge } from "@/components/Badge";
import { drivers } from "@/lib/data";
import { getUpcomingRacesForDriver } from "@/lib/races";
import { isoToDateLabel, raceLocationLabel } from "@/lib/utils";

function getSeriesLink(series?: string) {
  if (series === "F1") return "/series/f1";
  if (series === "WRC") return "/series/wrc";
  return "/calendar";
}

function getSeriesLabel(series?: string) {
  if (series === "F1") return "F1 Series";
  if (series === "WRC") return "WRC Series";
  return "Calendar";
}

export default async function DriverPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const driver = drivers.find((item) => item.id === id);

  if (!driver) {
    return <div className="text-white/70">Not found</div>;
  }

  const upcoming = await getUpcomingRacesForDriver(driver);

  return (
    <main className="space-y-6">
      <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-black">{driver.name}</h1>
            <div className="mt-1 text-white/70">
              {driver.role ?? "Driver"}
              {driver.team ? ` • ${driver.team}` : ""}
            </div>
            <div className="mt-1 text-sm text-white/55">
              {driver.discipline}
              {driver.nationality ? ` • ${driver.nationality}` : ""}
            </div>
          </div>

          <div className="flex flex-wrap justify-end gap-2">
            {driver.active ? <Badge tone="hot">Active</Badge> : <Badge>Inactive</Badge>}
            {driver.series ? (
              <Badge tone={driver.series === "F1" || driver.series === "WRC" ? "world" : "neutral"}>
                {driver.series}
              </Badge>
            ) : null}
            <Badge tone="lv">{upcoming.length} upcoming</Badge>
          </div>
        </div>

        {driver.bio ? <p className="mt-4 max-w-3xl text-white/75">{driver.bio}</p> : null}

        <h2 className="mt-6 text-lg font-bold">Highlights</h2>
        <ul className="mt-3 list-disc space-y-1 pl-5 text-white/75">
          {driver.achievements.map((achievement, index) => (
            <li key={index}>{achievement}</li>
          ))}
        </ul>

        <div className="mt-6 flex flex-wrap gap-2">
          <Link
            className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 hover:bg-white/10"
            href="/drivers"
          >
            Back
          </Link>

          <Link
            className="rounded-xl border border-orange-500/30 bg-orange-500/15 px-4 py-2 hover:bg-orange-500/20"
            href={getSeriesLink(driver.series)}
          >
            {getSeriesLabel(driver.series)}
          </Link>
        </div>
      </div>

      <section className="rounded-3xl border border-white/10 bg-white/5 p-6">
        <h2 className="text-lg font-bold">Upcoming Events</h2>

        {upcoming.length === 0 ? (
          <div className="mt-2 text-white/60">No scheduled appearances right now.</div>
        ) : (
          <div className="mt-4 space-y-3">
            {upcoming.slice(0, 8).map((race) => (
              <Link
                key={race.id}
                href={`/events/${race.id}`}
                className="block rounded-2xl border border-white/10 bg-[#0b0f14] p-4 transition hover:bg-white/5"
              >
                <div className="text-sm text-white/60">{isoToDateLabel(race.startDate)}</div>
                <div className="mt-1 font-semibold">{race.title}</div>
                <div className="mt-1 text-sm text-white/70">
                  {raceLocationLabel(race)} • {race.series}
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
