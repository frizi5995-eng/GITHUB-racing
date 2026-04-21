import { Driver, Series } from "./types";

type WorldRosterInput = {
  id: string;
  name: string;
  series: Series;
  discipline: string;
  team?: string;
  nationality?: string;
  role?: Driver["role"];
  achievements?: string[];
  bio?: string;
  featured?: boolean;
};

function worldRosterPerson(input: WorldRosterInput): Driver {
  const role = input.role ?? (input.series === "MotoGP" ? "Rider" : "Driver");
  const teamLabel = input.team ? ` for ${input.team}` : "";

  return {
    id: input.id,
    name: input.name,
    discipline: input.discipline,
    role,
    team: input.team,
    nationality: input.nationality,
    series: input.series,
    currentSeries: [input.series],
    achievements: input.achievements ?? [
      `Current ${input.series} ${role.toLowerCase()}${teamLabel}.`,
      `Tracked so the driver directory covers the major world series shown in RaceHub.`,
    ],
    bio:
      input.bio ??
      `${input.name} is included in RaceHub's ${input.series} roster coverage so users can explore drivers and riders beyond the Latvia-focused profiles.`,
    active: true,
    featured: input.featured,
  };
}

const formulaEPeople: Driver[] = [
  worldRosterPerson({ id: "formula-e-jake-dennis", name: "Jake Dennis", series: "Formula E", discipline: "Electric single-seaters", team: "Andretti Formula E", nationality: "United Kingdom", featured: true }),
  worldRosterPerson({ id: "formula-e-felipe-drugovich", name: "Felipe Drugovich", series: "Formula E", discipline: "Electric single-seaters", team: "Andretti Formula E", nationality: "Brazil" }),
  worldRosterPerson({ id: "formula-e-jean-eric-vergne", name: "Jean-Eric Vergne", series: "Formula E", discipline: "Electric single-seaters", team: "Citroen Racing", nationality: "France" }),
  worldRosterPerson({ id: "formula-e-nick-cassidy", name: "Nick Cassidy", series: "Formula E", discipline: "Electric single-seaters", team: "Citroen Racing", nationality: "New Zealand" }),
  worldRosterPerson({ id: "formula-e-josep-maria-marti", name: "Josep Maria Marti", series: "Formula E", discipline: "Electric single-seaters", team: "Cupra Kiro", nationality: "Spain" }),
  worldRosterPerson({ id: "formula-e-dan-ticktum", name: "Dan Ticktum", series: "Formula E", discipline: "Electric single-seaters", team: "Cupra Kiro", nationality: "United Kingdom" }),
  worldRosterPerson({ id: "formula-e-maximilian-gunther", name: "Maximilian Gunther", series: "Formula E", discipline: "Electric single-seaters", team: "DS Penske", nationality: "Germany" }),
  worldRosterPerson({ id: "formula-e-taylor-barnard", name: "Taylor Barnard", series: "Formula E", discipline: "Electric single-seaters", team: "DS Penske", nationality: "United Kingdom" }),
  worldRosterPerson({ id: "formula-e-sebastien-buemi", name: "Sebastien Buemi", series: "Formula E", discipline: "Electric single-seaters", team: "Envision Racing", nationality: "Switzerland" }),
  worldRosterPerson({ id: "formula-e-joel-eriksson", name: "Joel Eriksson", series: "Formula E", discipline: "Electric single-seaters", team: "Envision Racing", nationality: "Sweden" }),
  worldRosterPerson({ id: "formula-e-mitch-evans", name: "Mitch Evans", series: "Formula E", discipline: "Electric single-seaters", team: "Jaguar TCS Racing", nationality: "New Zealand", featured: true }),
  worldRosterPerson({ id: "formula-e-antonio-felix-da-costa", name: "Antonio Felix da Costa", series: "Formula E", discipline: "Electric single-seaters", team: "Jaguar TCS Racing", nationality: "Portugal" }),
  worldRosterPerson({ id: "formula-e-lucas-di-grassi", name: "Lucas di Grassi", series: "Formula E", discipline: "Electric single-seaters", team: "Lola Yamaha ABT Formula E Team", nationality: "Brazil" }),
  worldRosterPerson({ id: "formula-e-zane-maloney", name: "Zane Maloney", series: "Formula E", discipline: "Electric single-seaters", team: "Lola Yamaha ABT Formula E Team", nationality: "Barbados" }),
  worldRosterPerson({ id: "formula-e-edoardo-mortara", name: "Edoardo Mortara", series: "Formula E", discipline: "Electric single-seaters", team: "Mahindra Racing", nationality: "Switzerland" }),
  worldRosterPerson({ id: "formula-e-nyck-de-vries", name: "Nyck de Vries", series: "Formula E", discipline: "Electric single-seaters", team: "Mahindra Racing", nationality: "Netherlands" }),
  worldRosterPerson({ id: "formula-e-oliver-rowland", name: "Oliver Rowland", series: "Formula E", discipline: "Electric single-seaters", team: "Nissan Formula E Team", nationality: "United Kingdom", featured: true }),
  worldRosterPerson({ id: "formula-e-norman-nato", name: "Norman Nato", series: "Formula E", discipline: "Electric single-seaters", team: "Nissan Formula E Team", nationality: "France" }),
  worldRosterPerson({ id: "formula-e-pascal-wehrlein", name: "Pascal Wehrlein", series: "Formula E", discipline: "Electric single-seaters", team: "Porsche Formula E Team", nationality: "Germany", featured: true }),
  worldRosterPerson({ id: "formula-e-nico-muller", name: "Nico Muller", series: "Formula E", discipline: "Electric single-seaters", team: "Porsche Formula E Team", nationality: "Switzerland" }),
];

