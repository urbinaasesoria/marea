import { Link } from "react-router-dom";
import {
  ArrowRight,
  BookOpen,
  Compass,
  Flame,
  Moon,
  Play,
  Sparkles,
  Wind,
} from "lucide-react";
import { useI18n } from "../i18n/I18nProvider";
import { useStore } from "../store/StoreProvider";
import { usePageMeta } from "../lib/usePageMeta";
import { activeCourse, recommendSession } from "../lib/stats";
import { dailyQuote } from "../data/journal";
import { moods } from "../data/moods";
import { sessionById } from "../data/sessions";
import { activityTitle } from "../lib/stats";
import { greetingKey, relativeDay } from "../lib/utils";
import { SceneArt } from "../components/SceneArt";
import { ProgressRing } from "../components/ProgressRing";
import { SessionCard } from "../components/SessionCard";
import { useToast } from "../components/ToastProvider";

export function Today() {
  const { t, pick, lang } = useI18n();
  const { data, stats, todayMood, setMood } = useStore();
  const { toast } = useToast();
  const now = new Date();
  const greetingId = greetingKey(now.getHours());
  const greeting = t(`app.greeting.${greetingId}` as const);
  const greetingPunctuation = greetingId === "night" ? "" : ",";
  const name = data.profile.name.trim() || t("app.greeting.anon");
  const recommendation = recommendSession(
    data.activities,
    data.moods,
    data.profile.intention,
    now.getHours(),
  );
  const course = activeCourse(data.courses);
  const quote = dailyQuote(
    Math.floor((now.getTime() - new Date(now.getFullYear(), 0, 0).getTime()) / 86_400_000),
  );
  const recent = [...data.activities].reverse().slice(0, 3);
  const nextSession = course ? sessionById.get(course.nextSessionId) : undefined;
  const quick = [
    { to: "/app/breathe", icon: Wind, title: t("app.quick.breathe"), sub: t("app.quick.breatheSub") },
    { to: "/app/sleep", icon: Moon, title: t("app.quick.sleep"), sub: t("app.quick.sleepSub") },
    { to: "/app/focus", icon: Compass, title: t("app.quick.focus"), sub: t("app.quick.focusSub") },
    { to: "/app/journal", icon: BookOpen, title: t("app.quick.journal"), sub: t("app.quick.journalSub") },
  ];

  usePageMeta({
    title: `${t("app.today.title")} · Marea`,
    description: t("landing.hero.lede"),
  });

  const chooseMood = (moodId: string) => {
    setMood(moodId);
    toast(t("app.today.moodSaved"), "success");
  };

  return (
    <div className="page today-page">
      <header className="page-head today-head">
        <div>
          <p className="eyebrow">
            {new Intl.DateTimeFormat(lang === "es" ? "es-ES" : "en-GB", {
              weekday: "long",
              day: "numeric",
              month: "long",
            }).format(now)}
          </p>
          <h1 className="display page-title">
            {greeting}
            {greetingPunctuation}
            <br />
            <em>{name}.</em>
          </h1>
          <p className="page-lede">{t("app.today.sub")}</p>
        </div>
        <div className="today-head__stats">
          <div className="mini-stat">
            <span className="mini-stat__icon mini-stat__icon--coral">
              <Flame size={17} />
            </span>
            <div>
              <strong>{stats.streak}</strong>
              <span>{t("app.today.streak")}</span>
            </div>
          </div>
          <div className="mini-stat">
            <span className="mini-stat__icon mini-stat__icon--sea">
              <Wind size={17} />
            </span>
            <div>
              <strong>{stats.todayMinutes}</strong>
              <span>
                {stats.todayMinutes === 1
                  ? t("app.today.minuteToday")
                  : t("app.today.minutesToday")}
              </span>
            </div>
          </div>
        </div>
      </header>

      <section className={`today-mood${todayMood ? " is-checked" : ""}`} aria-labelledby="today-mood-title">
        <div className="today-mood__copy">
          <h2 id="today-mood-title">{t("app.today.moodTitle")}</h2>
          <p>{todayMood ? t("app.today.moodSaved") : t("app.today.moodBody")}</p>
        </div>
        <div className="mood-picker">
          {moods.map((mood) => {
            const selected = todayMood?.mood === mood.id;
            return (
              <button
                key={mood.id}
                type="button"
                className={`mood-pill${selected ? " is-selected" : ""}`}
                style={{ ["--mood-color" as string]: mood.color }}
                aria-pressed={selected}
                onClick={() => chooseMood(mood.id)}
              >
                <span className="mood-pill__dot" aria-hidden="true" />
                <span>{pick(mood.label)}</span>
              </button>
            );
          })}
        </div>
      </section>

      <div className="today-grid">
        <section className="today-feature" aria-labelledby="today-feature-title">
          <div className="today-feature__card">
            <div className="today-feature__art" aria-hidden="true">
              <SceneArt variant={recommendation.art} />
            </div>
            <div className="today-feature__scrim" aria-hidden="true" />
            <div className="today-feature__content">
              <span className="today-feature__label">
                <Sparkles size={13} />
                {t("app.today.forYou")}
              </span>
              <h2 id="today-feature-title">{pick(recommendation.title)}</h2>
              <p>{pick(recommendation.description)}</p>
              <div className="today-feature__meta">
                <span>
                  {recommendation.minutes} {t("common.min")}
                </span>
                <span aria-hidden="true">·</span>
                <span>{t(`category.${recommendation.category}` as const)}</span>
              </div>
              <div className="today-feature__actions">
                <Link to={`/app/practice/${recommendation.id}`} className="btn btn--light">
                  <Play size={15} fill="currentColor" />
                  {t("app.today.start")}
                </Link>
                <Link to={`/app/practice/${recommendation.id}`} className="btn btn--ghost btn--ghost-light btn--sm">
                  {t("common.learnMore")}
                </Link>
              </div>
            </div>
            <span className="today-feature__time">
              {String(Math.max(1, recommendation.minutes)).padStart(2, "0")}:00
            </span>
          </div>
          <p className="today-feature__hint">
            <span aria-hidden="true">↳</span> {pick(recommendation.subtitle)}
          </p>
        </section>

        <aside className="today-aside">
          <div className="today-progress-card">
            <div className="today-progress-card__ring">
              <ProgressRing
                value={Math.min(1, stats.todayMinutes / 10)}
                size={142}
                stroke={5}
                label={`${stats.todayMinutes} ${
                  stats.todayMinutes === 1
                    ? t("app.today.minuteToday")
                    : t("app.today.minutesToday")
                }`}
              >
                <strong>{stats.todayMinutes}</strong>
                <span>{t("app.today.goal")}</span>
              </ProgressRing>
            </div>
            <div className="today-progress-card__text">
              <h3>{t("app.progress.last7")}</h3>
              <p>{t("app.progress.sub")}</p>
              <div className="spark-bars" aria-hidden="true">
                {stats.last7.map((day) => (
                  <span
                    key={day.key}
                    className={day.minutes > 0 ? "has-value" : ""}
                    style={{ height: `${Math.max(8, Math.min(100, day.minutes * 8))}%` }}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="quick-grid">
            {quick.map((item) => {
              const Icon = item.icon;
              return (
                <Link key={item.to} to={item.to} className="quick-card">
                  <span className="quick-card__icon">
                    <Icon size={18} strokeWidth={1.7} />
                  </span>
                  <strong>{item.title}</strong>
                  <span>{item.sub}</span>
                  <ArrowRight size={13} className="quick-card__arrow" />
                </Link>
              );
            })}
          </div>
        </aside>
      </div>

      {course && nextSession && (
        <section className="today-course" aria-labelledby="today-course-title">
          <div className="today-course__art" aria-hidden="true">
            <SceneArt variant={nextSession.art} />
          </div>
          <div className="today-course__body">
            <span className="eyebrow">{t("app.today.continue")}</span>
            <h2 id="today-course-title">{pick(course.courseTitle)}</h2>
            <p>
              {t("app.courses.day")} {course.nextDayIndex + 1} · {pick(nextSession.title)}
            </p>
            <div className="today-course__progress">
              <span style={{ width: `${(course.completed / course.total) * 100}%` }} />
            </div>
            <span className="tiny muted">
              {course.completed} / {course.total} {t("app.courses.days")}
            </span>
          </div>
          <Link to={`/app/practice/${nextSession.id}`} className="btn">
            {t("app.courses.continue")}
            <ArrowRight size={15} />
          </Link>
        </section>
      )}

      <div className="today-lower">
        <section className="today-recent" aria-labelledby="today-recent-title">
          <div className="mini-head">
            <h2 id="today-recent-title">{t("app.today.recent")}</h2>
            <Link to="/app/progress" className="link-arrow">
              {t("app.today.viewProgress")}
              <ArrowRight size={14} />
            </Link>
          </div>
          {recent.length === 0 ? (
            <div className="empty-note">
              <Sparkles size={18} />
              <p>{t("app.today.firstTime")}</p>
            </div>
          ) : (
            <ul className="recent-list">
              {recent.map((activity) => (
                <li key={activity.id}>
                  <span className="recent-list__dot" aria-hidden="true" />
                  <div>
                    <strong>{activityTitle(activity, lang)}</strong>
                    <span>
                      {activity.minutes} {t("common.min")} · {relativeDay(activity.at, lang)}
                    </span>
                  </div>
                  <span className="recent-list__type">{t(`category.${activity.category}` as const)}</span>
                </li>
              ))}
            </ul>
          )}
        </section>

        <aside className="today-quote">
          <span className="today-quote__mark" aria-hidden="true">
            “
          </span>
          <blockquote>{pick(quote)}</blockquote>
          <span className="today-quote__label">{t("app.today.daily")}</span>
        </aside>
      </div>

      <section className="today-suggest" aria-labelledby="today-suggest-title">
        <div className="mini-head">
          <h2 id="today-suggest-title">{t("app.today.recommended")}</h2>
          <Link to="/app/library" className="link-arrow">
            {t("nav.viewAll")}
            <ArrowRight size={14} />
          </Link>
        </div>
        <div className="today-suggest__grid">
          {Array.from(sessionById.values())
            .filter((session) => session.id !== recommendation.id)
            .slice(0, 3)
            .map((session) => (
              <SessionCard key={session.id} session={session} layout="compact" />
            ))}
        </div>
      </section>
    </div>
  );
}
