import { useEffect, useMemo, useRef, useState, type KeyboardEvent as ReactKeyboardEvent } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import {
  ArrowUpRight,
  BookOpen,
  Bookmark,
  Compass,
  Flower2,
  Heart,
  Home,
  Moon,
  Search,
  Settings,
  Sparkles,
  Wind,
  X,
} from "lucide-react";
import { sessions } from "../data/sessions";
import { useI18n } from "../i18n/I18nProvider";
import type { TranslationKey } from "../i18n/en";
import { useStore } from "../store/StoreProvider";
import { cn } from "../lib/utils";

interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
}

interface Result {
  id: string;
  label: string;
  hint: string;
  path: string;
  group: "pages" | "practices" | "saved";
  icon: typeof Home;
}

const normalize = (value: string) =>
  value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

const pageDefs: Array<{ path: string; key: TranslationKey; icon: typeof Home }> = [
  { path: "/app", key: "nav.today", icon: Home },
  { path: "/app/library", key: "nav.library", icon: BookOpen },
  { path: "/app/breathe", key: "nav.breathe", icon: Wind },
  { path: "/app/sleep", key: "nav.sleep", icon: Moon },
  { path: "/app/focus", key: "nav.focus", icon: Compass },
  { path: "/app/journal", key: "nav.journal", icon: Sparkles },
  { path: "/app/progress", key: "nav.progress", icon: Flower2 },
  { path: "/app/courses", key: "nav.courses", icon: Bookmark },
  { path: "/app/settings", key: "nav.settings", icon: Settings },
];

export function CommandPalette({ open, onClose }: CommandPaletteProps) {
  const { t, pick } = useI18n();
  const { data } = useStore();
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (!open) return;
    setQuery("");
    setActive(0);
    const previous = document.activeElement as HTMLElement | null;
    const timer = window.setTimeout(() => inputRef.current?.focus(), 40);
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.clearTimeout(timer);
      document.body.style.overflow = overflow;
      previous?.focus?.();
    };
  }, [open]);

  const results = useMemo<Result[]>(() => {
    const pages: Result[] = pageDefs.map((page) => ({
      id: `page-${page.path}`,
      label: t(page.key),
      hint: t("command.pages"),
      path: page.path,
      group: "pages",
      icon: page.icon,
    }));

    const practices: Result[] = sessions.map((session) => ({
      id: `session-${session.id}`,
      label: pick(session.title),
      hint: `${session.minutes} ${t("common.min")} · ${t(`category.${session.category}` as TranslationKey)}`,
      path: `/app/practice/${session.id}`,
      group: "practices",
      icon: session.category === "sleep" ? Moon : session.category === "breath" ? Wind : Sparkles,
    }));

    const all = [...pages, ...practices];
    const needle = normalize(query.trim());
    if (!needle) {
      return [
        ...pages.filter((page) => ["/app", "/app/library", "/app/breathe", "/app/sleep"].includes(page.path)),
        ...practices.filter((practice) =>
          sessions.find(
            (session) => `/app/practice/${session.id}` === practice.path && session.featured,
          ),
        ),
      ].slice(0, 9);
    }

    return all
      .map((result) => {
        const haystack = normalize(result.label + " " + result.hint);
        const index = haystack.indexOf(needle);
        const savedBoost = data.favorites.includes(result.path.replace("/app/practice/", "")) ? -2 : 0;
        return { result, score: index < 0 ? 999 : index + savedBoost };
      })
      .filter((entry) => entry.score < 999)
      .sort((a, b) => a.score - b.score)
      .slice(0, 12)
      .map((entry) => entry.result);
  }, [query, t, pick, data.favorites]);

  useEffect(() => {
    setActive(0);
  }, [query]);

  if (!open) return null;

  const go = (path: string) => {
    onClose();
    navigate(path);
  };

  const onKeyDown = (event: ReactKeyboardEvent) => {
    if (event.key === "Escape") {
      onClose();
    } else if (event.key === "ArrowDown") {
      event.preventDefault();
      setActive((current) => (current + 1) % Math.max(1, results.length));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActive((current) => (current - 1 + Math.max(1, results.length)) % Math.max(1, results.length));
    } else if (event.key === "Enter" && results[active]) {
      event.preventDefault();
      go(results[active].path);
    }
  };

  return createPortal(
    <div className="command-layer" role="presentation" onKeyDown={onKeyDown}>
      <div className="command-scrim" onClick={onClose} aria-hidden="true" />
      <div
        className="command"
        role="dialog"
        aria-modal="true"
        aria-label={t("command.open")}
      >
        <div className="command__search">
          <Search size={19} aria-hidden="true" />
          <input
            ref={inputRef}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={t("command.placeholder")}
            aria-label={t("command.placeholder")}
            aria-controls="command-results"
            aria-activedescendant={results[active] ? `command-${results[active].id}` : undefined}
            autoComplete="off"
            spellCheck={false}
          />
          <button type="button" className="command__close" onClick={onClose} aria-label={t("common.close")}>
            <X size={16} />
          </button>
        </div>

        <div className="command__results" id="command-results" role="listbox">
          {results.length === 0 && <p className="command__empty">{t("command.noResults")}</p>}
          {results.map((result, index) => {
            const Icon = result.icon;
            return (
              <button
                key={result.id}
                id={`command-${result.id}`}
                type="button"
                role="option"
                aria-selected={index === active}
                className={cn("command__item", index === active && "is-active")}
                onMouseEnter={() => setActive(index)}
                onClick={() => go(result.path)}
              >
                <span className="command__icon">
                  <Icon size={16} />
                </span>
                <span className="command__label">{result.label}</span>
                <span className="command__hint">{result.hint}</span>
                <ArrowUpRight size={14} className="command__arrow" />
              </button>
            );
          })}
        </div>

        <div className="command__foot">
          <span>{t("command.hint")}</span>
          {data.favorites.length > 0 && (
            <span className="command__saved">
              <Heart size={12} /> {data.favorites.length} {t("app.library.favorites").toLowerCase()}
            </span>
          )}
        </div>
      </div>
    </div>,
    document.body,
  );
}
