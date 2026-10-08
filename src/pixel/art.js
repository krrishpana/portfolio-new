// Small pixel illustrations for the project cards.
// Each draws on a 64×44 canvas, then gets snapped to the palette and outlined.
import { makeCanvas, pixelize, rng, flower, leaf } from "./engine.js";

const W = 64, H = 44;

const sparkle = (p, x, y, c = "#ddd0ff") => {
  p.fillStyle = c;
  p.fillRect(x, y - 1, 1, 3); p.fillRect(x - 1, y, 3, 1);
};

const ART = {
  chart(p) {
    // laptop
    p.fillStyle = "#b9a3f5"; p.fillRect(13, 6, 38, 25);
    p.fillStyle = "#2a1f56"; p.fillRect(15, 8, 34, 21);
    const bars = [6, 9, 7, 12, 15];
    bars.forEach((b, i) => { p.fillStyle = i % 2 ? "#f2a2c3" : "#b9a3f5"; p.fillRect(18 + i * 6, 27 - b, 4, b); });
    p.strokeStyle = "#f48fb1"; p.lineWidth = 1.4;
    p.beginPath(); p.moveTo(17, 24); p.lineTo(24, 19); p.lineTo(30, 21); p.lineTo(38, 13); p.lineTo(45, 10); p.stroke();
    p.fillStyle = "#f48fb1"; p.fillRect(44, 9, 3, 3);
    p.fillStyle = "#8b7edb";
    p.beginPath(); p.moveTo(9, 31); p.lineTo(55, 31); p.lineTo(58, 36); p.lineTo(6, 36); p.fill();
    p.fillStyle = "#ddd0ff"; p.fillRect(9, 31, 46, 1);
    sparkle(p, 56, 6, "#f48fb1"); sparkle(p, 6, 12); sparkle(p, 58, 22);
  },
  bowl(p, R) {
    const fruit = (x, y, r, c, hi) => { p.fillStyle = c; p.beginPath(); p.arc(x, y, r, 0, 7); p.fill(); p.fillStyle = hi; p.fillRect(x - r * 0.5, y - r * 0.6, 2, 2); };
    fruit(22, 22, 7, "#e86a6a", "#ffc6b0");
    fruit(34, 19, 7, "#ffb36b", "#ffe7b0");
    fruit(44, 23, 6, "#93ab62", "#d8e6a0");
    for (const [x, y] of [[28, 26], [31, 28], [27, 30], [30, 31], [33, 25]]) { p.fillStyle = "#6b55b0"; p.beginPath(); p.arc(x, y, 2.4, 0, 7); p.fill(); }
    fruit(16, 27, 4, "#d9789f", "#ffc9df");
    leaf(p, 36, 13, 9, -0.9, 3, "#3d5240", "#6a8550");
    leaf(p, 34, 13, 8, -2.4, 3, "#3d5240", "#6a8550");
    p.fillStyle = "#b9a3f5";
    p.beginPath(); p.moveTo(8, 27); p.quadraticCurveTo(32, 50, 56, 27); p.fill();
    p.fillStyle = "#ddd0ff"; p.fillRect(8, 27, 48, 2);
    p.fillStyle = "#8b7edb"; p.fillRect(26, 38, 12, 3);
    sparkle(p, 10, 10, "#f48fb1"); sparkle(p, 54, 12); sparkle(p, 50, 6, "#ffe7b0");
    flower(p, 52, 36, 3, "pink", R);
  },
  robot(p) {
    p.fillStyle = "#8b7edb"; p.fillRect(31, 2, 2, 6); p.fillStyle = "#f48fb1"; p.fillRect(30, 1, 4, 3);
    p.fillStyle = "#b9a3f5"; p.fillRect(20, 7, 24, 18);
    p.fillStyle = "#ddd0ff"; p.fillRect(20, 7, 24, 2);
    p.fillStyle = "#2a1f56"; p.fillRect(23, 11, 18, 10);
    p.fillStyle = "#7dd3fc"; p.fillRect(26, 14, 3, 4); p.fillRect(35, 14, 3, 4);
    p.fillStyle = "#f48fb1"; p.fillRect(30, 19, 4, 1);
    p.fillStyle = "#8b7edb"; p.fillRect(17, 13, 3, 6); p.fillRect(44, 13, 3, 6);
    p.fillStyle = "#6b55b0"; p.fillRect(22, 26, 20, 8);
    // open book
    p.fillStyle = "#d9789f"; p.beginPath(); p.moveTo(10, 32); p.lineTo(32, 35); p.lineTo(54, 32); p.lineTo(54, 42); p.lineTo(32, 43); p.lineTo(10, 42); p.fill();
    p.fillStyle = "#fff0f6";
    p.beginPath(); p.moveTo(12, 30); p.lineTo(32, 33); p.lineTo(32, 41); p.lineTo(12, 39); p.fill();
    p.beginPath(); p.moveTo(52, 30); p.lineTo(32, 33); p.lineTo(32, 41); p.lineTo(52, 39); p.fill();
    p.fillStyle = "#b9a3f5"; for (let i = 0; i < 3; i++) { p.fillRect(15, 33 + i * 2, 12, 1); p.fillRect(36, 33 + i * 2, 12, 1); }
    sparkle(p, 10, 8, "#f48fb1"); sparkle(p, 54, 6); sparkle(p, 56, 20, "#ffe7b0");
  },
  server(p) {
    // cloud
    p.fillStyle = "#ddd0ff";
    for (const [x, y, r] of [[22, 12, 6], [31, 8, 8], [41, 11, 6], [16, 15, 4], [47, 15, 4]]) { p.beginPath(); p.arc(x, y, r, 0, 7); p.fill(); }
    p.fillRect(14, 12, 36, 7);
    p.fillStyle = "#b9a3f5"; p.fillRect(16, 17, 32, 2);
    // racks
    for (let i = 0; i < 3; i++) {
      const y = 21 + i * 7;
      p.fillStyle = "#4b3b8f"; p.fillRect(18, y, 28, 6);
      p.fillStyle = "#6b55b0"; p.fillRect(18, y, 28, 1);
      p.fillStyle = "#2a1f56"; p.fillRect(21, y + 2, 14, 2);
      p.fillStyle = i === 1 ? "#f48fb1" : "#a7f3d0"; p.fillRect(38, y + 2, 2, 2);
      p.fillStyle = "#7dd3fc"; p.fillRect(42, y + 2, 2, 2);
    }
    p.fillStyle = "#8b7edb"; p.fillRect(31, 19, 2, 2);
    // small laptop
    p.fillStyle = "#b9a3f5"; p.fillRect(49, 30, 11, 8); p.fillStyle = "#2a1f56"; p.fillRect(50, 31, 9, 6);
    p.fillStyle = "#a7f3d0"; p.fillRect(52, 33, 4, 1);
    p.fillStyle = "#8b7edb"; p.fillRect(47, 38, 15, 2);
    sparkle(p, 6, 8, "#f48fb1"); sparkle(p, 58, 6); sparkle(p, 8, 30, "#ffe7b0");
  },
  eye(p) {
    p.fillStyle = "#fff0f6";
    p.beginPath(); p.moveTo(8, 22); p.quadraticCurveTo(32, 2, 56, 22); p.quadraticCurveTo(32, 42, 8, 22); p.fill();
    const g = p.createRadialGradient(32, 22, 1, 32, 22, 10);
    g.addColorStop(0, "#7dd3fc"); g.addColorStop(1, "#3b8ec2");
    p.fillStyle = g; p.beginPath(); p.arc(32, 22, 9.5, 0, 7); p.fill();
    p.fillStyle = "#1b1533"; p.beginPath(); p.arc(32, 22, 4.5, 0, 7); p.fill();
    p.fillStyle = "#ffffff"; p.fillRect(28, 17, 3, 3); p.fillRect(35, 25, 1, 1);
    p.fillStyle = "#6b55b0";
    for (let i = 0; i < 7; i++) { const a = Math.PI + 0.35 + i * 0.4; p.fillRect(32 + Math.cos(a) * 24, 18 + Math.sin(a) * 14, 1, 3); }
    sparkle(p, 6, 8, "#c9a8ff"); sparkle(p, 58, 10, "#f48fb1"); sparkle(p, 56, 36); sparkle(p, 9, 37, "#f48fb1");
  },
  flask(p) {
    p.fillStyle = "#ddd0ff"; p.fillRect(28, 3, 8, 13);
    p.fillStyle = "#b98b62"; p.fillRect(27, 1, 10, 4);
    p.fillStyle = "#ddd0ff"; p.beginPath(); p.arc(32, 27, 14, 0, 7); p.fill();
    p.fillStyle = "#e86aa0"; p.beginPath(); p.arc(32, 27, 12.5, 0.15, Math.PI - 0.15); p.fill();
    p.fillStyle = "#f48fb1"; p.fillRect(20, 28, 24, 2);
    p.fillStyle = "#fff0f6"; p.fillRect(23, 19, 2, 5);
    p.fillStyle = "#ffc9df"; for (const [x, y] of [[29, 33], [35, 31], [33, 36], [38, 11], [25, 9]]) p.fillRect(x, y, 2, 2);
    // little book stack
    p.fillStyle = "#8b7edb"; p.fillRect(4, 36, 16, 4); p.fillStyle = "#5fbf95"; p.fillRect(6, 32, 13, 4);
    sparkle(p, 52, 8, "#f48fb1"); sparkle(p, 10, 14); sparkle(p, 56, 30, "#ffe7b0");
  },
  agents(p) {
    const bot = (x, y, c, eye) => {
      p.fillStyle = "#8b7edb"; p.fillRect(x + 5, y - 4, 1, 4); p.fillStyle = eye; p.fillRect(x + 4, y - 5, 3, 2);
      p.fillStyle = c; p.fillRect(x, y, 11, 9);
      p.fillStyle = "#2a1f56"; p.fillRect(x + 2, y + 2, 7, 4);
      p.fillStyle = eye; p.fillRect(x + 3, y + 3, 1, 2); p.fillRect(x + 7, y + 3, 1, 2);
      p.fillStyle = c; p.fillRect(x + 1, y + 10, 9, 6);
    };
    bot(8, 18, "#b9a3f5", "#7dd3fc"); bot(26, 12, "#f2a2c3", "#a7f3d0"); bot(44, 18, "#ffb4a7", "#ffe7b0");
    p.strokeStyle = "#ddd0ff"; p.lineWidth = 1; p.setLineDash([2, 2]);
    p.beginPath(); p.moveTo(19, 24); p.lineTo(26, 20); p.moveTo(37, 20); p.lineTo(44, 24); p.stroke(); p.setLineDash([]);
    // paper
    p.fillStyle = "#fff0f6"; p.fillRect(25, 34, 14, 9); p.fillStyle = "#b9a3f5"; for (let i = 0; i < 3; i++) p.fillRect(27, 36 + i * 2, 10, 1);
    sparkle(p, 32, 4, "#f48fb1"); sparkle(p, 6, 8); sparkle(p, 58, 8, "#ffe7b0");
  },
  photo(p, R) {
    p.fillStyle = "#fff0f6"; p.fillRect(8, 8, 30, 26);
    const g = p.createLinearGradient(0, 11, 0, 31); g.addColorStop(0, "#6b55b0"); g.addColorStop(1, "#d9789f");
    p.fillStyle = g; p.fillRect(11, 11, 24, 18);
    p.fillStyle = "#ffe7b0"; p.beginPath(); p.arc(28, 16, 2.5, 0, 7); p.fill();
    p.fillStyle = "#4d6644"; p.beginPath(); p.moveTo(11, 29); p.lineTo(19, 19); p.lineTo(26, 29); p.fill();
    p.fillStyle = "#6a8550"; p.beginPath(); p.moveTo(20, 29); p.lineTo(27, 22); p.lineTo(35, 29); p.fill();
    // speech bubble (the caption)
    p.fillStyle = "#b9a3f5"; p.fillRect(36, 20, 24, 14);
    p.beginPath(); p.moveTo(40, 34); p.lineTo(38, 39); p.lineTo(45, 34); p.fill();
    p.fillStyle = "#2a1f56"; p.fillRect(39, 24, 18, 1); p.fillRect(39, 27, 14, 1); p.fillRect(39, 30, 16, 1);
    sparkle(p, 52, 8, "#f48fb1"); sparkle(p, 6, 38); sparkle(p, 58, 40, "#ffe7b0");
    flower(p, 44, 41, 2.5, "pink", R);
  },
  tools(p) {
    // wrench
    p.save(); p.translate(20, 24); p.rotate(-0.7);
    p.fillStyle = "#ddd0ff"; p.fillRect(-2, -2, 22, 5);
    p.beginPath(); p.arc(-4, 0.5, 6, 0, 7); p.fill();
    p.fillStyle = "#221a4a"; p.fillRect(-10, -1, 6, 3);
    p.restore();
    // gear
    p.fillStyle = "#f48fb1";
    for (let i = 0; i < 8; i++) { const a = (i / 8) * Math.PI * 2; p.fillRect(44 + Math.cos(a) * 10 - 2, 22 + Math.sin(a) * 10 - 2, 4, 4); }
    p.beginPath(); p.arc(44, 22, 9, 0, 7); p.fill();
    p.fillStyle = "#221a4a"; p.beginPath(); p.arc(44, 22, 3.5, 0, 7); p.fill();
    // checklist
    p.fillStyle = "#fff0f6"; p.fillRect(24, 30, 14, 12);
    p.fillStyle = "#5fbf95"; p.fillRect(26, 32, 2, 2); p.fillRect(26, 36, 2, 2);
    p.fillStyle = "#b9a3f5"; p.fillRect(30, 32, 6, 1); p.fillRect(30, 36, 6, 1); p.fillRect(30, 40, 4, 1);
    sparkle(p, 8, 8, "#f48fb1"); sparkle(p, 58, 6); sparkle(p, 58, 38, "#ffe7b0");
  },
  mystery(p) {
    const map = ["..#####..", ".##...##.", ".##...##.", "......##.", ".....##..", "....##...", "....##...", ".........", "....##...", "....##..."];
    map.forEach((row, y) => [...row].forEach((ch, x) => { if (ch === "#") { p.fillStyle = "#f48fb1"; p.fillRect(23 + x * 2, 4 + y * 3.4, 2, 3.4); } }));
    sparkle(p, 12, 10, "#ddd0ff"); sparkle(p, 52, 8, "#f48fb1"); sparkle(p, 50, 34); sparkle(p, 14, 32, "#ffe7b0");
  },
};

const cache = {};
export function projectArt(kind) {
  if (cache[kind]) return cache[kind];
  const c = makeCanvas(W, H), p = c.getContext("2d");
  (ART[kind] || ART.mystery)(p, rng(kind.length * 13));
  pixelize(c);
  return (cache[kind] = c.toDataURL());
}
