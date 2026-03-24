import { Race } from "./types";

export type F1SessionType =
  | "grand-prix"
  | "qualifying"
  | "sprint-qualifying"
  | "sprint-race"
  | "practice"
  | "other";

export function getF1SessionType(title: string): F1SessionType {
  const normalized = title.toLowerCase();

  if (normalized.includes("practice")) return "practice";
  if (normalized.includes("sprint qualif")) return "sprint-qualifying";
  if (normalized.includes("sprint race")) return "sprint-race";
  if (normalized.includes("qualify")) return "qualifying";
  if (normalized.includes("grand prix") && normalized.includes("race")) return "grand-prix";
  if (normalized.includes(" - race")) return "grand-prix";
  return "other";
}

export function isPrimaryF1Session(race: Race) {
  const type = getF1SessionType(race.title);
  return type === "grand-prix" || type === "qualifying";
}

export function formatF1SessionLabel(type: F1SessionType) {
  if (type === "grand-prix") return "Grand Prix";
  if (type === "qualifying") return "Qualifying";
  if (type === "sprint-qualifying") return "Sprint Qualifying";
  if (type === "sprint-race") return "Sprint Race";
  if (type === "practice") return "Practice";
  return "Session";
}
