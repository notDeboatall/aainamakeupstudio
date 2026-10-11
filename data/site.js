/**
 * data/site.js — Brand & Global Site Configuration
 * Aaina Makeup Studio
 * Note: Placeholders marked with [[ ]] require owner confirmation.
 */
window.AAINA = window.AAINA || {};

window.AAINA.site = {
  name: "Aaina Makeup Studio",
  short: "Aaina",
  meaning: "Aaina means mirror.",
  tagline: "Look like the mirror agrees.",
  region: "Odisha",
  citiesPlaceholder: "Bhubaneswar",
  cities: [
    "Bhubaneswar"
  ],
  founder: "[[Name]]",
  baseUrl: "https://notDeboatall.github.io/aainamakeupstudio/",
  defaultWhatsApp: "[[91XXXXXXXXXX]]", // Digits only, country code 91, placeholder
  defaultPhoneFormatted: "[[+91 XXXXX XXXXX]]",
  instagram: "https://instagram.com/[[HANDLE]]",
  instagramHandle: "[[@handle]]",
  headerCta: "Book",
  footerText: "Aaina Makeup Studio — Odisha.",
  copyrightYear: 2026,
  nav: [
    { label: "Home", href: "index.html" },
    { label: "Services", href: "services.html" },
    { label: "Lookbook", href: "gallery.html" },
    { label: "Studios", href: "studios.html" }
  ],

  /* Hero "The Cover" configuration (DESIGN §1, §5, CONTENT §Cover) */
  hero: {
    autoplayMs: 6500,
    issues: [
      {
        id: "bridal",
        label: "01 Bridal",
        eyebrow: "The Bridal Issue · Vol. 01",
        theme: "paper",
        image: "assets/img/hero/cover-01.webp",
        width: 933,
        height: 1400,
        alt: "Editorial bridal beauty portrait with Sambalpuri drape, silver choker and traditional crimson accents",
        callouts: [
          { label: "Bridal — the full look →", href: "services.html#service-bridal", x: 38, y: 65, side: "left" },
          { label: "Reception & Engagement →", href: "services.html#service-reception", x: 74, y: 62, side: "right" },
          { label: "Hair & Saree draping →", href: "services.html#service-hair-saree", x: 90, y: 38, side: "right" }
        ]
      },
      {
        id: "editorial",
        label: "02 Editorial",
        eyebrow: "The Editorial Issue · Vol. 02",
        theme: "ink",
        image: "assets/img/hero/cover-02.webp",
        width: 933,
        height: 1400,
        alt: "Contemporary editorial photoshoot portrait with graphic eyeliner, bold lip and silver statement earrings",
        callouts: [
          { label: "Editorial & Photoshoot →", href: "services.html#service-editorial", x: 32, y: 74, side: "left" },
          { label: "Party Glam →", href: "services.html#service-party", x: 92, y: 50, side: "right" },
          { label: "Hair & Saree draping →", href: "services.html#service-hair-saree", x: 92, y: 36, side: "right" }
        ]
      }
    ]
  },
  heroImage: "assets/img/hero/cover-01.webp",
  heroImageAlt: "assets/img/hero/cover-02.webp",
  heroAltText: "Editorial bridal portrait with refined complexion and traditional accents",
  heroRatio: "933/1400",
  heroWidth: 933,
  heroHeight: 1400,

  /* About / Statement / Social assets */
  images: {
    detailsBrushes: {
      src: "assets/img/about/details-brushes.webp",
      ratio: "4/5",
      width: 1200,
      height: 1500,
      label: "DETAIL",
      title: "Sanitized professional brush suite",
      alt: "Professional studio brush suite, photo coming soon",
      placeholder: true
    },
    detailsHands: {
      src: "assets/img/about/details-hands.webp",
      ratio: "1/1",
      width: 1200,
      height: 1200,
      label: "DETAIL",
      title: "Precision undertone matching",
      alt: "Hands preparing skin tone match, photo coming soon",
      placeholder: true
    },
    artistPortrait: {
      src: "assets/img/about/artist-portrait.webp",
      ratio: "3/4",
      width: 1200,
      height: 1600,
      label: "ARTIST",
      title: "Lead Artist & Founder [[Name]]",
      alt: "Lead artist portrait, photo coming soon",
      placeholder: true
    },
    ogImage: "assets/img/og/og-default.png"
  }
};
