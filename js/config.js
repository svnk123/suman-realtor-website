/**
 * ╔══════════════════════════════════════════════════════════════════╗
 * ║  SITE CONFIGURATION — Edit this file to update the entire site  ║
 * ╚══════════════════════════════════════════════════════════════════╝
 *
 * Change any value here and it will update across all pages
 * that call applySiteConfig() (included via <script src="../js/config.js">)
 */

const SITE_CONFIG = {

  /* ── Agent / Brand ──────────────────────────────────────────────── */
  agentName:       "Suman Jampany",          // ← REPLACE with real name
  brandName:       "HomeKey Group TN",        // ← REPLACE with real brand
  tagline:         "Licensed Tennessee Real Estate Agent",
  licenseNumber:   "TN License #XXXXXXX",    // ← REPLACE with real TREC #
  licenseNote:     "Licensed in Tennessee only. Not licensed in any other state.",
  languages:       "English · Telugu · Hindi",

  /* ── Contact ────────────────────────────────────────────────────── */
  phone:       "(615) 555-1234",             // ← REPLACE
  phoneHref:   "tel:+16155551234",           // ← REPLACE (no dashes/spaces)
  email:       "suman@homekeytn.com",        // ← REPLACE
  emailHref:   "mailto:suman@homekeytn.com", // ← REPLACE

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
  featuredListings: [
    {
      title:    "⚠️ Replace — Listing Title",
      address:  "123 Example Street",
      city:     "Franklin", state: "TN", zip: "37064",
      beds: 4, baths: 3, sqft: "2,640",
      price:    "$000,000",
      badge:    "New Listing",
      badgeClass: "badge-new",
      image:    "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&h=420&fit=crop",
      detailUrl: "/listings/",
    },
    {
      title:    "⚠️ Replace — Listing Title",
      address:  "456 Example Avenue",
      city:     "Brentwood", state: "TN", zip: "37027",
      beds: 3, baths: 2, sqft: "1,980",
      price:    "$000,000",
      badge:    "Open House Sun",
      badgeClass: "badge-hot",
      image:    "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=600&h=420&fit=crop",
      detailUrl: "/listings/",
    },
    {
      title:    "⚠️ Replace — Listing Title",
      address:  "789 Example Court",
      city:     "Nashville", state: "TN", zip: "37215",
      beds: 5, baths: 4, sqft: "4,100",
      price:    "$000,000",
      badge:    "",
      badgeClass: "",
      image:    "https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=600&h=420&fit=crop",
      detailUrl: "/listings/",
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
  agentPhoto: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=680&h=880&fit=crop&crop=faces",
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
