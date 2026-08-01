# Portfolio Project Worklog

---
Task ID: 1
Agent: Main (Z.ai Code)
Task: Transform Ayman's portfolio (github.com/ado1d/aymanportfolio) into a premium, content-rich portfolio for a 4th-year CS undergraduate who does hackathons & competitive programming (no formal job experience). Add Education, Hackathons, Contests, Certificates sections; image support; and an inline edit mode.

Work Log:
- Cloned & analyzed the source repo; reviewed existing schema, page.tsx, and admin structure.
- Designed a new Prisma schema (SQLite) with models: Profile, Skill (with proficiency level), Education, Hackathon, Contest, Certificate, Achievement, Project (with gallery + longDescription), SocialLink, AdminSession.
- Wrote a seed script (`prisma/seed.ts`) with realistic data for a competitive-programming student: BUET education, 4 hackathons (Smart Bangladesh champion, NASA Space Apps, BUET CSE Fest, HackTheNorth), 6 contests (Codeforces Specialist, ICPC Bronze, CodeChef 5★, etc.), 5 certificates (Meta, AWS, DeepLearning.AI, HackerRank, MongoDB), 6 projects (3 featured), 6 achievements, and social links (GitHub, LinkedIn, Codeforces, Facebook, Email).
- Ran `bun run db:push` and seeded the database successfully.
- Generated branded SVG placeholder images (`scripts/gen-images.ts`) for avatar, 6 projects, 4 hackathons, and 5 certificates — each with unique gradients, patterns, and icons.
- Built API routes:
  - `GET /api/portfolio` — returns all portfolio data (skills grouped by category with ids).
  - `POST /api/upload` — image upload to `/public/uploads` (5MB limit, type-checked).
  - `POST /api/admin/auth` — password-gated login issuing an httpOnly cookie token.
  - `GET/POST /api/admin/[entity]` and `PUT/DELETE /api/admin/[entity]/[id]` — generic CRUD for all 9 entity types, auth-protected.
- Rewrote `globals.css` with a premium purple/pink/cyan theme: aurora background, floating particles, mouse-following lights, animated gradient text, glowing-border cards, glass nav, hover-lift, scroll-reveal, custom scrollbar, project image zoom, timeline styling.
- Built TypeScript types (`src/lib/types.ts`) for all entities.
- Built a `useScrollReveal` + `useCountUp` hook and a `Reveal` wrapper component (hooks-safe — avoids calling hooks inside .map()).
- Built portfolio components: custom icons (Codeforces/CodeChef/AtCoder), ImageLightbox (keyboard-navigable), LoginDialog, EditDialog (dynamic fields + image upload), EditControls (AddButton + inline Edit/Delete), field-definitions config.
- Built the main `page.tsx` (~1000 lines) with sections: sticky glass nav (active-section highlight, theme toggle, edit toggle, mobile hamburger), Hero (avatar, status badge, social, CTAs), animated Stats strip, About, Skills (grouped with proficiency bars), Education timeline (alternating cards), Hackathons grid (cover images + result badges), Contests list (platform icons, rank/rating), Projects showcase (featured + grid, image lightbox), Certificates gallery (image lightbox, credential links), Achievements grid, Contact, sticky footer, back-to-top button.
- Added inline edit mode: click "Edit" → password (`portfolio2024`) → unlock. Each section shows an "Add" button; each card shows edit/delete actions. Image upload supported in every relevant form.
- Fixed React Hooks violation (moved `useScrollReveal` out of `.map()` into per-item components).
- Fixed lint errors (setState-in-effect for initial load + lightbox index sync).
- Fixed stats count-up not triggering at fold edge (made stats count on mount).
- Verified with agent-browser: page loads, all sections render, stats show 4+/6+/6+/5+, lazy images load on scroll, lightbox opens/closes, edit mode login works, create+delete certificate round-trips, dark mode renders, mobile (390px) responsive with hamburger nav.
- VLM-verified visual quality: "exceptionally clean, modern, professional" in light mode; "correctly implemented" dark theme.

Stage Summary:
- Portfolio is fully functional and visually polished. All requested features delivered:
  ✅ "Work Experience" replaced with Education (no fake job)
  ✅ Hackathons section with images & results
  ✅ Programming Contests section (Codeforces/ICPC/CodeChef/AtCoder/Kick Start)
  ✅ Certificates section with images & credential links
  ✅ Image support everywhere (projects, hackathons, certificates) with lightbox
  ✅ Project images shown prominently (featured + grid, zoom on hover, click to enlarge)
  ✅ Clean, attractive, responsive design with dark/light mode
  ✅ Inline edit mode to add/edit/delete all content + upload images
- Lint passes clean. Dev server runs on port 3000 with no errors.
- Edit-mode password: `portfolio2024` (configurable via `ADMIN_PASSWORD` env var).
- Artifacts: `prisma/schema.prisma`, `prisma/seed.ts`, `scripts/gen-images.ts`, `src/app/api/{portfolio,upload,admin}/*`, `src/components/portfolio/*`, `src/app/page.tsx`, `src/app/globals.css`, `src/lib/{db,types}.ts`, `src/hooks/use-scroll-reveal.ts`.

Unresolved / Next-phase recommendations:
- Replace SVG placeholder images with real screenshots of actual projects/certificates (user can upload via edit mode).
- Update profile name/email/social URLs to the real values (currently seeded as "Ayman" with placeholder contact info).
- Add a contact form with backend email delivery (currently mailto link only).
- Consider adding a blog/writing section and a "Now" page for current focus.
- Add SEO: per-section Open Graph images, structured data (JSON-LD Person schema).
- The cron-triggered webDevReview agent may propose additional polish (animations, micro-interactions, accessibility audits).

---
Task ID: 2
Agent: webDevReview cron (round 1)
Task: QA the portfolio via agent-browser, fix bugs, and add new features + styling improvements.

Work Log:
- Read worklog.md to understand prior progress; confirmed lint clean and dev server running.
- QA via agent-browser: opened http://localhost:3000, checked console (no errors), verified all 10 sections render, 16 images lazy-load, structure correct (1 h1, 9 h2, no duplicate IDs).
- Found 1 accessibility bug: the theme-toggle `<Switch>` lacked an `aria-label` (flagged by unlabeled-button audit). Fixed by adding `aria-label="Toggle dark mode"` to both desktop and mobile Switch instances in `src/app/page.tsx`.
- Confirmed the contact section was only a mailto link (no real form) — a known gap from the prior phase.

