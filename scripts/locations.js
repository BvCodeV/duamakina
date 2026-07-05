const LOCATION_CACHE_KEY = "locations_v1";
const LOCATION_CACHE_TTL_MS = 5 * 60 * 1000;

function readLocationCache() {
  try {
    const raw = sessionStorage.getItem(LOCATION_CACHE_KEY);
    if (!raw) return null;
    const { data, ts } = JSON.parse(raw);
    if (Date.now() - ts > LOCATION_CACHE_TTL_MS) {
      sessionStorage.removeItem(LOCATION_CACHE_KEY);
      return null;
    }
    return data;
  } catch {
    return null;
  }
}

function writeLocationCache(data) {
  sessionStorage.setItem(LOCATION_CACHE_KEY, JSON.stringify({ data, ts: Date.now() }));
}

function getExistingLocationOptions() {s
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
  populateLocationControls();
});
