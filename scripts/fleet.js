import { cacheGet, cacheSet } from "/scripts/cache.js";

const filterBtn = document.getElementById("filterBtn");
const sidebarFilterEl = document.getElementById("sidebarFilter");
const closeSidebarBtnEl = document.getElementById("closeSidebarBtn");
const automaticPopular = document.getElementById("automaticFilterBox");
const milagePopular = document.getElementById("milageFilterBox");
const acPopular = document.getElementById("acFilterBox");
const seatsPopular = document.getElementById("seatsFilterBox");
const electricPopular = document.getElementById("electricFilterBox");
const freeCancelPopular = document.getElementById("freeCancelFilterBox");
const specialPopular = document.getElementById("specialFilterBox");
const pillsCon = document.getElementById("filterPillsCon");
const carTypePills = document.querySelectorAll(".type-pill");
const allCarTypePill = document.getElementById("allPill");
const locationDialog = document.getElementById("locationFilterDialog");
const filtersDialog = document.getElementById("filtersDialog");
const container = document.querySelector(".cars-card-con");
const carNum = document.getElementById("carNum");
const totalCarNum = document.getElementById("totalCars");
const filteredCarNum = document.getElementById("carNumFilter");
const dayTxt = document.getElementById("dayNumFleet");
let activeCarType = document.querySelector(".selected-type");
const isMobile = window.matchMedia("(max-width: 745px)").matches;
const pickupTxt = document.getElementById("pickupTxt");
const dropoffTxt = document.getElementById("dropoffTxt");
const pickupDateTxt = document.getElementById("pickupDateTxt");
const dropoffDateTxt = document.getElementById("dropoffDateTxt");
const pickupTimeTxt = document.getElementById("pickupTimeTxt");
const dropoffTimeTxt = document.getElementById("dropoffTimeTxt");
const pickupDateMobile = document.getElementById("pickupDateMobile");
const dropoffDateMobile = document.getElementById("dropoffDateMobile");
const headerLoc = document.getElementById("headerLoc");
const locationUpdateBtn = document.getElementById("locationUpdateBtn");
const minR = document.getElementById("min-range");
const maxR = document.getElementById("max-range");
const fill = document.getElementById("fill");
const GAP = 50;

function getDefaultLocationData() {
  const today = new Date();
  const dropoff = new Date(today);
  dropoff.setDate(today.getDate() + 5);
  const fmt = (d) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  return {
    pickupLoc: "Tirana Airport (TIA)",
    dropoffLoc: "Tirana Airport (TIA)",
    pickupDate: fmt(today),
    dropoffDate: fmt(dropoff),
    pickupTime: "10:00",
    dropoffTime: "10:00",
  };
}

function displayLocationDataSearch() {
  let locationData = JSON.parse(localStorage.getItem("locationData"));
  if (!locationData) {
    locationData = getDefaultLocationData();
    localStorage.setItem("locationData", JSON.stringify(locationData));
    calcDays(locationData.pickupDate, locationData.dropoffDate);
  }
  const days = localStorage.getItem("daysCalc");
  pickupTxt.textContent = locationData.pickupLoc;
  dropoffTxt.textContent = locationData.dropoffLoc;
  pickupDateTxt.textContent = locationData.pickupDate;
  dropoffDateTxt.textContent = locationData.dropoffDate;
  pickupTimeTxt.textContent = locationData.pickupTime;
  dropoffTimeTxt.textContent = locationData.dropoffTime;
  if (pickupDateMobile) pickupDateMobile.textContent = locationData.pickupDate;
  if (dropoffDateMobile)
    dropoffDateMobile.textContent = locationData.dropoffDate;
  headerLoc.textContent = locationData.pickupLoc;
  dayTxt.textContent = days;
}

displayLocationDataSearch();

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

