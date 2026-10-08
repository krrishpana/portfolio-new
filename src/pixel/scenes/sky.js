// A quiet night-sky background with optional flower patches in the bottom corners.
// Used behind Projects, Lab and Contact.
import {
  rng, makeCanvas, quantize, outline, ditherGradient, makeStars, drawStars, cloudSprite, CLOUD_PURPLE, drawClouds,
  flowerTuft, leaf, burst, drawParts, makeFlies, drawFlies, drawButterfly,
} from "../engine.js";

export function makeSky({ seed = 1, top = "#221a4a", mid = "#2f2468", bottom = "#3a2d78", corners = "both", butterfly = null, clouds = true } = {}) {
  return function build({ w, h, reduce }) {
    const R = rng(seed);
    const bg = makeCanvas(w, h), b = bg.getContext("2d");
    ditherGradient(b, 0, 0, w, h, [[0, top], [0.55, mid], [1, bottom]], 14);
    const stars = makeStars(R, w, h, { density: 900, maxY: 1, sparkles: 0.8 });
    const cl = clouds
      ? [
          { c: cloudSprite(Math.min(140, w * 0.3), 22, seed + 3, CLOUD_PURPLE), x: w * 0.1, y: h * 0.18, v: 0.25, a: 0.25 },
          { c: cloudSprite(Math.min(110, w * 0.25), 18, seed + 7, CLOUD_PURPLE), x: w * 0.65, y: h * 0.6, v: 0.2, a: 0.2 },
        ]
      : [];

    const pl = makeCanvas(w, h), p = pl.getContext("2d");
    const R2 = rng(seed + 11);
    const sc = Math.max(0.8, Math.min(1.6, h / 260));
    const patch = (x0, x1) => {
      for (let x = x0; x < x1; x += 2 + R2() * 3) {
        const d = Math.min(x - x0, x1 - x) / ((x1 - x0) / 2);
        leaf(p, x, h + 1, (4 + R2() * 10 * d) * sc, -1 - R2() * 1.1, 2 * sc, "#2a3a36", "#4d6644");
      }
      for (let x = x0 + 6; x < x1 - 4; x += 7 + R2() * 9) {
        const d = Math.min(x - x0, x1 - x) / ((x1 - x0) / 2);
        flowerTuft(p, x, h + 1, (10 + R2() * 22 * d) * sc, ["pink", "lav", "peach", "mag", "white"], R2, sc * 0.9);
      }
    };
    const span = Math.min(w * 0.22, 110);
    if (corners === "both" || corners === "left") patch(-4, span);
    if (corners === "both" || corners === "right") patch(w - span, w + 4);
    quantize(pl); outline(pl);

    const flies = corners ? makeFlies(R, 8, 0, w, h * 0.7, h) : [];
    const parts = [];
    return {
      draw(t, c) {
        const s = t / 1000;
        c.globalAlpha = 1; c.drawImage(bg, 0, 0);
        drawStars(c, stars, s);
        drawClouds(c, cl, reduce ? 0 : s, w);
        c.drawImage(pl, 0, 0);
        drawFlies(c, flies, s);
        if (butterfly) drawButterfly(c, s, w * butterfly.x, h * butterfly.y, w * 0.03, h * 0.05, { pink: butterfly.pink, still: reduce, seed: seed });
        drawParts(c, parts, s, h);
      },
      click(x, y) { burst(parts, x, y); },
    };
  };
}
