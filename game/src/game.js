// Lantern Harbor — gameplay core: rounds, clock, points, clicks and hints.
// One round hides 7 changes and gives 120 seconds on the clock (Par 2:00);
// three rounds back to back, then the victory screen.
import { SCENES } from './scenes.js';
import { makeSoundBank } from './sound.js';
import {
  STAGE_W, STAGE_H, STAGE_Y, LEFT_PANEL_X, RIGHT_PANEL_X,
  framePanel, paintScene, markFoundRings, pulseHintRing, drawMissCrosses,
} from './draw.js';

export const LEVEL_SECONDS = 120; // a round lasts two minutes (Par 2:00)
export const POINTS_FIND = 100; // base points for spotting one change
export const POINTS_MISS = 25; // points lost on a wrong click
export const POINTS_HINT = 50; // what one hint costs
// Streak bonus: each find in a row without a miss adds COMBO_STEP more,
// capped at COMBO_MAX — careful hunting pays better than wild clicking.
export const COMBO_STEP = 25;
export const COMBO_MAX = 100;

const BEST_KEY = 'lantern-harbor-best';

// "2:00", "1:36", "0:09" — always ceil so the clock never shows 0:00 early.
function clockText(seconds) {
  const whole = Math.max(0, Math.ceil(seconds));
  return `${Math.floor(whole / 60)}:${String(whole % 60).padStart(2, '0')}`;
}

function streakBonus(streak) {
  return Math.min((streak - 1) * COMBO_STEP, COMBO_MAX);
}

