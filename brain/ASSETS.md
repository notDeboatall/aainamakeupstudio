# ASSETS — Image inventory & placeholder rules

> Source of truth for every image. Update when a placeholder is replaced by a real photo.
> Rule: only use files listed here, from `assets/img/`. Never hotlink, download, or generate other images.

## A. Temporary AI images (12) — provided by owner as `.webp`
| # | Path | Ratio | Used for |
|---|---|---|---|
| 1 | assets/img/hero/cover-01.webp | 4:5 | Home hero (default) |
| 2 | assets/img/hero/cover-02.webp | 4:5 | Alternate hero (`site.heroImageAlt`) |
| 3 | assets/img/gallery/bridal-odia-red-01.webp | 3:4 | Gallery, Bridal service row |
| 4 | assets/img/gallery/bridal-closeup-02.webp | 4:5 | Gallery |
| 5 | assets/img/gallery/bridal-bengali-style-03.webp | 3:4 | Gallery |
| 6 | assets/img/gallery/reception-gown-01.webp | 4:5 | Gallery, Reception service row |
| 7 | assets/img/gallery/reception-saree-02.webp | 3:4 | Gallery |
| 8 | assets/img/gallery/party-glam-01.webp | 1:1 | Gallery, Party service row |
| 9 | assets/img/gallery/party-sangeet-02.webp | 16:10 | Gallery |
| 10 | assets/img/gallery/editorial-bold-lip-01.webp | 4:5 | Gallery, Editorial service row |
| 11 | assets/img/gallery/editorial-graphic-02.webp | 3:4 | Gallery |
| 12 | assets/img/gallery/everyday-natural-01.webp | 1:1 | Gallery, Everyday service row |

## B. Slots 13-20 — NO files exist. The agent builds the placeholders.
Only the 12 photos in section A are supplied. For every other slot the agent must generate a labelled placeholder itself (CSS/JS block or an SVG it creates). Do not wait for files and do not ask me for them.
| # | Slot (future real file) | Ratio | Used for |
|---|---|---|---|
| 13 | assets/img/gallery/hair-saree-draping-01.webp | 3:4 | Hair & Saree service row |
| 14 | assets/img/gallery/hair-braid-02.webp | 4:5 | Hair & Saree (gallery, later) |
| 15 | assets/img/about/branch-lewis-road.webp | 16:10 | Studios panel 1 (Lewis Road, Kedargauri) |
| 16 | assets/img/about/branch-gudiapokhari.webp | 16:10 | Studios panel 2 (Gudiapokhari) |
| 17 | assets/img/about/details-brushes.webp | 4:5 | Home statement band |
| 18 | assets/img/about/details-hands.webp | 1:1 | Home statement band |
| 19 | assets/img/about/artist-portrait.webp | 3:4 | Statement/About, artist name |
| 20 | assets/img/og/og-default.png | 1200x630 | Social share (OG/Twitter) |
Placeholder look: solid var(--bone) block at the slot's aspect ratio, 1px hairline inset border, small sindoor category label top-left (HAIR & SAREE / STUDIO / DETAIL / ARTIST), "Photo coming soon" in Bodoni bottom-left, short description in muted label text. No icons, no emoji, no fake faces.
Mechanism: a single reusable function/component (js/core.js) renders the placeholder when a data entry's `src` is empty or its file fails to load. Data entries keep the future `.webp` path so replacing = dropping the file in, no code change.
OG image: social platforms need PNG/JPG, not SVG. The agent creates assets/img/og/og-default.png (typographic: AAINA wordmark on paper background, 1200x630).

## C. Rules for the agent
1. Gallery entries for #13–14 (Hair & Saree) are added to `data/gallery.js` with `placeholder: true`. Items with `placeholder: true` are **hidden from the public gallery grid and filter bar**, but their image can be used elsewhere (service rows). Remove the flag when the real photo exists, and the Hair & Saree filter appears automatically.
2. Branch images come from `branches[].image`; About/detail/artist images from `data/site.js` → `images`. No hardcoded image paths in HTML.
3. A missing image must never show a broken-image icon: on load failure (JS error listener, no inline onerror) swap in the generated placeholder block.
4. Every image: `alt` (placeholders: "<description> — photo coming soon"), `width`, `height`, `loading="lazy"` (hero eager).
5. Export specs for real photos: WebP, long edge ≤ 1600px, ≤ 250KB; thumbs 600px ≤ 80KB in `gallery/thumbs/`.

## D. Replace-before-launch checklist
- [ ] Hero + all 10 gallery AI images → real client work (with consent)
- [ ] 2 branch interiors (Lewis Road & Gudiapokhari)
- [ ] Artist portrait
- [ ] Detail shots
- [ ] OG image (generated fallback currently active)
- [ ] Hair & Saree photos (then drop `placeholder: true`)
