import { useCallback, useEffect, useState } from "react";
import { Link, NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  BookMarked,
  BookOpen,
  ChevronRight,
  Compass,
  Flame,
  Flower2,
  Home,
  Menu,
  Moon,
  Search,
  Settings,
  Sparkles,
  Wind,
} from "lucide-react";
import { useI18n } from "../i18n/I18nProvider";
import { useStore } from "../store/StoreProvider";
import { cn } from "../lib/utils";
import type { TranslationKey } from "../i18n/en";
import { Logo } from "./Logo";
import { LanguageToggle } from "./LanguageToggle";
import { CommandPalette } from "../components/CommandPalette";
import { Modal } from "./Modal";

const navItems: Array<{ path: string; key: TranslationKey; icon: typeof Home }> = [
  { path: "/app", key: "nav.today", icon: Home },
  { path: "/app/library", key: "nav.library", icon: BookOpen },
  { path: "/app/breathe", key: "nav.breathe", icon: Wind },
  { path: "/app/sleep", key: "nav.sleep", icon: Moon },
  { path: "/app/focus", key: "nav.focus", icon: Compass },
  { path: "/app/journal", key: "nav.journal", icon: Sparkles },
  { path: "/app/progress", key: "nav.progress", icon: Flower2 },
  { path: "/app/courses", key: "nav.courses", icon: BookMarked },
];

const mobilePrimary = navItems.filter((item) =>
  ["/app", "/app/library", "/app/breathe", "/app/journal"].includes(item.path),
);

export function AppShell() {
  const { t } = useI18n();
  const { data, stats } = useStore();
  const location = useLocation();
  const navigate = useNavigate();
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setPaletteOpen((open) => !open);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setPaletteOpen(false);
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [location.pathname]);

  const closePalette = useCallback(() => setPaletteOpen(false), []);
  const initial = (data.profile.name.trim()[0] ?? "m").toUpperCase();

  return (
    <div className="app-shell">
      <aside className="app-sidebar">
        <div className="app-sidebar__brand">
          <Logo to="/app" />
        </div>

        <nav className="app-nav" aria-label={t("nav.menu")}>
          <p className="app-nav__label">{t("nav.forYou")}</p>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === "/app"}
                className={({ isActive }) => cn("app-nav__link", isActive && "is-active")}
              >
                <Icon size={18} strokeWidth={1.7} />
                <span>{t(item.key)}</span>
                {item.path === "/app/journal" && data.journal.length > 0 && (
                  <span className="app-nav__count">{data.journal.length}</span>
                )}
              </NavLink>
            );
          })}
        </nav>

        <div className="app-sidebar__bottom">
          <Link to="/app/progress" className="sidebar-streak">
            <span className="sidebar-streak__icon">
              <Flame size={17} />
            </span>
            <span>
              <strong>{stats.streak}</strong>
              <small>{t("app.today.streak")}</small>
            </span>
            <ChevronRight size={14} className="sidebar-streak__arrow" />
          </Link>

          <NavLink
            to="/app/settings"
            className={({ isActive }) => cn("app-nav__link app-nav__link--quiet", isActive && "is-active")}
          >
            <Settings size={17} strokeWidth={1.7} />
            <span>{t("nav.settings")}</span>
          </NavLink>

          <Link to="/app/settings" className="sidebar-profile">
            <span className="sidebar-profile__avatar">{initial}</span>
            <span className="sidebar-profile__text">
              <strong>{data.profile.name || t("app.greeting.anon")}</strong>
              <small>{t("common.beta")}</small>
            </span>
          </Link>
        </div>
      </aside>

      <div className="app-frame">
        <header className="app-topbar">
          <Logo to="/app" />
          <div className="app-topbar__actions">
            <button
              type="button"
              className="btn-icon app-topbar__search"
              onClick={() => setPaletteOpen(true)}
              aria-label={t("command.open")}
            >
              <Search size={18} />
            </button>
            <LanguageToggle compact />
            <button
              type="button"
              className="btn-icon"
              onClick={() => setMenuOpen(true)}
              aria-label={t("nav.menu")}
            >
              <Menu size={19} />
            </button>
          </div>
        </header>

        <main id="main" className="app-main" tabIndex={-1}>
          <Outlet />
        </main>
      </div>

      <nav className="app-bottombar" aria-label={t("nav.menu")}>
        {mobilePrimary.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/app"}
              className={({ isActive }) => cn("app-bottombar__link", isActive && "is-active")}
            >
              <Icon size={20} strokeWidth={1.7} />
              <span>{t(item.key)}</span>
            </NavLink>
          );
        })}
        <button
          type="button"
          className={cn("app-bottombar__link", menuOpen && "is-active")}
          onClick={() => setMenuOpen(true)}
          aria-haspopup="dialog"
        >
          <Menu size={20} strokeWidth={1.7} />
          <span>{t("common.more")}</span>
        </button>
      </nav>

      <CommandPalette open={paletteOpen} onClose={closePalette} />

      <Modal
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        title={t("nav.menu")}
        closeLabel={t("common.close")}
        size="sm"
        className="app-menu-sheet"
      >
        <nav className="app-menu" aria-label={t("nav.menu")}>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.path}
                type="button"
                className={cn("app-menu__item", location.pathname === item.path && "is-active")}
                onClick={() => {
                  setMenuOpen(false);
                  navigate(item.path);
                }}
              >
                <Icon size={18} strokeWidth={1.7} />
                <span>{t(item.key)}</span>
                <ChevronRight size={15} className="app-menu__arrow" />
              </button>
            );
          })}
          <button
            type="button"
            className={cn("app-menu__item", location.pathname === "/app/settings" && "is-active")}
            onClick={() => {
              setMenuOpen(false);
              navigate("/app/settings");
            }}
          >
            <Settings size={18} strokeWidth={1.7} />
            <span>{t("nav.settings")}</span>
            <ChevronRight size={15} className="app-menu__arrow" />
          </button>
        </nav>
        <div className="app-menu__footer">
          <span>{t("nav.language")}</span>
          <LanguageToggle />
        </div>
        <Link to="/" className="app-menu__home" onClick={() => setMenuOpen(false)}>
          {t("nav.home")} · marea
        </Link>
      </Modal>
    </div>
  );
}
