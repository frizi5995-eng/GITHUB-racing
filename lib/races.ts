import { drivers, races as staticRaces } from "./data";
import { getF1Races } from "./f1";
import { getSeriesConfigByCode } from "./series";
import { Driver, Race, Series } from "./types";
import {
  compareByDateAsc,
  getDriverSeries,
  getRacePopularityScore,
  getTodayIso,
  isUpcoming,
  isWithinNextDays,
  uniqueRaces,
} from "./utils";
import { getWRCRaces } from "./wrc";

const ALL_RACES_CACHE_TTL_MS = 10 * 60 * 1000;

let allRacesCache:
  | {
      expiresAt: number;
      races: Race[];
    }
  | null = null;
let allRacesInFlight: Promise<Race[]> | null = null;

function withoutImportedSeries(races: Race[]) {
  return races.filter((race) => race.series !== "F1" && race.series !== "WRC");
}

export function getStaticRaces() {
  return withoutImportedSeries(staticRaces).slice().sort(compareByDateAsc);
}

export async function getAllRaces(): Promise<Race[]> {
  if (allRacesCache && allRacesCache.expiresAt > Date.now()) {
    return allRacesCache.races;
  }

  if (allRacesInFlight) {
    return allRacesInFlight;
  }

  allRacesInFlight = (async () => {
    const baseRaces = getStaticRaces();
    const imported = await Promise.allSettled([getF1Races(), getWRCRaces()]);
    const importedRaces = imported
      .filter((result): result is PromiseFulfilledResult<Race[]> => result.status === "fulfilled")
      .flatMap((result) => result.value);

    const races = uniqueRaces([...baseRaces, ...importedRaces]).sort(compareByDateAsc);

    allRacesCache = {
      expiresAt: Date.now() + ALL_RACES_CACHE_TTL_MS,
      races,
    };

    return races;
  })();

  try {
    return await allRacesInFlight;
  } finally {
    allRacesInFlight = null;
  }
}

export async function getSeriesRaces(series: Series) {
  if (series === "F1") {
    return (await getF1Races()).slice().sort(compareByDateAsc);
  }

  if (series === "WRC") {
    return (await getWRCRaces()).slice().sort(compareByDateAsc);
  }

  return getStaticRaces().filter((race) => race.series === series).sort(compareByDateAsc);
}

export async function getRaceById(id: string) {
  return (await getAllRaces()).find((race) => race.id === id);
}

export async function getDriverById(id: string) {
  return drivers.find((driver) => driver.id === id);
}

export function getAllDrivers() {
  return drivers;
}

export function getLatvianDrivers() {
  return drivers.filter((driver) => driver.nationality === "Latvia");
}

function driverParticipatesInRace(driver: Driver, race: Race) {
  if (race.latvianDrivers.includes(driver.id)) return true;

  const series = getDriverSeries(driver);
  return series.includes(race.series);
}

export async function getUpcomingRacesForDriver(driver: Driver) {
  const allRaces = await getAllRaces();
  return allRaces
    .filter((race) => isUpcoming(race.startDate) && driverParticipatesInRace(driver, race))
    .sort(compareByDateAsc);
}

export async function getDriverUpcomingCountMap() {
  const allRaces = await getAllRaces();
  const map = new Map<string, number>();

  for (const race of allRaces) {
    if (!isUpcoming(race.startDate)) continue;

    for (const driver of drivers) {
      if (!driverParticipatesInRace(driver, race)) continue;
      map.set(driver.id, (map.get(driver.id) ?? 0) + 1);
    }
  }

  return map;
}

export async function getRelatedRaces(race: Race, limit = 3) {
  const allRaces = await getAllRaces();
  return allRaces
    .filter((candidate) => {
      if (candidate.id === race.id) return false;
      if (candidate.series === race.series) return true;
      return candidate.region === race.region || candidate.latviaInvolved === race.latviaInvolved;
    })
    .sort((a, b) => {
      const aScore =
        Number(a.series === race.series) * 3 +
        Number(a.region === race.region) * 2 +
        Number(a.latviaInvolved === race.latviaInvolved);
      const bScore =
        Number(b.series === race.series) * 3 +
        Number(b.region === race.region) * 2 +
        Number(b.latviaInvolved === race.latviaInvolved);

      return bScore - aScore || compareByDateAsc(a, b);
    })
    .slice(0, limit);
}

