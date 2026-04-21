import { HomePageClient } from "@/components/HomePageClient";
import { getAllDrivers, getAllRaces, getDriverUpcomingCountMap } from "@/lib/races";
import { getSeriesOverview } from "@/lib/races";

export default async function HomePage() {
  const [races, drivers, upcomingCountMap, seriesOverview] = await Promise.all([
    getAllRaces(),
    Promise.resolve(getAllDrivers()),
    getDriverUpcomingCountMap(),
    getSeriesOverview(),
  ]);

  return (
    <HomePageClient
      races={races}
      drivers={drivers}
      upcomingCountByDriver={Object.fromEntries(upcomingCountMap.entries())}
      seriesOverview={seriesOverview}
    />
  );
}
