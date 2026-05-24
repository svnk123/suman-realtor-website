/**
 * ╔══════════════════════════════════════════════════════════════════╗
 * ║  SITE CONFIGURATION — Edit this file to update the entire site  ║
 * ╚══════════════════════════════════════════════════════════════════╝
 *
 * Change any value here and it will update across all pages
 * that call applySiteConfig() (included via <script src="../js/config.js">)
 */

const SITE_CONFIG = {

  /* ── API Keys ───────────────────────────────────────────────────── */
  // Get a FREE key: https://rapidapi.com/datascraper/api/us-real-estate
  // Subscribe to the FREE plan → copy "X-RapidAPI-Key" value below
  rapidApiKey: "YOUR_RAPIDAPI_KEY_HERE",   // ← PASTE YOUR KEY HERE

  /* ── Default search location for live listings ──────────────────── */
  // This city is used on the homepage + listings page to fetch real data
  defaultSearchCity: "Franklin, TN",       // ← change to your primary market

  /* ── Agent / Brand ──────────────────────────────────────────────── */
  agentName:       "Suman Jampany",          // ← REPLACE with real name
  brandName:       "HomeKey Group TN",        // ← REPLACE with real brand
  tagline:         "Licensed Tennessee Real Estate Agent",
  licenseNumber:   "TN License #XXXXXXX",    // ← REPLACE with real TREC #
  licenseNote:     "Licensed in Tennessee only. Not licensed in any other state.",
  languages:       "English · Telugu · Hindi",

  /* ── Contact ────────────────────────────────────────────────────── */
  phone:       "(901) 268-0029",
  phoneHref:   "tel:+19012680029",
  email:       "sumanjmp@gmail.com",
  emailHref:   "mailto:sumanjmp@gmail.com",

  /* ── Service Area ───────────────────────────────────────────────── */
  serviceArea: "Davidson, Williamson, Rutherford, Wilson &amp; Sumner Counties, TN",
  serviceAreaShort: "Nashville · Franklin · Brentwood · Murfreesboro · Mt. Juliet",

  /* ── Agent Stats (homepage hero) ───────────────────────────────── */
  // ⚠️  Replace with real verified numbers
  stats: [
    { value: "150+",  label: "Homes Sold" },
    { value: "12+",   label: "Years in TN" },
    { value: "98%",   label: "Client Satisfaction" },
    { value: "$95M+", label: "Total Sales" },
  ],

  /* ── Market Data Strip (homepage) ──────────────────────────────── */
  // ⚠️  Update these regularly from MLS/GNAR reports
  marketStats: [
    { value: "$462K", label: "Nashville Median" },
    { value: "$685K", label: "Franklin Median" },
    { value: "22",    label: "Avg. Days on Market" },
    { value: "0%",    label: "TN State Income Tax" },
  ],

  /* ── Testimonials ───────────────────────────────────────────────── */
  // ⚠️  ALL PLACEHOLDER — replace with real Google / Zillow / Realtor.com reviews
  // Copy the exact quote, client first name + city, and star rating (1-5)
  testimonials: [
    {
      stars: 5,
      quote: "⚠️ PLACEHOLDER — Replace with a real client review from Google or Zillow.",
      name:  "[Client First Name]",
      city:  "Franklin, TN",
    },
    {
      stars: 5,
      quote: "⚠️ PLACEHOLDER — Replace with a real client review from Google or Zillow.",
      name:  "[Client First Name]",
      city:  "Murfreesboro, TN",
    },
    {
      stars: 5,
      quote: "⚠️ PLACEHOLDER — Replace with a real client review from Google or Zillow.",
      name:  "[Client First Name]",
      city:  "Brentwood, TN",
    },
  ],

  /* ── Featured Listings (homepage 3-card section) ────────────────── */
  // ⚠️  Replace with real active listings. Use your MLS photos via direct link.
  // Each listing: title, address, city, state, zip, beds, baths, sqft, price,
  //               badge (text or ""), image (URL), detailUrl
  // ⚠️  Replace these with Suman's real active MLS listings.
  // Each card links out to the real listing on Realtor.com or Zillow (set detailUrl).
  featuredListings: [
    {
      title:    "4 Bed Craftsman",
      address:  "Sullivan Farms Dr",
      city:     "Franklin", state: "TN", zip: "37064",
      beds: 4, baths: 3, sqft: "2,640",
      price:    "$689,900",
      badge:    "New Listing",
      badgeClass: "badge-new",
      image:    "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&h=420&fit=crop",
      detailUrl: "https://www.realtor.com/realestateandhomes-search/Franklin_TN",
    },
    {
      title:    "3 Bed Townhome",
      address:  "Brentwood Pointe",
      city:     "Brentwood", state: "TN", zip: "37027",
      beds: 3, baths: 2.5, sqft: "2,180",
      price:    "$574,000",
      badge:    "Open House Sun",
      badgeClass: "badge-hot",
      image:    "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=600&h=420&fit=crop",
      detailUrl: "https://www.realtor.com/realestateandhomes-search/Brentwood_TN",
    },
    {
      title:    "5 Bed Estate",
      address:  "Green Hills Area",
      city:     "Nashville", state: "TN", zip: "37215",
      beds: 5, baths: 4, sqft: "4,100",
      price:    "$1,195,000",
      badge:    "",
      badgeClass: "",
      image:    "https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=600&h=420&fit=crop",
      detailUrl: "https://www.realtor.com/realestateandhomes-search/Nashville_TN",
    },
    {
      title:    "4 Bed Colonial",
      address:  "Nolensville Pike Area",
      city:     "Nolensville", state: "TN", zip: "37135",
      beds: 4, baths: 3.5, sqft: "3,020",
      price:    "$749,000",
      badge:    "New Listing",
      badgeClass: "badge-new",
      image:    "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=600&h=420&fit=crop",
      detailUrl: "https://www.realtor.com/realestateandhomes-search/Nolensville_TN",
    },
    {
      title:    "3 Bed Ranch",
      address:  "Murfreesboro Pike",
      city:     "Murfreesboro", state: "TN", zip: "37129",
      beds: 3, baths: 2, sqft: "1,780",
      price:    "$389,900",
      badge:    "",
      badgeClass: "",
      image:    "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=600&h=420&fit=crop",
      detailUrl: "https://www.realtor.com/realestateandhomes-search/Murfreesboro_TN",
    },
    {
      title:    "5 Bed New Build",
      address:  "Providence Area",
      city:     "Mt. Juliet", state: "TN", zip: "37122",
      beds: 5, baths: 4, sqft: "3,850",
      price:    "$824,500",
      badge:    "Price Drop",
      badgeClass: "badge-hot",
      image:    "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&h=420&fit=crop",
      detailUrl: "https://www.realtor.com/realestateandhomes-search/Mount-Juliet_TN",
    },
  ],

  /* ── Social Links ───────────────────────────────────────────────── */
  // Leave blank ("") to hide the icon
  social: {
    facebook:  "",   // ← e.g. "https://facebook.com/yourpage"
    instagram: "",   // ← e.g. "https://instagram.com/yourhandle"
    linkedin:  "",   // ← e.g. "https://linkedin.com/in/yourprofile"
    zillow:    "",   // ← e.g. "https://www.zillow.com/profile/youragent"
  },

  /* ── About Page ─────────────────────────────────────────────────── */
  // ⚠️  Replace agentPhoto with Suman's real headshot URL
  agentPhoto: "https://static.wixstatic.com/media/ce0836_c397141b30364a42925dfb47de242287~mv2.jpg/v1/fill/w_680,h_880,al_c,q_90,enc_avif,quality_auto/ce0836_c397141b30364a42925dfb47de242287~mv2.jpg",
  agentBio: [
    "⚠️ PLACEHOLDER — Replace with Suman's real bio. Describe her background, years in Tennessee real estate, what drives her, and the communities she serves.",
    "⚠️ PLACEHOLDER — Second paragraph: her approach, what makes her different, tech background or any unique skills, languages spoken.",
    "⚠️ PLACEHOLDER — Third paragraph: community involvement, personal touch, or Tennessee-specific expertise.",
  ],

  /* ── Copyright ──────────────────────────────────────────────────── */
  copyrightYear:  "2026",
  copyrightName:  "HomeKey Group TN",        // ← REPLACE if brand name changes
};


