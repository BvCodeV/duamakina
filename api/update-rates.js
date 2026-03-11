// ✏️ Edit this list to control exactly what gets stored
const CURRENCIES = ["EUR", "GBP", "ALL"];
const BASE_CURRENCY = "USD";

export default async function handler(req, res) {

  // 🔒 Security check
  if (req.headers.authorization !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  // 1. Fetch ONLY the currencies you listed above
  const response = await fetch(
    `https://api.frankfurter.app/latest?from=${BASE_CURRENCY}&to=${CURRENCIES.join(",")}`
  );
  const data = await response.json();

  // 2. Store ONLY those currencies in Supabase
  for (const code of CURRENCIES) {
    await fetch(`${process.env.SUPABASE_URL}/rest/v1/exchange_rates`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "apikey": process.env.SUPABASE_ANON_KEY,
        "Authorization": `Bearer ${process.env.SUPABASE_ANON_KEY}`,
        "Prefer": "resolution=merge-duplicates" // updates existing row, no duplicates
      },
      body: JSON.stringify({
        currency_code: code,
        rate: data.rates[code],
        fetched_at: new Date().toISOString()
      })
    });
  }

  res.status(200).json({ success: true, stored: CURRENCIES, rates: data.rates });
}