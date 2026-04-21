import Link from "next/link";
import { Driver } from "@/lib/types";
import { getDriverSeries } from "@/lib/utils";
import { Badge } from "./Badge";

export function DriverCard({
  driver,
  upcomingCount,
}: {
  driver: Driver;
  upcomingCount: number;
}) {
  const series = getDriverSeries(driver);
  const isLatvian = driver.nationality === "Latvia";
  const initials = driver.name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  return (
    <Link
      href={`/drivers/${driver.id}`}
      className="group block rounded-[28px] border border-white/10 bg-white/[0.045] p-5 transition duration-300 hover:border-orange-400/30 hover:bg-white/[0.075] hover:shadow-[0_24px_70px_rgba(0,0,0,0.35)]"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex flex-wrap gap-2">
            {driver.active ? <Badge tone="hot">Active</Badge> : <Badge tone="neutral">Inactive</Badge>}
            <Badge tone={isLatvian ? "lv" : "world"}>{driver.nationality ?? "International"}</Badge>
            {series[0] ? <Badge tone="world">{series[0]}</Badge> : null}
            {upcomingCount > 0 ? <Badge tone="hot">{upcomingCount} upcoming</Badge> : null}
          </div>

          <h3 className="mt-4 text-xl font-bold tracking-tight text-white">{driver.name}</h3>
          <p className="mt-1 text-sm text-white/65">{driver.role ?? "Driver"} | {driver.discipline}</p>
          <p className="mt-1 text-sm text-white/55">
            {driver.hometown ? `${driver.hometown}, ` : ""}
            {driver.team ?? driver.nationality ?? "International"}
          </p>

          {driver.bio ? <p className="mt-4 line-clamp-3 text-sm leading-6 text-white/72">{driver.bio}</p> : null}
        </div>

        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-orange-400/20 bg-[radial-gradient(circle_at_30%_30%,rgba(248,113,113,0.34),transparent_35%),radial-gradient(circle_at_70%_65%,rgba(251,146,60,0.32),transparent_38%),linear-gradient(145deg,rgba(255,255,255,0.08),rgba(255,255,255,0.02))] text-xs font-semibold text-white/80">
          {initials}
        </div>
      </div>

      <div className="mt-5 flex items-center justify-between gap-3 text-sm text-white/55">
        <span>{driver.achievements[0] ?? "Open this profile for more racing context."}</span>
        <span className="text-orange-200 transition group-hover:text-white">Open profile</span>
      </div>
    </Link>
  );
}
