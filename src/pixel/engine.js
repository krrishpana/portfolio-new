// Shared pixel-art drawing helpers.
// Scenes are drawn on a small canvas (a few hundred pixels wide), then the
// canvas is scaled up with `image-rendering: pixelated`, so every drawn
// pixel becomes a crisp 2–4px block on screen.

export const BAYER = [
  [0, 8, 2, 10],
  [12, 4, 14, 6],
  [3, 11, 1, 9],
  [15, 7, 13, 5],
];

export const hex = (h) => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];

// Seeded random numbers, so a scene looks the same on every load.
export function rng(seed) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export const makeCanvas = (w, h) => {
  const c = document.createElement("canvas");
  c.width = Math.max(1, Math.round(w));
  c.height = Math.max(1, Math.round(h));
  return c;
};

// The site palette. Everything drawn gets snapped to these colours.
export const PALETTE = [
  "#1d2032", "#232a3e", "#2c3a3c", "#3a4d3f", "#4d6644", "#6a8550", "#93ab62",
  "#6e2f5e", "#8a3f6e", "#b5568a", "#d9789f", "#f2a2c3", "#ffc9df", "#fff0f6",
  "#1b1533", "#2a1f56", "#352a6b", "#41337e", "#4b3b8f", "#6b55b0", "#8b7edb", "#b9a3f5", "#ddd0ff",
  "#ffb36b", "#ffd28a", "#ffe7b0", "#ffb4a7", "#e58f8f", "#c77aa9", "#e59bb0", "#ffc6b0",
  "#7dd3fc", "#3b8ec2", "#a7f3d0", "#5fbf95", "#6b4a3a", "#8c6650", "#b98b62",
  "#e3c58f", "#c9a46c", "#e86a6a", "#f6f0ff", "#9fb0e8",
].map(hex);

// Snap a canvas to the palette with ordered dithering, and make edges crisp.
export function quantize(c, dither = true) {
  const x = c.getContext("2d");
  const d = x.getImageData(0, 0, c.width, c.height);
  const a = d.data;
  const W = c.width;
  for (let i = 0; i < a.length; i += 4) {
    if (a[i + 3] < 120) { a[i + 3] = 0; continue; }
    const p = i >> 2, px = p % W, py = (p / W) | 0;
    const o = dither ? (BAYER[py & 3][px & 3] / 16 - 0.47) * 26 : 0;
    const r = a[i] + o, g = a[i + 1] + o, b = a[i + 2] + o;
    let best = PALETTE[0], bd = 1e12;
    for (const q of PALETTE) {
      const dr = r - q[0], dg = g - q[1], db = b - q[2];
      const dd = 2 * dr * dr + 4 * dg * dg + 3 * db * db;
      if (dd < bd) { bd = dd; best = q; }
    }
    a[i] = best[0]; a[i + 1] = best[1]; a[i + 2] = best[2]; a[i + 3] = 255;
  }
  x.putImageData(d, 0, 0);
  return c;
}

// Add a dark 1px outline around everything drawn on the canvas.
export function outline(c) {
  const x = c.getContext("2d");
  const d = x.getImageData(0, 0, c.width, c.height);
  const a = d.data, W = c.width, H = c.height, src = new Uint8ClampedArray(a);
  for (let y = 0; y < H; y++) for (let X = 0; X < W; X++) {
    const i = (y * W + X) * 4;
    if (src[i + 3]) continue;
    for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
      const nx = X + dx, ny = y + dy;
      if (nx < 0 || ny < 0 || nx >= W || ny >= H) continue;
      const j = (ny * W + nx) * 4;
      if (src[j + 3]) {
        a[i] = src[j] * 0.42 + 14; a[i + 1] = src[j + 1] * 0.34 + 8; a[i + 2] = src[j + 2] * 0.5 + 30; a[i + 3] = 255;
        break;
      }
    }
  }
  x.putImageData(d, 0, 0);
  return c;
}

export const pixelize = (c) => outline(quantize(c));

