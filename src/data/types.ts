export type Lang = "en" | "es";

export interface Localized {
  en: string;
  es: string;
}

export type Category = "meditation" | "sleep" | "focus" | "breath" | "movement" | "family";

export type Level = "beginner" | "all" | "intermediate";

export type ArtVariant =
  | "dawn"
  | "ocean"
  | "forest"
  | "ember"
  | "night"
  | "rain"
  | "meadow"
  | "mountain"
  | "cosmos"
  | "sand"
  | "dusk"
  | "sky";

export interface SessionStep {
  text: Localized;
  seconds: number;
  /** A soft chime plays at the start of this step. */
  bell?: boolean;
}

export interface Session {
  id: string;
  category: Category;
  kind: "guided" | "soundscape" | "story";
  title: Localized;
  subtitle: Localized;
  description: Localized;
  /** Nominal length in minutes, shown on cards and used for soundscape timers. */
  minutes: number;
  level: Level;
  art: ArtVariant;
  tags: Localized[];
  steps?: SessionStep[];
  /** Soundscape preset started underneath a guided session. */
  soundPreset?: string;
  featured?: boolean;
  isNew?: boolean;
  /** Soundscape sessions play these layers continuously. */
  layers?: Array<{ id: string; volume: number }>;
}

export interface CourseDay {
  title: Localized;
  sessionId: string;
  note: Localized;
}

export interface Course {
  id: string;
  title: Localized;
  subtitle: Localized;
  description: Localized;
  art: ArtVariant;
  days: CourseDay[];
}

export interface SoundLayer {
  id: string;
  name: Localized;
  description: Localized;
  icon: string;
  defaultVolume: number;
}

export interface SoundPreset {
  id: string;
  name: Localized;
  description: Localized;
  art: ArtVariant;
  layers: Array<{ id: string; volume: number }>;
}

export interface BreathPattern {
  id: string;
  name: Localized;
  description: Localized;
  inhale: number;
  holdIn: number;
  exhale: number;
  holdOut: number;
  accent: "sea" | "coral" | "plum" | "gold";
}

export interface Mood {
  id: string;
  label: Localized;
  hint: Localized;
  color: string;
  sessions: string[];
}

export interface Achievement {
  id: string;
  title: Localized;
  description: Localized;
  icon: string;
  test: (stats: AchievementStats) => boolean;
  progress: (stats: AchievementStats) => number;
  target: number;
}

export interface AchievementStats {
  sessions: number;
  minutes: number;
  streak: number;
  bestStreak: number;
  categories: number;
  journalEntries: number;
  breathSessions: number;
  sleepSessions: number;
  morningSessions: number;
  languagesUsed: number;
}

export type ActivityType = "guided" | "soundscape" | "breath" | "focus" | "story";

export interface Activity {
  id: string;
  sessionId: string;
  type: ActivityType;
  category: Category;
  minutes: number;
  at: string;
  moodBefore?: string;
  moodAfter?: string;
}

export interface MoodEntry {
  date: string;
  mood: string;
  note?: string;
}

export interface JournalEntry {
  id: string;
  createdAt: string;
  updatedAt: string;
  title: string;
  body: string;
  mood?: string;
}

export interface CourseProgress {
  [courseId: string]: number[];
}

export interface Settings {
  lang: Lang;
  voiceURI: string;
  speechRate: number;
  narration: boolean;
  reduceMotion: boolean;
  highContrast: boolean;
  fontScale: "normal" | "large" | "xlarge";
  ambientVolume: number;
  chimeVolume: number;
  defaultSoundscape: string;
  sleepFade: number;
}

export interface Profile {
  onboarded: boolean;
  name: string;
  intention: string;
  level: Level;
  createdAt: string;
}

export interface DataState {
  profile: Profile;
  settings: Settings;
  activities: Activity[];
  moods: MoodEntry[];
  journal: JournalEntry[];
  favorites: string[];
  courses: CourseProgress;
  languagesUsed: Lang[];
  soundPresets: Array<{ id: string; name: string; layers: Array<{ id: string; volume: number }> }>;
  focusTasks: Array<{ id: string; text: string; done: boolean; createdAt: string }>;
  focusCount: number;
}