const motogpPeople: Driver[] = [
  worldRosterPerson({ id: "motogp-marco-bezzecchi", name: "Marco Bezzecchi", series: "MotoGP", discipline: "Motorcycle Grand Prix racing", team: "Aprilia Racing", nationality: "Italy" }),
  worldRosterPerson({ id: "motogp-jorge-martin", name: "Jorge Martin", series: "MotoGP", discipline: "Motorcycle Grand Prix racing", team: "Aprilia Racing", nationality: "Spain", featured: true }),
  worldRosterPerson({ id: "motogp-fermin-aldeguer", name: "Fermin Aldeguer", series: "MotoGP", discipline: "Motorcycle Grand Prix racing", team: "BK8 Gresini Racing MotoGP", nationality: "Spain" }),
  worldRosterPerson({ id: "motogp-alex-marquez", name: "Alex Marquez", series: "MotoGP", discipline: "Motorcycle Grand Prix racing", team: "BK8 Gresini Racing MotoGP", nationality: "Spain" }),
  worldRosterPerson({ id: "motogp-francesco-bagnaia", name: "Francesco Bagnaia", series: "MotoGP", discipline: "Motorcycle Grand Prix racing", team: "Ducati Lenovo Team", nationality: "Italy", featured: true }),
  worldRosterPerson({ id: "motogp-marc-marquez", name: "Marc Marquez", series: "MotoGP", discipline: "Motorcycle Grand Prix racing", team: "Ducati Lenovo Team", nationality: "Spain", featured: true }),
  worldRosterPerson({ id: "motogp-luca-marini", name: "Luca Marini", series: "MotoGP", discipline: "Motorcycle Grand Prix racing", team: "Honda HRC Castrol", nationality: "Italy" }),
  worldRosterPerson({ id: "motogp-joan-mir", name: "Joan Mir", series: "MotoGP", discipline: "Motorcycle Grand Prix racing", team: "Honda HRC Castrol", nationality: "Spain" }),
  worldRosterPerson({ id: "motogp-johann-zarco", name: "Johann Zarco", series: "MotoGP", discipline: "Motorcycle Grand Prix racing", team: "LCR Honda", nationality: "France" }),
  worldRosterPerson({ id: "motogp-diogo-moreira", name: "Diogo Moreira", series: "MotoGP", discipline: "Motorcycle Grand Prix racing", team: "LCR Honda", nationality: "Brazil" }),
  worldRosterPerson({ id: "motogp-fabio-quartararo", name: "Fabio Quartararo", series: "MotoGP", discipline: "Motorcycle Grand Prix racing", team: "Monster Energy Yamaha MotoGP", nationality: "France", featured: true }),
  worldRosterPerson({ id: "motogp-alex-rins", name: "Alex Rins", series: "MotoGP", discipline: "Motorcycle Grand Prix racing", team: "Monster Energy Yamaha MotoGP", nationality: "Spain" }),
  worldRosterPerson({ id: "motogp-franco-morbidelli", name: "Franco Morbidelli", series: "MotoGP", discipline: "Motorcycle Grand Prix racing", team: "Pertamina Enduro VR46 Racing Team", nationality: "Italy" }),
  worldRosterPerson({ id: "motogp-fabio-di-giannantonio", name: "Fabio Di Giannantonio", series: "MotoGP", discipline: "Motorcycle Grand Prix racing", team: "Pertamina Enduro VR46 Racing Team", nationality: "Italy" }),
  worldRosterPerson({ id: "motogp-toprak-razgatlioglu", name: "Toprak Razgatlioglu", series: "MotoGP", discipline: "Motorcycle Grand Prix racing", team: "Prima Pramac Yamaha MotoGP", nationality: "Turkey", featured: true }),
  worldRosterPerson({ id: "motogp-jack-miller", name: "Jack Miller", series: "MotoGP", discipline: "Motorcycle Grand Prix racing", team: "Prima Pramac Yamaha MotoGP", nationality: "Australia" }),
  worldRosterPerson({ id: "motogp-brad-binder", name: "Brad Binder", series: "MotoGP", discipline: "Motorcycle Grand Prix racing", team: "Red Bull KTM Factory Racing", nationality: "South Africa" }),
  worldRosterPerson({ id: "motogp-pedro-acosta", name: "Pedro Acosta", series: "MotoGP", discipline: "Motorcycle Grand Prix racing", team: "Red Bull KTM Factory Racing", nationality: "Spain", featured: true }),
  worldRosterPerson({ id: "motogp-maverick-vinales", name: "Maverick Vinales", series: "MotoGP", discipline: "Motorcycle Grand Prix racing", team: "Red Bull KTM Tech3", nationality: "Spain" }),
  worldRosterPerson({ id: "motogp-enea-bastianini", name: "Enea Bastianini", series: "MotoGP", discipline: "Motorcycle Grand Prix racing", team: "Red Bull KTM Tech3", nationality: "Italy" }),
  worldRosterPerson({ id: "motogp-raul-fernandez", name: "Raul Fernandez", series: "MotoGP", discipline: "Motorcycle Grand Prix racing", team: "Trackhouse MotoGP Team", nationality: "Spain" }),
  worldRosterPerson({ id: "motogp-ai-ogura", name: "Ai Ogura", series: "MotoGP", discipline: "Motorcycle Grand Prix racing", team: "Trackhouse MotoGP Team", nationality: "Japan" }),
];

