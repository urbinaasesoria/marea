import type { SoundLayer, SoundPreset } from "./types";

export const soundLayers: SoundLayer[] = [
  {
    id: "rain",
    icon: "rain",
    defaultVolume: 0.6,
    name: { en: "Rain", es: "Lluvia" },
    description: { en: "Steady rainfall on a roof", es: "Lluvia constante sobre un tejado" },
  },
  {
    id: "ocean",
    icon: "ocean",
    defaultVolume: 0.6,
    name: { en: "Ocean", es: "Océano" },
    description: { en: "Long waves pulling back", es: "Olas largas que se retiran" },
  },
  {
    id: "forest",
    icon: "forest",
    defaultVolume: 0.5,
    name: { en: "Forest", es: "Bosque" },
    description: { en: "Leaves, birds, distant branches", es: "Hojas, pájaros, ramas lejanas" },
  },
  {
    id: "fire",
    icon: "fire",
    defaultVolume: 0.5,
    name: { en: "Fire", es: "Fuego" },
    description: { en: "A low fire in a quiet room", es: "Un fuego bajo en una habitación tranquila" },
  },
  {
    id: "wind",
    icon: "wind",
    defaultVolume: 0.35,
    name: { en: "Wind", es: "Viento" },
    description: { en: "Air moving through open space", es: "Aire en movimiento por un espacio abierto" },
  },
  {
    id: "night",
    icon: "moon",
    defaultVolume: 0.45,
    name: { en: "Night", es: "Noche" },
    description: { en: "Crickets and a summer breeze", es: "Grillos y una brisa de verano" },
  },
  {
    id: "drone",
    icon: "waves",
    defaultVolume: 0.3,
    name: { en: "Low drone", es: "Zumbido bajo" },
    description: { en: "Warm, almost-still tones", es: "Tonos cálidos, casi quietos" },
  },
  {
    id: "bowl",
    icon: "bowl",
    defaultVolume: 0.4,
    name: { en: "Singing bowl", es: "Cuenco tibetano" },
    description: { en: "Slow strikes with long decay", es: "Toques lentos con largo desvanecimiento" },
  },
];

export const soundPresets: SoundPreset[] = [
  {
    id: "dawn-mist",
    art: "dawn",
    name: { en: "Dawn mist", es: "Bruma del amanecer" },
    description: { en: "Cool air, a distant bowl", es: "Aire fresco, un cuenco lejano" },
    layers: [
      { id: "wind", volume: 0.26 },
      { id: "bowl", volume: 0.16 },
      { id: "drone", volume: 0.1 },
    ],
  },
  {
    id: "still-lake",
    art: "mountain",
    name: { en: "Still lake", es: "Lago quieto" },
    description: { en: "Wide air and low water", es: "Aire amplio y agua profunda" },
    layers: [
      { id: "wind", volume: 0.22 },
      { id: "drone", volume: 0.16 },
    ],
  },
  {
    id: "soft-rain",
    art: "rain",
    name: { en: "Soft rain", es: "Lluvia suave" },
    description: { en: "Rain with a thread of warmth", es: "Lluvia con un hilo de calor" },
    layers: [
      { id: "rain", volume: 0.5 },
      { id: "fire", volume: 0.1 },
    ],
  },
  {
    id: "night-garden-bed",
    art: "night",
    name: { en: "Night garden", es: "Jardín nocturno" },
    description: { en: "Crickets, breeze, moonlight", es: "Grillos, brisa, luz de luna" },
    layers: [
      { id: "night", volume: 0.46 },
      { id: "wind", volume: 0.12 },
    ],
  },
  {
    id: "clear-water",
    art: "sand",
    name: { en: "Clear water", es: "Agua clara" },
    description: { en: "A clean, open sound field", es: "Un campo sonoro limpio y abierto" },
    layers: [
      { id: "drone", volume: 0.2 },
      { id: "bowl", volume: 0.08 },
    ],
  },
  {
    id: "meadow-air",
    art: "meadow",
    name: { en: "Meadow air", es: "Aire de pradera" },
    description: { en: "Grass, wind, a faraway bird", es: "Hierba, viento, un pájaro lejano" },
    layers: [
      { id: "wind", volume: 0.28 },
      { id: "forest", volume: 0.16 },
    ],
  },
  {
    id: "warm-light",
    art: "ember",
    name: { en: "Warm light", es: "Luz cálida" },
    description: { en: "Firelight and a quiet room", es: "Luz de fuego y una habitación tranquila" },
    layers: [
      { id: "fire", volume: 0.36 },
      { id: "drone", volume: 0.1 },
    ],
  },
  {
    id: "tide-breath",
    art: "ocean",
    name: { en: "Tidal breath", es: "Respiración de marea" },
    description: { en: "Waves to breathe with", es: "Olas para respirar" },
    layers: [
      { id: "ocean", volume: 0.44 },
      { id: "wind", volume: 0.12 },
    ],
  },
  {
    id: "afterglow",
    art: "dusk",
    name: { en: "Afterglow", es: "Resplandor" },
    description: { en: "The last light of the day", es: "La última luz del día" },
    layers: [
      { id: "wind", volume: 0.2 },
      { id: "drone", volume: 0.12 },
      { id: "bowl", volume: 0.1 },
    ],
  },
  {
    id: "forest-path",
    art: "forest",
    name: { en: "Forest path", es: "Sendero del bosque" },
    description: { en: "Birds and moving leaves", es: "Pájaros y hojas en movimiento" },
    layers: [
      { id: "forest", volume: 0.45 },
      { id: "wind", volume: 0.1 },
    ],
  },
  {
    id: "deep-quiet",
    art: "cosmos",
    name: { en: "Deep quiet", es: "Silencio profundo" },
    description: { en: "Low tones, wide space", es: "Tonos bajos, espacio amplio" },
    layers: [
      { id: "drone", volume: 0.4 },
      { id: "bowl", volume: 0.12 },
    ],
  },
  {
    id: "cloud-song",
    art: "sky",
    name: { en: "Cloud song", es: "Canción de nube" },
    description: { en: "A soft bed for a bedtime story", es: "Una base suave para un cuento" },
    layers: [
      { id: "wind", volume: 0.18 },
      { id: "drone", volume: 0.12 },
      { id: "bowl", volume: 0.08 },
    ],
  },
  {
    id: "bowl-only",
    art: "sand",
    name: { en: "Singing bowl", es: "Cuenco tibetano" },
    description: { en: "One bowl, long silences", es: "Un cuenco, silencios largos" },
    layers: [{ id: "bowl", volume: 0.8 }],
  },
  {
    id: "ocean-dusk",
    art: "ocean",
    name: { en: "Ocean at dusk", es: "Océano al atardecer" },
    description: { en: "Long waves and low wind", es: "Olas largas y viento bajo" },
    layers: [
      { id: "ocean", volume: 0.68 },
      { id: "wind", volume: 0.2 },
      { id: "bowl", volume: 0.1 },
    ],
  },
];

export const soundPresetById = new Map(soundPresets.map((preset) => [preset.id, preset]));
export const soundLayerById = new Map(soundLayers.map((layer) => [layer.id, layer]));
