import { Driver, Race } from "./types";
import { f1People } from "./f1People";
import { wrcPeople } from "./wrcPeople";
import { worldCalendarRaces } from "./worldCalendarRaces";
import { worldPeople } from "./worldPeople";
import { getDriverSeries } from "./utils";

const latvianDrivers: Driver[] = [
  {
    id: "martins-sesks",
    name: "Martins Sesks",
    discipline: "Rally",
    achievements: [
      "ERC Junior champion and front-running Baltic rally talent.",
      "Multiple World Rally Championship starts with growing attention from international teams.",
      "One of the clearest Latvian names to watch in top-level rally right now.",
    ],
    active: true,
    nationality: "Latvia",
    hometown: "Liepaja",
    currentSeries: ["WRC", "Rally"],
    bio: "Martins Sesks is one of the leading Latvian rally drivers of his generation. RaceHub tracks his Baltic and world rally appearances because they are a major draw for local fans.",
    featured: true,
  },
  {
    id: "renars-francis",
    name: "Renars Francis",
    discipline: "Rally",
    achievements: [
      "Regular co-driver partner in high-profile Latvian rally programmes.",
      "Part of the Latvian rally crew presence that matters most to Baltic fans.",
    ],
    active: true,
    role: "Co-Driver",
    nationality: "Latvia",
    hometown: "Riga",
    currentSeries: ["WRC", "Rally"],
    bio: "Renars Francis is part of the current Latvian rally story and appears on event pages whenever those programmes are relevant.",
  },
  {
    id: "haralds-slegelmilhs",
    name: "Haralds Slegelmilhs",
    discipline: "Circuit Racing",
    achievements: [
      "Experienced Latvian circuit racer with international single-seater background.",
      "Recognizable name for Latvian fans following circuit and endurance paddocks.",
    ],
    active: true,
    nationality: "Latvia",
    hometown: "Riga",
    currentSeries: ["Circuit", "WEC"],
    bio: "Haralds Slegelmilhs gives the platform a clear Latvia-to-world bridge in the circuit racing category.",
    featured: true,
  },
  {
    id: "konstantins-calko",
    name: "Konstantins Calko",
    discipline: "Circuit Racing",
    achievements: [
      "Latvian endurance and GT racing representative with international experience.",
      "Useful reference point for fans who follow both Baltic track weekends and world endurance racing.",
    ],
    active: true,
    nationality: "Latvia",
    hometown: "Jelgava",
    currentSeries: ["Circuit", "WEC"],
    bio: "Konstantins Calko represents the endurance side of Latvian circuit racing and fits naturally into the platform's Latvia-plus-world positioning.",
  },
  {
    id: "kristaps-bluss",
    name: "Kristaps Bluss",
    discipline: "Drift",
    achievements: [
      "Recognized Latvian drift competitor with international exposure.",
      "Strong name for local fans browsing Bikernieki and Baltic drift weekends.",
    ],
    active: true,
    nationality: "Latvia",
    hometown: "Riga",
    currentSeries: ["Drift"],
    bio: "Kristaps Bluss is part of the drift category that gives RaceHub strong local personality beyond the mainstream world championships.",
    featured: true,
  },
  {
    id: "janis-baumanis",
    name: "Janis Baumanis",
    discipline: "Rallycross",
    achievements: [
      "Well-known Latvian name from European and world rallycross competition.",
      "Important bridge between local fan interest and larger international race weekends.",
    ],
    active: true,
    nationality: "Latvia",
    hometown: "Cesis",
    currentSeries: ["Rallycross", "Circuit"],
    bio: "Janis Baumanis broadens the platform beyond rally and drift, helping RaceHub feel like a real motorsport destination.",
  },
  {
    id: "toms-stolcermanis",
    name: "Toms Stolcermanis",
    discipline: "Single-Seaters",
    achievements: [
      "Emerging Latvian name in the junior single-seater and karting pathway.",
      "Represents the next-generation talent angle of the platform.",
    ],
    active: true,
    nationality: "Latvia",
    hometown: "Riga",
    currentSeries: ["Karting", "Circuit"],
    bio: "Toms Stolcermanis gives the drivers section a useful development-path story for younger Latvian talent.",
  },
];

