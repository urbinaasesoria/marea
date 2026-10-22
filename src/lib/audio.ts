type NoiseType = "white" | "pink" | "brown";

interface LayerRuntime {
  id: string;
  gain: GainNode;
  nodes: AudioNode[];
  sources: AudioScheduledSourceNode[];
  timers: number[];
  active: boolean;
}

const clamp01 = (value: number) => Math.min(1, Math.max(0, Number.isFinite(value) ? value : 0));

/**
 * A small generative ambient engine. Every sound is synthesised in the browser,
 * so the app ships no audio files, works offline, and nothing is licensed from
 * a third party.
 */
class AmbientEngine {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private compressor: DynamicsCompressorNode | null = null;
  private analyser: AnalyserNode | null = null;
  private convolver: ConvolverNode | null = null;
  private reverbGain: GainNode | null = null;
  private layers = new Map<string, LayerRuntime>();
  private noise = new Map<NoiseType, AudioBuffer>();
  private masterVolume = 0.55;
  private playing = false;

  isSupported(): boolean {
    if (typeof window === "undefined") return false;
    return Boolean(window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext);
  }

  private ensure(): AudioContext | null {
    if (!this.isSupported()) return null;
    if (this.ctx) {
      if (this.ctx.state === "suspended") void this.ctx.resume();
      return this.ctx;
    }
    const AudioContextClass =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return null;
    const ctx = new AudioContextClass();
    this.ctx = ctx;

    const master = ctx.createGain();
    master.gain.value = 0;
    const compressor = ctx.createDynamicsCompressor();
    compressor.threshold.value = -16;
    compressor.knee.value = 18;
    compressor.ratio.value = 3;
    compressor.attack.value = 0.02;
    compressor.release.value = 0.4;
    const analyser = ctx.createAnalyser();
    analyser.fftSize = 256;
    analyser.smoothingTimeConstant = 0.8;

    master.connect(compressor);
    compressor.connect(analyser);
    analyser.connect(ctx.destination);

    const convolver = ctx.createConvolver();
    convolver.buffer = this.makeImpulse(ctx, 2.8, 2.1);
    const reverbGain = ctx.createGain();
    reverbGain.gain.value = 0.32;
    convolver.connect(reverbGain);
    reverbGain.connect(master);

    this.master = master;
    this.compressor = compressor;
    this.analyser = analyser;
    this.convolver = convolver;
    this.reverbGain = reverbGain;
    this.masterVolume = 0.55;
    return ctx;
  }

  private makeImpulse(ctx: AudioContext, seconds: number, decay: number): AudioBuffer {
    const length = Math.floor(ctx.sampleRate * seconds);
    const buffer = ctx.createBuffer(2, length, ctx.sampleRate);
    for (let channel = 0; channel < 2; channel += 1) {
      const data = buffer.getChannelData(channel);
      for (let index = 0; index < length; index += 1) {
        const envelope = Math.pow(1 - index / length, decay);
        data[index] = (Math.random() * 2 - 1) * envelope;
      }
    }
    return buffer;
  }