function capitalize(str) {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function normalizeInsuranceValue(value) {
  if (!value) return null;
  const normalized = value.toString().trim().toLowerCase();
  if (normalized === "full") return "premium";
  if (
    normalized === "third-party" ||
    normalized === "third party" ||
    normalized === "thirdparty"
  )
    return "basic";
  if (
    normalized === "premium" ||
    normalized === "basic" ||
    normalized === "none"
  )
    return normalized;
  return normalized;
}

function getInsurancePillLabel(value) {
  const normalized = normalizeInsuranceValue(value);
  if (normalized === "none")
    return window.DuaI18n?.t?.("common.unit.no_insurance") ?? "No insurance";
  if (normalized === "premium")
    return (
      window.DuaI18n?.t?.("common.unit.premium_insurance") ??
      "Premium insurance"
    );
  if (normalized === "basic")
    return (
      window.DuaI18n?.t?.("common.unit.basic_insurance") ?? "Basic insurance"
    );
  const translated = window.DuaI18n?.tv?.("values.insurance", normalized);
  return `${translated ?? capitalize(normalized)} insurance`;
}

function buildCarCard(car) {
  const pricing = getTodayPrice(car.car_pricing);
  const photo = getPrimaryPhoto(car.car_photos);
  const imageUrl = getPhotoUrl(photo?.storage_path);
  const imageAlt = photo?.alt_text ?? `${car.brand} ${car.model}`;
  const price = pricing ? parseFloat(pricing.price_per_day).toFixed(2) : "N/A"; // Price calculation
  const transmissionCode = (car.transmission || "").toLowerCase();
  const transmission =
    window.DuaI18n?.tv?.("values.transmission", transmissionCode) ??
    capitalize(car.transmission);
  const trunkLitres = car.trunk_litres ?? "—";
  const i18n = window.DuaI18n;
  const seatsLabel = i18n?.plural?.("seats", car.seats) ?? `${car.seats} Seats`;
  const bagsLabel =
    i18n?.plural?.("bags", car.trunk_litres ?? 2) ?? `${trunkLitres} Bags`;
  const doorsLabel = i18n?.plural?.("doors", car.doors) ?? `${car.doors} Doors`;
  const acLabel = i18n?.t?.("car.spec.ac_placeholder") ?? "A/C";
  const unlimitedMileageLabel =
    i18n?.t?.("fleet.filters.unlimited_mileage") ?? "Unlimited Mileage";
  const freeCancelLabel =
    i18n?.t?.("fleet.filters.free_cancellation") ?? "Free Cancellation";
  const assistanceLabel =
    i18n?.t?.("common.unit.assistance_247") ?? "24/7 Assistance";
  const fromLabel = i18n?.t?.("fleet.state.from") ?? "From";
  const perDayLabel = i18n?.t?.("fleet.state.per_day") ?? "per day";
  const viewDetailsLabel =
    i18n?.t?.("fleet.state.view_details") ?? "View Details";
  return `\n    <div class="car-card" data-car-id="${car.id}">\n      <img src="${imageUrl}" alt="${imageAlt}" class="car-image" loading="lazy" draggable="false">\n      <div class="card-body">\n        <h2 class="car-title">${car.brand} ${car.model}</h2>\n        <ul class="car-features">\n          <li><img src="/assets/icons/person.svg" alt="person icon" loading="lazy" draggable="false"> <span data-i18n-original='${seatsLabel}'>${seatsLabel}</span></li>\n          <li><img src="/assets/icons/bag.svg" alt="bag icon" loading="lazy" draggable="false"> <span data-i18n-original='${bagsLabel}'>${bagsLabel}</span></li>\n          <li><img src="/assets/icons/door.svg" alt="door icon" loading="lazy" draggable="false"> <span data-i18n-original='${doorsLabel}'>${doorsLabel}</span></li>\n          <li><img src="/assets/icons/gears.svg" alt="gears icon" loading="lazy" draggable="false"> ${transmission}</li>\n          ${car.has_ac ? `<li><img src="/assets/icons/ac.svg" alt="ac icon" loading="lazy" draggable="false"> ${acLabel}</li>` : ""}\n        </ul>\n        <ul class="car-amenities">\n          ${car.mileage_unlimited ? `<li><img src="/assets/icons/checkmark.svg" alt="checkmark icon" loading="lazy" draggable="false"> ${unlimitedMileageLabel}</li>` : ""}\n          <li><img src="/assets/icons/checkmark.svg" alt="checkmark icon" loading="lazy" draggable="false"> ${freeCancelLabel}</li>\n          <li><img src="/assets/icons/checkmark.svg" alt="checkmark icon" loading="lazy" draggable="false"> ${assistanceLabel}</li>\n        </ul>\n      </div>\n      <hr>\n      <div class="card-end">\n        <div class="car-price">\n          <span>${fromLabel}</span>\n          <div class="price">\n            <span class="currency-sign" style="font-size:1em;font-weight:bold;color:var(--color-txt-primary);">€</span><span class="currency-num" style="font-size:1em;font-weight:bold;color:var(--color-txt-primary);">${price}</span>\n          </div>\n          <span>${perDayLabel}</span>\n        </div>\n        <a href="/pages/car.html?id=${car.id}" class="rent-now-btn" id="viewDetailsBtn">${viewDetailsLabel}</a>\n      </div>\n    </div>\n  `;
}

function sortCars(cars, sortValue) {
  const sorted = [...cars];
  switch (sortValue) {
    case "lToH":
      return sorted.sort((a, b) => {
        const pa = parseFloat(
          getTodayPrice(a.car_pricing)?.price_per_day ?? Infinity,
        );
        const pb = parseFloat(
          getTodayPrice(b.car_pricing)?.price_per_day ?? Infinity,
        );
        return pa - pb;
      });

    case "hToL":
      return sorted.sort((a, b) => {
        const pa = parseFloat(getTodayPrice(a.car_pricing)?.price_per_day ?? 0);
        const pb = parseFloat(getTodayPrice(b.car_pricing)?.price_per_day ?? 0);
        return pb - pa;
      });

    case "newest":
      return sorted.sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at),
      );

    case "popular":
    default:
      return sorted.sort((a, b) => a.brand.localeCompare(b.brand));
  }
}

const activeFilters = {
  automatic: false,
  mileage: false,
  ac: false,
  seats: false,
  electric: false,
  freeCancel: false,
  special: false,
  brand: [],
  make: [],
  year: "any",
  transmission: [],
  fuel: [],
  seating: [],
  luggage: null,
  deposit: null,
  insurance: null,
  driverExperience: null,
  minPrice: 0,
  maxPrice: 200,
  carType: null,
};

function getCarMinDriverAge(car) {
  const surchargeData = car.young_driver_surcharges;
  if (!Array.isArray(surchargeData) || surchargeData.length === 0) return 18;
  const ages = surchargeData
    .map((row) => parseInt(row.max_age, 10))
    .filter((age) => !Number.isNaN(age));
  return ages.length === 0 ? 18 : Math.min(...ages);
}

function carMatchesDriverExperience(car) {
  if (!activeFilters.driverExperience) return true;
  const minAge = getCarMinDriverAge(car);
  switch (activeFilters.driverExperience) {
    case "under21":
      return minAge <= 20;

    case "21-24":
      return minAge <= 24;

    case "over25":
      return true;

    default:
      return true;
  }
}

function carHasSpecialOffer(car) {
  return Array.isArray(car.car_pricing)
    ? car.car_pricing.some((pricing) => pricing.is_special_offer)
    : false;
}