const manualRaces: Race[] = [
  {
    id: "washcar-riga-summer-race-2026",
    title: "WashCar Riga Summer Race 2026",
    startDate: "2026-05-02",
    endDate: "2026-05-03",
    country: "Latvia",
    city: "Riga",
    venue: "Bikernieki Track",
    location: "Riga, Latvia",
    region: "Latvia",
    series: "Circuit",
    latviaInvolved: true,
    latvianDrivers: ["haralds-slegelmilhs", "konstantins-calko"],
    links: {
      official: "https://www.bilesuserviss.lv/lat/biletes/sports/washcar-riga-summer-race-2026-495890/",
      tickets: "https://www.bilesuserviss.lv/lat/biletes/sports/washcar-riga-summer-race-2026-495890/",
    },
    description:
      "A Baltic circuit racing weekend at Bikernieki with touring, sprint and endurance action. This is one of the best entry-point events for Latvian track-racing fans.",
    source: {
      type: "manual",
      label: "Curated local schedule",
      url: "https://www.bilesuserviss.lv/lat/biletes/sports/washcar-riga-summer-race-2026-495890/",
    },
    featured: true,
  },
  {
    id: "euro-rx-of-latvia-2026",
    title: "Euro RX of Latvia 2026",
    startDate: "2026-05-09",
    endDate: "2026-05-10",
    country: "Latvia",
    city: "Riga",
    venue: "Bikernieki Rallycross Track",
    location: "Riga, Latvia",
    region: "Latvia",
    series: "Rallycross",
    latviaInvolved: true,
    latvianDrivers: ["janis-baumanis"],
    links: {
      official:
        "https://www.bilesuserviss.lv/lat/biletes/sports/fia-eiropas-rallijkrosa-cempionata-1-posms-euro-rx-of-latvia-495801/",
      tickets:
        "https://www.bilesuserviss.lv/lat/biletes/sports/fia-eiropas-rallijkrosa-cempionata-1-posms-euro-rx-of-latvia-495801/",
    },
    description:
      "A high-energy rallycross weekend in Riga that brings international-level action to one of the Baltics' best-known motorsport venues.",
    source: {
      type: "manual",
      label: "Curated local schedule",
      url: "https://www.bilesuserviss.lv/lat/biletes/sports/fia-eiropas-rallijkrosa-cempionata-1-posms-euro-rx-of-latvia-495801/",
    },
    featured: true,
  },
  {
    id: "drift-grand-opening-2026",
    title: "Drift Grand Opening 2026",
    startDate: "2026-05-16",
    endDate: "2026-05-17",
    country: "Latvia",
    city: "Riga",
    venue: "Bikernieki Track",
    location: "Riga, Latvia",
    region: "Latvia",
    series: "Drift",
    latviaInvolved: true,
    latvianDrivers: ["kristaps-bluss"],
    links: {
      official: "https://www.bilesuserviss.lv/rus/bileti/sports/drift-grand-opening-2026-494522/",
      tickets: "https://www.bilesuserviss.lv/rus/bileti/sports/drift-grand-opening-2026-494522/",
    },
    description:
      "The Bikernieki drift season opener with Street, PRO2 and PRO classes. A perfect flagship event for the Latvia-first part of the platform.",
    source: {
      type: "manual",
      label: "Curated local schedule",
      url: "https://www.bilesuserviss.lv/rus/bileti/sports/drift-grand-opening-2026-494522/",
    },
    featured: true,
  },
  {
    id: "rally-liepaja-regional-2026",
    title: "Rally Liepaja Regional Weekend 2026",
    startDate: "2026-06-20",
    endDate: "2026-06-21",
    country: "Latvia",
    city: "Liepaja",
    venue: "Liepaja Service Park",
    location: "Liepaja, Latvia",
    region: "Latvia",
    series: "Rally",
    latviaInvolved: true,
    latvianDrivers: ["martins-sesks", "renars-francis"],
    links: {
      official: "https://www.autorally.lv/",
    },
    description:
      "A Latvia-focused rally weekend that keeps the product useful between the big international championship rounds.",
    source: {
      type: "manual",
      label: "Curated local schedule",
      url: "https://www.autorally.lv/",
    },
  },
  {
    id: "drift-masters-riga-2026",
    title: "Drift Masters Riga 2026",
    startDate: "2026-07-24",
    endDate: "2026-07-25",
    country: "Latvia",
    city: "Riga",
    venue: "Bikernieki Track",
    location: "Riga, Latvia",
    region: "Latvia",
    series: "Drift",
    latviaInvolved: true,
    latvianDrivers: ["kristaps-bluss"],
    links: {
      official: "https://www.bilesuserviss.lv/eng/tickets/drift-masters-riga-2026-101717/",
      tickets: "https://www.bilesuserviss.lv/eng/tickets/drift-masters-riga-2026-101717/",
      stream: "https://www.driftmasters.gp/",
    },
    description:
      "One of the premium Baltic motorsport weekends of the year, bringing a world-class drift spectacle back to Riga.",
    source: {
      type: "manual",
      label: "Curated local schedule",
      url: "https://www.bilesuserviss.lv/eng/tickets/drift-masters-riga-2026-101717/",
    },
    featured: true,
  },
  {
    id: "stateta-grand-prix-riga-2026",
    title: "STATETA Grand Prix Riga 2026",
    startDate: "2026-06-04",
    endDate: "2026-06-06",
    country: "Latvia",
    city: "Riga",
    venue: "Bikernieki Track",
    location: "Riga, Latvia",
    region: "Latvia",
    series: "Circuit",
    latviaInvolved: true,
    latvianDrivers: ["haralds-slegelmilhs", "konstantins-calko"],
    links: {
      official: "https://batcc.eu/2025/12/stateta-bro-pro-bro-grand-prix-riga/",
    },
    description:
      "A major Baltic circuit race meeting in Riga with touring, GT and endurance support categories in one weekend.",
    source: {
      type: "manual",
      label: "Curated local schedule",
      url: "https://batcc.eu/2025/12/stateta-bro-pro-bro-grand-prix-riga/",
    },
  },
  {
    id: "palanga-1006km-2026",
    title: "Palanga 1006 km 2026",
    startDate: "2026-07-16",
    endDate: "2026-07-18",
    country: "Lithuania",
    city: "Palanga",
    venue: "Palanga City Circuit",
    location: "Palanga, Lithuania",
    region: "Baltics",
    series: "Circuit",
    latviaInvolved: true,
    latvianDrivers: ["konstantins-calko", "haralds-slegelmilhs"],
    links: {
      official: "https://www.racing.lt/en/events/1006-km-race",
    },
    description:
      "The Baltic endurance highlight of the summer, with strong cross-border interest from Latvia, Lithuania and Estonia.",
    source: {
      type: "manual",
      label: "Curated Baltic schedule",
      url: "https://www.racing.lt/en/events/1006-km-race",
    },
    featured: true,
  },
  {
    id: "kaunas-grand-prix-2026",
    title: "Kaunas Grand Prix 2026",
    startDate: "2026-07-03",
    endDate: "2026-07-04",
    country: "Lithuania",
    city: "Kaunas",
    venue: "Nemuno Ziedas",
    location: "Kaunas, Lithuania",
    region: "Baltics",
    series: "Circuit",
    latviaInvolved: true,
    latvianDrivers: ["konstantins-calko"],
    links: {
      official: "https://www.balticracingseries.eu/calendar",
    },
    description:
      "A Baltic circuit stop that is especially relevant for Latvian paddock followers travelling across the region.",
    source: {
      type: "manual",
      label: "Curated Baltic schedule",
      url: "https://www.balticracingseries.eu/calendar",
    },
  },
  {
    id: "parnu-summer-race-2026",
    title: "Parnu Summer Race 2026",
    startDate: "2026-08-27",
    endDate: "2026-08-30",
    country: "Estonia",
    city: "Parnu",
    venue: "Porsche Ring",
    location: "Parnu, Estonia",
    region: "Baltics",
    series: "Circuit",
    latviaInvolved: true,
    latvianDrivers: ["haralds-slegelmilhs", "konstantins-calko"],
    links: {
      official: "https://www.balticracingseries.eu/calendar",
    },
    description:
      "A late-summer Baltic race festival and one of the most useful regional events to surface for track-racing fans in Latvia.",
    source: {
      type: "manual",
      label: "Curated Baltic schedule",
      url: "https://www.balticracingseries.eu/calendar",
    },
  },
  {
    id: "baltic-karting-academy-cup-2026",
    title: "Baltic Karting Academy Cup 2026",
    startDate: "2026-06-13",
    endDate: "2026-06-14",
    country: "Estonia",
    city: "Rapla",
    venue: "Rapla Kart Track",
    location: "Rapla, Estonia",
    region: "Baltics",
    series: "Karting",
    latviaInvolved: true,
    latvianDrivers: ["toms-stolcermanis"],
    links: {
      official: "https://www.baltickartingacademy.com/",
    },
    description:
      "A Baltic feeder-level karting weekend that gives the platform better youth and development coverage.",
    source: {
      type: "manual",
      label: "Curated Baltic schedule",
      url: "https://www.baltickartingacademy.com/",
    },
  },
  {
    id: "wec-6-hours-of-spa-2026",
    title: "WEC 6 Hours of Spa 2026",
    startDate: "2026-05-09",
    endDate: "2026-05-09",
    country: "Belgium",
    city: "Stavelot",
    venue: "Circuit de Spa-Francorchamps",
    location: "Spa-Francorchamps, Belgium",
    region: "World",
    series: "WEC",
    latviaInvolved: false,
    latvianDrivers: [],
    links: {
      official: "https://www.fiawec.com/",
    },
    description:
      "A major world endurance racing round that adds premium global coverage to the platform's circuit-racing offering.",
    source: {
      type: "manual",
      label: "Curated world schedule",
      url: "https://www.fiawec.com/",
    },
    featured: true,
  },
  {
    id: "formula-e-monaco-eprix-2026",
    title: "Formula E Monaco E-Prix Double-Header 2026",
    startDate: "2026-05-16",
    endDate: "2026-05-17",
    country: "Monaco",
    city: "Monte Carlo",
    venue: "Circuit de Monaco",
    location: "Monte Carlo, Monaco",
    region: "World",
    series: "Formula E",
    latviaInvolved: false,
    latvianDrivers: [],
    links: {
      official: "https://www.fiaformulae.com/en/calendar/2025-26/r9-monaco",
      stream: "https://www.fiaformulae.com/en/ways-to-watch",
    },
    description:
      "A Monaco Formula E double-header that adds a modern street-racing world championship layer to the calendar.",
    source: {
      type: "manual",
      label: "Official Formula E schedule",
      url: "https://www.fiaformulae.com/en/calendar/2025-26/r9-monaco",
    },
    featured: true,
    popularityScore: 84,
  },
  {
    id: "nascar-coca-cola-600-2026",
    title: "NASCAR Coca-Cola 600 2026",
    startDate: "2026-05-24",
    endDate: "2026-05-24",
    country: "United States",
    city: "Concord",
    venue: "Charlotte Motor Speedway",
    location: "Concord, United States",
    region: "World",
    series: "NASCAR",
    latviaInvolved: false,
    latvianDrivers: [],
    links: {
      official: "https://www.nascar.com/",
      stream: "https://www.nascar.com/",
    },
    description:
      "A headline NASCAR event that broadens world-series coverage and makes the home page feel more alive for general motorsport fans.",
    source: {
      type: "manual",
      label: "Curated world schedule",
      url: "https://www.nascar.com/",
    },
  },
  {
    id: "motogp-silverstone-2026",
    title: "MotoGP British Grand Prix 2026",
    startDate: "2026-08-07",
    endDate: "2026-08-09",
    country: "United Kingdom",
    city: "Silverstone",
    venue: "Silverstone Circuit",
    location: "Silverstone, United Kingdom",
    region: "World",
    series: "MotoGP",
    latviaInvolved: false,
    latvianDrivers: [],
    links: {
      official: "https://www.motogp.com/",
      stream: "https://www.motogp.com/",
    },
    description:
      "A bonus world-series addition that works cleanly within the shared event architecture without changing the core Latvia-first positioning.",
    source: {
      type: "manual",
      label: "Curated world schedule",
      url: "https://www.motogp.com/",
    },
  },
  {
    id: "fia-karting-euro-la-conca-2026",
    title: "FIA Karting European Championship Round 1",
    startDate: "2026-04-09",
    endDate: "2026-04-12",
    country: "Italy",
    city: "Muro Leccese",
    venue: "World Circuit La Conca",
    location: "Muro Leccese, Italy",
    region: "World",
    series: "Karting",
    latviaInvolved: false,
    latvianDrivers: [],
    links: {
      official:
        "https://www.kartcom.com/en/news/2025/10/20/2026-fia-karting-calendar-approved-by-the-world-motor-sport-council/",
    },
    description:
      "The opening major FIA karting round of the season and a useful world benchmark for younger racing categories.",
    source: {
      type: "manual",
      label: "Curated world schedule",
      url: "https://www.kartcom.com/en/news/2025/10/20/2026-fia-karting-calendar-approved-by-the-world-motor-sport-council/",
    },
  },
  {
    id: "fia-karting-world-le-mans-2026",
    title: "FIA Karting World Championship KZ 2026",
    startDate: "2026-09-17",
    endDate: "2026-09-20",
    country: "France",
    city: "Le Mans",
    venue: "Le Mans Karting International",
    location: "Le Mans, France",
    region: "World",
    series: "Karting",
    latviaInvolved: false,
    latvianDrivers: [],
    links: {
      official:
        "https://www.kartcom.com/en/news/2025/10/20/2026-fia-karting-calendar-approved-by-the-world-motor-sport-council/",
    },
    description:
      "A major international karting championship weekend that helps the world-racing side of the product feel complete.",
    source: {
      type: "manual",
      label: "Curated world schedule",
      url: "https://www.kartcom.com/en/news/2025/10/20/2026-fia-karting-calendar-approved-by-the-world-motor-sport-council/",
    },
  },
  {
    id: "rally-dienvidkurzeme-2026",
    title: "Rally Dienvidkurzeme 2026",
    startDate: "2026-05-30",
    endDate: "2026-05-31",
    country: "Latvia",
    city: "Dienvidkurzeme",
    venue: "Dienvidkurzeme roads",
    location: "Dienvidkurzeme, Latvia",
    region: "Latvia",
    series: "Rally",
    latviaInvolved: true,
    latvianDrivers: ["martins-sesks", "renars-francis"],
    links: {
      official: "https://m.autorally.lv/en/rallies",
    },
    description:
      "A Latvian Rally Championship round in South Kurzeme, useful for fans tracking the national rally calendar after the winter events.",
    source: {
      type: "manual",
      label: "Latvian Rally Championship schedule",
      url: "https://m.autorally.lv/en/rallies",
    },
    featured: true,
    popularityScore: 86,
  },
  {
    id: "rallysprint-talsi-2026",
    title: "Rallysprint Talsi 2026",
    startDate: "2026-06-27",
    endDate: "2026-06-28",
    country: "Latvia",
    city: "Talsi",
    venue: "Talsi rally stages",
    location: "Talsi, Latvia",
    region: "Latvia",
    series: "Rally",
    latviaInvolved: true,
    latvianDrivers: ["martins-sesks", "renars-francis"],
    links: {
      official: "https://m.autorally.lv/en/rallies",
    },
    description:
      "A compact Latvian rallysprint weekend that keeps local rally discovery strong between larger championship rounds.",
    source: {
      type: "manual",
      label: "Latvian Rally Championship schedule",
      url: "https://m.autorally.lv/en/rallies",
    },
    popularityScore: 78,
  },
  {
    id: "rally-louna-eesti-2026",
    title: "Rally Louna-Eesti 2026",
    startDate: "2026-07-03",
    endDate: "2026-07-04",
    country: "Estonia",
    city: "South Estonia",
    venue: "South Estonia rally stages",
    location: "South Estonia",
    region: "Baltics",
    series: "Rally",
    latviaInvolved: true,
    latvianDrivers: ["martins-sesks", "renars-francis"],
    links: {
      official: "https://m.autorally.lv/en/rallies",
    },
    description:
      "A nearby Estonian rally round with clear relevance for Latvian rally fans following Baltic cross-border events.",
    source: {
      type: "manual",
      label: "Latvian Rally Championship schedule",
      url: "https://m.autorally.lv/en/rallies",
    },
    featured: true,
    popularityScore: 82,
  },
  {
    id: "rallysprint-cesvaine-2026",
    title: "Rallysprint Cesvaine 2026",
    startDate: "2026-08-15",
    country: "Latvia",
    city: "Cesvaine",
    venue: "Cesvaine rally stages",
    location: "Cesvaine, Latvia",
    region: "Latvia",
    series: "Rally",
    latviaInvolved: true,
    latvianDrivers: ["martins-sesks", "renars-francis"],
    links: {
      official: "https://m.autorally.lv/en/rallies",
    },
    description:
      "A one-day Latvian rallysprint stop that helps local fans keep the national calendar visible through summer.",
    source: {
      type: "manual",
      label: "Latvian Rally Championship schedule",
      url: "https://m.autorally.lv/en/rallies",
    },
    popularityScore: 74,
  },
  {
    id: "rally-cesis-2026",
    title: "Rally Cesis 2026",
    startDate: "2026-09-12",
    endDate: "2026-09-13",
    country: "Latvia",
    city: "Cesis",
    venue: "Cesis rally stages",
    location: "Cesis, Latvia",
    region: "Latvia",
    series: "Rally",
    latviaInvolved: true,
    latvianDrivers: ["martins-sesks", "renars-francis"],
    links: {
      official: "https://m.autorally.lv/en/rallies",
    },
    description:
      "A Latvian rally round with strong local fan value and a natural fit for the platform's Latvia-first discovery mode.",
    source: {
      type: "manual",
      label: "Latvian Rally Championship schedule",
      url: "https://m.autorally.lv/en/rallies",
    },
    featured: true,
    popularityScore: 84,
  },
  {
    id: "rallysprint-latvija-2026",
    title: "Rallysprint Latvija 2026",
    startDate: "2026-10-24",
    endDate: "2026-10-25",
    country: "Latvia",
    city: "Latvia",
    venue: "Latvian rally stages",
    location: "Latvia",
    region: "Latvia",
    series: "Rally",
    latviaInvolved: true,
    latvianDrivers: ["martins-sesks", "renars-francis"],
    links: {
      official: "https://m.autorally.lv/en/rallies",
    },
    description:
      "A late-season Latvian rallysprint round that keeps the local calendar active deep into autumn.",
    source: {
      type: "manual",
      label: "Latvian Rally Championship schedule",
      url: "https://m.autorally.lv/en/rallies",
    },
    popularityScore: 76,
  },
  {
    id: "rally-aukstaitija-2026",
    title: "Rally Aukstaitija 2026",
    startDate: "2026-05-15",
    endDate: "2026-05-16",
    country: "Lithuania",
    city: "Zarasai",
    venue: "Zarasai rally stages",
    location: "Zarasai, Lithuania",
    region: "Baltics",
    series: "Rally",
    latviaInvolved: true,
    latvianDrivers: ["martins-sesks", "renars-francis"],
    links: {
      official: "https://rallylithuania.com/larc-2026-calendar/",
    },
    description:
      "A Lithuanian championship rally round close enough to matter for Baltic and Latvian rally followers.",
    source: {
      type: "manual",
      label: "Lithuanian rally schedule",
      url: "https://rallylithuania.com/larc-2026-calendar/",
    },
    popularityScore: 75,
  },
  {
    id: "rally-zemaitija-2026",
    title: "Rally Zemaitija 2026",
    startDate: "2026-06-05",
    endDate: "2026-06-06",
    country: "Lithuania",
    city: "Kelme",
    venue: "Kelme rally stages",
    location: "Kelme, Lithuania",
    region: "Baltics",
    series: "Rally",
    latviaInvolved: true,
    latvianDrivers: ["martins-sesks", "renars-francis"],
    links: {
      official: "https://rallylithuania.com/larc-2026-calendar/",
    },
    description:
      "A Lithuanian Automobile Rally Championship round that strengthens RaceHub's Baltic rally coverage.",
    source: {
      type: "manual",
      label: "Lithuanian rally schedule",
      url: "https://rallylithuania.com/larc-2026-calendar/",
    },
    popularityScore: 73,
  },
  {
    id: "rokiskio-grand-rally-2026",
    title: "Rokiskio Grand Rally 2026",
    startDate: "2026-08-13",
    endDate: "2026-08-15",
    country: "Lithuania",
    city: "Rokiskis",
    venue: "Rokiskis rally stages",
    location: "Rokiskis, Lithuania",
    region: "Baltics",
    series: "Rally",
    latviaInvolved: true,
    latvianDrivers: ["martins-sesks", "renars-francis"],
    links: {
      official: "https://rallylithuania.com/larc-2026-calendar/",
    },
    description:
      "A bigger Lithuanian summer rally that gives Latvian fans another useful Baltic event to track.",
    source: {
      type: "manual",
      label: "Lithuanian rally schedule",
      url: "https://rallylithuania.com/larc-2026-calendar/",
    },
    featured: true,
    popularityScore: 80,
  },
  {
    id: "baltic-rallycross-vilkyciai-2026",
    title: "Baltic Rallycross Vilkyciai 2026",
    startDate: "2026-06-06",
    endDate: "2026-06-07",
    country: "Lithuania",
    city: "Vilkyciai",
    venue: "Vilkyciai Rallycross Track",
    location: "Vilkyciai, Lithuania",
    region: "Baltics",
    series: "Rallycross",
    latviaInvolved: true,
    latvianDrivers: ["janis-baumanis"],
    links: {
      official: "https://www.lasf.lt/",
    },
    description:
      "A Baltic rallycross weekend that keeps Janis Baumanis-style mixed-surface racing visible outside the Riga rounds.",
    source: {
      type: "manual",
      label: "Curated Baltic rallycross schedule",
      url: "https://www.lasf.lt/",
    },
    popularityScore: 77,
  },
  {
    id: "kandava-karting-summer-cup-2026",
    title: "Kandava Karting Summer Cup 2026",
    startDate: "2026-06-27",
    endDate: "2026-06-28",
    country: "Latvia",
    city: "Kandava",
    venue: "Kandava Kart Track",
    location: "Kandava, Latvia",
    region: "Latvia",
    series: "Karting",
    latviaInvolved: true,
    latvianDrivers: ["toms-stolcermanis"],
    links: {
      official: "https://www.laf.lv/",
    },
    description:
      "A local karting weekend that helps RaceHub cover the grassroots and junior pathway side of Latvian motorsport.",
    source: {
      type: "manual",
      label: "Curated Latvian karting schedule",
      url: "https://www.laf.lv/",
    },
    popularityScore: 68,
  },
  {
    id: "formula-e-berlin-eprix-2026",
    title: "Formula E Berlin E-Prix Double-Header 2026",
    startDate: "2026-05-02",
    endDate: "2026-05-03",
    country: "Germany",
    city: "Berlin",
    venue: "Tempelhof Airport Street Circuit",
    location: "Berlin, Germany",
    region: "World",
    series: "Formula E",
    latviaInvolved: false,
    latvianDrivers: [],
    links: {
      official: "https://www.fiaformulae.com/berlin",
      tickets: "https://www.fiaformulae.com/berlin",
      stream: "https://www.fiaformulae.com/en/ways-to-watch",
    },
    description:
      "A two-race Formula E weekend at Tempelhof, adding a high-energy electric street racing event to the world calendar.",
    source: {
      type: "manual",
      label: "Official Formula E schedule",
      url: "https://www.fiaformulae.com/berlin",
    },
    featured: true,
    popularityScore: 86,
  },
  {
    id: "wec-24-hours-of-le-mans-2026",
    title: "24 Hours of Le Mans 2026",
    startDate: "2026-06-13",
    endDate: "2026-06-14",
    country: "France",
    city: "Le Mans",
    venue: "Circuit de la Sarthe",
    location: "Le Mans, France",
    region: "World",
    series: "WEC",
    latviaInvolved: false,
    latvianDrivers: [],
    links: {
      official: "https://www.fia.com/championship/events/world-endurance-championship/season-2026/24-hours-le-mans",
      tickets: "https://www.24h-lemans.com/en/tickets",
      stream: "https://www.fiawec.tv/",
    },
    description:
      "The headline endurance race of the year and a must-have world event for a serious motorsport calendar.",
    source: {
      type: "manual",
      label: "FIA WEC schedule",
      url: "https://www.fia.com/championship/events/world-endurance-championship/season-2026/24-hours-le-mans",
    },
    featured: true,
    popularityScore: 100,
  },
  {
    id: "motogp-catalan-grand-prix-2026",
    title: "MotoGP Catalan Grand Prix 2026",
    startDate: "2026-05-15",
    endDate: "2026-05-17",
    country: "Spain",
    city: "Barcelona",
    venue: "Circuit de Barcelona-Catalunya",
    location: "Barcelona, Spain",
    region: "World",
    series: "MotoGP",
    latviaInvolved: false,
    latvianDrivers: [],
    links: {
      official: "https://www.motogp.com/en/calendar/2026/event/catalunya/200bf59d-3db2-4e17-a903-4be204fa3496",
      stream: "https://www.motogp.com/",
    },
    description:
      "A popular MotoGP weekend at Barcelona-Catalunya that broadens RaceHub's world racing coverage beyond cars.",
    source: {
      type: "manual",
      label: "Official MotoGP schedule",
      url: "https://www.motogp.com/en/calendar/",
    },
    featured: true,
    popularityScore: 83,
  },
  {
    id: "nascar-watkins-glen-2026",
    title: "NASCAR Watkins Glen Cup Weekend 2026",
    startDate: "2026-05-10",
    country: "United States",
    city: "Watkins Glen",
    venue: "Watkins Glen International",
    location: "Watkins Glen, United States",
    region: "World",
    series: "NASCAR",
    latviaInvolved: false,
    latvianDrivers: [],
    links: {
      official: "https://www.nascar.com/nascar-cup-series/2026/schedule/",
      stream: "https://www.nascar.com/",
    },
    description:
      "A NASCAR road-course weekend that adds variety to the world calendar and complements the site's circuit-racing coverage.",
    source: {
      type: "manual",
      label: "Official NASCAR schedule",
      url: "https://www.nascar.com/nascar-cup-series/2026/schedule/",
    },
    popularityScore: 78,
  },
];

