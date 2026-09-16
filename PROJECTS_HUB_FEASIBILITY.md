# Projects Hub — Feasibility Report

## 1. Routing

React Router v7 (`react-router-dom`), client-side, defined declaratively in `src/App.tsx`:

```tsx
<BrowserRouter>
  <Routes>
    <Route element={<Layout />}>
      <Route path="/" element={<Home />} />
      <Route path="/resume" element={<Resume />} />
      <Route path="/skills" element={<Skills />} />
      <Route path="/projects" element={<Projects />} />
      <Route path="/stycobot" element={<StycoBot />} />
      <Route path="/contact" element={<Contact />} />
    </Route>
  </Routes>
</BrowserRouter>
```

All routes share one `<Layout>` (renders `<Outlet/>` + `<Footer/>`). `vercel.json` already rewrites everything to `/index.html` so client-side routes resolve correctly on Vercel.

**Adding a new route is trivial**: one new `<Route path="..." element={<...}/>` line plus a new page component. No file-based routing, no route config generation — pure manual `Routes`/`Route` list.

**⚠️ Naming collision**: `/projects` is already taken by the existing `Projects` page (`src/pages/Projects.tsx`), which renders a legacy-HTML list of GitHub-repo cards (StycoBot, portfolio site, Rails app) via `projects-main.html`. The new "hub" of games/side-projects described in your requirements is conceptually different from this. You'll need to decide: rename/repurpose the existing `/projects` page, pick a different path for the new hub (e.g. `/games`, `/projects-hub`, `/lab`), or merge the two concepts. **Flagging this now since it affects routing, the Navbar, and the Footer sitemap.**

**Effort: Trivial** (~15 min) once the path question above is resolved.

---

## 2. Header/Footer implementation

Good news — **already fully decoupled from the legacy pattern**, no entanglement to unwind:

- `Navbar` (`src/components/Navbar.tsx`) and `Footer` (`src/components/Footer.tsx`) are plain, self-contained React components using `react-router-dom`'s `<Link>`. They don't touch `dangerouslySetInnerHTML` and don't depend on any per-page raw HTML.
- The legacy `public/js/navbar.js` / `public/js/footer.js` scripts (which the original static site used to inject the nav/footer via runtime DOM injection) are **dead code** — not loaded by `index.html` or imported anywhere; they only exist as historical reference (cited in code comments as "mirrors js/navbar.js exactly").
- `Footer` is rendered once, in `Layout.tsx`, outside `<Outlet/>` — so every routed page automatically gets it for free.
- `Navbar`, however, is **not** in `Layout` — it's rendered *inside* each page's `<main>`, by each page itself (via `RawMain`, or manually in `StycoBot.tsx`). This mirrors the original site's behavior (`navbar.js` injected the nav as the first child inside `<main>`), preserved intentionally per the code comments in `Layout.tsx`.