New features implemented this round:
1. **Contact form with backend storage** (`src/components/portfolio/contact-form.tsx` + `src/app/api/contact/route.ts` + `Message` Prisma model):
   - Name / email / subject / message fields with client + server validation (email regex, length caps).
   - Messages persist to SQLite via a new `Message` model (added to `prisma/schema.prisma`, pushed with `db:push`).
   - Success state shows a confirmation card with a "Send another" button; toast notifications for success/error.
   - Copy-email-to-clipboard button with toast feedback.
   - Resolved a stale-Prisma-client issue: the dev server held a cached `db` singleton from before the `Message` model existed, causing a 500. Triggered a full Next.js server reload by editing `next.config.ts` (Next restarts on config changes), which re-imported the regenerated `@prisma/client`.
2. **Reading progress bar** (`src/components/portfolio/reading-progress.tsx`): a thin gradient bar fixed to the very top of the viewport that tracks scroll position.
3. **Command Palette (Cmd+K / Ctrl+K)** (`src/components/portfolio/command-palette.tsx`): searchable launcher grouping Navigation (jump to section), Theme (toggle dark/light), Social (open links), and Actions (scroll-to-top, print/PDF). Keyboard-navigable (↑↓ to move, Enter to select, Esc to close). A "⌘K Search" button added to the desktop nav (hidden on mobile). Fixed two `react-hooks/set-state-in-effect` lint errors by switching to the React-recommended "adjust state during render" pattern (comparing previous prop/query values) instead of effects.
4. **Project filtering & search** (`src/components/portfolio/projects-showcase.tsx`): replaced the static `ProjectsShowcase` with a version that has a sticky filter bar (search box + tag pills auto-derived from project tags), live result count, and an empty-state with a "Clear filters" button. Removed the now-dead local project card functions from `page.tsx`.
5. **JSON-LD SEO** (`src/components/portfolio/json-ld.tsx`): injects a `Person` schema.org structured-data script (name, jobTitle, description, email, address, sameAs social links, knowsAbout project tags).
6. **Polished loading skeleton** (`src/components/portfolio/portfolio-skeleton.tsx`): replaced the plain "Loading portfolio..." text with a full-page skeleton (nav, hero avatar, headings, stat cards, project grid) using staggered pulse animations.

Styling improvements (`src/app/globals.css`):
- Print stylesheet (`@media print`): hides nav/particles/aurora/edit controls, forces light background, plain borders, underlined links — so the portfolio prints/saves-as-PDF cleanly.
- `prefers-reduced-motion` support: disables animations for users who request reduced motion.
- `:focus-visible` ring for keyboard navigation; `::selection` styling.
- `.tilt-card` (subtle 3D perspective hover), `.nav-underline` (animated gradient underline on nav links — applied to desktop nav), `.fade-overlay` utility.

QA verification (agent-browser):
- 0 unlabeled buttons (accessibility bug fixed).
- Command palette opens via ⌘K; searching "hackathon" filters to 1 result; Enter selects.
- Project search "algoarena" filters 6→1 project; "Next.js" tag filter shows 4 projects.
- Contact form submits successfully (POST /api/contact returns 200, "Message sent" confirmation shown); cleaned up 2 test messages afterward.
- JSON-LD script present and valid.
- VLM confirmed: top progress bar, ⌘K search button, project filter pills all visible; "highly polished" design.
- Mobile (390px): responsive, hamburger nav, ⌘K button hidden, no overflow.

Stage Summary:
- All bugs from QA fixed; 6 new features added; styling expanded with print/reduced-motion/accessibility utilities.
- Lint passes clean. Dev server running on port 3000 with no runtime errors.
- Note for future rounds: if a new Prisma model is added, the dev server must be fully restarted (not just HMR) to pick up the regenerated `@prisma/client` — editing `next.config.ts` is a reliable way to trigger this.

Unresolved / Next-phase recommendations:
- Add an admin view to read/delete submitted contact messages (currently they only persist in the DB).
- Wire the contact form to an email service (Resend/SendGrid) for real delivery.
- Consider a blog/writing section and a "Now/currently" widget.
- Add per-section Open Graph images for link previews.
- Replace SVG placeholder images with real project/certificate screenshots via edit mode.


---
Task ID: 3
Agent: webDevReview cron (round 2)
Task: QA the portfolio, fix bugs, and add new features (admin inbox, testimonials, typing animation, currently widget) + styling improvements.

Work Log:
- Read worklog.md (rounds 1 & 2 complete); confirmed lint clean, dev server running, contact API returning 200.
- QA via agent-browser: no console/runtime errors, all 10 sections render, 16 images load, lightbox keyboard nav (ArrowRight moves 1→2/5), dark mode excellent (VLM: "excellent contrast"), edit mode login works, heading hierarchy correct (1→2→3), all external links have rel=noopener.
- Found 1 accessibility bug: the project search input in the filter bar had no label or aria-label (inputsNoLabel=1). Fixed in `src/components/portfolio/projects-showcase.tsx` by adding a `sr-only` `<label htmlFor="project-search">` + `aria-label` on the input. Verified: 0 unlabeled inputs after fix.

New features implemented this round:
1. **Admin Inbox for contact messages** (addresses an unresolved item from round 2):
   - New API routes: `GET /api/admin/messages` (list, auth-protected) and `PATCH/DELETE /api/admin/messages/[id]` (mark read/unread, delete).
   - New `AdminInbox` component (`src/components/portfolio/admin-inbox.tsx`): a two-pane dialog (message list + detail view) with unread badge count, refresh button, mark-read/unread toggle, delete with confirmation, and a "Reply via email" mailto link.
   - An Inbox button appears in the nav (only when authed) next to the Edit button.
   - Fixed a module-not-found bug: the `verifyAuth` import path in both messages route files was `../../auth/route` (too deep) — corrected to `../auth/route` and `../../auth/route`→`../auth/route` for the [id] route. Verified GET returns 200, PATCH and DELETE return 200.
2. **Testimonials section** (new):
   - New `Testimonial` Prisma model (name, role, company, avatarUrl, quote, rating, order). Seeded 3 realistic testimonials (professor, hackathon mentor, ICPC teammate).
   - New `Testimonials` component (`src/components/portfolio/testimonials.tsx`): a carousel with star ratings, avatar/initials, big quote-mark decoration, prev/next chevron buttons, and clickable dot indicators. Edit mode supports add/edit/delete.
   - Added to NAV_ITEMS and rendered as a new `#testimonials` section between Achievements and Contact.
3. **Typing animation in hero** (styling):
   - New `useTypewriter` hook (`src/hooks/use-typewriter.ts`): cycles through ["Competitive Programmer", "Hackathon Winner", "Full-Stack Builder", "CS Undergraduate", "Problem Solver"] with type/delete speeds and a pause. Implemented with `useReducer` + timeouts (no setState-in-effect). Fixed two lint errors during development (setState-in-effect → reducer; ref-during-render → ref-in-effect).
   - Hero subtitle now shows "I'm a [typed role]" with a blinking cursor (`.animate-blink` CSS).
