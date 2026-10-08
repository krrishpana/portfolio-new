import React, { useEffect, useMemo, useRef, useState } from "react";
import PixelScene from "../components/PixelScene.jsx";
import { makeJourney, journeyLayout } from "../pixel/scenes/journey.js";
import { journey } from "../data/content.js";

export default function Journey() {
  const ref = useRef(null);
  const [box, setBox] = useState({ W: 1200, H: 700 });
  const build = useMemo(() => makeJourney(journey), []);

  useEffect(() => {
    const el = ref.current;
    const ro = new ResizeObserver(() => setBox({ W: el.clientWidth, H: el.clientHeight }));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const land = box.W / box.H > 1.05;
  const pos = journeyLayout(journey.length, land);
  const ir = Math.max(24, Math.min(box.W, box.H) * (land ? 0.085 : 0.07));

  return (
    <section className={`journey ${land ? "is-land" : "is-tall"}`} id="journey" ref={ref} style={{ "--n": journey.length }}>
      <PixelScene build={build} />
      <h2 className="eyebrow journey-title">my journey so far <span className="spark">✦</span></h2>
      <ol className="milestones">
        {journey.map((m, i) => {
          const p = pos[i];
          const style = land
            ? { left: `${p.x * 100}%`, top: `${p.y * 100}%`, transform: `translate(-50%, calc(-100% - ${ir * (m.future ? 2.3 : 0.75)}px))` }
            : p.x < 0.5
              ? { left: `calc(${p.x * 100}% + ${ir * 1.6}px)`, top: `${p.y * 100}%`, transform: "translateY(-55%)" }
              : { right: `calc(${(1 - p.x) * 100}% + ${ir * 1.6}px)`, top: `${p.y * 100}%`, transform: "translateY(-55%)" };
          return (
            <li key={i} className={`milestone ${m.future ? "is-future" : ""}`} style={style}>
              <span className="year">{m.year}</span>
              <strong>{m.title}</strong>
              <span className="mtext">{m.text}</span>
            </li>
          );
        })}
      </ol>
      <p className="continues">the journey continues… <span aria-hidden="true">↓</span></p>
    </section>
  );
}
