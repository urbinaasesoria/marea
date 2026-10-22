import { useEffect, useMemo, useState } from "react";
import type { Lang } from "../data/types";
import { speechSupported } from "./speech";

/**
 * Voice lists load asynchronously in most browsers (and can change while the
 * page is open). Poll briefly, then keep listening for the voiceschanged event.
 */
export function useVoices(lang: Lang) {
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);

  useEffect(() => {
    if (!speechSupported()) return;
    const synth = window.speechSynthesis;
    let attempts = 0;

    const load = () => {
      const next = synth.getVoices();
      if (next.length > 0) setVoices(next);
    };

    load();
    const interval = window.setInterval(() => {
      attempts += 1;
      load();
      if (attempts > 8) window.clearInterval(interval);
    }, 500);
    synth.addEventListener("voiceschanged", load);

    return () => {
      window.clearInterval(interval);
      synth.removeEventListener("voiceschanged", load);
    };
  }, []);

  const matching = useMemo(() => {
    const prefix = lang === "es" ? "es" : "en";
    const filtered = voices.filter((voice) => voice.lang.toLowerCase().startsWith(prefix));
    const pool = filtered.length > 0 ? filtered : voices;
    return [...pool].sort((a, b) => {
      if (a.localService !== b.localService) return a.localService ? -1 : 1;
      return a.name.localeCompare(b.name);
    });
  }, [voices, lang]);

  return {
    voices: matching,
    hasVoices: voices.length > 0,
    supported: speechSupported(),
  };
}
