// Generates src/components/frame.css: pixel-art 9-slice frames as data-URI
// SVGs (border-image). A rounded-rect SDF rasterized on a 24×24 grid gives the
// stepped pixel-art corner curvature; deterministic dither adds the
// hand-drawn texture. Run: node scripts/gen-frame.mjs
import { writeFileSync } from 'node:fs';

const SIZE = 24; // viewBox — slice 8 → 8px corners, 8px repeating edge
const SLICE = 8;
const RADIUS = 6;

// band by depth (px from the outer edge, 8 deep = full slice):
// 0 outline · 1 light bevel · 2-4 body · 5 dark bevel · 6 body dark · 7 inner outline
function bandAt(depth) {
  if (depth < 0 || depth >= 8) return null;
  return ['O', 'L', 'F', 'F', 'F', 'D', 'D', 'O'][Math.floor(depth)];
}

function grid() {
  const half = SIZE / 2;
  const cells = [];
  for (let y = 0; y < SIZE; y++) {
    const row = [];
    for (let x = 0; x < SIZE; x++) {
      const qx = Math.abs(x + 0.5 - half) - (half - RADIUS);
      const qy = Math.abs(y + 0.5 - half) - (half - RADIUS);
      // full rounded-rect SDF — the interior term keeps depth growing past the
      // corner radius so inner bands exist along straight edges too
      const dist = Math.min(Math.max(qx, qy), 0) + Math.hypot(Math.max(qx, 0), Math.max(qy, 0)) - RADIUS;
      let band = bandAt(-dist);
      // hand-drawn texture inside the body band (deterministic, tileable per slice)
      if (band === 'F') {
        const h = (x * 7 + y * 13) % 11;
        if (h === 0) band = 'D';
        else if (h === 5) band = 'L';
      }
      row.push(band);
    }
    cells.push(row);
  }
  return cells;
}

function svg(palette) {
  const cells = grid();
  const rects = [];
  for (let y = 0; y < SIZE; y++) {
    for (let x = 0; x < SIZE; x++) {
      const band = cells[y][x];
      if (!band) continue;
      let w = 1;
      while (x + w < SIZE && cells[y][x + w] === band) w++;
      rects.push(`<rect x='${x}' y='${y}' width='${w}' height='1' fill='${palette[band]}'/>`);
      x += w - 1;
    }
  }
  // explicit width/height: border-image-slice needs an intrinsic size,
  // an SVG with only a viewBox gets sliced against an arbitrary default
  const body = `<svg xmlns='http://www.w3.org/2000/svg' width='${SIZE}' height='${SIZE}' viewBox='0 0 ${SIZE} ${SIZE}' shape-rendering='crispEdges'>${rects.join('')}</svg>`;
  return `url("data:image/svg+xml,${body.replaceAll('#', '%23').replaceAll("'", '%27')}")`;
}

const VARIANTS = {
  framed: { O: '#06060c', L: '#9d9db8', F: '#555566', D: '#31314a' },
  'framed-gold': { O: '#06060c', L: '#ffe08a', F: '#f5c542', D: '#a8770f' },
  'framed-accent': { O: '#06060c', L: '#8fe9ff', F: '#00d2ff', D: '#00789b' },
};

const rules = Object.entries(VARIANTS)
  .map(
    ([name, palette]) => `  .arc-panel--${name} {
    border: var(--arc-frame-w, 16px) solid transparent;
    border-image: ${svg(palette)} ${SLICE} round;
    background: var(--arc-surface-1);
    background-clip: padding-box;
    box-shadow: none;
    color: var(--arc-text);
  }`,
  )
  .join('\n\n');

const css = `/* arcanum-ui — RPGUI-style pixel frames (GENERATED — edit scripts/gen-frame.mjs)
   <div class="arc-panel--framed">…</div>   (also works combined with .arc-panel)
   Variants: --framed (steel) --framed-gold --framed-accent (cyan)
   Frame thickness: --arc-frame-w, multiples of 8px keep pixels crisp (16px = 2×). */

@layer arc.components {
${rules}
}
`;

writeFileSync(new URL('../src/components/frame.css', import.meta.url), css);
console.log('frame.css written');
