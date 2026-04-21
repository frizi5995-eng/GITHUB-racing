import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge } from "@/components/Badge";
import { DriverCard } from "@/components/DriverCard";
import { FavoriteButton } from "@/components/FavoriteButton";
import { RaceCard } from "@/components/RaceCard";
import { RecentViewTracker } from "@/components/RecentViewTracker";
import { getDriverById, getRelatedDrivers, getUpcomingRacesForDriver } from "@/lib/races";
import { getSeriesLinkByCode } from "@/lib/series";
import { getDriverSeries } from "@/lib/utils";

export default async function DriverPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const driver = await getDriverById(id);

  if (!driver) {
    notFound();
  }

  const upcoming = await getUpcomingRacesForDriver(driver);
  const relatedDrivers = getRelatedDrivers(driver, 3);
  const driverSeries = getDriverSeries(driver);
  const isLatvian = driver.nationality === "Latvia";

  return (
    <main className="space-y-8">
      <RecentViewTracker kind="drivers" itemId={driver.id} />

      <section className="rounded-[36px] border border-white/10 bg-[linear-gradient(145deg,rgba(248,113,113,0.16),rgba(12,16,22,0.94)_38%,rgba(251,146,60,0.12)_100%)] p-6 md:p-8">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
          <div className="max-w-3xl">
            <div className="flex flex-wrap gap-2">
              <Badge tone={isLatvian ? "lv" : "world"}>{driver.nationality ?? "International"}</Badge>
              {driver.active ? <Badge tone="hot">Active</Badge> : <Badge tone="neutral">Inactive</Badge>}
              {driverSeries.map((series) => (
                <Badge key={series} tone="world">{series}</Badge>
              ))}
            </div>
            <h1 className="mt-4 text-4xl font-black tracking-tight text-white md:text-5xl">{driver.name}</h1>
            <p className="mt-3 text-base leading-7 text-white/74">
              {driver.bio ?? `${driver.name} is part of RaceHub's motorsport driver and rider coverage.`}
            </p>
            <div className="mt-4 text-sm text-white/58">
              {driver.discipline}
              {driver.hometown ? ` | ${driver.hometown}` : ""}
              {driver.nationality ? ` | ${driver.nationality}` : ""}
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <FavoriteButton itemId={driver.id} kind="drivers" label="Save driver" />
            <Link
              href="/drivers"
              className="rounded-2xl border border-white/10 bg-white/6 px-4 py-2 text-sm text-white/78 transition hover:bg-white/10"
            >
              Back to drivers
            </Link>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <div className="rounded-[24px] border border-white/10 bg-white/[0.045] p-5">
          <div className="text-xs uppercase tracking-[0.2em] text-white/45">Role</div>
          <div className="mt-3 text-xl font-bold text-white">{driver.role ?? "Driver"}</div>
        </div>
        <div className="rounded-[24px] border border-white/10 bg-white/[0.045] p-5">
          <div className="text-xs uppercase tracking-[0.2em] text-white/45">Current focus</div>
          <div className="mt-3 text-xl font-bold text-white">{driverSeries.join(", ") || driver.team || "Programme tracked"}</div>
        </div>
        <div className="rounded-[24px] border border-white/10 bg-white/[0.045] p-5">
          <div className="text-xs uppercase tracking-[0.2em] text-white/45">Upcoming events</div>
          <div className="mt-3 text-4xl font-black tracking-tight text-white">{upcoming.length}</div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[0.95fr_1.25fr]">
        <div className="rounded-[28px] border border-white/10 bg-white/[0.045] p-6">
          <h2 className="text-2xl font-black tracking-tight text-white">Achievements</h2>
          <div className="mt-4 grid gap-3">
            {driver.achievements.map((achievement) => (
              <div key={achievement} className="rounded-2xl border border-white/10 bg-[#0b1016] p-4 text-sm leading-6 text-white/72">
                {achievement}
              </div>
            ))}
          </div>

          {driverSeries.length ? (
            <div className="mt-6 space-y-3">
              <h3 className="text-lg font-bold text-white">Related series</h3>
              <div className="flex flex-wrap gap-2">
                {driverSeries.map((series) => (
                  <Link
                    key={series}
                    href={getSeriesLinkByCode(series)}
                    className="rounded-2xl border border-white/10 bg-[#0b1016] px-4 py-2 text-sm text-white/78 transition hover:bg-white/10"
                  >
                    {series}
                  </Link>
                ))}
              </div>
            </div>
          ) : null}
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-black tracking-tight text-white">Related events</h2>
          {upcoming.length === 0 ? (
            <div className="rounded-[28px] border border-dashed border-white/10 bg-white/[0.03] p-6 text-white/60">
              No upcoming events are attached to this profile yet.
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {upcoming.map((race) => (
                <RaceCard key={race.id} race={race} compact />
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-black tracking-tight text-white">Related drivers</h2>
        {relatedDrivers.length === 0 ? (
          <div className="rounded-[28px] border border-dashed border-white/10 bg-white/[0.03] p-6 text-white/60">
              No closely related drivers or riders are linked to this profile yet.
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {relatedDrivers.map((relatedDriver) => (
              <DriverCard key={relatedDriver.id} driver={relatedDriver} upcomingCount={0} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