function applyFilters(cars) {
  return cars.filter((car) => {
    const pricing = getTodayPrice(car.car_pricing);
    const price = pricing ? parseFloat(pricing.price_per_day) : 0;
    if (activeFilters.automatic && car.transmission !== "automatic")
      return false;
    if (activeFilters.mileage && !car.mileage_unlimited) return false;
    if (activeFilters.ac && !car.has_ac) return false;
    if (activeFilters.seats && car.seats < 4) return false;
    if (activeFilters.electric && car.fuel !== "electric") return false;
    if (activeFilters.special && !carHasSpecialOffer(car)) return false;
    if (
      activeFilters.brand.length > 0 &&
      !activeFilters.brand.includes(car.brand)
    )
      return false;
    if (
      activeFilters.make.length > 0 &&
      !activeFilters.make.includes(car.model)
    )
      return false;
    if (activeFilters.year !== "any") {
      if (car.year < parseInt(activeFilters.year)) return false;
    }
    if (activeFilters.transmission.length > 0) {
      if (!activeFilters.transmission.includes(car.transmission)) return false;
    }
    if (activeFilters.fuel.length > 0) {
      if (!activeFilters.fuel.includes(car.fuel)) return false;
    }
    if (activeFilters.seating.length > 0) {
      if (!activeFilters.seating.map((s) => parseInt(s)).includes(car.seats))
        return false;
    }
    if (activeFilters.luggage) {
      const bags = car.trunk_litres ?? 0;
      if (activeFilters.luggage === "1-2" && (bags < 1 || bags > 2))
        return false;
      if (activeFilters.luggage === "3-4" && (bags < 3 || bags > 4))
        return false;
      if (activeFilters.luggage === "5-6" && (bags < 5 || bags > 6))
        return false;
    }
    if (activeFilters.deposit) {
      if (activeFilters.deposit === "none" && car.deposit_amount > 0)
        return false;
      if (
        activeFilters.deposit !== "none" &&
        car.deposit_amount > parseInt(activeFilters.deposit)
      )
        return false;
    }
    if (activeFilters.insurance) {
      const selectedInsurance = normalizeInsuranceValue(
        activeFilters.insurance,
      );
      const carInsurance = normalizeInsuranceValue(car.insurance_type);
      if (selectedInsurance !== carInsurance) return false;
    }
    if (!carMatchesDriverExperience(car)) return false;
    if (price < activeFilters.minPrice || price > activeFilters.maxPrice)
      return false;
    if (
      activeFilters.carType &&
      activeFilters.carType !== "all" &&
      car.category !== activeFilters.carType
    )
      return false;
    return true;
  });
}

let allCars = [];
let isCarsLoading = false;

function attachPrefetchListeners() {
  container.querySelectorAll(".car-card[data-car-id]").forEach((card) => {
    const carId = card.dataset.carId;
    const link = card.querySelector("a.rent-now-btn");
    if (!link) return;
    link.addEventListener(
      "mouseenter",
      async () => {
        if (cacheGet(`car_${carId}`)) return;
        const pageLink = document.createElement("link");
        pageLink.rel = "prefetch";
        pageLink.href = `/pages/car.html?id=${carId}`;
        document.head.appendChild(pageLink);
        const { data: car } = await supabaseClient
          .from("cars")
          .select(
            `\n          id, brand, model, year, category, color,\n          fuel, transmission, seats, doors, has_ac, trunk_litres,\n          mileage_unlimited, mileage_limit_km, extra_km_fee,\n          deposit_amount, ferry_allowed, cross_border_allowed, ferry_fee,\n          insurance_type, insurance_notes,\n          car_pricing ( price_per_day, valid_from, valid_to ),\n          car_photos  ( storage_path, alt_text, is_primary, sort_order )\n        `,
          )
          .eq("id", carId)
          .single();
        if (car) cacheSet(`car_${carId}`, car);
      },
      {
        once: true,
      },
    );
  });
}

function renderCars(sortValue) {
  if (!container) return;
  if (isCarsLoading && allCars.length === 0) return;
  const sort =
    sortValue ?? document.getElementById("carSort")?.value ?? "popular";
  const filtered = applyFilters(allCars);
  const sorted = sortCars(filtered, sort);
  if (carNum) carNum.textContent = sorted.length;
  if (filteredCarNum) filteredCarNum.textContent = sorted.length;
  if (sorted.length === 0) {
    const noMatch =
      window.DuaI18n?.t?.("fleet.state.no_match") ??
      "No cars match your filters.";
    const resetPrompt =
      window.DuaI18n?.t?.("fleet.state.reset_prompt") ??
      "Please reset your filters.";
    container.innerHTML = `\n    <div class="match-con">\n      <h1 style="color: var(--color-txt-secondary)">${noMatch}</h1>\n      <p>${resetPrompt}</p>\n    </div>\n    `;
    return;
  }
  const fragment = document.createDocumentFragment();
  sorted.forEach((car) => {
    const div = document.createElement("div");
    div.innerHTML = buildCarCard(car);
    fragment.appendChild(div.firstElementChild);
  });
  container.innerHTML = "";
  container.appendChild(fragment);
  attachPrefetchListeners();
  window.DuaI18n?.translatePage?.();
}

function refreshFleetView(sortValue) {
  if (!container) return;
  if (isCarsLoading && allCars.length === 0) return;
  renderCars(sortValue);
  requestAnimationFrame(() => {
    window.DuaI18n?.translatePage?.();
  });
}

const pillsConfig = [
  {
    checkbox: automaticPopular,
    label: "Automatic",
    key: "automatic",
  },
  {
    checkbox: milagePopular,
    label: "Unlimited Mileage",
    key: "mileage",
  },
  {
    checkbox: acPopular,
    label: "AC",
    key: "ac",
  },
  {
    checkbox: seatsPopular,
    label: "4+ Seats",
    key: "seats",
  },
  {
    checkbox: electricPopular,
    label: "Electric",
    key: "electric",
  },
  {
    checkbox: freeCancelPopular,
    label: "Free Cancellation",
    key: "freeCancel",
  },
  {
    checkbox: specialPopular,
    label: "Special Offers",
    key: "special",
  },
];

const fuelDisplayNames = {
  gasoline: "Petrol",
  diesel: "Diesel",
  electric: "Electric",
  hybrid: "Hybrid",
  "plug-in hybrid": "Plug-in Hybrid",
  lpg: "LPG",
};

function translateFuelLabel(code) {
  return (
    window.DuaI18n?.tv?.("values.fuel", code) ??
    fuelDisplayNames[code] ??
    capitalize(code)
  );
}

function translateTransmissionLabel(code) {
  return window.DuaI18n?.tv?.("values.transmission", code) ?? capitalize(code);
}

