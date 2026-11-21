// Lantern Harbor — three pictures painted entirely in code on a 600 x 520
// stage. Each picture is drawn twice: once as the original (left panel) and
// once with its seven differences applied (right panel). A spot is stored as
// a compact tuple [x, y, r, id, label, side] and expanded by buildSpot into
// the object shape the game expects: { id, label, x, y, r, side }.
import { createDice } from "./rng.js";

function skyWash(pen, top, mid, low, height) {
  const blend = pen.createLinearGradient(0, 0, 0, height);
  blend.addColorStop(0, top);
  blend.addColorStop(0.6, mid);
  blend.addColorStop(1, low);
  pen.fillStyle = blend;
  pen.fillRect(0, 0, 600, height);
}

function dot(pen, cx, cy, radius, color) {
  pen.fillStyle = color;
  pen.beginPath();
  pen.arc(cx, cy, radius, 0, Math.PI * 2);
  pen.fill();
}

function blob(pen, cx, cy, rx, ry, color) {
  pen.fillStyle = color;
  pen.beginPath();
  pen.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
  pen.fill();
}

function bar(pen, x, y, w, h, color) {
  pen.fillStyle = color;
  pen.fillRect(x, y, w, h);
}

function shape(pen, corners, color) {
  pen.fillStyle = color;
  pen.beginPath();
  pen.moveTo(corners[0][0], corners[0][1]);
  for (let k = 1; k < corners.length; k++) {
    pen.lineTo(corners[k][0], corners[k][1]);
  }
  pen.closePath();
  pen.fill();
}

function gullMark(pen, cx, cy, scale, color) {
  pen.strokeStyle = color;
  pen.lineWidth = 2.5;
  pen.beginPath();
  pen.moveTo(cx - 12 * scale, cy);
  pen.quadraticCurveTo(cx - 5 * scale, cy - 8 * scale, cx, cy);
  pen.quadraticCurveTo(cx + 5 * scale, cy - 8 * scale, cx + 12 * scale, cy);
  pen.stroke();
}

function starMark(pen, cx, cy, radius, color) {
  pen.fillStyle = color;
  pen.beginPath();
  for (let s = 0; s < 5; s++) {
    const a = -Math.PI / 2 + (s * 4 * Math.PI) / 5;
    const sx = cx + Math.cos(a) * radius;
    const sy = cy + Math.sin(a) * radius;
    if (s === 0) pen.moveTo(sx, sy);
    else pen.lineTo(sx, sy);
  }
  pen.closePath();
  pen.fill();
}

function cloudPuff(pen, cx, cy, scale, color) {
  pen.fillStyle = color;
  pen.beginPath();
  pen.arc(cx, cy, 20 * scale, 0, Math.PI * 2);
  pen.arc(cx + 22 * scale, cy - 8 * scale, 16 * scale, 0, Math.PI * 2);
  pen.arc(cx + 44 * scale, cy, 18 * scale, 0, Math.PI * 2);
  pen.fill();
  pen.fillRect(cx - 18 * scale, cy, 80 * scale, 14 * scale);
}

