/**
 * data/branches.js — Studio Locations Catalog
 * Aaina Makeup Studio
 * Exactly 2 branches in Bhubaneswar.
 * Note: Adding a new branch requires editing only this array.
 * Phone numbers: Digits-only with country code for whatsapp, formatted for phone.
 * Placeholders marked with [[ ]] stay visible until supplied by owner.
 * Images point to assets/img/about/branch-*.webp (placeholder rendered when file missing).
 */
window.AAINA = window.AAINA || {};

window.AAINA.branches = [
  {
    id: "lewis-road",
    order: "01",
    name: "Lewis Road",
    city: "Bhubaneswar",
    area: "Kedargauri",
    address: "Plot No. 2855, Vivekananda Ladies Hostel, Lewis Road, Kedargauri Resort, Bhubaneswar 751014",
    landmark: "Kedargauri Resort",
    lat: 20.2413022,
    lng: 85.8412355,
    phone: "+91 63720 91560",
    whatsapp: "916372091560",
    hours: [
      { days: "Mon–Sat", time: "10:00 – 20:00 [[confirm]]" },
      { days: "Sun", time: "By appointment [[confirm]]" }
    ],
    parking: "[[Parking available]]",
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=20.2413022,85.8412355",
    mapEmbed: "https://maps.google.com/maps?q=20.2413022,85.8412355&z=16&output=embed",
    image: "assets/img/about/branch-lewis-road.webp",
    imageRatio: "16/10",
    imageWidth: 1600,
    imageHeight: 1000,
    imageLabel: "STUDIO",
    imageAlt: "Lewis Road Studio Interior — Kedargauri, Bhubaneswar, photo coming soon",
    placeholder: true
  },
  {
    id: "gudiapokhari",
    order: "02",
    name: "Gudiapokhari",
    city: "Bhubaneswar",
    area: "Gudiapokhari",
    address: "Gudiapokhari, Bhubaneswar [[full address + pin code]]",
    landmark: "Gudiapokhari Square",
    lat: 20.1664124,
    lng: 85.8605194,
    phone: "+91 63720 91560",
    whatsapp: "916372091560",
    hours: [
      { days: "Mon–Sat", time: "10:00 – 20:00 [[confirm]]" },
      { days: "Sun", time: "By appointment [[confirm]]" }
    ],
    parking: "[[Parking available]]",
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=20.1664124,85.8605194",
    mapEmbed: "https://maps.google.com/maps?q=20.1664124,85.8605194&z=16&output=embed",
    image: "assets/img/about/branch-gudiapokhari.webp",
    imageRatio: "16/10",
    imageWidth: 1600,
    imageHeight: 1000,
    imageLabel: "STUDIO",
    imageAlt: "Gudiapokhari Studio Interior — Bhubaneswar, photo coming soon",
    placeholder: true
  }
];