const advancedPillDefs = [
  {
    key: "brand",
    getLabel: () =>
      activeFilters.brand.length > 0 ? activeFilters.brand.join(", ") : null,
    reset: () => {
      brandTS?.clear(true);
      activeFilters.brand = [];
      makeTS?.clear(true);
      activeFilters.make = [];
      updateMakeOptions([]);
    },
  },
  {
    key: "make",
    getLabel: () =>
      activeFilters.make.length > 0 ? activeFilters.make.join(", ") : null,
    reset: () => {
      makeTS?.clear(true);
      activeFilters.make = [];
    },
  },
  {
    key: "year",
    getLabel: () => {
      if (!activeFilters.year || activeFilters.year === "any") return null;
      const yearNum = parseInt(activeFilters.year);
      return (
        window.DuaI18n?.t?.("fleet.pill.year_or_newer", {
          year: yearNum,
        }) ?? `${yearNum} or newer`
      );
    },
    reset: () => {
      activeFilters.year = "any";
      uncheckRadioGroup("year");
    },
  },
  {
    key: "driverExperience",
    getLabel: () => {
      if (!activeFilters.driverExperience) return null;
      const labels = {
        under21: window.DuaI18n?.t?.("values.misc.under_21") ?? "Under 21",
        "21-24": "21–24",
        over25: window.DuaI18n?.t?.("values.misc.over_25") ?? "Over 25",
      };
      return labels[activeFilters.driverExperience] ?? null;
    },
    reset: () => {
      activeFilters.driverExperience = null;
      uncheckRadioGroup("driverExperience");
    },
  },
  {
    key: "transmission",
    getLabel: () =>
      activeFilters.transmission.length > 0
        ? activeFilters.transmission
            .map((t) => translateTransmissionLabel(t))
            .join(", ")
        : null,
    reset: () => {
      activeFilters.transmission = [];
      uncheckCheckboxGroup("transmission");
    },
  },
  {
    key: "fuel",
    getLabel: () =>
      activeFilters.fuel.length > 0
        ? activeFilters.fuel.map((f) => translateFuelLabel(f)).join(", ")
        : null,
    reset: () => {
      activeFilters.fuel = [];
      uncheckCheckboxGroup("fuel");
    },
  },
  {
    key: "seating",
    getLabel: () =>
      activeFilters.seating.length > 0
        ? activeFilters.seating
            .map((s) => window.DuaI18n?.plural?.("seats", s) ?? `${s} Seats`)
            .join(", ")
        : null,
    reset: () => {
      activeFilters.seating = [];
      uncheckCheckboxGroup("seats");
    },
  },
  {
    key: "luggage",
    getLabel: () => {
      if (!activeFilters.luggage) return null;
      return (
        window.DuaI18n?.plural?.("bags", activeFilters.luggage) ??
        `${activeFilters.luggage} Bags`
      );
    },
    reset: () => {
      activeFilters.luggage = null;
      uncheckRadioGroup("luggage");
    },
  },
  {
    key: "deposit",
    getLabel: () => {
      if (!activeFilters.deposit) return null;
      const noDepositLabel =
        window.DuaI18n?.t?.("values.misc.no_deposit") ?? "No Deposit";
      const labels = {
        none: noDepositLabel,
        500: "< €500",
        750: "< €750",
        1e3: "< €1,000",
      };
      return labels[activeFilters.deposit] ?? `< €${activeFilters.deposit}`;
    },
    reset: () => {
      activeFilters.deposit = null;
      uncheckRadioGroup("deposit");
    },
  },
  {
    key: "insurance",
    getLabel: () =>
      activeFilters.insurance
        ? getInsurancePillLabel(activeFilters.insurance)
        : null,
    reset: () => {
      activeFilters.insurance = null;
      uncheckRadioGroup("insurance");
    },
  },
  {
    key: "price",
    getLabel: () =>
      activeFilters.minPrice !== 0 || activeFilters.maxPrice !== 200
        ? `Price: €${activeFilters.minPrice}–€${activeFilters.maxPrice}`
        : null,
    reset: () => {
      activeFilters.minPrice = 0;
      activeFilters.maxPrice = 200;
      if (minR) minR.value = 0;
      if (maxR) maxR.value = 200;
      updatePriceRange.call(minR);
    },
  },
];

function getActiveForm() {
  return (
    document.querySelector("#filtersDialog .main-dialog") ??
    document.querySelector(".mobile-advanced-filters .main-dialog")
  );
}

function uncheckRadioGroup(name) {
  getActiveForm()
    ?.querySelectorAll(`input[name="${name}"]`)
    .forEach((r) => (r.checked = false));
}

function uncheckCheckboxGroup(name) {
  getActiveForm()
    ?.querySelectorAll(`input[name="${name}"]`)
    .forEach((r) => (r.checked = false));
}

const POPULAR_PILL_LABEL_KEYS = {
  automatic: "fleet.filters.automatic_transmission",
  mileage: "fleet.filters.unlimited_mileage",
  ac: "fleet.filters.air_conditioning",
  seats: "fleet.filters.seats_4plus",
  electric: "fleet.filters.electric",
  freeCancel: "fleet.filters.free_cancellation",
  special: "fleet.filters.special_offers",
};

function popularPillLabel(key, fallback) {
  return window.DuaI18n?.t?.(POPULAR_PILL_LABEL_KEYS[key]) ?? fallback;
}

function buildPillHTML(label, pillKey, advKey = null) {
  const dataAdv = advKey ? `data-advanced="${advKey}"` : "";
  return `<div class="filter-pill" data-key="${pillKey}" ${dataAdv}><p>${label}</p><button aria-label="Remove ${label} filter">X</button></div>`;
}

function insertPillBeforeClearAll(html) {
  const btn = pillsCon.querySelector(".clear-all-btn");
  if (btn) {
    btn.insertAdjacentHTML("beforebegin", html);
  } else {
    pillsCon.insertAdjacentHTML("beforeend", html);
  }
}

function syncClearAllBtn() {
  const hasPills = pillsCon.querySelector(".filter-pill") !== null;
  let btn = pillsCon.querySelector(".clear-all-btn");
  if (hasPills && !btn) {
    const el = document.createElement("button");
    el.className = "clear-all-btn";
    el.textContent =
      window.DuaI18n?.t?.("fleet.filters.clear_all") ?? "Clear all";
    el.addEventListener("click", resetAllFilters);
    pillsCon.appendChild(el);
  } else if (!hasPills && btn) {
    btn.remove();
  } else if (hasPills && btn) {
    pillsCon.appendChild(btn);
  }
}

