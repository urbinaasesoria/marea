import type { Localized } from "./types";

export const journalPrompts: Localized[] = [
  {
    en: "What is one thing I am carrying that is not mine to carry?",
    es: "¿Cuál es una cosa que estoy cargando que no me corresponde cargar?",
  },
  {
    en: "Where in my body did I feel most at ease today?",
    es: "¿En qué parte de mi cuerpo me sentí más a gusto hoy?",
  },
  {
    en: "What would I say to a friend who had my exact day?",
    es: "¿Qué le diría a un amigo que hubiera tenido exactamente mi día?",
  },
  {
    en: "What is one small thing I want to remember from this week?",
    es: "¿Cuál es una cosa pequeña que quiero recordar de esta semana?",
  },
  {
    en: "What am I avoiding, and what is the kindest next step?",
    es: "¿Qué estoy evitando y cuál es el siguiente paso más amable?",
  },
  {
    en: "When did I feel most like myself today?",
    es: "¿Cuándo me sentí más yo mismo hoy?",
  },
  {
    en: "What do I need more of, and what can wait?",
    es: "¿De qué necesito más y qué puede esperar?",
  },
  {
    en: "What is a boundary I want to practice this week?",
    es: "¿Cuál es un límite que quiero practicar esta semana?",
  },
  {
    en: "What did my body ask for today that I ignored?",
    es: "¿Qué me pidió el cuerpo hoy que ignoré?",
  },
  {
    en: "What is one thing I am proud of that no one else noticed?",
    es: "¿De qué estoy orgulloso que nadie más notó?",
  },
  {
    en: "What would a slower version of this day have looked like?",
    es: "¿Cómo habría sido una versión más lenta de este día?",
  },
  {
    en: "Who or what made me feel less alone recently?",
    es: "¿Quién o qué me hizo sentir menos solo recientemente?",
  },
  {
    en: "What am I ready to put down before the week ends?",
    es: "¿Qué estoy listo para soltar antes de que termine la semana?",
  },
  {
    en: "What is one ordinary thing I want to savour tomorrow?",
    es: "¿Cuál es una cosa cotidiana que quiero saborear mañana?",
  },
];

export const reflectionQuotes: Localized[] = [
  {
    en: "You do not have to earn your rest.",
    es: "No tienes que ganarte el descanso.",
  },
  {
    en: "Attention is the rarest form of generosity.",
    es: "La atención es la forma más rara de generosidad.",
  },
  {
    en: "The breath is always happening. You are allowed to join it.",
    es: "La respiración siempre está ocurriendo. Tienes permiso de unirte a ella.",
  },
  {
    en: "A slower day is still a full day.",
    es: "Un día más lento sigue siendo un día completo.",
  },
  {
    en: "You can be a work in progress and still be enough.",
    es: "Puedes ser una obra en proceso y seguir siendo suficiente.",
  },
  {
    en: "What you practise, you become a little more of.",
    es: "Aquello que practicas se convierte un poco más en ti.",
  },
  {
    en: "There is no perfect way to be here. Only this way.",
    es: "No hay una forma perfecta de estar aquí. Solo esta forma.",
  },
  {
    en: "The mind wanders. The returning is the practice.",
    es: "La mente se va. El regreso es la práctica.",
  },
  {
    en: "Rest is not a reward. It is a requirement.",
    es: "El descanso no es un premio. Es una necesidad.",
  },
  {
    en: "Small moments, held with attention, become a life.",
    es: "Los momentos pequeños, sostenidos con atención, se convierten en una vida.",
  },
  {
    en: "You are allowed to be both a masterpiece and a work in progress.",
    es: "Tienes permiso de ser a la vez una obra maestra y una obra en proceso.",
  },
  {
    en: "Let the day be enough.",
    es: "Deja que el día sea suficiente.",
  },
];

export const dailyQuote = (dayOfYear: number): Localized =>
  reflectionQuotes[dayOfYear % reflectionQuotes.length];
