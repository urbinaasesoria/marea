import { useEffect, useState } from "react";
import {
  BellRing,
  Check,
  Download,
  Eye,
  Globe2,
  Info,
  Languages,
  Mic2,
  MonitorSmartphone,
  ShieldCheck,
  Smartphone,
  Trash2,
  Volume2,
  Waves,
} from "lucide-react";
import { useI18n } from "../i18n/I18nProvider";
import { useStore } from "../store/StoreProvider";
import { usePageMeta } from "../lib/usePageMeta";
import { useVoices } from "../lib/useVoices";
import { previewVoice, voiceName } from "../lib/speech";
import { soundPresets } from "../data/soundscapes";
import { RangeField } from "../components/RangeField";
import { Modal } from "../components/Modal";
import { useToast } from "../components/ToastProvider";
import { LanguageToggle } from "../components/LanguageToggle";

interface InstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const sections = [
  { id: "language", labelKey: "app.settings.language", icon: Languages },
  { id: "voice", labelKey: "app.settings.voice", icon: Mic2 },
  { id: "sound", labelKey: "app.settings.audio", icon: Waves },
  { id: "accessibility", labelKey: "app.settings.accessibility", icon: Eye },
  { id: "data", labelKey: "app.settings.data", icon: ShieldCheck },
  { id: "about", labelKey: "app.settings.about", icon: Info },
] as const;

