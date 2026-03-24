export type Region = "Latvia" | "Baltics" | "World";
export type Series =
  | "F1"
  | "WRC"
  | "Drift"
  | "Rally"
  | "Circuit"
  | "Karting"
  | "Other";

export type Race = {
  id: string;
  title: string;
  startDate: string; // YYYY-MM-DD
  endDate?: string;
  location?: string;
  country: string;
  city: string;
  venue?: string;
  region: Region;
  series: Series;

  // Главный фильтр для вашей задачи:
  latviaInvolved: boolean;

  // Какие латвийские гонщики участвуют:
  latvianDrivers: string[];

  links?: {
    official?: string;
    tickets?: string;
    stream?: string;
  };

  description?: string;
};

export type Driver = {
  id: string;
  name: string;
  discipline: string;
  achievements: string[];
  active: boolean;
  role?: "Driver" | "Co-Driver" | "Team Principal";
  team?: string;
  nationality?: string;
  series?: Series;
  bio?: string;
};
