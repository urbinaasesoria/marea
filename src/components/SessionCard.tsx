import { Link } from "react-router-dom";
import { Bookmark, BookmarkCheck, Play, Sparkles } from "lucide-react";
import type { Session } from "../data/types";
import { useI18n } from "../i18n/I18nProvider";
import { useStore } from "../store/StoreProvider";
import { useToast } from "./ToastProvider";
import { SceneArt } from "./SceneArt";
import { cn } from "../lib/utils";
import type { TranslationKey } from "../i18n/en";

interface SessionCardProps {
  session: Session;
  layout?: "card" | "wide" | "row" | "compact";
  className?: string;
}

export function SessionCard({ session, layout = "card", className }: SessionCardProps) {
  const { t, pick, lang } = useI18n();
  const { data, toggleFavorite } = useStore();
  const { toast } = useToast();
  const saved = data.favorites.includes(session.id);

  const categoryKey = `category.${session.category}` as TranslationKey;
  const levelKey = `level.${session.level}` as TranslationKey;

  const save = () => {
    toggleFavorite(session.id);
    toast(
      saved ? t("toast.unfavorite") : t("toast.favorite"),
      saved ? "default" : "success",
    );
  };

  if (layout === "row") {
    return (
      <article className={cn("session-row", className)}>
        <Link to={`/app/practice/${session.id}`} className="session-row__art" tabIndex={-1} aria-hidden="true">
          <SceneArt variant={session.art} />
        </Link>
        <div className="session-row__body">
          <span className="session-row__meta">
            {t(categoryKey)} · {session.minutes} {t("common.min")}
          </span>
          <h3>
            <Link to={`/app/practice/${session.id}`}>{pick(session.title)}</Link>
          </h3>
          <p>{pick(session.subtitle)}</p>
        </div>
        <div className="session-row__actions">
          <button
            type="button"
            className={cn("icon-quiet", saved && "is-active")}
            onClick={save}
            aria-pressed={saved}
            aria-label={saved ? t("app.library.unsave") : t("app.library.save")}
          >
            {saved ? <BookmarkCheck size={17} /> : <Bookmark size={17} />}
          </button>
          <Link
            to={`/app/practice/${session.id}`}
            className="btn btn--ghost btn--sm"
            aria-label={`${t("app.library.play")} ${pick(session.title)}`}
          >
            <Play size={14} fill="currentColor" />
            {t("app.library.play")}
          </Link>
        </div>
      </article>
    );
  }

  if (layout === "wide") {
    return (
      <article className={cn("session-wide", className)}>
        <Link to={`/app/practice/${session.id}`} className="session-wide__art" aria-hidden="true" tabIndex={-1}>
          <SceneArt variant={session.art} />
          <span className="session-wide__scrim" />
        </Link>
        <div className="session-wide__body">
          <div className="session-wide__badges">
            <span className="badge">{t(categoryKey)}</span>
            {session.isNew && <span className="badge badge--coral">{t("app.library.new")}</span>}
            {session.featured && (
              <span className="badge badge--gold">
                <Sparkles size={11} /> {t("app.library.featured")}
              </span>
            )}
          </div>
          <h3>
            <Link to={`/app/practice/${session.id}`}>{pick(session.title)}</Link>
          </h3>
          <p>{pick(session.description)}</p>
          <div className="session-wide__foot">
            <span className="meta-line">
              {session.minutes} {t("common.min")} · {t(levelKey)}
            </span>
            <Link to={`/app/practice/${session.id}`} className="btn btn--sm">
              <Play size={14} fill="currentColor" />
              {t("app.library.play")}
            </Link>
          </div>
        </div>
      </article>
    );
  }

  if (layout === "compact") {
    return (
      <Link to={`/app/practice/${session.id}`} className={cn("session-compact", className)}>
        <span className="session-compact__art">
          <SceneArt variant={session.art} />
        </span>
        <span className="session-compact__body">
          <span className="session-compact__meta">
            {session.minutes} {t("common.min")} · {t(categoryKey)}
          </span>
          <strong>{pick(session.title)}</strong>
        </span>
        <Play size={15} className="session-compact__play" aria-hidden="true" />
      </Link>
    );
  }

  return (
    <article className={cn("session-card", className)}>
      <div className="session-card__art">
        <Link
          to={`/app/practice/${session.id}`}
          className="session-card__art-link"
          aria-label={`${t("app.library.play")} ${pick(session.title)}`}
          tabIndex={-1}
        >
          <SceneArt variant={session.art} />
        </Link>
        <span className="session-card__top">
          <span className="badge badge--dark">{t(categoryKey)}</span>
          {session.isNew && <span className="badge badge--coral">{t("app.library.new")}</span>}
        </span>
        <button
          type="button"
          className={cn("session-card__save", saved && "is-active")}
          onClick={save}
          aria-pressed={saved}
          aria-label={saved ? t("app.library.unsave") : t("app.library.save")}
        >
          {saved ? <BookmarkCheck size={16} /> : <Bookmark size={16} />}
        </button>
        <Link to={`/app/practice/${session.id}`} className="session-card__play" aria-hidden="true" tabIndex={-1}>
          <Play size={16} fill="currentColor" />
        </Link>
      </div>
      <div className="session-card__body">
        <div className="session-card__meta">
          <span>
            {session.minutes} {t("common.min")}
          </span>
          <span aria-hidden="true">·</span>
          <span>{t(levelKey)}</span>
          {session.kind === "soundscape" && (
            <>
              <span aria-hidden="true">·</span>
              <span>{lang === "es" ? "Sonido" : "Sound"}</span>
            </>
          )}
        </div>
        <h3>
          <Link to={`/app/practice/${session.id}`}>{pick(session.title)}</Link>
        </h3>
        <p>{pick(session.subtitle)}</p>
      </div>
    </article>
  );
}
