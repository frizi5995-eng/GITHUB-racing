import { Driver, DriverSort, Race, RaceFilters, RaceSort, Region, Series } from "./types";

export type RaceStatus = "upcoming" | "today" | "ongoing" | "finished";

export function slugify(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export function formatDateLabel(iso: string, locale = "en-GB") {
  return new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(`${iso}T00:00:00`));
}

export function formatMonthLabel(iso: string, locale = "en-GB") {
  return new Intl.DateTimeFormat(locale, {
    month: "long",
    year: "numeric",
  }).format(new Date(`${iso}T00:00:00`));
}

export function formatDateRange(startDate: string, endDate?: string, locale = "en-GB") {
  if (!endDate || endDate === startDate) {
    return formatDateLabel(startDate, locale);
  }

  const start = new Date(`${startDate}T00:00:00`);
  const end = new Date(`${endDate}T00:00:00`);

  const sameMonth = start.getFullYear() === end.getFullYear() && start.getMonth() === end.getMonth();
  const sameYear = start.getFullYear() === end.getFullYear();

  if (sameMonth) {
    const month = new Intl.DateTimeFormat(locale, { month: "short" }).format(start);
    return `${start.getDate()}-${end.getDate()} ${month} ${start.getFullYear()}`;
  }

  if (sameYear) {
    return `${formatDateLabel(startDate, locale)} - ${formatDateLabel(endDate, locale)}`;
  }

  return `${formatDateLabel(startDate, locale)} - ${formatDateLabel(endDate, locale)}`;
}

export function raceLocationLabel(race: Race) {
  if (race.venue) return `${race.venue}, ${race.city}, ${race.country}`;
  if (race.location) return race.location;
  return `${race.city}, ${race.country}`;
}

export function compareByDateAsc(a: Race, b: Race) {
  return a.startDate.localeCompare(b.startDate) || a.title.localeCompare(b.title);
}

export function compareByDateDesc(a: Race, b: Race) {
  return compareByDateAsc(b, a);
}

export function getTodayIso() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function isUpcoming(iso: string) {
  return iso >= getTodayIso();
}

export function isPast(iso: string) {
  return iso < getTodayIso();
}

export function monthKey(iso: string) {
  return iso.slice(0, 7);
}

export function getRaceStatus(race: Race, todayIso = getTodayIso()): RaceStatus {
  const endDate = race.endDate ?? race.startDate;

  if (todayIso < race.startDate) return "upcoming";
  if (todayIso > endDate) return "finished";
  if (todayIso === race.startDate) return "today";
  return "ongoing";
}

export function getRaceStatusLabel(status: RaceStatus) {
  if (status === "today") return "Today";
  if (status === "ongoing") return "Ongoing";
  if (status === "finished") return "Finished";
  return "Upcoming";
}

export function getRaceStatusTone(status: RaceStatus) {
  if (status === "today") return "hot" as const;
  if (status === "ongoing") return "lv" as const;
  if (status === "finished") return "neutral" as const;
  return "world" as const;
}

export function isWithinNextDays(iso: string, days: number, todayIso = getTodayIso()) {
  const from = new Date(`${todayIso}T00:00:00`).getTime();
  const to = new Date(`${iso}T00:00:00`).getTime();
  const diffDays = Math.floor((to - from) / (1000 * 60 * 60 * 24));
  return diffDays >= 0 && diffDays <= days;
}