// ------------------------------------------------------------- first picture
function paintHarbor(pen, flipped) {
  const chance = createDice(11);
  skyWash(pen, '#232f5e', '#c96a4e', '#f7c873', 310);
  // Faint stars scattered across the dusk sky.
  for (let i = 0; i < 26; i++) {
    dot(pen, chance() * 600, chance() * 130, 1 + chance() * 1.8, 'rgba(255,244,200,0.9)');
  }
  dot(pen, 92, 92, 34, '#ffe9a8');
  dot(pen, 92, 92, 26, '#fff3c4');
  cloudPuff(pen, 200, 70, 1, 'rgba(255,220,190,0.85)');
  cloudPuff(pen, 420, 46, 0.8, 'rgba(255,220,190,0.7)');
  gullMark(pen, 300, 90, 1, '#2c2440');
  gullMark(pen, 350, 70, 0.8, '#2c2440');
  gullMark(pen, 260, 120, 0.7, '#2c2440');
  if (flipped.has('gulls')) gullMark(pen, 520, 66, 1, '#2c2440');
  // The sea below the horizon.
  bar(pen, 0, 300, 600, 220, '#1d4e6b');
  bar(pen, 0, 300, 600, 10, '#2f7ea6');
  pen.strokeStyle = 'rgba(180,230,255,0.55)';
  pen.lineWidth = 3;
  for (let i = 0; i < 9; i++) {
    const crestY = 330 + i * 20;
    pen.beginPath();
    for (let x = 0; x <= 600; x += 30) {
      pen.lineTo(x, crestY + Math.sin(x / 60 + i) * 4);
    }
    pen.stroke();
  }
  // A low rocky mound at the waterline with the lighthouse tower on it,
  // rising from y 250 down to the rocks at y 442.
  shape(pen, [[385, 520], [408, 442], [492, 442], [515, 520]], '#5a4a3a');
  shape(pen, [[400, 480], [420, 442], [480, 442], [500, 480]], '#6e5c46');
  bar(pen, 428, 250, 44, 192, '#f3ead8');
  bar(pen, 428, 282, 44, 14, '#c0392b');
  bar(pen, 428, 322, 44, 14, '#c0392b');
  bar(pen, 428, 362, 44, 14, '#c0392b');
  bar(pen, 422, 226, 56, 24, '#2c3e50');
  bar(pen, 432, 233, 12, 10, flipped.has('lamp') ? '#22303f' : '#ffe27a');
  bar(pen, 452, 233, 12, 10, flipped.has('lamp') ? '#22303f' : '#ffe27a');
  bar(pen, 418, 216, 64, 10, '#7a4d12');
  dot(pen, 450, 211, 7, '#c0392b');
  if (flipped.has('flag')) {
    pen.strokeStyle = '#3a2c1c';
    pen.lineWidth = 3;
    pen.beginPath();
    pen.moveTo(450, 211);
    pen.lineTo(450, 186);
    pen.stroke();
    shape(pen, [[450, 186], [480, 194], [450, 204]], '#e74c3c');
  }
  if (!flipped.has('beam')) {
    pen.fillStyle = 'rgba(255,226,122,0.22)';
    pen.beginPath();
    pen.moveTo(422, 238);
    pen.lineTo(180, 206);
    pen.lineTo(180, 268);
    pen.closePath();
    pen.fill();
  }
  // A sailboat to the left of the rocks.
  shape(pen, [[150, 300], [150, 196], [152, 196], [152, 300]], '#5a3a22');
  shape(pen, [[154, 200], [154, 292], [216, 292]], flipped.has('sail') ? '#1f8a70' : '#c0392b');
  shape(pen, [[148, 206], [148, 292], [104, 292]], '#f3ead8');
  shape(pen, [[96, 292], [228, 292], [210, 314], [112, 314]], '#6e4a2f');
  // A small rowboat to the right of the rocks.
  shape(pen, [[540, 380], [580, 380], [568, 398], [552, 398]], '#8a5a2b');
  bar(pen, 552, 366, 6, 26, '#5a3a22');
  // A pier reaching out from the left shore.
  bar(pen, 0, 430, 190, 14, '#7a5a38');
  bar(pen, 24, 444, 10, 40, '#5a3a22');
  bar(pen, 90, 444, 10, 40, '#5a3a22');
  bar(pen, 156, 444, 10, 40, '#5a3a22');
  dot(pen, 40, 424, 7, '#ffd97a');
  dot(pen, 110, 424, 7, '#ffd97a');
  // A buoy bobbing beside the rocks.
  if (!flipped.has('buoy')) {
    dot(pen, 520, 420, 13, '#e67e22');
    bar(pen, 514, 402, 12, 8, '#c0392b');
  }
  // A fish leaping out of the water on the left.
  if (flipped.has('fish')) {
    blob(pen, 120, 428, 16, 7, '#7fb3d5');
    shape(pen, [[136, 428], [148, 420], [148, 436]], '#5a8ab0');
    pen.strokeStyle = 'rgba(255,255,255,0.8)';
    pen.lineWidth = 2;
    pen.beginPath();
    pen.arc(120, 448, 14, Math.PI, 0);
    pen.stroke();
  }
}

