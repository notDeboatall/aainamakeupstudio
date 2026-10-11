# ARCHITECTURE — Aaina Makeup Studio

## 1. Principles
- Static site. Zero build step. Open `index.html` → it works. Push to GitHub → Pages serves it.
- **Data-driven:** content in `data/*.js`; HTML/JS renders it. Owner edits data, never markup.
- **Progressive enhancement:** key content (service names, branch addresses, WhatsApp/phone links) must exist in the HTML or be rendered before first paint; core links work even if JS fails (`<a href="https://wa.me/...">` fallbacks).
- Relative paths only (`./css/…`, not `/css/…`) so it works under `https://user.github.io/repo/`.
- Data in plain `<script>` globals (not `fetch('x.json')`, not ES modules) so `file://` works.
- Scripts loaded with `defer`. JS in small single-purpose files, each wrapped in an IIFE and reading from `window.AAINA`.

## 2. Folder structure
```
aaina-makeup-studio/
├─ brain/                      # project brain (this folder) — never deployed logic, safe to keep
│  ├─ PRD.md  DESIGN.md  CONTENT.md  ARCHITECTURE.md
│  ├─ RULES.md  TASKS.md  MEMORY.md  MASTER_PROMPT.md
├─ index.html
├─ services.html
├─ gallery.html
├─ studios.html
├─ 404.html
├─ robots.txt
├─ sitemap.xml
├─ .nojekyll                   # tells GitHub Pages to skip Jekyll processing
├─ README.md                   # how to edit data + deploy (owner-friendly)
├─ css/
│  ├─ tokens.css               # :root variables only
│  ├─ base.css                 # reset, typography, layout primitives, utilities
│  ├─ components.css           # header, buttons, rows, cards, sheet, lightbox, footer
│  └─ pages.css                # page-specific rules (home cover, studios, gallery grid)
├─ js/
│  ├─ core.js                  # helpers: $, $$, el(), escapeHTML(), basePath, reduced-motion flag
│  ├─ layout.js                # injects shared header/footer from data; mobile menu; active link; scroll behaviours
│  ├─ whatsapp.js              # buildMessage(), buildLink(), openWhatsApp()
│  ├─ booking.js               # booking sheet UI (dialog), preview, validation, localStorage name
│  ├─ services.js              # renders service rows (home index + services page)
│  ├─ carousel.js              # renders 3D coverflow carousel on Home (#lookbook-carousel)
│  ├─ gallery.js               # renders cards, filter, hash deep-link, lightbox
│  ├─ studios.js               # renders branch tabs/panels, lazy map
│  ├─ reviews.js               # renders reviews or hides section
│  └─ reveal.js                # IntersectionObserver fade-ups
├─ data/
│  ├─ site.js                  # brand, nav, social, default WhatsApp, SEO base URL
│  ├─ services.js
│  ├─ branches.js
│  ├─ gallery.js
│  └─ reviews.js
└─ assets/
   ├─ img/
   │  ├─ hero/                 # cover image(s)
   │  ├─ gallery/              # full (≤1600px) + thumbs/ (600px)
   │  ├─ about/
   │  └─ og/                   # og-default.jpg 1200×630
   ├─ icons/                   # favicon.svg, favicon.ico, apple-touch-icon.png, whatsapp.svg, etc.
   └─ fonts/                   # (optional) self-hosted woff2 if owner prefers no Google Fonts
```
Header/footer: to avoid copy-pasting into 5 pages, `layout.js` injects them into `<header id="site-header"></header>` / `<footer id="site-footer"></footer>`. Add a `<noscript>` minimal nav fallback in each page.

## 3. Data schemas
Each file assigns to a single global namespace:
```js
window.AAINA = window.AAINA || {};
window.AAINA.site = { ... };
```

### `data/site.js`
```js
window.AAINA.site = {
  name: "Aaina Makeup Studio",
  short: "Aaina",
  tagline: "Look like the mirror agrees.",
  baseUrl: "https://notDeboatall.github.io/aainamakeupstudio/",   // used for canonical/OG/sitemap (update on deploy)
  defaultWhatsApp: "91XXXXXXXXXX",               // digits only, country code, no +
  instagram: "https://instagram.com/HANDLE",
  nav: [
    { label: "Home", href: "index.html" },
    { label: "Services", href: "services.html" },
    { label: "Lookbook", href: "gallery.html" },
    { label: "Studios", href: "studios.html" }
  ]
};
```

