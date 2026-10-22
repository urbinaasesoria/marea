import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type {
  Activity,
  ActivityType,
  Category,
  DataState,
  JournalEntry,
  Lang,
  Level,
  MoodEntry,
  Settings,
} from "../data/types";
import { computeStats, todaysMood, type ComputedStats } from "../lib/stats";
import {
  clearPersistedData,
  createDefaultData,
  loadData,
  persistData,
} from "../lib/storage";
import { downloadJson, localDayKey, uid } from "../lib/utils";

export interface CompleteActivityInput {
  sessionId: string;
  type: ActivityType;
  category: Category;
  minutes: number;
  moodBefore?: string;
  moodAfter?: string;
}

interface StoreValue {
  data: DataState;
  lang: Lang;
  stats: ComputedStats;
  todayMood?: MoodEntry;
  setLanguage: (lang: Lang) => void;
  updateSettings: (patch: Partial<Settings>) => void;
  updateProfile: (patch: Partial<DataState["profile"]>) => void;
  completeOnboarding: (profile: {
    name: string;
    intention: string;
    level: Level;
    language: Lang;
  }) => void;
  completeActivity: (input: CompleteActivityInput) => void;
  setMood: (mood: string, note?: string) => void;
  addJournal: (entry: { title: string; body: string; mood?: string }) => string;
  updateJournal: (id: string, patch: Partial<Pick<JournalEntry, "title" | "body" | "mood">>) => void;
  deleteJournal: (id: string) => void;
  toggleFavorite: (sessionId: string) => void;
  markCourseDay: (courseId: string, dayIndex: number) => void;
  saveSoundPreset: (
    name: string,
    layers: Array<{ id: string; volume: number }>,
  ) => void;
  deleteSoundPreset: (id: string) => void;
  addFocusTask: (text: string) => void;
  toggleFocusTask: (id: string) => void;
  clearDoneFocusTasks: () => void;
  recordFocusBlock: (minutes: number) => void;
  exportAll: () => void;
  resetAll: () => void;
}

