# RULES — Non-negotiable

## A. Process rules (how the agent works)
1. **Before any work:** read `PRD.md`, `RULES.md`, `TASKS.md`, `MEMORY.md`. Read `DESIGN.md` / `CONTENT.md` / `ARCHITECTURE.md` whenever touching UI, copy, or structure.
2. **One task at a time** from `TASKS.md`, in order. Don't jump ahead. Don't start a phase without finishing the previous phase's checklist.
3. **After each task:** tick it in `TASKS.md`, append a dated entry to `MEMORY.md` (what changed, decisions, files touched, open issues).
4. **Never silently change** the brain files' decisions. If something must change, propose it in `MEMORY.md` under "Proposed changes", and ask the human.
5. **You may add** new `.md` files or sections in `brain/` if useful (e.g., `QA.md`, `ASSETS.md`), but list them in `MEMORY.md`.
6. **Ask** the human only for things in "Inputs the owner must supply" (PRD §9) or for real conflicts. Otherwise make a sensible choice, record it, and move on.
7. **Verify, don't assume:** open pages in the browser, resize to 360/768/1280, click every CTA, check console. Save screenshots as artifacts if the tool supports it.
8. Keep changes small and reviewable. No massive rewrites of working files without reason.

## B. Tech rules
1. **HTML + CSS + vanilla JS only.** No React/Vue/Svelte/Alpine, no Tailwind/Bootstrap, no jQuery, no npm packages, no bundlers, no TypeScript, no CDN libraries (GSAP, AOS, Swiper, Lightbox libs, etc.).
2. No inline `style=""` except for dynamic values set by JS (e.g., aspect ratio). No inline `onclick`. No `!important` unless commented why.
3. CSS: custom properties from `tokens.css`; mobile-first; BEM-ish class names (`.card`, `.card__title`, `.card--wide`); logical order (layout → box → type → visual → state). No magic numbers — use the spacing scale.
4. JS: ES2020, `"use strict"`, IIFEs, `const`/`let`, no globals except `window.AAINA`. No `eval`, no `document.write`, no `innerHTML` with unescaped data. Small functions, comments only where intent isn't obvious.
5. All paths relative. No absolute `/…` paths. No `file://`-breaking features (no `fetch` of local JSON, no ES `import`).
6. Every external link to another origin: `rel="noopener noreferrer"` and `target="_blank"` only where it opens WhatsApp/Maps/social.
7. Wrap `localStorage` access in try/catch.
8. Semantic HTML first; ARIA only to fill gaps. Real buttons and links.
9. Images: `alt`, `width`, `height`, `loading="lazy"` (hero eager + `fetchpriority="high"`), WebP.
10. Format: 2-space indent, UTF-8, LF line endings, lowercase kebab-case filenames, no trailing whitespace.

## C. Design rules
1. Follow `DESIGN.md` exactly: tokens, fonts, 0 radius, hairlines, one accent.
2. Run the **Anti-Slop Checklist** (DESIGN §9) before marking any page done.
3. Real photos only; missing photos use the labelled `--bone` placeholder.
4. Copy comes from `CONTENT.md`. Don't invent claims, prices, years, awards, client counts, or reviews.
5. Never use emoji in the website UI. (Emoji allowed only inside the WhatsApp message text.)

## D. Content & trust rules
1. Unknown business facts stay as `[[PLACEHOLDER]]` — visible during dev, tracked in `MEMORY.md`. Before launch they must all be resolved.
2. Phone numbers are stored digits-only for `wa.me` and formatted separately for display.
3. No tracking scripts, pixels, or analytics unless the owner asks (and then only privacy-friendly, with a note in `MEMORY.md`).

## E. Quality gates (a task is NOT done unless…)
- [ ] No console errors/warnings
- [ ] Works at 360 / 768 / 1280 / 1920 widths, no horizontal scroll
- [ ] Keyboard navigable, visible focus, dialog traps focus
- [ ] Booking flow tested with: `Priya Das`, `Ankit & Sons`, `ପ୍ରିୟା`, `Riya 💄`, empty name (blocked), no date, with note
- [ ] Anti-slop checklist ticked
- [ ] `TASKS.md` and `MEMORY.md` updated

## F. Don'ts (quick list)
- Don't add a hamburger-only desktop nav.
- Don't autoplay video/audio. Don't add popups or exit-intent modals.
- Don't use stock-photo placeholders or hotlinked images.
- Don't use `lorem ipsum`.
- Don't center-align long paragraphs.
- Don't use more than 2 font families or more than 1 accent colour.
- Don't hide the WhatsApp/phone/address behind JS-only interactions.
