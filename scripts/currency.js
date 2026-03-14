const rates = {};
const basePrice = parseFloat(document.getElementById("price").textContent);

async function fetchAllRates() {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/exchange_rates?select=currency_code,rate`, {
    headers: { "apikey": SUPABASE_ANON_KEY, "Authorization": `Bearer ${SUPABASE_ANON_KEY}` }
  });
  const data = await res.json();
  data.forEach(row => rates[row.currency_code] = row.rate);
  updatePrice(document.getElementById("currencySelect").value);
}

function updatePrice(currency) {
  const price = currency === "EUR" ? basePrice : Math.round(basePrice * rates[currency]);
  document.getElementById("price").textContent = `${price} ${currency}`;
}

document.getElementById("currencySelect").addEventListener("change", e => updatePrice(e.target.value));

fetchAllRates();