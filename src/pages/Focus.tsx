import { useEffect, useRef, useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Bell,
  BellOff,
  Check,
  Coffee,
  Compass,
  Pause,
  Play,
  Plus,
  RotateCcw,
  Sparkles,
  Trash2,
  Volume2,
  VolumeX,
} from "lucide-react";
import { useI18n } from "../i18n/I18nProvider";
import { useStore } from "../store/StoreProvider";
import { usePageMeta } from "../lib/usePageMeta";
import { soundPresets } from "../data/soundscapes";
import { ambientEngine } from "../lib/audio";
import { formatClock, localDayKey } from "../lib/utils";
import { ProgressRing } from "../components/ProgressRing";
import { SessionCard } from "../components/SessionCard";
import { sessions } from "../data/sessions";
import { useToast } from "../components/ToastProvider";

const focusDurations = [15, 25, 50, 90];
const soundChoices = ["soft-rain", "forest-path", "clear-water"];

export function Focus() {
  const { t, pick } = useI18n();
  const { data, addFocusTask, toggleFocusTask, clearDoneFocusTasks, recordFocusBlock, stats } =
    useStore();
  const { toast } = useToast();
  const [duration, setDuration] = useState(25);
  const [remaining, setRemaining] = useState(25 * 60);
  const [running, setRunning] = useState(false);
  const [finished, setFinished] = useState(false);
  const [mode, setMode] = useState<"focus" | "break">("focus");
  const [soundId, setSoundId] = useState("soft-rain");
  const [soundOn, setSoundOn] = useState(true);
  const [notify, setNotify] = useState(
    typeof Notification !== "undefined" && Notification.permission === "granted",
  );
  const [taskText, setTaskText] = useState("");
  const finishedRef = useRef(false);

  const minutes = mode === "break" ? 5 : duration;
  const total = minutes * 60;
  const progress = total > 0 ? 1 - remaining / total : 0;
  const focusSessions = sessions.filter((session) => session.category === "focus");
  const todayKey = localDayKey();
  const todayFocus = data.activities
    .filter((activity) => activity.type === "focus" && localDayKey(new Date(activity.at)) === todayKey)
    .reduce((totalMinutes, activity) => totalMinutes + activity.minutes, 0);

  usePageMeta({
    title: `${t("app.focus.title")} · Marea`,
    description: t("app.focus.sub"),
  });

  useEffect(() => {
    return () => ambientEngine.stop(0.4);
  }, []);

  useEffect(() => {
    if (!running) return;
    const timer = window.setInterval(() => {
      setRemaining((current) => Math.max(0, current - 1));
    }, 1000);
    return () => window.clearInterval(timer);
  }, [running]);

  useEffect(() => {
    if (!running || remaining > 0) return;
    setRunning(false);
    ambientEngine.fadeOut(4);
    if (mode === "focus") {
      if (finishedRef.current) return;
      finishedRef.current = true;
      recordFocusBlock(duration);
      ambientEngine.chime(data.settings.chimeVolume);
      setFinished(true);
      if (notify && "Notification" in window && Notification.permission === "granted") {
        new Notification(t("app.focus.complete"), { body: t("app.focus.completeBody") });
      }
    } else {
      setMode("focus");
      setFinished(true);
      setRemaining(duration * 60);
      toast(t("app.focus.complete"), "success");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [remaining, running, mode, duration, notify]);

  const start = () => {
    if (finished) {
      setFinished(false);
      finishedRef.current = false;
      setRemaining(duration * 60);
    }
    setRunning(true);
    if (soundOn) {
      const preset = soundPresets.find((item) => item.id === soundId);
      if (preset) ambientEngine.start(preset.layers, data.settings.ambientVolume * 0.7);
    }
  };

  const pause = () => {
    setRunning(false);
  };

  const reset = () => {
    setRunning(false);
    setFinished(false);
    finishedRef.current = false;
    setMode("focus");
    setRemaining(duration * 60);
    ambientEngine.stop(0.8);
  };

  const chooseDuration = (value: number) => {
    reset();
    setDuration(value);
    setRemaining(value * 60);
  };

  const startBreak = () => {
    setMode("break");
    setFinished(false);
    setRemaining(5 * 60);
    setRunning(true);
    if (soundOn) {
      const preset = soundPresets.find((item) => item.id === "forest-path");
      if (preset) ambientEngine.start(preset.layers, data.settings.ambientVolume * 0.5);
    }
  };

  const skipBreak = () => {
    setMode("focus");
    setFinished(true);
    setRemaining(duration * 60);
  };

  const requestNotify = async () => {
    if (!("Notification" in window)) {
      toast(t("app.focus.note"), "error");
      return;
    }
    if (Notification.permission === "granted") {
      setNotify((value) => !value);
      return;
    }
    const permission = await Notification.requestPermission();
    setNotify(permission === "granted");
  };

  const submitTask = (event: FormEvent) => {
    event.preventDefault();
    if (!taskText.trim()) return;
    addFocusTask(taskText);
    setTaskText("");
    toast(t("toast.taskAdded"), "success");
  };

  const toggleSound = () => {
    const next = !soundOn;
    setSoundOn(next);
    if (running) {
      if (next) {
        const preset = soundPresets.find((item) => item.id === soundId);
        if (preset) ambientEngine.start(preset.layers, data.settings.ambientVolume * 0.7);
      } else {
        ambientEngine.stop(0.8);
      }
    }
  };

  return (
    <div className="page focus-page">
      <header className="page-head">
        <div>
          <p className="eyebrow">{t("nav.focus")}</p>
          <h1 className="display page-title">{t("app.focus.title")}</h1>
          <p className="page-lede">{t("app.focus.sub")}</p>
        </div>
        <div className="focus-head-stats">
          <div>
            <strong>{Math.round(todayFocus)}</strong>
            <span>{t("app.focus.today")}</span>
          </div>
          <div>
            <strong>{data.focusCount}</strong>
            <span>{t("app.focus.sessions")}</span>
          </div>
        </div>
      </header>

      <div className="focus-grid">
        <section className={`focus-timer${running ? " is-running" : ""}${finished ? " is-finished" : ""}`}>
          <div className="focus-timer__top">
            <div className="focus-mode" role="group" aria-label={t("app.focus.timer")}>
              <button
                type="button"
                className="focus-mode__btn"
                aria-pressed={mode === "focus"}
                onClick={() => {
                  setMode("focus");
                  setRunning(false);
                  setRemaining(duration * 60);
                }}
              >
                {t("app.focus.title")}
              </button>
              <button
                type="button"
                className="focus-mode__btn"
                aria-pressed={mode === "break"}
                onClick={startBreak}
              >
                {t("app.focus.break")}
              </button>
            </div>
            <button
              type="button"
              className={`focus-sound${soundOn ? " is-on" : ""}`}
              onClick={toggleSound}
              aria-pressed={soundOn}
              aria-label={t("app.focus.sound")}
            >
              {soundOn ? <Volume2 size={16} /> : <VolumeX size={16} />}
            </button>
          </div>

          {!finished ? (
            <>
              <div className="focus-timer__ring">
                <ProgressRing
                  value={progress}
                  size={286}
                  stroke={4}
                  tone="light"
                  label={`${t("app.focus.timer")}: ${formatClock(remaining)}`}
                >
                  <span className="focus-timer__mode">
                    {mode === "break" ? t("app.focus.break") : `${duration} ${t("app.focus.minutes")}`}
                  </span>
                  <span className="focus-timer__clock mono">{formatClock(remaining)}</span>
                  <span className="focus-timer__state">
                    {running ? t("app.sleep.playing") : t("player.ready")}
                  </span>
                </ProgressRing>
              </div>

              <div className="focus-timer__actions">
                {!running ? (
                  <button type="button" className="btn btn--light btn--lg" onClick={start}>
                    <Play size={17} fill="currentColor" />
                    {t("app.focus.start")}
                  </button>
                ) : (
                  <button type="button" className="btn btn--light btn--lg" onClick={pause}>
                    <Pause size={17} fill="currentColor" />
                    {t("app.focus.pause")}
                  </button>
                )}
                <button type="button" className="btn btn--ghost btn--ghost-light" onClick={reset}>
                  <RotateCcw size={15} />
                  {t("app.focus.reset")}
                </button>
              </div>

              <div className="focus-timer__sound">
                <span>{t("app.focus.sound")}</span>
                <select
                  value={soundId}
                  onChange={(event) => {
                    setSoundId(event.target.value);
                    if (running && soundOn) {
                      const preset = soundPresets.find((item) => item.id === event.target.value);
                      if (preset) ambientEngine.start(preset.layers, data.settings.ambientVolume * 0.7);
                    }
                  }}
                  aria-label={t("app.focus.sound")}
                >
                  {soundChoices.map((id) => {
                    const preset = soundPresets.find((item) => item.id === id);
                    return (
                      <option key={id} value={id}>
                        {preset ? pick(preset.name) : id}
                      </option>
                    );
                  })}
                </select>
              </div>
            </>
          ) : (
            <div className="focus-complete">
              <span className="focus-complete__icon">
                <Check size={24} />
              </span>
              <h2 className="display">{t("app.focus.complete")}</h2>
              <p>{t("app.focus.completeBody")}</p>
              <div className="focus-complete__stats">
                <div>
                  <strong>{duration}</strong>
                  <span>{t("app.focus.minutes")}</span>
                </div>
                <div>
                  <strong>{data.focusCount}</strong>
                  <span>{t("app.focus.sessions")}</span>
                </div>
              </div>
              <div className="focus-complete__actions">
                <button type="button" className="btn btn--light" onClick={startBreak}>
                  <Coffee size={15} />
                  {t("app.focus.break")}
                </button>
                <button type="button" className="btn btn--ghost btn--ghost-light" onClick={skipBreak}>
                  {t("app.focus.skipBreak")}
                  <ArrowRight size={15} />
                </button>
              </div>
            </div>
          )}
        </section>

        <aside className="focus-config">
          <section className="focus-config__block">
            <h2>{t("app.focus.timer")}</h2>
            <div className="duration-row">
              {focusDurations.map((value) => (
                <button
                  key={value}
                  type="button"
                  className="chip"
                  aria-pressed={duration === value}
                  onClick={() => chooseDuration(value)}
                >
                  {value} {t("app.focus.minutes")}
                </button>
              ))}
            </div>
            <p className="focus-note">{t("app.focus.note")}</p>
          </section>

          <section className="focus-config__block">
            <div className="mini-head">
              <h2>{t("app.focus.task")}</h2>
            </div>
            <form className="focus-task-form" onSubmit={submitTask}>
              <input
                className="input"
                value={taskText}
                onChange={(event) => setTaskText(event.target.value)}
                placeholder={t("app.focus.taskPlaceholder")}
                maxLength={140}
                aria-label={t("app.focus.task")}
              />
              <button type="submit" className="btn btn--sm" disabled={!taskText.trim()}>
                <Plus size={14} />
                {t("app.focus.addTask")}
              </button>
            </form>
            <div className="focus-tasks">
              {data.focusTasks.length === 0 ? (
                <p className="focus-empty">{t("app.focus.noTasks")}</p>
              ) : (
                <>
                  <ul>
                    {data.focusTasks.map((task) => (
                      <li key={task.id} className={task.done ? "is-done" : ""}>
                        <button
                          type="button"
                          className="focus-task-check"
                          role="checkbox"
                          aria-checked={task.done}
                          onClick={() => toggleFocusTask(task.id)}
                        >
                          <span aria-hidden="true">{task.done && <Check size={12} />}</span>
                        </button>
                        <span>{task.text}</span>
                      </li>
                    ))}
                  </ul>
                  {data.focusTasks.some((task) => task.done) && (
                    <button type="button" className="link-arrow focus-clear" onClick={clearDoneFocusTasks}>
                      <Trash2 size={13} />
                      {t("common.delete")}
                    </button>
                  )}
                </>
              )}
            </div>
          </section>

          <section className="focus-config__block focus-config__block--row">
            <div>
              <h2>{t("app.focus.notify")}</h2>
              <p className="tiny muted">{notify ? t("app.focus.notifyOn") : t("app.focus.soundNote")}</p>
            </div>
            <button
              type="button"
              className="switch"
              role="switch"
              aria-checked={notify}
              onClick={requestNotify}
              aria-label={t("app.focus.notify")}
            >
              {notify ? <Bell size={12} /> : <BellOff size={12} />}
            </button>
          </section>

          <div className="focus-stats-card">
            <Compass size={18} />
            <p>
              <strong>{Math.round(todayFocus)}</strong> {t("app.focus.today")}
            </p>
            <div className="focus-stats-card__bar">
              <span style={{ width: `${Math.min(100, (todayFocus / 120) * 100)}%` }} />
            </div>
          </div>
        </aside>
      </div>

      <section className="focus-suggest" aria-labelledby="focus-suggest-title">
        <div className="mini-head">
          <h2 id="focus-suggest-title">{t("app.today.recommended")}</h2>
          <Link to="/app/library?category=focus" className="link-arrow">
            {t("nav.viewAll")}
            <ArrowRight size={14} />
          </Link>
        </div>
        <div className="session-grid session-grid--three">
          {focusSessions.slice(0, 3).map((session) => (
            <SessionCard key={session.id} session={session} />
          ))}
        </div>
      </section>

      <p className="focus-footnote">
        <Sparkles size={14} />
        {t("app.focus.note")}
      </p>
    </div>
  );
}
