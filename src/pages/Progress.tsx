import {
  BookOpen,
  CalendarDays,
  Clock,
  Compass,
  Flame,
  Languages,
  Moon,
  Mountain,
  PenLine,
  Repeat,
  Sparkles,
  Star,
  Sunrise,
  TrendingUp,
  Wind,
} from "lucide-react";
import { useI18n } from "../i18n/I18nProvider";
import { useStore } from "../store/StoreProvider";
import { usePageMeta } from "../lib/usePageMeta";
import { categories } from "../lib/stats";
import { achievements } from "../data/achievements";
import { moods } from "../data/moods";
import { formatMinutes } from "../lib/utils";
import type { TranslationKey } from "../i18n/en";
import { ProgressRing } from "../components/ProgressRing";

const iconMap: Record<string, typeof Sparkles> = {
  sparkles: Sparkles,
  repeat: Repeat,
  calendar: CalendarDays,
  mountain: Mountain,
  clock: Clock,
  moon: Moon,
  compass: Compass,
  pen: PenLine,
  wind: Wind,
  star: Star,
  sunrise: Sunrise,
  languages: Languages,
};

const categoryColors: Record<string, string> = {
  meditation: "var(--sea)",
  sleep: "var(--plum)",
  focus: "var(--gold)",
  breath: "var(--teal)",
  movement: "var(--coral)",
  family: "var(--clay)",
};

