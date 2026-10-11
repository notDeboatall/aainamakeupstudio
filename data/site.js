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

  /* Imagery configurations (Image Brief & ASSETS.md) */
  heroImage: "assets/img/hero/cover-01.webp",
  heroImageAlt: "assets/img/hero/cover-02.webp",
  heroAltText: "Editorial bridal portrait with refined complexion and traditional accents",
  heroRatio: "4/5",
  heroWidth: 1200,
  heroHeight: 1500,

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
