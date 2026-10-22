import { Link } from "react-router-dom";
import { ArrowLeft, Compass, Home } from "lucide-react";
import { useI18n } from "../i18n/I18nProvider";
import { usePageMeta } from "../lib/usePageMeta";
import { SceneArt } from "../components/SceneArt";
import { Logo } from "../components/Logo";

export function NotFound() {
  const { t } = useI18n();

  usePageMeta({
    title: `${t("common.notFound")} · Marea`,
    description: t("common.notFoundBody"),
    noIndex: true,
  });

  return (
    <div className="notfound">
      <div className="notfound__art" aria-hidden="true">
        <SceneArt variant="cosmos" />
      </div>
      <div className="notfound__scrim" aria-hidden="true" />
      <div className="notfound__content">
        <Logo to="/" tone="light" />
        <span className="notfound__code">404</span>
        <h1 className="display">{t("common.notFound")}</h1>
        <p>{t("common.notFoundBody")}</p>
        <div className="notfound__actions">
          <Link to="/" className="btn btn--light">
            <Home size={15} />
            {t("common.goHome")}
          </Link>
          <Link to="/app" className="btn btn--ghost btn--ghost-light">
            <Compass size={15} />
            {t("common.openApp")}
          </Link>
        </div>
        <Link to="/app/library" className="notfound__back">
          <ArrowLeft size={14} />
          {t("nav.library")}
        </Link>
      </div>
    </div>
  );
}
