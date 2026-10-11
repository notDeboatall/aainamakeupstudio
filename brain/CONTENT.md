# CONTENT — Aaina Makeup Studio

> All copy lives here first, then goes into `data/*.js` or the HTML.
> `[[DOUBLE BRACKETS]]` = owner must supply. Agent: keep the marker visible in the UI during dev (so nothing ships by accident) and list every open marker in `MEMORY.md`.
> Voice: direct, warm, confident. Short sentences. Occasional Odia/Hindi word is fine, never forced. No hype words (see DESIGN.md anti-slop list).

## Brand
- Name: **Aaina Makeup Studio**
- Meaning: *Aaina* = mirror.
- Region line: **Odisha**
- Tagline options (use #1 unless owner picks another):
  1. **Look like the mirror agrees.**
  2. Your face. Your day. Done right.
  3. Makeup, made for your skin and your occasion.
- Instagram: [[@handle]]  ·  Founder/lead artist: [[Name]]  ·  Since: [[Year]]

## Global
- Header nav: Home · Services · Lookbook · Studios
- Header CTA: **Book**
- Footer line: *Aaina Makeup Studio — Odisha.*
- Skip link: "Skip to content"

## Home (`index.html`)
### Cover (hero)
- Masthead: **AAINA**
- Sub-masthead (label style): `MAKEUP STUDIO · BHUBANESWAR · ODISHA`
- H1: **Look like the *mirror* agrees.**
- Support: "Bridal, party and editorial makeup by artists who read your skin tone, your outfit and your lighting before they pick up a brush."
- Primary CTA: **Book on WhatsApp →** (opens booking sheet)
- Secondary link: "See the lookbook"
- Cover lines (placed around image, link to services): `Bridal — the full look` · `Reception & Engagement` · `Party Glam` · `Photoshoot / Editorial`

### Index (services)
- Eyebrow: `THE INDEX`
- H2: "What we do."
- Rows 01–06 from `data/services.js`. Link: "All services →"

### Lookbook teaser
- Eyebrow: `THE LOOKBOOK`
- H2: "Recent faces."
- 6 featured cards (`featured: true`). Link: "Open the full lookbook →"

### Studio statement (dark band)
- Eyebrow: `WHY AAINA`
- H2: "A mirror doesn't flatter. We don't either."
- Body: "We match tone, undertone and finish to your skin, not to a trend. You'll see the look on your own face in a trial before the day, and leave with notes for touch-ups."
- Three plain facts (typographic list, NOT cards) — replace with real ones:
  - `Trial before every bridal booking` [[confirm]]
  - `Skin-prep and HD / airbrush options` [[confirm]]
  - `Artists travel for weddings across Odisha` [[confirm]]

### Studios teaser
- Eyebrow: `FIND US`
- H2: "Two studios in Bhubaneswar."
- Compact list: Lewis Road & Gudiapokhari, "Open on map", "WhatsApp". Link: "Studio details →"

### Reviews (hide section if no real reviews)
- Eyebrow: `IN THEIR WORDS`
- Source each review: name + Google/Instagram + month/year, with the owner's permission.

### Final CTA
- H2: "Tell us the date. We'll hold the chair."
- CTA: **Message us on WhatsApp →**

## Services (`services.html`)
- H1: "Services."
- Intro: "Pick what you need. We'll reply on WhatsApp with availability, the artist, and pricing for your date. A trial is recommended for brides."
- Price note: "Prices depend on look, products and location. Share your date and we'll quote." (If owner gives prices, show `from ₹X`.)

### Service list (seed data; owner edits)
| # | id | Name | One-liner | Price | Duration |
|---|---|---|---|---|---|
| 01 | `bridal` | Bridal Makeup | Full wedding look: skin prep, makeup, hair and draping. Trial included. | [[from ₹]] | [[3–4 hrs]] |
| 02 | `reception` | Reception & Engagement | A second, different look for the evening — glossier, sharper, camera-ready. | [[from ₹]] | [[2–3 hrs]] |
| 03 | `party` | Party Glam | Festive, sangeet, birthday, cocktail. Lasts the whole night. | [[from ₹]] | [[1.5–2 hrs]] |
| 04 | `editorial` | Photoshoot & Editorial | Makeup for portfolios, brands and shoots. Built for lenses and lights. | [[from ₹]] | [[2–3 hrs]] |
| 05 | `everyday` | Everyday & Occasion | Natural, skin-first makeup for interviews, pujas and family functions. | [[from ₹]] | [[1 hr]] |
| 06 | `hair-saree` | Hair & Saree Draping | Hairstyling and draping, alone or with makeup. | [[from ₹]] | [[1 hr]] |
Optional later: Makeup Classes, Mehendi, Groom Grooming.

Each service also has `whatsappVerb`: how the service reads inside the message (e.g., "Bridal Makeup").

## Booking sheet
- Title: "Book on WhatsApp"
- Sub: "Fill this in. We'll open WhatsApp with your message ready to send."
- Fields: Your name* · Studio* · Preferred date · Anything we should know?
- Preview label: "Your message"
- Button: **Open WhatsApp →**
- Footer note: "Nothing is sent until you press send in WhatsApp."
- Errors: "Please add your name." · "Please choose a studio."

### WhatsApp message template (exact)
```
Hello Aaina Makeup Studio 👋
I'm {name}. I'd like to book *{service}* at your {branch} studio.
📅 Preferred date: {date | "Not decided yet"}
📝 Note: {note | "—"}
(Sent from the website)
```
Rules: `{service}` uses the display name. Omit the date/note lines when empty. Use `encodeURIComponent` on the whole string. Line breaks as `\n`. Emoji allowed only inside the WhatsApp message (not the website UI).

Gallery variant: add line `Look reference: {caption} (lookbook)`.

## Lookbook (`gallery.html`)
- H1: "The Lookbook."
- Intro: "Real clients, real days. Tap a look to see it larger, or book something like it."
- Filters: All · Bridal · Reception · Party · Editorial · Everyday · Hair & Saree
- Empty state: "Nothing here yet. Check another category."
- Card caption format: `{CATEGORY} — {title}`; lightbox caption adds `{year}` and optional `{credit}` (photographer).
- Lightbox CTA: **Book this look →**

### Gallery item schema (see ARCHITECTURE.md)
Seed with 12 placeholder entries marked `photo coming soon` until real images exist.

## Studios (`studios.html`)
- H1: "Studios."
- Intro: "Walk in or message first. Weddings and parties are by appointment."
- Branch seed (2 branches in Bhubaneswar):
  1. **Lewis Road** (area: Kedargauri) — Plot No. 2855, Vivekananda Ladies Hostel, Lewis Road, Kedargauri Resort, Bhubaneswar 751014 — Hours [[Mon–Sun 10:00–20:00]] — Phone [[+91 XXXXX XXXXX]] — WhatsApp [[91XXXXXXXXXX]] — Maps: https://www.google.com/maps/search/?api=1&query=20.2413022,85.8412355
  2. **Gudiapokhari** (area: Gudiapokhari) — Gudiapokhari, Bhubaneswar [[full address + pin code]] — Hours [[Mon–Sun 10:00–20:00]] — Phone [[+91 XXXXX XXXXX]] — WhatsApp [[91XXXXXXXXXX]] — Maps: https://www.google.com/maps/search/?api=1&query=20.1664124,85.8605194
- Buttons per panel: **Get directions** · **WhatsApp this studio** · **Call**
- Note under map: "Parking: [[info]]" (optional)

## Reviews seed (`data/reviews.js`)
Empty array until the owner provides real ones. Fields: `quote, name, service, source, date`.

## FAQ (short, on Services page bottom — real answers by owner)
- Do you travel for weddings? [[answer]]
- How early should I book? [[answer]]
- Do you use HD/airbrush? [[answer]]
- What products do you use? [[answer]]
- Do you offer a trial? [[answer]]
- How is payment/advance handled? [[answer]]
Use native `<details>/<summary>`; no JS needed.

## SEO copy
| Page | Title (≤ 60) | Description (≤ 155) |
|---|---|---|
| Home | Aaina Makeup Studio — Bridal & Party Makeup in Odisha | Bridal, party and editorial makeup at Aaina Makeup Studio in Bhubaneswar. Book your date on WhatsApp. |
| Services | Makeup Services & Booking — Aaina Makeup Studio | Bridal, reception, party, editorial and everyday makeup, plus hair and saree draping. Book on WhatsApp. |
| Lookbook | Makeup Lookbook — Aaina Makeup Studio | Browse bridal, party and editorial looks by Aaina Makeup Studio in Odisha. |
| Studios | Studios & Locations — Aaina Makeup Studio | Find Aaina Makeup Studio in Bhubaneswar: Lewis Road and Gudiapokhari studios, addresses, directions and WhatsApp. |

## 404
- H1: "This page left early."
- Body: "Let's get you back." Links: Home · Services · Studios