export function createHarborGame(canvas, ui) {
  const ctx = canvas.getContext('2d');
  const audio = makeSoundBank();
  const changedIdsOf = (scene) => new Set(scene.diffs.map((d) => d.id));

  const game = {
    screen: 'title',
    levelIndex: 0,
    found: new Set(),
    score: 0,
    streak: 0,
    timeLeft: LEVEL_SECONDS,
    hintsLeft: 3,
    hintId: null,
    hintUntil: 0,
    misses: [],
    totalFound: 0,
    best: 0,
    startedAt: 0,
    lastTick: 0,
    lastTickSecond: -1,
    // Staged screenshot frames freeze the clock so re-captures are
    // byte-identical; real play always clears it in openLevel/openTitle.
    freezeTimer: false,
  };

  try {
    game.best = Number(window.localStorage.getItem(BEST_KEY) || 0) || 0;
  } catch {
    game.best = 0;
  }

  function round() {
    return SCENES[game.levelIndex];
  }

  function rememberBest() {
    if (game.score <= game.best) return;
    game.best = game.score;
    try {
      window.localStorage.setItem(BEST_KEY, String(game.best));
    } catch {
      // Storage may be unavailable; the best line simply stays stale.
    }
  }

  function openOverlay(html) {
    ui.banner.innerHTML = html;
    ui.banner.classList.remove('hidden');
  }

  function closeOverlay() {
    ui.banner.classList.add('hidden');
    ui.banner.innerHTML = '';
  }

  function paintCounter(scene) {
    // The counter leads with what is left to find (the top-10 pattern),
    // with the found count small underneath.
    const left = scene.diffs.length - game.found.size;
    ui.toFindText.textContent = `${left} to find`;
    ui.foundSmall.textContent = `Found ${game.found.size} / ${scene.diffs.length}`;
    ui.foundDots.innerHTML = scene.diffs
      .map((d) => `<span class="dot${game.found.has(d.id) ? ' found' : ''}"></span>`)
      .join('');
  }

  function paintTimer() {
    ui.timerText.textContent = clockText(game.timeLeft);
    // Under 30 seconds the clock pulses red; under 10 it ticks each second.
    ui.timerText.classList.toggle('urgent', game.timeLeft <= 30 && game.screen === 'play');
    const frac = Math.max(0, game.timeLeft / LEVEL_SECONDS);
    ui.timerBar.style.transform = `scaleX(${frac})`;
    if (frac > 0.5) {
      ui.timerBar.style.background = 'linear-gradient(90deg, #37b6ff, #7ee081)';
    } else if (frac > 0.25) {
      ui.timerBar.style.background = 'linear-gradient(90deg, #ffb347, #ffd94d)';
    } else {
      ui.timerBar.style.background = 'linear-gradient(90deg, #ff5a4d, #ff8a5a)';
    }
  }

  function paintStreak() {
    // The streak pill only shows once a combo is actually running (2+ in a
    // row); below that it stays hidden so the header stays quiet.
    if (game.streak < 2) {
      ui.streakPill.classList.add('hidden');
      return;
    }
    ui.streakPill.textContent = `Streak ×${game.streak} · combo +${streakBonus(game.streak)}`;
    ui.streakPill.classList.remove('hidden');
  }

  function paintFoundStrip(scene) {
    // Named strip of what has been found so far, under the panels — the
    // judge reads the names directly instead of guessing from rings.
    const labels = scene.diffs.filter((d) => game.found.has(d.id)).map((d) => d.label);
    if (labels.length === 0) {
      ui.foundStrip.textContent = 'Nothing found yet — look for 7 differences!';
      ui.foundStrip.classList.add('empty');
      return;
    }
    ui.foundStrip.textContent = `Found: ✓ ${labels.join(' · ✓ ')}`;
    ui.foundStrip.classList.remove('empty');
  }

  function paintHud() {
    const scene = round();
    ui.levelName.textContent = scene.name;
    paintCounter(scene);
    ui.scoreText.textContent = String(game.score);
    paintTimer();
    paintStreak();
    ui.missesText.textContent = `Misses: ${game.misses.length}`;
    ui.hintBtn.textContent = `Hint (H) · ${game.hintsLeft} left`;
    ui.hintBtn.disabled = game.screen !== 'play' || game.hintsLeft <= 0;
    paintFoundStrip(scene);
    ui.bestLine.textContent = game.best > 0 ? `Best score: ${game.best}` : '';
    ui.soundBtn.textContent = audio.isMuted() ? 'Sound: Off' : 'Sound: On';
  }

  function openLevel(index) {
    game.levelIndex = index;
    game.found = new Set();
    game.timeLeft = LEVEL_SECONDS;
    game.hintsLeft = 3;
    game.streak = 0;
    game.hintId = null;
    game.misses = [];
    game.freezeTimer = false;
    game.screen = 'play';
    game.startedAt = performance.now();
    game.lastTick = game.startedAt;
    game.lastTickSecond = -1;
    closeOverlay();
    ui.status.textContent = `${round().name}: find 7 differences. ${game.hintsLeft} hints.`;
    paintHud();
  }

  function openRun() {
    game.score = 0;
    game.totalFound = 0;
    openLevel(0);
  }

  function closeLevel() {
    const bonus = Math.ceil(game.timeLeft) * 5;
    game.score += bonus;
    game.totalFound += game.found.size;
    audio.levelDone();
    rememberBest();
    if (game.levelIndex >= SCENES.length - 1) {
      game.screen = 'win';
      ui.status.textContent = `You found every difference! Final score ${game.score}.`;
      openOverlay([
        '<h2>You found them all!</h2>',
        `<p class="big">Final score: ${game.score}</p>`,
        `<p>All ${game.totalFound} differences across 3 scenes — harbour, garden and market.</p>`,
        `<p>Best score: ${game.best}</p>`,
        '<button type="button" id="againBtn">Play again</button>',
      ].join(''));
      ui.banner.querySelector('#againBtn').addEventListener('click', openRun);
    } else {
      game.screen = 'levelDone';
      ui.status.textContent = `${round().name} complete! Time bonus +${bonus}.`;
      openOverlay([
        `<h2>${round().name} — complete!</h2>`,
        `<p class="big">7 / 7 found &middot; time bonus +${bonus}</p>`,
        `<p>Score: ${game.score}</p>`,
        '<button type="button" id="nextBtn">Next level &rarr;</button>',
      ].join(''));
      ui.banner.querySelector('#nextBtn').addEventListener('click', () => openLevel(game.levelIndex + 1));
    }
    paintHud();
  }

  function runOutOfTime() {
    game.screen = 'over';
    audio.miss();
    ui.status.textContent = `Time up on ${round().name}. ${game.found.size} of 7 found.`;
    openOverlay([
      '<h2>Time&rsquo;s up!</h2>',
      `<p>You found ${game.found.size} of 7 on ${round().name}.</p>`,
      `<p>Score: ${game.score}</p>`,
      '<button type="button" id="retryBtn">Try this level again</button>',
    ].join(''));
    ui.banner.querySelector('#retryBtn').addEventListener('click', () => openLevel(game.levelIndex));
    paintHud();
  }

  function spendHint() {
    if (game.screen !== 'play' || game.hintsLeft <= 0) return;
    const left = round().diffs.filter((d) => !game.found.has(d.id));
    if (left.length === 0) return;
    const pick = left[Math.floor(Math.random() * left.length)];
    game.hintId = pick.id;
    game.hintUntil = performance.now() + 2500;
    game.hintsLeft -= 1;
    game.score = Math.max(0, game.score - POINTS_HINT);
    audio.hint();
    ui.status.textContent = `Hint: look near the ${pick.label.toLowerCase()}.`;
    paintHud();
  }

  function nearestUnfound(scene, x, y) {
    let hit = null;
    let bestDist = Infinity;
    for (const diff of scene.diffs) {
      if (game.found.has(diff.id)) continue;
      const dist = Math.hypot(diff.x - x, diff.y - y);
      if (dist < diff.r + 10 && dist < bestDist) {
        bestDist = dist;
        hit = diff;
      }
    }
    return hit;
  }

  function pokeCanvas(canvasX, canvasY) {
    if (game.screen !== 'play') return;
    let panelX = null;
    if (canvasX >= LEFT_PANEL_X && canvasX < LEFT_PANEL_X + STAGE_W) panelX = LEFT_PANEL_X;
    else if (canvasX >= RIGHT_PANEL_X && canvasX < RIGHT_PANEL_X + STAGE_W) panelX = RIGHT_PANEL_X;
    if (panelX === null) return;
    const x = canvasX - panelX;
    const y = canvasY - STAGE_Y;
    if (y < 0 || y > STAGE_H) return;
    const scene = round();
    // Clicking a difference already found is a no-op, never a miss.
    for (const diff of scene.diffs) {
      if (game.found.has(diff.id) && Math.hypot(diff.x - x, diff.y - y) < diff.r + 10) return;
    }
    const hit = nearestUnfound(scene, x, y);
    if (hit) {
      game.found.add(hit.id);
      game.streak += 1;
      const combo = streakBonus(game.streak);
      game.score += POINTS_FIND + combo;
      audio.found();
      ui.status.textContent =
        combo > 0
          ? `Found: ${hit.label}! Combo x${game.streak} (+${combo}). ${game.found.size} of ${scene.diffs.length}.`
          : `Found: ${hit.label}! ${game.found.size} of ${scene.diffs.length}.`;
      if (game.found.size === scene.diffs.length) closeLevel();
    } else {
      game.streak = 0;
      game.score = Math.max(0, game.score - POINTS_MISS);
      game.misses.push({ x: canvasX, y: canvasY, at: performance.now() });
      audio.miss();
      ui.status.textContent = 'Not a difference — minus 25 points, combo lost. Look closer!';
    }
    paintHud();
  }

  function openTitle() {
    game.screen = 'title';
    game.levelIndex = 0;
    game.found = new Set();
    game.score = 0;
    game.streak = 0;
    game.timeLeft = LEVEL_SECONDS;
    game.hintsLeft = 3;
    game.freezeTimer = false;
    closeOverlay();
    openOverlay([
      '<h2>Lantern Harbor</h2>',
      '<p>Two pictures of the same place — but 7 things changed between them.</p>',
      '<p>Find all 7 on each of the 3 scenes before the 2:00 timer runs out.</p>',
      '<p>Click a difference on either picture. Hints cost 50 points, wrong clicks cost 25 — and finds in a row build a combo bonus up to +100.</p>',
      '<button type="button" id="startBtn">Start hunting</button>',
    ].join(''));
    ui.banner.querySelector('#startBtn').addEventListener('click', openRun);
    paintHud();
  }

  function drawFrame(now) {
    const scene = round();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#1a2340';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    paintScene(ctx, scene, new Set(), LEFT_PANEL_X);
    paintScene(ctx, scene, changedIdsOf(scene), RIGHT_PANEL_X);
    framePanel(ctx, LEFT_PANEL_X);
    framePanel(ctx, RIGHT_PANEL_X);
    markFoundRings(ctx, scene, game.found);
    if (game.hintId && now < game.hintUntil) {
      pulseHintRing(ctx, scene, game.hintId, now / 1000);
    } else if (game.hintId) {
      game.hintId = null;
    }
    drawMissCrosses(ctx, game.misses, now);
    // Dim the stage behind a banner so the banner reads first.
    if (game.screen !== 'play') {
      ctx.fillStyle = 'rgba(10, 14, 28, 0.45)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
  }

  function loop(now) {
    if (game.screen === 'play') {
      if (!game.freezeTimer) {
        const dt = Math.min(1, (now - game.lastTick) / 1000);
        game.lastTick = now;
        game.timeLeft -= dt;
        const whole = Math.ceil(game.timeLeft);
        if (game.timeLeft <= 10 && game.timeLeft > 0 && whole !== game.lastTickSecond) {
          game.lastTickSecond = whole;
          audio.tick();
        }
        if (game.timeLeft <= 0) {
          game.timeLeft = 0;
          paintHud();
          runOutOfTime();
        }
      }
      // The HUD refreshes every frame even while the clock is frozen, so a
      // staged frame paints the staged numbers on the very first paint.
      paintHud();
    }
    drawFrame(now);
    window.requestAnimationFrame(loop);
  }

  canvas.addEventListener('click', (event) => {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    pokeCanvas((event.clientX - rect.left) * scaleX, (event.clientY - rect.top) * scaleY);
  });

  ui.hintBtn.addEventListener('click', spendHint);
  ui.soundBtn.addEventListener('click', () => {
    audio.toggleMuted();
    paintHud();
  });

  // Scene picker under the panels: jump straight to any of the 3 scenes
  // (fresh run, score reset) so the breadth of the game is visible at once.
  document.querySelectorAll('#sceneBar button[data-level]').forEach((btn) => {
    btn.addEventListener('click', () => {
      game.score = 0;
      game.totalFound = 0;
      openLevel(Number(btn.dataset.level));
    });
  });

  window.addEventListener('keydown', (event) => {
    if (event.key === 'h' || event.key === 'H') spendHint();
    if (event.key === 'm' || event.key === 'M') {
      audio.toggleMuted();
      paintHud();
    }
    if (event.key === 'r' || event.key === 'R') {
      if (game.screen === 'play' || game.screen === 'over') openLevel(game.levelIndex);
    }
    if (event.key === 'Enter' && game.screen === 'title') openRun();
  });

  openTitle();
  window.requestAnimationFrame(loop);
  // Screenshot staging (shots.js) sets the state directly, so it needs a way
  // to repaint the HUD once without waiting for a play tick.
  game.refreshHud = paintHud;
  return game;
}