// Banded, dithered vertical gradient (the "pixel sky" look).
export function ditherGradient(ctx, x0, y0, w, h, stops, bands = 24) {
  const st = stops.map(([t, c]) => [t, hex(c)]);
  const col = (t) => {
    for (let k = 1; k < st.length; k++) if (t <= st[k][0]) {
      const [t0, c0] = st[k - 1], [t1, c1] = st[k], f = (t - t0) / (t1 - t0 || 1);
      return c0.map((v, i) => v + (c1[i] - v) * f);
    }
    return st[st.length - 1][1];
  };
  const cache = [];
  for (let b = 0; b < bands; b++) cache.push(col((b + 0.5) / bands));
  const img = ctx.createImageData(Math.max(1, w), Math.max(1, h)), A = img.data;
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    const t = y / h + (BAYER[(y + y0) & 3][(x + x0) & 3] / 16 - 0.5) / bands;
    const c = cache[Math.max(0, Math.min(bands - 1, Math.floor(t * bands)))];
    const i = (y * w + x) * 4;
    A[i] = c[0]; A[i + 1] = c[1]; A[i + 2] = c[2]; A[i + 3] = 255;
  }
  ctx.putImageData(img, x0, y0);
}

export function glow(ctx, x, y, r, rgba) {
  const g = ctx.createRadialGradient(x, y, 0, x, y, r);
  g.addColorStop(0, rgba);
  g.addColorStop(1, rgba.replace(/[\d.]+\)$/, "0)"));
  ctx.fillStyle = g;
  ctx.fillRect(x - r, y - r, r * 2, r * 2);
}

export function moon(ctx, mx, my, mr) {
  glow(ctx, mx, my, mr * 3.2, "rgba(201,168,255,.22)");
  for (let y = -mr; y <= mr; y++) for (let x = -mr; x <= mr; x++) {
    const a = x * x + y * y <= mr * mr;
    const ox = x - mr * 0.55, oy = y + mr * 0.35;
    const b = ox * ox + oy * oy <= mr * mr * 0.92;
    if (a && !b) {
      const edge = x * x + y * y > (mr - 1.2) * (mr - 1.2);
      ctx.fillStyle = edge ? "#cdb6f5" : "#f6edff";
      ctx.fillRect(mx + x, my + y, 1, 1);
    }
  }
}

export function cloudSprite(cw, ch, seed, pal) {
  cw = Math.max(8, Math.round(cw)); ch = Math.max(5, Math.round(ch));
  const c = makeCanvas(cw, ch), x = c.getContext("2d"), r = rng(seed), bumps = [];
  const base = ch - 2;
  let px = 4;
  while (px < cw - 4) {
    const env = Math.sin((Math.PI * px) / cw);
    const rr = Math.max(2, (2 + r() * ch * 0.32) * (0.35 + 0.65 * env));
    bumps.push([px, base - rr * 0.45, rr]);
    px += rr * (0.7 + r() * 0.45);
  }
  const inside = (X, Y) => Y <= base && bumps.some(([bx, by, br]) => (X - bx) ** 2 + (Y - by) ** 2 <= br * br);
  for (let Y = 0; Y < ch; Y++) for (let X = 0; X < cw; X++) {
    if (!inside(X, Y)) continue;
    const top = !inside(X, Y - 1) || !inside(X, Y - 2);
    const bot = Y > base - 2 - ((X * 7) % 3);
    x.fillStyle = top ? pal[1] : bot ? pal[2] : pal[0];
    x.fillRect(X, Y, 1, 1);
  }
  return c;
}
export const CLOUD_PURPLE = ["#55448f", "#6c58ad", "#47397f"];
export const CLOUD_PINK = ["#b56aa4", "#d78aae", "#9a5694"];

export function makeStars(R, w, h, { density = 700, maxY = 0.72, sparkles = 1 } = {}) {
  const stars = [];
  const n = Math.round((w * h) / density);
  for (let i = 0; i < n; i++) stars.push({ x: Math.floor(R() * w), y: Math.floor(R() * h * maxY), p: R() * 6.28, s: 0.6 + R() * 1.8, big: false });
  for (let i = 0; i < Math.round((w / 45 + 4) * sparkles); i++) stars.push({ x: Math.floor(R() * w), y: Math.floor(R() * h * maxY * 0.85), p: R() * 6.28, s: 0.5 + R(), big: true });
  return stars;
}

export function px(ctx, x, y, c, a = 1) {
  ctx.globalAlpha = a;
  ctx.fillStyle = c;
  ctx.fillRect(Math.round(x), Math.round(y), 1, 1);
}