### `data/services.js`
```js
window.AAINA.services = [
  {
    id: "bridal",
    order: 1,
    name: "Bridal Makeup",
    blurb: "Full wedding look: skin prep, makeup, hair and draping. Trial included.",
    priceFrom: null,           // number or null → null renders "Price on request"
    duration: "3–4 hrs",
    image: "assets/img/gallery/bridal-01.webp",   // optional
    featured: true
  }
  // …
];
```

### `data/branches.js`
```js
window.AAINA.branches = [
  {
    id: "lewis-road",
    name: "Lewis Road",
    area: "Kedargauri",
    address: "Plot No. 2855, Vivekananda Ladies Hostel, Lewis Road, Kedargauri Resort, Bhubaneswar 751014",
    lat: 20.2413022, lng: 85.8412355,
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=20.2413022,85.8412355",
    mapEmbed: "https://maps.google.com/maps?q=20.2413022,85.8412355&z=16&output=embed",
    image: "assets/img/about/branch-lewis-road.webp",
    phone: "[[+91 XXXXX XXXXX]]",
    whatsapp: "[[91XXXXXXXXXX]]",
    hours: [
      { days: "Mon–Sat", time: "10:00 – 20:00 [[confirm]]" },
      { days: "Sun", time: "By appointment [[confirm]]" }
    ]
  },
  {
    id: "gudiapokhari",
    name: "Gudiapokhari",
    area: "Gudiapokhari",
    address: "Gudiapokhari, Bhubaneswar [[full address + pin code]]",
    lat: 20.1664124, lng: 85.8605194,
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=20.1664124,85.8605194",
    mapEmbed: "https://maps.google.com/maps?q=20.1664124,85.8605194&z=16&output=embed",
    image: "assets/img/about/branch-gudiapokhari.webp",
    phone: "[[+91 XXXXX XXXXX]]",
    whatsapp: "[[91XXXXXXXXXX]]",
    hours: [
      { days: "Mon–Sat", time: "10:00 – 20:00 [[confirm]]" },
      { days: "Sun", time: "By appointment [[confirm]]" }
    ]
  }
  // Exactly 2 branches in Bhubaneswar. Adding more works with no code changes.
];
```

### `data/gallery.js`
```js
window.AAINA.gallery = [
  {
    id: "g001",
    category: "bridal",                // must match a service id or a defined category
    title: "Odia bridal, red & gold",
    year: 2025,
    src: "assets/img/gallery/bridal-odia-red-01.webp",
    thumb: "assets/img/gallery/thumbs/bridal-odia-red-01.webp",
    width: 1200, height: 1600,
    alt: "Bride in red Sambalpuri saree with gold jewellery, classic red lip",
    ratio: "3/4",                      // card hint: "3/4" | "4/5" | "1/1" | "16/10"
    featured: true,
    credit: "Photo: [[name]]"          // optional
  }
];
```
`gallery.js` also exports category list (order + labels):
```js
window.AAINA.galleryCategories = [
  { id: "all", label: "All" },
  { id: "bridal", label: "Bridal" }, { id: "reception", label: "Reception" },
  { id: "party", label: "Party" }, { id: "editorial", label: "Editorial" },
  { id: "everyday", label: "Everyday" }, { id: "hair-saree", label: "Hair & Saree" }
];
```

### `data/reviews.js`
```js
window.AAINA.reviews = [
  { quote: "…", name: "…", service: "bridal", source: "Google", date: "2025-11" }
];
```

## 4. Module contracts
### `whatsapp.js`
```js
// Public API
AAINA.whatsapp.buildMessage({ name, service, branch, date, note, reference }) → string
AAINA.whatsapp.buildLink({ number, message }) → "https://wa.me/<number>?text=<encoded>"
AAINA.whatsapp.open(payload) → opens link with window.open(url, "_blank", "noopener")
```
- `number` = branch.whatsapp || site.defaultWhatsApp, digits only (strip `+`, spaces, dashes).
- Message template: see `CONTENT.md`.
- Mobile fallback: if `window.open` returns null (popup blocked), set `location.href = url`.

### `booking.js`
- Uses native `<dialog>` (with `showModal()`), styled as side panel (desktop) / bottom sheet (mobile). Polyfill-free: if `dialog` unsupported, fall back to a div with `role="dialog"` and manual focus trap.
- Global trigger: any element with `data-book` attribute opens it. Optional attributes: `data-service="bridal"`, `data-branch="bhubaneswar"`, `data-reference="Odia bridal, red & gold"`.
- Event delegation on `document` so dynamically-rendered cards/rows work.
- Emits `CustomEvent("aaina:booking:open")`/`close`.
- Live preview updates on `input`.
- Validation: name required (trim, ≥ 2 chars), branch required.