const nascarPeople: Driver[] = [
  "AJ Allmendinger",
  "Christopher Bell",
  "Josh Berry",
  "Ryan Blaney",
  "Alex Bowman",
  "Chase Briscoe",
  "Chris Buescher",
  "Kyle Busch",
  "William Byron",
  "Ross Chastain",
  "Austin Cindric",
  "Cole Custer",
  "Ty Dillon",
  "Austin Dillon",
  "Chase Elliott",
  "Ty Gibbs",
  "Todd Gilliland",
  "Noah Gragson",
  "Denny Hamlin",
  "Riley Herbst",
  "Carson Hocevar",
  "Jimmie Johnson",
  "Erik Jones",
  "Brad Keselowski",
  "Kyle Larson",
  "Joey Logano",
  "Michael McDowell",
  "John Hunter Nemechek",
  "Ryan Preece",
  "Tyler Reddick",
  "Zane Smith",
  "Ricky Stenhouse Jr.",
  "Daniel Suarez",
  "Shane van Gisbergen",
  "Bubba Wallace",
  "Cody Ware",
  "Connor Zilisch",
].map((name) =>
  worldRosterPerson({
    id: `nascar-${name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")}`,
    name,
    series: "NASCAR",
    discipline: "Stock car racing",
    team: "NASCAR Cup Series",
    nationality: name === "Daniel Suarez" ? "Mexico" : name === "Shane van Gisbergen" ? "New Zealand" : "United States",
    featured: ["Kyle Larson", "Denny Hamlin", "Joey Logano", "William Byron", "Chase Elliott", "Shane van Gisbergen"].includes(name),
  }),
);

