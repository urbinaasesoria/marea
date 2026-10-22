import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Clock,
  Moon,
  Pause,
  Play,
  Plus,
  Save,
  Trash2,
  Volume2,
  Waves,
} from "lucide-react";
import { useI18n } from "../i18n/I18nProvider";
import { useStore } from "../store/StoreProvider";
import { usePageMeta } from "../lib/usePageMeta";
import { soundLayers, soundPresets } from "../data/soundscapes";
import { sessions } from "../data/sessions";
import { ambientEngine } from "../lib/audio";
import { formatClock } from "../lib/utils";
import { SceneArt } from "../components/SceneArt";
import { RangeField } from "../components/RangeField";
import { Modal } from "../components/Modal";
import { SessionCard } from "../components/SessionCard";
import { useToast } from "../components/ToastProvider";

const timerOptions = [0, 15, 30, 45, 60, 90];

export function Sleep() {
  const { t, pick } = useI18n();
  const { data, updateSettings, completeActivity, saveSoundPreset, deleteSoundPreset } = useStore();
  const { toast } = useToast();
  const [presetId, setPresetId] = useState(
    soundPresets.some((preset) => preset.id === data.settings.defaultSoundscape)
      ? data.settings.defaultSoundscape
      : "soft-rain",
  );
  const [layers, setLayers] = useState<Array<{ id: string; volume: number }>>(
    soundPresets.find((preset) => preset.id === presetId)?.layers ?? [],
  );
  const [playing, setPlaying] = useState(false);
  const [timer, setTimer] = useState(45);
  const [remaining, setRemaining] = useState(45 * 60);
  const [elapsed, setElapsed] = useState(0);
  const [savedOpen, setSavedOpen] = useState(false);
  const [presetName, setPresetName] = useState("");
  const elapsedRef = useRef(0);
  const finishedRef = useRef(false);
  const selected = soundPresets.find((preset) => preset.id === presetId);
  const sleepStories = sessions.filter(
    (session) => session.category === "sleep" && session.kind !== "soundscape",
  );

  usePageMeta({
    title: `${t("app.sleep.title")} · Marea`,
    description: t("app.sleep.sub"),
  });

  useEffect(() => {
    return () => ambientEngine.stop(0.4);
  }, []);

  useEffect(() => {
    if (!playing) return;
    const interval = window.setInterval(() => {
      elapsedRef.current += 1;
      setElapsed(elapsedRef.current);
      if (timer > 0) setRemaining((current) => Math.max(0, current - 1));
    }, 1000);
    return () => window.clearInterval(interval);
  }, [playing, timer]);

  useEffect(() => {
    if (!playing || timer === 0 || remaining > 0) return;
    if (finishedRef.current) return;
    finishedRef.current = true;
    setPlaying(false);
    ambientEngine.fadeOut(data.settings.sleepFade);
    completeActivity({
      sessionId: selected?.id ?? "sleep-soundscape",
      type: "soundscape",
      category: "sleep",
      minutes: timer,
    });
  }, [remaining, playing, timer, data.settings.sleepFade, selected, completeActivity]);

  useEffect(() => {
    if (playing) ambientEngine.setMasterVolume(data.settings.ambientVolume);
  }, [data.settings.ambientVolume, playing]);

  const startWith = (nextLayers: Array<{ id: string; volume: number }>) => {
    finishedRef.current = false;
    elapsedRef.current = 0;
    setElapsed(0);
    setRemaining(timer * 60);
    ambientEngine.start(nextLayers, data.settings.ambientVolume);
    setPlaying(true);
  };

  const togglePlay = () => {
    if (playing) {
      setPlaying(false);
      ambientEngine.stop(1.2);
      if (elapsedRef.current >= 60) {
        completeActivity({
          sessionId: selected?.id ?? "sleep-soundscape",
          type: "soundscape",
          category: "sleep",
          minutes: elapsedRef.current / 60,
        });
      }
    } else {
      startWith(layers);
    }
  };

  const choosePreset = (id: string) => {
    const preset = soundPresets.find((item) => item.id === id);
    if (!preset) return;
    setPresetId(id);
    setLayers(preset.layers);
    updateSettings({ defaultSoundscape: id });
    if (playing) {
      startWith(preset.layers);
    }
  };

  const playSaved = (saved: { id: string; name: string; layers: Array<{ id: string; volume: number }> }) => {
    setLayers(saved.layers);
    setPresetId("");
    startWith(saved.layers);
  };

  const setLayer = (id: string, volume: number) => {
    setLayers((current) => {
      const exists = current.some((layer) => layer.id === id);
      if (exists) return current.map((layer) => (layer.id === id ? { ...layer, volume } : layer));
      return [...current, { id, volume }];
    });
    if (playing) {
      if (volume <= 0.001) ambientEngine.removeLayer(id);
      else {
        ambientEngine.addLayer(id, volume);
        ambientEngine.setLayerVolume(id, volume);
      }
    }
  };

  const chooseTimer = (value: number) => {
    setTimer(value);
    setRemaining(value * 60);
    finishedRef.current = false;
  };

  const submitPreset = () => {
    if (!presetName.trim()) return;
    saveSoundPreset(presetName, layers);
    setPresetName("");
    setSavedOpen(false);
    toast(t("toast.presetSaved"), "success");
  };

  const activeLayers = layers.filter((layer) => layer.volume > 0.001);

  return (
    <div className="page sleep-page">
      <header className="page-head">
        <div>
          <p className="eyebrow">{t("nav.sleep")}</p>
          <h1 className="display page-title">{t("app.sleep.title")}</h1>
          <p className="page-lede">{t("app.sleep.sub")}</p>
        </div>
        <span className="page-head__count">
          <Moon size={18} />
          <span>{playing ? t("app.sleep.playing") : t("app.sleep.ready")}</span>
        </span>
      </header>

      <div className="sleep-grid">
        <section className={`sleep-hero${playing ? " is-playing" : ""}`}>
          <div className="sleep-hero__art" aria-hidden="true">
            <SceneArt variant={selected?.art ?? "night"} />
          </div>
          <div className="sleep-hero__scrim" aria-hidden="true" />
          <div className="sleep-hero__body">
            <span className="eyebrow">{t("app.sleep.hero")}</span>
            <h2>{pick(selected?.name ?? { en: "Your own mix", es: "Tu propia mezcla" })}</h2>
            <p>{t("app.sleep.heroBody")}</p>
            <div className="sleep-hero__timer">
              <Clock size={15} />
              <span className="mono">
                {timer === 0
                  ? formatClock(elapsed)
                  : formatClock(playing ? remaining : timer * 60)}
              </span>
              <span>{timer === 0 ? t("app.sleep.off") : `${timer} ${t("app.sleep.minutes")}`}</span>
            </div>
            <div className="sleep-hero__actions">
              <button type="button" className="btn btn--light" onClick={togglePlay}>
                {playing ? <Pause size={15} fill="currentColor" /> : <Play size={15} fill="currentColor" />}
                {playing ? t("app.sleep.stop") : t("app.sleep.start")}
              </button>
              <button type="button" className="btn btn--ghost btn--ghost-light" onClick={() => setSavedOpen(true)}>
                <Save size={15} />
                {t("landing.sound.save")}
              </button>
            </div>
          </div>
          <div className="sleep-hero__waves" aria-hidden="true">
            {Array.from({ length: 30 }, (_, index) => (
              <span
                key={index}
                style={{
                  height: `${12 + Math.abs(Math.sin(index * 0.62)) * 58}%`,
                  animationDelay: `${index * 55}ms`,
                }}
              />
            ))}
          </div>
        </section>

        <aside className="sleep-timer">
          <h2>{t("app.sleep.timer")}</h2>
          <div className="sleep-timer__options">
            {timerOptions.map((value) => (
              <button
                key={value}
                type="button"
                className="chip"
                aria-pressed={timer === value}
                onClick={() => chooseTimer(value)}
              >
                {value === 0 ? t("app.sleep.off") : `${value} ${t("app.sleep.minutes")}`}
              </button>
            ))}
          </div>

          <RangeField
            label={t("app.sleep.fade")}
            value={data.settings.sleepFade}
            min={5}
            max={120}
            step={5}
            onChange={(value) => updateSettings({ sleepFade: value })}
            format={(value) => `${value} s`}
            hint={t("app.sleep.fadeNote")}
          />

          <div className="sleep-timer__note">
            <Moon size={16} />
            <p>{t("app.sleep.readyBody")}</p>
          </div>
        </aside>
      </div>

      <section className="sleep-presets" aria-labelledby="presets-title">
        <div className="mini-head">
          <h2 id="presets-title">{t("app.sleep.presets")}</h2>
          <span className="tiny muted">{soundPresets.length} soundscapes</span>
        </div>
        <div className="preset-grid">
          {soundPresets.slice(0, 8).map((preset) => (
            <button
              key={preset.id}
              type="button"
              className={`preset-card${presetId === preset.id ? " is-active" : ""}`}
              onClick={() => choosePreset(preset.id)}
              aria-pressed={presetId === preset.id}
            >
              <span className="preset-card__art">
                <SceneArt variant={preset.art} />
                <span className="preset-card__play">
                  <Play size={13} fill="currentColor" />
                </span>
              </span>
              <span className="preset-card__body">
                <strong>{pick(preset.name)}</strong>
                <span>{pick(preset.description)}</span>
              </span>
            </button>
          ))}
        </div>
      </section>

      <div className="sleep-lower">
        <section className="sleep-mixer" aria-labelledby="mixer-title">
          <div className="mini-head">
            <h2 id="mixer-title">{t("app.sleep.mixer")}</h2>
            <button type="button" className="link-arrow" onClick={() => setSavedOpen(true)}>
              <Plus size={14} />
              {t("app.sleep.savePreset")}
            </button>
          </div>
          <div className="sleep-mixer__layers">
            {soundLayers.map((layer) => {
              const value = layers.find((item) => item.id === layer.id)?.volume ?? 0;
              return (
                <div key={layer.id} className={`sleep-layer${value > 0.001 ? " is-on" : ""}`}>
                  <div className="sleep-layer__head">
                    <span className="sleep-layer__icon">
                      <Waves size={14} />
                    </span>
                    <div>
                      <strong>{pick(layer.name)}</strong>
                      <span>{pick(layer.description)}</span>
                    </div>
                    <small>{Math.round(value * 100)}</small>
                  </div>
                  <RangeField
                    label={pick(layer.name)}
                    value={value}
                    onChange={(next) => setLayer(layer.id, next)}
                    format={(next) => `${Math.round(next * 100)}%`}
                  />
                </div>
              );
            })}
          </div>
          <p className="sleep-note">{t("app.sleep.note")}</p>
        </section>

        <aside className="sleep-side">
          <section className="saved-presets" aria-labelledby="saved-title">
            <div className="mini-head">
              <h2 id="saved-title">{t("app.sleep.saved")}</h2>
              <span className="tiny muted">{data.soundPresets.length}</span>
            </div>
            {data.soundPresets.length === 0 ? (
              <p className="saved-empty">{t("app.sleep.noPresets")}</p>
            ) : (
              <ul>
                {data.soundPresets.map((preset) => (
                  <li key={preset.id}>
                    <button type="button" className="saved-row" onClick={() => playSaved(preset)}>
                      <span className="saved-row__play">
                        <Play size={12} fill="currentColor" />
                      </span>
                      <span>
                        <strong>{preset.name}</strong>
                        <small>
                          {preset.layers.length} {t("app.sleep.layers").toLowerCase()}
                        </small>
                      </span>
                    </button>
                    <button
                      type="button"
                      className="icon-quiet"
                      onClick={() => deleteSoundPreset(preset.id)}
                      aria-label={t("common.delete")}
                    >
                      <Trash2 size={14} />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="sleep-mix-summary">
            <span className="eyebrow">{t("landing.sound.mix")}</span>
            <div className="sleep-mix-summary__list">
              {activeLayers.length === 0 ? (
                <span className="muted tiny">—</span>
              ) : (
                activeLayers.map((layer) => {
                  const meta = soundLayers.find((item) => item.id === layer.id);
                  return (
                    <span key={layer.id} className="tag">
                      {meta ? pick(meta.name) : layer.id}
                    </span>
                  );
                })
              )}
            </div>
            <button type="button" className="btn btn--ghost btn--sm" onClick={togglePlay}>
              {playing ? <Pause size={14} /> : <Volume2 size={14} />}
              {playing ? t("app.sleep.stop") : t("app.sleep.start")}
            </button>
          </section>
        </aside>
      </div>

      <section className="sleep-stories" aria-labelledby="stories-title">
        <div className="mini-head">
          <h2 id="stories-title">{t("app.sleep.story")}</h2>
          <Link to="/app/library" className="link-arrow">
            {t("nav.viewAll")}
            <ArrowRight size={14} />
          </Link>
        </div>
        <div className="session-grid session-grid--three">
          {sleepStories.slice(0, 3).map((session) => (
            <SessionCard key={session.id} session={session} />
          ))}
        </div>
      </section>

      <Modal
        open={savedOpen}
        onClose={() => setSavedOpen(false)}
        title={t("app.sleep.savePreset")}
        closeLabel={t("common.close")}
        size="sm"
      >
        <p className="modal__intro">{t("app.sleep.fadeNote")}</p>
        <label className="field">
          <span className="label">{t("app.sleep.presetName")}</span>
          <input
            className="input"
            value={presetName}
            onChange={(event) => setPresetName(event.target.value)}
            placeholder={t("app.sleep.presetPlaceholder")}
            maxLength={32}
            autoFocus
          />
        </label>
        <div className="modal__actions">
          <button type="button" className="btn btn--ghost" onClick={() => setSavedOpen(false)}>
            {t("common.cancel")}
          </button>
          <button
            type="button"
            className="btn"
            onClick={submitPreset}
            disabled={!presetName.trim() || activeLayers.length === 0}
          >
            <Save size={15} />
            {t("common.save")}
          </button>
        </div>
      </Modal>
    </div>
  );
}
