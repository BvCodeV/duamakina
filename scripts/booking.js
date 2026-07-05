import { cacheGet, cacheSet } from '/scripts/cache.js';

const dayNumber = document.querySelectorAll(".dayNum");
const addonsCon = document.getElementById("addonCon");
const carFinalPrice = document.getElementById("carFinalPrice");
const finalAmount = document.getElementById("finalAmount");
const pickupLocationForm = document.getElementById("pickupLocationForm");
const dropoffLocationForm = document.getElementById("dropOffLocationForm");
const pickupDateForm = document.getElementById("pickupDateForm");
const dropoffDateForm = document.getElementById("dropOffDateForm");
const pickupTimeForm = document.getElementById("pickupTimeForm");
const dropoffTimeForm = document.getElementById("dropOffTimeForm");
const formPickupLoc = document.getElementById("changeFormPickup");
const formDropoffLoc = document.getElementById("changeFormDropoff");
const formPickupDate = document.getElementById("changeFormPickupDate");
const formDropoffDate = document.getElementById("changeFormDropoffDate");
const formPickupTime = document.getElementById("changeFormPickupTime");
const formDropoffTime = document.getElementById("changeFormDropoffTime");
const dropoffCheck = document.getElementById("dropoffCheck");
const changeBtn = document.getElementById("changeBtn");
const locationForm = document.getElementById("locationFilterDialog");
const carName = document.getElementById("carName");
const carNamePrice = document.getElementById("carNamePrice");
const carTransmission = document.getElementById("carTransmission");
const carLuggage = document.getElementById("carLuggage");
const carSeats = document.getElementById("carSeats");
const mainImg = document.getElementById("mainImg");
const addonPage = document.getElementById("addonPage");
const infoPage = document.getElementById("infoPage");
const bookingNxtBtn = document.getElementById("bookingNxtBtn");
const formSendBtn = document.getElementById("formSendBtn");
const addonsCardCon = document.getElementById("addonsCardCon");
const depositRule = document.getElementById("depositRule");
const depositRulePagh = document.getElementById("depositRulePagh");
const allowedCountriesCon = document.getElementById("allowedCountriesCon");
const carPageProgressBtn = document.getElementById("carPageProgressBtn");
const addonProgressBtn = document.getElementById("addonProgressBtn");
const detailsProgressBtn = document.getElementById("detailsProgressBtn");
const carPricePerDay = document.getElementById("carPricePerDay");
const cardDesc = document.getElementById("cardDesc");

function updateLocationData() {
  const updatedLocationData = {
    pickupLoc: formPickupLoc.value,
    dropoffLoc: formDropoffLoc.value,
    pickupDate: formPickupDate.value,
    dropoffDate: formDropoffDate.value,
    pickupTime: formPickupTime.value,
    dropoffTime: formDropoffTime.value,
  };
  if (dropoffCheck?.checked)
    updatedLocationData.dropoffLoc = updatedLocationData.pickupLoc;
  localStorage.setItem("locationData", JSON.stringify(updatedLocationData));
  calcDays(updatedLocationData.pickupDate, updatedLocationData.dropoffDate);
  displayData();
  displayDate();
  updateFinalPrice();
  locationForm?.hidePopover();
  locationForm?.removeAttribute?.("open");
  if (locationForm) locationForm.open = false;
}

window.updateLocationData = updateLocationData;

let pricePerDay = 0;
const EXTRA_ICON_MAP = {
  "baby-seat": "baby-seat.svg",
  "booster-seat": "booster-seat.svg",
  "child-seat": "child-seat.svg",
  wifi: "wifi.svg",
  insurance: "insurance-booking.svg",
  "insurance-booking": "insurance-booking.svg",
  gps: "gps.svg",
  "additional-driver": "driverPlus.svg",
  "driver-plus": "driverPlus.svg",
};

