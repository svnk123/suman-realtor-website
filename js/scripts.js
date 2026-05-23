// Mobile nav toggle
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');
if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => navLinks.classList.toggle('open'));
  document.addEventListener('click', (e) => {
    if (!navToggle.contains(e.target) && !navLinks.contains(e.target)) {
      navLinks.classList.remove('open');
    }
  });
}

// Listings filter
function filterListings() {
  const type = document.getElementById('filterType')?.value;
  const beds = document.getElementById('filterBeds')?.value;
  const price = document.getElementById('filterPrice')?.value;
  const cards = document.querySelectorAll('#allListings .listing-card');

  cards.forEach(card => {
    const matchType = !type || card.dataset.type === type;
    const matchBeds = !beds || parseInt(card.dataset.beds) >= parseInt(beds);
    const matchPrice = !price || parseInt(card.dataset.price) <= parseInt(price);
    card.style.display = (matchType && matchBeds && matchPrice) ? '' : 'none';
  });
}

// Contact form
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const status = document.getElementById('formStatus');
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();

    if (!name || !email || !message) {
      status.textContent = 'Please fill in all required fields.';
      status.className = 'form-status error';
      return;
    }

    // Placeholder: replace with actual form submission (e.g. Formspree, EmailJS)
    status.textContent = 'Thank you! Your message has been sent. I\'ll be in touch shortly.';
    status.className = 'form-status success';
    contactForm.reset();
  });
}