// ------------------------------------------------------------ second picture
function paintGarden(pen, flipped) {
  const chance = createDice(23);
  skyWash(pen, '#8fd0ff', '#cfeef7', '#e8f7d8', 520);
  dot(pen, 500, 70, 36, '#ffd94d');
  for (let i = 0; i < 12; i++) {
    const ray = (i / 12) * Math.PI * 2;
    pen.strokeStyle = '#ffd94d';
    pen.lineWidth = 4;
    pen.beginPath();
    pen.moveTo(500 + Math.cos(ray) * 44, 70 + Math.sin(ray) * 44);
    pen.lineTo(500 + Math.cos(ray) * 56, 70 + Math.sin(ray) * 56);
    pen.stroke();
  }
  cloudPuff(pen, 120, 70, 1, 'rgba(255,255,255,0.95)');
  cloudPuff(pen, 330, 46, 0.7, 'rgba(255,255,255,0.9)');
  // A big tree on the left.
  bar(pen, 96, 250, 26, 150, '#6e4a2f');
  dot(pen, 110, 210, 84, '#3f9e4d');
  dot(pen, 60, 250, 54, '#57b25e');
  dot(pen, 165, 250, 54, '#4cab55');
  dot(pen, 110, 160, 56, '#6fbf6a');
  const appleSpots = [[78, 200], [140, 178], [96, 246], [168, 222]];
  const visibleApples = flipped.has('apples') ? appleSpots.slice(0, 3) : appleSpots;
  for (const [ax, ay] of visibleApples) dot(pen, ax, ay, 9, '#e74c3c');
  // A bird perched on a branch — or just the empty branch.
  pen.strokeStyle = '#6e4a2f';
  pen.lineWidth = 6;
  pen.beginPath();
  pen.moveTo(150, 250);
  pen.lineTo(196, 216);
  pen.stroke();
  if (!flipped.has('bird')) {
    blob(pen, 186, 206, 16, 10, '#5b7fd4');
    dot(pen, 198, 198, 7, '#5b7fd4');
    shape(pen, [[204, 198], [212, 201], [204, 203]], '#f39c12');
  }
  // A fence running across the middle.
  bar(pen, 0, 330, 600, 10, '#c9a06a');
  for (let x = 10; x < 600; x += 52) bar(pen, x, 300, 12, 74, '#b08a54');
  // A flower bed along the bottom edge.
  bar(pen, 0, 430, 600, 90, '#69a84f');
  const flowers = [
    [60, 470, '#e74c3c'], [130, 486, '#f39c12'], [200, 466, '#e74c3c'],
    [270, 486, '#9b59b6'], [340, 468, '#e74c3c'], [410, 486, '#f39c12'],
    [480, 470, '#e74c3c'], [550, 486, '#9b59b6'],
  ];
  for (const [fx, fy, fc] of flowers) {
    pen.strokeStyle = '#2f7a33';
    pen.lineWidth = 4;
    pen.beginPath();
    pen.moveTo(fx, 512);
    pen.lineTo(fx, fy + 8);
    pen.stroke();
    for (let p = 0; p < 5; p++) {
      const petalAngle = (p / 5) * Math.PI * 2;
      dot(pen, fx + Math.cos(petalAngle) * 8, fy + Math.sin(petalAngle) * 8, 6, fc);
    }
    dot(pen, fx, fy, 6, '#ffd94d');
  }
  // The sunflower: yellow, or a purple impostor.
  const bloomTint = flipped.has('sunflower') ? '#9b59b6' : '#ffd94d';
  pen.strokeStyle = '#2f7a33';
  pen.lineWidth = 5;
  pen.beginPath();
  pen.moveTo(300, 512);
  pen.lineTo(300, 420);
  pen.stroke();
  for (let p = 0; p < 10; p++) {
    const petalAngle = (p / 10) * Math.PI * 2;
    blob(pen, 300 + Math.cos(petalAngle) * 20, 400 + Math.sin(petalAngle) * 20, 12, 6, bloomTint);
  }
  dot(pen, 300, 400, 16, '#7a4d12');
  // A pond with a lily pad, bottom right.
  blob(pen, 470, 440, 110, 44, '#4aa3df');
  blob(pen, 470, 440, 96, 36, '#6fc3ef');
  blob(pen, 448, 436, 34, 12, '#3f9e4d');
  if (!flipped.has('frog')) {
    dot(pen, 448, 424, 13, '#57b25e');
    dot(pen, 440, 412, 5, '#57b25e');
    dot(pen, 456, 412, 5, '#57b25e');
    dot(pen, 441, 411, 2, '#101623');
    dot(pen, 457, 411, 2, '#101623');
  }
  // Mushrooms growing by the tree.
  const toadstools = flipped.has('mushrooms')
    ? [[60, 400, 1], [96, 412, 0.8]]
    : [[60, 400, 1], [96, 412, 0.8], [128, 402, 0.7]];
  for (const [mx, my, ms] of toadstools) {
    bar(pen, mx - 4 * ms, my, 8 * ms, 14 * ms, '#f3ead8');
    pen.fillStyle = '#e74c3c';
    pen.beginPath();
    pen.arc(mx, my, 14 * ms, Math.PI, 0);
    pen.fill();
    dot(pen, mx - 6 * ms, my - 6 * ms, 2, '#fff');
    dot(pen, mx + 5 * ms, my - 8 * ms, 2, '#fff');
  }
  // A butterfly drifting over the flowers.
  const wingTint = flipped.has('butterfly') ? '#5b7fd4' : '#f39c12';
  const bfX = 450;
  const bfY = 120;
  blob(pen, bfX - 14, bfY, 14, 18, wingTint);
  blob(pen, bfX + 14, bfY, 14, 18, wingTint);
  blob(pen, bfX - 10, bfY + 16, 9, 11, wingTint);
  blob(pen, bfX + 10, bfY + 16, 9, 11, wingTint);
  bar(pen, bfX - 3, bfY - 16, 6, 34, '#3a2c1c');
  // A snail on the garden path.
  if (!flipped.has('snail')) {
    blob(pen, 250, 474, 18, 10, '#8a6d4b');
    pen.strokeStyle = '#8a6d4b';
    pen.lineWidth = 2;
    pen.beginPath();
    pen.arc(250, 474, 8, 0, Math.PI * 2);
    pen.stroke();
    dot(pen, 250, 462, 11, '#c0392b');
    dot(pen, 246, 462, 2, '#fff');
    dot(pen, 254, 462, 2, '#fff');
  }
  // Pebbles scattered along the path.
  for (let i = 0; i < 10; i++) {
    dot(pen, 30 + chance() * 540, 500 + chance() * 12, 3 + chance() * 3, '#cbb89a');
  }
}