export function getRaceSearchText(race: Race) {
  return [
    race.title,
    race.city,
    race.country,
    race.venue,
    race.location,
    race.series,
    race.region,
    race.championshipRound,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

export function filterRaces(races: Race[], filters: RaceFilters) {
  const q = filters.q.trim().toLowerCase();

  return races.filter((race) => {
    if (filters.region !== "All" && race.region !== filters.region) return false;
    if (filters.series !== "All" && race.series !== filters.series) return false;
    if (filters.latviaOnly && !race.latviaInvolved) return false;
    if (filters.status === "upcoming" && isPast(race.startDate)) return false;
    if (filters.status === "past" && isUpcoming(race.startDate)) return false;
    if (q && !getRaceSearchText(race).includes(q)) return false;
    return true;
  });
}

export function sortRaces(races: Race[], sort: RaceSort) {
  const sorted = races.slice();

  if (sort === "date-desc") return sorted.sort(compareByDateDesc);
  if (sort === "region") {
    const regionOrder: Region[] = ["Latvia", "Baltics", "World"];
    return sorted.sort(
      (a, b) =>
        regionOrder.indexOf(a.region) - regionOrder.indexOf(b.region) ||
        compareByDateAsc(a, b),
    );
  }
  if (sort === "series") {
    return sorted.sort((a, b) => a.series.localeCompare(b.series) || compareByDateAsc(a, b));
  }

  return sorted.sort(compareByDateAsc);
}

export function sortDrivers(
  drivers: Driver[],
  sort: DriverSort,
  getUpcomingCount: (driverId: string) => number,
) {
  const sorted = drivers.slice();

  if (sort === "name") {
    return sorted.sort((a, b) => a.name.localeCompare(b.name));
  }

  if (sort === "upcoming") {
    return sorted.sort(
      (a, b) =>
        getUpcomingCount(b.id) - getUpcomingCount(a.id) ||
        Number(b.active) - Number(a.active) ||
        a.name.localeCompare(b.name),
    );
  }

  return sorted.sort(
    (a, b) =>
      Number(b.active) - Number(a.active) ||
      getUpcomingCount(b.id) - getUpcomingCount(a.id) ||
      a.name.localeCompare(b.name),
  );
}

export function getDriverSeries(driver: Driver) {
  return Array.from(
    new Set([
      ...(driver.currentSeries ?? []),
      ...(driver.series ? [driver.series] : []),
    ]),
  );
}

export function getDriverSearchText(driver: Driver) {
  return [
    driver.name,
    driver.discipline,
    driver.role,
    driver.team,
    driver.nationality,
    driver.hometown,
    getDriverSeries(driver).join(" "),
    driver.achievements.join(" "),
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

export function countDaysUntil(iso: string) {
  const target = new Date(`${iso}T00:00:00`).getTime();
  const now = new Date(`${getTodayIso()}T00:00:00`).getTime();
  return Math.ceil((target - now) / (1000 * 60 * 60 * 24));
}

export function formatCountdown(iso: string) {
  const days = countDaysUntil(iso);
  if (days < 0) return "Completed";
  if (days === 0) return "Starts today";
  if (days === 1) return "Starts tomorrow";
  return `Starts in ${days} days`;
}

export function getCountdownParts(iso: string) {
  const target = new Date(`${iso}T00:00:00`).getTime();
  const diff = Math.max(0, target - Date.now());
  const totalSeconds = Math.floor(diff / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return {
    diff,
    days,
    hours,
    minutes,
    seconds,
    finished: diff <= 0,
  };
}

export function getSeriesHref(series: Series) {
  return `/series/${slugify(series)}`;
}

export function getRegionTone(region: Region) {
  if (region === "Latvia") return "lv" as const;
  if (region === "Baltics") return "neutral" as const;
  return "world" as const;
}

export function getSeriesTone(series: Series) {
  if (series === "WRC" || series === "Drift" || series === "Rally" || series === "Rallycross") return "hot" as const;
  if (series === "F1" || series === "Formula E" || series === "WEC" || series === "MotoGP") return "world" as const;
  return "neutral" as const;
}

export function getRacePopularityScore(race: Race) {
  if (typeof race.popularityScore === "number") return race.popularityScore;

  let score = 40;

  if (race.featured) score += 20;
  if (race.latviaInvolved) score += 12;
  if (race.region === "Latvia") score += 10;
  if (race.region === "Baltics") score += 8;
  if (race.series === "F1") score += 32;
  if (race.series === "WRC") score += 28;
  if (race.series === "Drift" || race.series === "Rally" || race.series === "Rallycross") score += 16;
  if (race.series === "WEC" || race.series === "NASCAR" || race.series === "Formula E" || race.series === "MotoGP") score += 12;

  return score;
}

export function getDiscoveredSeries(races: Race[]) {
  return Array.from(new Set(races.map((race) => race.series))).sort() as Series[];
}

export function uniqueRaces(races: Race[]) {
  const map = new Map<string, Race>();

  for (const race of races) {
    const key = `${race.startDate}-${slugify(race.title)}-${slugify(race.city)}`;
    if (!map.has(key)) {
      map.set(key, race);
    }
  }

  return Array.from(map.values());
}

export function createEventIcs(race: Race) {
  const start = race.startDate.replace(/-/g, "");
  const end = (race.endDate ?? race.startDate).replace(/-/g, "");
  const description = (race.description ?? `${race.title} on RaceHub.`).replace(/\n/g, "\\n");
  const location = raceLocationLabel(race).replace(/,/g, "\\,");
  const link = race.links?.official ? `\\nOfficial: ${race.links.official}` : "";

  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//RaceHub//Motorsport Calendar//EN",
    "BEGIN:VEVENT",
    `UID:${race.id}@racehub.local`,
    `DTSTAMP:${start}T080000Z`,
    `DTSTART;VALUE=DATE:${start}`,
    `DTEND;VALUE=DATE:${end}`,
    `SUMMARY:${race.title}`,
    `DESCRIPTION:${description}${link}`,
    `LOCATION:${location}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
}