const StoreContext = createContext<StoreValue | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<DataState>(() => loadData());

  useEffect(() => {
    persistData(data);
  }, [data]);

  const setLanguage = useCallback((lang: Lang) => {
    setData((current) => ({
      ...current,
      settings: { ...current.settings, lang },
      languagesUsed: current.languagesUsed.includes(lang)
        ? current.languagesUsed
        : [...current.languagesUsed, lang],
    }));
  }, []);

  const updateSettings = useCallback((patch: Partial<Settings>) => {
    setData((current) => ({
      ...current,
      settings: { ...current.settings, ...patch },
    }));
  }, []);

  const updateProfile = useCallback((patch: Partial<DataState["profile"]>) => {
    setData((current) => ({ ...current, profile: { ...current.profile, ...patch } }));
  }, []);

  const completeOnboarding = useCallback(
    (profile: { name: string; intention: string; level: Level; language: Lang }) => {
      setData((current) => ({
        ...current,
        settings: { ...current.settings, lang: profile.language },
        profile: {
          ...current.profile,
          onboarded: true,
          name: profile.name.trim().slice(0, 40),
          intention: profile.intention,
          level: profile.level,
        },
        languagesUsed: current.languagesUsed.includes(profile.language)
          ? current.languagesUsed
          : [...current.languagesUsed, profile.language],
      }));
    },
    [],
  );

  const completeActivity = useCallback((input: CompleteActivityInput) => {
    if (!Number.isFinite(input.minutes) || input.minutes <= 0) return;
    setData((current) => {
      const activity: Activity = {
        id: uid(),
        sessionId: input.sessionId,
        type: input.type,
        category: input.category,
        minutes: Math.max(0.2, Math.round(input.minutes * 10) / 10),
        at: new Date().toISOString(),
        moodBefore: input.moodBefore,
        moodAfter: input.moodAfter,
      };
      let moods = current.moods;
      if (input.moodAfter) {
        const key = localDayKey();
        moods = [
          ...current.moods.filter((mood) => mood.date !== key),
          { date: key, mood: input.moodAfter },
        ];
      }
      return { ...current, activities: [...current.activities, activity], moods };
    });
  }, []);

  const setMood = useCallback((mood: string, note?: string) => {
    setData((current) => {
      const key = localDayKey();
      const entry: MoodEntry = { date: key, mood, note };
      return {
        ...current,
        moods: [...current.moods.filter((item) => item.date !== key), entry],
      };
    });
  }, []);

  const addJournal = useCallback((entry: { title: string; body: string; mood?: string }) => {
    const id = uid();
    const now = new Date().toISOString();
    setData((current) => ({
      ...current,
      journal: [
        {
          id,
          title: entry.title.trim(),
          body: entry.body,
          mood: entry.mood,
          createdAt: now,
          updatedAt: now,
        },
        ...current.journal,
      ],
    }));
    return id;
  }, []);

  const updateJournal = useCallback(
    (id: string, patch: Partial<Pick<JournalEntry, "title" | "body" | "mood">>) => {
      setData((current) => ({
        ...current,
        journal: current.journal.map((entry) =>
          entry.id === id
            ? { ...entry, ...patch, updatedAt: new Date().toISOString() }
            : entry,
        ),
      }));
    },
    [],
  );

  const deleteJournal = useCallback((id: string) => {
    setData((current) => ({
      ...current,
      journal: current.journal.filter((entry) => entry.id !== id),
    }));
  }, []);

  const toggleFavorite = useCallback((sessionId: string) => {
    setData((current) => ({
      ...current,
      favorites: current.favorites.includes(sessionId)
        ? current.favorites.filter((id) => id !== sessionId)
        : [...current.favorites, sessionId],
    }));
  }, []);

  const markCourseDay = useCallback((courseId: string, dayIndex: number) => {
    setData((current) => {
      const done = current.courses[courseId] ?? [];
      const next = done.includes(dayIndex)
        ? done.filter((index) => index !== dayIndex)
        : [...done, dayIndex];
      return { ...current, courses: { ...current.courses, [courseId]: next } };
    });
  }, []);

  const saveSoundPreset = useCallback(
    (name: string, layers: Array<{ id: string; volume: number }>) => {
      const clean = name.trim().slice(0, 32);
      if (!clean) return;
      setData((current) => ({
        ...current,
        soundPresets: [
          {
            id: uid(),
            name: clean,
            layers: layers.filter((layer) => layer.volume > 0.001),
          },
          ...current.soundPresets,
        ].slice(0, 24),
      }));
    },
    [],
  );

  const deleteSoundPreset = useCallback((id: string) => {
    setData((current) => ({
      ...current,
      soundPresets: current.soundPresets.filter((preset) => preset.id !== id),
    }));
  }, []);

  const addFocusTask = useCallback((text: string) => {
    const clean = text.trim().slice(0, 140);
    if (!clean) return;
    setData((current) => ({
      ...current,
      focusTasks: [
        ...current.focusTasks,
        { id: uid(), text: clean, done: false, createdAt: new Date().toISOString() },
      ].slice(-20),
    }));
  }, []);

  const toggleFocusTask = useCallback((id: string) => {
    setData((current) => ({
      ...current,
      focusTasks: current.focusTasks.map((task) =>
        task.id === id ? { ...task, done: !task.done } : task,
      ),
    }));
  }, []);

  const clearDoneFocusTasks = useCallback(() => {
    setData((current) => ({
      ...current,
      focusTasks: current.focusTasks.filter((task) => !task.done),
    }));
  }, []);

  const recordFocusBlock = useCallback(
    (minutes: number) => {
      setData((current) => ({
        ...current,
        focusCount: current.focusCount + 1,
        activities: [
          ...current.activities,
          {
            id: uid(),
            sessionId: "focus-timer",
            type: "focus",
            category: "focus",
            minutes: Math.max(0.5, Math.round(minutes * 10) / 10),
            at: new Date().toISOString(),
          },
        ],
      }));
    },
    [],
  );

  const exportAll = useCallback(() => {
    downloadJson(`marea-${localDayKey()}.json`, data);
  }, [data]);

  const resetAll = useCallback(() => {
    const lang = data.settings.lang;
    clearPersistedData();
    setData(createDefaultData(lang));
  }, [data.settings.lang]);

  const stats = useMemo(
    () => computeStats(data.activities, data.journal.length, data.moods, data.languagesUsed.length),
    [data.activities, data.journal.length, data.moods, data.languagesUsed.length],
  );

  const todayMood = useMemo(() => todaysMood(data.moods), [data.moods]);

  const value = useMemo<StoreValue>(
    () => ({
      data,
      lang: data.settings.lang,
      stats,
      todayMood,
      setLanguage,
      updateSettings,
      updateProfile,
      completeOnboarding,
      completeActivity,
      setMood,
      addJournal,
      updateJournal,
      deleteJournal,
      toggleFavorite,
      markCourseDay,
      saveSoundPreset,
      deleteSoundPreset,
      addFocusTask,
      toggleFocusTask,
      clearDoneFocusTasks,
      recordFocusBlock,
      exportAll,
      resetAll,
    }),
    [
      data,
      stats,
      todayMood,
      setLanguage,
      updateSettings,
      updateProfile,
      completeOnboarding,
      completeActivity,
      setMood,
      addJournal,
      updateJournal,
      deleteJournal,
      toggleFavorite,
      markCourseDay,
      saveSoundPreset,
      deleteSoundPreset,
      addFocusTask,
      toggleFocusTask,
      clearDoneFocusTasks,
      recordFocusBlock,
      exportAll,
      resetAll,
    ],
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore(): StoreValue {
  const context = useContext(StoreContext);
  if (!context) throw new Error("useStore must be used inside StoreProvider");
  return context;
}
