import { Series } from "./types";

export type SeriesConfig = {
  slug: string;
  code: Series;
  name: string;
  description: string;
};

export const SERIES_CONFIG: SeriesConfig[] = [
  {
    slug: "f1",
    code: "F1",
    name: "Formula 1",
    description: "Official Formula 1 calendar with all upcoming Grand Prix weekends.",
  },
  {
    slug: "wrc",
    code: "WRC",
    name: "World Rally Championship",
    description: "Upcoming WRC rounds and world rally events.",
  },
  {
    slug: "drift",
    code: "Drift",
    name: "Drift",
    description: "Drift events and Baltic championship weekends.",
  },
  {
    slug: "rally",
    code: "Rally",
    name: "Rally",
    description: "Regional and international rally events.",
  },
  {
    slug: "circuit",
    code: "Circuit",
    name: "Circuit Racing",
    description: "Circuit race weekends and endurance events.",
  },
  {
    slug: "karting",
    code: "Karting",
    name: "Karting",
    description: "Karting rounds and youth competition weekends.",
  },
  {
    slug: "other",
    code: "Other",
    name: "Other Series",
    description: "Other motorsport series not yet split into dedicated categories.",
  },
];

export function getSeriesConfigBySlug(slug: string) {
  return SERIES_CONFIG.find((series) => series.slug === slug);
}

export function getSeriesConfigByCode(code: Series) {
  return SERIES_CONFIG.find((series) => series.code === code);
}
