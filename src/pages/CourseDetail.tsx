import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, BookOpen, Check, Circle, Play, Sparkles } from "lucide-react";
import { useI18n } from "../i18n/I18nProvider";
import { useStore } from "../store/StoreProvider";
import { usePageMeta } from "../lib/usePageMeta";
import { courseById } from "../data/courses";
import { sessionById } from "../data/sessions";
import { SceneArt } from "../components/SceneArt";
import { ProgressRing } from "../components/ProgressRing";
import { useToast } from "../components/ToastProvider";

export function CourseDetail() {
  const { id } = useParams();
  const { t, pick } = useI18n();
  const { data, markCourseDay } = useStore();
  const { toast } = useToast();
  const course = id ? courseById.get(id) : undefined;
  const done = course ? data.courses[course.id] ?? [] : [];
  const ratio = course ? done.length / course.days.length : 0;
  const nextIndex = course ? course.days.findIndex((_, index) => !done.includes(index)) : -1;
  const activeIndex = nextIndex >= 0 ? nextIndex : 0;
  const nextDay = course?.days[activeIndex];
  const nextSession = nextDay ? sessionById.get(nextDay.sessionId) : undefined;

  usePageMeta({
    title: course ? `${pick(course.title)} · Marea` : `${t("app.courses.notFound")} · Marea`,
    description: course ? pick(course.description) : t("app.courses.sub"),
  });

  if (!course) {
    return (
      <div className="page">
        <div className="empty-state">
          <span className="empty-state__icon">
            <BookOpen size={24} />
          </span>
          <h1>{t("app.courses.notFound")}</h1>
          <p>{t("app.courses.sub")}</p>
          <Link to="/app/courses" className="btn btn--ghost">
            <ArrowLeft size={15} />
            {t("app.courses.back")}
          </Link>
        </div>
      </div>
    );
  }

  const toggleDay = (index: number) => {
    markCourseDay(course.id, index);
    if (!done.includes(index)) toast(t("app.courses.dayComplete"), "success");
  };

  const completed = done.length >= course.days.length;

  return (
    <div className="page course-detail-page">
      <Link to="/app/courses" className="back-line">
        <ArrowLeft size={15} />
        {t("app.courses.back")}
      </Link>

      <section className="course-hero">
        <div className="course-hero__art" aria-hidden="true">
          <SceneArt variant={course.art} />
        </div>
        <div className="course-hero__scrim" aria-hidden="true" />
        <div className="course-hero__body">
          <p className="eyebrow">{pick(course.subtitle)}</p>
          <h1 className="display">{pick(course.title)}</h1>
          <p>{pick(course.description)}</p>
          <div className="course-hero__meta">
            <span>
              {course.days.length} {t("app.courses.days")}
            </span>
            <span className="course-hero__divider" aria-hidden="true" />
            <span>
              {done.length} / {course.days.length} {t("app.courses.completed").toLowerCase()}
            </span>
          </div>
          {nextSession && nextDay && (
            <div className="course-hero__actions">
              <Link to={`/app/practice/${nextSession.id}`} className="btn btn--light">
                <Play size={15} fill="currentColor" />
                {done.length > 0 ? t("app.courses.continue") : t("app.courses.start")}
              </Link>
              <span className="course-hero__next">
                {t("app.courses.day")} {activeIndex + 1} · {pick(nextDay.title)}
              </span>
            </div>
          )}
        </div>
        <div className="course-hero__ring">
          <ProgressRing value={ratio} size={108} stroke={4} tone="light" label={`${Math.round(ratio * 100)}%`}>
            <strong>{Math.round(ratio * 100)}%</strong>
            <span>{t("app.courses.complete")}</span>
          </ProgressRing>
        </div>
      </section>

      {completed && (
        <div className="course-complete-banner">
          <span className="course-complete-banner__icon">
            <Check size={18} />
          </span>
          <div>
            <strong>{t("app.courses.complete")}</strong>
            <p>{t("app.courses.dayComplete")}</p>
          </div>
        </div>
      )}

      <div className="course-layout">
        <section className="course-days" aria-labelledby="course-days-title">
          <div className="mini-head">
            <h2 id="course-days-title">{t("app.courses.days")}</h2>
            <span className="tiny muted">
              {done.length} / {course.days.length}
            </span>
          </div>
          <ol className="day-list">
            {course.days.map((day, index) => {
              const session = sessionById.get(day.sessionId);
              const isDone = done.includes(index);
              const isNext = index === activeIndex && !completed;
              return (
                <li
                  key={`${day.sessionId}-${index}`}
                  className={`day-item${isDone ? " is-done" : ""}${isNext ? " is-next" : ""}`}
                >
                  <div className="day-item__marker">
                    {isDone ? <Check size={14} /> : <span>{String(index + 1).padStart(2, "0")}</span>}
                  </div>
                  <div className="day-item__body">
                    <div className="day-item__head">
                      <span className="day-item__label">
                        {t("app.courses.day")} {index + 1}
                        {isNext && <span className="badge badge--sea">{t("app.courses.continue")}</span>}
                      </span>
                      <h3>{pick(day.title)}</h3>
                      <p>{pick(day.note)}</p>
                    </div>
                    {session && (
                      <div className="day-item__session">
                        <span>
                          {pick(session.title)} · {session.minutes} {t("common.min")}
                        </span>
                        <Link to={`/app/practice/${session.id}`} className="btn btn--ghost btn--sm">
                          <Play size={13} fill="currentColor" />
                          {t("app.library.play")}
                        </Link>
                      </div>
                    )}
                  </div>
                  <button
                    type="button"
                    className={`day-item__check${isDone ? " is-done" : ""}`}
                    onClick={() => toggleDay(index)}
                    aria-pressed={isDone}
                    aria-label={isDone ? t("app.courses.marked") : t("app.courses.mark")}
                  >
                    {isDone ? <Check size={16} /> : <Circle size={16} />}
                  </button>
                </li>
              );
            })}
          </ol>
        </section>

        <aside className="course-aside">
          <div className="course-aside__card">
            <Sparkles size={18} />
            <h2>{t("app.courses.note")}</h2>
            <p>{t("app.courses.sub")}</p>
          </div>
          <div className="course-aside__progress">
            <span className="eyebrow">{t("app.courses.progress")}</span>
            <strong>{Math.round(ratio * 100)}%</strong>
            <div className="course-aside__bar">
              <span style={{ width: `${ratio * 100}%` }} />
            </div>
            <span className="tiny muted">
              {done.length} / {course.days.length} {t("app.courses.days")}
            </span>
          </div>
          {nextSession && (
            <Link to={`/app/practice/${nextSession.id}`} className="course-aside__next">
              <span>{t("app.courses.continue")}</span>
              <strong>{pick(nextSession.title)}</strong>
              <ArrowRight size={15} />
            </Link>
          )}
          <Link to="/app/courses" className="link-arrow">
            {t("app.courses.back")}
            <ArrowLeft size={14} />
          </Link>
        </aside>
      </div>
    </div>
  );
}
