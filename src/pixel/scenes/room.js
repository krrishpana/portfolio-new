// About: a cozy room — you at the windowsill with a mug, the city at night outside.
import {
  rng, makeCanvas, quantize, outline, ditherGradient, glow, moon, makeStars, drawStars, leaf, stem, flower, px, burst, drawParts,
} from "../engine.js";

// You, at the window: a hand-drawn pixel sprite (side view, chin on hand).
// Each letter is one pixel. Edit the rows to change her look.
const GIRL = [
  "...............oooooooo",
  "............oooHHHHHHHHooo",
  "..........ooHHHhhhhhhhHHHHoo",
  ".........oHHhhhlllhhhhhhHHHHo",
  "........oHhhhllllhhhhhhhhhHHHo",
  ".......oHhhhlllhhhhhhhhhhhhHHHo",
  ".......oHhhhhhhhhhhhhhhhhhhhHHHo",
  "......oHhhhhhfFfhhhhhhhhhhhhHHHHo",
  "......oHhhhhfFyFfhhhhhhhhhhHHHHHo",
  "......oHhhhhhfFfhhhhhhhhhHHHhHHHo",
  "......oHhhhhhhhhhhhhhhhhHHhSHhHHo",
  ".....oHhhhhhhhhhhhhhhhHHHSSSSHhHo",
  ".....oHhhhhhhhhhhhhhhHHSSSSSSSHHo",
  ".....oHhhhhhhhhhhhhhHSSSSSSSoSSSo",
  ".....oHhhhhhhhhhhhhHSSssSSSSeoSSo",
  ".....oHhhhhhhhhhhhhHSssSSSSSewSSSo",
  ".....oHhhhhhhhhhhhhHSsSSSSSSeeSSSSo",
  ".....oHhhhhhhhhhhhhHSSSSSSSSSSSSSo",
  ".....oHhhhhhhhhhhhhhHSSSSSSSbbSSo",
  "....oHhhhhhhhhhhhhhhHHSSSSSSbbSmo",
  "....oHhhhhhhhhhhhhhhhHHsSSSSSSSo",
  "....oHhhhhhhhhhhhhhhhHHHssSSSSoSSo",
  "....oHhhhhhhhhhhhhhhhhHHHsssooSSSSo",
  "...oHhhhhhhhhhhhhhhhhhHHHHsoSSsSsSo",
  "...oHhhhhhhhhhhhhHHhhhhHHHoSSsSsSSo",
  "...oHhhhhhhhhhhhHHPPHhhhHoPLSSSSSo",
  "...oHhhhhhhhhhhHHPPPPHhHoPLLLooooo",
  "...oHhhhhhhhhhHHPPPPPPHHoPLLLLPo",
  "..oHhhhhhhhhhhHPPPPPPPPHoPLLLLPPo",
  "..oHhhhhhhhhhHHPPPPPPPPPoPLLLLPPo",
  "..oHhhhhhhhhhHPPPPPPPPPPoPLLLLPPo",
  "..oHhhhhhhhhHHPPPPPPPPPPoPLLLLPPPo",
  "..oHhhhhhhhhHPPPPPPPPPPPoPLLLLPPPo",
  "..oHhhhhhhhHHPPPPPPPPPPoPLLLLLPPPo",
  ".oHhhhhhhhhHPPPPPPPPPPPoPLLLLLPPPo",
  ".oHhhhhhHhhHPPPPPPPPPPPoPLLLLLPPPo",
  ".oHhhhhHoHhHPPPPPPPPPPPoPLLLLLPPPPo",
  ".oHhhhHo.oHHPPPPPPPPPPpoPLLLLLPPPPo",
  "..oHhHo..oHPPPPPPPPPPppoPLLLLPPPPPo",
  "..oHHo..oHHPPPPPPPPPPppoPPLLLPPPPPoooooooooo",
  "...oo...oHPPPPPPPPPPpppppoPPPPPPPPPoLLLLLLLLLoooo",
  "........oPPPPPPPPPPppppppPoPPPPPPPPPoLLLLLLLLLLSSSo",
  "........oPPPPPPPPPPpppppppPooooooooPPPPPPPPPPPoSsSSo",
  "........oPPPPPPPPPpppppppppPPPPPPPPPPPPPPPPPPPpoSSso",
];
const GIRL_COLORS = {
  o: "#2a1a2e", H: "#3e2633", h: "#5a3a48", l: "#7a5060",          // outline + hair
  S: "#f6cdb8", s: "#dfa48f", b: "#ee8fa3", m: "#c76b7e",          // skin, shadow, blush, lips
  e: "#2a1f3a", w: "#ffffff",                                       // eye
  P: "#9b7fd6", p: "#7a62b8", L: "#bfa9f5",                         // sweater
  f: "#f48fb1", F: "#ffc9df", y: "#ffd28a",                         // flower clip
};
function drawGirl(ctx, x, y, sc) {
  GIRL.forEach((row, ry) => [...row].forEach((ch, rx) => {
    const c = GIRL_COLORS[ch];
    if (c) { ctx.fillStyle = c; ctx.fillRect(x + rx * sc, y + ry * sc, sc, sc); }
  }));
}

