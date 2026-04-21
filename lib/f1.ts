import { Race } from "./types";
import { f1FallbackRaces } from "./f1Fallback";
import { ENABLE_LIVE_IMPORTS, LIVE_IMPORT_TIMEOUT_MS } from "./importConfig";

export const F1_ICS_URL =
  "https://ics.ecal.com/ecal-sub/69a9e7a65ec2750002972bf4/Formula%201.ics";
const F1_CACHE_TTL_MS = 30 * 60 * 1000;

type ParsedIcsEvent = {
  summary?: string;
  dtstart?: string;
  dtend?: string;
  location?: string;
};

let f1Cache:
  | {
      expiresAt: number;
      races: Race[];
    }
  | null = null;
let f1InFlight: Promise<Race[]> | null = null;

function toISODate(value: string) {
  const normalized = value.replace(/[^0-9]/g, "");
  const year = normalized.slice(0, 4);
  const month = normalized.slice(4, 6);
  const day = normalized.slice(6, 8);
  return `${year}-${month}-${day}`;
}

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function parseLocation(location: string) {
  const parts = location
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean);

  if (parts.length === 0) {
    return { city: "TBA", country: "TBA", venue: undefined as string | undefined };
  }

  if (parts.length === 1) {
    return { city: parts[0], country: "TBA", venue: undefined as string | undefined };
  }

  if (parts.length === 2) {
    return { city: parts[0], country: parts[1], venue: undefined as string | undefined };
  }

  return {
    venue: parts[0],
    city: parts[1],
    country: parts.slice(2).join(", "),
  };
}

function unfoldIcsLines(icsText: string) {
  return icsText.replace(/\r?\n[ \t]/g, "");
}

function parseEventLine(line: string, event: ParsedIcsEvent) {
  const separatorIndex = line.indexOf(":");
  if (separatorIndex === -1) return;

  const rawKey = line.slice(0, separatorIndex);
  const value = line.slice(separatorIndex + 1).trim();
  const key = rawKey.split(";")[0].toUpperCase();

  if (key === "SUMMARY") event.summary = value;
  if (key === "DTSTART") event.dtstart = value;
  if (key === "DTEND") event.dtend = value;
  if (key === "LOCATION") event.location = value.replace(/\\,/g, ",");
}

function parseIcsEvents(icsText: string) {
  const lines = unfoldIcsLines(icsText).split(/\r?\n/);
  const events: ParsedIcsEvent[] = [];
  let current: ParsedIcsEvent | null = null;

  for (const line of lines) {
    if (line === "BEGIN:VEVENT") {
      current = {};
      continue;
    }

    if (line === "END:VEVENT") {
      if (current) events.push(current);
      current = null;
      continue;
    }

    if (current) {
      parseEventLine(line, current);
    }
  }

  return events;
}

export async function getF1Races(): Promise<Race[]> {
  if (!ENABLE_LIVE_IMPORTS) {
    return f1FallbackRaces;
  }

  if (f1Cache && f1Cache.expiresAt > Date.now()) {
    return f1Cache.races;
  }

  if (f1InFlight) {
    return f1InFlight;
  }

  f1InFlight = (async () => {
    let races = f1FallbackRaces;

    try {
      const response = await fetch(F1_ICS_URL, {
        signal: AbortSignal.timeout(LIVE_IMPORT_TIMEOUT_MS),
        next: { revalidate: 3600 },
      });

      if (response.ok) {
        const icsText = await response.text();
        const events = parseIcsEvents(icsText);
        const importedRaces = events
          .filter((event) => event.summary && event.dtstart)
          .map((event) => {
            const title = String(event.summary).trim();
            const startDate = toISODate(String(event.dtstart));
            const endDate = event.dtend ? toISODate(String(event.dtend)) : undefined;
            const rawLocation = event.location ? String(event.location).trim() : "TBA";
            const { city, country, venue } = parseLocation(rawLocation);

            return {
              id: `f1-${startDate}-${slugify(title)}`,
              title,
              startDate,
              endDate,
              location: rawLocation,
              country,
              city,
              venue,
              region: "World" as const,
              series: "F1" as const,
              latviaInvolved: false,
              latvianDrivers: [],
              description:
                "Official Formula 1 World Championship event imported automatically from the F1 ICS calendar.",
              source: {
                type: "imported" as const,
                label: "Official Formula 1 calendar import",
                url: F1_ICS_URL,
              },
              links: { official: "https://www.formula1.com/en/racing/2026" },
              featured: title.toLowerCase().includes("monaco") || title.toLowerCase().includes("british"),
              popularityScore: 92,
            } satisfies Race;
          })
          .filter((race) => race.startDate.startsWith("2026-"))
          .sort((a, b) => a.startDate.localeCompare(b.startDate));

        if (importedRaces.length >= 10) {
          races = importedRaces;
        }
      }
    } catch {
      races = f1FallbackRaces;
    }

    f1Cache = {
      expiresAt: Date.now() + F1_CACHE_TTL_MS,
      races,
    };

    return races;
  })();

  try {
    return await f1InFlight;
  } finally {
    f1InFlight = null;
  }
}
