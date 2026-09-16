# Task: Analyze codebase feasibility for a new "Projects Hub" page

## Do not write or modify any code in this pass.
Your job is to investigate the current codebase and produce a report. Stop after the report and wait for explicit approval before implementing anything.

## Context
This is a React app, migrated from a previously static HTML/CSS/JS site. Currently, most/all pages load raw legacy HTML/CSS/JS rather than being built as native React components. The app is deployed entirely on Vercel.

I want to add a new page (a "hub" listing my side projects/games as cards) to this same app. This new page should NOT follow the legacy raw-HTML pattern for its body content — it needs to be a proper React-driven page. However, the header and footer should still be the site's existing header/footer, for visual consistency with the rest of the site.

## What to investigate and report on

1. **Routing** — How are pages/routes currently defined in this app (React Router, file-based routing, manual conditionals, something else)? How would a new route (e.g. `/projects`) be added?

2. **Header/Footer implementation** — Are the header and footer implemented as reusable React components, or are they part of the raw HTML/JS being loaded per-page? Can they be reused on a new page independently of the legacy pattern, or are they entangled with it? Be specific about what would need to change, if anything.

3. **The legacy raw HTML/CSS/JS loading pattern** — Document exactly how this works today (e.g. `dangerouslySetInnerHTML`, iframes, static files served from `/public`, runtime script injection, etc.). This matters because the new hub page's body must NOT use this pattern — it should be built as native React component(s).

4. **Styling/theming system** — What's the current CSS approach (plain CSS, CSS Modules, Tailwind, styled-components, inline styles, etc.)? Is there any existing theming mechanism (CSS variables, React Context, etc.), or would a day/night theme toggle need to be introduced from scratch?

5. **Build & deploy config** — What's the build tool (Vite, Create React App, Next.js, custom, etc.)? Is there an existing `vercel.json`? Note anything relevant to eventually adding Vercel rewrite rules (this doesn't need to be implemented now — just flag what exists).

## Requirements for the new hub page (for context — do not implement yet)

- New route, e.g. `/projects`.
- **Header and footer**: reused from the existing site for consistency.
- **Body**: entirely new, native React design — not using the legacy raw-HTML pattern. Should include:
  - A theme-aware background supporting at least "day" and "night" themes (should be extensible to more themes later).
  - A grid of cards, one per game/project. Each card shows: a static thumbnail, the project name in bold, and a truncated description (2-line clamp).
  - On hover, a card scales up slightly and plays a looping demo video (video only loads on hover, not preloaded).
  - Each card links out (opens in a new tab) to the corresponding game. The visible/indexed URL should be a clean path like `yoursite.com/projects/<slug>`, while the actual content is served from that game's independent Vercel deployment via a Vercel rewrite. The slug → deployment-URL mapping should live in a simple manifest file that generates the rewrite config, rather than being hand-maintained inside `vercel.json` directly.

## Deliverable

Produce a report with:
- A summary of the current architecture as it relates to the points above.
- Specific blockers or friction points for each requirement above.
- 2–3 implementation options (with trade-offs) for the pieces that have more than one reasonable approach — particularly header/footer reuse, theming, and the card component.
- A rough effort/complexity estimate per piece (routing, header/footer reuse, theming system, card grid + hover video, rewrite/manifest config).

Do not proceed to implementation. Wait for my review and go-ahead on the proposed approach.
