/**
 * data/gallery.js — Lookbook Items & Categories
 * Aaina Makeup Studio
 * Adheres strictly to Image Brief §1 & §2.
 * - 10 public gallery entries (Section A files).
 * - 2 placeholder entries with placeholder: true (hidden from public gallery & filter bar until replaced).
 * - 6 entries marked featured: true across mixed categories for the home teaser.
 */
window.AAINA = window.AAINA || {};

window.AAINA.galleryCategories = [
  { id: "all", label: "All" },
  { id: "bridal", label: "Bridal" },
  { id: "reception", label: "Reception" },
  { id: "party", label: "Party" },
  { id: "editorial", label: "Editorial" },
  { id: "everyday", label: "Everyday" },
  { id: "hair-saree", label: "Hair & Saree" }
];

window.AAINA.gallery = [
  /* -------------------------------------------------------------
     Section A: 10 Public Gallery Items (Existing .webp files)
     ------------------------------------------------------------- */
  {
    id: "g-bridal-01",
    category: "bridal",
    title: "Odia Bridal in Crimson & Filigree Gold",
    year: 2025,
    src: "assets/img/gallery/bridal-odia-red-01.webp",
    thumb: "assets/img/gallery/bridal-odia-red-01.webp", // Fallback to full if thumb missing
    width: 1200,
    height: 1600,
    ratio: "3/4",
    focus: "50% 35%",
    featured: true,
    alt: "Traditional Odia bride wearing red Sambalpuri saree with gold jewelry and classic red lip",
    credit: "Photo: [[Photographer Name]]",
    placeholder: false
  },
  {
    id: "g-bridal-02",
    category: "bridal",
    title: "Bridal Close-Up, Radiant Skin & Kajal",
    year: 2025,
    src: "assets/img/gallery/bridal-closeup-02.webp",
    thumb: "assets/img/gallery/bridal-closeup-02.webp",
    width: 1200,
    height: 1500,
    ratio: "4/5",
    focus: "50% 30%",
    featured: true,
    alt: "Intimate portrait of bride showing detailed eye makeup and flawless undertone matching",
    credit: "Photo: [[Photographer Name]]",
    placeholder: false
  },
  {
    id: "g-bridal-03",
    category: "bridal",
    title: "Bengali-Style Wedding Look in Royal Vermilion",
    year: 2025,
    src: "assets/img/gallery/bridal-bengali-style-03.webp",
    thumb: "assets/img/gallery/bridal-bengali-style-03.webp",
    width: 1200,
    height: 1600,
    ratio: "3/4",
    focus: "50% 35%",
    featured: false,
    alt: "Bride in ornate vermilion silk with traditional forehead chandan artistry and gold mukut",
    credit: "Photo: [[Photographer Name]]",
    placeholder: false
  },
  {
    id: "g-reception-01",
    category: "reception",
    title: "Sculpted Evening Glam for Modern Reception",
    year: 2025,
    src: "assets/img/gallery/reception-gown-01.webp",
    thumb: "assets/img/gallery/reception-gown-01.webp",
    width: 1200,
    height: 1500,
    ratio: "4/5",
    focus: "50% 35%",
    featured: true,
    alt: "Evening reception look featuring luminous contoured cheekbones and sleek styling",
    credit: "Photo: [[Photographer Name]]",
    placeholder: false
  },
  {
    id: "g-reception-02",
    category: "reception",
    title: "Classic Reception Elegance in Emerald Silk",
    year: 2025,
    src: "assets/img/gallery/reception-saree-02.webp",
    thumb: "assets/img/gallery/reception-saree-02.webp",
    width: 1200,
    height: 1600,
    ratio: "3/4",
    focus: "50% 40%",
    featured: false,
    alt: "Reception bride in rich silk saree with dewy skin finish and defined berry lips",
    credit: "Photo: [[Photographer Name]]",
    placeholder: false
  },
  {
    id: "g-party-01",
    category: "party",
    title: "Cocktail Party Glam with Soft Hollywood Waves",
    year: 2025,
    src: "assets/img/gallery/party-glam-01.webp",
    thumb: "assets/img/gallery/party-glam-01.webp",
    width: 1200,
    height: 1200,
    ratio: "1/1",
    focus: "50% 40%",
    featured: true,
    alt: "Glamorous party makeup with champagne shimmer and long-wear waterproof base",
    credit: "Photo: [[Photographer Name]]",
    placeholder: false
  },
  {
    id: "g-party-02",
    category: "party",
    title: "Sangeet Night Radiance with Smokey Kohl Eye",
    year: 2025,
    src: "assets/img/gallery/party-sangeet-02.webp",
    thumb: "assets/img/gallery/party-sangeet-02.webp",
    width: 1600,
    height: 1000,
    ratio: "16/10",
    focus: "50% 45%",
    featured: false,
    alt: "Celebratory sangeet makeup look with bold smokey kohl eyes and radiant golden glow",
    credit: "Photo: [[Photographer Name]]",
    placeholder: false
  },
  {
    id: "g-editorial-01",
    category: "editorial",
    title: "High-Fashion Editorial with Statement Bold Lip",
    year: 2024,
    src: "assets/img/gallery/editorial-bold-lip-01.webp",
    thumb: "assets/img/gallery/editorial-bold-lip-01.webp",
    width: 1200,
    height: 1500,
    ratio: "4/5",
    focus: "50% 35%",
    featured: true,
    alt: "Vogue-inspired editorial beauty shoot with clean velvet complexion and graphic bold lip",
    credit: "Photo: [[Photographer Name]]",
    placeholder: false
  },
  {
    id: "g-editorial-02",
    category: "editorial",
    title: "Graphic Eye Artistry for Studio Portfolio",
    year: 2024,
    src: "assets/img/gallery/editorial-graphic-02.webp",
    thumb: "assets/img/gallery/editorial-graphic-02.webp",
    width: 1200,
    height: 1600,
    ratio: "3/4",
    focus: "50% 35%",
    featured: false,
    alt: "Creative editorial makeup highlighting structured architectural eye lines under studio lighting",
    credit: "Photo: [[Photographer Name]]",
    placeholder: false
  },
  {
    id: "g-everyday-01",
    category: "everyday",
    title: "Skin-First Natural Glow for Occasions",
    year: 2025,
    src: "assets/img/gallery/everyday-natural-01.webp",
    thumb: "assets/img/gallery/everyday-natural-01.webp",
    width: 1200,
    height: 1200,
    ratio: "1/1",
    focus: "50% 40%",
    featured: true,
    alt: "Minimalist everyday beauty look focusing on healthy skin texture and soft flushed cheeks",
    credit: "Photo: [[Photographer Name]]",
    placeholder: false
  },

  /* -------------------------------------------------------------
     Section B: Placeholder Slots (placeholder: true)
     Hidden from public gallery grid & filter bar per Image Brief §2.
     Used in service rows until real photos are dropped in.
     ------------------------------------------------------------- */
  {
    id: "g-hair-01",
    category: "hair-saree",
    title: "Traditional Saree Draping & Floral Braid",
    year: 2025,
    src: "assets/img/gallery/hair-saree-draping-01.webp",
    thumb: "assets/img/gallery/hair-saree-draping-01.webp",
    width: 1200,
    height: 1600,
    ratio: "3/4",
    focus: "50% 50%",
    featured: false,
    alt: "Intricate traditional saree pleating and bridal braid, photo coming soon",
    credit: "Photo: [[Photographer Name]]",
    placeholder: true,
    placeholderLabel: "HAIR & SAREE"
  },
  {
    id: "g-hair-02",
    category: "hair-saree",
    title: "Textured Contemporary Bridal Braid",
    year: 2025,
    src: "assets/img/gallery/hair-braid-02.webp",
    thumb: "assets/img/gallery/hair-braid-02.webp",
    width: 1200,
    height: 1500,
    ratio: "4/5",
    focus: "50% 50%",
    featured: false,
    alt: "Modern textured bridal hair styling with delicate ornamentation, photo coming soon",
    credit: "Photo: [[Photographer Name]]",
    placeholder: true,
    placeholderLabel: "HAIR & SAREE"
  }
];
