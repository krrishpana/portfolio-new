import React from "react";
import PixelScene from "../components/PixelScene.jsx";
import PixelIcon from "../components/PixelIcon.jsx";
import buildRoom from "../pixel/scenes/room.js";
import { about } from "../data/content.js";

export default function About() {
  return (
    <section className="about" id="about">
      <div className="wrap about-grid">
        <div className="about-text">
          <h2 className="eyebrow">about me <span className="spark">✦</span></h2>
          <p className="big-lines">
            {about.heading.map(([pink, rest], i) => (
              <span key={i}><em>{pink}</em> {rest}{i === about.heading.length - 1 && <PixelIcon name="heartPink" size={16} className="inline-heart" />}</span>
            ))}
          </p>
          {about.text.map((t, i) => <p className="body" key={i}>{t}</p>)}
        </div>
        <div className="room-box">
          <PixelScene build={buildRoom} />
        </div>
      </div>
      <div className="wrap loves">
        <h3 className="mini-label">things i love</h3>
        <ul className="loves-grid">
          {about.loves.map((l) => (
            <li key={l.label}><PixelIcon name={l.icon} size={18} /><span>{l.label}</span></li>
          ))}
        </ul>
      </div>
    </section>
  );
}
