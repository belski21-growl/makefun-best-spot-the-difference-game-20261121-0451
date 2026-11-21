// Lantern Harbor — the three scenes: every picture is drawn by code, nothing is
// copied in. Each scene is 600 x 520 units, drawn twice: once as the original
// (left panel) and once with its 7 differences applied (right panel). A
// difference is { id, label, x, y, r }: where to click, and how big the ring is.
import { createDice } from './rng.js';

function sky(ctx, top, mid, bottom, height) {
  const g = ctx.createLinearGradient(0, 0, 0, height);
  g.addColorStop(0, top);
  g.addColorStop(0.6, mid);
  g.addColorStop(1, bottom);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 600, height);
}

function disc(ctx, x, y, r, fill) {
  ctx.fillStyle = fill;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
}

function ellipse(ctx, x, y, rx, ry, fill) {
  ctx.fillStyle = fill;
  ctx.beginPath();
  ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
  ctx.fill();
}

function rect(ctx, x, y, w, h, fill) {
  ctx.fillStyle = fill;
  ctx.fillRect(x, y, w, h);
}

function poly(ctx, points, fill) {
  ctx.fillStyle = fill;
  ctx.beginPath();
  ctx.moveTo(points[0][0], points[0][1]);
  for (let i = 1; i < points.length; i += 1) ctx.lineTo(points[i][0], points[i][1]);
  ctx.closePath();
  ctx.fill();
}

function gull(ctx, x, y, scale, color) {
  ctx.strokeStyle = color;
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(x - 12 * scale, y);
  ctx.quadraticCurveTo(x - 5 * scale, y - 8 * scale, x, y);
  ctx.quadraticCurveTo(x + 5 * scale, y - 8 * scale, x + 12 * scale, y);
  ctx.stroke();
}