### `gallery.js`
- Reads `AAINA.gallery`, renders cards with `DocumentFragment`.
- Layout: CSS grid with `grid-auto-flow: dense` + per-card span classes from `ratio` (NOT JS masonry). 2 cols mobile, 3 tablet, 4 desktop.
- Filter state in `location.hash` (`#bridal`); `hashchange` listener.
- Lightbox: preload neighbours, swipe (pointer events), arrows/Esc, focus trap, `aria-live` caption.
- Escape all data before inserting HTML; prefer `createElement`/`textContent`.

### `carousel.js`
- Mounts to `#lookbook-carousel` on `index.html`.
- Filters `window.AAINA.gallery` for `featured: true && !placeholder`. Supports 3–12 items.
- Dynamic 3D coverflow carousel with continuous circular wrapping.
- Updates CSS variables `--o` (signed offset) and `--a` (absolute offset) per card.
- Renders active-item caption below stage with `aria-live="polite"`, "Book this look →" button delegation.
- Handles touch/mouse drag-swipe, keyboard arrows, 5s autoplay with hover/focus/visibility pause, and reduced-motion/no-JS flat scroll-snap fallback.

### `studios.js`
- Renders tabs (`role="tablist"`) + panels (`role="tabpanel"`). Arrow-key nav between tabs.
- Map iframe `src` set only when the panel first opens (lazy). `loading="lazy"`, `title` attribute, `referrerpolicy="no-referrer-when-downgrade"`.
- URL hash `#bhubaneswar` selects branch. Home page teaser links with those hashes.

### `layout.js`
- Builds header/footer from `AAINA.site` + `AAINA.branches`, marks current page `aria-current="page"`.
- Mobile menu toggle, scroll lock, Esc to close.
- Header hide-on-scroll-down (disabled if reduced motion).

## 5. Page skeleton (every page)
```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>…</title>
  <meta name="description" content="…">
  <link rel="canonical" href="…">
  <meta property="og:*" …> <meta name="twitter:card" content="summary_large_image">
  <link rel="icon" href="assets/icons/favicon.svg" type="image/svg+xml">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Bodoni+Moda:ital,opsz,wght@0,6..96,500..900;1,6..96,500..900&family=Hanken+Grotesk:wght@400;500;600&display=swap">
  <link rel="stylesheet" href="css/tokens.css">
  <link rel="stylesheet" href="css/base.css">
  <link rel="stylesheet" href="css/components.css">
  <link rel="stylesheet" href="css/pages.css">
</head>
<body>
  <a class="skip" href="#main">Skip to content</a>
  <header id="site-header"></header>
  <main id="main"> … </main>
  <footer id="site-footer"></footer>
  <dialog id="booking"></dialog>   <!-- built by booking.js -->
  <script defer src="data/site.js"></script> … data files …
  <script defer src="js/core.js"></script> … modules in dependency order …
</body>
</html>
```
Script order: data → core → whatsapp → layout → booking → page modules → reveal.

## 6. SEO / structured data
- `LocalBusiness` (or `BeautySalon`) JSON-LD on Home built at runtime from data **and** a static copy in HTML (crawlers may not run JS).
- `sitemap.xml` lists the 4 pages with `baseUrl`. `robots.txt` references it.
- OG image 1200×630.

## 7. Performance budget
- Total JS ≤ 40KB unminified across all files. CSS ≤ 45KB.
- Hero image ≤ 200KB WebP. Gallery thumbs ≤ 80KB.
- No layout shift (explicit width/height or aspect-ratio).
- Fonts: only needed weights; `font-display: swap`.

## 8. Deployment (GitHub Pages)
1. Repo root = site root (not inside a subfolder), `.nojekyll` present.
2. Settings → Pages → Deploy from branch → `main` / `/ (root)`.
3. Update `site.baseUrl`, canonical URLs, `sitemap.xml`.
4. Optional custom domain: add `CNAME` file; update `baseUrl`.
5. Test on the deployed subpath (all relative links, images, scripts load).

## 9. Browser support
Last 2 versions of Chrome, Safari (iOS 15+), Firefox, Edge, Samsung Internet. Uses: CSS grid, custom properties, `clamp()`, `<dialog>`, IntersectionObserver, `aspect-ratio`, `:focus-visible`.