  private noiseBuffer(type: NoiseType): AudioBuffer {
    const cached = this.noise.get(type);
    if (cached) return cached;
    const ctx = this.ctx!;
    const seconds = 4;
    const length = ctx.sampleRate * seconds;
    const buffer = ctx.createBuffer(1, length, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    let last = 0;
    let b0 = 0;
    let b1 = 0;
    let b2 = 0;
    let b3 = 0;
    let b4 = 0;
    let b5 = 0;
    let b6 = 0;
    for (let index = 0; index < length; index += 1) {
      const white = Math.random() * 2 - 1;
      if (type === "white") {
        data[index] = white * 0.6;
      } else if (type === "brown") {
        last = (last + 0.02 * white) / 1.02;
        data[index] = last * 3.2;
      } else {
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.969 * b2 + white * 0.153852;
        b3 = 0.8665 * b3 + white * 0.3104856;
        b4 = 0.55 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.016898;
        data[index] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.11;
        b6 = white * 0.115926;
      }
    }
    this.noise.set(type, buffer);
    return buffer;
  }

  private loopNoise(type: NoiseType): AudioBufferSourceNode {
    const ctx = this.ctx!;
    const source = ctx.createBufferSource();
    source.buffer = this.noiseBuffer(type);
    source.loop = true;
    source.start();
    return source;
  }

  private layer(id: string, volume: number): LayerRuntime | null {
    const ctx = this.ctx;
    const master = this.master;
    if (!ctx || !master) return null;

    const gain = ctx.createGain();
    gain.gain.value = 0;
    gain.connect(master);

    if (this.convolver) {
      const send = ctx.createGain();
      send.gain.value = id === "bowl" || id === "drone" ? 0.24 : 0.06;
      gain.connect(send);
      send.connect(this.convolver);
    }

    const runtime: LayerRuntime = {
      id,
      gain,
      nodes: [gain],
      sources: [],
      timers: [],
      active: true,
    };

    const target = clamp01(volume) * 0.9;
    const now = ctx.currentTime;
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.linearRampToValueAtTime(target, now + 2.2);

    switch (id) {
      case "rain": {
        gain.gain.value = target;
        const white = this.loopNoise("white");
        const hp = ctx.createBiquadFilter();
        hp.type = "highpass";
        hp.frequency.value = 650;
        const lp = ctx.createBiquadFilter();
        lp.type = "lowpass";
        lp.frequency.value = 7200;
        white.connect(hp);
        hp.connect(lp);
        lp.connect(gain);
        runtime.sources.push(white);
        runtime.nodes.push(hp, lp);

        const rumble = this.loopNoise("brown");
        const rumbleLp = ctx.createBiquadFilter();
        rumbleLp.type = "lowpass";
        rumbleLp.frequency.value = 260;
        const rumbleGain = ctx.createGain();
        rumbleGain.gain.value = 0.5;
        rumble.connect(rumbleLp);
        rumbleLp.connect(rumbleGain);
        rumbleGain.connect(gain);
        runtime.sources.push(rumble);
        runtime.nodes.push(rumbleLp, rumbleGain);

        this.random(runtime, 0.35, 1.8, () => {
          const now = ctx.currentTime;
          const drop = ctx.createOscillator();
          drop.type = "sine";
          drop.frequency.value = 1400 + Math.random() * 2400;
          const dropGain = ctx.createGain();
          dropGain.gain.setValueAtTime(0.0001, now);
          dropGain.gain.linearRampToValueAtTime(0.012 + Math.random() * 0.012, now + 0.004);
          dropGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.06);
          drop.connect(dropGain);
          dropGain.connect(gain);
          drop.start(now);
          drop.stop(now + 0.08);
        });
        break;
      }
      case "ocean": {
        gain.gain.value = target;
        const source = this.loopNoise("brown");
        const lp = ctx.createBiquadFilter();
        lp.type = "lowpass";
        lp.frequency.value = 700;
        lp.Q.value = 0.4;
        const wave = ctx.createGain();
        wave.gain.value = 0.62;
        source.connect(lp);
        lp.connect(wave);
        wave.connect(gain);
        runtime.sources.push(source);
        runtime.nodes.push(lp, wave);

        const lfo = ctx.createOscillator();
        lfo.type = "sine";
        lfo.frequency.value = 0.07;
        const lfoDepth = ctx.createGain();
        lfoDepth.gain.value = 0.36;
        lfo.connect(lfoDepth);
        lfoDepth.connect(wave.gain);
        lfo.start();
        runtime.sources.push(lfo);
        runtime.nodes.push(lfoDepth);

        const filterLfo = ctx.createOscillator();
        filterLfo.type = "sine";
        filterLfo.frequency.value = 0.045;
        const filterDepth = ctx.createGain();
        filterDepth.gain.value = 240;
        filterLfo.connect(filterDepth);
        filterDepth.connect(lp.frequency);
        filterLfo.start();
        runtime.sources.push(filterLfo);
        runtime.nodes.push(filterDepth);
        break;
      }
      case "forest": {
        gain.gain.value = target;
        const source = this.loopNoise("pink");
        const bp = ctx.createBiquadFilter();
        bp.type = "bandpass";
        bp.frequency.value = 1100;
        bp.Q.value = 0.45;
        const leaves = ctx.createGain();
        leaves.gain.value = 0.5;
        source.connect(bp);
        bp.connect(leaves);
        leaves.connect(gain);
        runtime.sources.push(source);
        runtime.nodes.push(bp, leaves);

        this.random(runtime, 3.5, 9, () => {
          const now = ctx.currentTime;
          const bird = ctx.createOscillator();
          bird.type = "sine";
          const start = 1900 + Math.random() * 900;
          bird.frequency.setValueAtTime(start, now);
          bird.frequency.exponentialRampToValueAtTime(start + 600 + Math.random() * 500, now + 0.08);
          bird.frequency.exponentialRampToValueAtTime(start - 300, now + 0.22);
          const chirp = ctx.createGain();
          chirp.gain.setValueAtTime(0.0001, now);
          chirp.gain.linearRampToValueAtTime(0.018, now + 0.02);
          chirp.gain.exponentialRampToValueAtTime(0.0001, now + 0.26);
          bird.connect(chirp);
          chirp.connect(gain);
          bird.start(now);
          bird.stop(now + 0.3);
        });
        break;
      }
      case "fire": {
        gain.gain.value = target;
        const source = this.loopNoise("brown");
        const lp = ctx.createBiquadFilter();
        lp.type = "lowpass";
        lp.frequency.value = 900;
        const body = ctx.createGain();
        body.gain.value = 0.55;
        source.connect(lp);
        lp.connect(body);
        body.connect(gain);
        runtime.sources.push(source);
        runtime.nodes.push(lp, body);

        this.random(runtime, 0.25, 1.6, () => {
          const now = ctx.currentTime;
          const crackle = ctx.createBufferSource();
          crackle.buffer = this.noiseBuffer("white");
          const bp = ctx.createBiquadFilter();
          bp.type = "bandpass";
          bp.frequency.value = 1200 + Math.random() * 2200;
          bp.Q.value = 1.6;
          const pop = ctx.createGain();
          pop.gain.setValueAtTime(0.0001, now);
          pop.gain.linearRampToValueAtTime(0.04 + Math.random() * 0.07, now + 0.004);
          pop.gain.exponentialRampToValueAtTime(0.0001, now + 0.09);
          crackle.connect(bp);
          bp.connect(pop);
          pop.connect(gain);
          crackle.start(now, Math.random() * 2, 0.12);
          crackle.stop(now + 0.12);
        });
        break;
      }
      case "wind": {
        gain.gain.value = target;
        const source = this.loopNoise("pink");
        const bp = ctx.createBiquadFilter();
        bp.type = "bandpass";
        bp.frequency.value = 480;
        bp.Q.value = 0.8;
        const swell = ctx.createGain();
        swell.gain.value = 0.6;
        source.connect(bp);
        bp.connect(swell);
        swell.connect(gain);
        runtime.sources.push(source);
        runtime.nodes.push(bp, swell);

        const lfo = ctx.createOscillator();
        lfo.type = "sine";
        lfo.frequency.value = 0.055;
        const depth = ctx.createGain();
        depth.gain.value = 0.22;
        lfo.connect(depth);
        depth.connect(swell.gain);
        lfo.start();
        runtime.sources.push(lfo);
        runtime.nodes.push(depth);

        const filterLfo = ctx.createOscillator();
        filterLfo.type = "sine";
        filterLfo.frequency.value = 0.035;
        const filterDepth = ctx.createGain();
        filterDepth.gain.value = 170;
        filterLfo.connect(filterDepth);
        filterDepth.connect(bp.frequency);
        filterLfo.start();
        runtime.sources.push(filterLfo);
        runtime.nodes.push(filterDepth);
        break;
      }
      case "night": {
        gain.gain.value = target;
        const source = this.loopNoise("pink");
        const lp = ctx.createBiquadFilter();
        lp.type = "lowpass";
        lp.frequency.value = 1000;
        const air = ctx.createGain();
        air.gain.value = 0.28;
        source.connect(lp);
        lp.connect(air);
        air.connect(gain);
        runtime.sources.push(source);
        runtime.nodes.push(lp, air);

        this.random(runtime, 1.6, 4.8, () => {
          const ctxNow = ctx.currentTime;
          const cricket = ctx.createOscillator();
          cricket.type = "sine";
          cricket.frequency.value = 3900 + Math.random() * 500;
          const pulse = ctx.createGain();
          pulse.gain.value = 0.0001;
          for (let index = 0; index < 3; index += 1) {
            const at = ctxNow + index * 0.075;
            pulse.gain.setValueAtTime(0.0001, at);
            pulse.gain.linearRampToValueAtTime(0.008, at + 0.01);
            pulse.gain.linearRampToValueAtTime(0.0001, at + 0.045);
          }
          cricket.connect(pulse);
          pulse.connect(gain);
          cricket.start(ctxNow);
          cricket.stop(ctxNow + 0.26);
        });
        break;
      }
      case "drone": {
        gain.gain.value = target;
        const droneGain = ctx.createGain();
        droneGain.gain.value = 0.42;
        const lp = ctx.createBiquadFilter();
        lp.type = "lowpass";
        lp.frequency.value = 520;
        droneGain.connect(lp);
        lp.connect(gain);
        runtime.nodes.push(droneGain, lp);

        const frequencies = [82.41, 110, 164.81];
        frequencies.forEach((frequency, index) => {
          const osc = ctx.createOscillator();
          osc.type = index === 2 ? "sine" : "triangle";
          osc.frequency.value = frequency;
          const voiceGain = ctx.createGain();
          voiceGain.gain.value = index === 2 ? 0.18 : 0.26;
          osc.connect(voiceGain);
          voiceGain.connect(droneGain);
          osc.start();
          runtime.sources.push(osc);
          runtime.nodes.push(voiceGain);
        });

        const lfo = ctx.createOscillator();
        lfo.type = "sine";
        lfo.frequency.value = 0.04;
        const depth = ctx.createGain();
        depth.gain.value = 0.14;
        lfo.connect(depth);
        depth.connect(droneGain.gain);
        lfo.start();
        runtime.sources.push(lfo);
        runtime.nodes.push(depth);
        break;
      }
      case "bowl": {
        gain.gain.value = target;
        const strike = () => this.strikeBowl(runtime, target);
        strike();
        this.random(runtime, 16, 30, strike);
        break;
      }
      default:
        gain.gain.value = target;
        break;
    }

    this.layers.set(id, runtime);
    return runtime;
  }

