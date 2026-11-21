// Lantern Harbor — all sound is synthesised with WebAudio: no audio files.
// A bright chime on a find, a low buzz on a miss, a little arpeggio on a win.
export function createSound() {
  let context = null;
  let muted = false;

  function ensure() {
    if (context === null) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return null;
      context = new AudioContext();
    }
    if (context.state === 'suspended') context.resume();
    return context;
  }

  function tone(freq, start, length, type, volume) {
    if (muted) return;
    const ac = ensure();
    if (!ac) return;
    const osc = ac.createOscillator();
    const gain = ac.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(volume, ac.currentTime + start);
    gain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + start + length);
    osc.connect(gain);
    gain.connect(ac.destination);
    osc.start(ac.currentTime + start);
    osc.stop(ac.currentTime + start + length);
  }

  return {
    found() {
      tone(660, 0, 0.14, 'sine', 0.22);
      tone(990, 0.09, 0.2, 'sine', 0.2);
    },
    miss() {
      tone(160, 0, 0.22, 'sawtooth', 0.12);
    },
    hint() {
      tone(520, 0, 0.12, 'triangle', 0.16);
      tone(780, 0.08, 0.14, 'triangle', 0.14);
    },
    tick() {
      tone(1200, 0, 0.05, 'square', 0.08);
    },
    levelDone() {
      tone(523, 0, 0.16, 'sine', 0.2);
      tone(659, 0.12, 0.16, 'sine', 0.2);
      tone(784, 0.24, 0.3, 'sine', 0.22);
    },
    win() {
      [523, 659, 784, 1047].forEach((f, i) => tone(f, i * 0.13, 0.3, 'sine', 0.2));
    },
    toggleMuted() {
      muted = !muted;
      return muted;
    },
    isMuted() {
      return muted;
    },
  };
}