function getIconForSlug(slug) {
  if (EXTRA_ICON_MAP[slug]) return EXTRA_ICON_MAP[slug];
  const key = Object.keys(EXTRA_ICON_MAP).find(
    (k) => slug.includes(k) || k.includes(slug),
  );
  return key ? EXTRA_ICON_MAP[key] : "default-addon.svg";
}

// Translate an addon name based on its stable slug (falls back to the DB-provided English name).
function translateAddonName(slug, fallbackName) {
  const i18n = window.DuaI18n;
  if (!i18n || !slug) return fallbackName;
  const lang = i18n.lang;
  if (!lang || lang === "en") return fallbackName;
  // Normalise: DB slugs may use underscores (booster_seat) while valueMap uses hyphens (booster-seat).
  const normalizedSlug = slug.replace(/_/g, "-");
  const translated = i18n.tv?.("extra", normalizedSlug);
  if (!translated) return fallbackName;
  // tv() falls back to capitalize(slug) when no valueMap entry exists - detect and bail.
  const cap = normalizedSlug.charAt(0).toUpperCase() + normalizedSlug.slice(1);
  if (translated === normalizedSlug || translated === cap) return fallbackName;
  return translated;
}

// Translate an addon description based on its stable slug.
// Looks up "<slug>-desc" in valueMap.extra; falls back to the DB-provided text.
function translateAddonDescription(slug, fallbackDesc) {
  const i18n = window.DuaI18n;
  if (!i18n || !slug) return fallbackDesc ?? "";
  const lang = i18n.lang;
  if (!lang || lang === "en") return fallbackDesc ?? "";
  // Normalise: DB slugs may use underscores; valueMap uses hyphens.
  const normalizedSlug = slug.replace(/_/g, "-");
  const lookupKey = `${normalizedSlug}-desc`;
  const translated = i18n.tv?.("extra", lookupKey);
  if (!translated) return fallbackDesc ?? "";
  // tv() falls back to capitalize(lookupKey) when no valueMap entry exists.
  const cap = lookupKey.charAt(0).toUpperCase() + lookupKey.slice(1);
  if (translated === lookupKey || translated === cap) return fallbackDesc ?? "";
  return translated;
}

// Translate a country name based on its ISO country_code (e.g., "GR", "IT", "MK").
// Falls back to the DB-provided country_name if no translation is found.
function translateCountryName(countryCode, fallbackName) {
  const i18n = window.DuaI18n;
  if (!i18n || !countryCode) return fallbackName;
  const lang = i18n.lang;
  if (!lang || lang === "en") return fallbackName;
  const translated = i18n.tv?.("country", countryCode);
  if (!translated) return fallbackName;
  // tv() falls back to capitalize(value) = first char upper + rest unchanged.
  // For "XX" → "XX", for "xy" → "Xy". Detect both forms and bail.
  const cap = countryCode.charAt(0).toUpperCase() + countryCode.slice(1);
  if (translated === countryCode || translated === cap) return fallbackName;
  return translated;
}

