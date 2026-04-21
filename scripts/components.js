const lang = localStorage.getItem('lang') || 'en';
const base = lang === 'en' ? '/assets/components' : '/' + lang + '/assets/components';

Promise.all([
  fetch(`${base}/nav.html`).then(r => r.text()),
  fetch(`${base}/footer.html`).then(r => r.text()),
  fetch(`${base}/header.html`).then(r => r.text())
])
  .then(([navHtml, footerHtml, headerHtml]) => {
    const navEl = document.getElementById('navbar');
    const footerEl = document.getElementById('footer');
    const headerEl = document.getElementById('header');
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

    window.dispatchEvent(new Event('partialsLoaded'));
  })
  .catch(err => console.error('Error loading partials:', err));