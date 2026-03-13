const CURRENCIES = ["EUR", "GBP", "JPY", "ALL"];
const BASE = "USD";

export default async function handler(req, res) {
  const response = await fetch(
    `https://v6.exchangerate-api.com/v6/${process.env.EXCHANGE_API_KEY}/latest/${BASE}`
  );
  const data = await response.json();

  const filtered = {};
  for (const code of CURRENCIES) {
    filtered[code] = data.conversion_rates[code];
  }

  const errors = [];

  for (const code of CURRENCIES) {
    const dbRes = await fetch(`${process.env.SUPABASE_URL}/rest/v1/exchange_rates`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "apikey": process.env.SUPABASE_SERVICE_KEY,           // ✅ changed
        "Authorization": `Bearer ${process.env.SUPABASE_SERVICE_KEY}`, // ✅ changed
        "Prefer": "resolution=merge-duplicates"
      },
      body: JSON.stringify({
        currency_code: code,
        rate: filtered[code],
        fetched_at: new Date().toISOString()
      })
    });

    if (!dbRes.ok) {
      const err = await dbRes.json();
      errors.push({ code, err });
    }
  }

  if (errors.length > 0) {
    return res.status(500).json({ success: false, errors });
  }

  res.status(200).json({ success: true, rates: filtered });
}
