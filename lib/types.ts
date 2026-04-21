export const REGIONS = ["Latvia", "Baltics", "World"] as const;

export const SERIES = [
  "F1",
  "WRC",
  "Drift",
  "Rally",
  "Circuit",
  "Karting",
  "Rallycross",
  "NASCAR",
  "WEC",
  "Formula E",
  "MotoGP",
  "Other",
] as const;

export type Region = (typeof REGIONS)[number];
export type Series = (typeof SERIES)[number];

export type RaceSourceType = "manual" | "imported" | "fallback";
export type RaceStatusFilter = "upcoming" | "past" | "all";
export type RaceSort = "date-asc" | "date-desc" | "region" | "series";
export type DriverSort = "active" | "upcoming" | "name";
export type FeedbackStatus = "new" | "reviewing" | "resolved";
export type UserRole = "admin" | "user";

export type RaceLinks = {
  official?: string;
  tickets?: string;
  stream?: string;
};

export type RaceSource = {
  type: RaceSourceType;
  label: string;
  url?: string;
};

export type Race = {
  id: string;
  title: string;
  startDate: string;
  endDate?: string;
  location?: string;
  country: string;
  city: string;
  venue?: string;
  region: Region;
  series: Series;
  latviaInvolved: boolean;
  latvianDrivers: string[];
  links?: RaceLinks;
  description?: string;
  source: RaceSource;
  featured?: boolean;
  popularityScore?: number;
  championshipRound?: string;
};

export type Driver = {
  id: string;
  name: string;
  discipline: string;
  achievements: string[];
  active: boolean;
  role?: "Driver" | "Rider" | "Co-Driver" | "Team Principal";
  team?: string;
  nationality?: string;
  hometown?: string;
  series?: Series;
  currentSeries?: Series[];
  bio?: string;
  photo?: string;
  featured?: boolean;
};

export type RaceFilters = {
  q: string;
  region: Region | "All";
  series: Series | "All";
  latviaOnly: boolean;
  status: RaceStatusFilter;
};

export type FeedbackEntry = {
  id: string;
  name?: string;
  email?: string;
  topic: string;
  message: string;
  status: FeedbackStatus;
  createdAt: string;
  updatedAt: string;
  adminNote?: string;
};

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: string;
};
