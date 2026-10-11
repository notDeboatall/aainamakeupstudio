# TASKS — Aaina Makeup Studio

Legend: `[ ]` todo · `[~]` in progress · `[x]` done · `[!]` blocked (reason in MEMORY.md)
Work top to bottom. Tick as you go. Add tasks if you discover missing work (note it in MEMORY.md).

## Phase 0 — Setup
- [x] 0.1 Read all brain files; summarise understanding in MEMORY.md (≤ 15 lines)
- [x] 0.2 Create folder structure from ARCHITECTURE §2 (empty files with headers)
- [x] 0.3 Add `.nojekyll`, `robots.txt`, `README.md` skeleton
- [x] 0.4 Create `css/tokens.css` from DESIGN §2–4
- [x] 0.5 Create `css/base.css` (reset, typography scale, container, grid, utilities, skip link, focus styles, reduced motion)

## Phase 1 — Data layer
- [x] 1.1 `data/site.js` (placeholders marked `[[ ]]`)
- [x] 1.2 `data/services.js` (6 services from CONTENT.md)
- [x] 1.3 `data/branches.js` (2 branches in Bhubaneswar: Lewis Road and Gudiapokhari)
- [x] 1.4 `data/gallery.js` (+ categories; 12 placeholder entries flagged `photo coming soon`)
- [x] 1.5 `data/reviews.js` (empty array)

## Change Request CR-01 — Two Branches & Display Font Hairline Fix
- [x] CR-01.1 Update brain files (PRD, CONTENT, ARCHITECTURE, ASSETS, DESIGN, TASKS, MEMORY)
- [x] CR-01.2 Update `data/branches.js` (exactly 2 branches: lewis-road and gudiapokhari)
- [x] CR-01.3 Update `data/site.js`, JSON-LD, sitemap, HTML pages, footer, studios.html, booking sheet
- [x] CR-01.4 Display typography hairline fix: `--display-opsz` in tokens.css, font-variation-settings + masthead text stroke
- [x] CR-01.5 Browser opsz comparison (11, 14, 20, 28 at 360px & 1920px), capture screenshots, set final variable
- [x] CR-01.6 Project-wide audit for leftovers (cuttack, puri, branch-third, 2–3 branches, three studios, [[CITY...]])

## Phase 2 — Core JS
- [x] 2.1 `js/core.js` helpers
- [x] 2.2 `js/whatsapp.js` — buildMessage / buildLink / open (+ unit-style console tests documented in MEMORY.md)
- [x] 2.3 `js/layout.js` — header/footer injection, mobile menu, active link, hide-on-scroll
- [x] 2.4 `js/booking.js` — dialog, validation, preview, `data-book` delegation, remember name
- [x] 2.5 `js/reveal.js` — IntersectionObserver reveals (respect reduced motion)

## Phase 3 — Shared components (CSS)
- [x] 3.1 Header + mobile menu
- [x] 3.2 Buttons + text links
- [x] 3.3 Service rows
- [x] 3.4 Gallery card + grid spans
- [x] 3.5 Booking sheet (desktop panel + mobile bottom sheet)
- [x] 3.6 Lightbox
- [x] 3.7 Branch tabs + panel + map frame
- [x] 3.8 Review quote
- [x] 3.9 Footer with cropped masthead

## Phase 4 — Pages
- [x] 4.1 `index.html` — Cover hero (masthead + image + cover lines)
- [x] 4.2 Home — Index (services rows) + `js/services.js`
- [x] 4.3 Home — Lookbook 3D Coverflow Carousel (`js/carousel.js`, CSS 3D arc, active caption with booking CTA, touch/drag, reduced-motion & no-JS fallback)
- [x] 4.3a Fix gallery card structure on `gallery.html` (consistent image + flush caption inside card, unified background)
- [x] 4.4 Home — Studio statement band + studios teaser
- [x] 4.5 Home — Reviews (auto-hide if empty) + `js/reviews.js`
- [x] 4.6 Home — Final CTA
- [x] 4.7 `services.html` — list, price note, FAQ (`<details>`)
- [x] 4.8 `gallery.html` + `js/gallery.js` — render, filter, hash deep-link
- [x] 4.9 Lightbox behaviour (keys, swipe, focus trap, Book this look)
- [x] 4.10 `studios.html` + `js/studios.js` — tabs, panels, lazy map, hash select
- [x] 4.11 `404.html`

## Phase 5 — SEO & meta
- [x] 5.1 Titles, descriptions, canonical, OG/Twitter on all pages
- [x] 5.2 JSON-LD LocalBusiness (static + runtime)
- [x] 5.3 Favicon set (SVG wordmark "A"), apple-touch-icon, OG default image
- [x] 5.4 `sitemap.xml`

## Phase 6 — QA
- [ ] 6.1 Booking flow tests (RULES §E list) from every entry point (header, hero, service row, gallery card, lightbox, branch panel)
- [ ] 6.2 Responsive checks 360/768/1280/1920 — screenshots
- [ ] 6.3 Keyboard + screen-reader sanity (tab order, dialog focus, aria-labels)
- [ ] 6.4 Lighthouse mobile ≥ targets (PRD §8); fix issues
- [ ] 6.5 Anti-Slop Checklist review of every page (DESIGN §9)
- [ ] 6.6 Cross-browser smoke (Chrome, Safari/WebKit if possible, Firefox)
- [ ] 6.7 Broken links/paths check on a simulated subpath (`/repo/`)

## Phase 7 — Handover & deploy
- [ ] 7.1 README: how to change numbers, services, branches, gallery, add photos (with image export specs)
- [ ] 7.2 `ASSETS.md` checklist of photos needed (file names + sizes) for the owner
- [ ] 7.3 List every unresolved `[[PLACEHOLDER]]` for the owner
- [ ] 7.4 GitHub Pages deploy steps verified; update `baseUrl`
- [ ] 7.5 Final report in MEMORY.md

## Backlog (only after launch, if owner asks)
- [ ] Odia / Hindi language toggle
- [ ] Instagram feed (static curated, not API)
- [ ] Price list PDF
- [ ] Online appointment calendar
