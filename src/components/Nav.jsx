import React, { useEffect, useState } from "react";
import PixelIcon from "./PixelIcon.jsx";
import { site } from "../data/content.js";

export const SECTIONS = ["home", "about", "projects", "journey", "lab", "contact"];

export default function Nav() {
  const [active, setActive] = useState("home");
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: "-45% 0px -50% 0px" }
    );
    SECTIONS.forEach((id) => { const el = document.getElementById(id); if (el) io.observe(el); });
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => { io.disconnect(); window.removeEventListener("scroll", onScroll); };
  }, []);

  return (
    <header className={`nav ${scrolled ? "is-scrolled" : ""}`}>
      <div className="nav-inner">
        <a className="logo" href="#home" aria-label={`${site.domain} home`}>
          <PixelIcon name="logo" size={30} />
          <span>{site.domain}</span>
        </a>
        <ul className={`links ${open ? "open" : ""}`} id="nav-links">
          {SECTIONS.map((id) => (
            <li key={id}>
              <a href={`#${id}`} aria-current={active === id ? "page" : undefined} onClick={() => setOpen(false)}>{id}</a>
            </li>
          ))}
        </ul>
        <div className="nav-right">
          <a className="resume" href={site.resumeUrl} target="_blank" rel="noopener">resume <span aria-hidden="true">↗</span></a>
          <button className="menu-btn" aria-label="Open menu" aria-expanded={open} aria-controls="nav-links" onClick={() => setOpen((o) => !o)}>
            <PixelIcon name="menu" size={18} />
          </button>
        </div>
      </div>
    </header>
  );
}