export function Settings() {
  const { t, pick, lang, setLang } = useI18n();
  const { data, updateSettings, exportAll, resetAll } = useStore();
  const { toast } = useToast();
  const { voices, hasVoices, supported } = useVoices(lang);
  const [resetOpen, setResetOpen] = useState(false);
  const [installEvent, setInstallEvent] = useState<InstallPromptEvent | null>(null);
  const [standalone, setStandalone] = useState(false);

  usePageMeta({
    title: `${t("app.settings.title")} · Marea`,
    description: t("app.settings.sub"),
  });

  useEffect(() => {
    const onPrompt = (event: Event) => {
      event.preventDefault();
      setInstallEvent(event as InstallPromptEvent);
    };
    window.addEventListener("beforeinstallprompt", onPrompt);
    setStandalone(window.matchMedia?.("(display-mode: standalone)").matches ?? false);
    return () => window.removeEventListener("beforeinstallprompt", onPrompt);
  }, []);

  const preview = () => {
    const ok = previewVoice(
      t("app.settings.sample"),
      lang,
      data.settings.voiceURI,
      data.settings.speechRate,
    );
    if (!ok) toast(t("toast.voiceUnavailable"), "error");
  };

  const install = async () => {
    if (!installEvent) {
      toast(t("app.settings.installReady"));
      return;
    }
    await installEvent.prompt();
    const choice = await installEvent.userChoice;
    if (choice.outcome === "accepted") {
      setStandalone(true);
      setInstallEvent(null);
    }
  };

  const exportData = () => {
    exportAll();
    toast(t("app.settings.exported"), "success");
  };

  const doReset = () => {
    resetAll();
    setResetOpen(false);
    toast(t("app.settings.resetDone"), "success");
  };

  return (
    <div className="page settings-page">
      <header className="page-head">
        <div>
          <p className="eyebrow">{t("nav.settings")}</p>
          <h1 className="display page-title">{t("app.settings.title")}</h1>
          <p className="page-lede">{t("app.settings.sub")}</p>
        </div>
        <span className="page-head__count">
          <ShieldCheck size={18} />
          <span>{t("landing.privacy.eyebrow")}</span>
        </span>
      </header>

      <div className="settings-layout">
        <aside className="settings-nav" aria-label={t("app.settings.title")}>
          {sections.map((section) => {
            const Icon = section.icon;
            return (
              <a key={section.id} href={`#${section.id}`}>
                <Icon size={15} />
                {t(section.labelKey)}
              </a>
            );
          })}
          <span className="settings-nav__note">{t("app.settings.version")}</span>
        </aside>

        <div className="settings-content">
          <section id="language" className="settings-card" aria-labelledby="settings-language">
            <div className="settings-card__head">
              <span className="settings-card__icon">
                <Languages size={18} />
              </span>
              <div>
                <h2 id="settings-language">{t("app.settings.language")}</h2>
                <p>{t("app.settings.languageNote")}</p>
              </div>
            </div>
            <div className="settings-row">
              <div className="settings-row__text">
                <strong>{lang === "es" ? t("app.settings.spanish") : t("app.settings.english")}</strong>
                <span>{t("brand.short")}</span>
              </div>
              <LanguageToggle />
            </div>
            <div className="language-mini">
              <button
                type="button"
                className="language-mini__card"
                aria-pressed={lang === "en"}
                onClick={() => setLang("en")}
              >
                <span>EN</span>
                <strong>{t("app.settings.english")}</strong>
                <small>Breathe. Come home to yourself.</small>
              </button>
              <button
                type="button"
                className="language-mini__card"
                aria-pressed={lang === "es"}
                onClick={() => setLang("es")}
              >
                <span>ES</span>
                <strong>{t("app.settings.spanish")}</strong>
                <small>Respira. Vuelve a ti.</small>
              </button>
            </div>
          </section>

          <section id="voice" className="settings-card" aria-labelledby="settings-voice">
            <div className="settings-card__head">
              <span className="settings-card__icon">
                <Mic2 size={18} />
              </span>
              <div>
                <h2 id="settings-voice">{t("app.settings.voice")}</h2>
                <p>{t("app.settings.voiceNote")}</p>
              </div>
            </div>

            {supported && hasVoices ? (
              <label className="field">
                <span className="label">{t("app.settings.voice")}</span>
                <select
                  className="input"
                  value={data.settings.voiceURI}
                  onChange={(event) => updateSettings({ voiceURI: event.target.value })}
                >
                  <option value="">{t("app.settings.noVoice")}</option>
                  {voices.map((voice) => (
                    <option key={voice.voiceURI} value={voice.voiceURI}>
                      {voiceName(voice)}
                    </option>
                  ))}
                </select>
              </label>
            ) : (
              <p className="settings-inline-note">{t("app.settings.noVoice")}</p>
            )}

            <div className="settings-row settings-row--wrap">
              <RangeField
                label={t("app.settings.rate")}
                value={data.settings.speechRate}
                min={0.7}
                max={1.15}
                step={0.01}
                onChange={(value) => updateSettings({ speechRate: value })}
                format={(value) => `${value.toFixed(2)}×`}
                hint={t("app.settings.rateNote")}
                className="settings-range"
              />
              <button type="button" className="btn btn--ghost" onClick={preview}>
                <Volume2 size={15} />
                {t("app.settings.voicePreview")}
              </button>
            </div>

            <div className="settings-row">
              <div className="settings-row__text">
                <strong>{t("app.settings.narration")}</strong>
                <span>{t("app.settings.narrationNote")}</span>
              </div>
              <button
                type="button"
                className={`switch${data.settings.narration ? " is-on" : ""}`}
                role="switch"
                aria-checked={data.settings.narration}
                onClick={() => updateSettings({ narration: !data.settings.narration })}
              >
                <span className="switch__dot" aria-hidden="true" />
              </button>
            </div>
          </section>

          <section id="sound" className="settings-card" aria-labelledby="settings-sound">
            <div className="settings-card__head">
              <span className="settings-card__icon">
                <Waves size={18} />
              </span>
              <div>
                <h2 id="settings-sound">{t("app.settings.audio")}</h2>
                <p>{t("landing.sound.lede")}</p>
              </div>
            </div>

            <div className="settings-two-ranges">
              <RangeField
                label={t("app.settings.ambient")}
                value={data.settings.ambientVolume}
                onChange={(value) => updateSettings({ ambientVolume: value })}
                format={(value) => `${Math.round(value * 100)}%`}
              />
              <RangeField
                label={t("app.settings.chime")}
                value={data.settings.chimeVolume}
                onChange={(value) => updateSettings({ chimeVolume: value })}
                format={(value) => `${Math.round(value * 100)}%`}
              />
            </div>

            <label className="field">
              <span className="label">{t("app.settings.defaultSound")}</span>
              <select
                className="input"
                value={data.settings.defaultSoundscape}
                onChange={(event) => updateSettings({ defaultSoundscape: event.target.value })}
              >
                {soundPresets.map((preset) => (
                  <option key={preset.id} value={preset.id}>
                    {pick(preset.name)}
                  </option>
                ))}
              </select>
            </label>

            <RangeField
              label={t("app.settings.sleepFade")}
              value={data.settings.sleepFade}
              min={5}
              max={120}
              step={5}
              onChange={(value) => updateSettings({ sleepFade: value })}
              format={(value) => `${value} s`}
              hint={t("app.settings.sleepFadeNote")}
            />
          </section>

          <section id="accessibility" className="settings-card" aria-labelledby="settings-access">
            <div className="settings-card__head">
              <span className="settings-card__icon">
                <Eye size={18} />
              </span>
              <div>
                <h2 id="settings-access">{t("app.settings.accessibility")}</h2>
                <p>{t("landing.feature.6.body")}</p>
              </div>
            </div>

            <div className="settings-row">
              <div className="settings-row__text">
                <strong>{t("app.settings.reduceMotion")}</strong>
                <span>{t("app.settings.reduceMotionNote")}</span>
              </div>
              <button
                type="button"
                className={`switch${data.settings.reduceMotion ? " is-on" : ""}`}
                role="switch"
                aria-checked={data.settings.reduceMotion}
                onClick={() => updateSettings({ reduceMotion: !data.settings.reduceMotion })}
              >
                <span className="switch__dot" aria-hidden="true" />
              </button>
            </div>

            <div className="settings-row">
              <div className="settings-row__text">
                <strong>{t("app.settings.contrast")}</strong>
                <span>{t("app.settings.contrastNote")}</span>
              </div>
              <button
                type="button"
                className={`switch${data.settings.highContrast ? " is-on" : ""}`}
                role="switch"
                aria-checked={data.settings.highContrast}
                onClick={() => updateSettings({ highContrast: !data.settings.highContrast })}
              >
                <span className="switch__dot" aria-hidden="true" />
              </button>
            </div>

            <div className="settings-row settings-row--stack">
              <div className="settings-row__text">
                <strong>{t("app.settings.font")}</strong>
                <span>{t("app.settings.fontNormal")} · {t("app.settings.fontLarge")}</span>
              </div>
              <div className="segmented">
                {(
                  [
                    ["normal", "app.settings.fontNormal"],
                    ["large", "app.settings.fontLarge"],
                    ["xlarge", "app.settings.fontXLarge"],
                  ] as const
                ).map(([value, key]) => (
                  <button
                    key={value}
                    type="button"
                    aria-pressed={data.settings.fontScale === value}
                    onClick={() => updateSettings({ fontScale: value })}
                  >
                    {t(key)}
                  </button>
                ))}
              </div>
            </div>

            <div className="a11y-note">
              <Globe2 size={16} />
              <p>{t("landing.privacy.point4")}</p>
            </div>
          </section>

          <section id="data" className="settings-card" aria-labelledby="settings-data">
            <div className="settings-card__head">
              <span className="settings-card__icon">
                <ShieldCheck size={18} />
              </span>
              <div>
                <h2 id="settings-data">{t("app.settings.data")}</h2>
                <p>{t("app.settings.exportNote")}</p>
              </div>
            </div>

            <div className="settings-data-row">
              <div className="settings-row__text">
                <strong>{t("app.settings.export")}</strong>
                <span>{t("app.settings.exportNote")}</span>
              </div>
              <button type="button" className="btn btn--ghost" onClick={exportData}>
                <Download size={15} />
                {t("app.settings.export")}
              </button>
            </div>

            <div className="settings-data-row settings-data-row--danger">
              <div className="settings-row__text">
                <strong>{t("app.settings.reset")}</strong>
                <span>{t("app.settings.resetNote")}</span>
              </div>
              <button type="button" className="btn btn--danger" onClick={() => setResetOpen(true)}>
                <Trash2 size={15} />
                {t("app.settings.reset")}
              </button>
            </div>

            <div className="settings-data-row">
              <div className="settings-row__text">
                <strong>{t("app.settings.install")}</strong>
                <span>{t("app.settings.installNote")}</span>
              </div>
              <button type="button" className="btn btn--ghost" onClick={install} disabled={standalone}>
                {standalone ? <MonitorSmartphone size={15} /> : <Smartphone size={15} />}
                {standalone ? t("app.settings.installed") : t("app.settings.install")}
              </button>
            </div>
          </section>

          <section id="about" className="settings-card settings-about" aria-labelledby="settings-about">
            <div className="settings-card__head">
              <span className="settings-card__icon">
                <Info size={18} />
              </span>
              <div>
                <h2 id="settings-about">{t("app.settings.about")}</h2>
                <p>{t("app.settings.aboutBody")}</p>
              </div>
            </div>

            <div className="about-grid">
              <div>
                <span className="about-grid__label">
                  <Check size={13} /> {t("landing.privacy.point1")}
                </span>
                <span className="about-grid__label">
                  <Check size={13} /> {t("landing.privacy.point2")}
                </span>
                <span className="about-grid__label">
                  <Check size={13} /> {t("landing.privacy.point3")}
                </span>
                <span className="about-grid__label">
                  <Check size={13} /> {t("landing.privacy.point4")}
                </span>
              </div>
              <div className="about-resources">
                <h3>
                  <BellRing size={15} /> {t("app.settings.resources")}
                </h3>
                <p>{t("app.settings.resourcesBody")}</p>
              </div>
            </div>

            <p className="settings-version">
              {t("app.settings.version")} · {t("footer.note")}
            </p>
          </section>
        </div>
      </div>

      <Modal
        open={resetOpen}
        onClose={() => setResetOpen(false)}
        title={t("app.settings.reset")}
        closeLabel={t("common.close")}
        size="sm"
      >
        <p className="modal__intro">{t("app.settings.resetConfirm")}</p>
        <div className="modal__actions">
          <button type="button" className="btn btn--ghost" onClick={() => setResetOpen(false)}>
            {t("common.cancel")}
          </button>
          <button type="button" className="btn btn--danger" onClick={doReset}>
            <Trash2 size={15} />
            {t("app.settings.reset")}
          </button>
        </div>
      </Modal>
    </div>
  );
}
