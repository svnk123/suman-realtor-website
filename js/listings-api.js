/**
 * listings-api.js
 * Fetches real active listings from Zillow via RapidAPI (Zillow56).
 *
 * Setup (one-time, free):
 *  1. Go to https://rapidapi.com/s.mahmoud97/api/zillow56
 *  2. Click "Subscribe to Test" → select the FREE plan
 *  3. Copy your API key from the "Header Parameters" panel
 *  4. Paste it into js/config.js → rapidApiKey: "YOUR_KEY_HERE"
 */

const ListingsAPI = (() => {

  /* ── Fetch listings from Zillow56 via RapidAPI ── */
  async function fetchForSale(location, limit = 6) {
    const key = (typeof SITE_CONFIG !== 'undefined') ? SITE_CONFIG.rapidApiKey : '';

    if (!key || key === 'YOUR_RAPIDAPI_KEY_HERE') {
      console.warn('ListingsAPI: No RapidAPI key set in config.js → showing placeholder cards.');
      return null;
    }

    try {
      const url = `https://zillow56.p.rapidapi.com/search?location=${encodeURIComponent(location)}&status=forSale&sortSelection=priorityscore&listing_type=by_agent`;
      const res = await fetch(url, {
        method: 'GET',
        headers: {
          'X-RapidAPI-Key':  key,
          'X-RapidAPI-Host': 'zillow56.p.rapidapi.com',
        },
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();

      // Zillow56 returns { results: [...] }
      const raw = data.results || data.props || [];
      return raw.slice(0, limit).map(normalizeZillow);
    } catch (err) {
      console.error('ListingsAPI fetch error:', err);
      return null; // fall back to config placeholders
    }
  }

  /* ── Normalize Zillow56 response to our internal format ── */
  function normalizeZillow(p) {
    return {
      title:     [p.bedrooms, 'Bed', p.propertyType || 'Home'].filter(Boolean).join(' '),
      address:   p.streetAddress || p.address || '',
      city:      p.city  || '',
      state:     p.state || 'TN',
      zip:       p.zipcode || '',
      beds:      p.bedrooms  || '—',
      baths:     p.bathrooms || '—',
      sqft:      p.livingArea ? Number(p.livingArea).toLocaleString() : '—',
      price:     p.price  ? '$' + Number(p.price).toLocaleString() : 'Call for Price',
      badge:     p.listingStatus === 'NEW' ? 'New Listing' : (p.openHouse ? 'Open House' : ''),
      badgeClass: p.listingStatus === 'NEW' ? 'badge-new' : 'badge-hot',
      image:     p.imgSrc || p.carouselPhotos?.[0]?.url || '',
      detailUrl: p.detailUrl
                   ? (p.detailUrl.startsWith('http') ? p.detailUrl : 'https://www.zillow.com' + p.detailUrl)
                   : 'https://www.zillow.com',
      source:    'zillow',
    };
  }

  /* ── Render listings into a container element ── */
  function render(listings, container, options = {}) {
    if (!container) return;
    const { compact = false } = options;

    if (!listings || listings.length === 0) {
      container.innerHTML = `
        <div class="search-empty-state" style="grid-column:1/-1;text-align:center;padding:48px 20px">
          <div style="font-size:2.5rem;margin-bottom:12px">🏠</div>
          <h3 style="color:var(--text)">No listings found</h3>
          <p style="color:var(--text-light)">Try a different city or check back soon.</p>
        </div>`;
      return;
    }

    container.innerHTML = listings.map(l => `
      <div class="listing-card">
        ${l.badge ? `<span class="listing-badge ${l.badgeClass}">${l.badge}</span>` : ''}
        ${l.image
          ? `<img class="listing-img" src="${l.image}" alt="${l.title} in ${l.city}, ${l.state}" loading="lazy" onerror="this.style.display='none'">`
          : `<div class="listing-img" style="background:linear-gradient(135deg,#c8d8e8,#a8b8c8);display:flex;align-items:center;justify-content:center;font-size:2.5rem">🏠</div>`
        }
        <div class="listing-info">
          <h3>${l.title}</h3>
          <p class="listing-address">📍 ${l.address}${l.city ? ', ' + l.city : ''}${l.state ? ', ' + l.state : ''} ${l.zip}</p>
          <div class="listing-details">
            ${l.beds !== '—' ? `<span>🛏 ${l.beds} Beds</span>` : ''}
            ${l.baths !== '—' ? `<span>🚿 ${l.baths} Baths</span>` : ''}
            ${l.sqft !== '—' ? `<span>📐 ${l.sqft} sqft</span>` : ''}
          </div>
          <div class="listing-price">${l.price}</div>
          <a href="${l.detailUrl}" target="_blank" rel="noopener" class="btn btn-outline">View on Zillow ↗</a>
        </div>
      </div>
    `).join('');
  }

  /* ── Show a skeleton loading state ── */
  function showSkeleton(container, count = 3) {
    if (!container) return;
    container.innerHTML = Array(count).fill(`
      <div class="listing-card" style="animation:pulse 1.4s ease-in-out infinite">
        <div style="height:210px;background:linear-gradient(90deg,#e8ecf0 25%,#f0f4f7 50%,#e8ecf0 75%);background-size:400px 100%"></div>
        <div style="padding:16px">
          <div style="height:14px;background:#e8ecf0;border-radius:4px;margin-bottom:10px;width:70%"></div>
          <div style="height:12px;background:#e8ecf0;border-radius:4px;margin-bottom:14px;width:90%"></div>
          <div style="height:20px;background:#e8ecf0;border-radius:4px;width:40%"></div>
        </div>
      </div>
    `).join('');
  }

  /* ── Load and render into a container, with fallback to config ── */
  async function loadInto(containerId, location, limit = 6) {
    const container = document.getElementById(containerId);
    if (!container) return;

    showSkeleton(container, limit);

    const listings = await fetchForSale(location, limit);

    if (listings) {
      render(listings, container);

      // Add Zillow attribution (required by their ToS)
      const attr = document.createElement('p');
      attr.style.cssText = 'text-align:center;font-size:0.75rem;color:var(--text-light);margin-top:12px;grid-column:1/-1';
      attr.innerHTML = 'Listing data provided by <a href="https://www.zillow.com" target="_blank" rel="noopener" style="color:var(--primary)">Zillow</a>. Data is for informational purposes only. Always verify with a licensed agent.';
      container.after(attr);
    } else {
      // Fall back to config.js placeholder listings
      if (typeof SITE_CONFIG !== 'undefined' && SITE_CONFIG.featuredListings) {
        const cfgEvent = new Event('DOMContentLoaded');
        // Re-trigger config rendering for this container
        const cfgContainer = document.getElementById('cfg-featured-listings') || container;
        if (cfgContainer && SITE_CONFIG.featuredListings) {
          cfgContainer.innerHTML = SITE_CONFIG.featuredListings.map(l => `
            <div class="listing-card">
              ${l.badge ? `<span class="listing-badge ${l.badgeClass}">${l.badge}</span>` : ''}
              <img class="listing-img" src="${l.image}" alt="${l.title}" loading="lazy" crossorigin="anonymous">
              <div class="listing-info">
                <h3>${l.title}</h3>
                <p class="listing-address">📍 ${l.address}, ${l.city}, ${l.state} ${l.zip}</p>
                <div class="listing-details">
                  <span>🛏 ${l.beds} Beds</span><span>🚿 ${l.baths} Baths</span><span>📐 ${l.sqft} sqft</span>
                </div>
                <div class="listing-price">${l.price}</div>
                <a href="${l.detailUrl}" class="btn btn-outline">View Details</a>
              </div>
            </div>
          `).join('');
        }
      }
    }
  }

  return { fetchForSale, render, showSkeleton, loadInto };
})();

/* ── Pulse animation for skeleton ── */
const _style = document.createElement('style');
_style.textContent = `@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.55} }`;
document.head.appendChild(_style);
