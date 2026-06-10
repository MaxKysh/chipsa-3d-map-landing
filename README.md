# Chipsa — 3D Map Landing

Landing page for Chipsa's interactive 3D hall map for conferences. Built with
Vite + React from the Claude Design handoff, using the Chipsa Lander design
system (dark base, teal accent, full-bleed media, scroll reveals). Bilingual
RU / EN with a persisted language toggle.

## Run locally

```bash
npm install
npm run dev      # dev server at http://localhost:5173
npm run build    # production build to dist/
npm run preview  # preview the production build
```

## Structure

```
index.html              # Vite entry
src/
  main.jsx              # React root + global CSS
  App.jsx               # page composition + language state
  components/           # Hero/Nav, Demo, Sections, primitives, DS components
  data/
    copy.js             # bilingual RU/EN copy
    assets.js           # public asset path map
  styles/
    design-system.css   # tokens (color/type/spacing) + base layer + button
    landing.css         # page-specific layout
public/
  videos/               # .mp4 (kebab-case)
  images/               # .jpg + brand logos (kebab-case)
```

## Assets

Raw source files were reorganized into `public/videos` and `public/images` with
kebab-case names. The hero / tour / route / mobile clips and all section
imagery map through `src/data/assets.js`.