// ------------------------------------------------------------- third picture
function paintMarket(pen, flipped) {
  const chance = createDice(37);
  skyWash(pen, '#141b3d', '#2b2f63', '#4a2c5e', 520);
  for (let i = 0; i < 40; i++) {
    dot(pen, chance() * 600, chance() * 150, 1 + chance() * 1.6, 'rgba(255,244,200,0.9)');
  }
  // The moon overhead: full, or a crescent.
  dot(pen, 520, 60, 30, '#f7ead0');
  if (flipped.has('moon')) {
    dot(pen, 534, 54, 26, '#2b2f63');
  }
  // A balloon drifting over the stalls — or gone entirely.
  if (!flipped.has('balloon')) {
    pen.strokeStyle = '#b9c6de';
    pen.lineWidth = 2;
    pen.beginPath();
    pen.moveTo(90, 118);
    pen.lineTo(90, 150);
    pen.stroke();
    blob(pen, 90, 92, 22, 28, '#e74c3c');
    shape(pen, [[82, 116], [98, 116], [90, 126]], '#c0392b');
  }
  // Strings of lights stretched across the top.
  pen.strokeStyle = '#0b1220';
  pen.lineWidth = 3;
  pen.beginPath();
  pen.moveTo(0, 130);
  pen.quadraticCurveTo(300, 190, 600, 120);
  pen.stroke();
  const bulbTints = ['#ffd94d', '#ff7a6b', '#7ee081', '#7ab8ff'];
  for (let i = 0; i < 13; i++) {
    const t = i / 12;
    const bx = t * 600;
    const by = 130 + Math.sin(t * Math.PI) * 34;
    dot(pen, bx, by + 8, 7, bulbTints[i % 4]);
  }
  // A paper lantern hanging centre top.
  const lampTint = flipped.has('lantern') ? '#2fbf71' : '#e74c3c';
  blob(pen, 300, 236, 26, 32, lampTint);
  bar(pen, 288, 200, 24, 8, '#f39c12');
  bar(pen, 288, 264, 24, 8, '#f39c12');
  pen.strokeStyle = '#f39c12';
  pen.lineWidth = 2;
  pen.beginPath();
  pen.moveTo(300, 272);
  pen.lineTo(300, 292);
  pen.stroke();
  // The left stall: jars lined up on the table.
  bar(pen, 60, 300, 180, 16, '#7a5a38');
  bar(pen, 70, 316, 12, 90, '#5a3a22');
  bar(pen, 218, 316, 12, 90, '#5a3a22');
  shape(pen, [[50, 300], [250, 300], [240, 210], [60, 210]], '#c0392b');
  for (let i = 0; i < 5; i++) {
    bar(pen, 60 + i * 36, 210, 18, 90, i % 2 === 0 ? '#f3ead8' : '#c0392b');
  }
  const jarTints = flipped.has('jars')
    ? ['#7ab8ff', '#ffd94d']
    : ['#7ab8ff', '#ffd94d', '#7ee081'];
  jarTints.forEach((hue, n) => {
    const jx = 92 + n * 48;
    bar(pen, jx - 14, 258, 28, 42, hue);
    bar(pen, jx - 8, 250, 16, 8, '#8a6d4b');
  });
  // A star (or circle) sign above the left stall.
  if (flipped.has('sign')) {
    dot(pen, 150, 182, 16, '#ffd94d');
  } else {
    starMark(pen, 150, 182, 18, '#ffd94d');
  }
  // The right stall: striped awning, crates, and a cat.
  const stripeTint = flipped.has('awning') ? '#5b7fd4' : '#c0392b';
  shape(pen, [[360, 300], [560, 300], [550, 210], [370, 210]], stripeTint);
  for (let i = 0; i < 5; i++) {
    bar(pen, 370 + i * 36, 210, 18, 90, i % 2 === 0 ? '#f3ead8' : stripeTint);
  }
  bar(pen, 370, 300, 180, 16, '#7a5a38');
  bar(pen, 380, 316, 12, 90, '#5a3a22');
  bar(pen, 528, 316, 12, 90, '#5a3a22');
  // Crates stacked beside the right stall.
  bar(pen, 470, 400, 60, 60, '#b08a54');
  bar(pen, 540, 400, 60, 60, '#c9a06a');
  bar(pen, 505, 340, 60, 60, '#b08a54');
  pen.strokeStyle = '#7a5a38';
  pen.lineWidth = 3;
  pen.strokeRect(470, 400, 60, 60);
  pen.strokeRect(540, 400, 60, 60);
  pen.strokeRect(505, 340, 60, 60);
  // A cat asleep on the crates — or just an empty crate.
  if (!flipped.has('cat')) {
    blob(pen, 535, 332, 26, 12, '#2c2c34');
    dot(pen, 556, 322, 10, '#2c2c34');
    shape(pen, [[550, 314], [554, 304], [558, 314]], '#2c2c34');
    shape(pen, [[560, 314], [564, 304], [566, 314]], '#2c2c34');
    pen.strokeStyle = '#2c2c34';
    pen.lineWidth = 4;
    pen.beginPath();
    pen.moveTo(512, 334);
    pen.quadraticCurveTo(500, 326, 508, 318);
    pen.stroke();
  }
  // Cobblestones paving the bottom of the market.
  bar(pen, 0, 460, 600, 60, '#3d3450');
  pen.strokeStyle = 'rgba(255,255,255,0.14)';
  pen.lineWidth = 2;
  for (let y = 470; y < 520; y += 16) {
    pen.beginPath();
    pen.moveTo(0, y);
    pen.lineTo(600, y);
    pen.stroke();
  }
  for (let x = 0; x < 600; x += 46) {
    pen.beginPath();
    pen.moveTo(x, 460);
    pen.lineTo(x - 12, 520);
    pen.stroke();
  }
}