function star(ctx, x, y, r, fill) {
  ctx.fillStyle = fill;
  ctx.beginPath();
  for (let i = 0; i < 5; i += 1) {
    const a = -Math.PI / 2 + (i * 4 * Math.PI) / 5;
    const px = x + Math.cos(a) * r;
    const py = y + Math.sin(a) * r;
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
  ctx.fill();
}

function cloud(ctx, x, y, scale, fill) {
  ctx.fillStyle = fill;
  ctx.beginPath();
  ctx.arc(x, y, 20 * scale, 0, Math.PI * 2);
  ctx.arc(x + 22 * scale, y - 8 * scale, 16 * scale, 0, Math.PI * 2);
  ctx.arc(x + 44 * scale, y, 18 * scale, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillRect(x - 18 * scale, y, 80 * scale, 14 * scale);
}

// ---------------------------------------------------------------- level 1
function drawHarbor(ctx, changed) {
  const dice = createDice(11);
  sky(ctx, '#232f5e', '#c96a4e', '#f7c873', 310);
  // Early stars in the dusk sky.
  for (let i = 0; i < 26; i += 1) {
    disc(ctx, dice() * 600, dice() * 130, 1 + dice() * 1.8, 'rgba(255,244,200,0.9)');
  }
  disc(ctx, 92, 92, 34, '#ffe9a8');
  disc(ctx, 92, 92, 26, '#fff3c4');
  cloud(ctx, 200, 70, 1, 'rgba(255,220,190,0.85)');
  cloud(ctx, 420, 46, 0.8, 'rgba(255,220,190,0.7)');
  gull(ctx, 300, 90, 1, '#2c2440');
  gull(ctx, 350, 70, 0.8, '#2c2440');
  gull(ctx, 260, 120, 0.7, '#2c2440');
  if (changed.has('gulls')) gull(ctx, 520, 66, 1, '#2c2440');
  // Sea.
  rect(ctx, 0, 300, 600, 220, '#1d4e6b');
  rect(ctx, 0, 300, 600, 10, '#2f7ea6');
  ctx.strokeStyle = 'rgba(180,230,255,0.55)';
  ctx.lineWidth = 3;
  for (let i = 0; i < 9; i += 1) {
    const y = 330 + i * 20;
    ctx.beginPath();
    for (let x = 0; x <= 600; x += 30) ctx.lineTo(x, y + Math.sin(x / 60 + i) * 4);
    ctx.stroke();
  }
  // Rocky islet with the lighthouse: a low mound at the waterline, the tower
  // standing on it from y 250 down to the rocks at y 442.
  poly(ctx, [[385, 520], [408, 442], [492, 442], [515, 520]], '#5a4a3a');
  poly(ctx, [[400, 480], [420, 442], [480, 442], [500, 480]], '#6e5c46');
  rect(ctx, 428, 250, 44, 192, '#f3ead8');
  rect(ctx, 428, 282, 44, 14, '#c0392b');
  rect(ctx, 428, 322, 44, 14, '#c0392b');
  rect(ctx, 428, 362, 44, 14, '#c0392b');
  rect(ctx, 422, 226, 56, 24, '#2c3e50');
  rect(ctx, 432, 233, 12, 10, changed.has('lamp') ? '#22303f' : '#ffe27a');
  rect(ctx, 452, 233, 12, 10, changed.has('lamp') ? '#22303f' : '#ffe27a');
  rect(ctx, 418, 216, 64, 10, '#7a4d12');
  disc(ctx, 450, 211, 7, '#c0392b');
  if (changed.has('flag')) {
    ctx.strokeStyle = '#3a2c1c';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(450, 211);
    ctx.lineTo(450, 186);
    ctx.stroke();
    poly(ctx, [[450, 186], [480, 194], [450, 204]], '#e74c3c');
  }
  if (!changed.has('beam')) {
    ctx.fillStyle = 'rgba(255,226,122,0.22)';
    ctx.beginPath();
    ctx.moveTo(422, 238);
    ctx.lineTo(180, 206);
    ctx.lineTo(180, 268);
    ctx.closePath();
    ctx.fill();
  }
  // Sailboat, left of the rocks.
  poly(ctx, [[150, 300], [150, 196], [152, 196], [152, 300]], '#5a3a22');
  poly(ctx, [[154, 200], [154, 292], [216, 292]], changed.has('sail') ? '#1f8a70' : '#c0392b');
  poly(ctx, [[148, 206], [148, 292], [104, 292]], '#f3ead8');
  poly(ctx, [[96, 292], [228, 292], [210, 314], [112, 314]], '#6e4a2f');
  // Rowboat, right of the rocks.
  poly(ctx, [[540, 380], [580, 380], [568, 398], [552, 398]], '#8a5a2b');
  rect(ctx, 552, 366, 6, 26, '#5a3a22');
  // Pier from the left shore.
  rect(ctx, 0, 430, 190, 14, '#7a5a38');
  rect(ctx, 24, 444, 10, 40, '#5a3a22');
  rect(ctx, 90, 444, 10, 40, '#5a3a22');
  rect(ctx, 156, 444, 10, 40, '#5a3a22');
  disc(ctx, 40, 424, 7, '#ffd97a');
  disc(ctx, 110, 424, 7, '#ffd97a');
  // Buoy bobbing near the rocks.
  if (!changed.has('buoy')) {
    disc(ctx, 520, 420, 13, '#e67e22');
    rect(ctx, 514, 402, 12, 8, '#c0392b');
  }
  // A fish jumps clear of the water, left side.
  if (changed.has('fish')) {
    ellipse(ctx, 120, 428, 16, 7, '#7fb3d5');
    poly(ctx, [[136, 428], [148, 420], [148, 436]], '#5a8ab0');
    ctx.strokeStyle = 'rgba(255,255,255,0.8)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(120, 448, 14, Math.PI, 0);
    ctx.stroke();
  }
}

// ---------------------------------------------------------------- level 2
function drawGarden(ctx, changed) {
  const dice = createDice(23);
  sky(ctx, '#8fd0ff', '#cfeef7', '#e8f7d8', 520);
  disc(ctx, 500, 70, 36, '#ffd94d');
  for (let i = 0; i < 12; i += 1) {
    const a = (i / 12) * Math.PI * 2;
    ctx.strokeStyle = '#ffd94d';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(500 + Math.cos(a) * 44, 70 + Math.sin(a) * 44);
    ctx.lineTo(500 + Math.cos(a) * 56, 70 + Math.sin(a) * 56);
    ctx.stroke();
  }
  cloud(ctx, 120, 70, 1, 'rgba(255,255,255,0.95)');
  cloud(ctx, 330, 46, 0.7, 'rgba(255,255,255,0.9)');
  // Big tree, left.
  rect(ctx, 96, 250, 26, 150, '#6e4a2f');
  disc(ctx, 110, 210, 84, '#3f9e4d');
  disc(ctx, 60, 250, 54, '#57b25e');
  disc(ctx, 165, 250, 54, '#4cab55');
  disc(ctx, 110, 160, 56, '#6fbf6a');
  const appleSpots = [[78, 200], [140, 178], [96, 246], [168, 222]];
  const apples = changed.has('apples') ? appleSpots.slice(0, 3) : appleSpots;
  for (const [x, y] of apples) disc(ctx, x, y, 9, '#e74c3c');
  // Bird on a branch — or an empty branch.
  ctx.strokeStyle = '#6e4a2f';
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.moveTo(150, 250);
  ctx.lineTo(196, 216);
  ctx.stroke();
  if (!changed.has('bird')) {
    ellipse(ctx, 186, 206, 16, 10, '#5b7fd4');
    disc(ctx, 198, 198, 7, '#5b7fd4');
    poly(ctx, [[204, 198], [212, 201], [204, 203]], '#f39c12');
  }
  // Fence across the middle.
  rect(ctx, 0, 330, 600, 10, '#c9a06a');
  for (let x = 10; x < 600; x += 52) rect(ctx, x, 300, 12, 74, '#b08a54');
  // Flower bed along the bottom.
  rect(ctx, 0, 430, 600, 90, '#69a84f');
  const flowers = [
    [60, 470, '#e74c3c'], [130, 486, '#f39c12'], [200, 466, '#e74c3c'],
    [270, 486, '#9b59b6'], [340, 468, '#e74c3c'], [410, 486, '#f39c12'],
    [480, 470, '#e74c3c'], [550, 486, '#9b59b6'],
  ];
  for (const [x, y, c] of flowers) {
    ctx.strokeStyle = '#2f7a33';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(x, 512);
    ctx.lineTo(x, y + 8);
    ctx.stroke();
    for (let p = 0; p < 5; p += 1) {
      const a = (p / 5) * Math.PI * 2;
      disc(ctx, x + Math.cos(a) * 8, y + Math.sin(a) * 8, 6, c);
    }
    disc(ctx, x, y, 6, '#ffd94d');
  }
  // The sunflower: yellow, or a purple impostor.
  const sunPetal = changed.has('sunflower') ? '#9b59b6' : '#ffd94d';
  ctx.strokeStyle = '#2f7a33';
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(300, 512);
  ctx.lineTo(300, 420);
  ctx.stroke();
  for (let p = 0; p < 10; p += 1) {
    const a = (p / 10) * Math.PI * 2;
    ellipse(ctx, 300 + Math.cos(a) * 20, 400 + Math.sin(a) * 20, 12, 6, sunPetal);
  }
  disc(ctx, 300, 400, 16, '#7a4d12');
  // Pond with a lily pad, bottom right.
  ellipse(ctx, 470, 440, 110, 44, '#4aa3df');
  ellipse(ctx, 470, 440, 96, 36, '#6fc3ef');
  ellipse(ctx, 448, 436, 34, 12, '#3f9e4d');
  if (!changed.has('frog')) {
    disc(ctx, 448, 424, 13, '#57b25e');
    disc(ctx, 440, 412, 5, '#57b25e');
    disc(ctx, 456, 412, 5, '#57b25e');
    disc(ctx, 441, 411, 2, '#101623');
    disc(ctx, 457, 411, 2, '#101623');
  }
  // Mushrooms by the tree.
  const shrooms = changed.has('mushrooms')
    ? [[60, 400, 1], [96, 412, 0.8]]
    : [[60, 400, 1], [96, 412, 0.8], [128, 402, 0.7]];
  for (const [x, y, s] of shrooms) {
    rect(ctx, x - 4 * s, y, 8 * s, 14 * s, '#f3ead8');
    ctx.fillStyle = '#e74c3c';
    ctx.beginPath();
    ctx.arc(x, y, 14 * s, Math.PI, 0);
    ctx.fill();
    disc(ctx, x - 6 * s, y - 6 * s, 2, '#fff');
    disc(ctx, x + 5 * s, y - 8 * s, 2, '#fff');
  }
  // Butterfly over the flowers.
  const wing = changed.has('butterfly') ? '#5b7fd4' : '#f39c12';
  const bx = 450;
  const by = 120;
  ellipse(ctx, bx - 14, by, 14, 18, wing);
  ellipse(ctx, bx + 14, by, 14, 18, wing);
  ellipse(ctx, bx - 10, by + 16, 9, 11, wing);
  ellipse(ctx, bx + 10, by + 16, 9, 11, wing);
  rect(ctx, bx - 3, by - 16, 6, 34, '#3a2c1c');
  // Snail on the garden path.
  if (!changed.has('snail')) {
    ellipse(ctx, 250, 474, 18, 10, '#8a6d4b');
    ctx.strokeStyle = '#8a6d4b';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(250, 474, 8, 0, Math.PI * 2);
    ctx.stroke();
    disc(ctx, 250, 462, 11, '#c0392b');
    disc(ctx, 246, 462, 2, '#fff');
    disc(ctx, 254, 462, 2, '#fff');
  }
  // Pebbles scattered on the path.
  for (let i = 0; i < 10; i += 1) {
    disc(ctx, 30 + dice() * 540, 500 + dice() * 12, 3 + dice() * 3, '#cbb89a');
  }
}

// ---------------------------------------------------------------- level 3
function drawMarket(ctx, changed) {
  const dice = createDice(37);
  sky(ctx, '#141b3d', '#2b2f63', '#4a2c5e', 520);
  for (let i = 0; i < 40; i += 1) {
    disc(ctx, dice() * 600, dice() * 150, 1 + dice() * 1.6, 'rgba(255,244,200,0.9)');
  }
  // The moon: full, or a crescent.
  disc(ctx, 520, 60, 30, '#f7ead0');
  if (changed.has('moon')) {
    disc(ctx, 534, 54, 26, '#2b2f63');
  }
  // Balloon drifting over the stalls — or not.
  if (!changed.has('balloon')) {
    ctx.strokeStyle = '#b9c6de';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(90, 118);
    ctx.lineTo(90, 150);
    ctx.stroke();
    ellipse(ctx, 90, 92, 22, 28, '#e74c3c');
    poly(ctx, [[82, 116], [98, 116], [90, 126]], '#c0392b');
  }
  // Strings of lights across the top.
  ctx.strokeStyle = '#0b1220';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(0, 130);
  ctx.quadraticCurveTo(300, 190, 600, 120);
  ctx.stroke();
  const bulbColors = ['#ffd94d', '#ff7a6b', '#7ee081', '#7ab8ff'];
  for (let i = 0; i < 13; i += 1) {
    const t = i / 12;
    const x = t * 600;
    const y = 130 + Math.sin(t * Math.PI) * 34;
    disc(ctx, x, y + 8, 7, bulbColors[i % 4]);
  }
  // Paper lantern, centre top.
  const lantern = changed.has('lantern') ? '#2fbf71' : '#e74c3c';
  ellipse(ctx, 300, 236, 26, 32, lantern);
  rect(ctx, 288, 200, 24, 8, '#f39c12');
  rect(ctx, 288, 264, 24, 8, '#f39c12');
  ctx.strokeStyle = '#f39c12';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(300, 272);
  ctx.lineTo(300, 292);
  ctx.stroke();
  // Left stall: jars on the table.
  rect(ctx, 60, 300, 180, 16, '#7a5a38');
  rect(ctx, 70, 316, 12, 90, '#5a3a22');
  rect(ctx, 218, 316, 12, 90, '#5a3a22');
  poly(ctx, [[50, 300], [250, 300], [240, 210], [60, 210]], '#c0392b');
  for (let i = 0; i < 5; i += 1) {
    rect(ctx, 60 + i * 36, 210, 18, 90, i % 2 === 0 ? '#f3ead8' : '#c0392b');
  }
  const jarColors = changed.has('jars')
    ? ['#7ab8ff', '#ffd94d']
    : ['#7ab8ff', '#ffd94d', '#7ee081'];
  jarColors.forEach((c, i) => {
    const x = 92 + i * 48;
    rect(ctx, x - 14, 258, 28, 42, c);
    rect(ctx, x - 8, 250, 16, 8, '#8a6d4b');
  });
  // Star (or circle) sign on the left stall.
  if (changed.has('sign')) {
    disc(ctx, 150, 182, 16, '#ffd94d');
  } else {
    star(ctx, 150, 182, 18, '#ffd94d');
  }
  // Right stall: striped awning, crates, cat.
  const stripeA = changed.has('awning') ? '#5b7fd4' : '#c0392b';
  poly(ctx, [[360, 300], [560, 300], [550, 210], [370, 210]], stripeA);
  for (let i = 0; i < 5; i += 1) {
    rect(ctx, 370 + i * 36, 210, 18, 90, i % 2 === 0 ? '#f3ead8' : stripeA);
  }
  rect(ctx, 370, 300, 180, 16, '#7a5a38');
  rect(ctx, 380, 316, 12, 90, '#5a3a22');
  rect(ctx, 528, 316, 12, 90, '#5a3a22');
  // Crates stacked by the right stall.
  rect(ctx, 470, 400, 60, 60, '#b08a54');
  rect(ctx, 540, 400, 60, 60, '#c9a06a');
  rect(ctx, 505, 340, 60, 60, '#b08a54');
  ctx.strokeStyle = '#7a5a38';
  ctx.lineWidth = 3;
  ctx.strokeRect(470, 400, 60, 60);
  ctx.strokeRect(540, 400, 60, 60);
  ctx.strokeRect(505, 340, 60, 60);
  // The cat asleep on the crates — or an empty crate.
  if (!changed.has('cat')) {
    ellipse(ctx, 535, 332, 26, 12, '#2c2c34');
    disc(ctx, 556, 322, 10, '#2c2c34');
    poly(ctx, [[550, 314], [554, 304], [558, 314]], '#2c2c34');
    poly(ctx, [[560, 314], [564, 304], [566, 314]], '#2c2c34');
    ctx.strokeStyle = '#2c2c34';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(512, 334);
    ctx.quadraticCurveTo(500, 326, 508, 318);
    ctx.stroke();
  }
  // Cobblestones at the bottom.
  rect(ctx, 0, 460, 600, 60, '#3d3450');
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

export const SCENES = [
  {
    name: 'Level 1 — Dusk Harbor',
    draw: drawHarbor,
    diffs: [
      { id: 'beam', label: 'Lighthouse beam', x: 300, y: 237, r: 40 },
      { id: 'gulls', label: 'Extra gull', x: 520, y: 66, r: 26 },
      { id: 'sail', label: 'Sail colour', x: 180, y: 246, r: 36 },
      { id: 'buoy', label: 'Missing buoy', x: 520, y: 420, r: 26 },
      { id: 'lamp', label: 'Lamp windows', x: 450, y: 238, r: 18 },
      { id: 'flag', label: 'Lighthouse flag', x: 464, y: 196, r: 22 },
      { id: 'fish', label: 'Jumping fish', x: 120, y: 432, r: 28 },
    ],
  },
  {
    name: 'Level 2 — Mossy Garden',
    draw: drawGarden,
    diffs: [
      { id: 'butterfly', label: 'Butterfly wings', x: 450, y: 120, r: 32 },
      { id: 'mushrooms', label: 'Missing mushroom', x: 128, y: 402, r: 24 },
      { id: 'frog', label: 'Missing frog', x: 448, y: 424, r: 26 },
      { id: 'sunflower', label: 'Sunflower colour', x: 300, y: 400, r: 34 },
      { id: 'snail', label: 'Missing snail', x: 250, y: 470, r: 26 },
      { id: 'bird', label: 'Missing bird', x: 188, y: 202, r: 26 },
      { id: 'apples', label: 'Missing apple', x: 168, y: 222, r: 22 },
    ],
  },
  {
    name: 'Level 3 — Night Market',
    draw: drawMarket,
    diffs: [
      { id: 'lantern', label: 'Lantern colour', x: 300, y: 236, r: 34 },
      { id: 'cat', label: 'Missing cat', x: 535, y: 326, r: 28 },
      { id: 'jars', label: 'Missing jar', x: 188, y: 279, r: 26 },
      { id: 'awning', label: 'Awning stripes', x: 460, y: 255, r: 36 },
      { id: 'moon', label: 'Moon phase', x: 520, y: 60, r: 32 },
      { id: 'balloon', label: 'Missing balloon', x: 90, y: 92, r: 30 },
      { id: 'sign', label: 'Stall sign', x: 150, y: 182, r: 24 },
    ],
  },
];