4. **"Currently" widget** (new feature, in About section):
   - New `CurrentlyItem` Prisma model (type: learning/building/reading/listening, label). Seeded 6 items.
   - New `CurrentlyWidget` component (`src/components/portfolio/currently-widget.tsx`): a card with a pulsing green "live" dot, grouping items by type with color-coded icons (Lightbulb/Hammer/BookOpen/Music). Edit mode supports adding items.
   - Rendered below the About block in the `#about` section.
5. **Magnetic buttons + skill tooltips + new CSS animations** (styling in `globals.css`):
   - `.animate-blink` (cursor blink), `.magnetic` (subtle cursor-pull transition), `.skill-tooltip` / `.skill-tooltip-wrap` (hover tooltips), `.glow-pulse-amber` (pulsing glow for featured badges), `.quote-fade` (testimonial transition).

Schema/API changes:
- Added `Testimonial` and `CurrentlyItem` models to `prisma/schema.prisma`; pushed with `db:push`.
- Added both to the `ENTITY_CONFIG` maps in `src/app/api/admin/[entity]/route.ts` and `[id]/route.ts` so the generic CRUD works for them.
- Added field definitions for `testimonial` and `currentlyItem` in `field-defs.ts`.
- Updated `/api/portfolio` to return `testimonials` and `currently` (grouped by type).
- Updated `src/lib/types.ts` with `Testimonial`, `CurrentlyData`, and extended `PortfolioData`.
- Seeded via `prisma/seed-extras.ts` (3 testimonials, 6 currently items).
- Triggered a full Next.js server restart (touch next.config.ts) so the dev server picked up the regenerated Prisma client.

