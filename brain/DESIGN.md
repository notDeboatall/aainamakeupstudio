# DESIGN — Aaina Makeup Studio

## 1. Concept: "The Cover"
The site is a fashion magazine.
- **Home hero = magazine cover.** Giant masthead wordmark, a cover image, "cover lines" (services) around it.
- **Services = Contents / Index** (numbered 01–06, hairline rules).
- **Gallery = The Lookbook.**
- **Studios = Stockists / Where to find us.**
- "Aaina" = mirror → use the mirror idea sparingly: a thin vertical-ellipse frame (mirror shape) as image mask in ONE or TWO places only (e.g., about portrait). Do not scatter it everywhere.

Tone: confident, editorial, warm. Sharp edges, big type, lots of air, one accent colour.

## 2. Colour tokens
```css
:root {
  --ink:      #0F0E0D;  /* near-black, text + dark sections */
  --paper:    #F3EEE6;  /* warm off-white page bg */
  --bone:     #E6DECF;  /* alt section bg, cards */
  --sindoor:  #C1121F;  /* THE accent: CTAs, small marks, hovers. */
  --muted:    #6A635A;  /* secondary text (check contrast ≥ 4.5:1 on paper) */
  --line:     rgba(15,14,13,.18); /* hairlines on paper */
  --line-inv: rgba(243,238,230,.22); /* hairlines on ink */
}
```
Rules:
- Max **one accent** (sindoor). No gold gradients, no purple, no teal, no pastel pink.
- Sindoor never used as a large background except the final CTA band (optional, once).
- Dark (ink) sections alternate with paper sections. No grey cards on grey.

## 3. Typography
| Role | Font | Notes |
|---|---|---|
| Display | **Bodoni Moda** (Google Fonts) weights 500–900, plus italic | High-contrast Didone = Vogue energy. Fallback: `"Bodoni 72", Didot, "Playfair Display", serif` |
| Text / UI | **Hanken Grotesk** 400/500/600 | Neutral grotesque. Fallback: `system-ui, sans-serif` |

```
Masthead (AAINA)  clamp(5rem, 22vw, 20rem)  weight 800, line-height .8, letter-spacing -0.04em, uppercase
H1                clamp(2.75rem, 8vw, 7rem)   weight 700, line-height .92, tracking -0.025em
H2                clamp(2rem, 5vw, 4rem)      weight 700, line-height 1
H3 (card titles)  1.5–2rem                     weight 600
Italic accent     Bodoni italic for ONE word per heading max (e.g., "Look like the *mirror* agrees.")
Body              1rem–1.125rem / 1.6, max-width 62ch
Label/eyebrow     .72rem, uppercase, letter-spacing .2em, weight 600, Hanken
Numbers (01–06)   Bodoni, large, sindoor or ink
```
- Load with `<link rel="preconnect">` + `display=swap`. Only request the weights used.
- Make sure the Google Fonts URL loads the opsz axis on every page: `family=Bodoni+Moda:ital,opsz,wght@0,6..96,500..900;1,6..96,500..900`.
- No more than 2 font families. No font-weight below 400.

### Hairline fix for Didone display font (Sitewide Rule)
At large display sizes, Bodoni Moda's extreme Didone contrast can cause hairlines to drop out or appear faint if optical sizing is allowed to auto-scale.
- **Universal optical sizing fix**: Sitewide display typography explicitly applies `font-family: var(--font-display); font-optical-sizing: none; font-variation-settings: "opsz" var(--display-opsz);` (defined `--display-opsz: 14` in `tokens.css`).
- Applied consistently across all pages and components: headings `h1–h6`, `.h1–.h4`, `.masthead`, `.numeral`, `blockquote`, `.review-quote`, `.site-header__wordmark`, `.mobile-nav__link`, `.site-footer__masthead`, `.site-footer__col-title`, `.booking-sheet__title`, `.lightbox__caption-title`, `.carousel__caption-title`, `.studio-card__num`, `.studio-card__name`, `.studio-tab__num`, `.studio-tab__name`, `.service-row__num`, `.service-row__title`, `.faq-item summary`, and `.page-404__numeral`.
- **Hairline stroke protection**: `-webkit-text-stroke: 0.012em currentColor;` and eased negative tracking (`letter-spacing: -0.02em`) applied to `.masthead`, `.hero-cover__masthead`, `.site-footer__masthead`, and `.site-header__wordmark` across all pages.
- Standardized weights: 750–800 on primary headings/mastheads, 700 on secondary headings/titles/summaries, 500 on review quotes. Zero hairline dropouts across 360px–1920px viewports.