**What this means for the new hub page**: You can freely import `Navbar` and `Footer` into a brand-new native-React page component. `Footer` needs no action (it's already global via `Layout`). `Navbar` just needs to be rendered explicitly at the top of the new page's JSX — same as every other page does, just without going through `RawMain`.

**Effort: Trivial** (~10 min) — reuse as-is by import.

---

## 3. Legacy raw-HTML loading pattern

Documented mechanism, so the new page can deliberately avoid it:

1. Original static site's page bodies were saved as `.html` fragments in `src/partials/*.html` (e.g. `projects-main.html`, `index-main.html`).
2. Vite's `?raw` import suffix pulls that HTML in as a plain string at build time: `import html from "../partials/projects-main.html?raw"`.
3. A shared `RawMain` component (`src/components/RawMain.tsx`) wraps it: `<main><Navbar/><div dangerouslySetInnerHTML={{ __html: html }} /></main>`.
4. Each page component (`Home.tsx`, `Resume.tsx`, `Skills.tsx`, `Projects.tsx`, `Contact.tsx`) is a ~5-line wrapper that just imports its partial and renders `<RawMain>`.
5. `StycoBot.tsx` is a partial exception — it does the same thing but with two HTML fragments and without going through `RawMain`, plus it references (not-yet-wired-up) legacy JS files and an `<iframe>` for embedded content.
6. Static assets used inside the raw HTML (`public/assets/*`, `public/css/styles.css`) are served as-is from `/public` — no bundling/hashing.

No iframes are used for the routed pages themselves; the one iframe in the codebase (`stycobot-premain.html`'s `#react-iframe`) is a metrics-panel modal specific to StycoBot, unrelated to page routing.

**For the hub page**: simply don't use `RawMain`, `?raw` imports, or `dangerouslySetInnerHTML`. Write JSX/TSX directly, same as you'd do in any modern React app. Nothing here blocks that — it's an additive pattern, not a structural constraint the rest of the app forces on you.

---

## 4. Styling/theming system

- **No CSS Modules, Tailwind, styled-components, or CSS-in-JS.** Styling is one large global stylesheet: `public/css/styles.css` (13,745 lines — Bootstrap 5 compiled output plus site-specific overrides), linked in `index.html` via a plain `<link>`. Bootstrap's JS bundle is also loaded globally from a CDN `<script>` tag (for navbar-toggler collapse behavior).
- Class names throughout the React components are Bootstrap utility classes (`d-flex`, `container`, `card`, `shadow`, `rounded-4`, etc.) plus a couple of site-specific classes (`text-gradient`).
- **CSS custom properties exist but only as Bootstrap's own design-token variables** (`--bs-primary`, `--bs-gray-500`, `--bs-body-bg`, etc. — all in `:root`, single static values). There is **no** light/dark variable set, no `prefers-color-scheme` media query, no `data-theme` attribute, and no React Context for theming anywhere in the codebase. `Layout.tsx` does set `document.body.className` per-route, but purely to replicate the original static site's per-page Bootstrap layout classes (`bg-light`, `h-100`, etc.) — not a theming mechanism.

**Conclusion: day/night theming needs to be built from scratch.** This isn't a blocker, just net-new work — nothing existing conflicts with it, since global Bootstrap classes and a new scoped theme system (CSS variables + a `data-theme` attribute or React Context, scoped to the hub page's own root element) can coexist without touching the legacy stylesheet.

---

## 5. Build & deploy config

- **Build tool**: Vite 8 (`vite.config.ts` is minimal — just `@vitejs/plugin-react`). Build script: `tsc -b && vite build`. Standard SPA output (`dist/`), no SSR/SSG.
- **`vercel.json`** exists today with exactly one rule:
  ```json
  { "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }] }
  ```
  This is the standard SPA-fallback rewrite so React Router can handle client-side paths. **It's a catch-all** — any new rewrite rules you add for `/projects/<slug>` → external deployment URLs must be ordered *before* this catch-all (Vercel evaluates rewrites in array order, first match wins), otherwise the SPA fallback will swallow the request first.
- No existing build-time codegen step, no `scripts/` directory, no manifest file of any kind yet. Adding a "manifest → generates rewrite entries" step is net-new tooling (e.g. a small Node script run before `vercel.json` is written, or a `vercel-build`-time step) — not fighting any existing convention, just nothing to reuse.
- No monorepo tooling detected (no workspaces, no Turborepo/Nx) — each game's "independent Vercel deployment" is presumably a fully separate project/repo, which is consistent with what's here.

---

## Summary table

| Piece | Current state | Blocker? | Est. effort |
|---|---|---|---|
| Routing | React Router, manual `<Route>` list, trivial to extend | Path-naming collision with existing `/projects` (needs a decision) | Trivial |
| Header/Footer reuse | Already plain React components, decoupled from legacy pattern | None | Trivial |
| Avoiding legacy raw-HTML pattern | Legacy pattern is opt-in per page, not structurally forced | None | N/A (just don't use `RawMain`) |
| Theming (day/night, extensible) | No theming system exists; global Bootstrap CSS only | None, but 100% net-new | Small–Medium |
| Card grid + hover-video | No existing card/grid component to reuse (only static Bootstrap `.card` markup in legacy HTML) | None | Medium |
| Rewrite/manifest config | `vercel.json` has only the SPA catch-all; no manifest tooling exists | Must order new rewrites before the catch-all; manifest→rewrite generation is net-new build tooling | Small–Medium |

---

## Implementation options

### A. Header/Footer reuse
Only one reasonable approach given current state — no real trade-off here:
- **Import `Navbar` + `Footer` directly into the new page component**, same as every existing page does. `Footer` is already automatic via `Layout`. This is basically forced by (and consistent with) the existing architecture — recommended.

*(Alternative considered and rejected: wrapping the hub page in its own mini-layout — unnecessary since `Layout` already provides Footer for free and Navbar is a one-line import.)*

### B. Theming (day/night, extensible to more themes)
1. **CSS custom properties + `data-theme` attribute on a scoped root element**, toggled via a small React `useState`/`localStorage`-backed hook. Theme values (background gradient/image, text color, card surface color, etc.) defined as CSS variables per `[data-theme="day"]` / `[data-theme="night"]` selector, scoped under the hub page's own wrapper div so it doesn't leak into or get affected by the global Bootstrap stylesheet.
   - *Trade-off*: simplest, no new dependency, easy to extend with more `data-theme` values later. Slightly more manual than a full theming library.
2. **React Context provider (`ThemeProvider`) wrapping the hub page**, exposing `theme`/`setTheme`, backed by the same CSS-variable mechanism as (1) but with the state lifted so multiple components (background, cards, toggle button) can consume it without prop drilling.
   - *Trade-off*: more idiomatic if you expect the hub page to grow (more toggle-consuming components), marginally more boilerplate up front. **Recommended** if the hub page will have more than a couple of theme-aware pieces (background + toggle + cards all count).
3. **A CSS-in-JS or Tailwind-based theming utility** — would require adding a new dependency/build step not used anywhere else in the app.
   - *Trade-off*: more powerful theming DX, but inconsistent with the rest of the codebase's plain-CSS/Bootstrap approach, and adds tooling surface for a single page. Not recommended unless you want to migrate styling more broadly.

**Recommendation: Option 2** (Context + CSS variables), scoped to the hub page, no new dependencies.

### C. Card component (thumbnail, hover video, link-out)
1. **Single `ProjectCard` component**, static thumbnail `<img>` shown by default, `<video>` element mounted conditionally (only added to the DOM on `onMouseEnter`, unmounted on `onMouseLeave`) so the browser never fetches the video until hover — satisfies "not preloaded." CSS `transform: scale(...)` transition on hover for the scale effect.
   - *Trade-off*: simplest, matches the "video only loads on hover" requirement exactly since nothing is in the DOM to preload. Slight flash/delay on first hover while the video buffers — acceptable for a demo-clip use case.
2. **`<video preload="none">` always in the DOM**, play/pause triggered on hover instead of mount/unmount.
   - *Trade-off*: avoids any mount delay on second+ hovers (browser may cache), but `preload="none"` isn't reliably honored by all browsers before Play is called, and having every video element on the page in the DOM upfront works against "video only loads on hover" if a browser prefetches metadata anyway. Riskier for meeting the literal requirement.
3. **IntersectionObserver-based lazy thumbnail + hover video**, only relevant if you also want to defer offscreen thumbnails for a large project count.
   - *Trade-off*: overkill unless the hub will list many (10+) projects; adds complexity not required by the current spec.

**Recommendation: Option 1** (mount/unmount `<video>` on hover) — simplest and most literally satisfies the "not preloaded" requirement.

### D. Slug → deployment-URL manifest / rewrite generation
1. **A simple JSON or TS manifest file** (e.g. `projects.manifest.json`: `[{ slug, name, description, thumbnail, videoUrl, deployUrl }]`) used two ways: (a) imported directly by the React card grid for render data, (b) read by a small Node script at build time that emits the corresponding `rewrites` entries and merges them into `vercel.json` (or a generated `vercel.json`, since Vercel just needs the final file present at deploy time).
   - *Trade-off*: single source of truth for both the UI and the rewrite config — recommended, matches your stated requirement directly.
2. **Manifest drives rewrites via a `vercel.json`-adjacent config file Vercel itself can read** — not supported natively; Vercel doesn't template `vercel.json`, so this still requires a generation step (same as option 1, just framed differently). Not actually a distinct option — noting only because it's a common misconception worth flagging.
3. **Keep project metadata (name/description/thumbnail) in the manifest, but hand-maintain `vercel.json` rewrites separately.**
   - *Trade-off*: explicitly against your stated requirement ("rather than being hand-maintained inside vercel.json directly") — not recommended, listed only for completeness.

**Recommendation: Option 1.** Needs a small `scripts/generate-vercel-rewrites.(ts|mjs)` invoked before build/deploy (e.g. via `"prebuild"` npm script or a Vercel "Ignored Build Step"/build command chain), writing/merging into `vercel.json`, with the manifest-derived rewrites placed **before** the existing SPA catch-all rule.

---

## Decisions (finalized, no longer open)
1. **Route path**: New hub takes over `/projects`. The existing legacy GitHub-repo list (StycoBot, portfolio, Rails app) moves to `/repos`. `Navbar`/`Footer` links and sitemap references need updating accordingly.
2. **Theme toggle**: Manual switch, defaulting to `prefers-color-scheme` on first load, persisted via `localStorage` thereafter.
3. **Initial project count**: Assumed small (<10). Plain CSS grid, no virtualization/lazy-loading of the grid itself (hover-video lazy-load still applies per-card as designed above). Revisit if the list grows significantly.

---

## Note on repo sync status
Before this doc was written, a `git fetch origin` was attempted to confirm local `main` was in sync with `origin/main`, but it failed with an SSL error on this machine (not a repo issue). `git status` reports the working tree clean and local `main` "up to date with origin/main" — but that's from the last cached fetch, not a fresh check. Worth re-verifying (`git fetch origin` / `git status`) once you're back at a terminal.

No code was written or modified during this investigation.
