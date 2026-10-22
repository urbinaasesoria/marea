import type { Mood } from "./types";

export const moods: Mood[] = [
  {
    id: "heavy",
    color: "#6f6480",
    sessions: ["rainy-reset", "self-kindness", "anxiety-sos"],
    label: { en: "Heavy", es: "Pesado" },
    hint: { en: "Low, tired, weighed down", es: "Bajo, cansado, con peso" },
  },
  {
    id: "tender",
    color: "#c98f6a",
    sessions: ["self-kindness", "ocean-breath", "evening-release"],
    label: { en: "Tender", es: "Sensible" },
    hint: { en: "Fragile, emotional, open", es: "Frágil, emocional, abierto" },
  },
  {
    id: "steady",
    color: "#2c7a70",
    sessions: ["morning-tide", "focus-primer", "walking"],
    label: { en: "Steady", es: "Estable" },
    hint: { en: "Okay, neutral, grounded", es: "Bien, neutro, con los pies en la tierra" },
  },
  {
    id: "light",
    color: "#c8a24a",
    sessions: ["gratitude-glow", "ocean-breath", "focus-rain"],
    label: { en: "Light", es: "Ligero" },
    hint: { en: "Curious, open, awake", es: "Curioso, abierto, despierto" },
  },
  {
    id: "radiant",
    color: "#de6a4a",
    sessions: ["gratitude-glow", "walking", "courage-speak"],
    label: { en: "Radiant", es: "Radiante" },
    hint: { en: "Warm, alive, expansive", es: "Cálido, vivo, expansivo" },
  },
];

export const moodById = new Map(moods.map((mood) => [mood.id, mood]));