  private strikeBowl(runtime: LayerRuntime, level: number): void {
    const ctx = this.ctx;
    if (!ctx || !runtime.active) return;
    const now = ctx.currentTime + 0.05;
    const base = 196 * (0.97 + Math.random() * 0.06);
    const partials: Array<[number, number, number]> = [
      [1, 0.22, 13],
      [2.71, 0.09, 9],
      [5.05, 0.04, 6],
      [8.1, 0.018, 4],
    ];
    partials.forEach(([ratio, amplitude, decay]) => {
      const osc = ctx.createOscillator();
      osc.type = "sine";
      osc.frequency.value = base * ratio;
      const envelope = ctx.createGain();
      const peak = amplitude * Math.max(0.12, level);
      envelope.gain.setValueAtTime(0.0001, now);
      envelope.gain.linearRampToValueAtTime(peak, now + 0.02);
      envelope.gain.exponentialRampToValueAtTime(0.0001, now + decay);
      osc.connect(envelope);
      envelope.connect(runtime.gain);
      osc.start(now);
      osc.stop(now + decay + 0.2);
    });
  }

  private random(runtime: LayerRuntime, minSeconds: number, maxSeconds: number, action: () => void): void {
    const schedule = () => {
      if (!runtime.active) return;
      action();
      const next = minSeconds + Math.random() * (maxSeconds - minSeconds);
      const timer = window.setTimeout(schedule, next * 1000);
      runtime.timers.push(timer);
    };
    const first = minSeconds + Math.random() * (maxSeconds - minSeconds);
    runtime.timers.push(window.setTimeout(schedule, first * 1000));
  }

