import { DriversPageClient } from "@/components/DriversPageClient";
import { getAllDrivers, getDriverUpcomingCountMap } from "@/lib/races";

export default async function DriversPage() {
  const drivers = getAllDrivers();
  const countMap = await getDriverUpcomingCountMap();

  return (
    <DriversPageClient
      drivers={drivers}
      upcomingCountByDriver={Object.fromEntries(countMap.entries())}
    />
  );
}
