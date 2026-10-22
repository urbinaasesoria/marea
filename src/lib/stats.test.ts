import { describe, expect, it } from "vitest";
import type { Activity, Category, MoodEntry } from "../data/types";
import { addDays, localDayKey } from "./utils";
import { computeStats, computeStreaks } from "./stats";

const activity = (
  daysAgo: number,
  minutes: number,
  category: Category = "meditation",
  type: Activity["type"] = "guided",
): Activity => {
  const date = addDays(new Date(), -daysAgo);
  date.setHours(8, 0, 0, 0);
  return {
    id: `a-${daysAgo}-${category}-${minutes}`,
    sessionId: "morning-tide",
    type,
    category,
    minutes,
    at: date.toISOString(),
  };
};

describe("computeStreaks", () => {
  it("returns zero with no practice", () => {
    expect(computeStreaks([])).toEqual({ current: 0, best: 0 });
  });

  it("counts a run that ends today", () => {
    const activities = [activity(0, 5), activity(1, 10), activity(2, 5)];
    expect(computeStreaks(activities)).toEqual({ current: 3, best: 3 });
  });

  it("counts a run that ended yesterday as still current", () => {
    expect(computeStreaks([activity(1, 5), activity(2, 5)]).current).toBe(2);
  });

  it("resets the current streak after a missed day but keeps the best", () => {
    const activities = [
      activity(2, 5),
      activity(3, 5),
      activity(4, 5),
      activity(9, 5),
    ];
    expect(computeStreaks(activities)).toEqual({ current: 0, best: 3 });
  });

  it("ignores multiple sessions on the same day", () => {
    const activities = [activity(0, 5), activity(0, 10), activity(1, 5)];
    expect(computeStreaks(activities).current).toBe(2);
  });
});

describe("computeStats", () => {
  const today = localDayKey();
  const moods: MoodEntry[] = [{ date: today, mood: "light" }];
  const activities = [
    activity(0, 10, "meditation"),
    activity(0, 5, "breath", "breath"),
    activity(1, 20, "sleep", "soundscape"),
    activity(10, 15, "focus", "focus"),
  ];

  const stats = computeStats(activities, 3, moods, 2);

  it("totals sessions and minutes", () => {
    expect(stats.totalSessions).toBe(4);
    expect(stats.totalMinutes).toBe(50);
  });

  it("sums today and the last seven days", () => {
    expect(stats.todayMinutes).toBe(15);
    expect(stats.weekMinutes).toBe(35);
    expect(stats.last7).toHaveLength(7);
    expect(stats.last84).toHaveLength(84);
    expect(stats.last7[6].key).toBe(today);
  });

  it("groups minutes by category", () => {
    expect(stats.categoryMinutes.meditation).toBe(10);
    expect(stats.categoryMinutes.breath).toBe(5);
    expect(stats.categoryMinutes.sleep).toBe(20);
    expect(stats.categoryMinutes.focus).toBe(15);
    expect(stats.categoryMinutes.family).toBe(0);
  });

  it("maps today's mood onto the series", () => {
    expect(stats.moodSeries).toHaveLength(14);
    expect(stats.moodSeries[13]).toMatchObject({ key: today, mood: "light", value: 4 });
  });

  it("passes through journal and achievement counters", () => {
    expect(stats.journalCount).toBe(3);
    expect(stats.achievementStats.journalEntries).toBe(3);
    expect(stats.achievementStats.breathSessions).toBe(1);
    expect(stats.achievementStats.sleepSessions).toBe(1);
    expect(stats.achievementStats.languagesUsed).toBe(2);
    expect(stats.achievementStats.categories).toBe(4);
  });
});
