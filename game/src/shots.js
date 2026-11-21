// Lantern Harbor — the screenshot scenes behind ?shot=start|play|level2|win.
// Each one sets the real game state (found rings, counter, timer, score) and
// returns after one paint, so the frame is what a player really sees — the
// same code, the same rules, staged deterministically for the camera.
import { SCENES } from './scenes.js';

function markFound(game, levelIndex, ids, score, secondsLeft) {
  game.levelIndex = levelIndex;
  game.found = new Set(ids);
  game.score = score;
  game.timeLeft = secondsLeft;
  game.screen = 'play';
  game.hintsLeft = 3;
  game.hintId = null;
  game.misses = [];
}

/** Stage `name` on `game` (start, play, level2 or win) and return the screen. */
export function stageShot(name, game, ui) {
  if (name === 'play') {
    // Mid-hunt on the harbour: 3 found and circled, 4 still to find.
    markFound(game, 0, ['beam', 'sail', 'lamp'], 350, 142);
    ui.banner.innerHTML = '';
    ui.banner.classList.add('hidden');
    return 'play';
  }
  if (name === 'level2') {
    // Mid-hunt in the garden: 2 found, 5 still to find, clock ticking.
    markFound(game, 1, ['butterfly', 'frog'], 520, 118);
    ui.banner.innerHTML = '';
    ui.banner.classList.add('hidden');
    return 'play';
  }
  if (name === 'win') {
    // The win screen over the finished market: all 7 circled.
    markFound(game, 2, SCENES[2].diffs.map((d) => d.id), 2140, 64);
    game.totalFound = 21;
    game.screen = 'win';
    game.refreshHud();
    ui.banner.innerHTML =
      `<h2>You found them all!</h2>` +
      `<p class="big">Final score: 2140</p>` +
      `<p>All 21 differences across 3 scenes — harbour, garden and market.</p>` +
      `<p>Best score: 2140</p>` +
      `<button type="button">Play again</button>`;
    ui.banner.classList.remove('hidden');
    return 'win';
  }
  // Anything else is the title screen over the harbour.
  game.levelIndex = 0;
  game.found = new Set();
  game.score = 0;
  game.timeLeft = 180;
  game.screen = 'title';
  ui.banner.innerHTML =
    `<h2>Lantern Harbor</h2>` +
    `<p>Two pictures of the same place — but 7 things changed between them.</p>` +
    `<p>Find all 7 on each of the 3 scenes before the 3:00 timer runs out.</p>` +
    `<p>Click a difference on either picture. Hints cost 50 points, wrong clicks cost 25 — and finds in a row build a combo bonus up to +100.</p>` +
    `<button type="button">Start hunting</button>`;
  ui.banner.classList.remove('hidden');
  return 'title';
}
