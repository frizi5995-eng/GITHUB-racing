import { Race } from "./types";

const WRC_SOURCE_URL = "https://www.wrc.com/en/calendar";

const SESKS_WRC_ROUNDS = new Set([
  "wrc-2026-02-12-rally-sweden",
  "wrc-2026-05-07-rally-de-portugal",
  "wrc-2026-06-25-acropolis-rally-greece",
  "wrc-2026-07-16-rally-estonia",
  "wrc-2026-07-30-rally-finland",
  "wrc-2026-10-01-rally-italia-sardegna",
  "wrc-2026-11-11-rally-saudi-arabia",
]);

function wrcRace({
  id,
  title,
  startDate,
  endDate,
  country,
  city,
  venue,
  surface,
  featured = false,
}: {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
  country: string;
  city: string;
  venue?: string;
  surface: string;
  featured?: boolean;
}): Race {
  const latviaInvolved = SESKS_WRC_ROUNDS.has(id);

  return {
    id,
    title,
    startDate,
    endDate,
    country,
    city,
    venue,
    location: venue ? `${venue}, ${city}, ${country}` : `${city}, ${country}`,
    region: "World",
    series: "WRC",
    latviaInvolved,
    latvianDrivers: latviaInvolved ? ["martins-sesks", "renars-francis"] : [],
    description: `${title} is an official 2026 World Rally Championship round on ${surface}.`,
    source: {
      type: "fallback",
      label: "Official WRC fallback schedule",
      url: WRC_SOURCE_URL,
    },
    links: { official: WRC_SOURCE_URL, stream: "https://www.rally.tv/" },
    featured: featured || latviaInvolved,
    popularityScore: latviaInvolved ? 94 : 88,
  };
}

export const wrcFallbackRaces: Race[] = [
  wrcRace({
    id: "wrc-2026-01-22-rallye-monte-carlo",
    title: "WRC Rallye Monte-Carlo 2026",
    startDate: "2026-01-22",
    endDate: "2026-01-25",
    country: "Monaco",
    city: "Monte-Carlo",
    venue: "Gap service park",
    surface: "tarmac and ice",
    featured: true,
  }),
  wrcRace({
    id: "wrc-2026-02-12-rally-sweden",
    title: "WRC Rally Sweden 2026",
    startDate: "2026-02-12",
    endDate: "2026-02-15",
    country: "Sweden",
    city: "Umea",
    venue: "Umea service park",
    surface: "snow and ice",
  }),
  wrcRace({
    id: "wrc-2026-03-12-safari-rally-kenya",
    title: "WRC Safari Rally Kenya 2026",
    startDate: "2026-03-12",
    endDate: "2026-03-15",
    country: "Kenya",
    city: "Naivasha",
    venue: "Naivasha service park",
    surface: "gravel",
    featured: true,
  }),
  wrcRace({
    id: "wrc-2026-04-09-croatia-rally",
    title: "WRC Croatia Rally 2026",
    startDate: "2026-04-09",
    endDate: "2026-04-12",
    country: "Croatia",
    city: "Rijeka",
    surface: "tarmac",
  }),
  wrcRace({
    id: "wrc-2026-04-23-rally-islas-canarias",
    title: "WRC Rally Islas Canarias 2026",
    startDate: "2026-04-23",
    endDate: "2026-04-26",
    country: "Spain",
    city: "Las Palmas de Gran Canaria",
    venue: "Gran Canaria Stadium",
    surface: "asphalt",
    featured: true,
  }),
  wrcRace({
    id: "wrc-2026-05-07-rally-de-portugal",
    title: "WRC Vodafone Rally de Portugal 2026",
    startDate: "2026-05-07",
    endDate: "2026-05-10",
    country: "Portugal",
    city: "Matosinhos",
    venue: "Exponor service park",
    surface: "gravel",
  }),
  wrcRace({
    id: "wrc-2026-05-28-rally-japan",
    title: "WRC FORUM8 Rally Japan 2026",
    startDate: "2026-05-28",
    endDate: "2026-05-31",
    country: "Japan",
    city: "Toyota City",
    venue: "Toyota City service park",
    surface: "tarmac",
    featured: true,
  }),
  wrcRace({
    id: "wrc-2026-06-25-acropolis-rally-greece",
    title: "WRC EKO Acropolis Rally Greece 2026",
    startDate: "2026-06-25",
    endDate: "2026-06-28",
    country: "Greece",
    city: "Lamia",
    surface: "gravel",
  }),
  wrcRace({
    id: "wrc-2026-07-16-rally-estonia",
    title: "WRC Delfi Rally Estonia 2026",
    startDate: "2026-07-16",
    endDate: "2026-07-19",
    country: "Estonia",
    city: "Tartu",
    surface: "gravel",
  }),
  wrcRace({
    id: "wrc-2026-07-30-rally-finland",
    title: "WRC Secto Rally Finland 2026",
    startDate: "2026-07-30",
    endDate: "2026-08-02",
    country: "Finland",
    city: "Jyvaskyla",
    surface: "gravel",
  }),
  wrcRace({
    id: "wrc-2026-08-27-rally-del-paraguay",
    title: "WRC ueno Rally del Paraguay 2026",
    startDate: "2026-08-27",
    endDate: "2026-08-30",
    country: "Paraguay",
    city: "Encarnacion",
    surface: "gravel",
  }),
  wrcRace({
    id: "wrc-2026-09-10-rally-chile-bio-bio",
    title: "WRC Rally Chile Bio Bio 2026",
    startDate: "2026-09-10",
    endDate: "2026-09-13",
    country: "Chile",
    city: "Concepcion",
    surface: "gravel",
  }),
  wrcRace({
    id: "wrc-2026-10-01-rally-italia-sardegna",
    title: "WRC Rally Italia Sardegna 2026",
    startDate: "2026-10-01",
    endDate: "2026-10-04",
    country: "Italy",
    city: "Alghero",
    surface: "gravel",
  }),
  wrcRace({
    id: "wrc-2026-11-11-rally-saudi-arabia",
    title: "WRC Rally Saudi Arabia 2026",
    startDate: "2026-11-11",
    endDate: "2026-11-14",
    country: "Saudi Arabia",
    city: "Jeddah",
    surface: "desert gravel",
    featured: true,
  }),
];
