import React, { useEffect, useId, useMemo, useRef } from "react";
import { marked } from "marked";
import PixelIcon from "./PixelIcon.jsx";
import { projectArt } from "../pixel/art.js";

// Loads every README in src/data/readmes/ as text: { "credit-risk-prediction": "# Credit…" }
const files = import.meta.glob("../data/readmes/*.md", { query: "?raw", import: "default", eager: true });
const READMES = Object.fromEntries(
  Object.entries(files).map(([path, text]) => [path.split("/").pop().replace(/\.md$/, ""), text])
);

marked.setOptions({ gfm: true, breaks: false });

// `project` can be a project card or a lab item. Fields used:
// title, description (or text), tags, art, slug, github, demo, and an optional `badge` {label, cls}.
export default function ProjectModal({ project, onClose, badge }) {
  const ref = useRef(null);
  const titleId = useId();
  const html = useMemo(() => {
    if (!project) return "";
    const md = READMES[project.slug];
    return md
      ? marked.parse(md.replace(/^# .*\n+/, "")) // the title is already in the header
      : `<p><em>No README yet. Add one at <code>src/data/readmes/${project.slug}.md</code>.</em></p>`;
  }, [project]);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (project && !d.open) {
      d.showModal();
      d.querySelector(".readme-body")?.scrollTo(0, 0);
      document.documentElement.classList.add("modal-open");
    }
    if (!project && d.open) d.close();
  }, [project]);

  useEffect(() => {
    const d = ref.current;
    const onCloseEvt = () => { document.documentElement.classList.remove("modal-open"); onClose(); };
    d.addEventListener("close", onCloseEvt);
    return () => d.removeEventListener("close", onCloseEvt);
  }, [onClose]);

  // Click on the dark backdrop closes it.
  const onClick = (e) => { if (e.target === ref.current) ref.current.close(); };

  // Make README links open in a new tab.
  const onBodyClick = (e) => {
    const a = e.target.closest("a[href^='http']");
    if (a) { a.target = "_blank"; a.rel = "noopener"; }
  };

  const repoName = project?.github ? project.github.replace(/^https?:\/\/(www\.)?github\.com\//, "") : "";

  return (
    <dialog ref={ref} className="project-modal" onClick={onClick} aria-labelledby={titleId} data-noburst>
      {project && (
        <div className="pm-window">
          <div className="pm-bar">
            <span className="pm-dots" aria-hidden="true"><i /><i /><i /></span>
            <span className="pm-file">README.md{repoName && <span className="pm-repo"> — {repoName}</span>}</span>
            <button className="pm-close" onClick={() => ref.current.close()} aria-label="Close">✕</button>
          </div>

          <div className="pm-scroll readme-body" onClick={onBodyClick}>
            <header className="pm-head">
              <div className="pm-art"><img src={projectArt(project.art || "flask")} alt="" /></div>
              <div className="pm-meta">
                {badge && <span className={`status ${badge.cls}`}>✦ {badge.label}</span>}
                <h2 id={titleId}>{project.title}</h2>
                <p>{project.description || project.text}</p>
                {project.tags?.length > 0 && <ul className="tags">{project.tags.map((t) => <li key={t}>{t}</li>)}</ul>}
                <div className="pm-actions">
                  {project.github && (
                    <a className="btn btn-primary" href={project.github} target="_blank" rel="noopener">
                      <PixelIcon name="github" size={16} /> view on github <span aria-hidden="true">↗</span>
                    </a>
                  )}
                  {project.demo && (
                    <a className="btn btn-ghost" href={project.demo} target="_blank" rel="noopener">live demo <span aria-hidden="true">↗</span></a>
                  )}
                </div>
              </div>
            </header>
            <article className="markdown" dangerouslySetInnerHTML={{ __html: html }} />
          </div>
        </div>
      )}
    </dialog>
  );
}
