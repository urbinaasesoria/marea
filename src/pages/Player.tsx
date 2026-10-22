import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Bookmark,
  BookmarkCheck,
  Check,
  ListMusic,
  Pause,
  Play,
  RotateCcw,
  Sparkles,
  Volume2,
  VolumeX,
  Waves,
  Wind,
} from "lucide-react";
import type { Session, SessionStep } from "../data/types";
import { getSessionSeconds, sessionById, sessions } from "../data/sessions";
import { moods } from "../data/moods";
import { soundLayers, soundPresetById } from "../data/soundscapes";
import { useI18n } from "../i18n/I18nProvider";
import { useStore } from "../store/StoreProvider";
import { usePageMeta } from "../lib/usePageMeta";
import { ambientEngine } from "../lib/audio";
import { narrator } from "../lib/speech";
import { formatClock } from "../lib/utils";
import { SceneArt } from "../components/SceneArt";
import { LanguageToggle } from "../components/LanguageToggle";
import { Logo } from "../components/Logo";
import { Modal } from "../components/Modal";
import { ProgressRing } from "../components/ProgressRing";
import { RangeField } from "../components/RangeField";
import { useToast } from "../components/ToastProvider";

export function Player() {
  const { id } = useParams();
  const session = id ? sessionById.get(id) : undefined;
  if (!session) return <Navigate to="/app/library" replace />;
  return <PlayerView key={session.id} session={session} />;
}

