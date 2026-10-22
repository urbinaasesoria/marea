import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Compass,
  Flower2,
  Heart,
  Moon,
  Play,
  Sparkles,
  Volume2,
  Waves,
} from "lucide-react";
import { useI18n } from "../i18n/I18nProvider";
import { useStore } from "../store/StoreProvider";
import { usePageMeta } from "../lib/usePageMeta";
import { useVoices } from "../lib/useVoices";
import { previewVoice } from "../lib/speech";
import { SceneArt } from "../components/SceneArt";
import { Logo } from "../components/Logo";
import { useToast } from "../components/ToastProvider";
import type { Lang, Level } from "../data/types";
import type { TranslationKey } from "../i18n/en";

const intentions: Array<{ id: string; key: TranslationKey; icon: typeof Waves }> = [
  { id: "calm", key: "onboarding.intention.calm", icon: Waves },
  { id: "sleep", key: "onboarding.intention.sleep", icon: Moon },
  { id: "focus", key: "onboarding.intention.focus", icon: Compass },
  { id: "anxiety", key: "onboarding.intention.anxiety", icon: Heart },
  { id: "kindness", key: "onboarding.intention.kindness", icon: Flower2 },
  { id: "explore", key: "onboarding.intention.explore", icon: Sparkles },
];

const levels: Array<{ id: Level; key: TranslationKey; sessions: string }> = [
  { id: "beginner", key: "onboarding.level.beginner", sessions: "2–5 min" },
  { id: "all", key: "onboarding.level.some", sessions: "5–10 min" },
  { id: "intermediate", key: "onboarding.level.experienced", sessions: "10–20 min" },
];

const totalSteps = 5;

