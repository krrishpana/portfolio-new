import React, { useMemo } from "react";
import useReadme from "../components/useReadme.js";
import PixelScene from "../components/PixelScene.jsx";
import ProjectModal from "../components/ProjectModal.jsx";
import { makeSky } from "../pixel/scenes/sky.js";
import { projectArt } from "../pixel/art.js";
import { projects, comingSoon } from "../data/content.js";

const sky = makeSky({ seed: 5, top: "#2a1f56", mid: "#33276e", bottom: "#3a2d78", corners: "right", butterfly: { x: 0.9, y: 0.12, pink: true } });

function Card({ p, onOpen }) {
  const src = useMemo(() => projectArt(p.art), [p.art]);
  return (
    <button type="button" className="card" onClick={() => onOpen(p)} aria-haspopup="dialog">
      <div className="card-art"><img src={src} alt="" /></div>
      <h3>{p.title}</h3>
      <p>{p.description}</p>
      <ul className="tags">{p.tags.map((t) => <li key={t}>{t}</li>)}</ul>
      <span className="card-more">read more <span aria-hidden="true">→</span></span>
    </button>
  );
}

export default function Projects() {
  const mystery = useMemo(() => projectArt("mystery"), []);
  // Each project has its own link: krrishpana.dev/#credit-risk-prediction
  const { open, openItem: openProject, close } = useReadme(projects, "projects");

  return (
    <section className="projects" id="projects">
      <PixelScene build={sky} />
      <div className="wrap">
        <h2 className="eyebrow">my projects <span className="spark">✦</span></h2>
        <p className="sub">things i’ve built with curiosity and lots of coffee.</p>
        <div className="cards">
          {projects.map((p) => <Card key={p.slug || p.title} p={p} onOpen={openProject} />)}
          <article className="card card-soon">
            <div className="card-art"><img src={mystery} alt="" /></div>
            <h3>{comingSoon.title}</h3>
            <p>{comingSoon.description}</p>
          </article>
        </div>
      </div>
      <ProjectModal project={open} onClose={close} />
    </section>
  );
}
