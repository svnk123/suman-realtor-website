/**
 * Home Search Feature
 * - Address autocomplete via OpenStreetMap Nominatim (free, no API key)
 * - Interactive map via Leaflet.js (open source)
 * - Property data seeded around the searched location (demo data;
 *   swap generateProperties() with a real MLS/IDX API for production)
 */

// ── State ──────────────────────────────────────────────────────────────────
const state = {
  map: null,
  markers: [],
  properties: [],
  filtered: [],
  saved: new Set(),
  center: null,
  autocompleteTimeout: null,
  filters: { minPrice: null, maxPrice: null, beds: '', baths: '', type: '', minSqft: null },
  sort: 'relevant',
  view: 'grid',
};

// ── DOM refs ───────────────────────────────────────────────────────────────
const locationInput = document.getElementById('locationInput');
const autocompleteList = document.getElementById('autocompleteList');
const searchBtn = document.getElementById('searchBtn');
const propertyGrid = document.getElementById('propertyGrid');
const resultsCount = document.getElementById('resultsCount');
const applyFiltersBtn = document.getElementById('applyFilters');
const resetFiltersBtn = document.getElementById('resetFilters');
const gridViewBtn = document.getElementById('gridViewBtn');
const listViewBtn = document.getElementById('listViewBtn');

// ── Map init ───────────────────────────────────────────────────────────────
function initMap() {
  state.map = L.map('map', { zoomControl: true }).setView([37.338, -121.886], 11);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 19,
  }).addTo(state.map);
}

// ── Nominatim autocomplete ─────────────────────────────────────────────────
locationInput.addEventListener('input', () => {
  clearTimeout(state.autocompleteTimeout);
  const q = locationInput.value.trim();
  if (q.length < 3) { hideAutocomplete(); return; }
  state.autocompleteTimeout = setTimeout(() => fetchAutocomplete(q), 350);
});

locationInput.addEventListener('keydown', (e) => {
  const items = autocompleteList.querySelectorAll('li');
  const focused = autocompleteList.querySelector('li.focused');
  if (e.key === 'ArrowDown') {
    e.preventDefault();
    const next = focused ? (focused.nextElementSibling || items[0]) : items[0];
    if (next) { focused?.classList.remove('focused'); next.classList.add('focused'); }
  } else if (e.key === 'ArrowUp') {
    e.preventDefault();
    const prev = focused ? (focused.previousElementSibling || items[items.length - 1]) : items[items.length - 1];
    if (prev) { focused?.classList.remove('focused'); prev.classList.add('focused'); }
  } else if (e.key === 'Enter') {
    e.preventDefault();
    if (focused) focused.click();
    else runSearch();
  } else if (e.key === 'Escape') {
    hideAutocomplete();
  }
});

document.addEventListener('click', (e) => {
  if (!e.target.closest('.search-input-group')) hideAutocomplete();
});

async function fetchAutocomplete(query) {
  try {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&countrycodes=us&limit=6&addressdetails=1`;
    const res = await fetch(url, { headers: { 'Accept-Language': 'en' } });
    const data = await res.json();
    showAutocomplete(data);
  } catch (_) { hideAutocomplete(); }
}

function showAutocomplete(results) {
  autocompleteList.innerHTML = '';
  if (!results.length) { hideAutocomplete(); return; }
  results.forEach(r => {
    const li = document.createElement('li');
    li.textContent = r.display_name;
    li.setAttribute('role', 'option');
    li.addEventListener('click', () => {
      locationInput.value = r.display_name;
      hideAutocomplete();
      geocodeAndSearch(parseFloat(r.lat), parseFloat(r.lon), r.display_name);
    });
    autocompleteList.appendChild(li);
  });
  autocompleteList.classList.add('visible');
}

function hideAutocomplete() {
  autocompleteList.classList.remove('visible');
  autocompleteList.innerHTML = '';
}

// ── Search trigger ─────────────────────────────────────────────────────────
searchBtn.addEventListener('click', runSearch);

async function runSearch() {
  const q = locationInput.value.trim();
  if (!q) { showToast('Please enter a city, ZIP, or neighborhood.'); return; }
  hideAutocomplete();
  showLoading();
  try {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(q)}&countrycodes=us&limit=1&addressdetails=1`;
    const res = await fetch(url, { headers: { 'Accept-Language': 'en' } });
    const data = await res.json();
    if (!data.length) { showEmpty('No location found. Try a different search term.'); return; }
    const r = data[0];
    geocodeAndSearch(parseFloat(r.lat), parseFloat(r.lon), r.display_name);
  } catch (_) {
    showEmpty('Could not connect to search. Please check your connection and try again.');
  }
}

