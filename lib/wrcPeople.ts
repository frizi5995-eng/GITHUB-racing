import { Driver } from "./types";

type WrcPersonInput = {
  id: string;
  name: string;
  role?: Driver["role"];
  team: string;
  nationality: string;
  achievements?: string[];
  bio?: string;
  featured?: boolean;
};

function wrcPerson(input: WrcPersonInput): Driver {
  const role = input.role ?? "Driver";

  return {
    id: input.id,
    name: input.name,
    discipline: "Rally",
    achievements: input.achievements ?? [
      `Current WRC Rally1 ${role.toLowerCase()} for ${input.team}.`,
      "Included in RaceHub's WRC roster so rally event pages connect to real world championship people.",
    ],
    active: true,
    role,
    team: input.team,
    nationality: input.nationality,
    series: "WRC",
    currentSeries: ["WRC", "Rally"],
    bio:
      input.bio ??
      `${input.name} is tracked as part of the WRC Rally1 field, giving the driver directory broader world rally coverage beyond the Latvian profiles.`,
    featured: input.featured,
  };
}

export const wrcPeople: Driver[] = [
  wrcPerson({
    id: "wrc-sebastien-ogier",
    name: "Sebastien Ogier",
    team: "Toyota Gazoo Racing WRT",
    nationality: "France",
    achievements: ["Nine-time WRC champion.", "Toyota Gazoo Racing Rally1 driver in the 2026 field."],
    featured: true,
  }),
  wrcPerson({
    id: "wrc-vincent-landais",
    name: "Vincent Landais",
    role: "Co-Driver",
    team: "Toyota Gazoo Racing WRT",
    nationality: "France",
    achievements: ["WRC champion co-driver with Sebastien Ogier.", "Toyota Gazoo Racing Rally1 co-driver."],
  }),
  wrcPerson({
    id: "wrc-elfyn-evans",
    name: "Elfyn Evans",
    team: "Toyota Gazoo Racing WRT",
    nationality: "United Kingdom",
    achievements: ["Multiple WRC rally winner.", "Toyota Gazoo Racing championship contender."],
    featured: true,
  }),
  wrcPerson({
    id: "wrc-scott-martin",
    name: "Scott Martin",
    role: "Co-Driver",
    team: "Toyota Gazoo Racing WRT",
    nationality: "United Kingdom",
  }),
  wrcPerson({
    id: "wrc-takamoto-katsuta",
    name: "Takamoto Katsuta",
    team: "Toyota Gazoo Racing WRT",
    nationality: "Japan",
    achievements: ["Toyota Gazoo Racing Rally1 driver.", "Japan's leading top-class WRC representative."],
  }),
  wrcPerson({
    id: "wrc-aaron-johnston",
    name: "Aaron Johnston",
    role: "Co-Driver",
    team: "Toyota Gazoo Racing WRT",
    nationality: "Ireland",
  }),
  wrcPerson({
    id: "wrc-sami-pajari",
    name: "Sami Pajari",
    team: "Toyota Gazoo Racing WRT2",
    nationality: "Finland",
    achievements: ["WRC2 champion graduate.", "Toyota Rally1 driver with a developing full-season programme."],
  }),
  wrcPerson({
    id: "wrc-marko-salminen",
    name: "Marko Salminen",
    role: "Co-Driver",
    team: "Toyota Gazoo Racing WRT2",
    nationality: "Finland",
  }),
  wrcPerson({
    id: "wrc-oliver-solberg",
    name: "Oliver Solberg",
    team: "Toyota Gazoo Racing WRT",
    nationality: "Sweden",
    achievements: ["WRC2 title winner.", "Toyota Rally1 driver in the 2026 field."],
    featured: true,
  }),
  wrcPerson({
    id: "wrc-elliott-edmondson",
    name: "Elliott Edmondson",
    role: "Co-Driver",
    team: "Toyota Gazoo Racing WRT",
    nationality: "United Kingdom",
  }),
  wrcPerson({
    id: "wrc-thierry-neuville",
    name: "Thierry Neuville",
    team: "Hyundai Shell Mobis World Rally Team",
    nationality: "Belgium",
    achievements: ["WRC champion and long-time Hyundai leader.", "One of the defining championship contenders of the modern WRC era."],
    featured: true,
  }),
  wrcPerson({
    id: "wrc-martijn-wydaeghe",
    name: "Martijn Wydaeghe",
    role: "Co-Driver",
    team: "Hyundai Shell Mobis World Rally Team",
    nationality: "Belgium",
  }),
  wrcPerson({
    id: "wrc-adrien-fourmaux",
    name: "Adrien Fourmaux",
    team: "Hyundai Shell Mobis World Rally Team",
    nationality: "France",
    achievements: ["Hyundai Rally1 driver in the 2026 field.", "Front-running pace on asphalt and mixed-surface rallies."],
  }),
  wrcPerson({
    id: "wrc-alexandre-coria",
    name: "Alexandre Coria",
    role: "Co-Driver",
    team: "Hyundai Shell Mobis World Rally Team",
    nationality: "France",
  }),
  wrcPerson({
    id: "wrc-hayden-paddon",
    name: "Hayden Paddon",
    team: "Hyundai Shell Mobis World Rally Team",
    nationality: "New Zealand",
    achievements: ["WRC rally winner returning to Rally1 competition.", "Experienced gravel and rough-condition specialist."],
  }),
  wrcPerson({
    id: "wrc-john-kennard",
    name: "John Kennard",
    role: "Co-Driver",
    team: "Hyundai Shell Mobis World Rally Team",
    nationality: "New Zealand",
  }),
  wrcPerson({
    id: "wrc-esapekka-lappi",
    name: "Esapekka Lappi",
    team: "Hyundai Shell Mobis World Rally Team",
    nationality: "Finland",
    achievements: ["WRC rally winner.", "Experienced Rally1 driver with strong gravel pace."],
  }),
  wrcPerson({
    id: "wrc-enni-malkonen",
    name: "Enni Malkonen",
    role: "Co-Driver",
    team: "Hyundai Shell Mobis World Rally Team",
    nationality: "Finland",
  }),
  wrcPerson({
    id: "wrc-dani-sordo",
    name: "Dani Sordo",
    team: "Hyundai Shell Mobis World Rally Team",
    nationality: "Spain",
    achievements: ["Veteran WRC rally winner.", "Long-standing top-class rally driver with deep Hyundai experience."],
  }),
  wrcPerson({
    id: "wrc-candido-carrera",
    name: "Candido Carrera",
    role: "Co-Driver",
    team: "Hyundai Shell Mobis World Rally Team",
    nationality: "Spain",
  }),
  wrcPerson({
    id: "wrc-gregoire-munster",
    name: "Gregoire Munster",
    team: "M-Sport Ford World Rally Team",
    nationality: "Luxembourg",
    achievements: ["M-Sport Ford Rally1 driver.", "Part of Ford's current top-class WRC programme."],
  }),
  wrcPerson({
    id: "wrc-louis-louka",
    name: "Louis Louka",
    role: "Co-Driver",
    team: "M-Sport Ford World Rally Team",
    nationality: "Belgium",
  }),
  wrcPerson({
    id: "wrc-joshua-mcerlean",
    name: "Joshua McErlean",
    team: "M-Sport Ford World Rally Team",
    nationality: "Ireland",
    achievements: ["M-Sport Ford Rally1 driver.", "Irish Rally1 representative in the 2026 field."],
  }),
  wrcPerson({
    id: "wrc-eoin-treacy",
    name: "Eoin Treacy",
    role: "Co-Driver",
    team: "M-Sport Ford World Rally Team",
    nationality: "Ireland",
  }),
  wrcPerson({
    id: "wrc-jon-armstrong",
    name: "Jon Armstrong",
    team: "M-Sport Ford World Rally Team",
    nationality: "Ireland",
    achievements: ["Promoted from European rally competition into Rally1 action.", "M-Sport Ford Rally1 driver in the 2026 field."],
  }),
  wrcPerson({
    id: "wrc-shane-byrne",
    name: "Shane Byrne",
    role: "Co-Driver",
    team: "M-Sport Ford World Rally Team",
    nationality: "Ireland",
  }),
];
