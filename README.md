# krrishpana.dev ✿

My pixel-art portfolio, built with React + Vite.
All the pixel art is drawn with code, so there are no image files to manage.

## Run it on your computer

You need [Node.js](https://nodejs.org) (version 18 or newer).

```bash
npm install      # first time only
npm run dev      # opens the site at http://localhost:5173
```

Save any file and the browser updates by itself.

## Change your text, projects and links

**Almost everything lives in one file: `src/data/content.js`.**

| What you want to change | Where in `content.js` |
| --- | --- |
| Name, role, intro, email, GitHub, LinkedIn | `site` |
| Resume | Replace `public/resume.pdf` with your new CV (keep the same name) |
| About text and "things I love" | `about` |
| Project cards | `projects` (add or remove objects) |
| Journey islands | `journey` (one island per item, up to 6 look best) |
| Lab tabs and items | `lab.tabs` |
| Contact form | `contact.formEndpoint` (see below) |

## Project pop-ups (README pages)

Clicking a project card opens a pop-up with that project's README.

- Each project in `content.js` has a `slug`, a `github` link and an optional `demo` link.
- Its README is the file `src/data/readmes/<slug>.md`. Write it in normal Markdown, like on GitHub
  (headings, lists, tables, code blocks and images all work).
- Lines like `<!-- ✏️ ... -->` are notes for you. Visitors can't see them.
- To add a new project: add it to `projects` in `content.js`, then create `src/data/readmes/<your-slug>.md`.
- Every project has its own link, for example `krrishpana.dev/#mlops-pipeline`.
- **Lab items work the same way.** Give a lab item a `slug` (plus `github`, `tags`, `art`) and add
  `src/data/readmes/<slug>.md`. Items without a `slug` stay as plain rows.
  Lab pictures: `flask`, `agents`, `photo`, `tools`.

Project pictures: set `art` to one of `chart`, `bowl`, `robot`, `server`, `eye`, `mystery`.
Lab status: `progress`, `done` or `upcoming`.
"Things I love" icons: `heart`, `spark`, `rocket`, `coffee`, `book`, `music`, `chess`, `swim`, `compass`.

## Make the contact form send emails

1. Make a free form at [formspree.io](https://formspree.io).
2. Copy its URL (like `https://formspree.io/f/abcdwxyz`).
3. Paste it into `contact.formEndpoint` in `content.js`.

Until then, the form tells visitors to email you directly.

## Project structure

```
src/
  data/content.js        ← your text (edit this)
  App.jsx                ← order of the sections
  styles.css             ← colours, fonts, layout
  sections/              ← one file per section (Hero, About, Projects…)
  components/            ← Nav, PixelIcon, PixelScene (the animated canvas)
  pixel/engine.js        ← shared pixel-art helpers and the colour palette
  pixel/art.js           ← project card pictures
  pixel/scenes/          ← the animated backgrounds (hero, room, journey…)
```

Colours are at the top of `styles.css` (`--pink`, `--lavender`, …).

## Put it online

```bash
npm run build    # makes the finished site in /dist
```

Upload the `dist` folder to any static host. Easy free options:
**Vercel** or **Netlify** (connect your GitHub repo, they run the build for you),
or **GitHub Pages**.

Want one single HTML file instead? Run `SINGLE=1 npm run build`.
