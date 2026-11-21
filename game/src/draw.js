// Lantern Harbor — the painter: two panels side by side on one canvas, plus
// the rings that mark a found difference, the pulsing hint ring and the red
// crosses left by a wrong click.
export const STAGE_W = 600;
export const STAGE_H = 520;
export const STAGE_Y = 20;
export const LEFT_PANEL_X = 10;
export const RIGHT_PANEL_X = 630;

const RING_GREEN = '#7ee081';
const RING_GOLD = '#ffd94d';
const MISS_RED = '#ff5a4d';

export function framePanel(ctx, x) {
  ctx.save();
  ctx.strokeStyle = '#0b1220';
  ctx.lineWidth = 6;
  ctx.strokeRect(x - 3, STAGE_Y - 3, STAGE_W + 6, STAGE_H + 6);
  ctx.strokeStyle = '#ffd97a';
  ctx.lineWidth = 2;
  ctx.strokeRect(x - 3, STAGE_Y - 3, STAGE_W + 6, STAGE_H + 6);
  ctx.restore();
}

export function paintScene(ctx, scene, changedIds, panelX) {
  ctx.save();
  ctx.beginPath();
  ctx.rect(panelX, STAGE_Y, STAGE_W, STAGE_H);
  ctx.clip();
  ctx.translate(panelX, STAGE_Y);
  scene.draw(ctx, changedIds);
  ctx.restore();
}

function circleAt(ctx, panelX, diff, color, width) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.beginPath();
  ctx.arc(panelX + diff.x, STAGE_Y + diff.y, diff.r, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();
}

function tickOnRing(ctx, panelX, diff) {
  // A small tick on the ring so a find reads at a glance.
  ctx.save();
  ctx.strokeStyle = RING_GREEN;
  ctx.lineWidth = 5;
  ctx.lineCap = 'round';
  const cx = panelX + diff.x;
  const cy = STAGE_Y + diff.y;
  ctx.beginPath();
  ctx.moveTo(cx - diff.r * 0.45, cy);
  ctx.lineTo(cx - diff.r * 0.1, cy + diff.r * 0.35);
  ctx.lineTo(cx + diff.r * 0.5, cy - diff.r * 0.35);
  ctx.stroke();
  ctx.restore();
}

function badgeOnEmptySide(ctx, panelX, diff, side) {
  const badge = side === 'right' ? '+' : '−';
  ctx.save();
  ctx.strokeStyle = RING_GREEN;
  ctx.lineWidth = 4;
  ctx.setLineDash([8, 7]);
  ctx.beginPath();
  ctx.arc(panelX + diff.x, STAGE_Y + diff.y, diff.r, 0, Math.PI * 2);
  ctx.stroke();
  ctx.setLineDash([]);
  // Gold badge disc on top of the ring carrying the + / − mark.
  const bx = panelX + diff.x;
  const by = STAGE_Y + diff.y - diff.r;
  ctx.fillStyle = RING_GOLD;
  ctx.beginPath();
  ctx.arc(bx, by, 11, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#101623';
  ctx.font = 'bold 15px "Trebuchet MS", sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(badge, bx, by + 1);
  ctx.restore();
}

function objectLivesHere(diff, panelX) {
  // side: 'both' = the object is visible in both panels; 'left'/'right' =
  // it exists in only one panel (added or removed).
  const side = diff.side || 'both';
  if (side === 'both') return true;
  if (side === 'left') return panelX === LEFT_PANEL_X;
  return panelX === RIGHT_PANEL_X;
}

export function markFoundRings(ctx, scene, foundIds) {
  for (const diff of scene.diffs) {
    if (!foundIds.has(diff.id)) continue;
    for (const panelX of [LEFT_PANEL_X, RIGHT_PANEL_X]) {
      if (objectLivesHere(diff, panelX)) {
        circleAt(ctx, panelX, diff, RING_GREEN, 5);
        tickOnRing(ctx, panelX, diff);
      } else {
        // On the empty side a solid ring would look like a misplaced marker
        // circling nothing, so the empty side gets a dashed ring plus a
        // + / − badge that reads as "something appeared / disappeared here"
        // instead of a bug.
        badgeOnEmptySide(ctx, panelX, diff, diff.side || 'both');
      }
    }
  }
}

export function pulseHintRing(ctx, scene, hintId, pulse) {
  if (!hintId) return;
  const diff = scene.diffs.find((d) => d.id === hintId);
  if (!diff) return;
  const radius = diff.r + 6 + Math.sin(pulse * 6) * 4;
  for (const panelX of [LEFT_PANEL_X, RIGHT_PANEL_X]) {
    ctx.save();
    ctx.strokeStyle = RING_GOLD;
    ctx.lineWidth = 4;
    ctx.setLineDash([10, 8]);
    ctx.beginPath();
    ctx.arc(panelX + diff.x, STAGE_Y + diff.y, radius, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }
}

export function drawMissCrosses(ctx, misses, now) {
  for (const miss of misses) {
    const age = (now - miss.at) / 1000;
    if (age > 0.9) continue;
    ctx.save();
    ctx.globalAlpha = 1 - age / 0.9;
    ctx.strokeStyle = MISS_RED;
    ctx.lineWidth = 5;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(miss.x - 12, miss.y - 12);
    ctx.lineTo(miss.x + 12, miss.y + 12);
    ctx.moveTo(miss.x + 12, miss.y - 12);
    ctx.lineTo(miss.x - 12, miss.y + 12);
    ctx.stroke();
    ctx.restore();
  }
}
