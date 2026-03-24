import { Race } from "./types";
import { wrcFallbackRaces } from "./wrcFallback";

export const WRC_CALENDAR_URL = "https://www.wrc.com/en/calendar?rb3TabId=upcoming";
const WRC_BASE_URL = "https://www.wrc.com";
const WRC_CACHE_TTL_MS = 30 * 60 * 1000;

export type WRCEventDetails = {
  standfirst?: string;
  about?: string;
  servicePark?: string;
  stages?: string;
  surface?: string;
  website?: string;
  tickets?: string;
  liveStream?: string;
  tvGuide?: string;
};

let wrcRaceCache:
  | {
      expiresAt: number;
      races: Race[];
    }
  | null = null;
let wrcRaceInFlight: Promise<Race[]> | null = null;

const wrcEventCache = new Map<
  string,
  {
    expiresAt: number;
    details: WRCEventDetails | null;
  }
>();
const wrcEventInFlight = new Map<string, Promise<WRCEventDetails | null>>();

async function fetchWithTimeout(url: string, init: RequestInit, timeoutMs: number) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    return await fetch(url, {
      ...init,
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timeout);
  }
}

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function decodeHtml(value: string) {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/&uuml;/g, "u")
    .replace(/&ouml;/g, "o")
    .replace(/&iacute;/g, "i")
    .replace(/&oacute;/g, "o")
    .replace(/&aacute;/g, "a")
    .replace(/&eacute;/g, "e");
}

function stripTags(value: string) {
  return decodeHtml(value.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim());
}

function decodeJsonText(value: string) {
  try {
    return JSON.parse(`"${value.replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`);
  } catch {
    return value;
  }
}

function normalizeText(value: string) {
  return decodeHtml(value).replace(/\s+/g, " ").trim();
}

function extractApolloState(html: string) {
  const match = html.match(/<script type="application\/json" id="rb3-apollo-state">([\s\S]*?)<\/script>/);
  if (!match) return null;

  try {
    return JSON.parse(match[1]) as Record<string, unknown>;
  } catch {
    return null;
  }
}

function getDataNode(value: unknown) {
  if (!value || typeof value !== "object") return null;
  const data = (value as { data?: { data?: unknown } }).data?.data;
  return data && typeof data === "object" ? data : null;
}

function getTextFragments(cell: unknown): string[] {
  if (!Array.isArray(cell)) return [];

  return cell
    .flatMap((item) => {
      if (!Array.isArray(item)) return [];
      return item
        .map((part) => {
          if (!part || typeof part !== "object") return "";
          const text = (part as { text?: string }).text;
          return typeof text === "string" ? normalizeText(decodeJsonText(text)) : "";
        })
        .filter(Boolean);
    })
    .filter(Boolean);
}

function getHref(cell: unknown) {
  if (!Array.isArray(cell)) return undefined;

  for (const item of cell) {
    if (!Array.isArray(item)) continue;
    for (const part of item) {
      if (!part || typeof part !== "object") continue;
      const href = (part as { href?: string }).href;
      if (typeof href === "string" && href) return href;
    }
  }

  return undefined;
}

function extractCards(html: string) {
  const matches = html.matchAll(
    /<a class="event-feed-card[\s\S]*?href="(\/en\/events\/[^"]+)"[\s\S]*?<div class="event-feed-card__title">([\s\S]*?)<\/div>[\s\S]*?<time class="event-feed-card__date-text" datetime="([^"]+)">([\s\S]*?)<\/time>[\s\S]*?<span class="event-feed-card__location-text">([\s\S]*?)<\/span>[\s\S]*?<div class="event-badge__text">([\s\S]*?)<\/div>/g,
  );

  return Array.from(matches)
    .map((match) => {
      const href = match[1];
      const title = stripTags(match[2] ?? "");
      const datetime = match[3];
      const country = stripTags(match[5] ?? "");
      const status = stripTags(match[6] ?? "");

      if (!href || !title || !datetime || status.toLowerCase() !== "upcoming event") {
        return null;
      }

      return {
        href,
        title,
        startDate: datetime.slice(0, 10),
        country,
      };
    })
    .filter((card): card is { href: string; title: string; startDate: string; country: string } => Boolean(card));
}

