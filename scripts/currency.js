window.addEventListener('partialsLoaded', () => {
  const rates = {};
  const currencySelect = document.getElementById("currencySelect");
  if (!currencySelect) return;
  const currencyMap = { "€": "EUR", "$": "USD", "£": "GBP", "L": "ALL" };
  const CACHE_KEY = "currency_rates_v1";
  const CACHE_TTL_MS = 24 * 60 * 60 * 1000;

  function readCachedRates() {
    try {
      const raw = localStorage.getItem(CACHE_KEY);
      if (!raw) return null;
      const { data, ts } = JSON.parse(raw);
      if (Date.now() - ts > CACHE_TTL_MS) {
        localStorage.removeItem(CACHE_KEY);
        return null;
      }
      return data;
    } catch {
      return null;
    }
  }

  function writeCachedRates(data) {
    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify({ data, ts: Date.now() }));
    } catch {}
  }

  function applyRates(data) {
    Object.keys(rates).forEach((key) => delete rates[key]);
    data.forEach(row => rates[row.currency_code] = row.covertion_rate);
    updatePrice(currencySelect.value);
  }

  async function fetchAllRates() {
    const cached = readCachedRates();
    if (cached) {
      applyRates(cached);
      return;
    }

    const client = await window.supabaseClientReady;
    if (!client) return;

    const { data, error } = await client
      .from('currency')
      .select('currency_code, covertion_rate');

    if (error) {
      console.error('Failed to fetch rates:', error.message);
      return;
    }

    writeCachedRates(data);
    applyRates(data);
  }

  window.updatePrice = function(currency) {
    const basePriceEls = document.querySelectorAll('.currency-num');
    const currencySignEls = document.querySelectorAll('.currency-sign');
    const sign = Object.keys(currencyMap).find(key => currencyMap[key] === currency);

    basePriceEls.forEach(el => {
      const base = parseFloat(el.dataset.basePrice ?? el.textContent);
      el.dataset.basePrice = base;
      const value = currency === "EUR" ? base : base * rates[currency];
      el.textContent = value.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      });
    });

    currencySignEls.forEach(el => el.textContent = sign);
  }

  currencySelect.addEventListener("change", e => {
    localStorage.setItem('selectedCurrency', e.target.value);
    window.updatePrice(e.target.value);
  });

  window.fetchAllRates = fetchAllRates;
  fetchAllRates();
});
