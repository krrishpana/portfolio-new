import React, { useEffect, useRef } from "react";

const defaultScale = (W) => (W < 560 ? 2 : W < 1150 ? 3 : 4);

/**
 * Fills its parent element with an animated pixel-art canvas.
 *
 * `build({ w, h, S, land, reduce })` draws the static layers for a canvas of
 * w×h low-res pixels and returns `{ draw(timeMs, ctx), click?(x, y) }`.
 * Clicks on the parent (but not on links/buttons/inputs) are passed to click().
 */
export default function PixelScene({ build, scale = defaultScale, className = "", deps = [] }) {
  const ref = useRef(null);

  useEffect(() => {
    const cv = ref.current;
    const host = cv.parentElement;
    const ctx = cv.getContext("2d");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let scene = null, S = 3, raf = 0, last = 0, visible = true, timer;

    const setup = () => {
      const W = host.clientWidth, H = host.clientHeight;
      if (!W || !H) return;
      S = scale(W);
      const w = Math.ceil(W / S), h = Math.ceil(H / S);
      cv.width = w; cv.height = h;
      cv.style.width = w * S + "px"; cv.style.height = h * S + "px";
      ctx.imageSmoothingEnabled = false;
      scene = build({ w, h, S, land: W / H > 1.05, wide: W >= 900, reduce });
      scene.draw(performance.now(), ctx);
    };

    const loop = (t) => {
      raf = requestAnimationFrame(loop);
      if (!visible || !scene || t - last < 33) return;
      last = t;
      scene.draw(t, ctx);
    };

    const ro = new ResizeObserver(() => { clearTimeout(timer); timer = setTimeout(setup, 80); });
    ro.observe(host);
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; }, { rootMargin: "100px" });
    io.observe(host);

    const onClick = (e) => {
      if (!scene?.click || e.target.closest("a,button,input,textarea,label,[data-noburst]")) return;
      const r = cv.getBoundingClientRect();
      scene.click((e.clientX - r.left) / S, (e.clientY - r.top) / S);
      if (reduce) scene.draw(performance.now(), ctx);
    };
    host.addEventListener("click", onClick);

    setup();
    if (!reduce) raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf); clearTimeout(timer);
      ro.disconnect(); io.disconnect();
      host.removeEventListener("click", onClick);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return <canvas ref={ref} className={`pixel-scene ${className}`} aria-hidden="true" />;
}
