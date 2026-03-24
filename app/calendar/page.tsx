import { CalendarPageClient } from "@/components/CalendarPageClient";
import { getAllRaces } from "@/lib/races";

export default async function CalendarPage() {
  const races = await getAllRaces();

  return <CalendarPageClient races={races} />;
}
