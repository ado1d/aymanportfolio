# Performance Optimization — What Changed & Why

This document summarizes the optimization pass that made the portfolio fast and
smooth on mobile devices. **All edit functionality is fully preserved** — edit mode,
login, add / edit / delete, image upload, admin inbox, and the lifestyle gallery.

## Measured results

| Metric                          | Before              | After        |
| ------------------------------- | ------------------- | ------------ |
| Initial JS transfer (gzipped)   | ~447 KB (+ CDN JS)  | **241 KB**   |
| CDN scripts (Three.js + Vanta)  | 660 KB, blocking load | ~660 KB, idle-loaded after first paint |
| "Loading portfolio..." skeleton flashing during scroll | always | **never** (local Suspense boundaries) |
| npm dependencies                | ~60                 | **25**       |

## 1. Vanta globe — kept everywhere, but never blocking

The globe downloads Three.js r134 (~600 KB) plus the Vanta GLOBE script from
CDNs and runs a full-screen WebGL animation loop, which is the single
biggest performance cost on the site — especially on phones. It stays on
desktop AND mobile (it's the site's signature visual), but with guards so
it never makes the page feel broken:

- **Idle-loaded** — Three.js/Vanta are fetched and initialized only after
  first paint via `requestIdleCallback`, so page load, hydration, and LCP
  are never blocked by ~600 KB of scripts.
- **Low-end device skip** — devices with < 2 GB RAM or < 2 CPU cores get
  the CSS aurora instead (a full-screen WebGL loop would stutter there).
- **Reduced-motion aware** — skipped entirely for `prefers-reduced-motion`.
- **Graceful fallback** — the CSS aurora renders underneath at all times; if
  the CDN is unreachable, the site still looks intentional.
- **Clean teardown** — the WebGL context is destroyed on unmount.

If mobile scroll smoothness ever matters more than the globe, restricting
it to desktop again is a one-line change in `vanta-globe.tsx`.

## 2. Code-split the home page into lazy sections (no skeleton flashing)

`src/app/page.tsx` used to be a single 62 KB client component that imported and
rendered every section (charts, heatmap, galleries, FAQ…) at once.

Now each section lives in `src/components/portfolio/sections/` and is loaded via
`next/dynamic` behind a `LazySection` wrapper (IntersectionObserver). Sections
below the fold are not mounted — and their code is not even fetched — until the
user scrolls near them.

Each `LazySection` wraps its children in a **local `<Suspense>` boundary**
whose fallback matches the placeholder height. Without that boundary, a
section whose code chunk is still streaming suspends up to the route-level
boundary (`app/loading.tsx`), which flashes the full-page "Loading
portfolio..." skeleton every time the user scrolls into an unloaded section.
With it, only a sized placeholder shows while the chunk arrives — no flash,
no layout shift. A late-check fallback also catches instant programmatic
jumps (anchor links, "scroll to bottom").

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
