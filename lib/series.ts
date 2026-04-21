import { Series } from "./types";
import { getSeriesHref } from "./utils";

export type SeriesConfig = {
  slug: string;
  code: Series;
  name: string;
  shortDescription: string;
  description: string;
  spotlight: string;
  popularity: number;
  regionFocus: string;
};

export const SERIES_CONFIG: SeriesConfig[] = [
  {
    slug: "f1",
    code: "F1",
    name: "Formula 1",
    shortDescription: "Official Grand Prix weekends and session imports.",
    description:
      "Formula 1 is the top single-seater world championship. RaceHub pulls in official calendar data and keeps the series visible alongside Baltic motorsport.",
    spotlight:
      "Ideal for fans who want the world calendar without leaving the same product they use for Latvia-focused discovery.",
    popularity: 100,
    regionFocus: "World",
  },
  {
    slug: "wrc",
    code: "WRC",
    name: "World Rally Championship",
    shortDescription: "Official rally rounds with Latvian-relevant coverage.",
    description:
      "WRC is where the biggest gravel, tarmac and snow rallies live. This hub highlights rounds that matter most for Baltic fans, especially when Latvian crews are involved.",
    spotlight:
      "Rally Estonia and Rally Finland are especially relevant for Latvian fans following nearby rounds and regional participation.",
    popularity: 96,
    regionFocus: "World and Baltics",
  },
  {
    slug: "drift",
    code: "Drift",
    name: "Drift",
    shortDescription: "Riga, Baltic and world drift weekends.",
    description:
      "From Bikernieki headline weekends to Baltic championship rounds, this section tracks drift events that local fans are most likely to attend or follow.",
    spotlight:
      "Bikernieki remains the anchor venue, but the platform also surfaces cross-border drift weekends around the Baltics.",
    popularity: 84,
    regionFocus: "Latvia and Baltics",
  },
  {
    slug: "rally",
    code: "Rally",
    name: "Rally",
    shortDescription: "Regional rally, Baltic championship and road rally highlights.",
    description:
      "Rally coverage bridges Latvia, neighboring Baltic events and world-level touchpoints. It is designed for fans who care about where local crews show up next.",
    spotlight:
      "Latvia-first metadata makes it easy to spot which rallies matter for national and Baltic motorsport followers.",
    popularity: 88,
    regionFocus: "Latvia, Baltics and World",
  },
  {
    slug: "circuit",
    code: "Circuit",
    name: "Circuit Racing",
    shortDescription: "Touring, endurance and track weekends across the region.",
    description:
      "Circuit racing combines the local Bikernieki scene with Baltic endurance and sprint race weekends, plus selected international endurance highlights.",
    spotlight:
      "A strong fit for fans who move between local paddocks and bigger endurance events like WEC weekends.",
    popularity: 78,
    regionFocus: "Latvia and Baltics",
  },
  {
    slug: "karting",
    code: "Karting",
    name: "Karting",
    shortDescription: "Junior ladders and major international kart races.",
    description:
      "Karting pages keep the grassroots side of motorsport visible, including Baltic feeder events and major FIA weekends that help explain the wider pipeline.",
    spotlight:
      "Useful for following youth development and future talent in one place.",
    popularity: 63,
    regionFocus: "Baltics and World",
  },
  {
    slug: "rallycross",
    code: "Rallycross",
    name: "Rallycross",
    shortDescription: "Short-format mixed-surface racing with a strong Baltic fan base.",
    description:
      "Rallycross adds a fast, spectator-friendly category to RaceHub, especially useful for Riga, Lithuania and nearby European rounds with Latvian interest.",
    spotlight:
      "A natural home for fans following Janis Baumanis, Bikernieki weekends and Baltic cross-border events.",
    popularity: 74,
    regionFocus: "Latvia and Baltics",
  },
  {
    slug: "nascar",
    code: "NASCAR",
    name: "NASCAR",
    shortDescription: "Major oval and road-course stock car races.",
    description:
      "NASCAR gives the site broader world appeal while staying lightweight in architecture through the same shared event model.",
    spotlight:
      "Adds a high-profile world racing category without fragmenting the product.",
    popularity: 76,
    regionFocus: "World",
  },
  {
    slug: "wec",
    code: "WEC",
    name: "World Endurance Championship",
    shortDescription: "Global endurance calendar and Le Mans-adjacent events.",
    description:
      "WEC brings prototype and GT endurance racing into the same discovery experience, helpful for fans who also follow circuit racing in the Baltics.",
    spotlight:
      "The endurance angle complements Baltic circuit racing nicely and adds a premium global layer.",
    popularity: 82,
    regionFocus: "World",
  },
  {
    slug: "formula-e",
    code: "Formula E",
    name: "Formula E",
    shortDescription: "Electric street-racing world championship highlights.",
    description:
      "Formula E adds another modern world series and keeps the product feeling like a complete motorsport destination instead of a narrow niche site.",
    spotlight:
      "Good for users who want a quick world-series overview without switching apps.",
    popularity: 70,
    regionFocus: "World",
  },
  {
    slug: "motogp",
    code: "MotoGP",
    name: "MotoGP",
    shortDescription: "Selected premier motorcycle Grand Prix weekends.",
    description:
      "MotoGP coverage gives RaceHub a broader world-racing layer while keeping the core event model shared with car-based categories.",
    spotlight:
      "Useful for users who follow the biggest global race weekends and want them visible in the same calendar.",
    popularity: 73,
    regionFocus: "World",
  },
];

export function getSeriesConfigBySlug(slug: string) {
  return SERIES_CONFIG.find((series) => series.slug === slug);
}

export function getSeriesConfigByCode(code: Series) {
  return SERIES_CONFIG.find((series) => series.code === code);
}

export function getSeriesLinkByCode(code: Series) {
  return getSeriesConfigByCode(code)?.slug
    ? `/series/${getSeriesConfigByCode(code)?.slug}`
    : getSeriesHref(code);
}
