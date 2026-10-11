/**
 * data/services.js — Services Catalog
 * Aaina Makeup Studio
 * Note: Prices default to "Price on request" unless numeric priceFrom is configured.
 * Each service is linked to its representative imagery per Image Brief §4.
 */
window.AAINA = window.AAINA || {};

window.AAINA.services = [
  {
    id: "bridal",
    order: "01",
    name: "Bridal Makeup",
    blurb: "Full wedding look: skin prep, makeup, hair and draping. Trial included.",
    priceFrom: null,
    priceDisplay: "Price on request [[from ₹]]",
    duration: "[[3–4 hrs]]",
    whatsappVerb: "Bridal Makeup",
    featured: true,
    image: "assets/img/gallery/bridal-odia-red-01.webp",
    imageRatio: "3/4",
    imageWidth: 1200,
    imageHeight: 1600,
    imageAlt: "Traditional Odia bride in red Sambalpuri saree with gold jewelry",
    placeholder: false,
    details: [
      "Personalised skin preparation & HD/airbrush options",
      "Hairstyling, jewelry setting & lehenga/saree draping",
      "In-depth pre-wedding trial session included",
      "Touch-up guidance kit"
    ]
  },
  {
    id: "reception",
    order: "02",
    name: "Reception & Engagement",
    blurb: "A second, different look for the evening — glossier, sharper, camera-ready.",
    priceFrom: null,
    priceDisplay: "Price on request [[from ₹]]",
    duration: "[[2–3 hrs]]",
    whatsappVerb: "Reception & Engagement Makeup",
    featured: true,
    image: "assets/img/gallery/reception-gown-01.webp",
    imageRatio: "4/5",
    imageWidth: 1200,
    imageHeight: 1500,
    imageAlt: "Reception evening look with refined sculpt and modern gown styling",
    placeholder: false,
    details: [
      "Evening-toned complexion sculpting",
      "Signature soft glam or statement eye artistry",
      "Contemporary hair design and secure gown/saree draping"
    ]
  },
  {
    id: "party",
    order: "03",
    name: "Party Glam",
    blurb: "Festive, sangeet, birthday, cocktail. Lasts the whole night.",
    priceFrom: null,
    priceDisplay: "Price on request [[from ₹]]",
    duration: "[[1.5–2 hrs]]",
    whatsappVerb: "Party Glam Makeup",
    featured: true,
    image: "assets/img/gallery/party-glam-01.webp",
    imageRatio: "1/1",
    imageWidth: 1200,
    imageHeight: 1200,
    imageAlt: "Festive party glam with luminous finish and waterproof eye definition",
    placeholder: false,
    details: [
      "Long-wear waterproof base & sweat-resistant finish",
      "Choice of classic glow, smoky, or jewel-toned accent",
      "Blowdry / basic styling included"
    ]
  },
  {
    id: "editorial",
    order: "04",
    name: "Photoshoot & Editorial",
    blurb: "Makeup for portfolios, brands and shoots. Built for lenses and lights.",
    priceFrom: null,
    priceDisplay: "Price on request [[from ₹]]",
    duration: "[[2–3 hrs]]",
    whatsappVerb: "Editorial / Photoshoot Makeup",
    featured: true,
    image: "assets/img/gallery/editorial-bold-lip-01.webp",
    imageRatio: "4/5",
    imageWidth: 1200,
    imageHeight: 1500,
    imageAlt: "High-contrast editorial makeup portrait with graphic lip framing",
    placeholder: false,
    details: [
      "Precision skin finish engineered for 4K / studio flash",
      "On-set touch-up readiness and high-concept creative direction",
      "Close collaboration with photographers & stylists"
    ]
  },
  {
    id: "everyday",
    order: "05",
    name: "Everyday & Occasion",
    blurb: "Natural, skin-first makeup for interviews, pujas and family functions.",
    priceFrom: null,
    priceDisplay: "Price on request [[from ₹]]",
    duration: "[[1 hr]]",
    whatsappVerb: "Everyday & Occasion Makeup",
    featured: false,
    image: "assets/img/gallery/everyday-natural-01.webp",
    imageRatio: "1/1",
    imageWidth: 1200,
    imageHeight: 1200,
    imageAlt: "Skin-first natural occasion makeup with soft radiant finish",
    placeholder: false,
    details: [
      "Breathable, lightweight tinted hydration base",
      "Soft neutral eye definition & naturally flushed lips",
      "Refined neat hair finishing"
    ]
  },
  {
    id: "hair-saree",
    order: "06",
    name: "Hair & Saree Draping",
    blurb: "Hairstyling and draping, alone or with makeup.",
    priceFrom: null,
    priceDisplay: "Price on request [[from ₹]]",
    duration: "[[1 hr]]",
    whatsappVerb: "Hair & Saree Draping",
    featured: false,
    image: "assets/img/gallery/hair-saree-draping-01.webp",
    imageRatio: "3/4",
    imageWidth: 1200,
    imageHeight: 1600,
    imageAlt: "Intricate traditional saree pleating and bridal hair styling, photo coming soon",
    placeholder: true,
    placeholderLabel: "HAIR & SAREE",
    details: [
      "Traditional Odia silk, Sambalpuri, Kanjeevaram or modern drape",
      "Textured bridal buns, braids with fresh florals, or soft waves",
      "Pinning and pleating that stays in place all day"
    ]
  }
];
