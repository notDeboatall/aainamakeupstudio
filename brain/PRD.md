# PRD — Aaina Makeup Studio Website

> Read this first. If anything in another file contradicts this, ask the human before proceeding.

## 1. What we're building
A multi-page, static, mobile-first website for **Aaina Makeup Studio**, a makeup studio in Odisha with 2 branches in Bhubaneswar (Lewis Road and Gudiapokhari).
"Aaina" means *mirror*. The site should feel like a fashion magazine cover + lookbook, not a SaaS template.

## 2. Business goal
Turn visitors into **WhatsApp conversations**. Every page should end in one action: *message the studio*.
Secondary: show real work (gallery), show where the studios are (branches), build trust (reviews).

## 3. Users
| User | Device | Wants |
|---|---|---|
| Bride / family member | Phone (90%) | See bridal work, check price range, book trial fast |
| Party / event client | Phone | Quick booking for a date, nearest branch |
| Local walk-in | Phone | Address, hours, directions, phone |
| Photographer / model | Phone/Desktop | Editorial look, collaboration contact |

## 4. Hard constraints
- **Only HTML, CSS, vanilla JS.** No frameworks, no build step, no npm, no bundlers, no CSS frameworks, no jQuery.
- Deployable on **GitHub Pages** as-is (static files, relative paths, works from a repo subpath like `/aaina/`).
- Works if opened via `file://` for local testing (so data lives in `.js` files, not fetched `.json`).
- No backend, no database, no paid APIs, no API keys.
- Fonts: Google Fonts allowed (with `display=swap` + system fallbacks). Nothing else external except Google Maps embed links.

## 5. Pages
1. `index.html` — Home (cover, services index, featured lookbook, studios teaser, reviews, final CTA)
2. `services.html` — Full services with WhatsApp booking per service
3. `gallery.html` — Lookbook: filterable dynamic cards + lightbox
4. `studios.html` — Branch location panels (2 branches in Bhubaneswar)
5. `404.html` — On-brand not-found (GitHub Pages serves this automatically)

## 6. Core features (must-have)
### F1. Services → WhatsApp with auto-composed message
- Every service has a **Book on WhatsApp** button.
- Clicking opens a small booking sheet (modal on desktop, bottom sheet on mobile) asking: **Name** (required), **Branch** (required, preselected if known), **Preferred date** (optional), **Note** (optional).
- Submit opens `https://wa.me/<branch-number>?text=<encoded message>` in a new tab.
- Message includes: client name, service, branch, date, note. Exact template is in `CONTENT.md`.
- Name is remembered in `localStorage` (optional, graceful if blocked).
- Same booking sheet is reused from gallery cards ("Book this look") and header CTA.

### F2. Branch location panels
- 2 branches defined in `data/branches.js` (Lewis Road & Gudiapokhari). Each branch panel shows: name, area/city, full address, opening hours, phone, WhatsApp, landmark, **Get directions** (Google Maps link), **embedded map** (lazy-loaded iframe), **WhatsApp this studio**.
- Desktop: branch selector on the left (tabs), active panel on the right. Mobile: stacked accordion or horizontal tabs.
- Adding a 3rd branch must need **only a data change**.

### F3. Gallery with dynamic cards & Home Lookbook Carousel
- Home lookbook teaser (`index.html`): 3D coverflow carousel rendering `featured: true` looks from `data/gallery.js`. Continuous circular wrapping (3 to 12 items), CSS 3D perspective/preserve-3d arc, active card centered/large, neighbors receding in depth/darkened, active caption below stage with booking CTA, text controls (Prev/Next, counter, Pause/Play), drag/swipe, keyboard navigation, and reduced-motion/no-JS flat scroll-snap fallback.
- Lookbook page (`gallery.html`): Full dynamic cards rendered from `data/gallery.js` with unified card structure (image + flush caption inside card).
- Category filter (All / Bridal / Reception / Party / Editorial / Everyday / Hair & Saree).
- Mixed card sizes (editorial grid, not uniform squares).
- Lightbox: click → full image, caption, category, "Book this look" button, prev/next, keyboard arrows, Esc, swipe on touch.
- Lazy loading, correct `width/height` to avoid layout shift.
- Deep link: `gallery.html#bridal` pre-selects a filter.

### F4. Reviews
- Rendered from data. Only real reviews supplied by the owner. Until then, the section is hidden (not filled with fake ones).

### F5. SEO + sharing
- Unique `<title>`, meta description, canonical, Open Graph + Twitter tags per page.
- `LocalBusiness` JSON-LD (with each branch as `location`).
- `sitemap.xml`, `robots.txt`, favicon set.

## 7. Non-goals (do NOT build)
Online payments, user accounts, blog, CMS, chatbot, newsletter popups, cookie banners (no tracking), animated loaders/preloaders, dark-mode toggle, language switcher (v1).

## 8. Acceptance criteria
- Lighthouse (mobile): Performance ≥ 90, Accessibility ≥ 95, Best Practices ≥ 95, SEO ≥ 95.
- Works at 360px, 768px, 1280px, 1920px with no horizontal scroll.
- Every booking entry point produces a correct, readable WhatsApp message (test with name containing spaces, `&`, Odia/Hindi characters, emoji).
- Keyboard-only user can book a service and operate the gallery lightbox.
- Zero console errors. Zero broken links. Zero lorem ipsum. Zero fake testimonials.
- Changing phone numbers, services, branches, or gallery items requires editing **only files in `data/`**.
- Passes the **Anti-Slop Checklist** in `DESIGN.md`.

## 9. Inputs the owner must supply (agent: use clearly marked placeholders until given)
- Real WhatsApp number(s) per branch, addresses, hours, Google Maps links
- Logo (if any) — else use the typographic wordmark
- 20–40 real photos (see `DESIGN.md` → Imagery)
- Real reviews, years of experience, artist name(s), Instagram handle
- Price policy: show "from ₹X" or "Price on request"