## 4. Layout
- 12-col grid, max content width **1320px**, side padding `clamp(16px, 4vw, 48px)`.
- Spacing scale (rem): 0.25, 0.5, 1, 1.5, 2, 3, 4.5, 6.5, 9. Sections use 6.5–9 vertical on desktop, 4.5 on mobile.
- **Asymmetric** compositions: text column offset, images bleeding off grid, overlap cover lines on images. Don't centre everything.
- Hairline rules (`1px solid var(--line)`) as the main structural device instead of boxes + shadows.
- **Border radius: 0** everywhere (buttons, cards, inputs, modals). Exception: the mirror-oval mask.
- **No box-shadows** except a single hard offset on the booking sheet (`8px 8px 0 var(--ink)`) if needed.

## 5. Components
### Header
Sticky, paper bg with bottom hairline. Left: wordmark "Aaina" (Bodoni 800) + tiny "Makeup Studio". Right: nav (Home, Services, Lookbook, Studios) + **Book** button (ink bg, paper text, sindoor on hover). Mobile: full-screen menu with giant Bodoni links, close button, `aria-expanded` handled.

### Buttons
- Primary: ink bg, paper text, uppercase label style, padding 1rem 1.75rem, arrow `→` (plain text char or inline SVG), hover → sindoor bg.
- WhatsApp CTA: same shape, small WhatsApp glyph (inline SVG, monochrome). Do **not** use WhatsApp green blocks.
- Text link: uppercase label, 1px underline offset 6px, hover underline thickens.

### Service row (Index)
Full-width row: `01` numeral | Service name (H3, Bodoni) | one-line description | "from ₹X / on request" | **Book →**. Hairline between rows. Hover: row bg → bone, image preview follows pointer on desktop (optional, progressive enhancement). On mobile: stacked, image on top.

### Gallery card
Aspect ratios vary (3:4, 4:5, 1:1, 16:10). Unified single-card structure: image full-bleed with caption flush at bottom inside the same card, sharing identical background (no floating paper strip on bone background, caption width matching card). Caption in label style: `BRIDAL — Odia Wedding, 2025`. Hover: image scale 1.03 (slow), caption underline. No rounded corners, no glass overlays.

### Lookbook 3D Coverflow Carousel (Home teaser)
- Front-view shallow 3D arc / rotating ring seen from the front.
- Active card is centre, large, flat to viewer. Neighbours step off to each side, rotated inward (`rotateY`), pushed back in depth (`translateZ` negative), scaled down, and dimmed by a flat ink overlay (`opacity` increasing with distance).
- Pure CSS 3D transforms powered by two JS variables per card: `--o` (signed circular offset from active) and `--a` (absolute offset).
  `transform: translateX(calc(var(--o) * var(--step))) translateZ(calc(var(--a) * var(--depth) * -1)) rotateY(calc(var(--o) * var(--angle) * -1)) scale(calc(1 - var(--a) * .08));`
- Stage perspective: 1400px, `transform-style: preserve-3d`. Shows 5 cards on desktop (centre + 2 each side), 3 on tablet/mobile with tighter depth and angle. Cards with `|offset| > 2` are `opacity: 0; pointer-events: none`.
- Uniform card dimensions: `aspect-ratio: 3/4` (width 300–340px desktop, ~68vw mobile), `object-fit: cover`, 1px hairline border, radius 0.
- Active-item caption below stage (`aria-live="polite"`): category (sindoor label), title, year, and "Book this look →" button (delegating to booking sheet). 200ms opacity cross-fade on change.
- Controls: "Prev" / "Next" text buttons, counter "02 / 06", and visible "Pause" / "Play" text button.
- Autoplay (5s): pauses on hover, focus, touch, tab visibility hidden, or off-screen via IntersectionObserver.
- Touch/Pointer: drag/swipe with 40px threshold (`touch-action: pan-y`). Keyboard: Left/Right arrows, Home/End. Click side card to center; click center card to open lightbox.
- Reduced motion & No-JS fallback: flat horizontal scroll-snap row (no 3D tilt, no autoplay).

