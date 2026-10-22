import { describe, expect, it } from "vitest";
import { en } from "./en";
import { es } from "./es";

const placeholders = (value: string) =>
  [...value.matchAll(/\{(\w+)\}/g)].map((match) => match[1]).sort();

describe("bilingual dictionaries", () => {
  it("have exactly the same keys", () => {
    expect(Object.keys(es).sort()).toEqual(Object.keys(en).sort());
  });

  it("never ship an empty translation", () => {
    for (const [key, value] of Object.entries(es)) {
      expect(value.trim(), key).not.toBe("");
    }
  });

  it("keep interpolation variables aligned", () => {
    for (const key of Object.keys(en) as Array<keyof typeof en>) {
      expect(placeholders(es[key]), key).toEqual(placeholders(en[key]));
    }
  });

  it("use Spanish copy that is actually different where it should be", () => {
    // Shared brand and unit microcopy is allowed to read the same; nothing
    // else should be left untranslated.
    const allowed = new Set([
      "landing.hero.bilingual", // the pun works in both languages
      "landing.language.enLabel", // each language card is written in its own
      "landing.language.enBody", //   language on purpose — identical in both
      "landing.language.esLabel", //   dictionaries by design
      "landing.language.esBody",
      "app.settings.english", // language names
      "app.settings.spanish",
      "app.focus.short", // unit microcopy
      "app.focus.minutes",
      "command.shortcut",
      "common.min",
      "common.no",
      "app.library.tenTo20", // durations read the same
      "app.breathe.min",
      "app.breathe.oneMinute",
      "app.breathe.threeMinutes",
      "app.breathe.fiveMinutes",
      "app.breathe.tenMinutes",
      "app.sleep.minutes",
      "app.focus.pomodoro",
      "app.focus.deep",
    ]);
    const identical = Object.keys(en).filter(
      (key) => en[key as keyof typeof en] === es[key as keyof typeof es],
    );
    expect(identical.filter((key) => !allowed.has(key))).toEqual([]);
  });
});
