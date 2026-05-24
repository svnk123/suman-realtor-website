/**
 * listings-api.js
 * Fetches real active listings from the US Real Estate API via RapidAPI.
 *
 * Setup (one-time, free):
 *  1. Go to https://rapidapi.com/datascraper/api/us-real-estate
 *  2. Click "Subscribe to Test" → select the FREE plan
 *  3. Copy your API key from the "Header Parameters" panel
 *  4. Paste it into js/config.js → rapidApiKey: "YOUR_KEY_HERE"
 *
 * Fallback: If no key is set, falls back to config.js featuredListings.
 */

const ListingsAPI = (() => {

  /* ── Parse "City, ST" into { city, stateCode } ── */
  function parseLocation(location) {
    const parts = location.split(',').map(s => s.trim());
    return {
      city:      parts[0] || 'Franklin',
      stateCode: (parts[1] || 'TN').toUpperCase(),
    };
  }

  /* ── Fetch listings from US Real Estate API via RapidAPI ── */
  async function fetchForSale(location, limit = 6) {
    const key = (typeof SITE_CONFIG !== 'undefined') ? SITE_CONFIG.rapidApiKey : '';

    if (!key || key === 'YOUR_RAPIDAPI_KEY_HERE') {
      console.warn('ListingsAPI: No RapidAPI key set in config.js → showing placeholder cards.');
      return null;
    }

    const { city, stateCode } = parseLocation(location);

    try {
      const params = new URLSearchParams({
        city,
        state_code: stateCode,
        limit: String(limit),
        offset: '0',
        sort: 'newest',
        status: 'for_sale',
      });
      const url = `https://us-real-estate.p.rapidapi.com/v2/for-sale?${params}`;
      const res = await fetch(url, {
        method: 'GET',
        headers: {
          'X-RapidAPI-Key':  key,
          'X-RapidAPI-Host': 'us-real-estate.p.rapidapi.com',
        },
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();

      // US Real Estate API returns { data: { home_search: { results: [...] } } }
      const raw = data?.data?.home_search?.results
               || data?.data?.results
               || data?.results
               || [];
      return raw.slice(0, limit).map(normalizeUSRealEstate);
    } catch (err) {
      console.error('ListingsAPI fetch error:', err);
      return null;
    }
  }

  /* ── Fetch for rent ── */
  async function fetchForRent(location, limit = 6) {
    const key = (typeof SITE_CONFIG !== 'undefined') ? SITE_CONFIG.rapidApiKey : '';
    if (!key || key === 'YOUR_RAPIDAPI_KEY_HERE') return null;

    const { city, stateCode } = parseLocation(location);
    try {
      const params = new URLSearchParams({
        city, state_code: stateCode, limit: String(limit), offset: '0',
      });
      const url = `https://us-real-estate.p.rapidapi.com/v2/for-rent?${params}`;
      const res = await fetch(url, {
        headers: {
          'X-RapidAPI-Key':  key,
          'X-RapidAPI-Host': 'us-real-estate.p.rapidapi.com',
        },
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      const raw = data?.data?.home_search?.results || data?.data?.results || data?.results || [];
      return raw.slice(0, limit).map(normalizeUSRealEstate);
    } catch (err) {
      console.error('ListingsAPI rent fetch error:', err);
      return null;
    }
  }

  /* ── Fetch recently sold ── */
  async function fetchSold(location, limit = 6) {
    const key = (typeof SITE_CONFIG !== 'undefined') ? SITE_CONFIG.rapidApiKey : '';
    if (!key || key === 'YOUR_RAPIDAPI_KEY_HERE') return null;

    const { city, stateCode } = parseLocation(location);
    try {
      const params = new URLSearchParams({
        city, state_code: stateCode, limit: String(limit), offset: '0',
      });
      const url = `https://us-real-estate.p.rapidapi.com/v2/recently-sold?${params}`;
      const res = await fetch(url, {
        headers: {
          'X-RapidAPI-Key':  key,
          'X-RapidAPI-Host': 'us-real-estate.p.rapidapi.com',
        },
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      const raw = data?.data?.home_search?.results || data?.data?.results || data?.results || [];
      return raw.slice(0, limit).map(normalizeUSRealEstate);
    } catch (err) {
      console.error('ListingsAPI sold fetch error:', err);
      return null;
    }
  }

  /* ── Normalize US Real Estate API response to our internal format ── */
  function normalizeUSRealEstate(p) {
    const desc = p.description || {};
    const loc  = p.location?.address || {};
    const price = p.list_price || p.price || p.sold_price || 0;
    const photos = p.photos || p.primary_photo ? [p.primary_photo] : [];
    const photo  = p.primary_photo?.href || (photos[0] && photos[0].href) || '';

    const beds  = desc.beds  || p.beds  || '—';
    const baths = desc.baths || p.baths || (desc.baths_full ? desc.baths_full + (desc.baths_half ? '.5' : '') : '—');
    const sqft  = desc.sqft  || p.sqft  || 0;
    const type  = desc.type  || p.sub_type || p.type || 'Home';

    // Build a readable title
    const title = [beds !== '—' ? beds + ' Bed' : '', formatType(type), '—', loc.city || ''].filter(Boolean).join(' ');

    // Detail URL
    let detailUrl = p.permalink
      ? `https://www.realtor.com/realestateandhomes-detail/${p.permalink}`
      : (p.href || '#');

    return {
      title,
      address:   loc.line  || loc.street || '',
      city:      loc.city  || '',
      state:     loc.state_code || 'TN',
      zip:       loc.postal_code || '',
      beds,
      baths,
      sqft:      sqft ? Number(sqft).toLocaleString() : '—',
      price:     price ? '$' + Number(price).toLocaleString() : 'Call for Price',
      badge:     p.flags?.is_new_listing ? 'New Listing' : (p.flags?.is_price_reduced ? 'Price Drop' : ''),
      badgeClass: p.flags?.is_new_listing ? 'badge-new' : 'badge-hot',
      image:     photo,
      detailUrl,
      source:    'realtor',
    };
  }

  function formatType(t) {
    if (!t) return 'Home';
    const map = { single_family: 'Home', condo: 'Condo', townhouse: 'Townhome',
                  multi_family: 'Multi-Family', land: 'Land', mobile: 'Mobile Home' };
    return map[t.toLowerCase()] || t;
  }

  /* ── Render listings into a container element ── */
  function render(listings, container) {
    if (!container) return;

    if (!listings || listings.length === 0) {
      container.innerHTML = `
        <div style="grid-column:1/-1;text-align:center;padding:48px 20px">
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
          ? `<img class="listing-img" src="${l.image}" alt="${l.title}" loading="lazy" onerror="this.style.display='none'">`
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
          <a href="${l.detailUrl}" target="_blank" rel="noopener" class="btn btn-outline">View on Realtor.com ↗</a>
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

  /* ── Load for-sale and render into a container, with fallback to config ── */
  async function loadInto(containerId, location, limit = 6) {
    const container = document.getElementById(containerId);
    if (!container) return;

    showSkeleton(container, limit);

    const listings = await fetchForSale(location, limit);

    if (listings) {
      render(listings, container);
      // Attribution
      const attr = document.createElement('p');
      attr.style.cssText = 'text-align:center;font-size:0.75rem;color:var(--text-light);margin-top:12px;grid-column:1/-1';
      attr.innerHTML = 'Listing data provided by <a href="https://www.realtor.com" target="_blank" rel="noopener" style="color:var(--primary)">Realtor.com</a>. For informational purposes only. Verify with a licensed agent.';
      container.after(attr);
    } else {
      // Fall back to config.js featured listings
      if (typeof SITE_CONFIG !== 'undefined' && SITE_CONFIG.featuredListings) {
        container.innerHTML = SITE_CONFIG.featuredListings.map(l => `
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

  return { fetchForSale, fetchForRent, fetchSold, render, showSkeleton, loadInto };
})();

/* ── Pulse animation for skeleton ── */
const _style = document.createElement('style');
_style.textContent = `@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.55} }`;
document.head.appendChild(_style);
