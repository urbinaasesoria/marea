import type { DataState, Lang, Settings } from "../data/types";

const STORAGE_KEY = "marea.data.v1";

const detectLang = (): Lang => {
  if (typeof window === "undefined") return "en";
  const param = new URLSearchParams(window.location.search).get("lang");
  if (param === "es" || param === "en") return param;
  const stored = window.localStorage.getItem("marea.lang");
  if (stored === "es" || stored === "en") return stored;
  return navigator.language?.toLowerCase().startsWith("es") ? "es" : "en";
};

export const defaultSettings = (lang: Lang): Settings => ({
  lang,
  voiceURI: "",
  speechRate: 0.92,
  narration: true,
  reduceMotion:
    typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
      ? true
      : false,
  highContrast: false,
  fontScale: "normal",
  ambientVolume: 0.55,
  chimeVolume: 0.55,
  defaultSoundscape: "soft-rain",
  sleepFade: 45,
});

export function createDefaultData(lang: Lang = detectLang()): DataState {
  return {
    profile: {
      onboarded: false,
      name: "",
      intention: "calm",
      level: "beginner",
      createdAt: new Date().toISOString(),
    },
    settings: defaultSettings(lang),
    activities: [],
    moods: [],
    journal: [],
    favorites: [],
    courses: {},
    languagesUsed: [lang],
    soundPresets: [],
    focusTasks: [],
    focusCount: 0,
  };
}

function isLang(value: unknown): value is Lang {
  return value === "en" || value === "es";
}

function safeArray<T>(value: unknown, fallback: T[]): T[] {
  return Array.isArray(value) ? (value as T[]) : fallback;
}

/** Merge stored data onto current defaults so new fields never break old saves. */
export function loadData(): DataState {
  const base = createDefaultData();
  if (typeof window === "undefined") return base;

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return base;
    const parsed = JSON.parse(raw) as Partial<DataState>;
    const settings = { ...base.settings, ...(parsed.settings ?? {}) };
    if (!isLang(settings.lang)) settings.lang = base.settings.lang;
    const profile = { ...base.profile, ...(parsed.profile ?? {}) };
    const languagesUsed = safeArray(parsed.languagesUsed, base.languagesUsed).filter(isLang);
    if (!languagesUsed.includes(settings.lang)) languagesUsed.push(settings.lang);

    return {
      ...base,
      ...parsed,
      profile,
      settings,
      activities: safeArray(parsed.activities, []),
      moods: safeArray(parsed.moods, []),
      journal: safeArray(parsed.journal, []),
      favorites: safeArray(parsed.favorites, []),
      courses: typeof parsed.courses === "object" && parsed.courses ? parsed.courses : {},
      soundPresets: safeArray(parsed.soundPresets, []),
      focusTasks: safeArray(parsed.focusTasks, []),
      focusCount: typeof parsed.focusCount === "number" ? parsed.focusCount : 0,
      languagesUsed,
    };
  } catch {
    return base;
  }
}

export function persistData(data: DataState): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    window.localStorage.setItem("marea.lang", data.settings.lang);
  } catch {
    // Storage can be unavailable in private mode or full. The app still works in memory.
  }
}

export function clearPersistedData(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(STORAGE_KEY);
    window.localStorage.removeItem("marea.lang");
  } catch {
    // Ignore.
  }
}

export { STORAGE_KEY };