export default function buildRoom({ w, h, reduce }) {
  const R = rng(31);
  const portrait = w / h < 1.15;
  // window interior
  const wx0 = Math.round(w * (portrait ? 0.06 : 0.14)), wx1 = Math.round(w * 0.95);
  const wy0 = Math.round(h * 0.07), wy1 = Math.round(h * 0.7);
  const ww = wx1 - wx0, wh = wy1 - wy0;
  const sillY = wy1 + 3;
  const u = Math.min(w, h) / 200; // size unit

  /* outside the window */
  const out = makeCanvas(ww, wh), o = out.getContext("2d");
  ditherGradient(o, 0, 0, ww, wh, [[0, "#1d1642"], [0.45, "#33276e"], [0.75, "#5c449c"], [0.92, "#a95f9f"], [1, "#e08aa6"]], 20);
  moon(o, Math.round(ww * 0.78), Math.round(wh * 0.2), Math.max(4, Math.round(5 * u)));
  const lights = [];
  const skyline = (base, colr, hmin, hmax, lit) => {
    let x = -2;
    while (x < ww) {
      const bw = Math.round((5 + R() * 9) * u), bh = Math.round((hmin + R() * (hmax - hmin)) * u);
      o.fillStyle = colr; o.fillRect(x, base - bh, bw, bh + 4);
      if (lit) for (let yy = base - bh + 2; yy < base - 1; yy += 3) for (let xx = x + 1; xx < x + bw - 1; xx += 2)
        if (R() < 0.22) lights.push({ x: wx0 + xx, y: wy0 + yy, p: R() * 6.28 });
      x += bw + Math.round(R() * 2);
    }
  };
  skyline(wh, "#4a3a86", 18, 48, false);
  // a tall tower
  const tx = Math.round(ww * 0.55), tb = wh;
  o.fillStyle = "#3d2f76";
  o.fillRect(tx - 1, tb - Math.round(70 * u), 3, Math.round(70 * u));
  o.fillRect(tx - 3, tb - Math.round(52 * u), 7, Math.round(4 * u));
  o.fillRect(tx - 2, tb - Math.round(46 * u), 5, Math.round(46 * u));
  const beacon = { x: wx0 + tx, y: wy0 + tb - Math.round(70 * u) - 1 };
  skyline(wh, "#2f2466", 8, 30, true);
  const stars = makeStars(R, ww, wh, { density: 120, maxY: 0.6, sparkles: 0.5 }).map((s) => ({ ...s, x: s.x + wx0, y: s.y + wy0 }));

  /* wall, frame, sill */
  const room = makeCanvas(w, h), r = room.getContext("2d");
  ditherGradient(r, 0, 0, w, h, [[0, "#271d52"], [0.6, "#2a1f56"], [1, "#1f1844"]], 10);
  r.fillStyle = "#30255f";
  for (let y = 4; y < h; y += 8) for (let x = (y / 8) % 2 ? 4 : 0; x < w; x += 8) r.fillRect(x, y, 1, 1);
  glow(r, wx0 + ww * 0.4, sillY, ww * 0.55, "rgba(255,190,150,.10)");
  r.clearRect(wx0, wy0, ww, wh);
  const fr = Math.max(3, Math.round(3 * u));
  r.fillStyle = "#4b3b8f"; r.fillRect(wx0 - fr, wy0 - fr, ww + fr * 2, fr); r.fillRect(wx0 - fr, wy0, fr, wh); r.fillRect(wx1, wy0, fr, wh);
  r.fillStyle = "#6b55b0"; r.fillRect(wx0 - fr, wy0 - fr, ww + fr * 2, 1); r.fillRect(wx0 - fr, wy0, 1, wh);
  r.fillStyle = "#41337e";
  const mid = Math.round(wx0 + ww * 0.5);
  r.fillRect(mid - 1, wy0, Math.max(2, Math.round(u * 1.5)), wh);
  r.fillRect(wx0, Math.round(wy0 + wh * 0.42), ww, Math.max(2, Math.round(u * 1.5)));
  // sill
  const sh = Math.max(4, Math.round(5 * u));
  r.fillStyle = "#8c6650"; r.fillRect(wx0 - fr * 3, sillY - 3, ww + fr * 5, sh);
  r.fillStyle = "#b98b62"; r.fillRect(wx0 - fr * 3, sillY - 3, ww + fr * 5, 1);
  r.fillStyle = "#6b4a3a"; r.fillRect(wx0 - fr * 3, sillY - 3 + sh - 1, ww + fr * 5, 2);
  quantize(room, false);
  // glass glints
  const glass = makeCanvas(w, h), gl = glass.getContext("2d");
  gl.fillStyle = "rgba(221,208,255,.10)";
  for (const k of [0.08, 0.62]) {
    const bx = wx0 + ww * k;
    gl.beginPath(); gl.moveTo(bx, wy0 + wh); gl.lineTo(bx + wh * 0.45, wy0); gl.lineTo(bx + wh * 0.45 + 6 * u, wy0); gl.lineTo(bx + 6 * u, wy0 + wh); gl.fill();
  }

  /* props: girl, plants, mug, books, notes, vines */
  const props = makeCanvas(w, h), p = props.getContext("2d");
  const R2 = rng(5);
  // vines along the top of the frame
  for (let x = wx0 - fr; x < wx1 + fr; x += 2 + R2() * 4) {
    const y = wy0 - fr + 1;
    leaf(p, x, y, (3 + R2() * 4) * u, 0.6 + R2() * 2, 1.6 * u, "#2d4636", "#6a8550");
  }
  for (const vx of [wx0 + ww * 0.04, wx0 + ww * 0.3, wx1 - ww * 0.06]) {
    const len = wh * (0.25 + R2() * 0.35);
    stem(p, vx, wy0 - fr, vx + 2, wy0 + len, 4, 1, "#3d5a3f");
    for (let k = 4; k < len; k += 3 + R2() * 3) leaf(p, vx + 1 + Math.sin(k) * 1.5, wy0 + k, (3 + R2() * 2) * u, R2() < 0.5 ? 0.4 : Math.PI - 0.4, 1.4 * u, "#2d4636", "#6a8550");
  }
  // sticky notes
  const note = (x, y, c) => { p.save(); p.translate(x, y); p.rotate((R2() - 0.5) * 0.3); p.fillStyle = c; p.fillRect(0, 0, 9 * u, 9 * u); p.fillStyle = "rgba(60,40,90,.6)"; for (let i = 2; i < 8; i += 2) p.fillRect(1.5 * u, i * u, 6 * u, 0.7); p.restore(); };
  note(wx0 + ww * 0.06, wy0 + wh * 0.1, "#ffe7b0"); note(wx0 + ww * 0.13, wy0 + wh * 0.16, "#ffc9df"); note(wx0 + ww * 0.07, wy0 + wh * 0.25, "#ddd0ff");

  // mug + books + plant on the sill
  const gsc = Math.max(1, Math.floor((wh * 0.62) / 44));       // sprite scale (whole pixels only)
  const gx = Math.round(wx0 + ww * (portrait ? 0.3 : 0.27) - 28 * gsc);
  const gy = Math.round(sillY - 3 - 44 * gsc);
  const G = 44 * gsc;
  const mugX = gx + 54 * gsc, mugW = G * 0.13, mugH = G * 0.15;
  p.fillStyle = "#fdf0f6"; p.fillRect(mugX, sillY - 3 - mugH, mugW, mugH);
  p.fillStyle = "#f48fb1"; p.fillRect(mugX, sillY - 3 - mugH * 0.6, mugW, mugH * 0.25);
  p.strokeStyle = "#fdf0f6"; p.lineWidth = Math.max(1, u); p.beginPath(); p.arc(mugX + mugW + 1, sillY - 3 - mugH * 0.5, mugH * 0.22, -1.4, 1.4); p.stroke();
  const steam = { x: mugX + mugW / 2, y: sillY - 4 - mugH };
  const bx = wx0 + ww * (portrait ? 0.72 : 0.68);
  const bookCols = ["#8b7edb", "#f2a2c3", "#5fbf95", "#ffd28a"];
  let by = sillY - 3;
  for (let i = 0; i < 4; i++) { const bh = 3 * u, bw = (16 - i * 2 + R2() * 3) * u; p.fillStyle = bookCols[i]; p.fillRect(bx + (R2() - 0.5) * 3, by - bh, bw, bh); by -= bh; }
  // potted plant at the right end
  const ppx = wx1 - ww * 0.06, potH = 9 * u;
  p.fillStyle = "#b98b62"; p.beginPath(); p.moveTo(ppx - 6 * u, sillY - 3 - potH); p.lineTo(ppx + 6 * u, sillY - 3 - potH); p.lineTo(ppx + 4.5 * u, sillY - 3); p.lineTo(ppx - 4.5 * u, sillY - 3); p.fill();
  for (let i = 0; i < 9; i++) leaf(p, ppx, sillY - 3 - potH, (8 + R2() * 10) * u, -0.4 - R2() * 2.4, 3 * u, "#2d4636", "#6a8550");
  flower(p, ppx - 5 * u, sillY - potH - 14 * u, 3 * u, "pink", R2);
  flower(p, ppx + 6 * u, sillY - potH - 11 * u, 2.6 * u, "lav", R2);
  // small succulent left
  const spx = wx0 + ww * 0.06;
  p.fillStyle = "#8b7edb"; p.fillRect(spx - 4 * u, sillY - 3 - 6 * u, 8 * u, 6 * u);
  for (let i = 0; i < 5; i++) leaf(p, spx, sillY - 3 - 6 * u, (5 + R2() * 3) * u, -0.6 - i * 0.5, 2.4 * u, "#3a4d3f", "#93ab62");
  quantize(props); outline(props);
  drawGirl(p, gx, gy, gsc);

  // string lights hanging along the top of the window
  const bulbs = [];
  const n = Math.round(ww / (9 * u));
  for (let i = 0; i <= n; i++) {
    const t = i / n, x = wx0 + ww * t;
    const sag = Math.sin(t * Math.PI * 3) ** 2 * 7 * u;
    bulbs.push({ x, y: wy0 + 2 + sag, c: ["#ffe7b0", "#ffc9df", "#ffd28a", "#ddd0ff"][i % 4], p: i * 0.9 });
  }
  const shooting = { t: -10 };
  const parts = [];

  return {
    draw(t, c) {
      const s = t / 1000;
      c.globalAlpha = 1;
      c.drawImage(out, wx0, wy0);
      c.save(); c.beginPath(); c.rect(wx0, wy0, ww, wh); c.clip();
      drawStars(c, stars, s);
      for (const l of lights) { const b = Math.sin(s * 0.6 + l.p); if (b > -0.5) px(c, l.x, l.y, b > 0.4 ? "#ffe7b0" : "#ffd28a", 0.9); }
      px(c, beacon.x, beacon.y, "#ff7aa8", Math.sin(s * 3) > 0 ? 1 : 0.2);
      if (!reduce) {
        if (s - shooting.t > 7 && Math.random() < 0.01) Object.assign(shooting, { t: s, x: wx0 + ww * (0.2 + Math.random() * 0.5), y: wy0 + wh * 0.08 });
        const k = (s - shooting.t) * 60;
        if (k < 40) for (let i = 0; i < 8; i++) px(c, shooting.x + k - i, shooting.y + (k - i) * 0.4, "#ffffff", (1 - i / 8) * (1 - k / 40));
      }
      c.restore();
      c.globalAlpha = 1;
      c.drawImage(glass, 0, 0);
      c.drawImage(room, 0, 0);
      c.drawImage(props, 0, 0);
      // string lights
      c.strokeStyle = "rgba(30,24,60,.9)"; c.lineWidth = 1; c.beginPath();
      bulbs.forEach((b, i) => (i ? c.lineTo(b.x, b.y) : c.moveTo(b.x, b.y))); c.stroke();
      for (const b of bulbs) {
        const k = reduce ? 1 : 0.65 + 0.35 * Math.sin(s * 1.6 + b.p);
        c.globalAlpha = 0.14 * k; c.fillStyle = b.c; c.fillRect(Math.round(b.x) - 1, Math.round(b.y), 3, 4);
        px(c, b.x, b.y + 1, b.c, k); px(c, b.x, b.y + 2, b.c, k);
      }
      // steam from the mug
      if (!reduce) for (let i = 0; i < 3; i++) {
        const k = ((s * 0.5 + i / 3) % 1);
        px(c, steam.x + Math.sin(k * 6 + i) * 1.5 + (i - 1), steam.y - k * 9 * u, "#f3e8ff", 0.6 * (1 - k));
      }
      c.globalAlpha = 1;
      drawParts(c, parts, s, h);
    },
    click(x, y) { burst(parts, x, y); },
  };
}