export function Onboarding() {
  const { t, lang, setLang } = useI18n();
  const { data, completeOnboarding, updateSettings } = useStore();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [intention, setIntention] = useState(data.profile.intention || "calm");
  const [level, setLevel] = useState<Level>(data.profile.level);
  const [name, setName] = useState(data.profile.name);
  const [voiceURI, setVoiceURI] = useState(data.settings.voiceURI);
  const { voices, hasVoices, supported } = useVoices(lang);

  usePageMeta({
    title: `${t("onboarding.welcome")} · Marea`,
    description: t("onboarding.welcomeBody"),
    noIndex: true,
  });

  const finish = (skipped = false) => {
    completeOnboarding({
      name,
      intention,
      level,
      language: lang,
    });
    updateSettings({ voiceURI });
    navigate("/app", { replace: true });
    if (skipped) toast(t("onboarding.readyBody"));
  };

  const chooseLanguage = (next: Lang) => {
    setLang(next);
  };

  const preview = () => {
    const ok = previewVoice(
      t("app.settings.sample"),
      lang,
      voiceURI,
      data.settings.speechRate,
    );
    if (!ok) toast(t("toast.voiceUnavailable"), "error");
  };

  const next = () => {
    if (step < totalSteps - 1) setStep((current) => current + 1);
    else finish();
  };

  const back = () => setStep((current) => Math.max(0, current - 1));

  return (
    <div className="onboarding">
      <aside className="onboarding__art">
        <div className="onboarding__scene" aria-hidden="true">
          <SceneArt variant={step < 2 ? "dawn" : step < 4 ? "meadow" : "night"} />
        </div>
        <div className="onboarding__scrim" aria-hidden="true" />
        <div className="onboarding__art-top">
          <Logo to="/" tone="light" />
        </div>
        <div className="onboarding__art-body">
          <span className="eyebrow">{t("brand.tagline")}</span>
          <blockquote>
            {step === 0 && t("onboarding.welcomeBody")}
            {step === 1 && t("onboarding.intentionBody")}
            {step === 2 && t("onboarding.levelBody")}
            {step === 3 && t("onboarding.nameBody")}
            {step === 4 && t("onboarding.voiceBody")}
          </blockquote>
          <div className="onboarding__dots" aria-hidden="true">
            {Array.from({ length: totalSteps }, (_, index) => (
              <span key={index} className={index <= step ? "is-on" : ""} />
            ))}
          </div>
        </div>
        <p className="onboarding__art-foot">{t("footer.note")}</p>
      </aside>

      <main id="main" className="onboarding__panel">
        <div className="onboarding__top">
          <span className="onboarding__step">
            {t("onboarding.step")} {step + 1} / {totalSteps}
          </span>
          <button type="button" className="onboarding__skip" onClick={() => finish(true)}>
            {t("onboarding.skip")}
          </button>
        </div>

        <div className="onboarding__progress" aria-hidden="true">
          <span style={{ width: `${((step + 1) / totalSteps) * 100}%` }} />
        </div>

        <div className="onboarding__content">
          {step === 0 && (
            <section>
              <p className="eyebrow">{t("onboarding.welcome")}</p>
              <h1 className="display">{t("onboarding.languageTitle")}</h1>
              <p className="onboarding__lede">{t("onboarding.languageBody")}</p>

              <div className="onboarding__languages">
                <button
                  type="button"
                  className={`onboarding__language${lang === "en" ? " is-active" : ""}`}
                  aria-pressed={lang === "en"}
                  onClick={() => chooseLanguage("en")}
                >
                  <span className="onboarding__language-code">EN</span>
                  <strong>English</strong>
                  <p>Breathe. Come home to yourself.</p>
                  {lang === "en" && (
                    <span className="onboarding__check">
                      <Check size={13} />
                    </span>
                  )}
                </button>
                <button
                  type="button"
                  className={`onboarding__language${lang === "es" ? " is-active" : ""}`}
                  aria-pressed={lang === "es"}
                  onClick={() => chooseLanguage("es")}
                >
                  <span className="onboarding__language-code">ES</span>
                  <strong>Español</strong>
                  <p>Respira. Vuelve a ti.</p>
                  {lang === "es" && (
                    <span className="onboarding__check">
                      <Check size={13} />
                    </span>
                  )}
                </button>
              </div>

              <p className="onboarding__micro">
                <Sparkles size={14} /> {t("onboarding.welcomeBody")}
              </p>
            </section>
          )}

          {step === 1 && (
            <section>
              <p className="eyebrow">{t("onboarding.step")} 2</p>
              <h1 className="display">{t("onboarding.intentionTitle")}</h1>
              <p className="onboarding__lede">{t("onboarding.intentionBody")}</p>
              <div className="onboarding__options">
                {intentions.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      className={`onboarding__option${intention === item.id ? " is-active" : ""}`}
                      aria-pressed={intention === item.id}
                      onClick={() => setIntention(item.id)}
                    >
                      <span className="onboarding__option-icon">
                        <Icon size={18} />
                      </span>
                      <span>{t(item.key)}</span>
                      {intention === item.id && <Check size={14} className="onboarding__option-check" />}
                    </button>
                  );
                })}
              </div>
            </section>
          )}

          {step === 2 && (
            <section>
              <p className="eyebrow">{t("onboarding.step")} 3</p>
              <h1 className="display">{t("onboarding.levelTitle")}</h1>
              <p className="onboarding__lede">{t("onboarding.levelBody")}</p>
              <div className="onboarding__levels">
                {levels.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    className={`onboarding__level${level === item.id ? " is-active" : ""}`}
                    aria-pressed={level === item.id}
                    onClick={() => setLevel(item.id)}
                  >
                    <span className="onboarding__level-dot" aria-hidden="true" />
                    <span>
                      <strong>{t(item.key)}</strong>
                      <small>{item.sessions}</small>
                    </span>
                    {level === item.id && <Check size={15} />}
                  </button>
                ))}
              </div>
              <div className="onboarding__note">
                <Waves size={16} />
                <p>{t("app.breathe.note")}</p>
              </div>
            </section>
          )}

          {step === 3 && (
            <section>
              <p className="eyebrow">{t("onboarding.step")} 4</p>
              <h1 className="display">{t("onboarding.nameTitle")}</h1>
              <p className="onboarding__lede">{t("onboarding.nameBody")}</p>
              <label className="field onboarding__name">
                <span className="label">{t("onboarding.namePlaceholder")}</span>
                <input
                  className="input input--large"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder={t("onboarding.namePlaceholder")}
                  maxLength={40}
                  autoFocus
                  autoComplete="given-name"
                />
              </label>
              <div className="onboarding__name-hint">
                <Heart size={15} />
                <span>{name.trim() ? `${t("app.greeting.morning")}, ${name.trim()}.` : t("app.greeting.anon")}</span>
              </div>
            </section>
          )}

          {step === 4 && (
            <section>
              <p className="eyebrow">{t("onboarding.step")} 5</p>
              <h1 className="display">{t("onboarding.voiceTitle")}</h1>
              <p className="onboarding__lede">{t("onboarding.voiceBody")}</p>

              <div className="onboarding__voices">
                <label
                  className={`onboarding__voice${voiceURI === "" ? " is-active" : ""}`}
                >
                  <input
                    type="radio"
                    name="voice"
                    value=""
                    checked={voiceURI === ""}
                    onChange={() => setVoiceURI("")}
                  />
                  <span>
                    <strong>{t("app.settings.noVoice")}</strong>
                    <small>{t("app.settings.voiceNote")}</small>
                  </span>
                  {voiceURI === "" && <Check size={15} />}
                </label>
                {supported &&
                  hasVoices &&
                  voices.slice(0, 5).map((voice) => (
                    <label
                      key={voice.voiceURI}
                      className={`onboarding__voice${voiceURI === voice.voiceURI ? " is-active" : ""}`}
                    >
                      <input
                        type="radio"
                        name="voice"
                        value={voice.voiceURI}
                        checked={voiceURI === voice.voiceURI}
                        onChange={() => setVoiceURI(voice.voiceURI)}
                      />
                      <span>
                        <strong>{voice.name}</strong>
                        <small>{voice.lang}</small>
                      </span>
                      {voiceURI === voice.voiceURI && <Check size={15} />}
                    </label>
                  ))}
              </div>

              <div className="onboarding__preview">
                <button type="button" className="btn btn--ghost" onClick={preview}>
                  <Play size={14} fill="currentColor" />
                  {t("onboarding.preview")}
                </button>
                <span className="tiny muted">
                  <Volume2 size={13} /> {t("app.settings.voiceNote")}
                </span>
              </div>
            </section>
          )}
        </div>

        <div className="onboarding__foot">
          <button
            type="button"
            className="btn btn--ghost"
            onClick={back}
            disabled={step === 0}
          >
            <ArrowLeft size={15} />
            {t("onboarding.back")}
          </button>
          <button type="button" className="btn btn--coral" onClick={next}>
            {step === totalSteps - 1 ? t("onboarding.begin") : t("onboarding.next")}
            {step === totalSteps - 1 ? <Sparkles size={15} /> : <ArrowRight size={15} />}
          </button>
        </div>

        <p className="onboarding__privacy">
          {t("footer.note")} · {t("landing.privacy.point1")}
        </p>
      </main>
    </div>
  );
}