function geocodeAndSearch(lat, lon, label) {
  state.center = { lat, lon, label };
  state.properties = generateProperties(lat, lon);
  applyFiltersAndRender();
  flyMapTo(lat, lon);
}

// ── Property generation (demo data seeded around real coordinates) ──────────
const TYPES = ['house', 'condo', 'townhouse'];
const STYLES = ['Colonial', 'Ranch', 'Contemporary', 'Craftsman', 'Mediterranean', 'Tudor', 'Cape Cod'];
const STREETS = ['Maple St', 'Oak Ave', 'Pine Ln', 'Cedar Blvd', 'Willow Way', 'Elm Ct', 'Birch Dr', 'Sunset Blvd', 'Hillside Rd', 'Lakeview Dr', 'Garden Way', 'Valley Rd'];
const EMOJIS = { house: '🏠', condo: '🏢', townhouse: '🏘️' };
const BADGE_RULES = [
  { label: 'New', cls: 'new', chance: 0.2 },
  { label: 'Hot', cls: 'hot', chance: 0.12 },
  { label: 'Open House', cls: '', chance: 0.1 },
];

function rand(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

function seededRand(seed, min, max) {
  const x = Math.sin(seed) * 10000;
  return min + Math.floor((x - Math.floor(x)) * (max - min + 1));
}

function generateProperties(lat, lon) {
  const count = 24;
  const props = [];
  for (let i = 0; i < count; i++) {
    const seed = lat * 1000 + lon * 100 + i * 7.3;
    const type = TYPES[seededRand(seed, 0, 2)];
    const beds = seededRand(seed + 1, 1, 5);
    const baths = seededRand(seed + 2, 1, Math.min(beds, 4));
    const sqft = seededRand(seed + 3, 600, 4500);
    const basePrice = type === 'condo' ? 280000 : type === 'townhouse' ? 420000 : 380000;
    const price = basePrice + (sqft * seededRand(seed + 4, 150, 320));
    const dlat = (seededRand(seed + 5, -120, 120)) / 10000;
    const dlon = (seededRand(seed + 6, -120, 120)) / 10000;
    const streetNum = seededRand(seed + 7, 100, 9999);
    const street = STREETS[seededRand(seed + 8, 0, STREETS.length - 1)];
    const style = STYLES[seededRand(seed + 9, 0, STYLES.length - 1)];
    const daysAgo = seededRand(seed + 10, 0, 60);

    let badge = null;
    for (const b of BADGE_RULES) {
      if ((seededRand(seed + 11 + BADGE_RULES.indexOf(b), 0, 99) / 100) < b.chance) {
        badge = b; break;
      }
    }

    props.push({
      id: i,
      type,
      style,
      beds,
      baths,
      sqft,
      price,
      lat: lat + dlat,
      lon: lon + dlon,
      address: `${streetNum} ${street}`,
      city: extractCity(state.center?.label || ''),
      daysAgo,
      badge,
      emoji: EMOJIS[type],
    });
  }
  return props;
}

function extractCity(label) {
  const parts = label.split(',');
  return parts.length > 1 ? parts[0].trim() + ',' + parts[1].trim() : parts[0].trim();
}

// ── Filters ────────────────────────────────────────────────────────────────
applyFiltersBtn.addEventListener('click', readAndApplyFilters);
resetFiltersBtn.addEventListener('click', () => {
  document.getElementById('minPrice').value = '';
  document.getElementById('maxPrice').value = '';
  document.getElementById('minSqft').value = '';
  document.getElementById('sortBy').value = 'relevant';
  document.querySelectorAll('.pill-group .pill').forEach(p => {
    p.classList.toggle('active', p.dataset.value === '');
  });
  state.filters = { minPrice: null, maxPrice: null, beds: '', baths: '', type: '', minSqft: null };
  state.sort = 'relevant';
  applyFiltersAndRender();
});

document.querySelectorAll('.pill-group').forEach(group => {
  group.addEventListener('click', (e) => {
    if (!e.target.classList.contains('pill')) return;
    group.querySelectorAll('.pill').forEach(p => p.classList.remove('active'));
    e.target.classList.add('active');
  });
});

function readAndApplyFilters() {
  state.filters = {
    minPrice: parseFloat(document.getElementById('minPrice').value) || null,
    maxPrice: parseFloat(document.getElementById('maxPrice').value) || null,
    beds: document.querySelector('#bedsFilter .pill.active')?.dataset.value || '',
    baths: document.querySelector('#bathsFilter .pill.active')?.dataset.value || '',
    type: document.querySelector('#typeFilter .pill.active')?.dataset.value || '',
    minSqft: parseFloat(document.getElementById('minSqft').value) || null,
  };
  state.sort = document.getElementById('sortBy').value;
  applyFiltersAndRender();
}

function applyFiltersAndRender() {
  const f = state.filters;
  let list = state.properties.filter(p => {
    if (f.minPrice && p.price < f.minPrice) return false;
    if (f.maxPrice && p.price > f.maxPrice) return false;
    if (f.beds && p.beds < parseInt(f.beds)) return false;
    if (f.baths && p.baths < parseInt(f.baths)) return false;
    if (f.type && p.type !== f.type) return false;
    if (f.minSqft && p.sqft < f.minSqft) return false;
    return true;
  });

  switch (state.sort) {
    case 'price_asc': list.sort((a, b) => a.price - b.price); break;
    case 'price_desc': list.sort((a, b) => b.price - a.price); break;
    case 'newest': list.sort((a, b) => a.daysAgo - b.daysAgo); break;
    case 'sqft': list.sort((a, b) => b.sqft - a.sqft); break;
  }

  state.filtered = list;
  renderCards();
  renderMapMarkers();
  updateResultsCount();
}

// ── Render cards ───────────────────────────────────────────────────────────
function renderCards() {
  if (!state.filtered.length) {
    propertyGrid.innerHTML = `
      <div class="search-empty-state">
        <div class="empty-icon">&#128269;</div>
        <h3>No properties match your filters</h3>
        <p>Try adjusting your search criteria or resetting the filters.</p>
      </div>`;
    return;
  }

  propertyGrid.innerHTML = state.filtered.map(p => `
    <div class="prop-card" data-id="${p.id}" tabindex="0" role="article" aria-label="${p.style} ${p.type} at ${p.address}">
      <div class="prop-img">
        <div class="prop-img-bg" style="background:${colorForType(p.type)}">${p.emoji}</div>
        ${p.badge ? `<span class="prop-badge ${p.badge.cls}">${p.badge.label}</span>` : ''}
        <button class="prop-fav ${state.saved.has(p.id) ? 'saved' : ''}" data-id="${p.id}" title="Save property" aria-label="Save property">
          ${state.saved.has(p.id) ? '❤️' : '🤍'}
        </button>
      </div>
      <div class="prop-info">
        <div class="prop-price">$${p.price.toLocaleString()}</div>
        <div class="prop-title">${p.style} ${capitalize(p.type)}</div>
        <div class="prop-address">${p.address}, ${p.city}</div>
        <div class="prop-specs">
          <span class="prop-spec">🛏 ${p.beds} bd</span>
          <span class="prop-spec">🚿 ${p.baths} ba</span>
          <span class="prop-spec">📐 ${p.sqft.toLocaleString()} sqft</span>
        </div>
        <div class="prop-actions">
          <a href="contact.html?prop=${encodeURIComponent(p.address)}" class="btn btn-primary">Request Info</a>
          <button class="btn btn-outline prop-map-btn" data-id="${p.id}">Map</button>
        </div>
      </div>
    </div>
  `).join('');

  // Save/favourite toggle
  propertyGrid.querySelectorAll('.prop-fav').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = parseInt(btn.dataset.id);
      if (state.saved.has(id)) { state.saved.delete(id); showToast('Removed from saved homes'); }
      else { state.saved.add(id); showToast('Saved to your homes ❤️'); }
      renderCards();
    });
  });

  // Map button — fly to marker
  propertyGrid.querySelectorAll('.prop-map-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = parseInt(btn.dataset.id);
      const p = state.properties.find(x => x.id === id);
      if (p) {
        state.map.flyTo([p.lat, p.lon], 16);
        highlightMarker(id);
      }
    });
  });

  // Card click — highlight on map
  propertyGrid.querySelectorAll('.prop-card').forEach(card => {
    card.addEventListener('click', (e) => {
      if (e.target.closest('.prop-fav') || e.target.closest('.prop-map-btn') || e.target.closest('a')) return;
      const id = parseInt(card.dataset.id);
      const p = state.properties.find(x => x.id === id);
      if (p) { state.map.flyTo([p.lat, p.lon], 16); highlightMarker(id); }
      document.querySelectorAll('.prop-card').forEach(c => c.classList.remove('highlighted'));
      card.classList.add('highlighted');
    });
    card.addEventListener('keydown', (e) => { if (e.key === 'Enter') card.click(); });
  });
}