// ------------------------------------------------------- the scene catalogue
// A spot is written as a compact tuple: [x, y, r, id, label, side].
// x/y = click point, r = ring radius, side = which panel holds the object
// ('both' = visible in both panels, 'left'/'right' = only in that panel).
// buildSpot expands each tuple into the object shape the game reads.
function buildSpot(tuple) {
  const [x, y, r, id, label, side] = tuple;
  return { id, label, x, y, r, side };
}

const HARBOR_SPOTS = [
  [300, 237, 40, 'beam', 'Lighthouse beam', 'left'],
  [520, 66, 26, 'gulls', 'Extra gull', 'right'],
  [180, 246, 36, 'sail', 'Sail colour', 'both'],
  [520, 420, 26, 'buoy', 'Missing buoy', 'left'],
  [450, 238, 18, 'lamp', 'Lamp windows', 'both'],
  [464, 196, 22, 'flag', 'Lighthouse flag', 'right'],
  [120, 432, 28, 'fish', 'Jumping fish', 'right'],
];

const GARDEN_SPOTS = [
  [450, 120, 32, 'butterfly', 'Butterfly wings', 'both'],
  [128, 402, 24, 'mushrooms', 'Missing mushroom', 'left'],
  [448, 424, 26, 'frog', 'Missing frog', 'left'],
  [300, 400, 34, 'sunflower', 'Sunflower colour', 'both'],
  [250, 470, 26, 'snail', 'Missing snail', 'left'],
  [188, 202, 26, 'bird', 'Missing bird', 'left'],
  [168, 222, 22, 'apples', 'Missing apple', 'left'],
];

const MARKET_SPOTS = [
  [300, 236, 34, 'lantern', 'Lantern colour', 'both'],
  [535, 326, 28, 'cat', 'Missing cat', 'left'],
  [188, 279, 26, 'jars', 'Missing jar', 'left'],
  [460, 255, 36, 'awning', 'Awning stripes', 'both'],
  [520, 60, 32, 'moon', 'Moon phase', 'both'],
  [90, 92, 30, 'balloon', 'Missing balloon', 'left'],
  [150, 182, 24, 'sign', 'Stall sign', 'both'],
];

export const SCENES = [
  {
    name: 'Level 1 — Dusk Harbor',
    draw: paintHarbor,
    diffs: HARBOR_SPOTS.map(buildSpot),
  },
  {
    name: 'Level 2 — Mossy Garden',
    draw: paintGarden,
    diffs: GARDEN_SPOTS.map(buildSpot),
  },
  {
    name: 'Level 3 — Night Market',
    draw: paintMarket,
    diffs: MARKET_SPOTS.map(buildSpot),
  },
];