export function Progress() {
  const { t, pick, lang, formatNumber } = useI18n();
  const { data, stats } = useStore();
  const unlocked = achievements.filter((achievement) => achievement.test(stats.achievementStats));
  const totalCategoryMinutes = Math.max(
    1,
    categories.reduce((total, category) => total + stats.categoryMinutes[category], 0),
  );
  const moodsWithData = stats.moodSeries.filter((point) => point.value !== null);
  const moodAverage =
    moodsWithData.length > 0
      ? moodsWithData.reduce((total, point) => total + (point.value ?? 0), 0) / moodsWithData.length
      : null;
  const maxDay = Math.max(10, ...stats.last7.map((day) => day.minutes));

  usePageMeta({
    title: `${t("app.progress.title")} · Marea`,
    description: t("app.progress.sub"),
  });

  const moodPath = (() => {
    const points: Array<{ x: number; y: number }> = [];
    stats.moodSeries.forEach((point, index) => {
      if (point.value === null) return;
      points.push({
        x: (index / Math.max(1, stats.moodSeries.length - 1)) * 320,
        y: 100 - ((point.value - 1) / 4) * 84,
      });
    });
    return points;
  })();

  return (
    <div className="page progress-page">
      <header className="page-head">
        <div>
          <p className="eyebrow">{t("nav.progress")}</p>
          <h1 className="display page-title">{t("app.progress.title")}</h1>
          <p className="page-lede">{t("app.progress.sub")}</p>
        </div>
        <div className="progress-head-badge">
          <Flame size={18} />
          <span>
            <strong>{stats.streak}</strong> {t("app.progress.days")}
          </span>
        </div>
      </header>

      <section className="stat-grid" aria-label={t("app.progress.title")}>
        <article className="stat-card">
          <span className="stat-card__icon stat-card__icon--coral">
            <Flame size={18} />
          </span>
          <div>
            <strong>{stats.streak}</strong>
            <span>{t("app.progress.current")}</span>
          </div>
        </article>
        <article className="stat-card">
          <span className="stat-card__icon stat-card__icon--gold">
            <TrendingUp size={18} />
          </span>
          <div>
            <strong>{stats.bestStreak}</strong>
            <span>{t("app.progress.best")}</span>
          </div>
        </article>
        <article className="stat-card">
          <span className="stat-card__icon stat-card__icon--sea">
            <Clock size={18} />
          </span>
          <div>
            <strong>{formatMinutes(stats.totalMinutes, lang)}</strong>
            <span>{t("app.progress.minutes")}</span>
          </div>
        </article>
        <article className="stat-card">
          <span className="stat-card__icon stat-card__icon--plum">
            <Sparkles size={18} />
          </span>
          <div>
            <strong>{stats.totalSessions}</strong>
            <span>{t("app.progress.sessions")}</span>
          </div>
        </article>
      </section>

      <div className="progress-grid">
        <section className="progress-card progress-week" aria-labelledby="week-title">
          <div className="mini-head">
            <h2 id="week-title">{t("app.progress.last7")}</h2>
            <span className="tiny muted">
              {formatMinutes(stats.weekMinutes, lang)} · {stats.last7.filter((day) => day.minutes > 0).length}{" "}
              {t("common.days")}
            </span>
          </div>
          <div className="week-chart">
            {stats.last7.map((day) => (
              <div key={day.key} className="week-chart__col">
                <span className="week-chart__value">{day.minutes > 0 ? day.minutes : ""}</span>
                <div className="week-chart__track">
                  <span
                    className={day.minutes > 0 ? "has-value" : ""}
                    style={{ height: `${Math.max(3, (day.minutes / maxDay) * 100)}%` }}
                  />
                </div>
                <span className="week-chart__day">
                  {new Intl.DateTimeFormat(lang === "es" ? "es-ES" : "en-GB", {
                    weekday: "short",
                  })
                    .format(day.date)
                    .slice(0, 2)}
                </span>
              </div>
            ))}
          </div>
          {stats.totalSessions === 0 && <p className="chart-note">{t("app.progress.noData")}</p>}
        </section>

        <section className="progress-card progress-mood" aria-labelledby="mood-chart-title">
          <div className="mini-head">
            <h2 id="mood-chart-title">{t("app.progress.mood")}</h2>
            {moodAverage !== null && (
              <span className="tiny muted">
                {moods.find((mood) => mood.id === stats.moodSeries.filter((p) => p.value).slice(-1)[0]?.mood)?.label[lang] ??
                  ""}
              </span>
            )}
          </div>
          {moodsWithData.length === 0 ? (
            <p className="chart-note">{t("app.progress.noMood")}</p>
          ) : (
            <div className="mood-chart">
              <svg viewBox="0 0 320 110" preserveAspectRatio="none" role="img" aria-label={t("app.progress.mood")}>
                {[0, 1, 2, 3, 4].map((line) => (
                  <line
                    key={line}
                    x1="0"
                    x2="320"
                    y1={100 - (line / 4) * 84}
                    y2={100 - (line / 4) * 84}
                    className="mood-chart__grid"
                  />
                ))}
                {moodPath.length > 1 && (
                  <polyline
                    className="mood-chart__line"
                    points={moodPath.map((point) => `${point.x},${point.y}`).join(" ")}
                    fill="none"
                  />
                )}
                {moodPath.map((point, index) => (
                  <circle key={index} cx={point.x} cy={point.y} r="3.4" className="mood-chart__dot" />
                ))}
              </svg>
              <div className="mood-legend">
                {[...moods].reverse().map((mood) => (
                  <span key={mood.id} style={{ ["--mood-color" as string]: mood.color }}>
                    <span aria-hidden="true" />
                    {pick(mood.label)}
                  </span>
                ))}
              </div>
            </div>
          )}
        </section>
      </div>

      <div className="progress-grid progress-grid--wide">
        <section className="progress-card progress-heatmap" aria-labelledby="heatmap-title">
          <div className="mini-head">
            <h2 id="heatmap-title">{t("app.progress.last12")}</h2>
            <span className="tiny muted">{formatNumber(stats.totalMinutes)} min</span>
          </div>
          <div className="heatmap" role="img" aria-label={t("app.progress.last12")}>
            {stats.last84.map((day) => {
              const level =
                day.minutes <= 0 ? 0 : day.minutes < 5 ? 1 : day.minutes < 15 ? 2 : day.minutes < 30 ? 3 : 4;
              return (
                <span
                  key={day.key}
                  className={`heatmap__cell heatmap__cell--${level}`}
                  title={`${new Intl.DateTimeFormat(lang === "es" ? "es-ES" : "en-GB", {
                    day: "numeric",
                    month: "short",
                  }).format(day.date)} · ${day.minutes} min`}
                />
              );
            })}
          </div>
          <div className="heatmap-scale">
            <span>{t("common.less")}</span>
            {[0, 1, 2, 3, 4].map((level) => (
              <span key={level} className={`heatmap__cell heatmap__cell--${level}`} />
            ))}
            <span>{t("common.more")}</span>
          </div>
        </section>

        <section className="progress-card progress-categories" aria-labelledby="cat-title">
          <div className="mini-head">
            <h2 id="cat-title">{t("app.progress.category")}</h2>
          </div>
          <ul className="cat-bars">
            {categories.map((category) => {
              const minutes = stats.categoryMinutes[category];
              return (
                <li key={category}>
                  <div className="cat-bars__head">
                    <span>
                      <span
                        className="cat-bars__dot"
                        style={{ background: categoryColors[category] }}
                        aria-hidden="true"
                      />
                      {t(`category.${category}` as TranslationKey)}
                    </span>
                    <strong>{formatMinutes(minutes, lang)}</strong>
                  </div>
                  <div className="cat-bars__track">
                    <span
                      style={{
                        width: `${(minutes / totalCategoryMinutes) * 100}%`,
                        background: categoryColors[category],
                      }}
                    />
                  </div>
                </li>
              );
            })}
          </ul>
        </section>
      </div>

      <section className="progress-card achievements" aria-labelledby="achievements-title">
        <div className="mini-head">
          <h2 id="achievements-title">{t("app.progress.achievements")}</h2>
          <span className="tiny muted">
            {unlocked.length} / {achievements.length}
          </span>
        </div>
        <div className="achievement-grid">
          {achievements.map((achievement) => {
            const isUnlocked = achievement.test(stats.achievementStats);
            const current = Math.min(
              achievement.target,
              Math.max(0, achievement.progress(stats.achievementStats)),
            );
            const Icon = iconMap[achievement.icon] ?? Sparkles;
            return (
              <article
                key={achievement.id}
                className={`achievement${isUnlocked ? " is-unlocked" : ""}`}
              >
                <span className="achievement__icon">
                  <Icon size={19} />
                </span>
                <div>
                  <h3>{pick(achievement.title)}</h3>
                  <p>{pick(achievement.description)}</p>
                </div>
                <div className="achievement__foot">
                  <div className="achievement__track">
                    <span style={{ width: `${(current / achievement.target) * 100}%` }} />
                  </div>
                  <span className="tiny muted">
                    {current} / {achievement.target}
                  </span>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <div className="progress-lower">
        <section className="progress-card progress-reflection">
          <div className="progress-reflection__ring">
            <ProgressRing value={Math.min(1, stats.journalCount / 30)} size={96} stroke={4}>
              <strong>{stats.journalCount}</strong>
              <span>{t("app.progress.journal")}</span>
            </ProgressRing>
          </div>
          <div>
            <h2>{t("app.progress.keepGoing")}</h2>
            <p>{t("app.progress.sub")}</p>
            <span className="tiny muted">
              {stats.achievementStats.breathSessions} {t("app.progress.breath").toLowerCase()} ·{" "}
              {stats.achievementStats.sleepSessions} {t("category.sleep").toLowerCase()}
            </span>
          </div>
        </section>

        <aside className="progress-note">
          <BookOpen size={18} />
          <p>{t("app.journal.noEntriesBody")}</p>
        </aside>
      </div>

      {data.activities.length === 0 && (
        <p className="progress-empty-note">{t("app.progress.noData")}</p>
      )}
    </div>
  );
}