function removePillByData(pillKey, advKey) {
  if (advKey) {
    const def = advancedPillDefs.find((d) => d.key === advKey);
    if (def) {
      def.reset();
      syncAdvancedPills();
      renderCars();
    }
  } else {
    const match = pillsConfig.find((item) => item.key === pillKey);
    if (match?.checkbox) {
      match.checkbox.checked = false;
      match.checkbox.dispatchEvent(
        new Event("change", {
          bubbles: true,
        }),
      );
    }
  }
}

pillsCon?.addEventListener("click", (e) => {
  const button = e.target.closest("button:not(.clear-all-btn)");
  if (!button) return;
  const pill = button.closest(".filter-pill");
  if (!pill) return;
  removePillByData(pill.dataset.key, pill.dataset.advanced);
});

function syncAdvancedPills() {
  pillsCon
    .querySelectorAll(".filter-pill[data-advanced]")
    .forEach((p) => p.remove());
  for (const def of advancedPillDefs) {
    const label = def.getLabel();
    if (!label) continue;
    insertPillBeforeClearAll(buildPillHTML(label, def.key, def.key));
  }
  syncClearAllBtn();
}

function addPill(pillKey, fallbackLabel) {
  if (
    pillsCon.querySelector(
      `.filter-pill[data-key="${pillKey}"]:not([data-advanced])`,
    )
  )
    return;
  const label = popularPillLabel(pillKey, fallbackLabel);
  insertPillBeforeClearAll(buildPillHTML(label, pillKey));
  syncClearAllBtn();
}

function removePill(pillKey) {
  pillsCon
    .querySelector(`.filter-pill[data-key="${pillKey}"]:not([data-advanced])`)
    ?.remove();
  syncClearAllBtn();
}

pillsConfig.forEach(({ checkbox: checkbox, label: label, key: key }) => {
  checkbox?.addEventListener("change", () => {
    activeFilters[key] = checkbox.checked;
    checkbox.checked ? addPill(key, label) : removePill(key);
    renderCars();
  });
});

function retranslatePopularPills() {
  pillsCon
    ?.querySelectorAll(".filter-pill[data-key]:not([data-advanced])")
    .forEach((pillEl) => {
      const pillKey = pillEl.dataset.key;
      const config = pillsConfig.find((item) => item.key === pillKey);
      if (!config) return;
      const p = pillEl.querySelector("p");
      if (p) p.textContent = popularPillLabel(pillKey, config.label);
    });
}

function readAdvancedFilters() {
  const form =
    document.querySelector("#filtersDialog .main-dialog") ??
    document.querySelector(".mobile-advanced-filters .main-dialog");
  activeFilters.brand = brandTS ? [...brandTS.items] : [];
  activeFilters.make = makeTS ? [...makeTS.items] : [];
  activeFilters.year =
    form?.querySelector('input[name="year"]:checked')?.value ?? "any";
  activeFilters.driverExperience =
    form?.querySelector('input[name="driverExperience"]:checked')?.value ??
    null;
  activeFilters.luggage =
    form?.querySelector('input[name="luggage"]:checked')?.value ?? null;
  activeFilters.deposit =
    form?.querySelector('input[name="deposit"]:checked')?.value ?? null;
  activeFilters.insurance = normalizeInsuranceValue(
    form?.querySelector('input[name="insurance"]:checked')?.value ?? null,
  );
  activeFilters.minPrice = parseInt(minR?.value ?? 0);
  activeFilters.maxPrice = parseInt(maxR?.value ?? 200);
  const checkedTransmissions = [
    ...(form?.querySelectorAll('input[name="transmission"]:checked') ?? []),
  ];
  activeFilters.transmission = checkedTransmissions.map((i) => i.value);
  const checkedFuels = [
    ...(form?.querySelectorAll('input[name="fuel"]:checked') ?? []),
  ];
  activeFilters.fuel = checkedFuels.map((i) => i.value);
  const checkedSeats = [
    ...(form?.querySelectorAll('input[name="seats"]:checked') ?? []),
  ];
  activeFilters.seating = checkedSeats.map((i) => i.value);
}

document.getElementById("submitFiltersBtn")?.addEventListener("click", (e) => {
  e.preventDefault();
  readAdvancedFilters();
  syncAdvancedPills();
  renderCars();
  filtersDialog?.hidePopover?.();
  if (isMobile) {
    if (sidebarFilterEl) {
      sidebarFilterEl.style.display = "none";
      document.body.style.overflow = "";
    }
  }
});

function resetAllFilters() {
  pillsConfig.forEach(({ checkbox: checkbox, key: key }) => {
    if (checkbox) checkbox.checked = false;
    activeFilters[key] = false;
  });
  pillsCon.querySelectorAll(".filter-pill").forEach((p) => p.remove());
  pillsCon.querySelector(".clear-all-btn")?.remove();
  activeFilters.brand = [];
  activeFilters.make = [];
  activeFilters.year = "any";
  activeFilters.transmission = [];
  activeFilters.fuel = [];
  activeFilters.seating = [];
  activeFilters.luggage = null;
  activeFilters.deposit = null;
  activeFilters.insurance = null;
  activeFilters.driverExperience = null;
  activeFilters.minPrice = 0;
  activeFilters.maxPrice = 200;
  activeFilters.carType = "all";
  brandTS?.clear(true);
  makeTS?.clear(true);
  updateMakeOptions([]);
  const activeForm = getActiveForm();
  if (activeForm?.reset) activeForm.reset();
  if (minR) minR.value = 0;
  if (maxR) maxR.value = 200;
  if (minR) updatePriceRange.call(minR);
  if (activeCarType) {
    activeCarType.classList.remove("selected-type");
  }
  if (allCarTypePill) {
    allCarTypePill.classList.add("selected-type");
    activeCarType = allCarTypePill;
  } else {
    activeCarType = null;
  }
  syncAdvancedPills();
  renderCars();
}

document
  .getElementById("resetAllBtn")
  ?.addEventListener("click", resetAllFilters);