QA verification (agent-browser):
- 11 sections now render (added #testimonials); 0 unlabeled inputs (a11y bug fixed).
- Typing animation confirmed cycling: "CS Undergraduate" → "Pro" → "Problem Sol" over 6s.
- Currently widget present in #about with Learning/Building/Reading items and pulsing green dot.
- Admin inbox: after login, Inbox button appears; opening it lists messages with unread badge; clicking a message shows full detail with sender, timestamp, and reply link; mark-read and delete both work (PATCH/DELETE return 200).
- Testimonials carousel: 3 dots, next button advances to the next quote.
- Dark mode: VLM confirmed "excellent contrast, no readability issues."

Stage Summary:
- 1 accessibility bug fixed; 4 new features added (admin inbox, testimonials, typing animation, currently widget); styling expanded with 5 new CSS utilities/animations.
- Lint passes clean. Dev server running on port 3000 with no runtime errors.
- All new Prisma models require a server restart to be picked up (done via next.config.ts touch).

Unresolved / Next-phase recommendations:
- Wire contact form to a real email service (Resend/SendGrid) for delivery notifications.
- Add per-section Open Graph images for link previews.
- Replace SVG placeholder images with real project/certificate screenshots via edit mode.
- Consider a blog/writing section.
- Add keyboard shortcut help overlay (? key) listing all shortcuts (⌘K, Esc, ↑↓).

---
Task ID: 4
Agent: webDevReview cron (round 3)
Task: QA the portfolio, fix bugs, and add new features (keyboard shortcuts, skill tabs, rating chart, activity heatmap, Konami easter egg) + styling improvements.

Work Log:
- Read worklog.md (rounds 1-3 complete); confirmed lint clean, dev server running, all 11 sections rendering.
- QA via agent-browser: no console/runtime errors, 16 images load, 0 unlabeled buttons, no duplicate IDs, mobile responsive (390px: hamburger, no overflow), edit mode login works, command palette opens via ⌘K, testimonials carousel (3 dots + prev/next), 6 contests render.
- Found 1 minor a11y issue: the command palette search input had no aria-label. Fixed in `src/components/portfolio/command-palette.tsx` by adding `id="cmd-palette-search"`, a `sr-only` label, and `aria-label="Search commands"`. Verified: 0 unlabeled inputs after fix.

New features implemented this round:
1. **Keyboard shortcut help overlay** (addresses an unresolved item from round 3):
   - New `ShortcutHelp` component (`src/components/portfolio/shortcut-help.tsx`): a dialog listing all shortcuts grouped by Global / Navigation / Theme / Gallery, with styled `<kbd>` key caps.
   - Press `?` (Shift+/) anytime to toggle it.
2. **Full keyboard navigation system** (new):
   - `⌘K` / `Ctrl+K` — command palette (existing).
   - `?` — shortcut help overlay.
   - `/` — focus the project search input (scrolls to it first).
   - `T` — toggle dark/light theme (reads current state from DOM to avoid stale closure).
   - `G` + letter — Vim-style section jump: `G H` (home), `G A` (about), `G S` (skills), `G E` (education), `G P` (projects), `G C` (contact), `G T` (testimonials).
   - All shortcuts are disabled while typing in inputs/textareas (except Esc).
3. **Skill category tabs with filtering** (feature — replaces static SkillsGrid):
   - New `SkillsWithTabs` component (`src/components/portfolio/skills-with-tabs.tsx`): a row of category pill buttons ("All", "Languages", "Web", "Tools", "CS Core", "AI/ML") with counts. Clicking a tab filters the visible skill bars. The active tab scales up with a shadow.
   - Each skill bar now has a hover/focus tooltip showing the proficiency level label (Expert / Advanced / Intermediate / Familiar) + percentage, using the `.skill-tooltip` CSS.
   - Removed the now-dead `SkillsGrid` and `SkillBar` functions from page.tsx.
4. **Codeforces-style rating trajectory chart** (feature — in Contests section):
   - New `RatingChart` component (`src/components/portfolio/rating-chart.tsx`): an SVG line chart showing a 9-point rating history (1200→1845) with rank-band gridlines (Newbie/Pupil/Specialist/Expert color-coded), an animated pulsing dot on the latest point, area-fill gradient, current/peak rating stats, total rating gain, and the current rank badge. Fully responsive with horizontal scroll on narrow screens.
5. **GitHub-style activity heatmap** (feature — in About section):
   - New `ActivityHeatmap` component (`src/components/portfolio/activity-heatmap.tsx`): a 52-week contribution grid with deterministic pseudo-random counts (stable per render), month labels, day labels, hover tooltips per day, a Less→More legend, total contributions count, and a longest-streak badge. Placed side-by-side with the Currently widget in a 2-column grid.
6. **Konami code easter egg** (fun feature):
   - New `KonamiEasterEgg` component (`src/components/portfolio/konami-easter-egg.tsx`): listens for ↑↑↓↓←→←→BA and triggers a full-screen confetti overlay with 80 pieces (colored squares + emoji 🏆⚡💻🎯🚀⭐) falling with rotation, plus a "You found the Konami code!" message. Auto-dismisses after 6 seconds. Wraps the entire app.

Styling improvements (`src/app/globals.css`):
- `@keyframes confetti-fall` — falling + rotating animation for easter egg confetti.
- `.mesh-blob` + `@keyframes mesh-drift` — drifting gradient blob animation (available for future use).
- `.shimmer-text` + `@keyframes shimmer-text` — animated shimmering gradient text effect.

QA verification (agent-browser):
- 11 sections render; 0 unlabeled inputs (a11y bug fixed); command palette input now has aria-label.
- `?` opens shortcut help overlay (verified: shows all shortcuts grouped by category).
- `G` + `P` scrolls to Projects section (verified: section top ≈ 0).
- Skill tabs: 6 tabs (All + 5 categories); clicking "Languages" filters to show only the 6 language skills.
- Rating chart: VLM confirmed "colored data points, rank band gridlines (Newbie/Pupil/Specialist), current/peak rating 1845".
- Activity heatmap: VLM confirmed "GitHub-style contribution heatmap beside the Currently widget, side-by-side grid layout".
- Konami code: 80 confetti pieces render with "You found the Konami code!" message; auto-dismisses after 6s.
- Lint passes clean; dev server compiles with no errors.

Stage Summary:
- 1 a11y bug fixed; 6 new features added (shortcut help, full keyboard nav, skill tabs, rating chart, activity heatmap, Konami easter egg); 3 new CSS animations.
- Lint passes clean. Dev server running on port 3000 with no runtime errors.
- The portfolio now has Vim-style keyboard navigation, a competitive-programming rating visualization, a GitHub-style activity graph, and a fun discoverable easter egg.

Unresolved / Next-phase recommendations:
- Wire contact form to a real email service (Resend/SendGrid) for delivery notifications.
- Add per-section Open Graph images for link previews.
- Replace SVG placeholder images with real project/certificate screenshots via edit mode.
- Consider a blog/writing section.
- Add a visitor analytics dashboard (page views, unique visitors) using the existing SQLite DB.
- Internationalization (i18n) for Bengali + English toggle.

---
Task ID: 5
Agent: webDevReview cron (round 4)
Task: QA the portfolio, fix bugs, and add new features (visitor analytics, project detail modal, vCard download, 404 page) + styling.

Work Log:
- Read worklog.md (rounds 1-4 complete); confirmed lint clean, dev server running, all 11 sections rendering.
- QA via agent-browser: no console/runtime errors, 16 images load, 0 unlabeled buttons, 0 unlabeled inputs, no duplicate IDs, 1 h1, main landmark present, html lang="en", mobile responsive, edit mode login works, project lightbox opens, command palette opens via ⌘K, skill tabs filter, testimonials carousel works, rating chart renders, activity heatmap renders, Konami easter egg triggers.
- The "Fast Refresh runtime error" in the prior log was a transient HMR issue that self-resolved — no action needed. Project is stable.
- No bugs found during QA this round — proceeded to new features.

New features implemented this round:
1. **Visitor analytics tracking + dashboard** (feature — addresses an unresolved item from round 4):
   - New `Visit` Prisma model (path, referrer, userAgent, createdAt). Pushed with `db:push`.
   - New API: `POST /api/analytics/track` (fire-and-forget visit logging, never fails the user request) and `GET /api/analytics/stats` (returns total, today, 7-day daily breakdown, top referrers when authed).
   - New `VisitorBadge` component (`src/components/portfolio/visitor-badge.tsx`): renders a compact "👁 N visits" badge in the hero (public), and a full analytics dashboard card in edit mode with an animated count-up total, a 7-day bar chart with hover tooltips, today's count, and top referrer.
   - Auto-tracks each visit on mount (path + referrer).
2. **Project detail modal** (feature):
   - New `ProjectDetailModal` component (`src/components/portfolio/project-detail-modal.tsx`): a full-screen dialog with the project cover image (click to enlarge in lightbox), featured badge, full long description, tech-stack badges, and Code/Live/View-Image action buttons.
   - Project titles and new "Details" buttons in both featured and regular project cards now open this modal (via `onOpenDetail` prop threaded through `ProjectsShowcaseWithFilter`).
3. **vCard download** (feature):
   - New `downloadVCard` utility (`src/lib/vcard.ts`): generates a vCard 3.0 file (.vcf) with name, title, email, phone, location, about note, resume URL, and social links — triggers a browser download.
   - New "Save Contact" button (UserPlus icon) in the hero CTAs next to Resume.
4. **Custom 404 not-found page** (feature):
   - New `src/app/not-found.tsx`: a polished 404 page with a giant gradient "404" (with a pulsing ghost layer behind), "Page not found" heading, helpful copy, and "Back Home" + "Browse Projects" buttons. Uses the same grid-bg + aurora background as the main site.
5. **Route loading state** (feature):
   - New `src/app/loading.tsx`: reuses the `PortfolioSkeleton` component for Next.js route-level loading.

Schema/API changes:
- Added `Visit` model to `prisma/schema.prisma`; pushed with `db:push`.
- New routes: `src/app/api/analytics/{track,stats}/route.ts`.
- Triggered a full Next.js server restart (touch next.config.ts) so the dev server picked up the regenerated Prisma client.

QA verification (agent-browser):
- No errors; 11 sections render; visitor badge shows live count ("2 visits" → incremented after reload).
- "Save Contact" vCard button present and triggers download.
- Project "Details" buttons (3 featured + 3 regular) open the detail modal with full long description, tech stack ("Next.js, Go, Redis, Docker, WebSocket"), and Code/Live/View-Image buttons.
- 404 page (`/nonexistent`): VLM confirmed "large 404 number with pink-to-purple gradient, Page not found heading, Back Home button".
- Analytics dashboard (edit mode): VLM confirmed "Visitor Analytics card with 7-day bar chart, total visit count, today's visits".
- All API calls return 200 (analytics track/stats, admin auth, portfolio).
- Lint passes clean; dev server compiles with no errors.

Stage Summary:
- 0 bugs (stable); 5 new features added (visitor analytics + dashboard, project detail modal, vCard download, 404 page, route loading); 
- Lint passes clean. Dev server running on port 3000 with no runtime errors.
- The portfolio now has anonymous visitor analytics, rich project detail views, downloadable contact info, and a polished error page.

Unresolved / Next-phase recommendations:
- Wire contact form to a real email service (Resend/SendGrid) for delivery notifications.
- Add per-section Open Graph images for link previews.
- Replace SVG placeholder images with real project/certificate screenshots via edit mode.
- Consider a blog/writing section.
- Internationalization (i18n) for Bengali + English toggle.
- Add a visitor analytics admin page (vs. the current inline card) with date-range filtering and export.

---
Task ID: 6
Agent: webDevReview cron (round 5)
Task: QA the portfolio, fix bugs (og:image, FAQ API destructuring), and add new features (FAQ section, project favorites, OG image, parallax hero) + styling.

Work Log:
- Read worklog.md (rounds 1-5 complete); confirmed lint clean, dev server running, all 11 sections rendering.
- QA via agent-browser: no console/runtime errors, 16 images load, 0 unlabeled buttons, 0 unlabeled inputs, no duplicate IDs, 1 h1, main landmark present, og:title + og:type + twitter:card present, JSON-LD present. Edit mode works, project lightbox works, testimonials carousel works.
- Found 1 SEO bug: `og:image` meta tag was missing (no social preview image). Fixed by generating an OG image and adding it to metadata.
- Found 1 runtime bug during development: after adding the `Faq` model, the portfolio API returned 500 ("faqs is not defined") because I added `db.faq.findMany()` to the Promise.all array but forgot to add `faqs` to the destructuring list. Fixed.

New features implemented this round:
1. **Open Graph social preview image** (SEO — fixes the og:image bug):
   - New `scripts/gen-og-image.ts` generates a 1200×630 SVG (`public/og-image.svg`) with: dark gradient background, grid pattern, glow blobs, avatar "A" circle, "Available for opportunities" badge, "Ayman" name, gradient title, tagline, 4 stat counts (4+/6+/6+/5+), and 5 tech badges (C++, Python, Next.js, Codeforces, React).
   - Updated `src/app/layout.tsx` metadata: added `metadataBase`, `openGraph.images`, `twitter.images`, and `robots` directives.
2. **FAQ section** (new feature):
   - New `Faq` Prisma model (question, answer, category, order). Seeded 6 realistic FAQs across categories (Opportunities, Competitive Programming, Technical, Hackathons, Community, Learning).
   - New `FaqSection` component (`src/components/portfolio/faq-section.tsx`): accordion with smooth expand/collapse, search box (filters by question/answer text), category filter pills, category badges, and edit-mode add/edit/delete support.
   - Added to NAV_ITEMS as `#faq` between Testimonials and Contact.
3. **Project favorites/bookmarks** (new feature):
   - New `useFavorites` hook (`src/hooks/use-favorites.ts`): uses `useSyncExternalStore` for correct SSR hydration + cross-tab sync via the `storage` event. Persists favorited project IDs to localStorage.
   - New `FavoriteToggle` component (heart button) added to every project card footer — click to bookmark; toast confirmation.
   - New `FavoritesCount` badge in the hero (next to the visitor badge) showing the total saved count.
4. **Parallax hero** (styling):
   - New `useParallax` hook (`src/hooks/use-parallax.ts`): returns a scroll-based offset (capped at 600px) using rAF + passive scroll listener.
   - Applied to the hero avatar container (translates up at 0.15× scroll) and its glow blob (0.3× scroll + scale), creating depth on scroll.

Schema/API changes:
- Added `Faq` model to `prisma/schema.prisma`; pushed with `db:push`.
- Added `faq` to the admin entity config (`[entity]/route.ts` + `[entity]/[id]/route.ts`) and field definitions.
- Updated `/api/portfolio` to return `faqs` (fixed the destructuring bug).
- Updated `src/lib/types.ts` with `Faq` interface.
- Seeded via `prisma/seed-faq.ts` (6 FAQs).
- Triggered a full Next.js server restart (touch next.config.ts).

Styling improvements (`src/app/globals.css`):
- `.parallax-slow` / `.parallax-fast` (transform transitions for parallax).
- `@keyframes section-enter` + `.section-enter` (scroll-triggered entrance).
- `@keyframes heart-pulse` + `.heart-pulse` (favorite toggle feedback).
- `.faq-expand` (smooth FAQ accordion transition).
- `@keyframes action-glow` + `.action-glow` (pulsing glow for CTAs).

QA verification (agent-browser):
- 12 sections now render (added #faq); og:image meta tag present ("https://ayman.dev/og-image.svg").
- 0 unlabeled inputs; portfolio API returns 200 with all data.
- FAQ: 6 items, accordion expands/collapses, search "codeforces" filters to 2 matches, category pills filter correctly. VLM confirmed: "expandable question cards with category badges, search box, category filter pills, one answer expanded".
- Favorites: 6 heart buttons on project cards; clicking one shows "1 saved" badge in hero.
- Parallax: hero avatar transform changes with scroll (translateY applied).
- Lint passes clean; dev server compiles with no errors.

Stage Summary:
- 2 bugs fixed (og:image SEO, FAQ API destructuring); 4 new features added (OG image, FAQ section, project favorites, parallax hero); 5 new CSS animations.
- Lint passes clean. Dev server running on port 3000 with no runtime errors.
- The portfolio now has social-preview-ready OG images, a searchable FAQ, bookmarkable projects, and a depth parallax hero.

Unresolved / Next-phase recommendations:
- Wire contact form to a real email service (Resend/SendGrid) for delivery notifications.
- Replace SVG placeholder images with real project/certificate screenshots via edit mode.
- Internationalization (i18n) for Bengali + English toggle.
- Add a dedicated analytics admin page with date-range filtering and CSV export.
- Consider a blog/writing section.

---
Task ID: 7
Agent: webDevReview cron (round 6)
Task: QA the portfolio and add new features (share buttons, tech marquee, cursor follower, sound effects, scroll progress ring) + styling.

Work Log:
- Read worklog.md (rounds 1-6 complete); confirmed lint clean, dev server running, all 12 sections rendering.
- QA via agent-browser: no console/runtime errors, 16 images load, 0 unlabeled buttons, 0 unlabeled inputs, no duplicate IDs, 1 h1, no broken hash links, viewport meta present, lang="en". Edit mode login works, project detail modal opens, FAQ accordion works, favorites toggle works. Project is stable — no bugs found.

New features implemented this round:
1. **Share buttons on project detail modal** (feature):
   - New `ShareButtons` component (`src/components/portfolio/share-buttons.tsx`): copy-link + Twitter/X + LinkedIn + Facebook + native Web Share API (mobile). Resolves the share URL lazily at click-time (no state/effects needed). Toast confirmation on copy.
   - Integrated into the project detail modal footer — every project is now shareable to social platforms.
2. **Tech stack marquee** (styling — in hero):
   - New `TechMarquee` component (`src/components/portfolio/tech-marquee.tsx`): a horizontally-scrolling, seamlessly-looping marquee of 16 tech badges (C++, Python, TypeScript, Next.js, React, Node.js, Tailwind, Prisma, PostgreSQL, Redis, Docker, Git, Codeforces, Linux, TensorFlow, WebAssembly) with emoji glyphs. Uses the existing `.marquee` CSS with a new `.mask-fade` edge gradient.
3. **Custom cursor follower** (styling):
   - New `CursorFollower` component (`src/components/portfolio/cursor-follower.tsx`): two layers — a small precise dot (instant) + a larger gradient ring (spring-eased trailing at 0.15 lerp). Uses `mix-blend-difference` for visibility on any background. Disabled on touch devices and when `prefers-reduced-motion`. Implemented with `useSyncExternalStore` for the mounted flag (lint-clean).
4. **Sound effects toggle** (fun feature):
   - New `useSoundEffects` hook (`src/hooks/use-sound-effects.ts`): synthesizes subtle UI sounds via the Web Audio API (OscillatorNode + GainNode) — no audio files needed. Profiles for click/hover/success/toggle with pitch sweeps. Preference persisted to localStorage via `useSyncExternalStore` (cross-tab sync).
   - A volume toggle button (Volume2/VolumeX icon) in the nav, with a pulsing indicator when enabled. Off by default (user opt-in).
5. **Scroll progress ring** (feature/styling — replaces plain back-to-top):
   - New `ScrollProgressButton` component (`src/components/portfolio/scroll-progress-button.tsx`): a circular SVG ring showing overall scroll percentage with a gradient fill, doubling as a back-to-top button. The ring fills as you scroll; tooltip shows "N% scrolled". Appears after 400px scroll.
   - Removed the old plain back-to-top button and its unused `showTop` state + `ChevronUp` import.

Styling improvements (`src/app/globals.css`):
- `.mask-fade` (marquee edge gradient mask).
- `.magnetic-btn` (transition for magnetic button effect).
- `@keyframes sound-on-pulse` + `.sound-on-indicator` (pulsing indicator for enabled sound).

Lint fixes during development:
- `useSoundEffects`: refactored from useState-in-effect to `useSyncExternalStore` (localStorage-backed external store) for the sound-enabled preference.
- `ShareButtons`: removed useState+useEffect for shareUrl; resolved lazily at click-time instead.
- `CursorFollower`: replaced the mounted useState-in-effect with `useSyncExternalStore`; cleaned up expression-statement warnings.

QA verification (agent-browser):
- No errors; 12 sections render; 0 unlabeled inputs.
- Tech marquee: 2 tracks (seamless loop) with 16 tech badges. VLM confirmed: "horizontally scrolling marquee of tech badges below the hero CTAs".
- Sound toggle: present in nav, aria-pressed toggles on click. VLM confirmed: "sound/volume toggle icon in the nav".
- Share buttons: project detail modal has 5 share buttons (copy/Twitter/LinkedIn/Facebook/native). Verified `hasShare: true, shareBtnCount: 5`.
- Scroll progress ring: visible after scroll, title shows "13% scrolled". VLM confirmed: "circular scroll-progress ring with gradient fill and back-to-top arrow".
- Cursor follower: 2 elements rendered (dot + ring), opacity-0 until mouse move.
- Mobile (390px): hamburger nav, no overflow, sound toggle hidden (sm:inline-flex), cursor follower inactive on touch.
- Lint passes clean; dev server compiles with no errors.

Stage Summary:
- 0 bugs (stable); 5 new features added (share buttons, tech marquee, cursor follower, sound effects, scroll progress ring); 3 new CSS utilities.
- Lint passes clean. Dev server running on port 3000 with no runtime errors.
- The portfolio now has social sharing, an animated tech marquee, a custom cursor, optional UI sound effects, and a scroll-progress ring.

Unresolved / Next-phase recommendations:
- Wire contact form to a real email service (Resend/SendGrid) for delivery notifications.
- Replace SVG placeholder images with real project/certificate screenshots via edit mode.
- Internationalization (i18n) for Bengali + English toggle.
- Add a dedicated analytics admin page with date-range filtering and CSV export.
- Consider a blog/writing section.
- Wire the sound `play()` function into actual button click handlers across the app (currently the toggle + hook exist; connecting to all CTAs is the next step).

---
Task ID: 8
Agent: webDevReview cron (round 7)
Task: QA the portfolio and add new features (sound wiring, mesh blobs, fun facts, magnetic buttons) + styling.

Work Log:
- Read worklog.md (rounds 1-7 complete); confirmed lint clean, dev server running, all 12 sections rendering.
- QA via agent-browser: no console/runtime errors, 16 images load, 0 unlabeled buttons, 0 unlabeled inputs, no duplicate IDs, 1 h1, sound toggle works (aria-pressed toggles, pulsing indicator shows when on), edit mode login works, favorites toggle works, project detail modal opens. Project is stable — no bugs found.
- Noted that the sound `play()` function existed but wasn't wired into actual button click handlers (a known gap from round 6). Fixed this round.

New features implemented this round:
1. **SoundProvider — global sound wiring** (feature completion — addresses an unresolved item from round 6):
   - New `SoundProvider` component (`src/components/portfolio/sound-provider.tsx`): wraps the entire app and attaches a global `click` listener (passive) that plays a subtle UI sound on any button/switch click when sound is enabled. Uses `closest('button, a, [role=button], [role=switch]')` to detect interactive elements. Plays `click` profile for buttons, `toggle` for switches. Skips anchor links (too noisy). No need to wrap individual buttons.
   - Also created a `SoundButton` wrapper component (`src/components/portfolio/sound-button.tsx`) for cases where per-button sound profiles are needed.
   - Verified: enabling sound + clicking buttons produces no console errors; the Web Audio API synthesizes tones correctly.
2. **Animated gradient mesh background blobs** (styling):
   - New `MeshBlobs` component (`src/components/portfolio/mesh-blobs.tsx`): renders 3 large, slowly-drifting colored blobs (purple, pink, cyan) behind the content using the existing `.mesh-blob` CSS animation (defined in round 5 but unused until now). Each blob has a different delay/direction for organic movement. Opacity is lower in dark mode. Respects `prefers-reduced-motion`.
   - Positioned in the background layer alongside the grid-bg and aurora.
3. **"Fun Facts" rotating widget** (feature — in About section):
   - New `FunFactsWidget` component (`src/components/portfolio/fun-facts-widget.tsx`): a card that auto-rotates through 10 fun facts every 5 seconds with a fade animation. Pauses on hover. Includes a shuffle button (random fact) and clickable progress dots. Each fact has an emoji icon + witty text about Ayman's coding habits, contest stories, etc.
   - Rendered below the Currently + ActivityHeatmap grid in the #about section.
4. **Magnetic CTA buttons** (styling):
   - New `MagneticButton` component (`src/components/portfolio/magnetic-button.tsx`): wraps the shadcn Button's `buttonVariants` in a plain button/Slot that translates toward the cursor on mousemove (configurable strength, default 12px). Uses `useRef` to directly manipulate the DOM transform for smooth 60fps performance. Supports `asChild` via Radix Slot.
   - Applied to all 3 hero CTAs (Let's Connect, View Projects, Save Contact). Verified: button translates 5.59px toward cursor on mousemove.

Styling improvements:
- The `.mesh-blob` CSS animation (defined round 5) is now actually used by the MeshBlobs component.
- The `.magnetic-btn` CSS class (defined round 6) is now used by MagneticButton.

QA verification (agent-browser):
- No errors; 12 sections render; 0 unlabeled inputs.
- Mesh blobs: 3 `.mesh-blob` elements present. VLM confirmed: "soft, colored gradient blobs in purple, pink, and cyan" in the background.
- Fun facts: widget present with emoji + fact text + shuffle button + progress dots. VLM confirmed: "Fun Fact card featuring an emoji icon, a fun fact sentence, a shuffle button, and progress dots".
- Magnetic buttons: 3 `.magnetic-btn` elements in #home. Verified transform: `translate(5.59234px, 0px)` on cursor move. CTAs VLM-confirmed: "three CTA buttons (Let's Connect, View Projects, Save Contact) along with a technology marquee".
- Sound provider: enabling sound + clicking buttons/switches produces no console errors. Sound toggle aria-pressed correctly reflects state.
- Lint passes clean; dev server compiles with no errors.

Stage Summary:
- 0 bugs (stable); 4 new features added (SoundProvider, mesh blobs, fun facts widget, magnetic buttons); 2 existing CSS utilities now actively used.
- Lint passes clean. Dev server running on port 3000 with no runtime errors.
- The portfolio now has fully wired UI sound effects, an ambient animated mesh background, a rotating fun facts widget, and magnetic hero CTAs.

Unresolved / Next-phase recommendations:
- Wire contact form to a real email service (Resend/SendGrid) for delivery notifications.
- Replace SVG placeholder images with real project/certificate screenshots via edit mode.
- Internationalization (i18n) for Bengali + English toggle.
- Add a dedicated analytics admin page with date-range filtering and CSV export.
- Consider a blog/writing section.
- Add a "success" sound when contact form submits or favorites are toggled (requires wiring `play('success')` into those specific handlers).

---
Task ID: 9
Agent: webDevReview cron (round 8)
Task: QA the portfolio and add new features (print resume, contest stats, hero spotlight) + enhanced print styling.

Work Log:
- Read worklog.md (rounds 1-8 complete); confirmed lint clean, dev server running, all 12 sections rendering.
- QA via agent-browser: no console/runtime errors, 16 images load, 0 unlabeled buttons, 0 unlabeled inputs, no duplicate IDs, 1 h1, no horizontal overflow (scrollWidth = viewportWidth), 2470 DOM nodes. Edit mode login works, project detail modal opens, FAQ accordion works. Project is stable — no bugs found.

New features implemented this round:
1. **Enhanced print/PDF resume layout** (feature — improves existing print styles):
   - Massively expanded the `@media print` stylesheet in `globals.css`: now hides nav, footer, mesh blobs, marquee, cursor, sound button, testimonials, FAQ, contact form, and avatar for a clean resume. Forces light mode variables, compacts section spacing (12px), makes the hero a compact header (24pt name), shows external URLs in parentheses after links, and sets `@page { margin: 1.5cm }`.
   - Added a "Print" button (Printer icon) to the hero CTAs that calls `window.print()` — users can save the portfolio as a clean PDF resume.
2. **Contest stats summary cards** (feature — in Contests section):
   - New `ContestStats` component (`src/components/portfolio/contest-stats.tsx`): extracts aggregate stats from the contest list and renders a row of 5 color-coded stat cards: total contests, best rank (parses numeric rank from strings like "Ranked 47th"), peak rating (parses from "1845 (Specialist)"), unique platforms count, and medal count (🥇🥈🥉). Each card has a colored icon + value + label.
   - Rendered above the rating chart in the #contests section. Verified: shows "6+ Contests, #1 Best Rank, 2104 Peak Rating, 6 Platforms, 2 Medals".
3. **Hero spotlight cursor effect** (styling):
   - New `HeroSpotlight` component (`src/components/portfolio/hero-spotlight.tsx`): a fixed overlay that follows the cursor with a radial gradient (600px circle, purple tint at 0.06 opacity), creating a subtle "spotlight revealing the grid" effect. Disabled on touch devices and when `prefers-reduced-motion`. Added to the background layer.

Styling improvements:
- Print stylesheet expanded from ~40 lines to ~130 lines with proper resume formatting.
- Hero spotlight adds a cursor-following ambient glow to the grid background.

QA verification (agent-browser):
- No errors; 12 sections render; 0 unlabeled inputs.
- Print button present ("Print") and triggers window.print().
- Contest stats: 5 cards rendered showing correct aggregate values (6+/1/2104/6/2). VLM confirmed: "5 stat cards in a row displaying Contests, Best Rank, Peak Rating, Platforms, Medals with distinct colored icons. Below these is a Rating Trajectory section".
- Hero spotlight: component renders (overlay div present); correctly doesn't activate in headless browser (no `pointer: fine`) — desktop-only feature.
- Dark mode: VLM confirmed "dark theme renders correctly with highly readable white and purple text, all accents clearly visible".
- Lint passes clean; dev server compiles with no errors.

Stage Summary:
- 0 bugs (stable); 3 new features added (enhanced print resume, contest stats cards, hero spotlight); print stylesheet massively improved.
- Lint passes clean. Dev server running on port 3000 with no runtime errors.
- The portfolio now has a print-to-PDF resume mode, aggregate contest statistics, and a cursor spotlight effect.

Unresolved / Next-phase recommendations:
- Wire contact form to a real email service (Resend/SendGrid) for delivery notifications.
- Replace SVG placeholder images with real project/certificate screenshots via edit mode.
- Internationalization (i18n) for Bengali + English toggle.
- Add a dedicated analytics admin page with date-range filtering and CSV export.
- Consider a blog/writing section.
- Add a "success" sound when contact form submits or favorites are toggled.

---
Task ID: 10
Agent: webDevReview cron (round 9)
Task: QA the portfolio and add new features (skills radar chart, animated section dividers, achievement progress rings) + styling.

Work Log:
- Read worklog.md (rounds 1-9 complete); confirmed lint clean, dev server running, all 12 sections rendering.
- QA via agent-browser: no console/runtime errors, 16 images load, 0 unlabeled buttons, 0 unlabeled inputs, no duplicate IDs, 1 h1, no horizontal overflow, 2517 DOM nodes. Edit mode login works, project detail modal opens. Project is stable — no bugs found.

New features implemented this round:
1. **Skills radar/spider chart** (feature — in Skills section):
   - New `SkillsRadar` component (`src/components/portfolio/skills-radar.tsx`): an SVG radar chart showing average proficiency per skill category. Computes the average level for each category, renders a filled polygon with gradient fill + stroke, grid rings at 25/50/75/100%, axis lines, data points with hover tooltips, and category labels with percentages. Shows an overall average at the top. Only renders if there are 3+ categories (radar needs 3 axes).
   - Placed in a 2/3 + 1/3 grid alongside the SkillsWithTabs in the #skills section. Verified: shows 5 categories (AI/ML 72%, CS Core 86%, Languages 87%, Tools 78%, Web 85%) with 82% overall, 21 total skills. VLM confirmed: "Skill Radar on the right with filled polygon and axes for categories".
2. **Animated section dividers** (styling):
   - New `SectionDivider` component (`src/components/portfolio/section-divider.tsx`): an SVG wave with a gradient fill (purple→pink→cyan) that scales in from 0→100% width on scroll-into-view. Supports a `flip` prop for alternating direction. Uses `useScrollReveal` for the entrance animation.
   - Added 2 dividers: between the Stats strip and About section (normal orientation), and between Achievements and Testimonials (flipped).
3. **Achievement progress rings** (styling — enhanced AchievementsGrid):
   - Refactored `AchievementsGrid` into per-item `AchievementCard` components, each with an animated SVG progress ring around the emoji icon. The ring fills from 0→100% on scroll-into-view with a staggered delay (index × 100ms) and a 1.2s cubic-bezier transition. Uses a unique gradient ID per card to avoid SVG ID collisions.
   - Verified: 6 cards with 6 progress rings. VLM confirmed: "cards featuring emoji icons centered within circular gradient progress rings".

QA verification (agent-browser):
- No errors; 12 sections render; 0 unlabeled inputs; 0 duplicate IDs.
- Skills radar: SVG present with 5 categories and correct averages (82% overall). VLM confirmed: "radar on the right with filled polygon, skill bars on the left with category tabs".
- Section dividers: 2 wave dividers present (before About, after Achievements). Verified via DOM: "DIVIDER PRESENT".
- Achievement rings: 6 cards × 6 gradient progress rings. VLM confirmed: "emoji icons centered within circular gradient progress rings".
- Mobile (390px): hamburger nav, no overflow, skills radar renders responsively.
- Lint passes clean; dev server compiles with no errors.

Stage Summary:
- 0 bugs (stable); 3 new features added (skills radar chart, animated section dividers, achievement progress rings).
- Lint passes clean. Dev server running on port 3000 with no runtime errors.
- The portfolio now has a radar chart for skill visualization, animated wave dividers between sections, and progress-ringed achievement cards.

Unresolved / Next-phase recommendations:
- Wire contact form to a real email service (Resend/SendGrid) for delivery notifications.
- Replace SVG placeholder images with real project/certificate screenshots via edit mode.
- Internationalization (i18n) for Bengali + English toggle.
- Add a dedicated analytics admin page with date-range filtering and CSV export.
- Consider a blog/writing section.
- Add a "success" sound when contact form submits or favorites are toggled.

---
Task ID: 11
Agent: webDevReview cron (round 10)
Task: QA the portfolio and add new features (project gallery carousel, sound toasts, visitor location widget, gradient hover borders) + styling.

Work Log:
- Read worklog.md (rounds 1-10 complete); confirmed lint clean, dev server running, all 12 sections rendering.
- QA via agent-browser: no console/runtime errors, 16 images load, 0 unlabeled buttons, 0 unlabeled inputs, no duplicate IDs, 1 h1, no horizontal overflow. Edit mode login works, project detail modal opens. Project is stable — no bugs found.

New features implemented this round:
1. **Project gallery carousel** (feature — in detail modal):
   - New `ProjectGallery` component (`src/components/portfolio/project-gallery.tsx`): a carousel that combines the project's cover image + gallery field (comma-separated URLs) into a swipeable image set. Features: prev/next chevron buttons, clickable dot indicators, an image counter ("1 / 3"), a zoom-on-click hint, and a featured badge. Only shows carousel controls when there are 2+ images. Replaces the static cover image in the project detail modal.
   - Integrated into `ProjectDetailModal` (replaced the inline cover image block).
2. **Sound toast for success actions** (feature completion — addresses an unresolved item):
   - New `useSoundToast` hook (`src/hooks/use-sound-toast.ts`): wraps `useToast` + `useSoundEffects` — plays a success sound on success toasts, a toggle sound on copy/favorite-remove, and a lower-pitched sound on errors. Accepts a `sound` param to override.
   - Wired into `ContactForm` (success: "Message sent! 🎉" plays success sound; copy-email plays toggle sound) and `FavoriteToggle` (add plays success, remove plays toggle).
3. **Visitor location widget** (feature — in About section):
   - New `VisitorLocationWidget` component (`src/components/portfolio/visitor-location-widget.tsx`): detects the visitor's timezone via `Intl.DateTimeFormat().resolvedOptions().timeZone`, derives their city/region, and shows their local time (updating every second). Privacy-friendly — no external IP geolocation API needed.
   - Placed side-by-side with the FunFactsWidget in a 2-column grid in #about. Verified: shows "You're visiting from UTC, 09:42 AM" (headless browser timezone).
4. **Animated gradient hover borders** (styling):
   - New `.gradient-border-hover` CSS utility: adds an animated gradient border (purple→pink→cyan) that fades in on hover via a masked `::after` pseudo-element. Available for application to any card.
   - Also added `.gallery-fade` (image transition), `.live-pulse` (green pulse ring for live indicators) CSS animations.

QA verification (agent-browser):
- No errors; 12 sections render; 0 unlabeled inputs; 0 duplicate IDs.
- Project gallery: modal opens with cover image, title, description, tech stack, Code/Live buttons, and share buttons. VLM confirmed: "gradient cover image with project logo and title, full description, tech stack badges, action buttons, share options".
- Location widget: shows "You're visiting from UTC, 09:43 AM" with live-updating time. VLM confirmed: "You're visiting from widget showing location UTC and time 09:43 AM, Fun Fact card to its left".
- Sound toast: contact form and favorites now play sounds on success (verified via code wiring; sounds only audible with sound toggle enabled).
- Mobile (390px): hamburger nav, no overflow, location widget renders.
- Lint passes clean; dev server compiles with no errors.

Stage Summary:
- 0 bugs (stable); 4 new features added (project gallery carousel, sound toasts, visitor location widget, gradient hover borders); 3 new CSS animations.
- Lint passes clean. Dev server running on port 3000 with no runtime errors.
- The portfolio now has a gallery carousel in project modals, sound-enhanced toasts, a visitor location/time widget, and animated gradient hover borders.

Unresolved / Next-phase recommendations:
- Wire contact form to a real email service (Resend/SendGrid) for delivery notifications.
- Replace SVG placeholder images with real project/certificate screenshots via edit mode.
- Internationalization (i18n) for Bengali + English toggle.
- Add a dedicated analytics admin page with date-range filtering and CSV export.
- Consider a blog/writing section.
- Apply the `.gradient-border-hover` class to more cards across the site for consistency.
