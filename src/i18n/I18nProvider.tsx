import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  type ReactNode,
} from "react";
import type { Lang, Localized } from "../data/types";
import { en, type TranslationKey } from "./en";
import { es } from "./es";
import { useStore } from "../store/StoreProvider";

interface I18nValue {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (key: TranslationKey, vars?: Record<string, string | number>) => string;
  pick: (value: Localized) => string;
  locale: string;
  formatNumber: (value: number) => string;
}

const I18nContext = createContext<I18nValue | null>(null);

const dictionaries: Record<Lang, Record<TranslationKey, string>> = {
  en,
  es,
};

function interpolate(template: string, vars?: Record<string, string | number>): string {
  if (!vars) return template;
  return template.replace(/\{(\w+)\}/g, (match, key: string) =>
    Object.prototype.hasOwnProperty.call(vars, key) ? String(vars[key]) : match,
  );
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const { lang, setLanguage, data } = useStore();

  const setLang = useCallback(
    (next: Lang) => {
      setLanguage(next);
      try {
        const url = new URL(window.location.href);
        url.searchParams.set("lang", next);
        window.history.replaceState(window.history.state, "", url.toString());
      } catch {
        // Non-browser environment.
      }
    },
    [setLanguage],
  );

  const dictionary = dictionaries[lang];

  const t = useCallback(
    (key: TranslationKey, vars?: Record<string, string | number>) =>
      interpolate(dictionary[key] ?? key, vars),
    [dictionary],
  );

  const pick = useCallback((value: Localized) => value[lang], [lang]);

  // A shared ?lang=es link should win over a previously saved preference.
  useEffect(() => {
    try {
      const param = new URLSearchParams(window.location.search).get("lang");
      if ((param === "es" || param === "en") && param !== lang) setLanguage(param);
    } catch {
      // Non-browser environment.
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    root.lang = lang;
    root.dataset.motion = data.settings.reduceMotion ? "reduced" : "full";
    root.dataset.contrast = data.settings.highContrast ? "high" : "normal";
    root.dataset.font = data.settings.fontScale;
    try {
      window.localStorage.setItem("marea.lang", lang);
    } catch {
      // Ignore storage failures.
    }
  }, [lang, data.settings.reduceMotion, data.settings.highContrast, data.settings.fontScale]);

  const value = useMemo<I18nValue>(
    () => ({
      lang,
      setLang,
      t,
      pick,
      locale: lang === "es" ? "es-ES" : "en-GB",
      formatNumber: (number: number) =>
        new Intl.NumberFormat(lang === "es" ? "es-ES" : "en-GB").format(number),
    }),
    [lang, setLang, t, pick],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nValue {
  const context = useContext(I18nContext);
  if (!context) throw new Error("useI18n must be used inside I18nProvider");
  return context;
}
