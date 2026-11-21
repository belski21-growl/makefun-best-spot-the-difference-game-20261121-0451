// Lantern Harbor — the three hand-drawn scenes. Every picture is painted in
// code; nothing is pasted in from outside. One scene fills a 600 x 520 unit
// stage and is painted twice: the original (left panel) and the same picture
// with its 7 differences applied (right panel). A difference carries an id, a
// label, a click point and a ring radius: { id, label, x, y, r, side }.
import { createDice } from "./rng.js";

function paintSky(ctx, topColor, midColor, lowColor, skyHeight) {
  const wash = ctx.createLinearGradient(0, 0, 0, skyHeight);
  wash.addColorStop(0, topColor);
  wash.addColorStop(0.6, midColor);
  wash.addColorStop(1, lowColor);
  ctx.fillStyle = wash;
  ctx.fillRect(0, 0, 600, skyHeight);
}

function paintDisc(ctx, cx, cy, radius, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.fill();
}

function paintOval(ctx, cx, cy, rx, ry, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
  ctx.fill();
}

function paintBlock(ctx, x, y, w, h, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, w, h);
}

function paintPoly(ctx, corners, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(corners[0][0], corners[0][1]);
  for (let n = 1; n < corners.length; n += 1) {
    ctx.lineTo(corners[n][0], corners[n][1]);
  }
  ctx.closePath();
  ctx.fill();
}

function paintGull(ctx, cx, cy, scale, color) {
  ctx.strokeStyle = color;
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(cx - 12 * scale, cy);
  ctx.quadraticCurveTo(cx - 5 * scale, cy - 8 * scale, cx, cy);
  ctx.quadraticCurveTo(cx + 5 * scale, cy - 8 * scale, cx + 12 * scale, cy);
  ctx.stroke();
}