function colorForType(type) {
  return type === 'house' ? 'linear-gradient(135deg,#c8d8e8,#a0b8d0)'
       : type === 'condo' ? 'linear-gradient(135deg,#d8e8c8,#b0d0a0)'
       : 'linear-gradient(135deg,#e8d8c8,#d0b8a0)';
}
function capitalize(s) { return s.charAt(0).toUpperCase() + s.slice(1); }

// ── Map markers ────────────────────────────────────────────────────────────
function renderMapMarkers() {
  state.markers.forEach(m => m.remove());
  state.markers = [];

  state.filtered.forEach(p => {
    const icon = L.divIcon({
      className: '',
      html: `<div style="
        background:${p.type === 'house' ? '#1a5276' : p.type === 'condo' ? '#27ae60' : '#d4a017'};
        color:#fff;font-weight:700;font-size:11px;
        padding:4px 7px;border-radius:12px;white-space:nowrap;
        box-shadow:0 2px 6px rgba(0,0,0,0.25);cursor:pointer;
        border:2px solid #fff;
      ">$${(p.price / 1000).toFixed(0)}K</div>`,
      iconSize: null,
      iconAnchor: [0, 0],
    });

    const marker = L.marker([p.lat, p.lon], { icon })
      .addTo(state.map)
      .bindPopup(`
        <div class="map-popup">
          <strong>$${p.price.toLocaleString()}</strong>
          <p>${p.style} ${capitalize(p.type)}</p>
          <p>${p.address}, ${p.city}</p>
          <p>🛏 ${p.beds} bd &nbsp;🚿 ${p.baths} ba &nbsp;📐 ${p.sqft.toLocaleString()} sqft</p>
          <a href="contact.html?prop=${encodeURIComponent(p.address)}">Request Info &rarr;</a>
        </div>
      `, { maxWidth: 220 });

    marker._propId = p.id;
    marker.on('click', () => {
      document.querySelectorAll('.prop-card').forEach(c => c.classList.remove('highlighted'));
      const card = document.querySelector(`.prop-card[data-id="${p.id}"]`);
      if (card) { card.classList.add('highlighted'); card.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); }
    });

    state.markers.push(marker);
  });

  if (state.filtered.length && state.map) {
    const group = L.featureGroup(state.markers);
    state.map.fitBounds(group.getBounds().pad(0.15));
  }
}