const replacedWorldSeries = new Set<Race["series"]>(["WEC", "Formula E", "MotoGP", "NASCAR"]);

function mergeDriverDirectories(items: Driver[]) {
  const byName = new Map<string, Driver>();

  for (const driver of items) {
    const key = driver.name
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();
    const existing = byName.get(key);

    if (!existing) {
      const currentSeries = getDriverSeries(driver);
      byName.set(key, {
        ...driver,
        currentSeries: currentSeries.length > 0 ? currentSeries : driver.currentSeries,
        series: driver.series ?? currentSeries[0],
      });
      continue;
    }

    const currentSeries = Array.from(new Set([...getDriverSeries(existing), ...getDriverSeries(driver)]));
    const achievements = Array.from(new Set([...existing.achievements, ...driver.achievements])).slice(0, 5);
    const teams = Array.from(new Set([existing.team, driver.team].filter(Boolean)));

    byName.set(key, {
      ...existing,
      active: existing.active || driver.active,
      achievements,
      bio: existing.bio ?? driver.bio,
      currentSeries,
      discipline:
        existing.discipline === driver.discipline
          ? existing.discipline
          : Array.from(new Set([existing.discipline, driver.discipline])).join(" / "),
      featured: existing.featured || driver.featured,
      nationality: existing.nationality ?? driver.nationality,
      series: existing.series ?? driver.series ?? currentSeries[0],
      team: teams.length > 0 ? teams.join(" / ") : undefined,
    });
  }

  return Array.from(byName.values()).sort((a, b) => a.name.localeCompare(b.name));
}

// Major world-series calendars live in a separate curated source so they can be
// refreshed without touching Latvia and Baltic local event data.
export const races: Race[] = [
  ...manualRaces.filter((race) => !replacedWorldSeries.has(race.series)),
  ...worldCalendarRaces,
];
export const localDrivers: Driver[] = latvianDrivers;
export const drivers: Driver[] = mergeDriverDirectories([
  ...latvianDrivers,
  ...f1People,
  ...wrcPeople,
  ...worldPeople,
]);