### Lightbox
Ink 96% bg, image centred, caption + category left bottom, "Book this look" right bottom, close/prev/next as text buttons ("Close", "Prev", "Next"). Focus trap, restore focus on close.

### Booking sheet
Desktop: right-side panel 480px or centred modal. Mobile: bottom sheet. Fields have bottom-border only (no boxes). Labels above in label style. Primary button full width. Shows live **message preview** under the form (builds trust).

### Branch panel
Left: list of branches as big numbered text tabs (`01 Bhubaneswar`). Right: panel with address, hours table (hairlines), buttons, then map (aspect 16:10, grayscale filter `grayscale(1) contrast(1.05)` → colour on hover/focus), lazy.

### Reviews
Large Bodoni pull-quote, name in label style, source ("Google"/"Instagram"). One at a time carousel with Prev/Next text buttons OR a static 2-col layout. No star-emoji spam; use text "5/5".

### Footer
Ink bg. Huge masthead "Aaina" cropped at bottom. Columns: Studios (with phone each), Pages, Social. Small print: © year. No newsletter box.

## 6. Motion
- Allowed: fade-up on scroll (opacity + translateY 16px, 600ms, cubic-bezier(.2,.7,.2,1)), image slow scale on hover, header hide-on-scroll-down/show-on-up, masthead letters stagger on first load (≤ 700ms total).
- Use `IntersectionObserver`. Respect `prefers-reduced-motion: reduce` (disable all of the above).
- Forbidden: parallax libraries, cursor followers, marquee spam, bouncing arrows, confetti, preloader, tilt effects.

## 7. Imagery
- **Real photos only.** No AI-generated faces. No hotlinked stock. If a photo is missing, render a solid `--bone` block with the category label and the text "Photo coming soon" — never a fake person.
- Treat all photos consistently: same tonal feel (warm, slightly high contrast). Don't apply CSS filters to faces except the optional map grayscale.
- Format: **WebP** (JPG fallback not required), long edge ≤ 1600px, ≤ 250KB each; thumbs at 600px in `assets/img/gallery/thumbs/`.
- Naming: `category-descriptor-01.webp` e.g. `bridal-odia-red-01.webp`.
- Every `<img>` has meaningful `alt`, `width`, `height`, `loading="lazy"` (except the hero: `fetchpriority="high"`).
- Hero: portrait-oriented cover image; crop with `object-fit: cover` + `object-position` set per image in data.

## 8. Accessibility
- Contrast AA minimum. Visible focus ring: `outline: 2px solid var(--sindoor); outline-offset: 3px`.
- Semantic landmarks (`header, nav, main, section, footer`), one `h1` per page, logical heading order.
- Skip link. All interactive elements are real `<button>`/`<a>`. Modal: `role="dialog"`, `aria-modal`, labelled, focus trap, Esc closes.
- Tap targets ≥ 44px.

## 9. ANTI-SLOP CHECKLIST (agent must verify before every "done")
- [ ] No purple/blue gradients, no glassmorphism, no blurred blobs, no neon glow
- [ ] No emoji used as icons (✨💄💍). No icon-in-a-circle feature grids
- [ ] No "three equal cards with icon + title + 2 lines" section
- [ ] No fully-centred hero with a pill badge above the headline
- [ ] No rounded-2xl cards with soft drop shadows
- [ ] No generic copy: "Welcome to", "Elevate your look", "Unleash your inner glow", "Seamless", "Crafted with love", "Where beauty meets…", "Your journey"
- [ ] No fake stats ("10,000+ happy clients") or fake testimonials
- [ ] No lorem ipsum, no "Image 1", no placeholder.com/unsplash hotlinks
- [ ] No more than one accent colour; no more than two font families
- [ ] Headline type is large, tight, and the page has clear asymmetry
- [ ] Section order and layout feels *different* from the typical hero → 3 features → testimonials → CTA stack
- [ ] Every section has a reason to exist and ends with an action or a link