function highlightMarker(id) {
  state.markers.forEach(m => {
    if (m._propId === id) m.openPopup();
  });
}

function flyMapTo(lat, lon) {
  state.map.flyTo([lat, lon], 13, { duration: 1.2 });
}

// ── View toggle ────────────────────────────────────────────────────────────
gridViewBtn.addEventListener('click', () => {
  state.view = 'grid';
  propertyGrid.classList.remove('list-view');
  gridViewBtn.classList.add('active');
  listViewBtn.classList.remove('active');
});
listViewBtn.addEventListener('click', () => {
  state.view = 'list';
  propertyGrid.classList.add('list-view');
  listViewBtn.classList.add('active');
  gridViewBtn.classList.remove('active');
});

// ── Helpers ────────────────────────────────────────────────────────────────
function showLoading() {
  propertyGrid.innerHTML = `<div class="search-loading"><div class="spinner"></div><p>Searching properties…</p></div>`;
  resultsCount.textContent = 'Searching…';
}

function showEmpty(msg) {
  propertyGrid.innerHTML = `
    <div class="search-empty-state">
      <div class="empty-icon">&#128269;</div>
      <h3>${msg}</h3>
    </div>`;
  resultsCount.textContent = '0 results';
}

function updateResultsCount() {
  const n = state.filtered.length;
  const loc = state.center ? ` near ${extractCity(state.center.label)}` : '';
  resultsCount.textContent = `${n} propert${n === 1 ? 'y' : 'ies'} found${loc}`;
}

function showToast(msg) {
  let toast = document.querySelector('.toast');
  if (!toast) { toast = document.createElement('div'); toast.className = 'toast'; document.body.appendChild(toast); }
  toast.textContent = msg;
  toast.classList.add('show');
  clearTimeout(toast._t);
  toast._t = setTimeout(() => toast.classList.remove('show'), 2800);
}

// ── Init ───────────────────────────────────────────────────────────────────
initMap();

// Pre-fill from URL param (?q=...)
const urlQ = new URLSearchParams(location.search).get('q');
if (urlQ) { locationInput.value = urlQ; runSearch(); }