export function drawStars(ctx, stars, s) {
  for (const st of stars) {
    const b = 0.5 + 0.5 * Math.sin(s * st.s + st.p);
    if (st.big) {
      if (b > 0.35) {
        px(ctx, st.x, st.y, "#ffffff", 0.9);
        const arm = b > 0.75 ? 2 : 1;
        for (let k = 1; k <= arm; k++) {
          const a = 0.75 / k;
          px(ctx, st.x + k, st.y, "#c9a8ff", a); px(ctx, st.x - k, st.y, "#c9a8ff", a);
          px(ctx, st.x, st.y + k, "#c9a8ff", a); px(ctx, st.x, st.y - k, "#c9a8ff", a);
        }
      }
    } else px(ctx, st.x, st.y, b > 0.6 ? "#f3e8ff" : "#9d8bd8", 0.25 + b * 0.7);
  }
  ctx.globalAlpha = 1;
}

export function drawClouds(ctx, clouds, s, w) {
  for (const c of clouds) {
    const span = w + c.c.width;
    const x = (((c.x + s * c.v + c.c.width) % span) + span) % span - c.c.width;
    ctx.globalAlpha = c.a;
    ctx.drawImage(c.c, Math.round(x), Math.round(c.y));
  }
  ctx.globalAlpha = 1;
}

/* ── plants ─────────────────────────────────────── */
export const FLOWER_COLORS = {
  pink: ["#f48fb1", "#c9608f"],
  lav: ["#b9a3f5", "#7a64c4"],
  peach: ["#ffb4a7", "#d97f86"],
  white: ["#fbe3f2", "#c9a3d8"],
  mag: ["#e86aa0", "#a4467e"],
};

export function leaf(p, x, y, len, ang, wd, c1 = "#2d4636", c2 = "#5d7a49") {
  p.save(); p.translate(x, y); p.rotate(ang);
  const gr = p.createLinearGradient(0, 0, len, 0);
  gr.addColorStop(0, c1); gr.addColorStop(1, c2);
  p.fillStyle = gr;
  p.beginPath(); p.moveTo(0, 0);
  p.quadraticCurveTo(len * 0.45, -wd, len, 0);
  p.quadraticCurveTo(len * 0.45, wd * 0.5, 0, 0);
  p.fill(); p.restore();
}

export function stem(p, x1, y1, x2, y2, bend, wid, c = "#3d5a3f") {
  p.strokeStyle = c; p.lineWidth = wid;
  p.beginPath(); p.moveTo(x1, y1);
  p.quadraticCurveTo((x1 + x2) / 2 + bend, (y1 + y2) / 2, x2, y2);
  p.stroke();
}

export function flower(p, x, y, r, kind, R) {
  const [c1, c2] = FLOWER_COLORS[kind] || FLOWER_COLORS.pink;
  const rot = R() * 6.28;
  for (let i = 0; i < 5; i++) {
    const a = rot + i * 1.2566, fx = x + Math.cos(a) * r * 0.62, fy = y + Math.sin(a) * r * 0.62;
    p.fillStyle = c2; p.beginPath(); p.arc(fx + 0.4, fy + 0.6, r * 0.55, 0, 7); p.fill();
    p.fillStyle = c1; p.beginPath(); p.arc(fx, fy, r * 0.5, 0, 7); p.fill();
  }
  p.fillStyle = "#ffd28a"; p.beginPath(); p.arc(x, y, Math.max(0.8, r * 0.32), 0, 7); p.fill();
}

// A small flower bush cluster — stems, leaves and heads.
export function flowerTuft(p, x, ground, height, kinds, R, sc = 1) {
  const n = 2 + Math.floor(R() * 3);
  for (let i = 0; i < n; i++) {
    const fx = x + (R() - 0.5) * 10 * sc, top = ground - height * (0.5 + R() * 0.5);
    stem(p, fx, ground, fx + (R() - 0.5) * 3, top, (R() - 0.5) * 4, Math.max(1, sc), "#3d5a3f");
    leaf(p, fx, (ground + top) / 2 + 2, 5 * sc, -0.6 - R() * 0.4, 2 * sc);
    leaf(p, fx, (ground + top) / 2 + 4, 5 * sc, Math.PI + 0.5 + R() * 0.4, 2 * sc);
    flower(p, fx, top, (1.8 + R() * 1.5) * sc, kinds[Math.floor(R() * kinds.length)], R);
  }
}

