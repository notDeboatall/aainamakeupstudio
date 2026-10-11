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

  /* Hero "Quiet Cover" configuration (DESIGN §5, CONTENT §Cover, Decision D23) */
  hero: {
    autoplayMs: 9000,
    support: "Bridal, party and editorial makeup in Bhubaneswar, matched to your skin, your outfit and your lighting.",
    issues: [
      {
        id: "bridal",
        eyebrow: "The Bridal Issue · Vol. 01",
        theme: "paper",
        image: "assets/img/hero/cover-01.webp",
        width: 1024,
        height: 1536,
        anchorX: 60.40,
        scale: 1.0,
        offsetY: 0,
        alt: "Editorial bridal beauty portrait with Sambalpuri drape, silver choker and traditional crimson accents"
      }
    ],
    coverLines: [
      { label: "Bridal — the full look", href: "services.html#service-bridal" },
      { label: "Reception & Engagement", href: "services.html#service-reception" },
      { label: "Party Glam", href: "services.html#service-party" },
      { label: "Photoshoot & Editorial", href: "services.html#service-editorial" }
    ]
  },
  heroImage: "assets/img/hero/cover-01.webp",
  heroAltText: "Editorial bridal portrait with refined complexion and traditional accents",
  heroRatio: "1024/1536",
  heroWidth: 1024,
  heroHeight: 1536,

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