function escapeHtml(str) {
  if (str == null) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

// Re-translate all slug-driven addon titles/descriptions and country names when the language changes.
function retranslateAddonCards() {
  // Addon titles
  document.querySelectorAll("[data-extra-slug]:not([data-extra-desc])").forEach((el) => {
    const slug = el.getAttribute("data-extra-slug");
    const source = el.getAttribute("data-extra-slug-source");
    el.textContent = translateAddonName(slug, source);
  });
  // Addon descriptions
  document.querySelectorAll("[data-extra-desc]").forEach((el) => {
    const slug = el.getAttribute("data-extra-slug");
    const source = el.getAttribute("data-extra-slug-source");
    el.textContent = translateAddonDescription(slug, source);
  });
  // Country names
  document.querySelectorAll("[data-country-code]").forEach((el) => {
    const code = el.getAttribute("data-country-code");
    const source = el.getAttribute("data-country-source");
    el.textContent = translateCountryName(code, source);
  });
  // Car transmission (aside panel)
  const transmissionEl = document.getElementById("carTransmission");
  if (transmissionEl && transmissionEl.dataset.transmissionRaw) {
    const raw = transmissionEl.dataset.transmissionRaw;
    transmissionEl.textContent =
      window.DuaI18n?.tv?.("transmission", raw) ??
      (raw ? raw.charAt(0).toUpperCase() + raw.slice(1) : "");
  }
}

window.addEventListener("languageChanged", retranslateAddonCards);

function getCarIdFromUrl() {
  return new URLSearchParams(window.location.search).get("id");
}

let bookingCarLocationsPromise = null;

function populateSelectWithLocations(select, locations) {
  if (!select || locations.length === 0) return;

  const previousValue = select.value;
  select.innerHTML = locations
    .map((location) => `<option value="${location.name}">${location.name}</option>`)
    .join("");

  if (locations.some((location) => location.name === previousValue)) {
    select.value = previousValue;
  } else {
    select.value = locations[0].name;
  }
}

async function loadBookingCarLocations() {
  const carId = getCarIdFromUrl();
  if (!carId) return [];

  const client = await window.supabaseClientReady;
  if (!client) return [];

  const { data: carLocationRows, error: carLocationError } = await client
    .from("car_locations")
    .select("location_id")
    .eq("car_id", carId);

  if (carLocationError || !carLocationRows?.length) return [];

  const locationIds = [...new Set(carLocationRows.map((row) => row.location_id).filter(Boolean))];
  if (locationIds.length === 0) return [];

  const { data: locations, error: locationsError } = await client
    .from("locations")
    .select("id, name")
    .in("id", locationIds)
    .eq("is_active", true)
    .order("name", { ascending: true });

  if (locationsError || !locations) return [];
  return locations;
}

async function populateBookingLocationDialog() {
  if (!bookingCarLocationsPromise) {
    bookingCarLocationsPromise = loadBookingCarLocations();
  }

  const locations = await bookingCarLocationsPromise;
  if (locations.length === 0) return;

  populateSelectWithLocations(formPickupLoc, locations);
  populateSelectWithLocations(formDropoffLoc, locations);
}

const getStorageData = () => ({
  locationData: JSON.parse(localStorage.getItem("locationData")),
  days: parseFloat(localStorage.getItem("daysCalc")) || 1,
});

const getCurrencySelect = () => document.getElementById("currencySelect").value;
const triggerPriceUpdate = () => window.updatePrice?.(getCurrencySelect());

const getAddonChecks = () => document.querySelectorAll(".addonCheck");
const getCountryChecks = () => document.querySelectorAll(".countryCheck");

function displayData() {
  const { locationData } = getStorageData();
  if (!locationData) return;
  pickupDateForm.textContent = locationData.pickupDate;
  dropoffDateForm.textContent = locationData.dropoffDate;
  pickupTimeForm.textContent = locationData.pickupTime;
  dropoffTimeForm.textContent = locationData.dropoffTime;
  pickupLocationForm.textContent = locationData.pickupLoc;
  dropoffLocationForm.textContent = locationData.dropoffLoc;
}

function displayDate() {
  const { days } = getStorageData();
  document
    .querySelectorAll(".dayNum")
    .forEach((day) => (day.textContent = days));
}

function updateFinalPrice(currentPricePerDay = pricePerDay) {
  const { days } = getStorageData();
  const carPrice = currentPricePerDay * days;

  carFinalPrice.textContent = carPrice;
  carFinalPrice.dataset.basePrice = carPrice;

  let finalPrice = carPrice;
  getAddonChecks().forEach((check) => {
    if (check.checked) finalPrice += parseFloat(check.dataset.price) * days;
  });
  getCountryChecks().forEach((check) => {
    if (check.checked) finalPrice += parseFloat(check.dataset.price);
  });

  finalAmount.dataset.basePrice = finalPrice;
  finalAmount.textContent = finalPrice;
  triggerPriceUpdate();
}

function updatePriceSummary() {
  const { days } = getStorageData();
  addonsCon.innerHTML = "";

  getAddonChecks().forEach((check) => {
    const card = check.closest(".addons-card-check");
    if (check.checked) {
      addonsCon.style.display = "flex";
      card?.classList.add("checked");

      const addonPrice = parseFloat(check.dataset.price) * days;
      addonsCon.insertAdjacentHTML(
        "beforeend",
        `
        <div class="addon-card">
          <div class="addon-item items">
            <p class="addon-name">${check.getAttribute("data-name")}</p>
            <div class="price-calculation">
              <p><span class="currency-sign">€</span><span class="currency-num">${parseFloat(check.dataset.price)}</span></p>
              X
              <span class="dayNum">${days}</span>
              days
            </div>
          </div>
          <div class="price-item">
            <span class="currency-sign">€</span>
            <span class="currency-num">${addonPrice}</span>
          </div>
        </div>`,
      );
    } else {
      card?.classList.remove("checked");
    }
  });
  getCountryChecks().forEach((check) => {
    const card = check.closest(".country-option-check");
    if (check.checked) {
      addonsCon.style.display = "flex";
      card?.classList.add("checked");

      const countryPrice = parseFloat(check.dataset.price);
      addonsCon.insertAdjacentHTML(
        "beforeend",
        `
        <div class="addon-card">
          <div class="addon-item items">
            <p class="addon-name">${check.getAttribute("data-name")}</p>
          </div>
          <div class="price-item">
            <span class="currency-sign">€</span>
            <span class="currency-num">${countryPrice}</span>
          </div>
        </div>`,
      );
    } else {
      card?.classList.remove("checked");
    }
  });

  triggerPriceUpdate();
  updateFinalPrice();
  window.DuaI18n?.translatePage?.();
}

function getTodayPrice(pricingRows) {
  if (!pricingRows || pricingRows.length === 0) return null;
  const today = new Date().toISOString().split("T")[0];
  const match = pricingRows.find((p) => {
    const from = p.valid_from ?? "0000-01-01";
    const to = p.valid_to ?? "9999-12-31";
    return today >= from && today <= to;
  });
  return match ?? pricingRows[0];
}

function getPrimaryPhoto(photos) {
  if (!photos || photos.length === 0) return null;
  return photos.find((p) => p.is_primary) ?? photos[0];
}

function getPhotoUrl(storagePath) {
  if (!storagePath)
    return "https://jdhigikorvtxhslxudcs.supabase.co/storage/v1/object/public/cars/car-placeholder.avif";
  if (storagePath.startsWith("http")) return storagePath;
  return `${SUPABASE_URL}/storage/v1/object/public/${storagePath}`;
}

function updateFaqSection(car, youngDriverData) {
  const depositEls = document.querySelectorAll(".deposit-amount");
  depositEls.forEach((el) => {
    if (car.deposit_amount > 0) {
      el.dataset.basePrice = car.deposit_amount;
      el.textContent = car.deposit_amount;
    } else if (car.deposit_amount === 0) {
      depositRule.textContent = "No card hold · No deposit required";
      depositRulePagh.textContent = "No deposit required";
    } else if (car.deposit_amount == null) {
      depositRule.textContent = "No card hold · No deposit required";
      depositRulePagh.textContent = "No deposit required";
    } else {
      el.textContent = "No data";
    }
  });

  if (allowedCountriesCon) {
    const permissions = car.car_cross_border_permissions ?? [];
    const availableCountries = permissions
      .map((p) => p.cross_border_countries)
      .filter((country) => country && (country.is_active ?? true));

    if (availableCountries.length === 0) {
      allowedCountriesCon.style.display = "none";
      cardDesc.textContent = "No cross-border travel allowed for this car.";
    } else {
      allowedCountriesCon.style.display = "";
      cardDesc.textContent = "Select the countries you plan to visit from the list below.";
      allowedCountriesCon.innerHTML = availableCountries
        .map((country) => {
          const safeId = `country_${country.country_code.replace(/[^a-z0-9]/gi, "_")}`;
          return `
        <div class="country-option country-option-check">
          <input type="checkbox" id="${safeId}" class="countryCheck" name="allowedCountry"
            data-name="${country.country_name}"
            data-price="${country.fee}"
          >
          <label for="${safeId}">${country.country_code}</label>
          <p data-no-translate data-country-code="${country.country_code}" data-country-source="${escapeHtml(country.country_name)}">${translateCountryName(country.country_code, country.country_name)}</p>
          <p class="country-fee"><span class="currency-sign">€</span><span class="currency-num" id="countryFee_${country.country_code}">${country.fee}</span></p>
        </div>
        `;
        })
        .join("");
      getCountryChecks().forEach((check) =>
        check.addEventListener("change", updatePriceSummary),
      );
    }
  }

  const minAgeEl = document.getElementById("minAgeNum");
  if (minAgeEl) {
    if (youngDriverData && youngDriverData.length > 0) {
      const sorted = [...youngDriverData].sort((a, b) => a.max_age - b.max_age);
      const youngest = sorted[0];
      minAgeEl.textContent = youngest.max_age ?? 18;
    } else {
      minAgeEl.textContent = 18;
    }
  }

  const additionalDriverEl = document.getElementById("additionalDriverCharge");
  if (additionalDriverEl) {
    const additionalDriverExtra = document.querySelector(
      '[data-name*="driver" i], [data-name*="additional" i]',
    );
    if (additionalDriverExtra) {
      additionalDriverEl.textContent = (() => {
        const price = parseFloat(additionalDriverExtra.dataset.price);
        additionalDriverEl.dataset.basePrice = price;
        additionalDriverEl.textContent = price;
      })();
    }
  }

  const youngDriverEl = document.getElementById("youngDriverSurcharge");
  if (youngDriverEl && youngDriverData && youngDriverData.length > 0) {
    const sorted = [...youngDriverData].sort((a, b) => a.max_age - b.max_age);
    const youngest = sorted[0];
    if (youngest.surcharge_flat != null) {
      const surcharge = parseFloat(youngest.surcharge_flat).toFixed(2);
      youngDriverEl.dataset.basePrice = surcharge;
      youngDriverEl.textContent = surcharge;
    } else if (youngest.surcharge_pct != null) {
      const surcharge = ((youngest.surcharge_pct / 100) * pricePerDay).toFixed(2);
      youngDriverEl.dataset.basePrice = surcharge;
      youngDriverEl.textContent = surcharge;
    }
  }
}

function updatePage(car, youngDriverData) {
  const pricing = getTodayPrice(car.car_pricing);
  const currentPricePerDay = pricing ? parseFloat(pricing.price_per_day) : 0;
  pricePerDay = currentPricePerDay;

  const photo = getPrimaryPhoto(car.car_photos);
  const imageUrl = getPhotoUrl(photo?.storage_path);
  const imageAlt = photo?.alt_text ?? `${car.brand} ${car.model}`;

  if (carName) carName.textContent = `${car.brand} ${car.model}`;
  if (carNamePrice) carNamePrice.textContent = `${car.brand} ${car.model}`;
  if (carLuggage) carLuggage.textContent = `${car.trunk_litres} Bags`;
  if (carSeats) carSeats.textContent = `${car.seats} Seats`;
  if (carTransmission) {
    // Store the raw DB value (e.g. "automatic") so retranslateAddonCards can re-render it.
    carTransmission.dataset.transmissionRaw = car.transmission ?? "";
    const txDisplay = window.DuaI18n?.tv?.("transmission", car.transmission)
      ?? (car.transmission
          ? car.transmission.charAt(0).toUpperCase() + car.transmission.slice(1)
          : "");
    carTransmission.textContent = txDisplay;
  }
  if (carPricePerDay) {
    carPricePerDay.dataset.basePrice = currentPricePerDay;
    carPricePerDay.textContent = parseFloat(currentPricePerDay);
  }
  if (mainImg) {
    mainImg.src = imageUrl;
    mainImg.alt = imageAlt;
  }

  updateFaqSection(car, youngDriverData);
  updateFinalPrice(currentPricePerDay);
  window.DuaI18n?.translatePage?.();
}

function buildAddonCard(extra, priceOverride) {
  const effectivePrice =
    priceOverride !== null && priceOverride !== undefined
      ? parseFloat(priceOverride)
      : parseFloat(extra.price);

  const icon = getIconForSlug(extra.slug);
  const safeId = `addon_${extra.slug.replace(/[^a-z0-9]/gi, "_")}`;

  const card = document.createElement("div");
  card.className = "addons-card addons-card-check";
  card.innerHTML = `
    <input
      type="checkbox"
      id="${safeId}"
      class="addonCheck"
      data-name="${extra.name}"
      data-price="${effectivePrice}"
      aria-label="${extra.name}"
    >
    <img src="/assets/icons/${icon}" alt="${extra.name}" loading="lazy" draggable="false">
    <div>
      <h3 class="addon-title" data-no-translate data-extra-slug="${extra.slug}" data-extra-slug-source="${escapeHtml(extra.name)}">${translateAddonName(extra.slug, extra.name)}</h3>
      <p class="addon-description" data-no-translate data-extra-desc data-extra-slug="${extra.slug}" data-extra-slug-source="${escapeHtml(extra.description ?? "")}">${translateAddonDescription(extra.slug, extra.description ?? "")}</p>
      <p class="addon-price">
        <span class="currency-sign">€</span><span class="currency-num">${effectivePrice.toFixed(2)}</span>/${window.DuaI18n?.t?.("day") ?? "day"}
      </p>
    </div>
  `;

  card.querySelector(".addonCheck").addEventListener("change", updatePriceSummary);

  return card;
}

async function loadCarExtras(carId) {
  if (!addonsCardCon) return;

  const { data, error } = await supabaseClient
    .from("car_extras")
    .select(
      `
      price_override,
      extras (
        id, slug, name, description, price, is_active
      )
    `,
    )
    .eq("car_id", carId);

  if (error || !data) return;

  addonsCardCon.innerHTML = "";

  data
    .filter((row) => row.extras?.is_active)
    .forEach((row) => {
      const card = buildAddonCard(row.extras, row.price_override);
      addonsCardCon.appendChild(card);
    });
  window.DuaI18n?.translatePage?.();
}

async function loadYoungDriverSurcharges(carId) {
  const { data, error } = await supabaseClient
    .from("young_driver_surcharges")
    .select("max_age, surcharge_pct, surcharge_flat")
    .eq("car_id", carId);

  if (error) return [];
  return data ?? [];
}

async function loadCarDetails() {
  const carId = getCarIdFromUrl();
  if (!carId) return;

  const cached = cacheGet(`car_${carId}`);


  if (cached && cached.car_cross_border_permissions !== undefined) {
    const youngDriverData = await loadYoungDriverSurcharges(carId);
    await loadCarExtras(carId);
    updatePage(cached, youngDriverData);
    window.fetchAllRates?.();
    updateFinalPrice();
    return;
  }

  const { data: car, error } = await supabaseClient
    .from("cars")
    .select(
      `
      id, brand, model, year, category, color, license_plate,
      fuel, transmission, seats, doors, has_ac, trunk_litres,
      mileage_unlimited, mileage_limit_km, extra_km_fee,
      deposit_amount, ferry_allowed, cross_border_allowed, ferry_fee,
      insurance_type, insurance_notes,
      car_pricing ( price_per_day, valid_from, valid_to ),
      car_photos  ( storage_path, alt_text, is_primary, sort_order ),
      car_cross_border_permissions (
        cross_border_countries ( country_name, country_code, fee, is_active )
      )
    `,
    )
    .eq("id", carId)
    .single();

  if (error || !car) return;

  cacheSet(`car_${carId}`, car);

  const youngDriverData = await loadYoungDriverSurcharges(carId);
  await loadCarExtras(carId);
  updatePage(car, youngDriverData);
  window.fetchAllRates?.();
  updateFinalPrice();
}

function checkOutProgress(pageBtn) {
  addonProgressBtn?.classList.remove("progress-active", "progress-completed");
  detailsProgressBtn?.classList.remove("progress-active", "progress-completed");
  carPageProgressBtn?.classList.remove("progress-active", "progress-completed");

  if (pageBtn === "addon") {
    carPageProgressBtn?.classList.add("progress-completed");
    addonProgressBtn?.classList.add("progress-active");
    infoPage.style.display = "none";
    addonPage.style.display = "flex";
    bookingNxtBtn.style.display = "block";
    formSendBtn.style.display = "none";
  } else if (pageBtn === "info") {
    carPageProgressBtn?.classList.add("progress-completed");
    addonProgressBtn?.classList.add("progress-completed");
    detailsProgressBtn?.classList.add("progress-active");
    infoPage.style.display = "flex";
    addonPage.style.display = "none";
    bookingNxtBtn.style.display = "none";
    formSendBtn.style.display = "block";
  } else {
    carPageProgressBtn?.classList.add("progress-completed");
    addonProgressBtn?.classList.remove("progress-active", "progress-completed");
    detailsProgressBtn?.classList.remove("progress-active", "progress-completed");
    addonPage.style.display = "flex";
    infoPage.style.display = "none";
    bookingNxtBtn.style.display = "block";
    formSendBtn.style.display = "none";
  }
}

bookingNxtBtn?.addEventListener("click", () => {
  checkOutProgress("info");
  window.scrollTo({ top: 0, behavior: "smooth" });
});

addonProgressBtn?.addEventListener("click", () => checkOutProgress("addon"));
detailsProgressBtn?.addEventListener("click", () => checkOutProgress("info"));

const locationUpdateBtn = document.getElementById("locationUpdateBtn");
locationUpdateBtn?.addEventListener("click", updateLocationData);

let calendarsInitialized = false;
locationForm?.addEventListener("toggle", (e) => {
  document.body.style.overflow = e.newState === "open" ? "hidden" : "";
  if (e.newState === "open" && !calendarsInitialized) {
    displayCalendarForm();
    calendarsInitialized = true;
  }
});

if (changeBtn) changeBtn.onclick = () => {
  const { locationData } = getStorageData();
  if (!locationData) return;
  populateBookingLocationDialog().then(() => {
    formPickupLoc.value = [...formPickupLoc.options].some((option) => option.value === locationData.pickupLoc)
      ? locationData.pickupLoc
      : formPickupLoc.value;
    formDropoffLoc.value = [...formDropoffLoc.options].some((option) => option.value === locationData.dropoffLoc)
      ? locationData.dropoffLoc
      : formDropoffLoc.value;
  });
  formPickupDate.value = locationData.pickupDate || "";
  formDropoffDate.value = locationData.dropoffDate || "";
  formPickupTime.value = locationData.pickupTime || "00:00";
  formDropoffTime.value = locationData.dropoffTime || "00:00";
};

carPageProgressBtn?.addEventListener("click", () => {
  window.location.href = `/pages/car.html?id=${getCarIdFromUrl()}`;
});

const closeDialogBtn = document.getElementById("closeDialog");
if (closeDialogBtn) closeDialogBtn.onclick = () => {
    locationForm?.hidePopover();
    locationForm?.removeAttribute?.("open");
    if (locationForm) locationForm.open = false;
};

const canInitializeBookingPage = Boolean(addonPage && infoPage && carFinalPrice && finalAmount);
if (canInitializeBookingPage) {
  populateBookingLocationDialog();
  loadCarDetails();
  displayData();
  displayDate();
  updateFinalPrice();
}