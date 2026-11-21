// Lantern Harbor — every sound is synthesised with WebAudio: no audio files.
// A bright chime on a find, a low buzz on a miss, a little arpeggio on a win.
export function makeSoundBank() {
  let ctx = null;
  let silent = false;

  function audioContext() {
    if (ctx === null) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      ctx = new AC();
    }
    if (ctx.state === 'suspended') ctx.resume();
    return ctx;
  }

  function blip(freq, delay, length, type, volume) {
    if (silent) return;
    const ac = audioContext();
    if (!ac) return;
    const osc = ac.createOscillator();
    const gain = ac.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(volume, ac.currentTime + delay);
    gain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + delay + length);
    osc.connect(gain);
    gain.connect(ac.destination);
    osc.start(ac.currentTime + delay);
    osc.stop(ac.currentTime + delay + length);
  }

  function arpeggio(notes) {
    notes.forEach(([freq, delay, length, type, volume]) => blip(freq, delay, length, type, volume));
  }

  return {
    found() {
      arpeggio([[660, 0, 0.14, 'sine', 0.22], [990, 0.09, 0.2, 'sine', 0.2]]);
    },
    miss() {
      blip(160, 0, 0.22, 'sawtooth', 0.12);
    },
    hint() {
      arpeggio([[520, 0, 0.12, 'triangle', 0.16], [780, 0.08, 0.14, 'triangle', 0.14]]);
    },
    tick() {
      blip(1200, 0, 0.05, 'square', 0.08);
    },
    levelDone() {
      arpeggio([[523, 0, 0.16, 'sine', 0.2], [659, 0.12, 0.16, 'sine', 0.2], [784, 0.24, 0.3, 'sine', 0.22]]);
    },
    win() {
      [523, 659, 784, 1047].forEach((f, i) => blip(f, i * 0.13, 0.3, 'sine', 0.2));
    },
    toggleMuted() {
      silent = !silent;
      return silent;
    },
    isMuted() {
      return silent;
    },
  };
}
