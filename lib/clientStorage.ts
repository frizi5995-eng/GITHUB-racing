"use client";

import { useSyncExternalStore } from "react";

export type FavoriteKind = "events" | "drivers" | "series";
export type RecentKind = "events" | "drivers";
export type ThemePreference = "dark" | "light";

export const STORAGE_KEYS = {
  latviaMode: "racehub:pref:latvia-only",
  theme: "racehub:pref:theme",
  favorites: {
    events: "racehub:favorites:events",
    drivers: "racehub:favorites:drivers",
    series: "racehub:favorites:series",
  },
  recent: {
    events: "racehub:recent:events",
    drivers: "racehub:recent:drivers",
  },
} as const;

const STORAGE_EVENT = "racehub-storage";

function emitStorageChange(key: string) {
  window.dispatchEvent(new CustomEvent(STORAGE_EVENT, { detail: { key } }));
}

function getRawValue(key: string, fallback = "") {
  if (typeof window === "undefined") return fallback;

  try {
    return window.localStorage.getItem(key) ?? fallback;
  } catch {
    return fallback;
  }
}

function subscribeToKey(key: string, callback: () => void) {
  const handleStorage = (event: StorageEvent) => {
    if (event.key === key) callback();
  };

  const handleCustomStorage = (event: Event) => {
    const detail = (event as CustomEvent<{ key?: string }>).detail;
    if (detail?.key === key) callback();
  };

  window.addEventListener("storage", handleStorage);
  window.addEventListener(STORAGE_EVENT, handleCustomStorage);

  return () => {
    window.removeEventListener("storage", handleStorage);
    window.removeEventListener(STORAGE_EVENT, handleCustomStorage);
  };
}

function useStoredRawValue(key: string, fallback = "") {
  return useSyncExternalStore(
    (callback) => subscribeToKey(key, callback),
    () => getRawValue(key, fallback),
    () => fallback,
  );
}

export function readStoredBoolean(key: string, fallback = false) {
  const value = getRawValue(key, fallback ? "true" : "false");
  return value === "true";
}

export function writeStoredBoolean(key: string, value: boolean) {
  window.localStorage.setItem(key, String(value));
  emitStorageChange(key);
}

export function readStoredArray(key: string) {
  const value = getRawValue(key, "[]");

  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? (parsed.filter((item) => typeof item === "string") as string[]) : [];
  } catch {
    return [];
  }
}

export function writeStoredArray(key: string, value: string[]) {
  window.localStorage.setItem(key, JSON.stringify(value));
  emitStorageChange(key);
}

export function toggleStoredArrayItem(key: string, itemId: string) {
  const current = readStoredArray(key);
  const next = current.includes(itemId)
    ? current.filter((value) => value !== itemId)
    : [...current, itemId];

  writeStoredArray(key, next);
  return next;
}

export function pushRecentItem(kind: RecentKind, itemId: string) {
  const key = STORAGE_KEYS.recent[kind];
  const current = readStoredArray(key);
  const next = [itemId, ...current.filter((value) => value !== itemId)].slice(0, 8);
  writeStoredArray(key, next);
  return next;
}

export function useLatviaModePreference() {
  const rawValue = useStoredRawValue(STORAGE_KEYS.latviaMode, "false");
  const value = rawValue === "true";

  return [
    value,
    (next: boolean) => {
      writeStoredBoolean(STORAGE_KEYS.latviaMode, next);
    },
  ] as const;
}

export function readThemePreference(): ThemePreference {
  const value = getRawValue(STORAGE_KEYS.theme, "dark");
  return value === "light" ? "light" : "dark";
}

export function writeThemePreference(value: ThemePreference) {
  window.localStorage.setItem(STORAGE_KEYS.theme, value);
  document.documentElement.dataset.theme = value;
  emitStorageChange(STORAGE_KEYS.theme);
}

export function useThemePreference() {
  const rawValue = useStoredRawValue(STORAGE_KEYS.theme, "dark");
  const value: ThemePreference = rawValue === "light" ? "light" : "dark";

  return [
    value,
    (next: ThemePreference) => {
      writeThemePreference(next);
    },
  ] as const;
}

export function useStoredFavorites(kind: FavoriteKind) {
  const key = STORAGE_KEYS.favorites[kind];
  const rawValue = useStoredRawValue(key, "[]");
  const ids = (() => {
    try {
      const parsed = JSON.parse(rawValue);
      return Array.isArray(parsed) ? (parsed.filter((item) => typeof item === "string") as string[]) : [];
    } catch {
      return [] as string[];
    }
  })();

  return [
    ids,
    (itemId: string) => toggleStoredArrayItem(key, itemId),
  ] as const;
}

export function useStoredRecent(kind: RecentKind) {
  const key = STORAGE_KEYS.recent[kind];
  const rawValue = useStoredRawValue(key, "[]");

  try {
    const parsed = JSON.parse(rawValue);
    return Array.isArray(parsed) ? (parsed.filter((item) => typeof item === "string") as string[]) : [];
  } catch {
    return [] as string[];
  }
}
