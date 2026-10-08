// Contact: night sky with a flying love-letter and a heart signpost among flowers.
import { rng, makeCanvas, quantize, outline, flowerTuft, px } from "../engine.js";
import { makeSky } from "./sky.js";

const skyBuild = makeSky({ seed: 23, corners: "both", butterfly: { x: 0.86, y: 0.22, pink: false } });

export default function buildContact(opts) {
  const { w, h, land, reduce } = opts;
  const base = skyBuild(opts);
  const u = Math.min(w, h) / 150;

  // envelope
  const env = makeCanvas(40 * u + 4, 28 * u + 4), e = env.getContext("2d");
  const ew = 34 * u, eh = 22 * u;
  e.save(); e.translate(2, 2 + 4 * u); e.rotate(-0.12);
  e.fillStyle = "#fbe3f2"; e.fillRect(0, 0, ew, eh);
  e.fillStyle = "#f2c4dc"; e.beginPath(); e.moveTo(0, eh); e.lineTo(ew / 2, eh * 0.45); e.lineTo(ew, eh); e.fill();
  e.fillStyle = "#ffdcec"; e.beginPath(); e.moveTo(0, 0); e.lineTo(ew / 2, eh * 0.58); e.lineTo(ew, 0); e.fill();
  e.fillStyle = "#e86aa0";
  const hx = ew / 2, hy = eh * 0.52, hs = 3 * u;
  e.beginPath(); e.arc(hx - hs * 0.5, hy - hs * 0.2, hs * 0.6, 0, 7); e.arc(hx + hs * 0.5, hy - hs * 0.2, hs * 0.6, 0, 7); e.fill();
  e.beginPath(); e.moveTo(hx - hs * 1.05, hy); e.lineTo(hx, hy + hs * 1.1); e.lineTo(hx + hs * 1.05, hy); e.fill();
  e.restore();
  quantize(env, false); outline(env);
  const ex = land ? w * 0.07 : w * 0.28, ey = land ? h * 0.66 : h - 70 * u;

  // signpost with heart
  const sp = makeCanvas(w, h), p = sp.getContext("2d");
  const R = rng(5);
  const sx = land ? w * 0.9 : w * 0.84, gy = h + 1, ph = (land ? 70 : 52) * u;
  p.fillStyle = "#8c6650"; p.fillRect(sx - 2 * u, gy - ph, 4 * u, ph);
  p.fillStyle = "#b98b62"; p.fillRect(sx - 2 * u, gy - ph, 1.2 * u, ph);
  const sign = (y, dir, wid) => {
    p.fillStyle = "#c9a46c";
    p.beginPath();
    const x0 = sx + (dir > 0 ? -4 * u : 4 * u), x1 = x0 + dir * wid;
    p.moveTo(x0, y); p.lineTo(x1, y); p.lineTo(x1 + dir * 6 * u, y + 6 * u); p.lineTo(x1, y + 12 * u); p.lineTo(x0, y + 12 * u); p.fill();
    p.fillStyle = "#e3c58f"; p.fillRect(Math.min(x0, x1), y, wid, 1.2 * u);
    return (x0 + x1) / 2;
  };
  const hcx = sign(gy - ph + 6 * u, -1, 30 * u);
  sign(gy - ph + 22 * u, 1, 22 * u);
  p.fillStyle = "#e86aa0";
  const hcy = gy - ph + 12 * u, k = 3.2 * u;
  p.beginPath(); p.arc(hcx - k * 0.5, hcy - k * 0.2, k * 0.6, 0, 7); p.arc(hcx + k * 0.5, hcy - k * 0.2, k * 0.6, 0, 7); p.fill();
  p.beginPath(); p.moveTo(hcx - k * 1.05, hcy); p.lineTo(hcx, hcy + k * 1.1); p.lineTo(hcx + k * 1.05, hcy); p.fill();
  flowerTuft(p, sx - 8 * u, gy, 18 * u, ["pink", "peach"], R, u);
  flowerTuft(p, sx + 9 * u, gy, 14 * u, ["lav", "pink"], R, u);
  quantize(sp, false); outline(sp);

  return {
    draw(t, c) {
      const s = t / 1000;
      base.draw(t, c);
      c.drawImage(sp, 0, 0);
      const bob = reduce ? 0 : Math.round(Math.sin(s * 1.4) * 2);
      // dotted trail behind the letter
      for (let i = 1; i < 9; i++) {
        const tx = ex + (land ? 34 * u + i * 4 * u : -i * 4 * u), ty = ey + 16 * u + Math.sin(i * 0.9 + s) * 3 * u + bob;
        px(c, tx, ty, "#f48fb1", 0.7 - i * 0.07);
      }
      c.globalAlpha = 1;
      c.drawImage(env, Math.round(ex), Math.round(ey + bob));
    },
    click: base.click,
  };
}