carTypePills.forEach((div) => {
  div.addEventListener("click", () => {
    if (activeCarType && activeCarType !== div) {
      activeCarType.classList.remove("selected-type");
    }
    activeCarType = div;
    div.classList.add("selected-type");
    const selectedType =
      div.dataset.type ?? div.textContent.trim().toLowerCase();
    activeFilters.carType = selectedType === "all" ? null : selectedType;
    renderCars();
  });
});

const SKELETON_HTML = Array(4)
  .fill(
    `\n  <div class="car-card skeleton-card">\n    <div class="skeleton skeleton-image"></div>\n    <div class="card-body">\n      <div class="skeleton skeleton-title"></div>\n      <div class="skeleton-features">\n        <div class="skeleton skeleton-feature"></div>\n        <div class="skeleton skeleton-feature"></div>\n        <div class="skeleton skeleton-feature"></div>\n        <div class="skeleton skeleton-feature"></div>\n      </div>\n      <div class="skeleton-amenities">\n        <div class="skeleton skeleton-amenity"></div>\n        <div class="skeleton skeleton-amenity"></div>\n        <div class="skeleton skeleton-amenity"></div>\n      </div>\n    </div>\n    <hr>\n    <div class="card-end">\n      <div class="skeleton skeleton-price"></div>\n      <div class="skeleton skeleton-btn"></div>\n    </div>\n  </div>\n`,
  )
  .join("");

const FLEET_CACHE_KEY = "fleet_cars_v1";

const brandSearchEl = document.getElementById("brandSearch");

const makeSearchEl = document.getElementById("makeSearch");

let brandListAll = [];

// Tom Select instances for the Vehicle Brand / Vehicle Model multiselects.
// https://tom-select.js.org/ — lightweight (~16kb gzip), zero dependencies, MIT licensed.
const tomSelectSharedConfig = {
  plugins: ["remove_button"],
  persist: false,
  create: false,
  maxOptions: null,
  closeAfterSelect: false,
};

const brandTS =
  brandSearchEl && window.TomSelect
    ? new TomSelect(brandSearchEl, {
        ...tomSelectSharedConfig,
        placeholder: brandSearchEl.getAttribute("placeholder") ?? "All Brands",
      })
    : null;

const makeTS =
  makeSearchEl && window.TomSelect
    ? new TomSelect(makeSearchEl, {
        ...tomSelectSharedConfig,
        placeholder: makeSearchEl.getAttribute("placeholder") ?? "All Models",
      })
    : null;

function normalizeCachePart(value) {
  return (value || "all")
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_");
}

function getFleetCacheKey(pickupLoc) {
  return `${FLEET_CACHE_KEY}_${normalizeCachePart(pickupLoc)}`;
}

function renderCachedFleet(cars) {
  isCarsLoading = false;
  allCars = cars;
  if (carNum) carNum.textContent = cars.length;
  if (totalCarNum) totalCarNum.textContent = cars.length;
  populateFiltersFromData(cars);
  renderCars(document.getElementById("carSort")?.value ?? "popular");
  window.fetchAllRates?.();
}

async function fetchAvailableCarIdsByPickupName(client, pickupName) {
  if (!pickupName) return null;

  const { data, error } = await client
    .from("car_locations")
    .select("car_id, locations!inner(id, name, is_airport, is_active)")
    .eq("locations.name", pickupName)
    .eq("locations.is_active", true);

  if (error || !data) return null;
  if (data.length === 0) return null;

  const location = data.find((row) => row.locations)?.locations ?? null;
  return {
    location,
    carIds: [...new Set(data.map((row) => row.car_id).filter(Boolean))],
  };
}

async function resolvePickupLocation(locationData) {
  const pickupName = locationData?.pickupLoc;
  if (!window.DuaLocations?.getLocationByName) return null;
  if (pickupName) {
    const location = await window.DuaLocations.getLocationByName(pickupName);
    if (location) return location;
  }
  const locations = await window.DuaLocations.fetchLocations();
  return (
    locations.find((location) => location.is_airport) ?? locations[0] ?? null
  );
}

function populateBrandOptions(brands) {
  brandListAll = brands;
  if (!brandTS) return;
  const previouslySelected = [...brandTS.items];
  brandTS.clearOptions();
  brands.forEach((b) => brandTS.addOption({ value: b, text: b }));
  brandTS.refreshOptions(false);
  // Keep any selections that are still valid after the brand list refreshes
  // (e.g. after a language change or a fresh data load).
  const stillValid = previouslySelected.filter((b) => brands.includes(b));
  brandTS.setValue(stillValid, true);
  activeFilters.brand = stillValid;
}

function updateMakeOptions(selectedBrands, { preserveSelection = false } = {}) {
  if (!makeTS) return;
  const previouslySelected = [...makeTS.items];
  const models =
    !selectedBrands || selectedBrands.length === 0
      ? [...new Set(allCars.map((c) => c.model).filter(Boolean))].sort()
      : [
          ...new Set(
            allCars
              .filter((c) => selectedBrands.includes(c.brand))
              .map((c) => c.model)
              .filter(Boolean),
          ),
        ].sort();
  makeTS.clearOptions();
  models.forEach((m) => makeTS.addOption({ value: m, text: m }));
  makeTS.refreshOptions(false);
  if (preserveSelection) {
    const stillValid = previouslySelected.filter((m) => models.includes(m));
    makeTS.setValue(stillValid, true);
    activeFilters.make = stillValid;
  } else {
    makeTS.clear(true);
    activeFilters.make = [];
  }
}

// Requirement 1 & 2: picking brand(s) narrows the model list to matching
// models; picking model(s) alone doesn't restrict the brand list.
// Requirement 3: changing the brand selection clears the current model
// selection and repopulates the model list for the new brand(s).
brandTS?.on("change", () => {
  const newBrands = [...brandTS.items];
  activeFilters.brand = newBrands;
  updateMakeOptions(newBrands);
});

makeTS?.on("change", () => {
  activeFilters.make = [...makeTS.items];
});

