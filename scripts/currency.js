window.addEventListener('partialsLoaded', () => {
  const rates = {};
  const currencySelect = document.getElementById("currencySelect");
  const currencyMap = { "€": "EUR", "$": "USD", "£": "GBP", "L": "ALL" };

  async function fetchAllRates() {
    const { data, error } = await supabaseClient
      .from('currency')
      .select('currency_code, covertion_rate');

    if (error) {
      console.error('Failed to fetch rates:', error.message);
      return;
    }

    data.forEach(row => rates[row.currency_code] = row.covertion_rate);
    updatePrice(currencySelect.value);
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

  fetchAllRates();
});