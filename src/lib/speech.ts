import type { Lang } from "../data/types";

export interface SpeakOptions {
  lang: Lang;
  voiceURI?: string;
  rate?: number;
  volume?: number;
  onEnd?: () => void;
  onError?: () => void;
}

export function speechSupported(): boolean {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

export function allVoices(): SpeechSynthesisVoice[] {
  if (!speechSupported()) return [];
  return window.speechSynthesis.getVoices();
}

export function voicesForLang(lang: Lang): SpeechSynthesisVoice[] {
  const langCode = lang === "es" ? "es" : "en";
  const all = allVoices();
  const matching = all.filter((voice) => voice.lang.toLowerCase().startsWith(langCode));
  const pool = matching.length > 0 ? matching : all.filter((voice) => voice.default);
  return [...pool].sort((a, b) => {
    if (a.localService !== b.localService) return a.localService ? -1 : 1;
    return a.name.localeCompare(b.name);
  });
}

export function voiceName(voice: SpeechSynthesisVoice): string {
  const locale = voice.lang.replace("_", "-");
  return `${voice.name} · ${locale}`;
}

/**
 * A very small wrapper around the Web Speech API. Narration never leaves the
 * device: the browser's own speech engine does the work.
 */
class Narrator {
  private utterance: SpeechSynthesisUtterance | null = null;
  private currentText = "";

  speak(text: string, options: SpeakOptions): boolean {
    if (!speechSupported() || !text.trim()) return false;
    const synth = window.speechSynthesis;
    this.cancel(false);

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = options.lang === "es" ? "es-ES" : "en-GB";
    utterance.rate = Math.min(1.6, Math.max(0.5, options.rate ?? 0.92));
    utterance.pitch = 1;
    utterance.volume = Math.min(1, Math.max(0, options.volume ?? 1));

    const voices = voicesForLang(options.lang);
    const chosen =
      voices.find((voice) => voice.voiceURI === options.voiceURI) ??
      voices.find((voice) => voice.default) ??
      voices[0];
    if (chosen) {
      utterance.voice = chosen;
      utterance.lang = chosen.lang;
    }

    utterance.onend = () => {
      if (this.utterance === utterance) {
        this.utterance = null;
        this.currentText = "";
      }
      options.onEnd?.();
    };
    utterance.onerror = (event) => {
      // "interrupted" and "canceled" are expected when we move between steps.
      if (event.error !== "interrupted" && event.error !== "canceled") options.onError?.();
    };

    this.utterance = utterance;
    this.currentText = text;
    synth.speak(utterance);
    return true;
  }

  pause(): void {
    if (!speechSupported()) return;
    window.speechSynthesis.pause();
  }

  resume(): void {
    if (!speechSupported()) return;
    window.speechSynthesis.resume();
  }

  cancel(clearText = true): void {
    if (!speechSupported()) return;
    this.utterance = null;
    if (clearText) this.currentText = "";
    window.speechSynthesis.cancel();
  }

  isSpeaking(): boolean {
    return speechSupported() ? window.speechSynthesis.speaking : false;
  }

  text(): string {
    return this.currentText;
  }
}

export const narrator = new Narrator();

/** Narrate a short sample, used in Settings and onboarding. */
export function previewVoice(text: string, lang: Lang, voiceURI: string, rate: number): boolean {
  return narrator.speak(text, { lang, voiceURI, rate, onEnd: () => undefined });
}
