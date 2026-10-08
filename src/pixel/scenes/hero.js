// Home: twilight garden with a big pink lily, city skyline and fireflies.
import {
  rng, makeCanvas, quantize, outline, ditherGradient, glow, moon, cloudSprite, CLOUD_PINK, CLOUD_PURPLE,
  makeStars, drawStars, drawClouds, leaf, stem, flower, burst, drawParts, makeFlies, drawFlies, drawButterfly, px,
} from "../engine.js";

export default function buildHero({ w, h, land, reduce }) {
  const R = rng(7);
  const x0 = land ? w * 0.43 : w * 0.12;
  const hh = land ? h * 0.27 : h * 0.2;
  const hillTop = (x) => {
    if (x < x0) return h + 8;
    const t = Math.min(1, (x - x0) / ((w - x0) * 0.62));
    const e = 1 - Math.pow(1 - t, 2.2);
    return Math.round(h - e * hh - Math.sin(x * 0.09) * 1.3 - Math.sin(x * 0.027 + 1) * 2.4 + (1 - t) * 2);
  };
  const lx = Math.round(land ? w * 0.835 : w * 0.72);
  const ground = hillTop(lx);
  const LL = Math.round(land ? Math.min(w * 0.075, h * 0.14) : Math.min(w * 0.17, h * 0.08));
  const lily = { x: lx, y: Math.round(ground - LL * 2.3), L: LL };

  /* sky */
  const sky = makeCanvas(w, h), sx = sky.getContext("2d");
  ditherGradient(sx, 0, 0, w, h, [[0, "#1d1642"], [0.28, "#2c2264"], [0.5, "#43358a"], [0.66, "#5c449c"], [0.78, "#8a56a2"], [0.88, "#c8709f"], [0.95, "#ee98a8"], [1, "#ffbba7"]], 26);
  glow(sx, lily.x, lily.y, LL * 4, "rgba(255,170,210,.18)");
  moon(sx, Math.round(land ? w * 0.615 : w * 0.8), Math.round(h * (land ? 0.19 : 0.1)), Math.max(5, Math.round(Math.min(w, h) * 0.032)));

  const cs = Math.min(w, h) / 220;
  const clouds = [
    { c: cloudSprite(150 * cs, 34 * cs, 3, CLOUD_PURPLE), x: -w * 0.06, y: h * 0.47, v: 0.6, a: 0.75 },
    { c: cloudSprite(120 * cs, 30 * cs, 9, CLOUD_PURPLE), x: w * 0.86, y: h * 0.14, v: 0.45, a: 0.8 },
    { c: cloudSprite(70 * cs, 16 * cs, 5, CLOUD_PURPLE), x: w * 0.3, y: h * 0.08, v: 0.8, a: 0.5 },
    { c: cloudSprite(170 * cs, 28 * cs, 11, CLOUD_PINK), x: -w * 0.04, y: h * 0.78, v: 0.35, a: 0.85 },
    { c: cloudSprite(110 * cs, 20 * cs, 13, CLOUD_PINK), x: w * 0.36, y: h * 0.84, v: 0.5, a: 0.7 },
    { c: cloudSprite(130 * cs, 30 * cs, 17, CLOUD_PURPLE), x: w * 0.74, y: h * 0.34, v: 0.4, a: 0.55 },
  ];
  const stars = makeStars(R, w, h);

  /* city, water, hill */
  const fg = makeCanvas(w, h), f = fg.getContext("2d");
  const hy = Math.round(h * (land ? 0.955 : 0.97));
  f.fillStyle = "#d58aa9"; f.fillRect(0, hy, w, h - hy);
  for (let i = 0; i < w / 6; i++) {
    f.fillStyle = R() < 0.5 ? "#ffc6b0" : "#e59bb0";
    f.fillRect(Math.floor(R() * w * 0.6), hy + 1 + Math.floor(R() * (h - hy)), 2 + Math.floor(R() * 8), 1);
  }
  const wins = [];
  const cityW = land ? w * 0.2 : w * 0.34, cs2 = Math.max(1, h / 260);
  for (const layer of [0, 1]) {
    let x = layer ? 2 : -3;
    while (x < cityW) {
      const bw = Math.round((5 + R() * 8) * cs2);
      const bh = Math.round((layer ? 12 + R() * 30 : 22 + R() * 42) * cs2 * (1 - (x / cityW) * 0.5));
      f.fillStyle = layer ? "#3d2f76" : "#4f3f8c";
      f.fillRect(x, hy - bh, bw, bh);
      if (R() < 0.3) {
        f.fillRect(x + Math.floor(bw / 2), hy - bh - Math.round(6 * cs2), 1, Math.round(6 * cs2));
        if (layer === 0) wins.push({ x: x + Math.floor(bw / 2), y: hy - bh - Math.round(6 * cs2) - 1, p: R() * 6, red: true });
      }
      for (let wy = hy - bh + 2; wy < hy - 2; wy += 3)
        for (let wx = x + 1; wx < x + bw - 1; wx += 2) if (R() < 0.2) wins.push({ x: wx, y: wy, p: R() * 6.28, red: false });
      x += bw + (layer ? Math.round(R() * 4) : Math.round(R() * 2));
    }
  }
  for (let x = Math.floor(x0); x < w; x++) {
    const t = hillTop(x);
    for (let y = t; y < h; y++) {
      const k = (y - t) / (h - t + 1);
      f.fillStyle = k < 0.06 ? "#4a6343" : k < 0.3 ? "#36483d" : k < 0.65 ? "#2a3340" : "#1f2235";
      f.fillRect(x, y, 1, 1);
    }
  }
  for (let i = 0; i < (w - x0) * 3; i++) {
    const x = Math.floor(x0 + R() * (w - x0)), t = hillTop(x), y = t + Math.floor(R() * R() * (h - t));
    const k = (y - t) / (h - t + 1);
    f.fillStyle = R() < 0.5 ? (k < 0.4 ? "#6a8550" : "#3a4d3f") : R() < 0.5 ? "#f2a2c3" : R() < 0.5 ? "#b9a3f5" : "#ffe7b0";
    f.fillRect(x, y, 1, 1);
  }
  quantize(fg);

  /* plants + lily */
  const pl = makeCanvas(w, h), p = pl.getContext("2d");
  const R2 = rng(21);
  const sc = land ? Math.min(w / 480, h / 300) : Math.min(w / 220, h / 420) * 0.9;
  for (let x = x0 + 6; x < w; x += 3 + R2() * 5) {
    const t = hillTop(x);
    leaf(p, x, t + 2, (4 + R2() * 8) * sc, -1.2 - R2() * 0.8, 2 * sc, "#2a3a36", "#4d6644");
    leaf(p, x, t + 2, (4 + R2() * 7) * sc, -1.9 - R2() * 0.8, 2 * sc, "#2a3a36", "#5d7a49");
  }
  const tall = land
    ? [[0.33, 0.2, "lav", 5], [0.4, 0.15, "pink", 4], [0.46, 0.12, "mag", 3.5], [0.52, 0.17, "pink", 4.5], [0.63, 0.09, "white", 3], [0.86, 0.2, "pink", 4.5], [0.93, 0.12, "peach", 3.5], [0.98, 0.16, "pink", 4], [0.2, 0.08, "pink", 3]]
    : [[0.12, 0.12, "lav", 4], [0.22, 0.09, "pink", 3.5], [0.33, 0.07, "mag", 3], [0.85, 0.12, "pink", 4], [0.95, 0.08, "peach", 3.5], [0.45, 0.05, "white", 3]];
  for (const [fx, fh, kind, fr] of tall) {
    const x = Math.round(x0 + (w - x0) * fx), t = hillTop(x), top = t - fh * h;
    stem(p, x, t + 2, x, top, (R2() - 0.5) * 6, Math.max(1, sc * 1.2));
    leaf(p, x, (t + top) / 2 + fh * h * 0.2, 6 * sc, -0.5, 2.4 * sc);
    leaf(p, x, (t + top) / 2 + fh * h * 0.3, 6 * sc, Math.PI + 0.5, 2.4 * sc);
    flower(p, x, top, fr * sc, kind, R2);
    if (R2() < 0.7) flower(p, x + (R2() < 0.5 ? -1 : 1) * fr * sc * 2.2, top + fr * sc * 2.6, fr * sc * 0.75, kind, R2);
  }
  const { x: Lx, y: Ly } = lily, gL = hillTop(Lx);
  for (const [a, len] of [[-1.25, 1.4], [-2.0, 1.2], [-0.75, 1.0], [-2.5, 0.95], [-1.6, 1.6]])
    leaf(p, Lx + (a + 1.6) * 3, gL + 2, LL * len, a, LL * 0.22, "#24372f", "#5f7d4a");
  stem(p, Lx + 2, gL + 2, Lx, Ly + LL * 0.25, LL * 0.2, Math.max(2, LL * 0.07), "#3f6040");
  leaf(p, Lx + 1, Ly + LL * 1.1, LL * 0.75, -0.55, LL * 0.16, "#2d4636", "#6a8550");
  stem(p, Lx, Ly + LL * 0.9, Lx + LL * 0.75, Ly - LL * 0.35, -LL * 0.2, Math.max(1, LL * 0.04), "#3f6040");
  const petal = (ang, len, wd, back) => {
    p.save(); p.translate(Lx, Ly); p.rotate(ang);
    const gr = p.createLinearGradient(0, 0, len, 0);
    gr.addColorStop(0, back ? "#8a3f6e" : "#b5568a"); gr.addColorStop(0.35, back ? "#c9688f" : "#e47fa8");
    gr.addColorStop(0.75, back ? "#e79ab9" : "#f6b0cc"); gr.addColorStop(1, "#ffd6e8");
    p.fillStyle = gr;
    p.beginPath(); p.moveTo(0, 0);
    p.bezierCurveTo(len * 0.3, -wd, len * 0.8, -wd * 0.85, len, wd * 0.15);
    p.bezierCurveTo(len * 0.75, wd * 0.75, len * 0.3, wd * 0.75, 0, 0);
    p.fill();
    p.strokeStyle = back ? "#8a3f6e" : "#b5568a"; p.lineWidth = 1; p.stroke();
    p.strokeStyle = "rgba(255,236,246,.85)";
    p.beginPath(); p.moveTo(len * 0.18, 0); p.quadraticCurveTo(len * 0.6, -wd * 0.25, len * 0.9, wd * 0.05); p.stroke();
    p.fillStyle = "#8a3f6e";
    for (let i = 0; i < 6; i++) p.fillRect(len * (0.12 + R2() * 0.3), (R2() - 0.5) * wd * 0.6, 1, 1);
    p.restore();
  };
  petal(-1.75, LL * 1.05, LL * 0.32, true); petal(-1.05, LL, LL * 0.3, true); petal(-2.45, LL, LL * 0.3, true);
  petal(-3.0, LL * 1.15, LL * 0.34, false); petal(-0.2, LL * 1.15, LL * 0.34, false); petal(-1.4, LL * 1.12, LL * 0.36, false);
  petal(2.55, LL * 0.85, LL * 0.3, false); petal(0.6, LL * 0.85, LL * 0.3, false);
  p.lineWidth = 1;
  for (let i = 0; i < 6; i++) {
    const a = -1.95 + i * 0.16, len = LL * (0.55 + R2() * 0.2), ex = Lx + Math.cos(a) * len, ey = Ly + Math.sin(a) * len;
    p.strokeStyle = "#ffe7b0";
    p.beginPath(); p.moveTo(Lx, Ly); p.quadraticCurveTo(Lx + Math.cos(a) * len * 0.5 + 2, Ly + Math.sin(a) * len * 0.5, ex, ey); p.stroke();
    p.fillStyle = "#ffb36b"; p.fillRect(Math.round(ex) - 1, Math.round(ey) - 1, 2, 2);
  }
  p.save(); p.translate(Lx + LL * 0.75, Ly - LL * 0.35); p.rotate(-0.5);
  p.fillStyle = "#e47fa8"; p.beginPath(); p.ellipse(0, -LL * 0.18, LL * 0.1, LL * 0.22, 0, 0, 7); p.fill();
  p.fillStyle = "#f6b0cc"; p.fillRect(-1, -LL * 0.3, 1, LL * 0.2);
  p.restore();
  for (let i = 0; i < (w - x0) / 4; i++) {
    const x = x0 + 8 + R2() * (w - x0 - 8), t = hillTop(x), y = t + 4 + R2() * R2() * (h - t) * 0.9;
    const kinds = ["pink", "lav", "peach", "white", "mag", "pink"];
    if (R2() < 0.5) stem(p, x, y + 4 * sc, x, y, 0, 1);
    flower(p, x, y, (1.2 + R2() * 1.6) * sc, kinds[Math.floor(R2() * kinds.length)], R2);
  }
  quantize(pl); outline(pl);

  const flies = makeFlies(rng(99), Math.round((w - x0) / 14) + 6, x0, w, h * 0.45, h * 0.95);
  const parts = [];
  const bf = { cx: land ? w * 0.66 : w * 0.3, cy: land ? h * 0.41 : h * 0.62 };

  return {
    draw(t, c) {
      const s = t / 1000;
      c.globalAlpha = 1; c.drawImage(sky, 0, 0);
      drawStars(c, stars, s);
      drawClouds(c, clouds, reduce ? 0 : s, w);
      c.drawImage(fg, 0, 0);
      for (const wv of wins) {
        const b = Math.sin(s * (wv.red ? 3 : 0.7) + wv.p);
        if (wv.red) px(c, wv.x, wv.y, "#ff7aa8", b > 0 ? 1 : 0.25);
        else if (b > -0.6) px(c, wv.x, wv.y, b > 0.5 ? "#ffe7b0" : "#ffd28a", 0.85);
      }
      c.globalAlpha = 1; c.drawImage(pl, 0, 0);
      drawFlies(c, flies, s);
      if (!reduce && Math.random() < 0.02)
        parts.push({ x: lily.x + (Math.random() - 0.5) * LL * 1.5, y: lily.y, vx: -0.15 - Math.random() * 0.2, vy: 0.12 + Math.random() * 0.1, life: 600, c: "#f6b0cc", petal: true });
      drawParts(c, parts, s, h);
      drawButterfly(c, s, bf.cx, bf.cy, w * 0.04, h * 0.035, { still: reduce });
    },
    click(x, y) { burst(parts, x, y); },
  };
}
