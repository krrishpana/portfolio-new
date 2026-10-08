import React from "react";
import PixelScene from "../components/PixelScene.jsx";
import PixelIcon from "../components/PixelIcon.jsx";
import buildHero from "../pixel/scenes/hero.js";
import { site } from "../data/content.js";

export default function Hero() {
  return (
    <section className="hero" id="home">
      <PixelScene build={buildHero} />
      <div className="hero-intro">
        <p className="hi"><PixelIcon name="clover" size={20} />hi, i’m<PixelIcon name="clover" size={20} className="spin" /></p>
        <h1 className="name" aria-label={site.name}>
          <span className="letters" aria-hidden="true">
            {site.name.split("").map((ch, i) => <span className="l" key={i}>{ch}</span>)}
          </span>
          <PixelIcon name="heartPink" className="heart" size={28} />
        </h1>
        <p className="role">{site.role}<span className="cursor" aria-hidden="true" /></p>
        <p className="lede">{site.intro}</p>
        <div className="ctas">
          <a className="btn btn-primary" href="#projects">explore my world <span aria-hidden="true">↗</span></a>
          <a className="btn btn-ghost" href="#contact">say hello <PixelIcon name="mailsm" size={14} /></a>
        </div>
        <div>
          <p className="find">find me around the internet</p>
          <div className="social">
            <a href={site.socials.github} target="_blank" rel="noopener" aria-label="GitHub"><PixelIcon name="github" size={24} /></a>
            <a href={site.socials.linkedin} target="_blank" rel="noopener" aria-label="LinkedIn"><PixelIcon name="linkedin" size={24} /></a>
            <a href="#contact" aria-label="Email"><PixelIcon name="mail" size={24} /></a>
          </div>
        </div>
      </div>
      <div className="hint">click the garden ✦</div>
    </section>
  );
}