/* ── particles & sprites ────────────────────────── */
export function burst(parts, x, y) {
  const cols = ["#ffffff", "#c9a8ff", "#f48fb1", "#ffe7b0", "#a7f3d0"];
  for (let i = 0; i < 16; i++) {
    const a = (i / 16) * 6.28, v = 0.6 + Math.random() * 1.2;
    parts.push({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, life: 30 + Math.random() * 25, c: cols[i % cols.length] });
  }
  for (let i = 0; i < 4; i++) parts.push({ x: x + (Math.random() - 0.5) * 6, y, vx: -0.1 - Math.random() * 0.3, vy: 0.1 + Math.random() * 0.15, life: 500, c: "#f6b0cc", petal: true });
}

export function drawParts(ctx, parts, s, h) {
  for (let i = parts.length - 1; i >= 0; i--) {
    const q = parts[i];
    q.x += q.vx + (q.petal ? Math.sin(s * 2 + i) * 0.15 : 0);
    q.y += q.vy;
    if (!q.petal) { q.vx *= 0.95; q.vy *= 0.95; }
    q.life--;
    if (q.life <= 0 || q.y > h) { parts.splice(i, 1); continue; }
    const a = q.petal ? 1 : Math.min(1, q.life / 20);
    px(ctx, q.x, q.y, q.c, a);
    if (q.petal) px(ctx, q.x + 1, q.y, "#e47fa8", a);
    else if (q.life > 14) {
      px(ctx, q.x + 1, q.y, q.c, a * 0.4); px(ctx, q.x - 1, q.y, q.c, a * 0.4);
      px(ctx, q.x, q.y + 1, q.c, a * 0.4); px(ctx, q.x, q.y - 1, q.c, a * 0.4);
    }
  }
  ctx.globalAlpha = 1;
}

export function makeFlies(R, n, x0, x1, y0, y1) {
  const f = [];
  for (let i = 0; i < n; i++) f.push({ x: x0 + R() * (x1 - x0), y: y0 + R() * (y1 - y0), p: R() * 6.28, s: 0.3 + R() * 0.5 });
  return f;
}
export function drawFlies(ctx, flies, s) {
  for (const f of flies) {
    const x = f.x + Math.sin(s * f.s + f.p) * 6, y = f.y + Math.cos(s * f.s * 1.3 + f.p) * 4;
    const b = 0.5 + 0.5 * Math.sin(s * 2 * f.s + f.p * 3);
    if (b < 0.2) continue;
    px(ctx, x, y, "#fff3c4", b);
    for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) px(ctx, x + dx, y + dy, "#ffd28a", b * 0.3);
  }
  ctx.globalAlpha = 1;
}

const BUTTERFLY = [
  [".....d.d.....", "..aa..d..aa..", ".abba.d.abba.", "abccbadabccba", "abcccbdbcccba", ".abccbdbccba.", "..abbbdbbba..", ".abcba.abcba.", ".abba...abba.", "..aa.....aa.."],
  [".....d.d.....", "......d......", "....a.d.a....", "...abbdbba...", "...abcdcba...", "...abcdcba...", "....abdba....", "....acdca....", "....aa.aa....", "............."],
];
const BUTTERFLY_PINK = { a: "#9a3f6e", b: "#f48fb1", c: "#ffc9df", d: "#3a1f3a" };
const BUTTERFLY_LAV = { a: "#4a338c", b: "#8f72d8", c: "#c9a8ff", d: "#221a48" };

export function drawSprite(ctx, map, colors, x, y) {
  map.forEach((row, yy) => [...row].forEach((ch, xx) => {
    if (colors[ch]) { ctx.fillStyle = colors[ch]; ctx.fillRect(Math.round(x) + xx, Math.round(y) + yy, 1, 1); }
  }));
}

export function drawButterfly(ctx, s, cx, cy, rx, ry, { pink = false, still = false, seed = 0 } = {}) {
  const bx = cx + Math.sin(s * 0.45 + seed) * rx + Math.sin(s * 1.7) * 2;
  const by = cy + Math.sin(s * 0.7 + seed) * ry + Math.sin(s * 2.3) * 1.5;
  const fr = BUTTERFLY[still ? 0 : Math.floor(s * 6 + seed) % 2];
  ctx.globalAlpha = 1;
  drawSprite(ctx, fr, pink ? BUTTERFLY_PINK : BUTTERFLY_LAV, bx, by);
}