function populateFiltersFromData(cars) {
  populateBrandOptions(
    [...new Set(cars.map((c) => c.brand).filter(Boolean))].sort(),
  );
  updateMakeOptions(activeFilters.brand, { preserveSelection: true });
  const dbFuels = [...new Set(cars.map((c) => c.fuel).filter(Boolean))].sort();
  const fuelList = document.getElementById("fuelFilterList");
  if (fuelList) {
    fuelList.innerHTML = dbFuels
      .map((f) => {
        const label = translateFuelLabel(f);
        return `<li class="checkbox-btn"><input type="checkbox" name="fuel" id="fuel_${f}" value="${f}"><label for="fuel_${f}">${label}</label></li>`;
      })
      .join("");
  }
  const dbSeats = [...new Set(cars.map((c) => c.seats).filter(Boolean))].sort(
    (a, b) => a - b,
  );
  const seatList = document.getElementById("seatFilterList");
  if (seatList) {
    seatList.innerHTML = dbSeats
      .map(
        (s) =>
          `<li class="checkbox-btn"><input type="checkbox" name="seats" id="seat_${s}" value="${s}"><label for="seat_${s}">${window.DuaI18n?.plural?.("seats", s) ?? `${s} Seats`}</label></li>`,
      )
      .join("");
  }
  window.DuaI18n?.translatePage?.();
}

async function loadCars() {
  if (!container) return;
  isCarsLoading = true;
  let locationData =
    JSON.parse(localStorage.getItem("locationData")) ??
    getDefaultLocationData();
  const pickupLocFromState = locationData?.pickupLoc ?? "";
  const cached = cacheGet(getFleetCacheKey(pickupLocFromState));
  if (cached) {
    renderCachedFleet(cached);
    return;
  }

  container.innerHTML = SKELETON_HTML;

  const client = await window.supabaseClientReady;
  if (!client) {
    isCarsLoading = false;
    const loadFailed =
      window.DuaI18n?.t?.("fleet.state.load_failed") ?? "Failed to load cars.";
    const tryAgain =
      window.DuaI18n?.t?.("fleet.state.try_again") ?? "Please try again later.";
    container.innerHTML = `\n      <div class="error-con">\n        <img src="/assets/icons/error.svg" alt="error icon" loading="lazy" draggable="false">\n        <h1>${loadFailed}</h1>\n        <p>${tryAgain}</p>\n      </div>`;
    return;
  }

  let pickupLoc = pickupLocFromState;
  let locationId = null;
  let availableCarIds = null;
  let selectedLocation = null;
  const joinedLocationCars = await fetchAvailableCarIdsByPickupName(
    client,
    pickupLoc,
  );

  if (joinedLocationCars) {
    selectedLocation = joinedLocationCars.location;
    locationId = selectedLocation?.id ?? null;
    availableCarIds = joinedLocationCars.carIds;
  } else {
    selectedLocation = await resolvePickupLocation(locationData);
    locationId = selectedLocation?.id ?? null;
  }

  if (selectedLocation && locationData?.pickupLoc !== selectedLocation.name) {
    locationData = {
      ...(locationData ?? getDefaultLocationData()),
      pickupLoc: selectedLocation.name,
      dropoffLoc: selectedLocation.name,
    };
    localStorage.setItem("locationData", JSON.stringify(locationData));
    displayLocationDataSearch();
  }

  pickupLoc = selectedLocation?.name ?? locationData?.pickupLoc ?? "";
  const cacheKey = getFleetCacheKey(pickupLoc);

  if (pickupLoc && !availableCarIds) {
    if (!locationId) {
      isCarsLoading = false;
      allCars = [];
      if (carNum) carNum.textContent = 0;
      if (totalCarNum) totalCarNum.textContent = 0;
      populateFiltersFromData([]);
      renderCars(document.getElementById("carSort")?.value ?? "popular");
      return;
    }
    const { data: locationCars, error: locationCarsError } = await client
      .from("car_locations")
      .select("car_id")
      .eq("location_id", locationId);
    if (locationCarsError) {
      isCarsLoading = false;
      const loadFailed =
        window.DuaI18n?.t?.("fleet.state.load_failed") ??
        "Failed to load cars.";
      const tryAgain =
        window.DuaI18n?.t?.("fleet.state.try_again") ??
        "Please try again later.";
      container.innerHTML = `\n        <div class="error-con">\n          <img src="/assets/icons/error.svg" alt="error icon" loading="lazy" draggable="false">\n          <h1>Failed to load cars.</h1>\n          <p>Please try again later.</p>\n        </div>`;
      return;
    }
    availableCarIds = [
      ...new Set((locationCars ?? []).map((row) => row.car_id).filter(Boolean)),
    ];
    if (availableCarIds.length === 0) {
      isCarsLoading = false;
      allCars = [];
      if (carNum) carNum.textContent = 0;
      if (totalCarNum) totalCarNum.textContent = 0;
      populateFiltersFromData([]);
      renderCars(document.getElementById("carSort")?.value ?? "popular");
      return;
    }
  }
  let carsQuery = client
    .from("cars")
    .select(
      `\n      id, brand, model, year, category,\n      seats, doors, has_ac, trunk_litres,\n      transmission, fuel, mileage_unlimited,\n      deposit_amount, insurance_type, created_at,\n      car_pricing ( price_per_day, valid_from, valid_to, is_special_offer ),\n      car_photos  ( storage_path, alt_text, is_primary ),\n      young_driver_surcharges ( max_age )\n    `,
    )
    .eq("is_active", true)
    .eq("is_available", true);
  if (availableCarIds) carsQuery = carsQuery.in("id", availableCarIds);
  const { data: cars, error: error } = await carsQuery
    .order("brand", { ascending: true })
    .limit(50);
  if (error) {
    isCarsLoading = false;
    const loadFailed =
      window.DuaI18n?.t?.("fleet.state.load_failed") ?? "Failed to load cars.";
    const tryAgain =
      window.DuaI18n?.t?.("fleet.state.try_again") ?? "Please try again later.";
    container.innerHTML = `\n      <div class="error-con">\n        <img src="/assets/icons/error.svg" alt="error icon" loading="lazy" draggable="false">\n        <h1>${loadFailed}</h1>\n        <p>${tryAgain}</p>\n      </div>`;
    return;
  }
  if (!cars || cars.length === 0) {
    isCarsLoading = false;
    const noneAvailable =
      window.DuaI18n?.t?.("fleet.state.none_available") ??
      "No cars available at this moment";
    const tryAgain2 =
      window.DuaI18n?.t?.("fleet.state.try_again") ?? "Please try again later.";
    container.innerHTML = `\n      <div class="availability-con">\n        <img src="/assets/icons/availability.svg" alt="Availability icon" loading="lazy" draggable="false">\n        <h1>${noneAvailable}</h1>\n        <p>${tryAgain2}</p>\n      </div>`;
    return;
  }
  cacheSet(cacheKey, cars);
  renderCachedFleet(cars);
}

