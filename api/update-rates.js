const CURRENCIES = ["EUR", "GBP", "JPY", "ALL"];
const BASE = "USD";

export default async function handler(req, res) {

  // 🔒 Auth check
  // if (req.headers.authorization !== `Bearer ${process.env.CRON_SECRET}`) {
  //   return res.status(401).json({ error: "Unauthorized" });
  // }

  const response = await fetch(
    `https://v6.exchangerate-api.com/v6/${process.env.EXCHANGE_API_KEY}/latest/${BASE}`
  );
  const data = await response.json();

  const filtered = {};
  for (const code of CURRENCIES) {
    filtered[code] = data.conversion_rates[code];
  }

  for (const code of CURRENCIES) {
    await fetch(`${process.env.SUPABASE_URL}/rest/v1/exchange_rates`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "apikey": process.env.SUPABASE_ANON_KEY,
        "Authorization": `Bearer ${process.env.SUPABASE_ANON_KEY}`,
        "Prefer": "resolution=merge-duplicates"
      },
      body: JSON.stringify({
        currency_code: code,
        rate: filtered[code],
        fetched_at: new Date().toISOString()
      })
    });
  }

  res.status(200).json({ success: true, rates: filtered });
}