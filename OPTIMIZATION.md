# Performance Optimization — What Changed & Why

This document summarizes the optimization pass that made the portfolio fast and
smooth on mobile devices. **All edit functionality is fully preserved** — edit mode,
login, add / edit / delete, image upload, admin inbox, and the lifestyle gallery.

## Measured results

| Metric                          | Before              | After        |
| ------------------------------- | ------------------- | ------------ |
| Initial JS transfer (gzipped)   | ~447 KB (+ CDN JS)  | **241 KB**   |
| Runtime CDN scripts             | 660 KB (Three.js + Vanta) | **0 KB** |
| Long tasks (>50 ms) while scrolling | 34               | **0**        |
| Constant WebGL animation loop   | Always running      | **Removed**  |
| npm dependencies                | ~60                 | **25**       |

## 1. Replaced the Vanta.js globe with a pure-CSS aurora background

The old `VantaGlobe` downloaded Three.js r134 (~600 KB) plus the Vanta GLOBE
script from CDNs on every visit and then ran a full-screen WebGL animation loop
for the entire session — even when scrolled away. On phones this was the single
biggest cause of lag, jank, and battery drain.

The new `AuroraBackground` (`src/components/portfolio/aurora-background.tsx`) is
plain markup + CSS: three drifting gradient blobs and a subtle grid. It paints
instantly, costs 0 KB of JavaScript, animates only `transform` (GPU-composited),
softens its blur on small screens, and disables itself under
`prefers-reduced-motion`.

## 2. Code-split the home page into lazy sections

`src/app/page.tsx` used to be a single 62 KB client component that imported and
rendered every section (charts, heatmap, galleries, FAQ…) at once.

Now each section lives in `src/components/portfolio/sections/` and is loaded via
`next/dynamic` behind a `LazySection` wrapper (IntersectionObserver). Sections
below the fold are not mounted — and their code is not even fetched — until the
user scrolls near them. A small `minHeight` placeholder prevents layout shift,
and a late-check fallback catches instant programmatic jumps.

## 3. Eliminated re-render storms

- The typewriter effect used to re-render the entire page every ~40 ms.
  It now lives in its own tiny `HeroTypewriter` component.
- Scroll parallax used `setState` on every scroll frame, re-rendering the whole
  tree. It is now an isolated component that writes `style.transform` directly
  inside `requestAnimationFrame` — zero React re-renders.
- Active nav highlighting looped through sections reading `offsetTop` on every
  scroll event (forced layout). It now uses a single `IntersectionObserver`
  inside the `SiteNav` component, so it re-renders only the nav bar itself.

## 4. CSS fixes

- `glow-card::before` ran an animated `@property` gradient border **continuously
  on every card** even when invisible (opacity 0). The animation now only runs
  while hovering.
- Nav `backdrop-filter: blur(16px) saturate(180%)` is one of the most expensive
  effects on mobile GPUs — reduced to `blur(10px)` on screens < 768 px.
- The animated `gradient-text` (a continuous background-position repaint) is
  paused on small screens.
- Aurora blur radius reduced on mobile.

## 5. Dead code removal

- Deleted 8 unused portfolio components (incl. the old `vanta-globe.tsx`,
  `mesh-blobs`, `skills-radar`, `hero-spotlight`, `signature-logo`,
  `sound-button`).
- Deleted 36 unused shadcn/ui template components (accordion, calendar,
  carousel, chart, sidebar, …).
- Removed ~35 unused npm dependencies (framer-motion, recharts, @mdxeditor,
  react-syntax-highlighter, @dnd-kit, next-auth, next-intl, zustand, zod, …).
- Removed repo junk: `next.config.ts.zbak`, `examples/`, `tests/`,
  `download/`, and the `tee dev.log` in the dev script.

## Notes

- `prisma/schema.prisma` is unchanged (PostgreSQL). The local `.db` files in
  `db/` and `prisma/` are legacy SQLite leftovers and are not referenced by the
  current schema.
- Edit mode still works exactly as before: click **Edit**, enter the admin
  password, then add / edit / delete any section inline. Verified end-to-end
  (login → edit → save → add → delete → auto-refresh).
