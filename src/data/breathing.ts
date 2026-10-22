import type { BreathPattern } from "./types";

export const breathPatterns: BreathPattern[] = [
  {
    id: "coherent",
    accent: "sea",
    inhale: 5.5,
    holdIn: 0,
    exhale: 5.5,
    holdOut: 0,
    name: { en: "Coherent", es: "Coherente" },
    description: {
      en: "A balanced 5.5-second tide. Steady and easy to follow.",
      es: "Una marea equilibrada de 5,5 segundos. Constante y fácil de seguir.",
    },
  },
  {
    id: "box",
    accent: "plum",
    inhale: 4,
    holdIn: 4,
    exhale: 4,
    holdOut: 4,
    name: { en: "Box", es: "Caja" },
    description: {
      en: "Four equal sides. A simple shape for a busy mind.",
      es: "Cuatro lados iguales. Una forma simple para una mente ocupada.",
    },
  },
  {
    id: "unwind",
    accent: "coral",
    inhale: 4,
    holdIn: 0,
    exhale: 7,
    holdOut: 0,
    name: { en: "Long exhale", es: "Exhalación larga" },
    description: {
      en: "In for four, out for seven. Let the body slow down.",
      es: "Inhala cuatro, exhala siete. Deja que el cuerpo baje el ritmo.",
    },
  },
  {
    id: "calm",
    accent: "gold",
    inhale: 4,
    holdIn: 0,
    exhale: 6,
    holdOut: 2,
    name: { en: "Still water", es: "Agua quieta" },
    description: {
      en: "A four-six rhythm with a small pause at the bottom.",
      es: "Un ritmo de cuatro-seis con una pequeña pausa al final.",
    },
  },
  {
    id: "energy",
    accent: "sea",
    inhale: 3,
    holdIn: 1,
    exhale: 3,
    holdOut: 0,
    name: { en: "Morning light", es: "Luz de la mañana" },
    description: {
      en: "A brighter, quicker rhythm to wake up the body.",
      es: "Un ritmo más luminoso y rápido para despertar el cuerpo.",
    },
  },
];

export const breathById = new Map(breathPatterns.map((pattern) => [pattern.id, pattern]));
