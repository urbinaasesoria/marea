import { useMemo, useState } from "react";
import { Bookmark, Search, SlidersHorizontal, X } from "lucide-react";
import { useI18n } from "../i18n/I18nProvider";
import { useStore } from "../store/StoreProvider";
import { usePageMeta } from "../lib/usePageMeta";
import { sessions } from "../data/sessions";
import { categories } from "../lib/stats";
import type { Category, Level } from "../data/types";
import { SessionCard } from "../components/SessionCard";
import type { TranslationKey } from "../i18n/en";

type LengthFilter = "all" | "short" | "medium" | "long";
type CategoryFilter = "all" | Category | "favorites";

export function Library() {
  const { t, pick } = useI18n();
  const { data } = useStore();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<CategoryFilter>("all");
  const [length, setLength] = useState<LengthFilter>("all");
  const [level, setLevel] = useState<Level | "all">("all");

  usePageMeta({
    title: `${t("app.library.title")} · Marea`,
    description: t("app.library.sub"),
  });

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return sessions.filter((session) => {
      if (category === "favorites" && !data.favorites.includes(session.id)) return false;
      if (category !== "all" && category !== "favorites" && session.category !== category) return false;
      if (length === "short" && session.minutes >= 10) return false;
      if (length === "medium" && (session.minutes < 10 || session.minutes > 20)) return false;
      if (length === "long" && session.minutes <= 20) return false;
      if (level !== "all" && session.level !== level) return false;
      if (!needle) return true;
      const haystack = [
        session.title.en,
        session.title.es,
        session.subtitle.en,
        session.subtitle.es,
        session.description.en,
        session.description.es,
        ...session.tags.flatMap((tag) => [tag.en, tag.es]),
        session.category,
        session.kind,
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(needle);
    });
  }, [query, category, length, level, data.favorites]);

  const hasFilters = query !== "" || category !== "all" || length !== "all" || level !== "all";

  const clear = () => {
    setQuery("");
    setCategory("all");
    setLength("all");
    setLevel("all");
  };

  return (
    <div className="page library-page">
      <header className="page-head">
        <div>
          <p className="eyebrow">{t("nav.library")}</p>
          <h1 className="display page-title">{t("app.library.title")}</h1>
          <p className="page-lede">{t("app.library.sub")}</p>
        </div>
        <span className="page-head__count">
          <strong>{sessions.length}</strong>
          <span>{t("app.library.results")}</span>
        </span>
      </header>

      <div className="library-toolbar">
        <div className="library-search">
          <Search size={18} aria-hidden="true" />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={t("app.library.search")}
            aria-label={t("app.library.search")}
          />
          {query && (
            <button type="button" onClick={() => setQuery("")} aria-label={t("app.library.clear")}>
              <X size={16} />
            </button>
          )}
        </div>

        <div className="library-selects">
          <label className="select-wrap">
            <SlidersHorizontal size={15} aria-hidden="true" />
            <span className="sr-only">{t("app.library.filterDuration")}</span>
            <select
              value={length}
              onChange={(event) => setLength(event.target.value as LengthFilter)}
              aria-label={t("app.library.filterDuration")}
            >
              <option value="all">{t("app.library.anyLength")}</option>
              <option value="short">{t("app.library.under10")}</option>
              <option value="medium">{t("app.library.tenTo20")}</option>
              <option value="long">{t("app.library.over20")}</option>
            </select>
          </label>

          <label className="select-wrap">
            <span className="sr-only">{t("app.library.filterLevel")}</span>
            <select
              value={level}
              onChange={(event) => setLevel(event.target.value as Level | "all")}
              aria-label={t("app.library.filterLevel")}
            >
              <option value="all">{t("app.library.anyLevel")}</option>
              <option value="beginner">{t("level.beginner")}</option>
              <option value="intermediate">{t("level.intermediate")}</option>
            </select>
          </label>
        </div>
      </div>

      <div className="filter-row" role="group" aria-label={t("app.library.all")}>
        <button
          type="button"
          className="chip"
          aria-pressed={category === "all"}
          onClick={() => setCategory("all")}
        >
          {t("app.library.all")}
        </button>
        {categories.map((item) => (
          <button
            key={item}
            type="button"
            className="chip"
            aria-pressed={category === item}
            onClick={() => setCategory(item)}
          >
            {t(`category.${item}` as TranslationKey)}
          </button>
        ))}
        <button
          type="button"
          className="chip chip--saved"
          aria-pressed={category === "favorites"}
          onClick={() => setCategory("favorites")}
        >
          <Bookmark size={13} />
          {t("app.library.favorites")}
          <span className="chip__count">{data.favorites.length}</span>
        </button>
        {hasFilters && (
          <button type="button" className="chip chip--clear" onClick={clear}>
            <X size={13} />
            {t("app.library.clear")}
          </button>
        )}
      </div>

      <div className="library-resultline">
        <p>
          <strong>{filtered.length}</strong>{" "}
          {filtered.length === 1 ? t("app.library.resultsOne") : t("app.library.results")}
        </p>
        <span className="tiny muted">{pick({ en: "English + Español", es: "Español + English" })}</span>
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state">
          <span className="empty-state__icon">
            <Search size={24} />
          </span>
          <h2>{t("app.library.empty")}</h2>
          <p>{t("app.library.emptyBody")}</p>
          <button type="button" className="btn btn--ghost" onClick={clear}>
            {t("app.library.clear")}
          </button>
        </div>
      ) : (
        <div className="session-grid">
          {filtered.map((session) => (
            <SessionCard key={session.id} session={session} />
          ))}
        </div>
      )}
    </div>
  );
}
