import React, { useState } from "react";
import PixelScene from "../components/PixelScene.jsx";
import PixelIcon from "../components/PixelIcon.jsx";
import buildContact from "../pixel/scenes/contact.js";
import { site, contact, footer } from "../data/content.js";

export default function Contact() {
  const [status, setStatus] = useState({ kind: "idle", msg: "" });
  const [copied, setCopied] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form));
    if (!contact.formEndpoint) {
      setStatus({ kind: "info", msg: `This form isn't connected yet. Please email me at ${site.email}.` });
      return;
    }
    setStatus({ kind: "sending", msg: "Sending…" });
    try {
      const res = await fetch(contact.formEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error();
      form.reset();
      setStatus({ kind: "ok", msg: "Message sent. Thank you! I'll reply soon ♡" });
    } catch {
      setStatus({ kind: "err", msg: `Couldn't send right now. Please email me at ${site.email}.` });
    }
  };

  const copy = async () => {
    try { await navigator.clipboard.writeText(site.email); setCopied(true); setTimeout(() => setCopied(false), 1600); }
    catch { const r = document.createRange(); r.selectNodeContents(document.getElementById("email-text")); const s = getSelection(); s.removeAllRanges(); s.addRange(r); }
  };

  return (
    <section className="contact" id="contact">
      <PixelScene build={buildContact} />
      <div className="wrap contact-grid">
        <div className="contact-intro">
          <h2 className="eyebrow">{contact.heading} <span className="spark">✦</span></h2>
          <p className="body">{contact.text}</p>
        </div>
        <form className="contact-form" onSubmit={onSubmit}>
          <div className="row2">
            <label>your name<input id="c-name" name="name" required placeholder="eg. Alex" autoComplete="name" /></label>
            <label>your email<input id="c-email" name="email" type="email" required placeholder="eg. alex@email.com" autoComplete="email" /></label>
          </div>
          <label>your message<textarea id="c-message" name="message" rows="5" required placeholder="let's build something amazing together…" /></label>
          <button className="btn btn-send" type="submit" disabled={status.kind === "sending"}>send message <PixelIcon name="mailsm" size={14} /></button>
          {status.msg && <p className={`form-status fs-${status.kind}`} role="status">{status.msg}</p>}
        </form>
        <div className="contact-links">
          <h3 className="mini-label">find me here</h3>
          <ul>
            <li><PixelIcon name="github" size={18} /><a href={site.socials.github} target="_blank" rel="noopener">{site.socials.github.replace(/^https?:\/\//, "")}</a></li>
            <li><PixelIcon name="linkedin" size={18} /><a href={site.socials.linkedin} target="_blank" rel="noopener">{site.socials.linkedin.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "")}</a></li>
            <li><PixelIcon name="mail" size={18} /><span id="email-text" className="email-text">{site.email}</span>
              <button className="copy" type="button" onClick={copy}>{copied ? "copied ✓" : "copy"}</button></li>
          </ul>
          <a className="btn btn-ghost dl" href={site.resumeUrl} download="Krrishpana_Karmacharya_CV.pdf">download resume <PixelIcon name="download" size={13} /></a>
        </div>
      </div>
      <footer className="foot">{footer} <PixelIcon name="heartPink" size={12} /> <span className="yr">© {new Date().getFullYear()} {site.domain}</span></footer>
    </section>
  );
}
