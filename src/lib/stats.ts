import type {
  AchievementStats,
  Activity,
  Category,
  CourseProgress,
  MoodEntry,
  Session,
} from "../data/types";
import { courses } from "../data/courses";
import { moods } from "../data/moods";
import { sessionById } from "../data/sessions";
import { addDays, daysBetween, localDayKey, parseDayKey } from "./utils";

export const categories: Category[] = [
  "meditation",
  "sleep",
  "focus",
  "breath",
  "movement",
  "family",
];

export interface DayMinutes {
  key: string;
  date: Date;
  minutes: number;
}

export interface ComputedStats {
  totalMinutes: number;
  totalSessions: number;
  todayMinutes: number;
  weekMinutes: number;
  streak: number;
  bestStreak: number;
  categoryMinutes: Record<Category, number>;
  last7: DayMinutes[];
  last84: DayMinutes[];
  moodSeries: Array<{ key: string; date: Date; mood: string | null; value: number | null }>;
  achievementStats: AchievementStats;
  journalCount: number;
}

const moodValues: Record<string, number> = {
  heavy: 1,
  tender: 2,
  steady: 3,
  light: 4,
  radiant: 5,
};

export function uniquePracticeDays(activities: Activity[]): string[] {
  return [...new Set(activities.map((activity) => localDayKey(new Date(activity.at))))].sort();
}

export function computeStreaks(activities: Activity[]): { current: number; best: number } {
  const days = uniquePracticeDays(activities);
  if (days.length === 0) return { current: 0, best: 0 };

  let best = 1;
  let run = 1;
  for (let index = 1; index < days.length; index += 1) {
    if (daysBetween(days[index - 1], days[index]) === 1) {
      run += 1;
      best = Math.max(best, run);
    } else {
      run = 1;
    }
  }

  const today = localDayKey();
  const latest = days[days.length - 1];
  const gap = daysBetween(latest, today);
  if (gap > 1) return { current: 0, best };

  let current = 1;
  for (let index = days.length - 1; index > 0; index -= 1) {
    if (daysBetween(days[index - 1], days[index]) === 1) {
      current += 1;
    } else {
      break;
    }
  }
  return { current, best: Math.max(best, current) };
}

function minutesOnDay(activities: Activity[], key: string): number {
  return activities
    .filter((activity) => localDayKey(new Date(activity.at)) === key)
    .reduce((total, activity) => total + activity.minutes, 0);
}

export function computeStats(
  activities: Activity[],
  journalCount: number,
  moodsList: MoodEntry[],
  languagesUsed: number,
): ComputedStats {
  const today = localDayKey();
  const todayDate = parseDayKey(today);
  const streaks = computeStreaks(activities);
  const totalMinutes = Math.round(activities.reduce((total, activity) => total + activity.minutes, 0));

  const categoryMinutes = categories.reduce(
    (accumulator, category) => {
      accumulator[category] = Math.round(
        activities
          .filter((activity) => activity.category === category)
          .reduce((total, activity) => total + activity.minutes, 0),
      );
      return accumulator;
    },
    {} as Record<Category, number>,
  );

  const last7: DayMinutes[] = Array.from({ length: 7 }, (_, index) => {
    const date = addDays(todayDate, index - 6);
    const key = localDayKey(date);
    return { key, date, minutes: Math.round(minutesOnDay(activities, key)) };
  });

  const last84: DayMinutes[] = Array.from({ length: 84 }, (_, index) => {
    const date = addDays(todayDate, index - 83);
    const key = localDayKey(date);
    return { key, date, minutes: Math.round(minutesOnDay(activities, key)) };
  });

  const moodSeries = Array.from({ length: 14 }, (_, index) => {
    const date = addDays(todayDate, index - 13);
    const key = localDayKey(date);
    const entry = [...moodsList].reverse().find((mood) => mood.date === key);
    return {
      key,
      date,
      mood: entry?.mood ?? null,
      value: entry ? moodValues[entry.mood] ?? null : null,
    };
  });

  const weekMinutes = Math.round(last7.reduce((total, day) => total + day.minutes, 0));
  const todayMinutes = Math.round(minutesOnDay(activities, today));
  const activeCategories = categories.filter((category) => categoryMinutes[category] > 0).length;

  const achievementStats: AchievementStats = {
    sessions: activities.length,
    minutes: totalMinutes,
    streak: streaks.current,
    bestStreak: streaks.best,
    categories: activeCategories,
    journalEntries: journalCount,
    breathSessions: activities.filter((activity) => activity.type === "breath").length,
    sleepSessions: activities.filter((activity) => activity.category === "sleep").length,
    morningSessions: activities.filter((activity) => new Date(activity.at).getHours() < 9).length,
    languagesUsed,
  };

  return {
    totalMinutes,
    totalSessions: activities.length,
    todayMinutes,
    weekMinutes,
    streak: streaks.current,
    bestStreak: streaks.best,
    categoryMinutes,
    last7,
    last84,
    moodSeries,
    achievementStats,
    journalCount,
  };
}

