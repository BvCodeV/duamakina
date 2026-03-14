Promise.all([
  fetch('/assets/components/nav.html').then(r => r.text()),
  fetch('/assets/components/footer.html').then(r => r.text()),
  fetch('/assets/components/header.html').then(r => r.text())
])
  .then(([navHtml, footerHtml, headerHtml]) => {
    const navEl = document.getElementById('navbar');
    const footerEl = document.getElementById('footer');
    const headerEl = document.getElementById('header');
    if (navEl) navEl.innerHTML = navHtml;
    if (footerEl) footerEl.innerHTML = footerHtml;
    if (headerEl) headerEl.innerHTML = headerHtml;
    // Dispatch an event so other modules can act after partials are injected
    window.dispatchEvent(new Event('partialsLoaded'));
  })
  .catch(err => console.error('Error loading partials:', err));