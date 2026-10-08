// Journey: floating islands on a sea, joined by a dotted path. One island per milestone.
import {
  rng, makeCanvas, quantize, outline, ditherGradient, leaf, flower, cloudSprite, CLOUD_PURPLE, drawClouds, px, burst, drawParts, drawSprite,
} from "../engine.js";

// Where each island sits, as fractions of the section (shared with the cards).
export function journeyLayout(n, land) {
  if (!land) return Array.from({ length: n }, (_, i) => ({ x: i % 2 ? 0.74 : 0.26, y: (190 + i * 168) / (n * 168 + 220) }));
  const preset = [
    { x: 0.11, y: 0.74 }, { x: 0.28, y: 0.5 }, { x: 0.45, y: 0.33 },
    { x: 0.61, y: 0.45 }, { x: 0.72, y: 0.77 }, { x: 0.89, y: 0.58 },
  ];
  if (n <= 6) {
    const pick = n === 1 ? [2] : Array.from({ length: n }, (_, i) => Math.round((i * 5) / (n - 1)));
    return pick.map((k) => preset[k]);
  }
  return Array.from({ length: n }, (_, i) => ({ x: 0.08 + (0.84 * i) / (n - 1), y: [0.72, 0.48, 0.32, 0.5][i % 4] }));
}

const BOAT = ["....p....", "....pp...", "....ppp..", "....p....", "bbbbbbbbb", ".bbbbbbb."];