export async function getWRCRaces(): Promise<Race[]> {
  if (wrcRaceCache && wrcRaceCache.expiresAt > Date.now()) {
    return wrcRaceCache.races;
  }

  if (wrcRaceInFlight) {
    return wrcRaceInFlight;
  }

  wrcRaceInFlight = (async () => {
    let races = wrcFallbackRaces;

    try {
      const response = await fetchWithTimeout(WRC_CALENDAR_URL, {
        next: { revalidate: 3600 },
        headers: {
          "user-agent": "Mozilla/5.0 (compatible; RaceHubBot/1.0)",
        },
      }, 5000);

      if (response.ok) {
        const html = await response.text();
        const cards = extractCards(html);
        const parsed = cards
          .map((card) => ({
            id: `wrc-${card.startDate}-${slugify(card.title)}`,
            title: card.title,
            startDate: card.startDate,
            location: card.country,
            country: card.country,
            city: card.country,
            region: "World" as const,
            series: "WRC" as const,
            latviaInvolved:
              card.title.toLowerCase().includes("estonia") || card.title.toLowerCase().includes("finland"),
            latvianDrivers:
              card.title.toLowerCase().includes("estonia") || card.title.toLowerCase().includes("finland")
                ? ["sesks"]
                : [],
            description: "Official World Rally Championship event imported automatically from the WRC calendar.",
            links: { official: `${WRC_BASE_URL}${card.href}` },
          }))
          .filter((race) => race.startDate.startsWith("2026-"))
          .sort((a, b) => a.startDate.localeCompare(b.startDate));

        if (parsed.length > 0) {
          races = parsed;
        }
      }
    } catch {
      races = wrcFallbackRaces;
    }

    wrcRaceCache = {
      expiresAt: Date.now() + WRC_CACHE_TTL_MS,
      races,
    };

    return races;
  })();

  try {
    return await wrcRaceInFlight;
  } finally {
    wrcRaceInFlight = null;
  }
}

export async function getWRCEventDetails(url: string): Promise<WRCEventDetails | null> {
  const cached = wrcEventCache.get(url);
  if (cached && cached.expiresAt > Date.now()) {
    return cached.details;
  }

  const pending = wrcEventInFlight.get(url);
  if (pending) {
    return pending;
  }

  const promise = (async () => {
    try {
      const response = await fetchWithTimeout(url, {
      next: { revalidate: 3600 },
      headers: {
        "user-agent": "Mozilla/5.0 (compatible; RaceHubBot/1.0)",
      },
      }, 5000);

      if (!response.ok) {
        return null;
      }

      const html = await response.text();
      const apolloState = extractApolloState(html);
      if (!apolloState) return null;

      const unifiedEntry = Object.entries(apolloState).find(([key]) => key.includes("unifiedEventHero"));
      const mainSubPageEntry = Object.entries(apolloState).find(([key]) => key.includes("mainSubPage"));
      const descriptionEntry = Object.entries(apolloState).find(([key]) => key.includes("?rb3Schema=v1:description"));

      const heroData = unifiedEntry ? getDataNode(unifiedEntry[1]) : null;
      const mainSubPageData = mainSubPageEntry ? getDataNode(mainSubPageEntry[1]) : null;
      const descriptionData = descriptionEntry ? getDataNode(descriptionEntry[1]) : null;

      const details: WRCEventDetails = {};

      const standfirst = (descriptionData as { partOfEventSeries?: { standfirst?: string } } | null)?.partOfEventSeries?.standfirst;
      if (typeof standfirst === "string") {
        details.standfirst = normalizeText(standfirst);
      }

      const descriptionParagraphs = (descriptionData as { description?: Array<{ elements?: Array<{ text?: string }> }> } | null)?.description;
      if (Array.isArray(descriptionParagraphs)) {
        const about = descriptionParagraphs
          .flatMap((paragraph) => paragraph.elements ?? [])
          .map((element) => (typeof element.text === "string" ? normalizeText(element.text) : ""))
          .filter(Boolean)
          .join(" ");

        if (about) details.about = about;
      }

      const items = (mainSubPageData as { items?: Array<{ type?: string; rows?: unknown[] }> } | null)?.items;
      const table = Array.isArray(items) ? items.find((item) => item?.type === "table") : null;
      const rows = table && Array.isArray(table.rows) ? table.rows : [];
      const keyFacts = new Map<string, { text: string; href?: string }>();

      for (const row of rows) {
        if (!Array.isArray(row) || row.length < 2) continue;
        const label = getTextFragments(row[0]).join(" ").trim();
        const valueText = getTextFragments(row[1]).join(" ").trim();
        const href = getHref(row[1]);
        if (label && valueText) {
          keyFacts.set(label, { text: valueText, href });
        }
      }

      details.servicePark = keyFacts.get("Service Park")?.text;
      details.stages = keyFacts.get("Stages")?.text;
      details.surface = keyFacts.get("Surface")?.text;
      details.website = keyFacts.get("Website")?.href ?? keyFacts.get("Website")?.text;
      details.tickets = keyFacts.get("Tickets")?.href ?? keyFacts.get("Tickets")?.text;
      details.liveStream = keyFacts.get("Watch the rally")?.href;

      const ctas = (heroData as { ctas?: Array<{ text?: string; link?: string }> } | null)?.ctas;
      if (Array.isArray(ctas)) {
        const streamCta = ctas.find((cta) => typeof cta.text === "string" && cta.text.toLowerCase().includes("stream"));
        if (!details.liveStream && streamCta?.link) details.liveStream = streamCta.link;
      }

      if (!details.standfirst && heroData && typeof (heroData as { subHeading?: string }).subHeading === "string") {
        details.standfirst = normalizeText((heroData as { subHeading?: string }).subHeading ?? "");
      }

      return details;
    } catch {
      return null;
    }
  })();

  wrcEventInFlight.set(url, promise);

  try {
    const details = await promise;
    wrcEventCache.set(url, {
      expiresAt: Date.now() + WRC_CACHE_TTL_MS,
      details,
    });
    return details;
  } finally {
    wrcEventInFlight.delete(url);
  }
}
