import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Accessibility,
  ArrowRight,
  ArrowUp,
  BookOpen,
  Check,
  Languages,
  Lock,
  Menu,
  Play,
  Pause,
  Sparkles,
  Waves,
  Wind,
  X,
} from "lucide-react";
import { useI18n } from "../i18n/I18nProvider";
import { useStore } from "../store/StoreProvider";
import { usePageMeta } from "../lib/usePageMeta";
import { ambientEngine } from "../lib/audio";
import { previewVoice } from "../lib/speech";
import { useVoices } from "../lib/useVoices";
import { sessions, featuredSessions } from "../data/sessions";
import { courses } from "../data/courses";
import { moods } from "../data/moods";
import { soundLayers, soundPresets } from "../data/soundscapes";
import { SessionCard } from "../components/SessionCard";
import { SceneArt } from "../components/SceneArt";
import { Logo } from "../components/Logo";
import { LanguageToggle } from "../components/LanguageToggle";
import { Accordion, type AccordionItem } from "../components/Accordion";
import { Reveal } from "../components/Reveal";
import { useToast } from "../components/ToastProvider";
import type { TranslationKey } from "../i18n/en";

const featureKeys: Array<{ title: TranslationKey; body: TranslationKey; icon: typeof Waves }> = [
  { title: "landing.feature.1.title", body: "landing.feature.1.body", icon: Languages },
  { title: "landing.feature.2.title", body: "landing.feature.2.body", icon: Waves },
  { title: "landing.feature.3.title", body: "landing.feature.3.body", icon: Wind },
  { title: "landing.feature.4.title", body: "landing.feature.4.body", icon: BookOpen },
  { title: "landing.feature.5.title", body: "landing.feature.5.body", icon: Lock },
  { title: "landing.feature.6.title", body: "landing.feature.6.body", icon: Accessibility },
];

const momentKeys: Array<{ title: TranslationKey; body: TranslationKey }> = [
  { title: "landing.moments.1.title", body: "landing.moments.1.body" },
  { title: "landing.moments.2.title", body: "landing.moments.2.body" },
  { title: "landing.moments.3.title", body: "landing.moments.3.body" },
  { title: "landing.moments.4.title", body: "landing.moments.4.body" },
];

