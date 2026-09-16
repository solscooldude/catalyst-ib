import { getSnapshot } from "@/lib/store-core";

export type SfxKind = "boop" | "hatch" | "unlock" | "catch" | "hit";

const TONES: Record<SfxKind, { freq: number; dur: number; type: OscillatorType }> =
  {
    boop: { freq: 520, dur: 0.07, type: "sine" },
    hatch: { freq: 380, dur: 0.18, type: "triangle" },
    unlock: { freq: 660, dur: 0.12, type: "sine" },
    catch: { freq: 740, dur: 0.08, type: "triangle" },
    hit: { freq: 180, dur: 0.14, type: "sawtooth" },
  };

let ctx: AudioContext | null = null;

function context() {
  if (typeof window === "undefined") return null;
  const Ctor =
    window.AudioContext ||
    (window as Window & { webkitAudioContext?: typeof AudioContext })
      .webkitAudioContext;
  if (!Ctor) return null;
  if (!ctx) ctx = new Ctor();
  return ctx;
}

export function playSfx(kind: SfxKind) {
  if (typeof window === "undefined") return;
  if (getSnapshot().soundMuted) return;
  const audio = context();
  if (!audio) return;
  void audio.resume();
  const tone = TONES[kind];
  const osc = audio.createOscillator();
  const gain = audio.createGain();
  osc.type = tone.type;
  osc.frequency.value = tone.freq;
  gain.gain.setValueAtTime(0.0001, audio.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.08, audio.currentTime + 0.012);
  gain.gain.exponentialRampToValueAtTime(0.0001, audio.currentTime + tone.dur);
  osc.connect(gain);
  gain.connect(audio.destination);
  osc.start();
  osc.stop(audio.currentTime + tone.dur + 0.02);
}
