import Link from "next/link";
import { Driver } from "@/lib/types";
import { Badge } from "./Badge";

export function DriverCard({
  driver,
  upcomingCount,
}: {
  driver: Driver;
  upcomingCount: number;
}) {
  const showUpcomingBadge = upcomingCount > 0 || !driver.series;

  return (
    <Link
      href={`/drivers/${driver.id}`}
      className="block rounded-2xl border border-white/10 bg-white/5 p-4 transition hover:bg-white/10"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="text-base font-bold">{driver.name}</div>
          <div className="mt-1 text-sm text-white/70">
            {driver.role ?? "Driver"}
            {driver.team ? ` • ${driver.team}` : ""}
          </div>
          <div className="mt-1 text-sm text-white/55">
            {driver.discipline}
            {driver.nationality ? ` • ${driver.nationality}` : ""}
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {driver.active ? <Badge tone="hot">Active</Badge> : <Badge>Inactive</Badge>}
            {driver.series ? (
              <Badge tone={driver.series === "F1" || driver.series === "WRC" ? "world" : "neutral"}>
                {driver.series}
              </Badge>
            ) : null}
            {showUpcomingBadge ? <Badge tone="lv">{upcomingCount} upcoming</Badge> : null}
          </div>
        </div>
        <div className="h-10 w-10 shrink-0 rounded-xl border border-white/10 bg-gradient-to-br from-orange-500/20 to-red-500/20" />
      </div>
    </Link>
  );
}
