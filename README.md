# Aaina Makeup Studio — Website

A multi-page, mobile-first website for **Aaina Makeup Studio** (Odisha, India).
Built with pure HTML, CSS, and vanilla JavaScript. No build step, no dependencies, no npm.

---

## Quick Start (Local)

1. Open `index.html` directly in any web browser (Chrome, Safari, Edge, Firefox).
2. No local server or build tooling is required — all data is loaded via static global scripts.

---

## Project Structure

```
├── index.html           # Home (Cover, services index, lookbook teaser, studios, reviews, CTA)
├── services.html        # Full services list + WhatsApp booking buttons + FAQ
├── gallery.html         # The Lookbook: dynamic filterable cards + lightbox
├── studios.html         # Studio branch panels (tabs, hours, phone, lazy Google Maps)
├── 404.html             # On-brand not-found page
├── css/
│   ├── tokens.css       # Brand tokens (colors, typography, spacing)
│   ├── base.css         # Reset, typography scale, utilities, skip link
│   ├── components.css   # Header, buttons, cards, booking sheet, lightbox, footer
│   └── pages.css        # Page-specific layouts
├── js/
│   ├── core.js          # DOM utilities & base helpers
│   ├── layout.js        # Shared header/footer injection & mobile nav
│   ├── whatsapp.js      # Formatted WhatsApp link generator
│   ├── booking.js       # Universal WhatsApp booking sheet dialog
│   ├── services.js      # Service rows rendering
│   ├── gallery.js       # Lookbook grid, filtering, deep links, lightbox
│   ├── studios.js       # Branch tabs, panels, directions, maps
│   ├── reviews.js       # Testimonials carousel / display
│   └── reveal.js        # Accessible scroll reveals
├── data/
│   ├── site.js          # Brand metadata, phone numbers, base URL
│   ├── services.js      # Service catalog and pricing
│   ├── branches.js      # Studio branch addresses and map embeds
│   ├── gallery.js       # Lookbook photography items
│   └── reviews.js       # Client reviews
├── assets/
│   ├── img/             # Hero, gallery, studio photography
│   └── icons/           # Favicons, Apple touch icon, SVG icons
└── brain/               # Project documentation, PRD, design specs, task logs
```

---

## How to Edit Site Content (For Studio Owner)

All site content is managed cleanly in the `data/` folder without touching HTML markup:

1. **Update Phone Numbers & Social Links**: Edit `data/site.js`.
2. **Update Services & Pricing**: Edit `data/services.js`.
3. **Update Branches & Hours**: Edit `data/branches.js`.
4. **Add / Replace Lookbook Photos**: Add optimized WebP images to `assets/img/gallery/` and list them in `data/gallery.js`.
5. **Add Customer Reviews**: Edit `data/reviews.js`.

---

## GitHub Pages Deployment

1. Commit all files to your GitHub repository on branch `main`.
2. Go to **Settings > Pages**.
3. Under **Build and deployment > Source**, select **Deploy from a branch**.
4. Choose Branch: `main` and Folder: `/ (root)`.
5. Click **Save**. The site will be live within 1–2 minutes.