export function makeJourney(items) {
  return function build({ w, h, land, reduce }) {
    const R = rng(44);
    const pos = journeyLayout(items.length, land).map((p) => ({ x: Math.round(p.x * w), y: Math.round(p.y * h) }));
    const ir = Math.max(12, Math.min(w, h) * (land ? 0.085 : 0.07));

    /* sea */
    const sea = makeCanvas(w, h), s = sea.getContext("2d");
    ditherGradient(s, 0, 0, w, h, [[0, "#2c2a78"], [0.5, "#34388c"], [1, "#2b2b74"]], 12);
    const waves = [];
    for (let i = 0; i < (w * h) / 260; i++) waves.push({ x: R() * w, y: R() * h, l: 2 + Math.floor(R() * 4), p: R() * 6.28 });

    /* path between islands */
    const dots = [];
    for (let i = 0; i < pos.length - 1; i++) {
      const a = pos[i], b = pos[i + 1];
      const mx = (a.x + b.x) / 2 + (b.y - a.y) * 0.25, my = (a.y + b.y) / 2 - (b.x - a.x) * 0.15;
      const steps = Math.hypot(b.x - a.x, b.y - a.y) / 3;
      for (let k = 0; k <= steps; k++) {
        const t = k / steps;
        const x = (1 - t) ** 2 * a.x + 2 * (1 - t) * t * mx + t * t * b.x;
        const y = (1 - t) ** 2 * a.y + 2 * (1 - t) * t * my + t * t * b.y;
        if (Math.hypot(x - a.x, y - a.y) > ir * 0.9 && Math.hypot(x - b.x, y - b.y) > ir * 0.9) dots.push({ x, y, k: dots.length });
      }
    }

    /* islands */
    const isl = makeCanvas(w, h), p = isl.getContext("2d");
    const R2 = rng(9);
    pos.forEach((c, idx) => {
      const r = ir * (0.85 + R2() * 0.3);
      const pts = [];
      for (let k = 0; k < 18; k++) {
        const a = (k / 18) * Math.PI * 2;
        const rr = r * (0.8 + R2() * 0.35);
        pts.push([c.x + Math.cos(a) * rr * 1.35, c.y + Math.sin(a) * rr * 0.6]);
      }
      const blob = (dy, fill) => { p.fillStyle = fill; p.beginPath(); pts.forEach(([x, y], i) => (i ? p.lineTo(x, y + dy) : p.moveTo(x, y + dy))); p.closePath(); p.fill(); };
      // cliff, sand, grass
      blob(r * 0.38, "#2c3a3c"); blob(r * 0.25, "#3a4d3f"); blob(r * 0.12, "#e3c58f");
      const g = p.createLinearGradient(0, c.y - r * 0.6, 0, c.y + r * 0.5);
      g.addColorStop(0, "#93ab62"); g.addColorStop(1, "#4d6644");
      p.save(); p.translate(c.x, c.y); p.scale(0.94, 0.92); p.translate(-c.x, -c.y); blob(0, g); p.restore();
      // decorations
      const future = items[idx].future;
      if (future) {
        p.fillStyle = "#6b55b0";
        p.beginPath(); p.moveTo(c.x - r * 0.9, c.y + 2); p.lineTo(c.x - r * 0.1, c.y - r * 1.5); p.lineTo(c.x + r * 0.9, c.y + 2); p.fill();
        p.fillStyle = "#8b7edb";
        p.beginPath(); p.moveTo(c.x - r * 0.1, c.y - r * 1.5); p.lineTo(c.x + r * 0.9, c.y + 2); p.lineTo(c.x + r * 0.15, c.y + 2); p.fill();
        p.fillStyle = "#f6f0ff";
        p.beginPath(); p.moveTo(c.x - r * 0.1, c.y - r * 1.5); p.lineTo(c.x - r * 0.35, c.y - r * 1.1); p.lineTo(c.x + r * 0.15, c.y - r * 1.15); p.fill();
        p.fillStyle = "#ddd0ff"; p.fillRect(c.x - r * 0.1, c.y - r * 2.1, 1, r * 0.6);
        p.fillStyle = "#f48fb1"; p.fillRect(c.x - r * 0.1 + 1, c.y - r * 2.1, r * 0.35, r * 0.22);
      } else {
        for (let k = 0; k < 3; k++) {
          const tx = c.x + (R2() - 0.5) * r * 1.6, ty = c.y - r * 0.1 + (R2() - 0.5) * r * 0.4;
          p.fillStyle = "#6b4a3a"; p.fillRect(tx, ty - r * 0.25, 1.5, r * 0.3);
          p.fillStyle = k % 2 ? "#3a4d3f" : "#4d6644"; p.beginPath(); p.arc(tx + 0.5, ty - r * 0.35, r * 0.22, 0, 7); p.fill();
          p.fillStyle = "#6a8550"; p.beginPath(); p.arc(tx - r * 0.05, ty - r * 0.42, r * 0.1, 0, 7); p.fill();
        }
        if (idx % 2 === 0) {
          const hx = c.x + r * 0.25, hy = c.y - r * 0.05, hs = r * 0.32;
          p.fillStyle = "#e9dfe6"; p.fillRect(hx - hs / 2, hy - hs * 0.6, hs, hs * 0.6);
          p.fillStyle = "#d9789f"; p.beginPath(); p.moveTo(hx - hs * 0.65, hy - hs * 0.55); p.lineTo(hx, hy - hs * 1.1); p.lineTo(hx + hs * 0.65, hy - hs * 0.55); p.fill();
          p.fillStyle = "#ffd28a"; p.fillRect(hx - 1, hy - hs * 0.35, 2, 2);
        }
        for (let k = 0; k < 5; k++) flower(p, c.x + (R2() - 0.5) * r * 2, c.y + (R2() - 0.2) * r * 0.4, 1.3 + R2(), ["pink", "lav", "peach", "white"][k % 4], R2);
        // sign post
        p.fillStyle = "#8c6650"; p.fillRect(c.x - r * 0.75, c.y - r * 0.5, 1.5, r * 0.5);
        p.fillStyle = "#b98b62"; p.fillRect(c.x - r * 0.95, c.y - r * 0.55, r * 0.45, r * 0.18);
      }
      leaf(p, c.x - r * 1.1, c.y, r * 0.3, -2.2, r * 0.1, "#3a4d3f", "#6a8550");
    });
    quantize(isl); outline(isl);

    // compass rose
    const comp = makeCanvas(25, 25), q = comp.getContext("2d");
    q.strokeStyle = "#f48fb1"; q.lineWidth = 1; q.beginPath(); q.arc(12.5, 12.5, 7.5, 0, 7); q.stroke();
    q.fillStyle = "#f48fb1";
    q.beginPath(); q.moveTo(12.5, 1); q.lineTo(14.5, 12.5); q.lineTo(12.5, 24); q.lineTo(10.5, 12.5); q.fill();
    q.beginPath(); q.moveTo(1, 12.5); q.lineTo(12.5, 10.5); q.lineTo(24, 12.5); q.lineTo(12.5, 14.5); q.fill();
    q.fillStyle = "#ffc9df"; q.fillRect(12, 12, 1, 1);
    const cl = [
      { c: cloudSprite(Math.min(120, w * 0.25), 20, 4, CLOUD_PURPLE), x: w * 0.05, y: h * 0.12, v: 0.3, a: 0.45 },
      { c: cloudSprite(Math.min(90, w * 0.2), 16, 8, CLOUD_PURPLE), x: w * 0.7, y: h * 0.16, v: 0.25, a: 0.4 },
    ];
    const parts = [];

    return {
      draw(t, c) {
        const sec = t / 1000;
        c.globalAlpha = 1; c.drawImage(sea, 0, 0);
        for (const wv of waves) {
          const a = 0.5 + 0.5 * Math.sin(sec * 0.8 + wv.p);
          if (a < 0.35) continue;
          c.globalAlpha = a * 0.55; c.fillStyle = "#6f7fd0";
          c.fillRect(Math.round(wv.x + Math.sin(sec * 0.5 + wv.p) * 2), Math.round(wv.y), wv.l, 1);
        }
        c.globalAlpha = 1;
        const shift = reduce ? 0 : Math.floor(sec * 4);
        for (const d of dots) if ((d.k + shift) % 3 !== 0) px(c, d.x, d.y, "#fff0f6", 0.8);
        c.globalAlpha = 1;
        c.drawImage(isl, 0, 0);
        drawClouds(c, cl, reduce ? 0 : sec, w);
        // a little boat
        const bx = ((w * 0.35 + (reduce ? 0 : sec * 3)) % (w + 20)) - 10, by = h * (land ? 0.9 : 0.97) + Math.sin(sec * 2) * 0.8;
        drawSprite(c, BOAT, { p: "#fff0f6", b: "#8c6650" }, bx, by);
        if (land) { c.globalAlpha = 0.85; c.drawImage(comp, w - 40, h - 38); c.globalAlpha = 1; }
        drawParts(c, parts, sec, h);
      },
      click(x, y) { burst(parts, x, y); },
    };
  };
}