export async function getRelatedRaceGroups(race: Race) {
  const allRaces = await getAllRaces();
  const todayIso = getTodayIso();
  const candidates = allRaces.filter((candidate) => candidate.id !== race.id);

  return {
    sameSeries: candidates
      .filter((candidate) => candidate.series === race.series)
      .sort(compareByDateAsc)
      .slice(0, 3),
    sameRegion: candidates
      .filter((candidate) => candidate.region === race.region)
      .sort(compareByDateAsc)
      .slice(0, 3),
    comingSoon: candidates
      .filter(
        (candidate) =>
          candidate.startDate > (race.endDate ?? race.startDate) &&
          isWithinNextDays(candidate.startDate, 21, todayIso),
      )
      .sort(compareByDateAsc)
      .slice(0, 3),
  };
}

export function getRelatedDrivers(driver: Driver, limit = 3) {
  const targetSeries = getDriverSeries(driver);

  return drivers
    .filter((candidate) => candidate.id !== driver.id)
    .map((candidate) => {
      const candidateSeries = getDriverSeries(candidate);
      const score =
        Number(candidate.discipline === driver.discipline) * 4 +
        Number(candidateSeries.some((series) => targetSeries.includes(series))) * 3 +
        Number(candidate.nationality === driver.nationality) * 2 +
        Number(Boolean(candidate.featured));

      return { candidate, score };
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score || a.candidate.name.localeCompare(b.candidate.name))
    .map((item) => item.candidate)
    .slice(0, limit);
}

export async function getWeeklyRaceGroups() {
  const allRaces = await getAllRaces();
  const weekly = allRaces.filter((race) => isWithinNextDays(race.startDate, 7));

  return {
    Latvia: weekly.filter((race) => race.region === "Latvia").sort(compareByDateAsc),
    Baltics: weekly.filter((race) => race.region === "Baltics").sort(compareByDateAsc),
    World: weekly.filter((race) => race.region === "World").sort(compareByDateAsc),
  };
}

export async function getNextMajorRace() {
  const allRaces = await getAllRaces();

  return allRaces
    .filter((race) => isUpcoming(race.startDate))
    .sort(
      (a, b) =>
        Number(b.featured) - Number(a.featured) ||
        getRacePopularityScore(b) - getRacePopularityScore(a) ||
        compareByDateAsc(a, b),
    )[0];
}

export async function getTrendingRaces(limit = 4) {
  const allRaces = await getAllRaces();

  return allRaces
    .filter((race) => isWithinNextDays(race.startDate, 30))
    .sort((a, b) => getRacePopularityScore(b) - getRacePopularityScore(a) || compareByDateAsc(a, b))
    .slice(0, limit);
}

export async function getSeriesOverview() {
  const allRaces = await getAllRaces();
  const thisMonth = getTodayIso().slice(0, 7);

  return Array.from(new Set(allRaces.map((race) => race.series)))
    .map((seriesCode) => {
      const seriesRaces = allRaces.filter((race) => race.series === seriesCode);
      const upcoming = seriesRaces.filter((race) => isUpcoming(race.startDate));
      const regionSpread = Array.from(new Set(seriesRaces.map((race) => race.region)));
      const monthlyPopularity = seriesRaces
        .filter((race) => race.startDate.startsWith(thisMonth))
        .reduce((total, race) => total + getRacePopularityScore(race), 0);

      return {
        config: getSeriesConfigByCode(seriesCode),
        count: seriesRaces.length,
        upcomingCount: upcoming.length,
        nextRace: upcoming[0],
        regionSpread,
        popularityScore:
          seriesRaces.reduce((total, race) => total + getRacePopularityScore(race), 0) +
          (getSeriesConfigByCode(seriesCode)?.popularity ?? 0),
        monthlyPopularity,
      };
    })
    .filter((item) => item.config)
    .sort(
      (a, b) =>
        b.popularityScore - a.popularityScore ||
        b.upcomingCount - a.upcomingCount ||
        a.config!.name.localeCompare(b.config!.name),
    );
}
