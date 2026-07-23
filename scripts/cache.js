const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

export function cacheSet(key, data) {
  const payload = JSON.stringify({
    data,
    ts: Date.now()
  });
  try {
    sessionStorage.setItem(key, payload);
  } catch {}
  try {
    localStorage.setItem(key, payload);
  } catch {}
}

export function cacheGet(key) {
  try {
    const raw = sessionStorage.getItem(key) ?? localStorage.getItem(key);
    if (!raw) return null;
    const { data, ts } = JSON.parse(raw);
    if (Date.now() - ts > CACHE_TTL_MS) {
      sessionStorage.removeItem(key);
      localStorage.removeItem(key);
      return null;
    }
    return data;
  } catch {
    return null;
  }
}

export function cacheClear(key) {
  try {
    sessionStorage.removeItem(key);
  } catch {}
  try {
    localStorage.removeItem(key);
  } catch {}
}