export function todaysMood(moodsList: MoodEntry[]): MoodEntry | undefined {
  const today = localDayKey();
  return [...moodsList].reverse().find((mood) => mood.date === today);
}

export function recommendSession(
  activities: Activity[],
  moodsList: MoodEntry[],
  intention: string,
  hour: number,
): Session {
  if (activities.length === 0) {
    return sessionById.get("morning-tide") ?? sessionById.get("anxiety-sos")!;
  }

  const mood = todaysMood(moodsList)?.mood;
  const moodSuggestion = moods.find((item) => item.id === mood)?.sessions[0];
  if (moodSuggestion && sessionById.has(moodSuggestion)) {
    return sessionById.get(moodSuggestion)!;
  }

  if (hour >= 21 || hour < 6) {
    return sessionById.get("evening-release") ?? sessionById.get("deep-sleep")!;
  }

  if (hour < 11) {
    if (intention === "focus") return sessionById.get("focus-primer")!;
    if (intention === "anxiety") return sessionById.get("ocean-breath")!;
    return sessionById.get("morning-tide")!;
  }

  if (hour < 17) {
    if (intention === "sleep") return sessionById.get("midday-reset")!;
    if (intention === "kindness") return sessionById.get("self-kindness")!;
    return sessionById.get("midday-reset")!;
  }

  if (intention === "anxiety") return sessionById.get("anxiety-sos")!;
  if (intention === "kindness") return sessionById.get("gratitude-glow")!;
  return sessionById.get("unwind-work") ?? sessionById.get("evening-release")!;
}

export interface ActiveCourse {
  courseId: string;
  courseTitle: { en: string; es: string };
  completed: number;
  total: number;
  nextDayIndex: number;
  nextSessionId: string;
}

export function activeCourse(progress: CourseProgress): ActiveCourse | null {
  const ordered = courses
    .map((course) => {
      const done = progress[course.id] ?? [];
      return { course, done };
    })
    .filter(({ done, course }) => done.length > 0 && done.length < course.days.length)
    .sort((a, b) => b.done.length / b.course.days.length - a.done.length / a.course.days.length);

  if (ordered.length === 0) return null;
  const { course, done } = ordered[0];
  const nextDayIndex = course.days.findIndex((_, index) => !done.includes(index));
  if (nextDayIndex < 0) return null;
  return {
    courseId: course.id,
    courseTitle: course.title,
    completed: done.length,
    total: course.days.length,
    nextDayIndex,
    nextSessionId: course.days[nextDayIndex].sessionId,
  };
}

export function activityTitle(activity: Activity, lang: "en" | "es"): string {
  if (activity.sessionId === "focus-timer") {
    return lang === "es" ? "Bloque de foco" : "Focus block";
  }
  if (activity.sessionId === "focus-break") {
    return lang === "es" ? "Descanso" : "Break";
  }
  const session = sessionById.get(activity.sessionId);
  if (session) return session.title[lang];
  const mood = moods.find((item) => item.id === activity.sessionId);
  if (mood) return mood.label[lang];
  return lang === "es" ? "Práctica" : "Practice";
}
