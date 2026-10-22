import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, BookOpen, Check, Sparkles } from "lucide-react";
import { useI18n } from "../i18n/I18nProvider";
import { useStore } from "../store/StoreProvider";
import { usePageMeta } from "../lib/usePageMeta";
import { courses } from "../data/courses";
import { SceneArt } from "../components/SceneArt";
import { ProgressRing } from "../components/ProgressRing";

type Filter = "all" | "active" | "done";

export function Courses() {
  const { t, pick } = useI18n();
  const { data } = useStore();
  const [filter, setFilter] = useState<Filter>("all");

  usePageMeta({
    title: `${t("app.courses.title")} · Marea`,
    description: t("app.courses.sub"),
  });

  const progressFor = (courseId: string) => {
    const done = data.courses[courseId] ?? [];
    return done.length;
  };

  const filtered = courses.filter((course) => {
    const done = progressFor(course.id);
    if (filter === "active") return done > 0 && done < course.days.length;
    if (filter === "done") return done >= course.days.length;
    return true;
  });

  const activeCount = courses.filter((course) => {
    const done = progressFor(course.id);
    return done > 0 && done < course.days.length;
  }).length;

  return (
    <div className="page courses-page">
      <header className="page-head">
        <div>
          <p className="eyebrow">{t("nav.courses")}</p>
          <h1 className="display page-title">{t("app.courses.title")}</h1>
          <p className="page-lede">{t("app.courses.sub")}</p>
        </div>
        <span className="page-head__count">
          <BookOpen size={18} />
          <span>
            <strong>{activeCount}</strong> {t("app.courses.continue").toLowerCase()}
          </span>
        </span>
      </header>

      <div className="filter-row">
        <button
          type="button"
          className="chip"
          aria-pressed={filter === "all"}
          onClick={() => setFilter("all")}
        >
          {t("common.all")}
        </button>
        <button
          type="button"
          className="chip"
          aria-pressed={filter === "active"}
          onClick={() => setFilter("active")}
        >
          {t("app.courses.continue")}
        </button>
        <button
          type="button"
          className="chip"
          aria-pressed={filter === "done"}
          onClick={() => setFilter("done")}
        >
          {t("app.courses.completed")}
        </button>
      </div>

      <div className="course-grid">
        {filtered.map((course) => {
          const done = progressFor(course.id);
          const ratio = done / course.days.length;
          const complete = done >= course.days.length;
          return (
            <Link key={course.id} to={`/app/courses/${course.id}`} className="course-card course-card--large">
              <div className="course-card__art">
                <SceneArt variant={course.art} />
                <span className="course-card__days">
                  {course.days.length} {t("app.courses.days")}
                </span>
                {done > 0 && (
                  <span className="course-card__ring">
                    <ProgressRing
                      value={ratio}
                      size={54}
                      stroke={3}
                      tone="light"
                      label={`${Math.round(ratio * 100)}%`}
                    >
                      <span className="course-card__ring-value">{Math.round(ratio * 100)}</span>
                    </ProgressRing>
                  </span>
                )}
              </div>
              <div className="course-card__body">
                <span className="eyebrow">{pick(course.subtitle)}</span>
                <h2>{pick(course.title)}</h2>
                <p>{pick(course.description)}</p>
                <div className="course-card__foot">
                  <span className={`course-card__status${complete ? " is-complete" : ""}`}>
                    {complete ? (
                      <>
                        <Check size={13} /> {t("app.courses.completed")}
                      </>
                    ) : done > 0 ? (
                      <>
                        {done} / {course.days.length} {t("app.courses.days")}
                      </>
                    ) : (
                      <>
                        <Sparkles size={13} /> {t("app.courses.start")}
                      </>
                    )}
                  </span>
                  <ArrowRight size={16} />
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="empty-state">
          <span className="empty-state__icon">
            <BookOpen size={24} />
          </span>
          <h2>{t("app.courses.note")}</h2>
          <p>{t("app.courses.sub")}</p>
          <button type="button" className="btn btn--ghost" onClick={() => setFilter("all")}>
            {t("common.all")}
          </button>
        </div>
      )}

      <p className="courses-note">
        <Sparkles size={14} />
        {t("app.courses.note")}
      </p>
    </div>
  );
}
