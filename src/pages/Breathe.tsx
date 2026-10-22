import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Check, Pause, Play, RotateCcw, Volume2, VolumeX, Wind } from "lucide-react";
import { useI18n } from "../i18n/I18nProvider";
import { useStore } from "../store/StoreProvider";
import { usePageMeta } from "../lib/usePageMeta";
import { breathPatterns } from "../data/breathing";
import { soundPresetById } from "../data/soundscapes";
import { ambientEngine } from "../lib/audio";
import { formatClock } from "../lib/utils";
import { Orb } from "../components/Orb";
import type { TranslationKey } from "../i18n/en";

const durations = [1, 3, 5, 10];

interface Phase {
  key: "inhale" | "hold" | "exhale" | "holdOut";
  seconds: number;
  scale: number;
  label: TranslationKey;
}

export function Breathe() {
  const { t, pick, lang } = useI18n();
  const { data, completeActivity } = useStore();
  const [patternId, setPatternId] = useState("coherent");
  const [minutes, setMinutes] = useState(3);
  const [running, setRunning] = useState(false);
  const [finished, setFinished] = useState(false);
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [phaseRemaining, setPhaseRemaining] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [cycles, setCycles] = useState(0);
  const [soundOn, setSoundOn] = useState(false);
  const finishedRef = useRef(false);

  const pattern = breathPatterns.find((item) => item.id === patternId) ?? breathPatterns[0];
  const totalSeconds = minutes * 60;

  const phases = useMemo<Phase[]>(() => {
    const allPhases: Phase[] = [
      { key: "inhale", seconds: pattern.inhale, scale: 1, label: "app.breathe.inhale" },
      { key: "hold", seconds: pattern.holdIn, scale: 1, label: "app.breathe.hold" },
      { key: "exhale", seconds: pattern.exhale, scale: 0.62, label: "app.breathe.exhale" },
      { key: "holdOut", seconds: pattern.holdOut, scale: 0.62, label: "app.breathe.holdOut" },
    ];
    return allPhases.filter((phase) => phase.seconds > 0);
  }, [pattern]);

  const currentPhase = phases[phaseIndex % phases.length] ?? phases[0];
  const phaseDuration = currentPhase.seconds * 1000;

  const resetSession = () => {
    setRunning(false);
    setFinished(false);
    setElapsed(0);
    setCycles(0);
    setPhaseIndex(0);
    setPhaseRemaining(phases[0]?.seconds ?? 0);
    finishedRef.current = false;
    ambientEngine.stop(0.6);
    setSoundOn(false);
  };

  useEffect(() => {
    setPhaseRemaining(phases[0]?.seconds ?? 0);
    setPhaseIndex(0);
  }, [patternId, minutes, phases]);

  useEffect(() => {
    return () => {
      ambientEngine.stop(0.4);
    };
  }, []);

  const finish = (logMinutes: number) => {
    if (finishedRef.current) return;
    finishedRef.current = true;
    setRunning(false);
    setFinished(true);
    ambientEngine.fadeOut(4);
    setSoundOn(false);
    if (logMinutes >= 0.5) {
      completeActivity({
        sessionId: `breathe-${pattern.id}`,
        type: "breath",
        category: "breath",
        minutes: logMinutes,
      });
    }
  };

  useEffect(() => {
    if (!running || finished) return;
    const timer = window.setInterval(() => {
      setPhaseRemaining((current) => current - 0.1);
      setElapsed((current) => {
        const next = current + 0.1;
        if (next >= totalSeconds) {
          finish(totalSeconds / 60);
          return totalSeconds;
        }
        return next;
      });
    }, 100);
    return () => window.clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running, finished, totalSeconds]);

  useEffect(() => {
    if (!running || finished) return;
    if (phaseRemaining > 0) return;
    const next = (phaseIndex + 1) % phases.length;
    if (next === 0) setCycles((count) => count + 1);
    setPhaseIndex(next);
    setPhaseRemaining(phases[next].seconds);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phaseRemaining, running, finished, phaseIndex, phases]);

  const start = () => {
    if (finished) {
      setFinished(false);
      setElapsed(0);
      setCycles(0);
      setPhaseIndex(0);
      setPhaseRemaining(phases[0]?.seconds ?? 0);
      finishedRef.current = false;
    }
    setRunning(true);
    if (soundOn) {
      const preset = soundPresetById.get("tide-breath");
      if (preset) ambientEngine.start(preset.layers, data.settings.ambientVolume * 0.8);
    }
  };

  const pause = () => setRunning(false);

  const end = () => {
    if (elapsed >= 30) {
      finish(elapsed / 60);
    } else {
      resetSession();
    }
  };

  const toggleSound = () => {
    const next = !soundOn;
    setSoundOn(next);
    if (next) {
      const preset = soundPresetById.get("tide-breath");
      if (preset) ambientEngine.start(preset.layers, data.settings.ambientVolume * 0.8);
    } else {
      ambientEngine.stop(0.8);
    }
  };

  const choosePattern = (id: string) => {
    if (id === patternId) return;
    resetSession();
    setPatternId(id);
  };

  const changeDuration = (value: number) => {
    resetSession();
    setMinutes(value);
  };

  usePageMeta({
    title: `${t("app.breathe.title")} · Marea`,
    description: t("app.breathe.sub"),
  });

  return (
    <div className="page breathe-page">
      <header className="page-head">
        <div>
          <p className="eyebrow">{t("nav.breathe")}</p>
          <h1 className="display page-title">{t("app.breathe.title")}</h1>
          <p className="page-lede">{t("app.breathe.sub")}</p>
        </div>
        <span className="page-head__count">
          <Wind size={18} />
          <span>{pick(pattern.name)}</span>
        </span>
      </header>

      <div className="breathe-grid">
        <section className="breathe-setup" aria-labelledby="pattern-title">
          <div className="breathe-block">
            <div className="mini-head">
              <h2 id="pattern-title">{t("app.breathe.pattern")}</h2>
            </div>
            <div className="pattern-list">
              {breathPatterns.map((item) => {
                const timings = [
                  item.inhale,
                  item.holdIn,
                  item.exhale,
                  item.holdOut,
                ].filter((value) => value > 0);
                return (
                  <button
                    key={item.id}
                    type="button"
                    className={`pattern-card pattern-card--${item.accent}${patternId === item.id ? " is-active" : ""}`}
                    aria-pressed={patternId === item.id}
                    onClick={() => choosePattern(item.id)}
                  >
                    <span className="pattern-card__dot" aria-hidden="true" />
                    <span className="pattern-card__body">
                      <strong>{pick(item.name)}</strong>
                      <span>{pick(item.description)}</span>
                    </span>
                    <span className="pattern-card__timing">{timings.join(" · ")}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="breathe-block">
            <div className="mini-head">
              <h2>{t("app.breathe.duration")}</h2>
            </div>
            <div className="duration-row">
              {durations.map((value) => (
                <button
                  key={value}
                  type="button"
                  className="chip"
                  aria-pressed={minutes === value}
                  onClick={() => changeDuration(value)}
                >
                  {value} {t("app.breathe.min")}
                </button>
              ))}
            </div>
            <p className="breathe-note">{t("app.breathe.note")}</p>
          </div>

          <div className="breathe-tip">
            <span className="breathe-tip__icon">
              <Wind size={17} />
            </span>
            <p>{t("app.breathe.readyBody")}</p>
          </div>
        </section>

        <section className={`breathe-stage breathe-stage--${pattern.accent}${running ? " is-running" : ""}${finished ? " is-finished" : ""}`}>
          {!finished ? (
            <>
              <div className="breathe-stage__top">
                <span className="breathe-stage__pattern">
                  {pick(pattern.name)} · {minutes} {t("common.min")}
                </span>
                <button
                  type="button"
                  className={`breathe-sound${soundOn ? " is-on" : ""}`}
                  onClick={toggleSound}
                  aria-pressed={soundOn}
                >
                  {soundOn ? <Volume2 size={15} /> : <VolumeX size={15} />}
                  {t("app.breathe.sound")}
                </button>
              </div>

              <div className="breathe-stage__body">
                <Orb
                  accent={pattern.accent}
                  active={running}
                  scale={currentPhase.scale}
                  duration={running ? phaseDuration : 700}
                  size="lg"
                >
                  <span className="breathe-phase" aria-live="polite">
                    {running || elapsed > 0 ? t(currentPhase.label) : t("app.breathe.ready")}
                  </span>
                  <span className="breathe-count">
                    {running ? Math.ceil(phaseRemaining) : formatClock(totalSeconds)}
                  </span>
                </Orb>
                <p className="breathe-sub">
                  {running
                    ? `${cycles} ${cycles === 1 ? t("app.breathe.cycle") : t("app.breathe.rounds")} · ${formatClock(Math.max(0, totalSeconds - elapsed))}`
                    : t("app.breathe.readyBody")}
                </p>
              </div>

              <div className="breathe-stage__actions">
                {!running ? (
                  <button type="button" className="btn btn--light btn--lg" onClick={start}>
                    <Play size={17} fill="currentColor" />
                    {elapsed > 0 ? t("app.breathe.resume") : t("app.breathe.start")}
                  </button>
                ) : (
                  <button type="button" className="btn btn--light btn--lg" onClick={pause}>
                    <Pause size={17} fill="currentColor" />
                    {t("app.breathe.pause")}
                  </button>
                )}
                {(elapsed > 0 || running) && (
                  <button type="button" className="btn btn--ghost btn--ghost-light" onClick={end}>
                    {t("app.breathe.end")}
                  </button>
                )}
              </div>

              <div className="breathe-stage__meter" aria-hidden="true">
                <span style={{ width: `${Math.min(100, (elapsed / totalSeconds) * 100)}%` }} />
              </div>
            </>
          ) : (
            <div className="breathe-complete">
              <span className="breathe-complete__icon">
                <Check size={24} />
              </span>
              <h2 className="display">{t("app.breathe.complete")}</h2>
              <p>{t("app.breathe.completeBody")}</p>
              <div className="breathe-complete__stats">
                <div>
                  <strong>{Math.max(1, Math.round(elapsed / 60))}</strong>
                  <span>
                    {Math.max(1, Math.round(elapsed / 60)) === 1
                      ? t("common.minute")
                      : t("common.minutes")}
                  </span>
                </div>
                <div>
                  <strong>{cycles}</strong>
                  <span>{t("app.breathe.rounds")}</span>
                </div>
              </div>
              <div className="breathe-complete__actions">
                <button type="button" className="btn btn--light" onClick={resetSession}>
                  <RotateCcw size={15} />
                  {t("app.breathe.again")}
                </button>
                <Link to="/app/library" className="btn btn--ghost btn--ghost-light">
                  {t("nav.library")}
                  <ArrowRight size={15} />
                </Link>
              </div>
            </div>
          )}
        </section>
      </div>

      <section className="breathe-related" aria-labelledby="breathe-related-title">
        <div className="mini-head">
          <h2 id="breathe-related-title">{lang === "es" ? "Para después" : "Afterwards"}</h2>
          <Link to="/app/library?category=breath" className="link-arrow">
            {t("nav.viewAll")}
            <ArrowRight size={14} />
          </Link>
        </div>
        <div className="breathe-related__grid">
          <Link to="/app/practice/ocean-breath" className="breathe-related__card">
            <span>{t("app.breathe.tenMinutes")}</span>
            <strong>{lang === "es" ? "Respiración océano" : "Ocean breath"}</strong>
            <ArrowRight size={15} />
          </Link>
          <Link to="/app/practice/anxiety-sos" className="breathe-related__card">
            <span>3 min</span>
            <strong>{lang === "es" ? "SOS ansiedad" : "Anxiety SOS"}</strong>
            <ArrowRight size={15} />
          </Link>
          <Link to="/app/practice/midday-reset" className="breathe-related__card">
            <span>2 min</span>
            <strong>{lang === "es" ? "Reinicio del mediodía" : "Midday reset"}</strong>
            <ArrowRight size={15} />
          </Link>
        </div>
      </section>
    </div>
  );
}
