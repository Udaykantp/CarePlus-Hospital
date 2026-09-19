/**
 * Synthesizes a clean, pleasant hospital alert chime using the Web Audio API.
 * Completely self-contained with no external audio file dependencies.
 */
let audioCtx: AudioContext | null = null;

export function playNotificationChime(): void {
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;

    if (!audioCtx || audioCtx.state === 'closed') {
      audioCtx = new AudioContextClass();
    }

    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    const now = audioCtx.currentTime;

    // Two-tone harmonic chime (880Hz -> 1320Hz / A5 -> E6)
    const osc1 = audioCtx.createOscillator();
    const gain1 = audioCtx.createGain();

    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(880, now);
    osc1.frequency.exponentialRampToValueAtTime(1320, now + 0.12);

    gain1.gain.setValueAtTime(0.01, now);
    gain1.gain.linearRampToValueAtTime(0.2, now + 0.03);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

    osc1.connect(gain1);
    gain1.connect(audioCtx.destination);

    osc1.start(now);
    osc1.stop(now + 0.5);

    // Second soft resonance chime
    const osc2 = audioCtx.createOscillator();
    const gain2 = audioCtx.createGain();

    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(1320, now + 0.12);
    osc2.frequency.exponentialRampToValueAtTime(1760, now + 0.28);

    gain2.gain.setValueAtTime(0.001, now + 0.12);
    gain2.gain.linearRampToValueAtTime(0.12, now + 0.16);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.6);

    osc2.connect(gain2);
    gain2.connect(audioCtx.destination);

    osc2.start(now + 0.12);
    osc2.stop(now + 0.65);
  } catch (err) {
    console.debug('Web Audio not allowed or unavailable before interaction', err);
  }
}
