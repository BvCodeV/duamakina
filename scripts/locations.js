const LOCATION_CACHE_KEY = "locations_v1";
const LOCATION_CACHE_TTL_MS = 24 * 60 * 60 * 1000;
let locationFetchPromise = null;

function readLocationCache() {
  try {
    const raw =
      localStorage.getItem(LOCATION_CACHE_KEY) ??
      sessionStorage.getItem(LOCATION_CACHE_KEY);
    if (!raw) return null;
    const { data, ts } = JSON.parse(raw);
    if (Date.now() - ts > LOCATION_CACHE_TTL_MS) {
      localStorage.removeItem(LOCATION_CACHE_KEY);
      sessionStorage.removeItem(LOCATION_CACHE_KEY);
      return null;
    }
    return data;
  } catch {
    return null;
  }
}

function writeLocationCache(data) {
  const payload = JSON.stringify({ data, ts: Date.now() });
  try {
    localStorage.setItem(LOCATION_CACHE_KEY, payload);
  } catch {}
  try {
    sessionStorage.setItem(LOCATION_CACHE_KEY, payload);
  } catch {}
}

function getExistingLocationOptions() {
  const values = new Set();

  [
    "pickup",
    "dropoff",
    "changePickup",
    "changeDropoff",
    "changeFormPickup",
    "changeFormDropoff",
  ].forEach((id) => {
    const select = document.getElementById(id);
    if (select?.tagName !== "SELECT") return;
    [...select.options].forEach((option) => {
      if (option.value) values.add(option.value);
    });
  });

  document.querySelectorAll("datalist#locations option").forEach((option) => {
    if (option.value) values.add(option.value);
  });

  return [...values].map((name) => ({ name }));
}

async function fetchLocations() {
  const cached = readLocationCache();
  if (cached) return cached;
  if (locationFetchPromise) return locationFetchPromise;

  locationFetchPromise = (async () => {
    const client = await window.supabaseClientReady;
    if (!client) return getExistingLocationOptions();

    const { data, error } = await client
      .from("locations")
      .select("id, name, is_airport")
      .eq("is_active", true)
      .order("name", { ascending: true });

    if (error || !data) return getExistingLocationOptions();

    writeLocationCache(data);
    return data;
  })().finally(() => {
    locationFetchPromise = null;
  });

  return locationFetchPromise;
}

function setControlValue(control, preferredValue, locations) {
  if (!control || !preferredValue) return;
  const exists = locations.some((location) => location.name === preferredValue);
  if (exists) control.value = preferredValue;
}

function populateLocationControl(control, locations) {
  if (!control || locations.length === 0) return;

  if (control.tagName === "SELECT") {
    const previousValue = control.value;
    control.innerHTML = locations
      .map((location) => `<option value="${location.name}">${location.name}</option>`)
      .join("");
    setControlValue(control, previousValue, locations);
    return;
  }

  if (control.tagName === "DATALIST") {
    control.innerHTML = locations
      .map((location) => `<option value="${location.name}"></option>`)
      .join("");
  }
}

async function populateLocationControls(root = document) {
  const locations = await fetchLocations();

  [
    "pickup",
    "dropoff",
    "changePickup",
    "changeDropoff",
    "changeFormPickup",
    "changeFormDropoff",
  ].forEach((id) => populateLocationControl(root.getElementById?.(id), locations));

  populateLocationControl(root.getElementById?.("locations"), locations);

  return locations;
}

async function getLocationByName(name) {
  if (!name) return null;
  const locations = await fetchLocations();
  return locations.find((location) => location.name === name) ?? null;
}

window.DuaLocations = {
  fetchLocations,
  populateLocationControls,
  getLocationByName,
};

document.addEventListener("DOMContentLoaded", () => {
  const run = () => populateLocationControls();
  if ("requestIdleCallback" in window) {
    requestIdleCallback(run, { timeout: 1500 });
  } else {
    setTimeout(run, 0);
  }
});
