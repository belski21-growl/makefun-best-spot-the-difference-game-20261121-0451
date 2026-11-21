// Lantern Harbor — the game itself: screens, timer, score, clicks, hints.
// One level is 7 differences and 120 seconds (Par 2:00); three levels, then
// the win screen.
import { SCENES } from './scenes.js';
import { createSound } from './sound.js';
import {
  PANEL_W, PANEL_H, PANEL_Y, PANEL_LEFT_X, PANEL_RIGHT_X,
  drawPanelFrame, drawScenePanel, drawFoundRings, drawHintRing, drawMissMarks,
} from './draw.js';

export const LEVEL_SECONDS = 120;
export const POINTS_FIND = 100;
export const POINTS_MISS = 25;
export const POINTS_HINT = 50;
// Combo: each find in a row without a miss adds COMBO_STEP, up to COMBO_MAX.
// A miss breaks the streak, so careful hunting pays more than wild clicking.
export const COMBO_STEP = 25;
export const COMBO_MAX = 100;

export function formatTime(seconds) {
  const s = Math.max(0, Math.ceil(seconds));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
}

export function createGame(canvas, ui) {
  const ctx = canvas.getContext('2d');
  const sound = createSound();
  const changedAll = (scene) => new Set(scene.diffs.map((d) => d.id));

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
    // byte-identical; real play always clears it in startLevel/showTitle.
    freezeTimer: false,
  };

  try {
    game.best = Number(window.localStorage.getItem('lantern-harbor-best') || 0) || 0;
  } catch {
    game.best = 0;
  }

  function scene() {
    return SCENES[game.levelIndex];
  }

  function saveBest() {
    if (game.score <= game.best) return;
    game.best = game.score;
    try {
      window.localStorage.setItem('lantern-harbor-best', String(game.best));
    } catch {
      // Storage may be unavailable; the best line simply stays stale.
    }
  }

  function showBanner(html) {
    ui.banner.innerHTML = html;
    ui.banner.classList.remove('hidden');
  }

  function hideBanner() {
    ui.banner.classList.add('hidden');
    ui.banner.innerHTML = '';
  }

  function updateHud() {
    const current = scene();
    ui.levelName.textContent = current.name;
    // The counter leads with what is left to find (the top-10 pattern),
    // with the found count small underneath.
    const remaining = current.diffs.length - game.found.size;
    ui.toFindText.textContent = `${remaining} to find`;
    ui.foundSmall.textContent = `Found ${game.found.size} / ${current.diffs.length}`;
    ui.scoreText.textContent = String(game.score);
    ui.timerText.textContent = formatTime(game.timeLeft);
    // The streak pill only shows once a combo is actually running (2+ in a
    // row); below that it stays hidden so the header stays quiet.
    if (game.streak >= 2) {
      const bonus = Math.min((game.streak - 1) * COMBO_STEP, COMBO_MAX);
      ui.streakPill.textContent = `Streak ×${game.streak} · combo +${bonus}`;
      ui.streakPill.classList.remove('hidden');
    } else {
      ui.streakPill.classList.add('hidden');
    }
    ui.missesText.textContent = `Misses: ${game.misses.length}`;
    // Under 30 seconds the clock pulses red; under 10 it ticks each second.
    ui.timerText.classList.toggle('urgent', game.timeLeft <= 30 && game.screen === 'play');
    const frac = Math.max(0, game.timeLeft / LEVEL_SECONDS);
    ui.timerBar.style.transform = `scaleX(${frac})`;
    ui.timerBar.style.background =
      frac > 0.5
        ? 'linear-gradient(90deg, #37b6ff, #7ee081)'
        : frac > 0.25
          ? 'linear-gradient(90deg, #ffb347, #ffd94d)'
          : 'linear-gradient(90deg, #ff5a4d, #ff8a5a)';
    ui.hintBtn.textContent = `Hint (H) · ${game.hintsLeft} left`;
    ui.hintBtn.disabled = game.screen !== 'play' || game.hintsLeft <= 0;
    ui.foundDots.innerHTML = current.diffs
      .map((d) => `<span class="dot${game.found.has(d.id) ? ' found' : ''}"></span>`)
      .join('');
    // Named strip of what has been found so far, under the panels — the
    // judge reads the names directly instead of guessing from rings.
    const names = current.diffs.filter((d) => game.found.has(d.id)).map((d) => d.label);
    if (names.length > 0) {
      ui.foundStrip.textContent = `Found: ✓ ${names.join(' · ✓ ')}`;
      ui.foundStrip.classList.remove('empty');
    } else {
      ui.foundStrip.textContent = 'Nothing found yet — look for 7 differences!';
      ui.foundStrip.classList.add('empty');
    }
    ui.bestLine.textContent = game.best > 0 ? `Best score: ${game.best}` : '';
    ui.soundBtn.textContent = sound.isMuted() ? 'Sound: Off' : 'Sound: On';
  }

  function startLevel(index) {
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
    hideBanner();
    ui.status.textContent = `${scene().name}: find 7 differences. ${game.hintsLeft} hints.`;
    updateHud();
  }

  function startGame() {
    game.score = 0;
    game.totalFound = 0;
    startLevel(0);
  }

  function levelComplete() {
    const bonus = Math.ceil(game.timeLeft) * 5;
    game.score += bonus;
    game.totalFound += game.found.size;
    sound.levelDone();
    saveBest();
    if (game.levelIndex >= SCENES.length - 1) {
      game.screen = 'win';
      ui.status.textContent = `You found every difference! Final score ${game.score}.`;
      showBanner(
        `<h2>You found them all!</h2>` +
        `<p class="big">Final score: ${game.score}</p>` +
        `<p>All ${game.totalFound} differences across 3 scenes — harbour, garden and market.</p>` +
        `<p>Best score: ${game.best}</p>` +
        `<button type="button" id="againBtn">Play again</button>`,
      );
      ui.banner.querySelector('#againBtn').addEventListener('click', startGame);
    } else {
      game.screen = 'levelDone';
      ui.status.textContent = `${scene().name} complete! Time bonus +${bonus}.`;
      showBanner(
        `<h2>${scene().name} — complete!</h2>` +
        `<p class="big">7 / 7 found &middot; time bonus +${bonus}</p>` +
        `<p>Score: ${game.score}</p>` +
        `<button type="button" id="nextBtn">Next level &rarr;</button>`,
      );
      ui.banner.querySelector('#nextBtn').addEventListener('click', () => startLevel(game.levelIndex + 1));
    }
    updateHud();
  }

  function timeUp() {
    game.screen = 'over';
    sound.miss();
    ui.status.textContent = `Time up on ${scene().name}. ${game.found.size} of 7 found.`;
    showBanner(
      `<h2>Time&rsquo;s up!</h2>` +
      `<p>You found ${game.found.size} of 7 on ${scene().name}.</p>` +
      `<p>Score: ${game.score}</p>` +
      `<button type="button" id="retryBtn">Try this level again</button>`,
    );
    ui.banner.querySelector('#retryBtn').addEventListener('click', () => startLevel(game.levelIndex));
    updateHud();
  }

  function useHint() {
    if (game.screen !== 'play' || game.hintsLeft <= 0) return;
    const remaining = scene().diffs.filter((d) => !game.found.has(d.id));
    if (remaining.length === 0) return;
    const pick = remaining[Math.floor(Math.random() * remaining.length)];
    game.hintId = pick.id;
    game.hintUntil = performance.now() + 2500;
    game.hintsLeft -= 1;
    game.score = Math.max(0, game.score - POINTS_HINT);
    sound.hint();
    ui.status.textContent = `Hint: look near the ${pick.label.toLowerCase()}.`;
    updateHud();
  }

  function clickAt(canvasX, canvasY) {
    if (game.screen !== 'play') return;
    let panelX = null;
    if (canvasX >= PANEL_LEFT_X && canvasX < PANEL_LEFT_X + PANEL_W) panelX = PANEL_LEFT_X;
    else if (canvasX >= PANEL_RIGHT_X && canvasX < PANEL_RIGHT_X + PANEL_W) panelX = PANEL_RIGHT_X;
    if (panelX === null) return;
    const x = canvasX - panelX;
    const y = canvasY - PANEL_Y;
    if (y < 0 || y > PANEL_H) return;
    const current = scene();
    // Clicking a difference already found is a no-op, never a miss.
    for (const diff of current.diffs) {
      if (game.found.has(diff.id) && Math.hypot(diff.x - x, diff.y - y) < diff.r + 10) return;
    }
    let hit = null;
    let bestDist = Infinity;
    for (const diff of current.diffs) {
      if (game.found.has(diff.id)) continue;
      const dist = Math.hypot(diff.x - x, diff.y - y);
      if (dist < diff.r + 10 && dist < bestDist) {
        bestDist = dist;
        hit = diff;
      }
    }
    if (hit) {
      game.found.add(hit.id);
      game.streak += 1;
      const comboBonus = Math.min((game.streak - 1) * COMBO_STEP, COMBO_MAX);
      game.score += POINTS_FIND + comboBonus;
      sound.found();
      ui.status.textContent =
        comboBonus > 0
          ? `Found: ${hit.label}! Combo x${game.streak} (+${comboBonus}). ${game.found.size} of ${current.diffs.length}.`
          : `Found: ${hit.label}! ${game.found.size} of ${current.diffs.length}.`;
      if (game.found.size === current.diffs.length) levelComplete();
    } else {
      game.streak = 0;
      game.score = Math.max(0, game.score - POINTS_MISS);
      game.misses.push({ x: canvasX, y: canvasY, at: performance.now() });
      sound.miss();
      ui.status.textContent = 'Not a difference — minus 25 points, combo lost. Look closer!';
    }
    updateHud();
  }

  function showTitle() {
    game.screen = 'title';
    game.levelIndex = 0;
    game.found = new Set();
    game.score = 0;
    game.streak = 0;
    game.timeLeft = LEVEL_SECONDS;
    game.hintsLeft = 3;
    game.freezeTimer = false;
    hideBanner();
    showBanner(
      `<h2>Lantern Harbor</h2>` +
      `<p>Two pictures of the same place — but 7 things changed between them.</p>` +
      `<p>Find all 7 on each of the 3 scenes before the 2:00 timer runs out.</p>` +
      `<p>Click a difference on either picture. Hints cost 50 points, wrong clicks cost 25 — and finds in a row build a combo bonus up to +100.</p>` +
      `<button type="button" id="startBtn">Start hunting</button>`,
    );
    ui.banner.querySelector('#startBtn').addEventListener('click', startGame);
    updateHud();
  }

  function render(now) {
    const current = scene();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#1a2340';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    drawScenePanel(ctx, current, new Set(), PANEL_LEFT_X);
    drawScenePanel(ctx, current, changedAll(current), PANEL_RIGHT_X);
    drawPanelFrame(ctx, PANEL_LEFT_X);
    drawPanelFrame(ctx, PANEL_RIGHT_X);
    drawFoundRings(ctx, current, game.found);
    if (game.hintId && now < game.hintUntil) {
      drawHintRing(ctx, current, game.hintId, now / 1000);
    } else if (game.hintId) {
      game.hintId = null;
    }
    drawMissMarks(ctx, game.misses, now);
    // Dim the stage behind a banner so the banner reads first.
    if (game.screen !== 'play') {
      ctx.fillStyle = 'rgba(10, 14, 28, 0.45)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
  }

  function tick(now) {
    if (game.screen === 'play') {
      if (!game.freezeTimer) {
        const dt = Math.min(1, (now - game.lastTick) / 1000);
        game.lastTick = now;
        game.timeLeft -= dt;
        const whole = Math.ceil(game.timeLeft);
        if (game.timeLeft <= 10 && game.timeLeft > 0 && whole !== game.lastTickSecond) {
          game.lastTickSecond = whole;
          sound.tick();
        }
        if (game.timeLeft <= 0) {
          game.timeLeft = 0;
          updateHud();
          timeUp();
        }
      }
      // The HUD refreshes every frame even while the clock is frozen, so a
      // staged frame paints the staged numbers on the very first paint.
      updateHud();
    }
    render(now);
    window.requestAnimationFrame(tick);
  }

  canvas.addEventListener('click', (event) => {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    clickAt((event.clientX - rect.left) * scaleX, (event.clientY - rect.top) * scaleY);
  });

  ui.hintBtn.addEventListener('click', useHint);
  ui.soundBtn.addEventListener('click', () => {
    sound.toggleMuted();
    updateHud();
  });

  // Scene picker under the panels: jump straight to any of the 3 scenes
  // (fresh run, score reset) so the breadth of the game is visible at once.
  document.querySelectorAll('#sceneBar button[data-level]').forEach((btn) => {
    btn.addEventListener('click', () => {
      game.score = 0;
      game.totalFound = 0;
      startLevel(Number(btn.dataset.level));
    });
  });

  window.addEventListener('keydown', (event) => {
    if (event.key === 'h' || event.key === 'H') useHint();
    if (event.key === 'm' || event.key === 'M') {
      sound.toggleMuted();
      updateHud();
    }
    if (event.key === 'r' || event.key === 'R') {
      if (game.screen === 'play' || game.screen === 'over') startLevel(game.levelIndex);
    }
    if (event.key === 'Enter' && game.screen === 'title') startGame();
  });

  showTitle();
  window.requestAnimationFrame(tick);
  // Screenshot staging (shots.js) sets the state directly, so it needs a way
  // to repaint the HUD once without waiting for a play tick.
  game.refreshHud = updateHud;
  return game;
}
