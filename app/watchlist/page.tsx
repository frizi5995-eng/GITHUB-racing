import { WatchlistClient } from "@/components/WatchlistClient";
import { getAllDrivers, getAllRaces, getSeriesOverview } from "@/lib/races";

export default async function WatchlistPage() {
  const [races, drivers, seriesOverview] = await Promise.all([
    getAllRaces(),
    Promise.resolve(getAllDrivers()),
    getSeriesOverview(),
  ]);

  return <WatchlistClient races={races} drivers={drivers} seriesOverview={seriesOverview} />;
}
