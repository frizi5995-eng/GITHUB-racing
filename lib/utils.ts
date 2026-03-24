import { Race } from "./types";

export function isoToDateLabel(iso: string) {
  const [y, m, d] = iso.split("-");
  return `${d}.${m}.${y}`;
}

export function raceLocationLabel(race: Race) {
  if (race.location) return race.location;
  if (race.venue) return `${race.city}, ${race.country} • ${race.venue}`;
  return `${race.city}, ${race.country}`;
}

export function compareByDateAsc(a: Race, b: Race) {
  return a.startDate.localeCompare(b.startDate);
}

export function isUpcoming(iso: string) {
  const today = new Date();
  const d = new Date(iso + "T00:00:00");
  const t0 = new Date(today.toDateString()).getTime();
  return d.getTime() >= t0;
}

export function monthKey(iso: string) {
  const [y, m] = iso.split("-");
  return `${y}-${m}`;
}
