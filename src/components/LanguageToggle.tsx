import { useI18n } from "../i18n/I18nProvider";
import type { Lang } from "../data/types";

interface LanguageToggleProps {
  tone?: "ink" | "light";
  compact?: boolean;
}

export function LanguageToggle({ tone = "ink", compact = false }: LanguageToggleProps) {
  const { lang, setLang, t } = useI18n();

  const change = (next: Lang) => {
    if (next !== lang) setLang(next);
  };

  return (
    <div
      className={`lang-toggle lang-toggle--${tone}${compact ? " lang-toggle--compact" : ""}`}
      role="group"
      aria-label={t("nav.language")}
    >
      <button
        type="button"
        onClick={() => change("en")}
        aria-pressed={lang === "en"}
        lang="en"
        title="English"
      >
        EN
      </button>
      <button
        type="button"
        onClick={() => change("es")}
        aria-pressed={lang === "es"}
        lang="es"
        title="Español"
      >
        ES
      </button>
    </div>
  );
}