function PlayerView({ session }: { session: Session }) {
  const { t, pick, lang } = useI18n();
  const { data, stats, completeActivity, setMood, addJournal, toggleFavorite: toggleFavoriteStore, updateSettings } = useStore();
  const { toast } = useToast();
  const navigate = useNavigate();
  const steps = session.steps ?? [];
  const totalSeconds = getSessionSeconds(session);
  const isSoundscape = session.kind === "soundscape";
  const preset = soundPresetById.get(session.soundPreset ?? data.settings.defaultSoundscape);
  const initialLayers = useMemo(
    () => (isSoundscape ? session.layers ?? preset?.layers ?? [] : preset?.layers ?? []),
    [isSoundscape, session.layers, preset],
  );
  const [mix, setMix] = useState<Array<{ id: string; volume: number }>>(
    initialLayers.length > 0 ? initialLayers : [{ id: "drone", volume: 0.2 }],
  );
  const [started, setStarted] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [remaining, setRemaining] = useState(steps[0]?.seconds ?? totalSeconds);
  const [elapsed, setElapsed] = useState(0);
  const [moodAfter, setMoodAfter] = useState("");
  const [note, setNote] = useState("");
  const [transcriptOpen, setTranscriptOpen] = useState(false);
  const [mixerOpen, setMixerOpen] = useState(false);
  const [leaveOpen, setLeaveOpen] = useState(false);
  const finishedRef = useRef(false);
  const elapsedRef = useRef(0);
  const saved = data.favorites.includes(session.id);
  const step: SessionStep | undefined = steps[stepIndex];
  const progress = totalSeconds > 0 ? Math.min(1, elapsed / totalSeconds) : 0;
  const activeMood = moods.find((mood) => mood.id === moodAfter);
  const completedMinutes = Math.max(1, Math.round(elapsed / 60));
  const nextSession =
    sessions.find((item) => item.category === session.category && item.id !== session.id) ?? null;

  usePageMeta({
    title: `${pick(session.title)} · Marea`,
    description: pick(session.description),
    noIndex: true,
  });

  const finish = useCallback(() => {
    if (finishedRef.current) return;
    finishedRef.current = true;
    setCompleted(true);
    setPlaying(false);
    narrator.cancel();
    ambientEngine.fadeOut(6);
    completeActivity({
      sessionId: session.id,
      type: session.kind === "soundscape" ? "soundscape" : session.kind === "story" ? "story" : "guided",
      category: session.category,
      minutes: Math.max(0.3, elapsedRef.current / 60),
    });
  }, [session, completeActivity]);

  // A single heartbeat keeps the timer, transcript and progress in sync.
  useEffect(() => {
    if (!started || !playing || completed) return;
    const timer = window.setInterval(() => {
      elapsedRef.current += 1;
      setElapsed(elapsedRef.current);
      setRemaining((current) => Math.max(0, current - 1));
    }, 1000);
    return () => window.clearInterval(timer);
  }, [started, playing, completed]);

  // Move to the next step (or finish) when the step's time runs out.
  useEffect(() => {
    if (!started || !playing || completed) return;
    if (remaining > 0) return;
    if (steps.length > 0 && stepIndex < steps.length - 1) {
      const nextIndex = stepIndex + 1;
      setStepIndex(nextIndex);
      setRemaining(steps[nextIndex].seconds);
    } else {
      finish();
    }
  }, [remaining, started, playing, completed, steps, stepIndex, finish]);

  // Narration follows the step and the selected language.
  useEffect(() => {
    if (!started || completed) return;
    if (steps.length === 0 || !step) return;
    if (data.settings.narration) {
      narrator.speak(pick(step.text), {
        lang,
        voiceURI: data.settings.voiceURI,
        rate: data.settings.speechRate,
        volume: 1,
      });
    }
    if (step.bell) ambientEngine.chime(data.settings.chimeVolume);
    return () => narrator.cancel();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stepIndex, started, completed, lang, data.settings.narration, data.settings.voiceURI, data.settings.speechRate]);

  // Ambient bed. Restarts only when the session changes.
  useEffect(() => {
    if (!started) return;
    ambientEngine.start(mix, data.settings.ambientVolume);
    return () => ambientEngine.stop(1.1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [started, session.id]);

  useEffect(() => {
    if (started) ambientEngine.setMasterVolume(data.settings.ambientVolume);
  }, [data.settings.ambientVolume, started]);

  useEffect(() => {
    return () => {
      narrator.cancel();
      ambientEngine.stop(0.4);
    };
  }, []);

  const begin = () => {
    finishedRef.current = false;
    setStarted(true);
    setPlaying(true);
  };

  const togglePlay = () => {
    if (!started) {
      begin();
      return;
    }
    if (completed) return;
    if (playing) {
      setPlaying(false);
      narrator.pause();
    } else {
      setPlaying(true);
      narrator.resume();
    }
  };

  const goToStep = (index: number) => {
    if (index < 0 || index >= steps.length) return;
    narrator.cancel();
    setStepIndex(index);
    setRemaining(steps[index].seconds);
    setTranscriptOpen(false);
  };

  const skipBack = () => goToStep(Math.max(0, stepIndex - 1));
  const skipForward = () => {
    if (stepIndex >= steps.length - 1) {
      finish();
    } else {
      goToStep(stepIndex + 1);
    }
  };

  const setLayer = (id: string, volume: number) => {
    setMix((current) => {
      const exists = current.some((layer) => layer.id === id);
      if (exists) {
        return current.map((layer) => (layer.id === id ? { ...layer, volume } : layer));
      }
      return [...current, { id, volume }];
    });
    if (started) {
      if (volume <= 0.001) ambientEngine.removeLayer(id);
      else {
        ambientEngine.addLayer(id, volume);
        ambientEngine.setLayerVolume(id, volume);
      }
    }
  };

  const toggleFavorite = () => {
    toggleFavoriteStore(session.id);
    toast(saved ? t("toast.unfavorite") : t("toast.favorite"), saved ? "default" : "success");
  };

  const closeCompleted = () => {
    if (moodAfter) setMood(moodAfter);
    if (note.trim()) {
      addJournal({ title: pick(session.title), body: note.trim(), mood: moodAfter || undefined });
    }
    toast(t("toast.saved"), "success");
    navigate("/app");
  };

  const replay = () => {
    finishedRef.current = false;
    elapsedRef.current = 0;
    setElapsed(0);
    setStepIndex(0);
    setRemaining(steps[0]?.seconds ?? totalSeconds);
    setCompleted(false);
    setMoodAfter("");
    setNote("");
    setStarted(true);
    setPlaying(true);
    ambientEngine.start(mix, data.settings.ambientVolume);
  };

  const requestLeave = () => {
    if (started && !completed) setLeaveOpen(true);
    else navigate("/app/library");
  };

  const currentText = step ? pick(step.text) : "";
  const stepLabel = `${t("player.step")} ${stepIndex + 1} ${t("player.of")} ${steps.length}`;

  return (
    <div className={`player on-dark${completed ? " is-completed" : ""}`}>
      <div className="player__bg" aria-hidden="true">
        <SceneArt variant={session.art} />
      </div>
      <div className="player__scrim" aria-hidden="true" />

      <header className="player__top">
        <button type="button" className="player__back" onClick={requestLeave}>
          <ArrowLeft size={17} />
          <span>{t("player.back")}</span>
        </button>
        <div className="player__top-mark">
          <Logo to="/app" tone="light" compact />
          <span>{isSoundscape ? t("player.soundscape") : t("player.now")}</span>
        </div>
        <div className="player__top-actions">
          <button
            type="button"
            className={`player__icon-btn${saved ? " is-active" : ""}`}
            onClick={toggleFavorite}
            aria-pressed={saved}
            aria-label={saved ? t("player.unfavorite") : t("player.favorite")}
          >
            {saved ? <BookmarkCheck size={17} /> : <Bookmark size={17} />}
          </button>
          <LanguageToggle tone="light" compact />
        </div>
      </header>

      {!started && (
        <main id="main" className="player-ready">
          <div className="player-ready__art">
            <SceneArt variant={session.art} />
            <span className="player-ready__badge">
              <Sparkles size={13} />
              {t(`category.${session.category}` as const)}
            </span>
            <span className="player-ready__duration">
              {Math.round(totalSeconds / 60)} {t("common.min")}
            </span>
          </div>
          <div className="player-ready__body">
            <p className="eyebrow">{isSoundscape ? t("player.soundscape") : t("player.now")}</p>
            <h1 className="display">{pick(session.title)}</h1>
            <p className="player-ready__sub">{pick(session.subtitle)}</p>
            <p className="player-ready__desc">{pick(session.description)}</p>
            <div className="player-ready__meta">
              <span>{session.minutes} {t("common.min")}</span>
              <span aria-hidden="true">·</span>
              <span>{t(`level.${session.level}` as const)}</span>
              <span aria-hidden="true">·</span>
              <span>{t("landing.hero.bilingual")}</span>
            </div>
            <div className="player-ready__actions">
              <button type="button" className="btn btn--light btn--lg" onClick={begin}>
                <Play size={17} fill="currentColor" />
                {t("player.play")}
              </button>
              <button
                type="button"
                className="btn btn--ghost btn--ghost-light"
                onClick={() => setMixerOpen(true)}
              >
                <Waves size={16} />
                {t("player.mix")}
              </button>
            </div>
            <p className="player-ready__note">
              <Wind size={14} />
              {data.settings.narration
                ? t("landing.language.voiceBody")
                : t("player.noNarration")}
            </p>
          </div>
        </main>
      )}

      {started && !completed && (
        <main id="main" className="player-stage">
          <div className="player-stage__main">
            <div className="player-visual">
              <div className="player-visual__art">
                <SceneArt variant={session.art} />
              </div>
              <div className="player-visual__ring">
                <ProgressRing value={progress} size={196} stroke={2} tone="light" label={t("player.timer")}>
                  <span className="player-visual__time">{formatClock(Math.max(0, totalSeconds - elapsed))}</span>
                  <span className="player-visual__status">
                    {playing ? t("player.now") : t("player.paused")}
                  </span>
                </ProgressRing>
              </div>
              {isSoundscape && (
                <div className="player-eq" aria-hidden="true">
                  {Array.from({ length: 26 }, (_, index) => (
                    <span
                      key={index}
                      style={{
                        height: `${14 + Math.abs(Math.sin(index * 0.7)) * 62}%`,
                        animationDelay: `${index * 60}ms`,
                      }}
                    />
                  ))}
                </div>
              )}
            </div>

            <div className="player-text">
              {steps.length > 0 ? (
                <>
                  <p className="player-text__step">{stepLabel}</p>
                  <h1 className="player-text__title">{pick(session.title)}</h1>
                  <p className="player-text__body" aria-live="polite">
                    {currentText}
                  </p>
                </>
              ) : (
                <>
                  <p className="player-text__step">{t("player.soundscape")}</p>
                  <h1 className="player-text__title">{pick(session.title)}</h1>
                  <p className="player-text__body">{t("player.silence")}</p>
                </>
              )}

              <div className="player-controls">
                <button
                  type="button"
                  className="player-ctrl player-ctrl--small"
                  onClick={skipBack}
                  disabled={steps.length === 0 || stepIndex === 0}
                  aria-label={t("player.skipBack")}
                >
                  <RotateCcw size={18} />
                </button>
                <button
                  type="button"
                  className="player-ctrl player-ctrl--main"
                  onClick={togglePlay}
                  aria-label={playing ? t("player.pause") : t("player.resume")}
                >
                  {playing ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" />}
                </button>
                <button
                  type="button"
                  className="player-ctrl player-ctrl--small"
                  onClick={skipForward}
                  disabled={steps.length === 0}
                  aria-label={t("player.skipForward")}
                >
                  <RotateCcw size={18} style={{ transform: "scaleX(-1)" }} />
                </button>
              </div>

              <div className="player-linear" aria-hidden="true">
                <span style={{ width: `${progress * 100}%` }} />
              </div>

              <div className="player-toolbar">
                <button
                  type="button"
                  className="player-tool"
                  onClick={() => setTranscriptOpen(true)}
                  disabled={steps.length === 0}
                >
                  <ListMusic size={15} />
                  {t("player.transcript")}
                </button>
                <button type="button" className="player-tool" onClick={() => setMixerOpen(true)}>
                  <Waves size={15} />
                  {t("player.mix")}
                </button>
                <button
                  type="button"
                  className={`player-tool${data.settings.narration ? " is-on" : ""}`}
                  onClick={() => updateSettings({ narration: !data.settings.narration })}
                  aria-pressed={data.settings.narration}
                >
                  {data.settings.narration ? <Volume2 size={15} /> : <VolumeX size={15} />}
                  {data.settings.narration ? t("player.narrationOn") : t("player.narrationOff")}
                </button>
                <button type="button" className="player-tool player-tool--finish" onClick={() => finish()}>
                  <Check size={15} />
                  {t("player.finishEarly")}
                </button>
              </div>
            </div>
          </div>

          <aside className="player-aside">
            <div className="player-aside__block">
              <h2>{t("player.ambient")}</h2>
              <div className="player-mini-mix">
                {mix.filter((layer) => layer.volume > 0.001).map((layer) => {
                  const meta = soundLayers.find((item) => item.id === layer.id);
                  return meta ? (
                    <span key={layer.id} className="player-mini-mix__item">
                      <span
                        className="player-mini-mix__dot"
                        style={{ opacity: 0.4 + layer.volume }}
                        aria-hidden="true"
                      />
                      {pick(meta.name)}
                    </span>
                  ) : null;
                })}
              </div>
              <button type="button" className="link-arrow player-aside__link" onClick={() => setMixerOpen(true)}>
                {t("player.mixerHint")}
                <ArrowRight size={14} />
              </button>
            </div>
            {steps.length > 0 && (
              <div className="player-aside__block player-aside__block--next">
                <h2>{t("player.transcript")}</h2>
                <p>{currentText}</p>
                <button type="button" className="link-arrow" onClick={() => setTranscriptOpen(true)}>
                  {t("player.transcript")}
                  <ArrowRight size={14} />
                </button>
              </div>
            )}
            <div className="player-aside__block player-aside__block--quote">
              <Waves size={18} />
              <p>{t("app.progress.keepGoing")}</p>
            </div>
          </aside>
        </main>
      )}

      {completed && (
        <main id="main" className="player-complete">
          <div className="player-complete__card">
            <span className="player-complete__check">
              <Check size={22} />
            </span>
            <p className="eyebrow">{t("player.complete")}</p>
            <h1 className="display">{pick(session.title)}</h1>
            <p className="player-complete__body">{t("player.completeBody")}</p>

            <div className="player-complete__stat">
              <strong>{completedMinutes}</strong>
              <span>{completedMinutes === 1 ? t("common.minute") : t("common.minutes")}</span>
              <span className="player-complete__divider" aria-hidden="true" />
              <strong>{stats.streak}</strong>
              <span>{t("player.streak")}</span>
            </div>

            <fieldset className="player-complete__mood">
              <legend>{t("player.moodAfter")}</legend>
              <div className="mood-picker mood-picker--dark">
                {moods.map((mood) => (
                  <button
                    key={mood.id}
                    type="button"
                    className={`mood-pill${moodAfter === mood.id ? " is-selected" : ""}`}
                    style={{ ["--mood-color" as string]: mood.color }}
                    aria-pressed={moodAfter === mood.id}
                    onClick={() => setMoodAfter(mood.id)}
                  >
                    <span className="mood-pill__dot" aria-hidden="true" />
                    {pick(mood.label)}
                  </button>
                ))}
              </div>
            </fieldset>

            <label className="field player-complete__note">
              <span className="label">{t("player.note")}</span>
              <textarea
                className="textarea"
                value={note}
                onChange={(event) => setNote(event.target.value)}
                placeholder={t("player.notePlaceholder")}
                rows={3}
              />
            </label>

            {activeMood && (
              <p className="player-complete__mood-note">{pick(activeMood.hint)}.</p>
            )}

            <div className="player-complete__actions">
              <button type="button" className="btn btn--light" onClick={closeCompleted}>
                {t("player.save")}
              </button>
              <button type="button" className="btn btn--ghost btn--ghost-light" onClick={replay}>
                <RotateCcw size={15} />
                {t("player.replay")}
              </button>
            </div>
            {nextSession && (
              <Link to={`/app/practice/${nextSession.id}`} className="player-complete__next">
                {t("player.next")}: {pick(nextSession.title)}
                <ArrowRight size={14} />
              </Link>
            )}
          </div>
        </main>
      )}

      <Modal
        open={mixerOpen}
        onClose={() => setMixerOpen(false)}
        title={t("player.mix")}
        closeLabel={t("common.close")}
        size="md"
        tone="light"
      >
        <p className="modal__intro">{t("player.mixerHint")}</p>
        <div className="mixer">
          {soundLayers.map((layer) => {
            const current = mix.find((item) => item.id === layer.id)?.volume ?? 0;
            return (
              <div key={layer.id} className={`mixer__row${current > 0.001 ? " is-on" : ""}`}>
                <div className="mixer__label">
                  <strong>{pick(layer.name)}</strong>
                  <span>{pick(layer.description)}</span>
                </div>
                <RangeField
                  label={pick(layer.name)}
                  value={current}
                  onChange={(value) => setLayer(layer.id, value)}
                  format={(value) => `${Math.round(value * 100)}`}
                  className="mixer__range"
                />
              </div>
            );
          })}
        </div>
        <RangeField
          label={t("player.volume")}
          value={data.settings.ambientVolume}
          onChange={(value) => updateSettings({ ambientVolume: value })}
          format={(value) => `${Math.round(value * 100)}%`}
          className="mixer__master"
          tone="light"
        />
      </Modal>

      <Modal
        open={transcriptOpen}
        onClose={() => setTranscriptOpen(false)}
        title={t("player.transcript")}
        closeLabel={t("common.close")}
        size="md"
        tone="light"
      >
        <ol className="transcript">
          {steps.map((item, index) => (
            <li key={index} className={index === stepIndex ? "is-current" : ""}>
              <button type="button" onClick={() => goToStep(index)}>
                <span className="transcript__index">{String(index + 1).padStart(2, "0")}</span>
                <span className="transcript__text">{pick(item.text)}</span>
                <span className="transcript__time">{formatClock(item.seconds)}</span>
              </button>
            </li>
          ))}
        </ol>
      </Modal>

      <Modal
        open={leaveOpen}
        onClose={() => setLeaveOpen(false)}
        title={t("player.leaveTitle")}
        closeLabel={t("common.close")}
        size="sm"
      >
        <p className="modal__intro">{t("player.leaveBody")}</p>
        <div className="modal__actions">
          <button type="button" className="btn btn--ghost" onClick={() => setLeaveOpen(false)}>
            {t("player.stay")}
          </button>
          <button type="button" className="btn" onClick={() => navigate("/app/library")}>
            {t("player.leave")}
          </button>
        </div>
      </Modal>

      <div className="player__corner" aria-hidden="true">
        <Waves size={14} />
        <span>marea</span>
      </div>
    </div>
  );
}
