// Get only specific currencies from a base (e.g. USD)
const BASE = "USD";
const CURRENCIES = ["EUR", "GBP", "JPY", "ALL"]; // ← your chosen ones

const response = await fetch(
  `https://v6.exchangerate-api.com/v6/${process.env.EXCHANGE_API_KEY}/latest/${BASE}`
);
const data = await response.json();

// Filter only the currencies you want
const filtered = {};
for (const code of CURRENCIES) {
  filtered[code] = data.conversion_rates[code];
}

console.log(filtered);
// { EUR: 0.921, GBP: 0.786, JPY: 149.5, ALL: 109.2 }