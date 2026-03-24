import { EventsPageClient } from "@/components/EventsPageClient";
import { getAllRaces } from "@/lib/races";

export default async function EventsPage() {
  const races = await getAllRaces();

  return <EventsPageClient races={races} />;
}