function paintStar(ctx, cx, cy, radius, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  for (let p = 0; p < 5; p += 1) {
    const angle = -Math.PI / 2 + (p * 4 * Math.PI) / 5;
    const px = cx + Math.cos(angle) * radius;
    const py = cy + Math.sin(angle) * radius;
    if (p === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
  ctx.fill();
}

function paintCloud(ctx, cx, cy, scale, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(cx, cy, 20 * scale, 0, Math.PI * 2);
  ctx.arc(cx + 22 * scale, cy - 8 * scale, 16 * scale, 0, Math.PI * 2);
  ctx.arc(cx + 44 * scale, cy, 18 * scale, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillRect(cx - 18 * scale, cy, 80 * scale, 14 * scale);
}

// ------------------------------------------------------------------ scene 1
function renderHarbor(ctx, changedIds) {
  const rand = createDice(11);
  paintSky(ctx, '#232f5e', '#c96a4e', '#f7c873', 310);
  // Early stars in the dusk sky.
  for (let i = 0; i < 26; i += 1) {
    paintDisc(ctx, rand() * 600, rand() * 130, 1 + rand() * 1.8, 'rgba(255,244,200,0.9)');
  }
  paintDisc(ctx, 92, 92, 34, '#ffe9a8');
  paintDisc(ctx, 92, 92, 26, '#fff3c4');
  paintCloud(ctx, 200, 70, 1, 'rgba(255,220,190,0.85)');
  paintCloud(ctx, 420, 46, 0.8, 'rgba(255,220,190,0.7)');
  paintGull(ctx, 300, 90, 1, '#2c2440');
  paintGull(ctx, 350, 70, 0.8, '#2c2440');
  paintGull(ctx, 260, 120, 0.7, '#2c2440');
  if (changedIds.has('gulls')) paintGull(ctx, 520, 66, 1, '#2c2440');
  // Sea.
  paintBlock(ctx, 0, 300, 600, 220, '#1d4e6b');
  paintBlock(ctx, 0, 300, 600, 10, '#2f7ea6');
  ctx.strokeStyle = 'rgba(180,230,255,0.55)';
  ctx.lineWidth = 3;
  for (let i = 0; i < 9; i += 1) {
    const waveY = 330 + i * 20;
    ctx.beginPath();
    for (let x = 0; x <= 600; x += 30) {
      ctx.lineTo(x, waveY + Math.sin(x / 60 + i) * 4);
    }
    ctx.stroke();
  }
  // Rocky islet with the lighthouse: a low mound at the waterline, the tower
  // standing on it from y 250 down to the rocks at y 442.
  paintPoly(ctx, [[385, 520], [408, 442], [492, 442], [515, 520]], '#5a4a3a');
  paintPoly(ctx, [[400, 480], [420, 442], [480, 442], [500, 480]], '#6e5c46');
  paintBlock(ctx, 428, 250, 44, 192, '#f3ead8');
  paintBlock(ctx, 428, 282, 44, 14, '#c0392b');
  paintBlock(ctx, 428, 322, 44, 14, '#c0392b');
  paintBlock(ctx, 428, 362, 44, 14, '#c0392b');
  paintBlock(ctx, 422, 226, 56, 24, '#2c3e50');
  paintBlock(ctx, 432, 233, 12, 10, changedIds.has('lamp') ? '#22303f' : '#ffe27a');
  paintBlock(ctx, 452, 233, 12, 10, changedIds.has('lamp') ? '#22303f' : '#ffe27a');
  paintBlock(ctx, 418, 216, 64, 10, '#7a4d12');
  paintDisc(ctx, 450, 211, 7, '#c0392b');
  if (changedIds.has('flag')) {
    ctx.strokeStyle = '#3a2c1c';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(450, 211);
    ctx.lineTo(450, 186);
    ctx.stroke();
    paintPoly(ctx, [[450, 186], [480, 194], [450, 204]], '#e74c3c');
  }
  if (!changedIds.has('beam')) {
    ctx.fillStyle = 'rgba(255,226,122,0.22)';
    ctx.beginPath();
    ctx.moveTo(422, 238);
    ctx.lineTo(180, 206);
    ctx.lineTo(180, 268);
    ctx.closePath();
    ctx.fill();
  }
  // Sailboat, left of the rocks.
  paintPoly(ctx, [[150, 300], [150, 196], [152, 196], [152, 300]], '#5a3a22');
  paintPoly(ctx, [[154, 200], [154, 292], [216, 292]], changedIds.has('sail') ? '#1f8a70' : '#c0392b');
  paintPoly(ctx, [[148, 206], [148, 292], [104, 292]], '#f3ead8');
  paintPoly(ctx, [[96, 292], [228, 292], [210, 314], [112, 314]], '#6e4a2f');
  // Rowboat, right of the rocks.
  paintPoly(ctx, [[540, 380], [580, 380], [568, 398], [552, 398]], '#8a5a2b');
  paintBlock(ctx, 552, 366, 6, 26, '#5a3a22');
  // Pier from the left shore.
  paintBlock(ctx, 0, 430, 190, 14, '#7a5a38');
  paintBlock(ctx, 24, 444, 10, 40, '#5a3a22');
  paintBlock(ctx, 90, 444, 10, 40, '#5a3a22');
  paintBlock(ctx, 156, 444, 10, 40, '#5a3a22');
  paintDisc(ctx, 40, 424, 7, '#ffd97a');
  paintDisc(ctx, 110, 424, 7, '#ffd97a');
  // Buoy bobbing near the rocks.
  if (!changedIds.has('buoy')) {
    paintDisc(ctx, 520, 420, 13, '#e67e22');
    paintBlock(ctx, 514, 402, 12, 8, '#c0392b');
  }
  // A fish jumps clear of the water, left side.
  if (changedIds.has('fish')) {
    paintOval(ctx, 120, 428, 16, 7, '#7fb3d5');
    paintPoly(ctx, [[136, 428], [148, 420], [148, 436]], '#5a8ab0');
    ctx.strokeStyle = 'rgba(255,255,255,0.8)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(120, 448, 14, Math.PI, 0);
    ctx.stroke();
  }
}

// ------------------------------------------------------------------ scene 2
function renderGarden(ctx, changedIds) {
  const rand = createDice(23);
  paintSky(ctx, '#8fd0ff', '#cfeef7', '#e8f7d8', 520);
  paintDisc(ctx, 500, 70, 36, '#ffd94d');
  for (let i = 0; i < 12; i += 1) {
    const ray = (i / 12) * Math.PI * 2;
    ctx.strokeStyle = '#ffd94d';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(500 + Math.cos(ray) * 44, 70 + Math.sin(ray) * 44);
    ctx.lineTo(500 + Math.cos(ray) * 56, 70 + Math.sin(ray) * 56);
    ctx.stroke();
  }
  paintCloud(ctx, 120, 70, 1, 'rgba(255,255,255,0.95)');
  paintCloud(ctx, 330, 46, 0.7, 'rgba(255,255,255,0.9)');
  // Big tree, left.
  paintBlock(ctx, 96, 250, 26, 150, '#6e4a2f');
  paintDisc(ctx, 110, 210, 84, '#3f9e4d');
  paintDisc(ctx, 60, 250, 54, '#57b25e');
  paintDisc(ctx, 165, 250, 54, '#4cab55');
  paintDisc(ctx, 110, 160, 56, '#6fbf6a');
  const applePoints = [[78, 200], [140, 178], [96, 246], [168, 222]];
  const shownApples = changedIds.has('apples') ? applePoints.slice(0, 3) : applePoints;
  for (const [ax, ay] of shownApples) paintDisc(ctx, ax, ay, 9, '#e74c3c');
  // Bird on a branch — or an empty branch.
  ctx.strokeStyle = '#6e4a2f';
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.moveTo(150, 250);
  ctx.lineTo(196, 216);
  ctx.stroke();
  if (!changedIds.has('bird')) {
    paintOval(ctx, 186, 206, 16, 10, '#5b7fd4');
    paintDisc(ctx, 198, 198, 7, '#5b7fd4');
    paintPoly(ctx, [[204, 198], [212, 201], [204, 203]], '#f39c12');
  }
  // Fence across the middle.
  paintBlock(ctx, 0, 330, 600, 10, '#c9a06a');
  for (let x = 10; x < 600; x += 52) paintBlock(ctx, x, 300, 12, 74, '#b08a54');
  // Flower bed along the bottom.
  paintBlock(ctx, 0, 430, 600, 90, '#69a84f');
  const blooms = [
    [60, 470, '#e74c3c'], [130, 486, '#f39c12'], [200, 466, '#e74c3c'],
    [270, 486, '#9b59b6'], [340, 468, '#e74c3c'], [410, 486, '#f39c12'],
    [480, 470, '#e74c3c'], [550, 486, '#9b59b6'],
  ];
  for (const [fx, fy, fc] of blooms) {
    ctx.strokeStyle = '#2f7a33';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(fx, 512);
    ctx.lineTo(fx, fy + 8);
    ctx.stroke();
    for (let p = 0; p < 5; p += 1) {
      const petalAngle = (p / 5) * Math.PI * 2;
      paintDisc(ctx, fx + Math.cos(petalAngle) * 8, fy + Math.sin(petalAngle) * 8, 6, fc);
    }
    paintDisc(ctx, fx, fy, 6, '#ffd94d');
  }
  // The sunflower: yellow, or a purple impostor.
  const petalColor = changedIds.has('sunflower') ? '#9b59b6' : '#ffd94d';
  ctx.strokeStyle = '#2f7a33';
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(300, 512);
  ctx.lineTo(300, 420);
  ctx.stroke();
  for (let p = 0; p < 10; p += 1) {
    const petalAngle = (p / 10) * Math.PI * 2;
    paintOval(ctx, 300 + Math.cos(petalAngle) * 20, 400 + Math.sin(petalAngle) * 20, 12, 6, petalColor);
  }
  paintDisc(ctx, 300, 400, 16, '#7a4d12');
  // Pond with a lily pad, bottom right.
  paintOval(ctx, 470, 440, 110, 44, '#4aa3df');
  paintOval(ctx, 470, 440, 96, 36, '#6fc3ef');
  paintOval(ctx, 448, 436, 34, 12, '#3f9e4d');
  if (!changedIds.has('frog')) {
    paintDisc(ctx, 448, 424, 13, '#57b25e');
    paintDisc(ctx, 440, 412, 5, '#57b25e');
    paintDisc(ctx, 456, 412, 5, '#57b25e');
    paintDisc(ctx, 441, 411, 2, '#101623');
    paintDisc(ctx, 457, 411, 2, '#101623');
  }
  // Mushrooms by the tree.
  const fungi = changedIds.has('mushrooms')
    ? [[60, 400, 1], [96, 412, 0.8]]
    : [[60, 400, 1], [96, 412, 0.8], [128, 402, 0.7]];
  for (const [mx, my, ms] of fungi) {
    paintBlock(ctx, mx - 4 * ms, my, 8 * ms, 14 * ms, '#f3ead8');
    ctx.fillStyle = '#e74c3c';
    ctx.beginPath();
    ctx.arc(mx, my, 14 * ms, Math.PI, 0);
    ctx.fill();
    paintDisc(ctx, mx - 6 * ms, my - 6 * ms, 2, '#fff');
    paintDisc(ctx, mx + 5 * ms, my - 8 * ms, 2, '#fff');
  }
  // Butterfly over the flowers.
  const wingColor = changedIds.has('butterfly') ? '#5b7fd4' : '#f39c12';
  const butterflyX = 450;
  const butterflyY = 120;
  paintOval(ctx, butterflyX - 14, butterflyY, 14, 18, wingColor);
  paintOval(ctx, butterflyX + 14, butterflyY, 14, 18, wingColor);
  paintOval(ctx, butterflyX - 10, butterflyY + 16, 9, 11, wingColor);
  paintOval(ctx, butterflyX + 10, butterflyY + 16, 9, 11, wingColor);
  paintBlock(ctx, butterflyX - 3, butterflyY - 16, 6, 34, '#3a2c1c');
  // Snail on the garden path.
  if (!changedIds.has('snail')) {
    paintOval(ctx, 250, 474, 18, 10, '#8a6d4b');
    ctx.strokeStyle = '#8a6d4b';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(250, 474, 8, 0, Math.PI * 2);
    ctx.stroke();
    paintDisc(ctx, 250, 462, 11, '#c0392b');
    paintDisc(ctx, 246, 462, 2, '#fff');
    paintDisc(ctx, 254, 462, 2, '#fff');
  }
  // Pebbles scattered on the path.
  for (let i = 0; i < 10; i += 1) {
    paintDisc(ctx, 30 + rand() * 540, 500 + rand() * 12, 3 + rand() * 3, '#cbb89a');
  }
}

// ------------------------------------------------------------------ scene 3
function renderMarket(ctx, changedIds) {
  const rand = createDice(37);
  paintSky(ctx, '#141b3d', '#2b2f63', '#4a2c5e', 520);
  for (let i = 0; i < 40; i += 1) {
    paintDisc(ctx, rand() * 600, rand() * 150, 1 + rand() * 1.6, 'rgba(255,244,200,0.9)');
  }
  // The moon: full, or a crescent.
  paintDisc(ctx, 520, 60, 30, '#f7ead0');
  if (changedIds.has('moon')) {
    paintDisc(ctx, 534, 54, 26, '#2b2f63');
  }
  // Balloon drifting over the stalls — or not.
  if (!changedIds.has('balloon')) {
    ctx.strokeStyle = '#b9c6de';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(90, 118);
    ctx.lineTo(90, 150);
    ctx.stroke();
    paintOval(ctx, 90, 92, 22, 28, '#e74c3c');
    paintPoly(ctx, [[82, 116], [98, 116], [90, 126]], '#c0392b');
  }
  // Strings of lights across the top.
  ctx.strokeStyle = '#0b1220';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(0, 130);
  ctx.quadraticCurveTo(300, 190, 600, 120);
  ctx.stroke();
  const bulbHues = ['#ffd94d', '#ff7a6b', '#7ee081', '#7ab8ff'];
  for (let i = 0; i < 13; i += 1) {
    const t = i / 12;
    const bx = t * 600;
    const by = 130 + Math.sin(t * Math.PI) * 34;
    paintDisc(ctx, bx, by + 8, 7, bulbHues[i % 4]);
  }
  // Paper lantern, centre top.
  const lanternColor = changedIds.has('lantern') ? '#2fbf71' : '#e74c3c';
  paintOval(ctx, 300, 236, 26, 32, lanternColor);
  paintBlock(ctx, 288, 200, 24, 8, '#f39c12');
  paintBlock(ctx, 288, 264, 24, 8, '#f39c12');
  ctx.strokeStyle = '#f39c12';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(300, 272);
  ctx.lineTo(300, 292);
  ctx.stroke();
  // Left stall: jars on the table.
  paintBlock(ctx, 60, 300, 180, 16, '#7a5a38');
  paintBlock(ctx, 70, 316, 12, 90, '#5a3a22');
  paintBlock(ctx, 218, 316, 12, 90, '#5a3a22');
  paintPoly(ctx, [[50, 300], [250, 300], [240, 210], [60, 210]], '#c0392b');
  for (let i = 0; i < 5; i += 1) {
    paintBlock(ctx, 60 + i * 36, 210, 18, 90, i % 2 === 0 ? '#f3ead8' : '#c0392b');
  }
  const jarHues = changedIds.has('jars')
    ? ['#7ab8ff', '#ffd94d']
    : ['#7ab8ff', '#ffd94d', '#7ee081'];
  jarHues.forEach((hue, n) => {
    const jx = 92 + n * 48;
    paintBlock(ctx, jx - 14, 258, 28, 42, hue);
    paintBlock(ctx, jx - 8, 250, 16, 8, '#8a6d4b');
  });
  // Star (or circle) sign on the left stall.
  if (changedIds.has('sign')) {
    paintDisc(ctx, 150, 182, 16, '#ffd94d');
  } else {
    paintStar(ctx, 150, 182, 18, '#ffd94d');
  }
  // Right stall: striped awning, crates, cat.
  const stripeColor = changedIds.has('awning') ? '#5b7fd4' : '#c0392b';
  paintPoly(ctx, [[360, 300], [560, 300], [550, 210], [370, 210]], stripeColor);
  for (let i = 0; i < 5; i += 1) {
    paintBlock(ctx, 370 + i * 36, 210, 18, 90, i % 2 === 0 ? '#f3ead8' : stripeColor);
  }
  paintBlock(ctx, 370, 300, 180, 16, '#7a5a38');
  paintBlock(ctx, 380, 316, 12, 90, '#5a3a22');
  paintBlock(ctx, 528, 316, 12, 90, '#5a3a22');
  // Crates stacked by the right stall.
  paintBlock(ctx, 470, 400, 60, 60, '#b08a54');
  paintBlock(ctx, 540, 400, 60, 60, '#c9a06a');
  paintBlock(ctx, 505, 340, 60, 60, '#b08a54');
  ctx.strokeStyle = '#7a5a38';
  ctx.lineWidth = 3;
  ctx.strokeRect(470, 400, 60, 60);
  ctx.strokeRect(540, 400, 60, 60);
  ctx.strokeRect(505, 340, 60, 60);
  // The cat asleep on the crates — or an empty crate.
  if (!changedIds.has('cat')) {
    paintOval(ctx, 535, 332, 26, 12, '#2c2c34');
    paintDisc(ctx, 556, 322, 10, '#2c2c34');
    paintPoly(ctx, [[550, 314], [554, 304], [558, 314]], '#2c2c34');
    paintPoly(ctx, [[560, 314], [564, 304], [566, 314]], '#2c2c34');
    ctx.strokeStyle = '#2c2c34';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(512, 334);
    ctx.quadraticCurveTo(500, 326, 508, 318);
    ctx.stroke();
  }
  // Cobblestones at the bottom.
  paintBlock(ctx, 0, 460, 600, 60, '#3d3450');
  ctx.strokeStyle = 'rgba(255,255,255,0.14)';
  ctx.lineWidth = 2;
  for (let y = 470; y < 520; y += 16) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(600, y);
    ctx.stroke();
  }
  for (let x = 0; x < 600; x += 46) {
    ctx.beginPath();
    ctx.moveTo(x, 460);
    ctx.lineTo(x - 12, 520);
    ctx.stroke();
  }
}

// ------------------------------------------------------- the scene catalogue
// One entry per level: the display name, the painter, and the 7 differences.
// A difference lists its click point and ring size first, then its id, label
// and which panel holds the object ('both' = visible in both panels, 'left'
// or 'right' = only in that panel).
export const SCENES = [
  {
    name: 'Level 1 — Dusk Harbor',
    draw: renderHarbor,
    diffs: [
      { x: 300, y: 237, r: 40, id: 'beam', label: 'Lighthouse beam', side: 'left' },
      { x: 520, y: 66, r: 26, id: 'gulls', label: 'Extra gull', side: 'right' },
      { x: 180, y: 246, r: 36, id: 'sail', label: 'Sail colour', side: 'both' },
      { x: 520, y: 420, r: 26, id: 'buoy', label: 'Missing buoy', side: 'left' },
      { x: 450, y: 238, r: 18, id: 'lamp', label: 'Lamp windows', side: 'both' },
      { x: 464, y: 196, r: 22, id: 'flag', label: 'Lighthouse flag', side: 'right' },
      { x: 120, y: 432, r: 28, id: 'fish', label: 'Jumping fish', side: 'right' },
    ],
  },
  {
    name: 'Level 2 — Mossy Garden',
    draw: renderGarden,
    diffs: [
      { x: 450, y: 120, r: 32, id: 'butterfly', label: 'Butterfly wings', side: 'both' },
      { x: 128, y: 402, r: 24, id: 'mushrooms', label: 'Missing mushroom', side: 'left' },
      { x: 448, y: 424, r: 26, id: 'frog', label: 'Missing frog', side: 'left' },
      { x: 300, y: 400, r: 34, id: 'sunflower', label: 'Sunflower colour', side: 'both' },
      { x: 250, y: 470, r: 26, id: 'snail', label: 'Missing snail', side: 'left' },
      { x: 188, y: 202, r: 26, id: 'bird', label: 'Missing bird', side: 'left' },
      { x: 168, y: 222, r: 22, id: 'apples', label: 'Missing apple', side: 'left' },
    ],
  },
  {
    name: 'Level 3 — Night Market',
    draw: renderMarket,
    diffs: [
      { x: 300, y: 236, r: 34, id: 'lantern', label: 'Lantern colour', side: 'both' },
      { x: 535, y: 326, r: 28, id: 'cat', label: 'Missing cat', side: 'left' },
      { x: 188, y: 279, r: 26, id: 'jars', label: 'Missing jar', side: 'left' },
      { x: 460, y: 255, r: 36, id: 'awning', label: 'Awning stripes', side: 'both' },
      { x: 520, y: 60, r: 32, id: 'moon', label: 'Moon phase', side: 'both' },
      { x: 90, y: 92, r: 30, id: 'balloon', label: 'Missing balloon', side: 'left' },
      { x: 150, y: 182, r: 24, id: 'sign', label: 'Stall sign', side: 'both' },
    ],
  },
];