let flatpickrLoaded = false;

let calendarsInitialized = false;

locationDialog?.addEventListener("toggle", (e) => {
  document.body.style.overflow = e.newState === "open" ? "hidden" : "";
  if (e.newState === "open" && !calendarsInitialized) {
    if (!flatpickrLoaded) {
      const script = document.createElement("script");
      script.src = "https://cdn.jsdelivr.net/npm/flatpickr";
      script.onload = () => {
        flatpickrLoaded = true;
        displayCalendarFleet();
        calendarsInitialized = true;
      };
      document.head.appendChild(script);
    } else {
      displayCalendarFleet();
      calendarsInitialized = true;
    }
  }
});

const locationChangeBtn = document.getElementById("locationChangeBtn");

if (locationChangeBtn)
  locationChangeBtn.onclick = () => {
    const filter = JSON.parse(localStorage.getItem("locationData"));
    if (filter) {
      document.getElementById("changePickup").value = filter.pickupLoc || "";
      document.getElementById("changeDropoff").value = filter.dropoffLoc || "";
      document.getElementById("changePickupDate").value =
        filter.pickupDate || "";
      document.getElementById("changeDropoffDate").value =
        filter.dropoffDate || "";
      document.getElementById("changePickupTime").value =
        filter.pickupTime || "00:00";
      document.getElementById("changeDropoffTime").value =
        filter.dropoffTime || "00:00";
    }
  };

function updateLocationData() {
  const pickupDateVal = document.getElementById("changePickupDate").value;
  const dropoffDateVal = document.getElementById("changeDropoffDate").value;
  if (!pickupDateVal || !dropoffDateVal) {
    alert("Please select both pickup and drop-off dates");
    return;
  }
  const newFilter = {
    pickupLoc: document.getElementById("changePickup").value,
    pickupDate: pickupDateVal,
    pickupTime: document.getElementById("changePickupTime").value,
    dropoffLoc: document.getElementById("changeDropoff").value,
    dropoffDate: dropoffDateVal,
    dropoffTime: document.getElementById("changeDropoffTime").value,
  };
  if (dropoffCheck?.checked) newFilter.dropoffLoc = newFilter.pickupLoc;
  localStorage.setItem("locationData", JSON.stringify(newFilter));
  calcDays(newFilter.pickupDate, newFilter.dropoffDate);
  displayLocationDataSearch();
  loadCars();
  locationDialog.hidePopover();
}

window.updateLocationData = updateLocationData;

locationUpdateBtn?.addEventListener("click", updateLocationData);

const closeDialogBtn = document.getElementById("closeDialog");

if (closeDialogBtn)
  closeDialogBtn.onclick = () => locationDialog?.hidePopover();

filtersDialog?.addEventListener("toggle", (e) => {
  document.body.style.overflow = e.newState === "open" ? "hidden" : "";
});

const filtersCloseDialogBtn = document.getElementById("filtersCloseDialog");

if (filtersCloseDialogBtn)
  filtersCloseDialogBtn.onclick = () => filtersDialog?.hidePopover();

function updatePriceRange() {
  if (!minR || !maxR || !fill) return;
  let min = +minR.value,
    max = +maxR.value;
  if (max - min < GAP) {
    if (this === minR) minR.value = min = max - GAP;
    else maxR.value = max = min + GAP;
  }
  const total = +minR.max - +minR.min;
  fill.style.left = ((min - +minR.min) / total) * 100 + "%";
  fill.style.right = 100 - ((max - +minR.min) / total) * 100 + "%";
  const minVal = document.getElementById("min-val");
  const maxVal = document.getElementById("max-val");
  if (minVal) minVal.textContent = min;
  if (maxVal) maxVal.textContent = max;
}

[minR, maxR].forEach((r) => {
  r?.addEventListener("input", function () {
    updatePriceRange.call(this);
    activeFilters.minPrice = parseInt(minR.value);
    activeFilters.maxPrice = parseInt(maxR.value);
    syncAdvancedPills();
    renderCars();
  });
});

if (minR) updatePriceRange.call(minR);

function mountAdvancedFilters() {
  const form = document.querySelector("#filtersDialog .main-dialog");
  const mobileSlot = document.querySelector(".mobile-advanced-filters");
  if (!form) return;
  if (isMobile && mobileSlot) mobileSlot.appendChild(form);
  else document.getElementById("filtersDialog")?.appendChild(form);
}

mountAdvancedFilters();

window
  .matchMedia("(max-width: 1024px)")
  .addEventListener("change", mountAdvancedFilters);

if (filterBtn)
  filterBtn.onclick = () => {
    if (!sidebarFilterEl) return;
    sidebarFilterEl.style.display = "block";
    document.body.style.overflow = "hidden";
  };

if (closeSidebarBtnEl)
  closeSidebarBtnEl.onclick = () => {
    if (!sidebarFilterEl) return;
    sidebarFilterEl.style.display = "none";
    document.body.style.overflow = "";
  };

const sortSelect = document.getElementById("carSort");

if (sortSelect)
  sortSelect.addEventListener("change", () => renderCars(sortSelect.value));

document.addEventListener("languageChanged", () => {
  if (allCars.length) populateFiltersFromData(allCars);
  retranslatePopularPills();
  syncAdvancedPills();
  refreshFleetView(document.getElementById("carSort")?.value ?? "popular");
});

window.addEventListener("languageChanged", () => {
  refreshFleetView(document.getElementById("carSort")?.value ?? "popular");
});

loadCars();
