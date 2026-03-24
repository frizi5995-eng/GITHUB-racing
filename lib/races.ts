import { races as staticRaces } from "./data";
import { getF1Races } from "./f1";
import { Driver, Race, Series } from "./types";
import { compareByDateAsc, isUpcoming } from "./utils";
import { getWRCRaces } from "./wrc";
import { wrcFallbackRaces } from "./wrcFallback";

function withoutImportedSeries(races: Race[]) {
  return races.filter((race) => race.series !== "F1" && race.series !== "WRC");
}

const ALL_RACES_CACHE_TTL_MS = 10 * 60 * 1000;
const wrcLinkedLatvianDrivers = new Set(wrcFallbackRaces.flatMap((race) => race.latvianDrivers));

let allRacesCache:
  | {
      expiresAt: number;
      races: Race[];
    }
  | null = null;
let allRacesInFlight: Promise<Race[]> | null = null;

export function getStaticRaces(): Race[] {
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

    const races = [...baseRaces, ...importedRaces].sort(compareByDateAsc);
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

export async function getSeriesRaces(series: Series): Promise<Race[]> {
  if (series === "F1") {
    return (await getF1Races()).slice().sort(compareByDateAsc);
  }

  if (series === "WRC") {
    return (await getWRCRaces()).slice().sort(compareByDateAsc);
  }

  return getStaticRaces().filter((race) => race.series === series);
}

export async function getUpcomingRacesForDriver(driver: Driver): Promise<Race[]> {
  if (driver.series === "F1") {
    return (await getF1Races()).filter((race) => isUpcoming(race.startDate)).sort(compareByDateAsc);
  }

  if (driver.series === "WRC") {
    return (await getWRCRaces()).filter((race) => isUpcoming(race.startDate)).sort(compareByDateAsc);
  }

  const localRaces = getStaticRaces().filter(
    (race) => isUpcoming(race.startDate) && race.latvianDrivers.includes(driver.id),
  );

  if (!wrcLinkedLatvianDrivers.has(driver.id)) {
    return localRaces.sort(compareByDateAsc);
  }

  const wrcRaces = (await getWRCRaces()).filter(
    (race) => isUpcoming(race.startDate) && race.latvianDrivers.includes(driver.id),
  );

  return [...localRaces, ...wrcRaces].sort(compareByDateAsc);
}

export async function getRaceById(id: string): Promise<Race | undefined> {
  if (id.startsWith("f1-")) {
    return (await getF1Races()).find((race) => race.id === id);
  }

  if (id.startsWith("wrc-")) {
    return (await getWRCRaces()).find((race) => race.id === id);
  }

  return getStaticRaces().find((race) => race.id === id);
}
