import { F1_ICS_URL } from "./f1";
import { ENABLE_LIVE_IMPORTS, LIVE_IMPORT_TIMEOUT_MS } from "./importConfig";
import { WRC_CALENDAR_URL } from "./wrc";

export type ImportSourceStatus = "automated" | "available" | "curated";

export type ImportSourceInfo = {
  id: string;
  label: string;
  series: string;
  status: ImportSourceStatus;
  url: string;
  note: string;
};

export function getImportSources(): ImportSourceInfo[] {
  return [
    {
      id: "f1-official-ics",
      label: "Formula 1 official ICS",
      series: "F1",
      status: ENABLE_LIVE_IMPORTS ? "automated" : "available",
      url: F1_ICS_URL,
      note: ENABLE_LIVE_IMPORTS
        ? "Live ICS imports are enabled and cached."
        : "Ready for automatic import when RACEHUB_ENABLE_LIVE_IMPORTS=true.",
    },
    {
      id: "wrc-official-calendar",
      label: "World Rally Championship calendar",
      series: "WRC",
      status: ENABLE_LIVE_IMPORTS ? "automated" : "available",
      url: WRC_CALENDAR_URL,
      note: ENABLE_LIVE_IMPORTS
        ? "Live WRC imports are enabled with fallback protection."
        : "Ready for automatic import when RACEHUB_ENABLE_LIVE_IMPORTS=true.",
    },
    {
      id: "latvia-rally-calendar",
      label: "Latvian rally calendar",
      series: "Rally",
      status: "curated",
      url: "https://m.autorally.lv/en/rallies",
      note: "Local rally events are curated into the shared race model because public machine-readable feeds are limited.",
    },
    {
      id: "baltic-racing-calendar",
      label: "Baltic racing and rally sources",
      series: "Circuit, Rally, Rallycross, Karting",
      status: "curated",
      url: "https://www.sporttimeracing.com/de/touring/-baltic-touring-car-championship",
      note: "Baltic events use linked source data plus manual cleanup for better Latvian participation metadata.",
    },
    {
      id: "world-series-curation",
      label: "World series curated layer",
      series: "WEC, Formula E, MotoGP, NASCAR",
      status: "curated",
      url: "https://www.fia.com/championship/events/world-endurance-championship/season-2026/24-hours-le-mans",
      note: "Major world events are normalized locally until a stable official feed is added.",
    },
  ];
}

export function getImportStatus() {
  return {
    liveImportsEnabled: ENABLE_LIVE_IMPORTS,
    timeoutMs: LIVE_IMPORT_TIMEOUT_MS,
    cacheMinutes: 30,
    sources: getImportSources(),
  };
}
