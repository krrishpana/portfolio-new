// Lab decorations: a terrarium jar and a bubbling flask with books.
import { rng, makeCanvas, quantize, outline, leaf, stem, flower, px, flowerTuft } from "../engine.js";

export function buildJar({ w, h, reduce }) {
  const R = rng(3);
  const cx = w / 2, jw = Math.min(w * 0.7, h * 0.55), jh = jw * 1.2;
  const top = h - jh - h * 0.08, bottom = h - h * 0.08;
  const art = makeCanvas(w, h), p = art.getContext("2d");
  // soil + plant inside
  p.fillStyle = "#6b4a3a"; p.fillRect(cx - jw * 0.42, bottom - jh * 0.18, jw * 0.84, jh * 0.18);
  p.fillStyle = "#8c6650"; p.fillRect(cx - jw * 0.42, bottom - jh * 0.18, jw * 0.84, 2);
  stem(p, cx, bottom - jh * 0.16, cx - 2, top + jh * 0.38, 4, Math.max(1, jw * 0.03));
  for (let i = 0; i < 6; i++) leaf(p, cx - 1, bottom - jh * (0.2 + i * 0.07), jw * (0.22 - i * 0.015), i % 2 ? -0.4 : Math.PI + 0.4, jw * 0.07, "#2d4636", "#6a8550");
  flower(p, cx - 2, top + jh * 0.36, jw * 0.1, "pink", R);
  flower(p, cx + jw * 0.18, top + jh * 0.55, jw * 0.06, "lav", R);
  p.fillStyle = "#93ab62"; for (let i = 0; i < 6; i++) p.fillRect(cx - jw * 0.35 + R() * jw * 0.7, bottom - jh * 0.2, 1, 2);
  quantize(art); outline(art);

  const glass = makeCanvas(w, h), g = glass.getContext("2d");
  g.fillStyle = "rgba(201,168,255,.13)";
  g.beginPath(); g.roundRect(cx - jw / 2, top + jh * 0.12, jw, jh * 0.88, [jw * 0.35, jw * 0.35, 6, 6]); g.fill();
  g.strokeStyle = "rgba(221,208,255,.75)"; g.lineWidth = 1; g.stroke();
  g.fillStyle = "rgba(255,255,255,.35)"; g.fillRect(cx - jw * 0.38, top + jh * 0.3, 2, jh * 0.45);
  g.fillStyle = "#b98b62"; g.fillRect(cx - jw * 0.28, top + jh * 0.02, jw * 0.56, jh * 0.1);
  g.fillStyle = "#e3c58f"; g.fillRect(cx - jw * 0.28, top + jh * 0.02, jw * 0.56, 1);
  g.fillStyle = "#8c6650"; g.fillRect(cx - jw * 0.32, top + jh * 0.1, jw * 0.64, 2);
  // ground flowers outside the jar
  const ground = makeCanvas(w, h), gp = ground.getContext("2d");
  flowerTuft(gp, cx - jw * 0.62, h, h * 0.18, ["pink", "peach"], R, 1);
  flowerTuft(gp, cx + jw * 0.62, h, h * 0.14, ["lav", "pink"], R, 1);
  quantize(ground); outline(ground);

  const flies = Array.from({ length: 4 }, (_, i) => ({ p: i * 1.7 }));
  return {
    draw(t, c) {
      const s = t / 1000;
      c.clearRect(0, 0, w, h);
      c.globalAlpha = 1;
      c.drawImage(art, 0, 0);
      for (const f of flies) {
        const x = cx + Math.sin(s * 0.7 + f.p) * jw * 0.28, y = top + jh * 0.55 + Math.cos(s * 0.9 + f.p * 2) * jh * 0.18;
        const b = reduce ? 1 : 0.5 + 0.5 * Math.sin(s * 2 + f.p);
        px(c, x, y, "#fff3c4", b);
      }
      c.globalAlpha = 1;
      c.drawImage(glass, 0, 0);
      c.drawImage(ground, 0, 0);
      const sp = reduce ? 1 : (Math.sin(s * 1.5) + 1) / 2;
      px(c, cx + jw * 0.55, top + jh * 0.1, "#ffffff", sp); px(c, cx + jw * 0.55 + 1, top + jh * 0.1, "#c9a8ff", sp * 0.6); px(c, cx + jw * 0.55 - 1, top + jh * 0.1, "#c9a8ff", sp * 0.6);
      c.globalAlpha = 1;
    },
  };
}

export function buildFlask({ w, h, reduce }) {
  const R = rng(8);
  const art = makeCanvas(w, h), p = art.getContext("2d");
  const u = Math.min(w, h) / 60;
  const base = h - 2;
  // books
  const cols = ["#8b7edb", "#d9789f", "#f2a2c3"];
  let y = base;
  cols.forEach((c, i) => { const bh = 4 * u, bw = (30 - i * 3) * u; p.fillStyle = c; p.fillRect(w * 0.08 + i * u, y - bh, bw, bh); p.fillStyle = "#fff0f6"; p.fillRect(w * 0.08 + i * u + bw - 2 * u, y - bh + u, 1.5 * u, bh - 2 * u); y -= bh; });
  // flask
  const fx = w * 0.62, fr = 11 * u, fy = base - fr;
  p.fillStyle = "#e86aa0"; p.beginPath(); p.arc(fx, fy, fr * 0.92, 0.1, Math.PI - 0.1); p.fill();
  p.fillStyle = "#f48fb1"; p.fillRect(fx - fr * 0.9, fy, fr * 1.8, 1.5 * u);
  p.fillStyle = "#b98b62"; p.fillRect(fx - 3.5 * u, fy - fr - 13 * u, 7 * u, 4 * u);
  flowerTuft(p, w * 0.9, base + 2, 16 * u, ["pink", "lav"], R, u * 0.8);
  quantize(art); outline(art);
  const glass = makeCanvas(w, h), g = glass.getContext("2d");
  g.fillStyle = "rgba(221,208,255,.16)"; g.strokeStyle = "rgba(221,208,255,.8)"; g.lineWidth = 1;
  g.beginPath(); g.arc(fx, fy, fr, -1.25, Math.PI + 1.25); g.lineTo(fx - 3 * u, fy - fr - 9 * u); g.lineTo(fx + 3 * u, fy - fr - 9 * u); g.closePath(); g.fill(); g.stroke();
  g.fillStyle = "rgba(255,255,255,.45)"; g.fillRect(fx - fr * 0.6, fy - fr * 0.4, 1.5, fr * 0.6);
  const bubbles = Array.from({ length: 5 }, (_, i) => ({ p: i / 5, x: (R() - 0.5) * fr }));
  return {
    draw(t, c) {
      const s = t / 1000;
      c.clearRect(0, 0, w, h);
      c.globalAlpha = 1; c.drawImage(art, 0, 0); c.drawImage(glass, 0, 0);
      for (const b of bubbles) {
        const k = reduce ? b.p : (s * 0.4 + b.p) % 1;
        const by = fy + fr * 0.6 - k * (fr * 2.4), bx = fx + b.x * (1 - k * 0.7);
        if (by < fy - fr - 12 * u) continue;
        px(c, bx, by, "#ffc9df", 0.9 * (1 - k * 0.6));
      }
      c.globalAlpha = 1;
    },
  };
}