  start(layers: Array<{ id: string; volume: number }>, masterVolume: number): void {
    const ctx = this.ensure();
    if (!ctx || !this.master) return;
    this.clearLayers();
    this.masterVolume = clamp01(masterVolume);
    this.playing = true;
    const now = ctx.currentTime;
    this.master.gain.cancelScheduledValues(now);
    this.master.gain.setValueAtTime(0.0001, now);
    this.master.gain.linearRampToValueAtTime(Math.max(0.0001, this.masterVolume), now + 1.4);

    const unique = new Map<string, number>();
    layers.forEach((layer) => unique.set(layer.id, layer.volume));
    unique.forEach((volume, id) => this.layer(id, volume));
  }

  setMasterVolume(volume: number): void {
    this.masterVolume = clamp01(volume);
    if (!this.ctx || !this.master || !this.playing) return;
    const now = this.ctx.currentTime;
    this.master.gain.cancelScheduledValues(now);
    this.master.gain.setTargetAtTime(Math.max(0.0001, this.masterVolume), now, 0.08);
  }

  setLayerVolume(id: string, volume: number): void {
    const runtime = this.layers.get(id);
    if (!runtime || !this.ctx) return;
    const now = this.ctx.currentTime;
    runtime.gain.gain.cancelScheduledValues(now);
    runtime.gain.gain.setTargetAtTime(Math.max(0.0001, clamp01(volume) * 0.9), now, 0.09);
  }