/* ══════════════════════════════════════════════════════════════════
   AUTO-APPLY — renders config values into any page that loads this file
   ══════════════════════════════════════════════════════════════════ */
document.addEventListener("DOMContentLoaded", () => {

  /* ── Contact details everywhere ── */
  document.querySelectorAll("[data-cfg-phone]").forEach(el => {
    el.textContent = SITE_CONFIG.phone;
    if (el.tagName === "A") el.href = SITE_CONFIG.phoneHref;
  });
  document.querySelectorAll("[data-cfg-email]").forEach(el => {
    el.textContent = SITE_CONFIG.email;
    if (el.tagName === "A") el.href = SITE_CONFIG.emailHref;
  });
  document.querySelectorAll("[data-cfg-license]").forEach(el => {
    el.textContent = SITE_CONFIG.licenseNumber;
  });
  document.querySelectorAll("[data-cfg-brand]").forEach(el => {
    el.textContent = SITE_CONFIG.brandName;
  });
  document.querySelectorAll("[data-cfg-agent]").forEach(el => {
    el.textContent = SITE_CONFIG.agentName;
  });
  document.querySelectorAll("[data-cfg-service-area]").forEach(el => {
    el.innerHTML = SITE_CONFIG.serviceArea;
  });
  document.querySelectorAll("[data-cfg-copyright]").forEach(el => {
    el.innerHTML = `&copy; ${SITE_CONFIG.copyrightYear} ${SITE_CONFIG.copyrightName}. All rights reserved.`;
  });

  /* ── Testimonials block ── */
  const tBlock = document.getElementById("cfg-testimonials");
  if (tBlock) {
    tBlock.innerHTML = SITE_CONFIG.testimonials.map(t => `
      <div class="testimonial-card">
        <div class="stars">${"★".repeat(t.stars)}${"☆".repeat(5 - t.stars)}</div>
        <p>"${t.quote}"</p>
        <cite>— ${t.name}, ${t.city}</cite>
      </div>
    `).join("");
  }

  /* ── Hero stats ── */
  const statsBlock = document.getElementById("cfg-hero-stats");
  if (statsBlock) {
    statsBlock.innerHTML = SITE_CONFIG.stats.map(s => `
      <div class="hero-stat"><strong>${s.value}</strong><span>${s.label}</span></div>
    `).join("");
  }

  /* ── Market stats strip ── */
  const mktBlock = document.getElementById("cfg-market-stats");
  if (mktBlock) {
    mktBlock.innerHTML = SITE_CONFIG.marketStats.map(s => `
      <div class="market-stat"><strong>${s.value}</strong><span>${s.label}</span></div>
    `).join("");
  }

  /* ── Featured listings (homepage) ── */
  const flBlock = document.getElementById("cfg-featured-listings");
  if (flBlock) {
    flBlock.innerHTML = SITE_CONFIG.featuredListings.map(l => `
      <div class="listing-card">
        ${l.badge ? `<span class="listing-badge ${l.badgeClass}">${l.badge}</span>` : ""}
        <img class="listing-img" src="${l.image}"
             alt="${l.title} in ${l.city}, ${l.state}"
             loading="lazy" crossorigin="anonymous">
        <div class="listing-info">
          <h3>${l.title}</h3>
          <p class="listing-address">📍 ${l.address}, ${l.city}, ${l.state} ${l.zip}</p>
          <div class="listing-details">
            <span>🛏 ${l.beds} Beds</span>
            <span>🚿 ${l.baths} Baths</span>
            <span>📐 ${l.sqft} sqft</span>
          </div>
          <div class="listing-price">${l.price}</div>
          <a href="${l.detailUrl}" class="btn btn-outline">View Details</a>
        </div>
      </div>
    `).join("");
  }

  /* ── About agent photo ── */
  const agentImg = document.getElementById("cfg-agent-photo");
  if (agentImg) {
    agentImg.src = SITE_CONFIG.agentPhoto;
    agentImg.alt = SITE_CONFIG.agentName + ", Tennessee Real Estate Agent";
  }

  /* ── About bio paragraphs ── */
  const bioBlock = document.getElementById("cfg-agent-bio");
  if (bioBlock) {
    bioBlock.innerHTML = SITE_CONFIG.agentBio
      .map(p => `<p>${p}</p>`).join("");
  }
});