const wecPeople: Driver[] = [
  ["Harry Tincknell", "Aston Martin THOR Team #007", "United Kingdom"],
  ["Tom Gamble", "Aston Martin THOR Team #007", "United Kingdom"],
  ["Ross Gunn", "Aston Martin THOR Team #007", "United Kingdom"],
  ["Alex Riberas", "Aston Martin THOR Team #009", "Spain"],
  ["Marco Sorensen", "Aston Martin THOR Team #009", "Denmark"],
  ["Roman De Angelis", "Aston Martin THOR Team #009", "Canada"],
  ["Mike Conway", "Toyota Gazoo Racing #7", "United Kingdom"],
  ["Kamui Kobayashi", "Toyota Gazoo Racing #7", "Japan"],
  ["Nyck de Vries", "Toyota Gazoo Racing #7", "Netherlands"],
  ["Sebastien Buemi", "Toyota Gazoo Racing #8", "Switzerland"],
  ["Brendon Hartley", "Toyota Gazoo Racing #8", "New Zealand"],
  ["Ryo Hirakawa", "Toyota Gazoo Racing #8", "Japan"],
  ["Alexander Lynn", "Cadillac Hertz Team JOTA #12", "United Kingdom"],
  ["Will Stevens", "Cadillac Hertz Team JOTA #12", "United Kingdom"],
  ["Norman Nato", "Cadillac Hertz Team JOTA #12", "France"],
  ["Kevin Magnussen", "BMW M Team WRT #15", "Denmark"],
  ["Raffaele Marciello", "BMW M Team WRT #15", "Switzerland"],
  ["Dries Vanthoor", "BMW M Team WRT #15", "Belgium"],
  ["Andre Lotterer", "Genesis Magma Racing #17", "Germany"],
  ["Luis Felipe Derani", "Genesis Magma Racing #17", "Brazil"],
  ["Mathys Jaubert", "Genesis Magma Racing #17", "France"],
  ["Mathieu Jaminet", "Genesis Magma Racing #19", "France"],
  ["Paul-Loup Chatin", "Genesis Magma Racing #19", "France"],
  ["Daniel Juncadella", "Genesis Magma Racing #19", "Spain"],
  ["Robin Frijns", "BMW M Team WRT #20", "Netherlands"],
  ["Rene Rast", "BMW M Team WRT #20", "Germany"],
  ["Sheldon van der Linde", "BMW M Team WRT #20", "South Africa"],
  ["Antonio Felix da Costa", "Alpine Endurance Team #35", "Portugal"],
  ["Charles Milesi", "Alpine Endurance Team #35", "France"],
  ["Ferdinand Habsburg", "Alpine Endurance Team #35", "Austria"],
  ["Frederic Makowiecki", "Alpine Endurance Team #36", "France"],
  ["Jules Gounon", "Alpine Endurance Team #36", "France"],
  ["Victor Martins", "Alpine Endurance Team #36", "France"],
  ["Sebastien Bourdais", "Cadillac Hertz Team JOTA #38", "France"],
  ["Earl Bamber", "Cadillac Hertz Team JOTA #38", "New Zealand"],
  ["Jack Aitken", "Cadillac Hertz Team JOTA #38", "United Kingdom"],
  ["Antonio Fuoco", "Ferrari AF Corse #50", "Italy"],
  ["Nicklas Nielsen", "Ferrari AF Corse #50", "Denmark"],
  ["Miguel Molina", "Ferrari AF Corse #50", "Spain"],
  ["Alessandro Pier Guidi", "Ferrari AF Corse #51", "Italy"],
  ["James Calado", "Ferrari AF Corse #51", "United Kingdom"],
  ["Antonio Giovinazzi", "Ferrari AF Corse #51", "Italy"],
  ["Yifei Ye", "AF Corse #83", "China"],
  ["Robert Kubica", "AF Corse #83", "Poland"],
  ["Philip Hanson", "AF Corse #83", "United Kingdom"],
  ["Paul di Resta", "Peugeot TotalEnergies #93", "United Kingdom"],
  ["Stoffel Vandoorne", "Peugeot TotalEnergies #93", "Belgium"],
  ["Nick Cassidy", "Peugeot TotalEnergies #93", "New Zealand"],
  ["Loic Duval", "Peugeot TotalEnergies #94", "France"],
  ["Malthe Jakobsen", "Peugeot TotalEnergies #94", "Denmark"],
  ["Theo Pourchaire", "Peugeot TotalEnergies #94", "France"],
  ["Ricky Taylor", "Cadillac WTR #101", "United States"],
  ["Jordan Taylor", "Cadillac WTR #101", "United States"],
  ["Filipe Albuquerque", "Cadillac WTR #101", "Portugal"],
].map(([name, team, nationality]) =>
  worldRosterPerson({
    id: `wec-${name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")}`,
    name,
    series: "WEC",
    discipline: "Endurance racing",
    team,
    nationality,
    achievements: [
      `Listed in the 2026 WEC Hypercar or Le Mans Hypercar entry data for ${team}.`,
      "Part of the prototype/endurance roster that supports RaceHub's WEC coverage.",
    ],
    featured: ["Robert Kubica", "Kevin Magnussen", "Antonio Giovinazzi", "Sebastien Buemi", "Brendon Hartley"].includes(name),
  }),
);

export const worldPeople: Driver[] = [
  ...formulaEPeople,
  ...motogpPeople,
  ...nascarPeople,
  ...wecPeople,
];
