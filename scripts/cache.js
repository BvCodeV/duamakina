const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

export function cacheSet(key, data) {
  sessionStorage.setItem(key, JSON.stringify({
    data,
    ts: Date.now()
  }));
}

export function cacheGet(key) {
  try {
    const raw = sessionStorage.getItem(key);
    if (!raw) return null;
    const { data, ts } = JSON.parse(raw);
    if (Date.now() - ts > CACHE_TTL_MS) {
      sessionStorage.removeItem(key);
      return null;
    }
    return data;
  } catch {
    return null;
  }
}

export function cacheClear(key) {
  sessionStorage.removeItem(key);
}