// Lantern Harbor — the painter: two panels side by side on one canvas, plus the
// rings that mark a found difference, the pulsing hint ring and the red miss X.
export const PANEL_W = 600;
export const PANEL_H = 520;
export const PANEL_Y = 20;
export const PANEL_LEFT_X = 10;
export const PANEL_RIGHT_X = 630;

export function drawPanelFrame(ctx, x) {
  ctx.save();
  ctx.strokeStyle = '#0b1220';
  ctx.lineWidth = 6;
  ctx.strokeRect(x - 3, PANEL_Y - 3, PANEL_W + 6, PANEL_H + 6);
  ctx.strokeStyle = '#ffd97a';
  ctx.lineWidth = 2;
  ctx.strokeRect(x - 3, PANEL_Y - 3, PANEL_W + 6, PANEL_H + 6);
  ctx.restore();
}

export function drawScenePanel(ctx, scene, changedIds, panelX) {
  ctx.save();
  ctx.beginPath();
  ctx.rect(panelX, PANEL_Y, PANEL_W, PANEL_H);
  ctx.clip();
  ctx.translate(panelX, PANEL_Y);
  scene.draw(ctx, changedIds);
  ctx.restore();
}

function ringAt(ctx, panelX, diff, color, width) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.beginPath();
  ctx.arc(panelX + diff.x, PANEL_Y + diff.y, diff.r, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();
}

export function drawFoundRings(ctx, scene, foundIds) {
  for (const diff of scene.diffs) {
    if (!foundIds.has(diff.id)) continue;
    // side: 'both' = the object is visible in both panels; 'left'/'right' =
    // it exists in only one panel (added or removed). On the empty side a
    // solid ring would look like a misplaced marker circling nothing, so the
    // empty side gets a dashed ring plus a + / − badge that reads as
    // "something appeared / disappeared here" instead of a bug.
    const side = diff.side || 'both';
    for (const panelX of [PANEL_LEFT_X, PANEL_RIGHT_X]) {
      const isObjectPanel =
        side === 'both' ||
        (side === 'left' && panelX === PANEL_LEFT_X) ||
        (side === 'right' && panelX === PANEL_RIGHT_X);
      if (isObjectPanel) {
        ringAt(ctx, panelX, diff, '#7ee081', 5);
        // A small tick on the ring so a find reads at a glance.
        ctx.save();
        ctx.strokeStyle = '#7ee081';
        ctx.lineWidth = 5;
        ctx.lineCap = 'round';
        const cx = panelX + diff.x;
        const cy = PANEL_Y + diff.y;
        ctx.beginPath();
        ctx.moveTo(cx - diff.r * 0.45, cy);
        ctx.lineTo(cx - diff.r * 0.1, cy + diff.r * 0.35);
        ctx.lineTo(cx + diff.r * 0.5, cy - diff.r * 0.35);
        ctx.stroke();
        ctx.restore();
      } else {
        const badge = side === 'right' ? '+' : '−';
        ctx.save();
        ctx.strokeStyle = '#7ee081';
        ctx.lineWidth = 4;
        ctx.setLineDash([8, 7]);
        ctx.beginPath();
        ctx.arc(panelX + diff.x, PANEL_Y + diff.y, diff.r, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);
        // Gold badge disc on top of the ring carrying the + / − mark.
        const bx = panelX + diff.x;
        const by = PANEL_Y + diff.y - diff.r;
        ctx.fillStyle = '#ffd94d';
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
    }
  }
}

export function drawHintRing(ctx, scene, hintId, pulse) {
  if (!hintId) return;
  const diff = scene.diffs.find((d) => d.id === hintId);
  if (!diff) return;
  const radius = diff.r + 6 + Math.sin(pulse * 6) * 4;
  for (const panelX of [PANEL_LEFT_X, PANEL_RIGHT_X]) {
    ctx.save();
    ctx.strokeStyle = '#ffd94d';
    ctx.lineWidth = 4;
    ctx.setLineDash([10, 8]);
    ctx.beginPath();
    ctx.arc(panelX + diff.x, PANEL_Y + diff.y, radius, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }
}

export function drawMissMarks(ctx, misses, now) {
  for (const miss of misses) {
    const age = (now - miss.at) / 1000;
    if (age > 0.9) continue;
    ctx.save();
    ctx.globalAlpha = 1 - age / 0.9;
    ctx.strokeStyle = '#ff5a4d';
    ctx.lineWidth = 5;
    ctx.lineCap = 'round';
    const x = miss.x;
    const y = miss.y;
    ctx.beginPath();
    ctx.moveTo(x - 12, y - 12);
    ctx.lineTo(x + 12, y + 12);
    ctx.moveTo(x + 12, y - 12);
    ctx.lineTo(x - 12, y + 12);
    ctx.stroke();
    ctx.restore();
  }
}