function SoundTeaser() {
  const { t, pick } = useI18n();
  const { data } = useStore();
  const { toast } = useToast();
  const [playing, setPlaying] = useState(false);
  const preset = soundPresets.find((item) => item.id === "soft-rain") ?? soundPresets[0];

  useEffect(() => {
    return () => {
      ambientEngine.stop(0.2);
    };
  }, []);

  const toggle = () => {
    if (playing) {
      ambientEngine.stop(0.8);
      setPlaying(false);
    } else {
      ambientEngine.start(preset.layers, data.settings.ambientVolume);
      setPlaying(true);
      toast(t("app.sleep.playing"));
    }
  };

  return (
    <div className={`sound-teaser${playing ? " is-playing" : ""}`}>
      <div className="sound-teaser__top">
        <div>
          <span className="sound-teaser__label">{t("landing.sound.mix")}</span>
          <h3>{pick(preset.name)}</h3>
        </div>
        <button
          type="button"
          className="sound-teaser__play"
          onClick={toggle}
          aria-pressed={playing}
          aria-label={playing ? t("app.sleep.stop") : t("app.sleep.start")}
        >
          {playing ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" />}
        </button>
      </div>

      <div className="sound-teaser__wave" aria-hidden="true">
        {Array.from({ length: 42 }, (_, index) => (
          <span
            key={index}
            style={{
              height: `${18 + Math.abs(Math.sin(index * 0.55)) * 58}%`,
              animationDelay: `${index * 42}ms`,
            }}
          />
        ))}
      </div>

      <div className="sound-teaser__layers">
        {preset.layers.map((layer) => {
          const meta = soundLayers.find((item) => item.id === layer.id);
          if (!meta) return null;
          return (
            <div key={layer.id} className="sound-teaser__layer">
              <span>{pick(meta.name)}</span>
              <span className="sound-teaser__track">
                <span style={{ width: `${Math.round(layer.volume * 100)}%` }} />
              </span>
              <small>{Math.round(layer.volume * 100)}</small>
            </div>
          );
        })}
        <div className="sound-teaser__layer sound-teaser__layer--ghost">
          <span>{t("landing.sound.layers")}</span>
          <span className="sound-teaser__track">
            <span style={{ width: "64%" }} />
          </span>
          <small>+6</small>
        </div>
      </div>
    </div>
  );
}

export function Landing() {
  const { t, pick, lang, setLang } = useI18n();
  const { setMood, data } = useStore();
  const navigate = useNavigate();
  const { voices } = useVoices(lang);
  const { toast } = useToast();
  const [menuOpen, setMenuOpen] = useState(false);
  const heroSession = sessions.find((session) => session.id === "deep-sleep") ?? sessions[0];
  const featured = featuredSessions.slice(0, 4);
  const [activeMood, setActiveMood] = useState<string | null>(null);

  usePageMeta({
    title:
      lang === "es"
        ? "Marea — Respira. Vuelve a ti."
        : "Marea — Breathe. Come home to yourself.",
    description:
      lang === "es"
        ? "Meditación, sueño y foco bilingües. Prácticas originales en español e inglés, mezclador de sonidos, respiración y diario privado. Sin cuentas, sin anuncios, sin rastreo."
        : "Bilingual meditation, sleep and focus. Original practices in English and Spanish, a soundscape mixer, breathing tools and a private journal. No accounts, no ads, no tracking.",
  });

  const sampleVoice = () => {
    const spoken = previewVoice(
      t("app.settings.sample"),
      lang,
      data.settings.voiceURI,
      data.settings.speechRate,
    );
    if (!spoken) toast(t("toast.voiceUnavailable"), "error");
  };

  const chooseMood = (moodId: string, sessionId: string) => {
    setActiveMood(moodId);
    setMood(moodId);
    window.setTimeout(() => navigate(`/app/practice/${sessionId}`), 260);
  };

  const faqItems: AccordionItem[] = [1, 2, 3, 4, 5, 6].map((index) => ({
    id: String(index),
    question: t(`landing.faq.q${index}` as TranslationKey),
    answer: t(`landing.faq.a${index}` as TranslationKey),
  }));

  return (
    <div className="landing">
      <header className="site-header">
        <div className="container site-header__inner">
          <Logo to="/" />
          <nav className="site-nav" aria-label={t("nav.menu")}>
            <a href="#mood">{t("landing.mood.eyebrow")}</a>
            <a href="#library">{t("nav.library")}</a>
            <a href="#sound">{t("landing.sound.eyebrow")}</a>
            <a href="#courses">{t("nav.courses")}</a>
            <a href="#privacy">{t("footer.privacy")}</a>
          </nav>
          <div className="site-header__actions">
            <LanguageToggle />
            <Link to="/app" className="btn btn--sm hide-mobile">
              {t("nav.openApp")}
              <ArrowRight size={15} />
            </Link>
            <button
              type="button"
              className="btn-icon site-header__menu"
              onClick={() => setMenuOpen((open) => !open)}
              aria-expanded={menuOpen}
              aria-label={t("nav.menu")}
            >
              {menuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
        {menuOpen && (
          <div className="site-menu">
            <div className="container site-menu__inner">
              <a href="#mood" onClick={() => setMenuOpen(false)}>
                {t("landing.mood.eyebrow")}
              </a>
              <a href="#library" onClick={() => setMenuOpen(false)}>
                {t("nav.library")}
              </a>
              <a href="#sound" onClick={() => setMenuOpen(false)}>
                {t("landing.sound.eyebrow")}
              </a>
              <a href="#courses" onClick={() => setMenuOpen(false)}>
                {t("nav.courses")}
              </a>
              <a href="#privacy" onClick={() => setMenuOpen(false)}>
                {t("footer.privacy")}
              </a>
              <Link to="/app" className="btn btn--block" onClick={() => setMenuOpen(false)}>
                {t("nav.openApp")}
              </Link>
            </div>
          </div>
        )}
      </header>

      <main id="main">
        <section className="hero">
          <div className="hero__wash" aria-hidden="true" />
          <div className="container hero__inner">
            <div className="hero__copy">
              <p className="eyebrow hero__eyebrow">{t("landing.hero.eyebrow")}</p>
              <h1 className="display hero__title">
                {t("landing.hero.title1")}
                <br />
                {t("landing.hero.title2")} <em>{t("landing.hero.italic")}</em>
              </h1>
              <p className="hero__lede">{t("landing.hero.lede")}</p>
              <div className="hero__actions">
                <Link to="/app" className="btn btn--lg btn--coral">
                  {t("landing.hero.cta")}
                  <ArrowRight size={18} />
                </Link>
                <a href="#library" className="btn btn--lg btn--ghost">
                  {t("landing.hero.secondary")}
                </a>
              </div>
              <p className="hero__note">{t("landing.hero.note")}</p>

              <dl className="hero__stats">
                <div>
                  <dt>24</dt>
                  <dd>{t("landing.hero.stat1")}</dd>
                </div>
                <div>
                  <dt>2</dt>
                  <dd>{t("landing.hero.stat2")}</dd>
                </div>
                <div>
                  <dt>0</dt>
                  <dd>{t("landing.hero.stat3")}</dd>
                </div>
              </dl>
            </div>

            <div className="hero__visual">
              <div className="hero__art">
                <SceneArt variant="dawn" />
                <div className="hero__art-top">
                  <span className="hero__art-badge">
                    <span className="pulse-dot" aria-hidden="true" />
                    {t("landing.hero.cardLabel")}
                  </span>
                  <span className="hero__art-count">01 / 24</span>
                </div>
                <div className="hero__art-body">
                  <p className="hero__art-meta">
                    {t("landing.hero.cardMeta")} · {t("landing.hero.bilingual")}
                  </p>
                  <h2>{t("landing.hero.cardTitle")}</h2>
                  <div className="hero__art-foot">
                    <span className="hero__art-wave" aria-hidden="true">
                      {Array.from({ length: 14 }, (_, index) => (
                        <span key={index} style={{ height: `${20 + Math.abs(Math.sin(index)) * 70}%` }} />
                      ))}
                    </span>
                    <Link to={`/app/practice/${heroSession.id}`} className="hero__art-play">
                      <Play size={17} fill="currentColor" />
                      <span className="sr-only">{t("app.library.play")}</span>
                    </Link>
                  </div>
                </div>
              </div>

              <div className="hero__float hero__float--one">
                <span className="hero__float-icon">
                  <Waves size={15} />
                </span>
                {t("landing.hero.floatOne")}
              </div>
              <div className="hero__float hero__float--two">
                <span className="hero__float-icon">
                  <Sparkles size={15} />
                </span>
                {t("landing.hero.floatTwo")}
              </div>
              <div className="hero__ring" aria-hidden="true" />
            </div>
          </div>
        </section>

        <section className="section mood-section" id="mood" aria-labelledby="mood-title">
          <div className="container">
            <Reveal className="section-head">
              <div>
                <p className="eyebrow">{t("landing.mood.eyebrow")}</p>
                <h2 id="mood-title">{t("landing.mood.title")}</h2>
              </div>
              <p>{t("landing.mood.lede")}</p>
            </Reveal>
            <div className="mood-grid">
              {moods.map((mood, index) => (
                <Reveal key={mood.id} delay={index * 60}>
                  <button
                    type="button"
                    className={`mood-tile${activeMood === mood.id ? " is-active" : ""}`}
                    style={{ ["--mood-color" as string]: mood.color }}
                    onClick={() => chooseMood(mood.id, mood.sessions[0])}
                  >
                    <span className="mood-tile__orb" aria-hidden="true" />
                    <span className="mood-tile__label">{pick(mood.label)}</span>
                    <span className="mood-tile__hint">{pick(mood.hint)}</span>
                    <span className="mood-tile__cta">
                      {t("landing.mood.cta")}
                      <ArrowRight size={13} />
                    </span>
                  </button>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section className="section features-section" aria-labelledby="features-title">
          <div className="container">
            <Reveal className="section-head">
              <div>
                <p className="eyebrow">{t("landing.features.eyebrow")}</p>
                <h2 id="features-title">{t("landing.features.title")}</h2>
              </div>
              <p>{t("landing.features.lede")}</p>
            </Reveal>
            <div className="feature-grid">
              {featureKeys.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <Reveal key={feature.title} delay={index * 50} className="feature-card-wrap">
                    <article className="feature-card">
                      <span className="feature-card__index">0{index + 1}</span>
                      <span className="feature-card__icon">
                        <Icon size={20} strokeWidth={1.6} />
                      </span>
                      <h3>{t(feature.title)}</h3>
                      <p>{t(feature.body)}</p>
                    </article>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </section>

        <section className="section section--sand library-section" id="library" aria-labelledby="library-title">
          <div className="container">
            <Reveal className="section-head">
              <div>
                <p className="eyebrow">{t("landing.library.eyebrow")}</p>
                <h2 id="library-title">{t("landing.library.title")}</h2>
              </div>
              <div className="section-head__side">
                <p>{t("landing.library.lede")}</p>
                <Link to="/app/library" className="link-arrow">
                  {t("landing.library.cta")}
                  <ArrowRight size={15} />
                </Link>
              </div>
            </Reveal>
            <div className="landing-cards">
              {featured.map((session, index) => (
                <Reveal key={session.id} delay={index * 60}>
                  <SessionCard session={session} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section className="section language-section" aria-labelledby="language-title">
          <div className="container language-grid">
            <Reveal className="language-copy">
              <p className="eyebrow">{t("landing.language.eyebrow")}</p>
              <h2 id="language-title">{t("landing.language.title")}</h2>
              <p className="lede">{t("landing.language.lede")}</p>
              <div className="language-voice">
                <div className="language-voice__icon">
                  <Wind size={18} />
                </div>
                <div>
                  <h3>{t("landing.language.voiceTitle")}</h3>
                  <p>{t("landing.language.voiceBody")}</p>
                </div>
              </div>
              <div className="language-actions">
                <button type="button" className="btn btn--ghost" onClick={sampleVoice}>
                  <Play size={15} fill="currentColor" />
                  {t("onboarding.preview")}
                </button>
                <button
                  type="button"
                  className="btn"
                  onClick={() => setLang(lang === "en" ? "es" : "en")}
                >
                  {t("landing.language.cta")}
                  <ArrowRight size={15} />
                </button>
              </div>
            </Reveal>

            <Reveal className="language-cards" delay={80}>
              <article className="language-card language-card--en" lang="en">
                <div className="language-card__top">
                  <span className="language-card__flag">EN</span>
                  <span>{t("landing.language.enLabel")}</span>
                </div>
                <blockquote>“Let the breath arrive without making it perform.”</blockquote>
                <p>{t("landing.language.enBody")}</p>
                <span className="language-card__tag">5 min · Morning tide</span>
              </article>
              <article className="language-card language-card--es" lang="es">
                <div className="language-card__top">
                  <span className="language-card__flag">ES</span>
                  <span>{t("landing.language.esLabel")}</span>
                </div>
                <blockquote>«Deja que la respiración llegue sin hacerla actuar.»</blockquote>
                <p>{t("landing.language.esBody")}</p>
                <span className="language-card__tag">5 min · Marea de la mañana</span>
              </article>
            </Reveal>
          </div>
        </section>

        <section className="section section--ink sound-section" id="sound" aria-labelledby="sound-title">
          <div className="container sound-grid">
            <Reveal className="sound-copy">
              <p className="eyebrow">{t("landing.sound.eyebrow")}</p>
              <h2 id="sound-title">{t("landing.sound.title")}</h2>
              <p className="lede">{t("landing.sound.lede")}</p>
              <ul className="sound-list">
                {soundLayers.slice(0, 4).map((layer) => (
                  <li key={layer.id}>
                    <span className="sound-list__dot" aria-hidden="true" />
                    <strong>{pick(layer.name)}</strong>
                    <span>{pick(layer.description)}</span>
                  </li>
                ))}
              </ul>
              <Link to="/app/sleep" className="btn btn--light">
                {t("landing.sound.cta")}
                <ArrowRight size={16} />
              </Link>
            </Reveal>
            <Reveal delay={80}>
              <SoundTeaser />
            </Reveal>
          </div>
        </section>

        <section className="section courses-section" id="courses" aria-labelledby="courses-title">
          <div className="container">
            <Reveal className="section-head">
              <div>
                <p className="eyebrow">{t("landing.courses.eyebrow")}</p>
                <h2 id="courses-title">{t("landing.courses.title")}</h2>
              </div>
              <div className="section-head__side">
                <p>{t("landing.courses.lede")}</p>
                <Link to="/app/courses" className="link-arrow">
                  {t("landing.courses.cta")}
                  <ArrowRight size={15} />
                </Link>
              </div>
            </Reveal>
            <div className="course-grid course-grid--landing">
              {courses.slice(0, 3).map((course, index) => (
                <Reveal key={course.id} delay={index * 70}>
                  <Link to={`/app/courses/${course.id}`} className="course-card">
                    <div className="course-card__art">
                      <SceneArt variant={course.art} />
                      <span className="course-card__days">
                        {course.days.length} {t("app.courses.days")}
                      </span>
                    </div>
                    <div className="course-card__body">
                      <span className="eyebrow">{pick(course.subtitle)}</span>
                      <h3>{pick(course.title)}</h3>
                      <p>{pick(course.description)}</p>
                      <span className="course-card__cta">
                        {t("app.courses.start")}
                        <ArrowRight size={14} />
                      </span>
                    </div>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section className="section section--sea moments-section" aria-labelledby="moments-title">
          <div className="container">
            <Reveal className="section-head">
              <div>
                <p className="eyebrow">{t("landing.moments.eyebrow")}</p>
                <h2 id="moments-title">{t("landing.moments.title")}</h2>
              </div>
            </Reveal>
            <ol className="moments">
              {momentKeys.map((moment, index) => (
                <Reveal as="li" key={moment.title} delay={index * 60} className="moment">
                  <span className="moment__time">{["06:42", "14:15", "22:58", "16:00"][index]}</span>
                  <span className="moment__line" aria-hidden="true">
                    <span />
                  </span>
                  <div>
                    <h3>{t(moment.title)}</h3>
                    <p>{t(moment.body)}</p>
                  </div>
                </Reveal>
              ))}
            </ol>
          </div>
        </section>

        <section className="section privacy-section" id="privacy" aria-labelledby="privacy-title">
          <div className="container privacy-grid">
            <Reveal className="privacy-copy">
              <p className="eyebrow">{t("landing.privacy.eyebrow")}</p>
              <h2 id="privacy-title">{t("landing.privacy.title")}</h2>
              <p className="lede">{t("landing.privacy.lede")}</p>
              <ul className="check-list">
                {[1, 2, 3, 4].map((index) => (
                  <li key={index}>
                    <span className="check-list__icon">
                      <Check size={13} />
                    </span>
                    {t(`landing.privacy.point${index}` as TranslationKey)}
                  </li>
                ))}
              </ul>
              <Link to="/app/settings" className="link-arrow">
                {t("landing.privacy.cta")}
                <ArrowRight size={15} />
              </Link>
            </Reveal>

            <Reveal className="access-card" delay={80}>
              <div className="access-card__head">
                <span className="badge badge--gold">{t("landing.access.free")}</span>
                <p>{t("landing.access.lede")}</p>
              </div>
              <div className="access-card__price">
                <strong>{t("landing.access.price")}</strong>
                <span>{t("landing.access.period")}</span>
              </div>
              <ul>
                {[1, 2, 3, 4].map((index) => (
                  <li key={index}>
                    <Check size={14} />
                    {t(`landing.access.item${index}` as TranslationKey)}
                  </li>
                ))}
              </ul>
              <Link to="/app" className="btn btn--block btn--coral">
                {t("landing.access.cta")}
                <ArrowRight size={16} />
              </Link>
              <p className="access-card__note">{t("landing.access.note")}</p>
            </Reveal>
          </div>
        </section>

        <section className="section faq-section" aria-labelledby="faq-title">
          <div className="container faq-grid">
            <Reveal className="faq-copy">
              <p className="eyebrow">{t("footer.about")}</p>
              <h2 id="faq-title">{t("landing.faq.title")}</h2>
              <p>{t("landing.faq.lede")}</p>
              <div className="faq-copy__note">
                <Lock size={15} />
                <span>{t("footer.note")}</span>
              </div>
            </Reveal>
            <Reveal delay={80}>
              <Accordion items={faqItems} />
            </Reveal>
          </div>
        </section>

        <section className="landing-cta">
          <div className="landing-cta__art" aria-hidden="true">
            <SceneArt variant="ocean" />
          </div>
          <div className="landing-cta__scrim" aria-hidden="true" />
          <div className="container landing-cta__inner">
            <span className="landing-cta__mark">
              <Waves size={20} />
            </span>
            <h2 className="display">{t("landing.cta.title")}</h2>
            <p>{t("landing.cta.body")}</p>
            <Link to="/app" className="btn btn--lg btn--light">
              {t("landing.cta.button")}
              <ArrowRight size={18} />
            </Link>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="container">
          <div className="site-footer__top">
            <div className="site-footer__brand">
              <Logo to="/" tone="light" />
              <p>{t("footer.tagline")}</p>
              <LanguageToggle tone="light" />
            </div>
            <nav className="site-footer__col" aria-label={t("footer.practice")}>
              <h3>{t("footer.practice")}</h3>
              <Link to="/app">{t("nav.today")}</Link>
              <Link to="/app/library">{t("nav.library")}</Link>
              <Link to="/app/breathe">{t("nav.breathe")}</Link>
              <Link to="/app/sleep">{t("nav.sleep")}</Link>
              <Link to="/app/focus">{t("nav.focus")}</Link>
            </nav>
            <nav className="site-footer__col" aria-label={t("footer.explore")}>
              <h3>{t("footer.explore")}</h3>
              <Link to="/app/courses">{t("nav.courses")}</Link>
              <Link to="/app/journal">{t("nav.journal")}</Link>
              <Link to="/app/progress">{t("nav.progress")}</Link>
              <a href="#sound">{t("landing.sound.eyebrow")}</a>
              <Link to="/app/settings">{t("footer.settings")}</Link>
            </nav>
            <nav className="site-footer__col" aria-label={t("footer.about")}>
              <h3>{t("footer.about")}</h3>
              <a href="#privacy">{t("footer.privacy")}</a>
              <a href="#privacy">{t("footer.accessibility")}</a>
              <a href="#faq-title">{t("nav.help")}</a>
              <Link to="/app/settings">{t("nav.language")}</Link>
            </nav>
          </div>
          <div className="site-footer__bottom">
            <p>{t("footer.note")}</p>
            <p>{t("footer.medical")}</p>
            <p>{t("footer.rights")}</p>
          </div>
        </div>
      </footer>

      <a href="#main" className="back-to-top" aria-label={t("common.back")}>
        <ArrowUp size={16} />
      </a>
    </div>
  );
}