  addLayer(id: string, volume: number): void {
    if (!this.playing || this.layers.has(id)) return;
    const runtime = this.layer(id, volume);
    if (runtime && this.ctx) {
      const now = this.ctx.currentTime;
      runtime.gain.gain.cancelScheduledValues(now);
      runtime.gain.gain.setValueAtTime(0.0001, now);
      runtime.gain.gain.linearRampToValueAtTime(clamp01(volume) * 0.9, now + 1.2);
    }
  }

  removeLayer(id: string): void {
    const runtime = this.layers.get(id);
    if (!runtime || !this.ctx) return;
    runtime.active = false;
    runtime.timers.forEach((timer) => window.clearTimeout(timer));
    const now = this.ctx.currentTime;
    runtime.gain.gain.cancelScheduledValues(now);
    runtime.gain.gain.setTargetAtTime(0.0001, now, 0.08);
    window.setTimeout(() => this.disposeRuntime(runtime), 500);
    this.layers.delete(id);
  }

  private disposeRuntime(runtime: LayerRuntime): void {
    runtime.timers.forEach((timer) => window.clearTimeout(timer));
    runtime.sources.forEach((source) => {
      try {
        source.stop();
      } catch {
        // Already stopped.
      }
    });
    runtime.nodes.forEach((node) => {
      try {
        node.disconnect();
      } catch {
        // Already disconnected.
      }
    });
  }

  private clearLayers(): void {
    this.layers.forEach((runtime) => {
      runtime.active = false;
      this.disposeRuntime(runtime);
    });
    this.layers.clear();
  }

  stop(fadeSeconds = 0.25): void {
    if (!this.ctx || !this.master) {
      this.playing = false;
      return;
    }
    const ctx = this.ctx;
    const master = this.master;
    const now = ctx.currentTime;
    this.playing = false;
    master.gain.cancelScheduledValues(now);
    master.gain.setValueAtTime(Math.max(0.0001, master.gain.value), now);
    master.gain.linearRampToValueAtTime(0.0001, now + Math.max(0.02, fadeSeconds));
    const delay = Math.max(0.03, fadeSeconds) * 1000 + 80;
    window.setTimeout(() => {
      this.clearLayers();
      master.gain.setValueAtTime(0, this.ctx?.currentTime ?? 0);
    }, delay);
  }

  fadeOut(seconds: number, onDone?: () => void): void {
    if (!this.ctx || !this.master) {
      this.playing = false;
      onDone?.();
      return;
    }
    const ctx = this.ctx;
    const master = this.master;
    const now = ctx.currentTime;
    this.playing = false;
    master.gain.cancelScheduledValues(now);
    master.gain.setValueAtTime(Math.max(0.0001, master.gain.value), now);
    master.gain.linearRampToValueAtTime(0.0001, now + Math.max(0.2, seconds));
    window.setTimeout(() => {
      this.clearLayers();
      master.gain.setValueAtTime(0, this.ctx?.currentTime ?? 0);
      onDone?.();
    }, Math.max(0.2, seconds) * 1000 + 100);
  }

  chime(strength = 0.5): void {
    const ctx = this.ensure();
    if (!ctx || !this.master) return;
    const now = ctx.currentTime + 0.03;
    const base = 396;
    [1, 2.7, 5.1].forEach((ratio, index) => {
      const osc = ctx.createOscillator();
      osc.type = "sine";
      osc.frequency.value = base * ratio;
      const gain = ctx.createGain();
      const peak = (index === 0 ? 0.14 : index === 1 ? 0.05 : 0.02) * Math.max(0.1, strength);
      const decay = index === 0 ? 4 : index === 1 ? 2.4 : 1.4;
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.linearRampToValueAtTime(peak, now + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + decay);
      osc.connect(gain);
      gain.connect(this.master!);
      osc.start(now);
      osc.stop(now + decay + 0.1);
    });
  }

  isPlaying(): boolean {
    return this.playing;
  }

  getLevel(): number {
    if (!this.analyser || !this.playing) return 0;
    const data = new Uint8Array(this.analyser.fftSize);
    this.analyser.getByteTimeDomainData(data);
    let sum = 0;
    for (let index = 0; index < data.length; index += 1) {
      const value = (data[index] - 128) / 128;
      sum += value * value;
    }
    return Math.min(1, Math.sqrt(sum / data.length) * 3.2);
  }
}

export const ambientEngine = new AmbientEngine();
