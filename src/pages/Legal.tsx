import { Link } from "react-router-dom";
import { BookOpen, Heart, Lock, Mail, ShieldCheck, Waves } from "lucide-react";
import { useI18n } from "../i18n/I18nProvider";
import { usePageMeta } from "../lib/usePageMeta";
import { Logo } from "../components/Logo";
import { SceneArt } from "../components/SceneArt";
import type { Lang } from "../data/types";

/**
 * Plain-language legal summary. The short text lives here (not the i18n
 * dictionary) because legal copy is long-form documentation, not UI microcopy.
 */
const sections: Array<{
  id: string;
  icon: typeof Lock;
  title: Record<Lang, string>;
  body: Record<Lang, string[]>;
}> = [
  {
    id: "privacy",
    icon: Lock,
    title: { en: "Privacy", es: "Privacidad" },
    body: {
      en: [
        "Marea has no accounts, no analytics and no advertising pixels. We never collect or receive your personal data, because there is nothing to collect: everything you write and every minute you practise lives only in your own browser storage on your own device.",
        "Your journal entries, mood check-ins, practice history and preferences are saved locally. You can export all of it as a JSON file, or erase it completely, from Settings at any time.",
        "Nothing is uploaded to a server. There is no server that could store it.",
      ],
      es: [
        "Marea no tiene cuentas, ni analíticas, ni píxeles publicitarios. No recogemos ni recibimos tus datos personales, porque no hay nada que recoger: todo lo que escribes y cada minuto que practicas vive solo en el almacenamiento de tu navegador, en tu dispositivo.",
        "Tu diario, tus estados de ánimo, tu historial de prácticas y tus preferencias se guardan localmente. Puedes exportarlo todo como archivo JSON o borrarlo por completo desde Ajustes, en cualquier momento.",
        "Nada se envía a un servidor. No existe un servidor que pudiera guardarlo.",
      ],
    },
  },
  {
    id: "terms",
    icon: BookOpen,
    title: { en: "Using Marea", es: "Uso de Marea" },
    body: {
      en: [
        "Marea is an independent concept product with original content. It is not affiliated with, endorsed by, or derived from any other meditation or wellness brand.",
        "The application code is open source under the MIT licence: you may use, study, modify and redistribute it. Marea's name as published, its visual identity and its written practices are the work of this project and remain associated with it.",
        "Marea is free of charge while it is in early access. If paid plans or donations are ever introduced, they will always be optional.",
      ],
      es: [
        "Marea es un producto conceptual independiente con contenido original. No está afiliada, avalada ni derivada de ninguna otra marca de meditación o bienestar.",
        "El código de la aplicación es de código abierto bajo licencia MIT: puedes usarlo, estudiarlo, modificarlo y redistribuirlo. El nombre de Marea tal como se publica, su identidad visual y sus prácticas escritas son obra de este proyecto y permanecen asociadas a él.",
        "Marea es gratuita mientras esté en acceso anticipado. Si algún día se introducen planes de pago o donaciones, siempre serán opcionales.",
      ],
    },
  },
  {
    id: "wellbeing",
    icon: Heart,
    title: { en: "A note on wellbeing", es: "Una nota sobre tu bienestar" },
    body: {
      en: [
        "Marea's practices are designed to support rest, breath and attention. They are not medical or mental-health treatment, and nothing here should read as clinical advice.",
        "If you are living with a health condition, or if your distress feels heavy, please speak with a qualified professional. Marea works alongside care; it never replaces it.",
        "If you are in crisis, contact your local emergency service or the crisis line available in your country.",
      ],
      es: [
        "Las prácticas de Marea están pensadas para acompañar el descanso, la respiración y la atención. No son un tratamiento médico ni de salud mental, y nada aquí debe leerse como consejo clínico.",
        "Si convives con una condición de salud, o si tu malestar se siente pesado, habla con un profesional cualificado. Marea acompaña el cuidado; nunca lo sustituye.",
        "Si estás en crisis, contacta con tu servicio de emergencias local o con la línea de crisis disponible en tu país.",
      ],
    },
  },
  {
    id: "contact",
    icon: Mail,
    title: { en: "Contact", es: "Contacto" },
    body: {
      en: [
        "Questions, corrections or a request to exercise any right over your own data, write to: urbinaasesoriaeinversiones@gmail.com",
        "There is nothing to request, because nothing leaves your device — but the door is open.",
      ],
      es: [
        "Preguntas, correcciones o cualquier petición sobre tus datos, escríbenos a: urbinaasesoriaeinversiones@gmail.com",
        "No hay nada que solicitar, porque nada sale de tu dispositivo — pero la puerta está abierta.",
      ],
    },
  },
];

function pick(lang: Lang, value: Record<Lang, string>) {
  return value[lang];
}

export function Legal() {
  const { lang, t } = useI18n();

  usePageMeta({
    title: `${t("legal.title")} · Marea`,
    description: lang === "es"
      ? "Privacidad local, condiciones de uso y notas de bienestar de Marea. Sin cuentas, sin anuncios, sin rastreo."
      : "Marea's local-first privacy, terms of use and wellbeing notes. No accounts, no ads, no tracking.",
  });

  return (
    <div className="legal">
      <div className="legal__banner">
        <div className="legal__banner-art" aria-hidden="true">
          <SceneArt variant="dawn" />
        </div>
        <div className="legal__banner-scrim" aria-hidden="true" />
        <div className="container legal__banner-inner">
          <Logo to="/" tone="light" />
          <span className="eyebrow eyebrow--light">
            <Waves size={13} /> {t("legal.eyebrow")}
          </span>
          <h1 className="display display--light">{t("legal.title")}</h1>
          <p className="legal__banner-lede">{t("legal.lede")}</p>
        </div>
      </div>

      <main id="main" className="container legal__main">
        <article className="legal__intro">
          <p>
            {pick(lang, {
              en: "Plain words, no boilerplate. This page explains what data Marea keeps (none, beyond your device), what this product is, and where its responsibilities end. Last updated: October 2026.",
              es: "Palabras claras, sin letra pequeña. Esta página explica qué datos guarda Marea (ninguno más allá de tu dispositivo), qué es este producto y dónde terminan sus responsabilidades. Última actualización: octubre de 2026.",
            })}
          </p>
        </article>

        {sections.map((section) => {
          const Icon = section.icon;
          return (
            <section key={section.id} className="legal__section" id={section.id} aria-labelledby={`legal-${section.id}`}>
              <h2 id={`legal-${section.id}`}>
                <span className="legal__section-icon">
                  <Icon size={17} />
                </span>
                {pick(lang, section.title)}
              </h2>
              {section.body[lang].map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </section>
          );
        })}

        <div className="legal__footnote">
          <ShieldCheck size={15} />
          <span>
            {pick(lang, {
              en: "Short version: what you practise and what you write stays with you. Marea has no way of seeing it.",
              es: "En resumen: lo que practicas y lo que escribes se queda contigo. Marea no tiene forma de verlo.",
            })}
          </span>
        </div>

        <div className="legal__back">
          <Link to="/" className="btn btn--ghost">
            ← {t("common.goHome")}
          </Link>
        </div>
      </main>

      <footer className="legal__foot">
        <div className="container">
          <p>{t("footer.note")}</p>
          <p>{t("footer.medical")}</p>
        </div>
      </footer>
    </div>
  );
}
