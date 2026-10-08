import React, { useMemo, useState } from "react";
import ProjectModal from "../components/ProjectModal.jsx";
import useReadme from "../components/useReadme.js";
import PixelScene from "../components/PixelScene.jsx";
import PixelIcon from "../components/PixelIcon.jsx";
import { makeSky } from "../pixel/scenes/sky.js";
import { buildJar, buildFlask } from "../pixel/scenes/lab.js";
import { lab } from "../data/content.js";

const sky = makeSky({ seed: 9, top: "#2a1f56", mid: "#30246a", bottom: "#382b74", corners: false });
const STATUS = {
  progress: { label: "In Progress", cls: "st-progress" },
  done: { label: "Completed", cls: "st-done" },
  upcoming: { label: "Upcoming", cls: "st-upcoming" },
};

export default function Lab() {
  const tabNames = [...Object.keys(lab.tabs), "in progress"];
  const [tab, setTab] = useState(tabNames[0]);
  const all = useMemo(() => Object.values(lab.tabs).flat(), []);
  // Lab items with a slug have their own link too: krrishpana.dev/#rag-experiment
  const { open, openItem, close } = useReadme(all, "lab");
  const items = tab === "in progress"
    ? Object.values(lab.tabs).flat().filter((i) => i.status === "progress")
    : lab.tabs[tab] || [];

  return (
    <section className="lab" id="lab">
      <PixelScene build={sky} />
      <div className="wrap lab-grid">
        <div className="lab-intro">
          <h2 className="eyebrow">the lab <span className="spark">✦</span></h2>
          <p className="body">{lab.intro}</p>
          <div className="flask-box"><PixelScene build={buildFlask} scale={() => 3} /></div>
        </div>
        <div className="lab-panel">
          <div className="tabs" role="tablist" aria-label="Lab categories">
            {tabNames.map((t) => (
              <button key={t} role="tab" id={`tab-${t}`} aria-selected={tab === t} className={tab === t ? "on" : ""} onClick={() => setTab(t)}>{t}</button>
            ))}
          </div>
          <ul className="lab-list" role="tabpanel" aria-labelledby={`tab-${tab}`}>
            {items.map((it) => {
              const row = (
                <>
                  <PixelIcon name="flask" size={22} className="flask-ic" />
                  <div className="lab-item-text">
                    <strong>{it.title}</strong>
                    <span>{it.text}</span>
                    {it.slug && <span className="lab-more">read more <span aria-hidden="true">→</span></span>}
                  </div>
                  <span className={`status ${STATUS[it.status]?.cls || ""}`}>✦ {STATUS[it.status]?.label || it.status}</span>
                </>
              );
              return (
                <li key={it.title}>
                  {it.slug
                    ? <button type="button" className="lab-row is-link" onClick={() => openItem(it)} aria-haspopup="dialog">{row}</button>
                    : <div className="lab-row">{row}</div>}
                </li>
              );
            })}
            {!items.length && <li className="empty">Nothing here yet. Check back soon.</li>}
          </ul>
        </div>
        <div className="jar-box"><PixelScene build={buildJar} scale={() => 3} /></div>
      </div>
      <ProjectModal project={open} onClose={close} badge={open && STATUS[open.status]} />
    </section>
  );
}
