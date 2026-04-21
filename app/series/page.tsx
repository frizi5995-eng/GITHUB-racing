import { SeriesPageClient } from "@/components/SeriesPageClient";
import { getSeriesOverview } from "@/lib/races";

export default async function SeriesPage() {
  const overview = await getSeriesOverview();

  return <SeriesPageClient overview={overview} />;
}
