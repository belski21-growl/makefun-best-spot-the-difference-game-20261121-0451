// Lantern Harbor — boot: wire the canvas, the HUD and the keyboard to the game.
// ?shot=start|play|level2|win stages a scene for a screenshot instead of the
// title screen; ?seed=N is accepted and ignored — the scenes are fixed art.
import { createHarborGame } from './game.js';
import { poseShot } from './shots.js';

const query = new URLSearchParams(window.location.search);
const shot = query.get('shot');

const ui = {
  levelName: document.getElementById('levelName'),
  foundCounter: document.getElementById('foundCounter'),
  toFindText: document.getElementById('toFindText'),
  foundSmall: document.getElementById('foundSmall'),
  streakPill: document.getElementById('streakPill'),
  missesText: document.getElementById('missesText'),
  foundDots: document.getElementById('foundDots'),
  foundStrip: document.getElementById('foundStrip'),
  timerBar: document.getElementById('timerBar'),
  timerText: document.getElementById('timerText'),
  scoreText: document.getElementById('scoreText'),
  hintBtn: document.getElementById('hintBtn'),
  soundBtn: document.getElementById('soundBtn'),
  banner: document.getElementById('banner'),
  bestLine: document.getElementById('bestLine'),
  status: document.getElementById('status'),
};

const canvas = document.getElementById('game');
const game = createHarborGame(canvas, ui);
// Exposed for automated smoke tests (a click at a difference must raise the
// counter); the game itself never reads this.
window.__game = game;

if (shot) {
  poseShot(shot, game, ui);
  // One paint, then tell the screenshot runner the frame is ready.
  window.requestAnimationFrame(() => {
    window.requestAnimationFrame(() => {
      window.__shotReady = true;
    });
  });
}
