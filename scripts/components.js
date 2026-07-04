const base = '/assets/components';

function attachMobileMenuHandlers() {
  const button = document.getElementById('menuBtn');
  const menu = document.getElementById('menu');

  if (!button || !menu) return;

  button.onclick = (event) => {
    event.preventDefault();
    event.stopPropagation();
    const isOpen = button.getAttribute('aria-expanded') === 'true';
    button.setAttribute('aria-expanded', String(!isOpen));
    menu.classList.toggle('is-open', !isOpen);
    menu.style.display = !isOpen ? 'block' : 'none';
  };

  menu.onclick = (event) => {
    if (event.target.closest('a')) {
      button.setAttribute('aria-expanded', 'false');
      menu.classList.remove('is-open');
      menu.style.display = 'none';
    }
  };
}

function loadPartials() {
  const navEl = document.getElementById('navbar');
  const footerEl = document.getElementById('footer');
  const headerEl = document.getElementById('header');

  if (!navEl && !footerEl && !headerEl) {
    window.dispatchEvent(new Event('partialsLoaded'));
    return;
  }

  Promise.all([
    fetch(`${base}/nav.html`).then(r => r.text()),
    fetch(`${base}/footer.html`).then(r => r.text()),
    fetch(`${base}/header.html`).then(r => r.text())
  ])
    .then(([navHtml, footerHtml, headerHtml]) => {
      if (navEl) navEl.innerHTML = navHtml;
      if (footerEl) footerEl.innerHTML = footerHtml;
      if (headerEl) headerEl.innerHTML = headerHtml;

      const currencySelect = document.getElementById('currencySelect');
      if (currencySelect) {
        const saved = localStorage.getItem('selectedCurrency');
        if (saved) currencySelect.value = saved;
        currencySelect.addEventListener('change', (e) => {
          localStorage.setItem('selectedCurrency', e.target.value);
        });
      }

      attachMobileMenuHandlers();

      window.dispatchEvent(new Event('partialsLoaded'));
    })
    .catch(err => console.error('Error loading partials:', err));
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', loadPartials, { once: true });
} else {
  loadPartials();
}
