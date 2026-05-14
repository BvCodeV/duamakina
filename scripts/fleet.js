const filterBtn = document.getElementById("filterBtn");
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

const minR = document.getElementById("min-range");
const maxR = document.getElementById("max-range");
const fill = document.getElementById("fill");
const GAP = 50;

function displayLocationDataSearch() {
  const locationData = JSON.parse(localStorage.getItem("locationData"));
  const days = localStorage.getItem("daysCalc");
  pickupTxt.textContent = locationData.pickupLoc;
  dropoffTxt.textContent = locationData.dropoffLoc;
  pickupDateTxt.textContent = locationData.pickupDate;
  dropoffDateTxt.textContent = locationData.dropoffDate;
  pickupTimeTxt.textContent = locationData.pickupTime;
  dropoffTimeTxt.textContent = locationData.dropoffTime;
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
  if (!value) return "none";
  const normalized = value.toString().trim().toLowerCase();
  if (normalized === "full") return "premium";
  if (normalized === "third-party" || normalized === "third party" || normalized === "thirdparty") return "basic";
  if (normalized === "premium" || normalized === "basic" || normalized === "none") return normalized;
  return normalized;
}

function getInsurancePillLabel(value) {
  const normalized = normalizeInsuranceValue(value);
  if (normalized === "none") return "No insurance";
  return `${capitalize(normalized)} insurance`;
}

function buildCarCard(car) {
  const pricing = getTodayPrice(car.car_pricing);
  const photo = getPrimaryPhoto(car.car_photos);
  const imageUrl = getPhotoUrl(photo?.storage_path);
  const imageAlt = photo?.alt_text ?? `${car.brand} ${car.model}`;
  const price = pricing ? parseFloat(pricing.price_per_day).toFixed(2) : "N/A";
  const transmission = capitalize(car.transmission);
  const trunkLitres = car.trunk_litres ?? "—";

  return `
    <div class="car-card">
      <img src="${imageUrl}" alt="${imageAlt}" class="car-image" loading="lazy" draggable="false">
      <div class="card-body">
        <h2 class="car-title">${car.brand} ${car.model}</h2>
        <ul class="car-features">
          <li><img src="/assets/icons/person.svg" alt="person icon" loading="lazy" draggable="false"> ${car.seats} Seats</li>
          <li><img src="/assets/icons/bag.svg" alt="bag icon" loading="lazy" draggable="false"> ${trunkLitres}L Trunk</li>
          <li><img src="/assets/icons/door.svg" alt="door icon" loading="lazy" draggable="false"> ${car.doors} Doors</li>
          <li><img src="/assets/icons/gears.svg" alt="gears icon" loading="lazy" draggable="false"> ${transmission}</li>
          ${car.has_ac ? `<li><img src="/assets/icons/ac.svg" alt="ac icon" loading="lazy" draggable="false"> A/C</li>` : ""}
        </ul>
        <ul class="car-amenities">
          ${car.mileage_unlimited ? `<li><img src="/assets/icons/checkmark.svg" alt="checkmark icon" loading="lazy" draggable="false"> Unlimited Mileage</li>` : ""}
          <li><img src="/assets/icons/checkmark.svg" alt="checkmark icon" loading="lazy" draggable="false"> Free Cancellation</li>
          <li><img src="/assets/icons/checkmark.svg" alt="checkmark icon" loading="lazy" draggable="false"> 24/7 Assistance</li>
        </ul>
      </div>
      <hr>
      <div class="card-end">
        <div class="car-price">
          <span>From</span>
          <div class="price">
            <span class="currency-sign" style="font-size:1em;font-weight:bold;color:var(--color-txt-primary);">€</span><span class="currency-num" style="font-size:1em;font-weight:bold;color:var(--color-txt-primary);">${price}</span>
          </div>
          <span>per day</span>
        </div>
        <a href="/pages/booking.html?id=${car.id}" class="rent-now-btn" id="viewDetailsBtn">View Details</a>
      </div>
    </div>
  `;
}

function sortCars(cars, sortValue) {
  const sorted = [...cars];
  switch (sortValue) {
    case "lToH":
      return sorted.sort((a, b) => {
        const pa = parseFloat(getTodayPrice(a.car_pricing)?.price_per_day ?? Infinity);
        const pb = parseFloat(getTodayPrice(b.car_pricing)?.price_per_day ?? Infinity);
        return pa - pb;
      });
    case "hToL":
      return sorted.sort((a, b) => {
        const pa = parseFloat(getTodayPrice(a.car_pricing)?.price_per_day ?? 0);
        const pb = parseFloat(getTodayPrice(b.car_pricing)?.price_per_day ?? 0);
        return pb - pa;
      });
    case "newest":
      return sorted.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
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
  brand: "all",
  year: "any",
  transmission: [],
  fuel: null,
  seating: null,
  deposit: null,
  insurance: null,
  minPrice: 0,
  maxPrice: 1000,
  carType: null,
};

function applyFilters(cars) {
  return cars.filter((car) => {
    const pricing = getTodayPrice(car.car_pricing);
    const price = pricing ? parseFloat(pricing.price_per_day) : 0;

    if (activeFilters.automatic && car.transmission !== "automatic") return false;
    if (activeFilters.mileage && !car.mileage_unlimited) return false;
    if (activeFilters.ac && !car.has_ac) return false;
    if (activeFilters.seats && car.seats < 4) return false;
    if (activeFilters.electric && car.fuel !== "electric") return false;
    if (activeFilters.brand !== "all" && car.brand !== activeFilters.brand) return false;

    if (activeFilters.year !== "any") {
      if (car.year < parseInt(activeFilters.year)) return false;
    }

    if (activeFilters.transmission.length > 0) {
      if (!activeFilters.transmission.includes(car.transmission)) return false;
    }

    if (activeFilters.fuel) {
      const fuelMap = { petrol: "gasoline" };
      const mapped = fuelMap[activeFilters.fuel] ?? activeFilters.fuel;
      if (car.fuel !== mapped) return false;
    }

    if (activeFilters.seating) {
      if (car.seats < parseInt(activeFilters.seating)) return false;
    }

    if (activeFilters.deposit) {
      if (activeFilters.deposit === "none" && car.deposit_amount > 0) return false;
      if (activeFilters.deposit !== "none" && car.deposit_amount > parseInt(activeFilters.deposit)) return false;
    }

    if (activeFilters.insurance) {
      const selectedInsurance = normalizeInsuranceValue(activeFilters.insurance);
      const carInsurance = normalizeInsuranceValue(car.insurance_type);
      if (selectedInsurance !== carInsurance) return false;
    }

    if (price < activeFilters.minPrice || price > activeFilters.maxPrice) return false;
    if (activeFilters.carType && activeFilters.carType !== "all" && car.category !== activeFilters.carType) return false;

    return true;
  });
}

let allCars = [];

function renderCars(sortValue) {
  if (!container) return;
  const sort = sortValue ?? document.getElementById("carSort")?.value ?? "popular";
  const filtered = applyFilters(allCars);
  const sorted = sortCars(filtered, sort);

  if (carNum) carNum.textContent = sorted.length;
  if (filteredCarNum) filteredCarNum.textContent = sorted.length;

  if (sorted.length === 0) {
    container.innerHTML = `
    <div class="match-con">
      <img src="/assets/icons/match.svg" alt="match icon" loading="lazy" draggable="false">
      <h1 style="color: var(--color-primary)">No cars match your filters.</h1>
      <p>Please reset your filters.</p>
    </div>
    `;
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
}

const pillsConfig = [
  { checkbox: automaticPopular,  label: "Automatic",         key: "automatic"  },
  { checkbox: milagePopular,     label: "Unlimited Mileage", key: "mileage"    },
  { checkbox: acPopular,         label: "AC",                key: "ac"         },
  { checkbox: seatsPopular,      label: "4+ Seats",          key: "seats"      },
  { checkbox: electricPopular,   label: "Electric",          key: "electric"   },
  { checkbox: freeCancelPopular, label: "Free Cancellation", key: "freeCancel" },
  { checkbox: specialPopular,    label: "Special Offers",    key: "special"    },
];

const advancedPillDefs = [
  {
    key: "brand",
    getLabel: () => activeFilters.brand !== "all" ? activeFilters.brand : null,
    reset: () => {
      activeFilters.brand = "all";
      const el = document.getElementById("brandFilter");
      if (el) el.value = "all";
    },
  },
  {
    key: "year",
    getLabel: () => activeFilters.year !== "any" ? activeFilters.year : null,
    reset: () => {
      activeFilters.year = "any";
      uncheckRadioGroup("year");
    },
  },
  {
    key: "transmission",
    getLabel: () => activeFilters.transmission.length > 0
      ? `${activeFilters.transmission.join(", ")}`
      : null,
    reset: () => {
      activeFilters.transmission = [];
      uncheckCheckboxGroup("transmission");
    },
  },
  {
    key: "fuel",
    getLabel: () => activeFilters.fuel ? activeFilters.fuel : null,
    reset: () => {
      activeFilters.fuel = null;
      uncheckRadioGroup("fuel");
    },
  },
  {
    key: "seating",
    getLabel: () => activeFilters.seating ? activeFilters.seating : null,
    reset: () => {
      activeFilters.seating = null;
      uncheckRadioGroup("seats");
    },
  },
  {
    key: "deposit",
    getLabel: () => activeFilters.deposit ? activeFilters.deposit : null,
    reset: () => {
      activeFilters.deposit = null;
      uncheckRadioGroup("deposit");
    },
  },
  {
    key: "insurance",
    getLabel: () => activeFilters.insurance ? getInsurancePillLabel(activeFilters.insurance) : null,
    reset: () => {
      activeFilters.insurance = null;
      uncheckRadioGroup("insurance");
    },
  },
  {
    key: "price",
    getLabel: () =>
      activeFilters.minPrice !== 0 || activeFilters.maxPrice !== 1000
        ? `Price: €${activeFilters.minPrice}–€${activeFilters.maxPrice}`
        : null,
    reset: () => {
      activeFilters.minPrice = 0;
      activeFilters.maxPrice = 1000;
      if (minR) minR.value = 0;
      if (maxR) maxR.value = 1000;
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

function buildPillHTML(label, advKey = null) {
  const dataAdv = advKey ? `data-advanced="${advKey}"` : "";
  return `<div class="filter-pill" data-label="${label}" ${dataAdv}><p>${label}</p><button aria-label="Remove ${label} filter">X</button></div>`;
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
    el.textContent = "Clear all";
    el.addEventListener("click", resetAllFilters);
    pillsCon.appendChild(el);
  } else if (!hasPills && btn) {
    btn.remove();
  } else if (hasPills && btn) {
    pillsCon.appendChild(btn);
  }
}

function removePillByData(label, advKey) {
  if (advKey) {
    const def = advancedPillDefs.find((d) => d.key === advKey);
    if (def) {
      def.reset();
      syncAdvancedPills();
      renderCars();
    }
  } else {
    const match = pillsConfig.find((item) => item.label === label);
    if (match) {
      match.checkbox.checked = false;
      match.checkbox.dispatchEvent(new Event("change", { bubbles: true }));
    }
  }
}

pillsCon.addEventListener("click", (e) => {
  const button = e.target.closest("button:not(.clear-all-btn)");
  if (!button) return;
  const pill = button.closest(".filter-pill");
  if (!pill) return;
  removePillByData(pill.dataset.label, pill.dataset.advanced);
});

function syncAdvancedPills() {
  pillsCon.querySelectorAll(".filter-pill[data-advanced]").forEach((p) => p.remove());

  for (const def of advancedPillDefs) {
    const label = def.getLabel();
    if (!label) continue;
    insertPillBeforeClearAll(buildPillHTML(label, def.key));
  }

  syncClearAllBtn();
}

function addPill(label) {
  if (pillsCon.querySelector(`.filter-pill[data-label="${label}"]:not([data-advanced])`)) return;
  insertPillBeforeClearAll(buildPillHTML(label));
  syncClearAllBtn();
}

function removePill(label) {
  pillsCon.querySelector(`.filter-pill[data-label="${label}"]:not([data-advanced])`)?.remove();
  syncClearAllBtn();
}

pillsConfig.forEach(({ checkbox, label, key }) => {
  checkbox.addEventListener("change", () => {
    activeFilters[key] = checkbox.checked;
    checkbox.checked ? addPill(label) : removePill(label);
    renderCars();
  });
});

function readAdvancedFilters() {
  const form =
    document.querySelector("#filtersDialog .main-dialog") ??
    document.querySelector(".mobile-advanced-filters .main-dialog");

  activeFilters.brand = document.getElementById("brandFilter")?.value ?? "all";
  activeFilters.year = form?.querySelector('input[name="year"]:checked')?.value ?? "any";
  activeFilters.fuel = form?.querySelector('input[name="fuel"]:checked')?.value ?? null;
  activeFilters.seating = form?.querySelector('input[name="seats"]:checked')?.value ?? null;
  activeFilters.deposit = form?.querySelector('input[name="deposit"]:checked')?.value ?? null;
  activeFilters.insurance = normalizeInsuranceValue(form?.querySelector('input[name="insurance"]:checked')?.value ?? null);
  activeFilters.minPrice = parseInt(minR?.value ?? 0);
  activeFilters.maxPrice = parseInt(maxR?.value ?? 1000);

  const checkedTransmissions = [
    ...(form?.querySelectorAll('input[name="transmission"]:checked') ?? []),
  ];
  activeFilters.transmission = checkedTransmissions.map((i) => i.value);
}

document.getElementById("submitFiltersBtn")?.addEventListener("click", (e) => {
  e.preventDefault();
  readAdvancedFilters();
  syncAdvancedPills();
  renderCars();
  filtersDialog?.hidePopover?.();
  if (isMobile) {
    if (sidebarFilter) {
      sidebarFilter.style.display = "none";
      document.body.style.overflow = "";
    }
  }
});

function resetAllFilters() {
  pillsConfig.forEach(({ checkbox, key }) => {
    checkbox.checked = false;
    activeFilters[key] = false;
  });

  pillsCon.querySelectorAll(".filter-pill").forEach((p) => p.remove());
  pillsCon.querySelector(".clear-all-btn")?.remove();

  activeFilters.brand = "all";
  activeFilters.year = "any";
  activeFilters.transmission = [];
  activeFilters.fuel = null;
  activeFilters.seating = null;
  activeFilters.deposit = null;
  activeFilters.insurance = null;
  activeFilters.minPrice = 0;
  activeFilters.maxPrice = 1000;
  activeFilters.carType = "all";

  const activeForm = getActiveForm();
  if (activeForm?.reset) activeForm.reset();

  if (minR) minR.value = 0;
  if (maxR) maxR.value = 1000;
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

document.getElementById("resetAllBtn").addEventListener("click", resetAllFilters);

carTypePills.forEach((div) => {
  div.addEventListener("click", () => {
    if (activeCarType && activeCarType !== div) {
      activeCarType.classList.remove("selected-type");
    }

    activeCarType = div;
    div.classList.add("selected-type");

    const selectedType = div.dataset.type ?? div.textContent.trim().toLowerCase();
    activeFilters.carType = selectedType === "all" ? null : selectedType;

    renderCars();
  });
});

const SKELETON_HTML = Array(4).fill(`
  <div class="car-card skeleton-card">
    <div class="skeleton skeleton-image"></div>
    <div class="card-body">
      <div class="skeleton skeleton-title"></div>
      <div class="skeleton-features">
        <div class="skeleton skeleton-feature"></div>
        <div class="skeleton skeleton-feature"></div>
        <div class="skeleton skeleton-feature"></div>
        <div class="skeleton skeleton-feature"></div>
      </div>
      <div class="skeleton-amenities">
        <div class="skeleton skeleton-amenity"></div>
        <div class="skeleton skeleton-amenity"></div>
        <div class="skeleton skeleton-amenity"></div>
      </div>
    </div>
    <hr>
    <div class="card-end">
      <div class="skeleton skeleton-price"></div>
      <div class="skeleton skeleton-btn"></div>
    </div>
  </div>
`).join("");

const CACHE_KEY = "fleet_cars_v1";
const CACHE_TTL = 90 * 1000;

async function loadCars() {
  if (!container) return;

  container.innerHTML = SKELETON_HTML;

  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      const { data: cachedCars, ts } = JSON.parse(cached);
      if (Date.now() - ts < CACHE_TTL) {
        allCars = cachedCars;
        if (carNum) carNum.textContent = cachedCars.length;
        if (totalCarNum) totalCarNum.textContent = cachedCars.length;
        renderCars(document.getElementById("carSort")?.value ?? "popular");
        return;
      }
    }
  } catch (_) {}

  const { data: cars, error } = await supabaseClient
    .from("cars")
    .select(
      `
      id, brand, model, year, category,
      seats, doors, has_ac, trunk_litres,
      transmission, fuel, mileage_unlimited,
      deposit_amount, insurance_type, created_at,
      car_pricing ( price_per_day, valid_from, valid_to, is_special_offer ),
      car_photos  ( storage_path, alt_text, is_primary )
    `
    )
    .eq("is_active", true)
    .eq("is_available", true)
    .limit(50);

  if (error) {
    container.innerHTML = `
      <div class="error-con">
        <img src="/assets/icons/error.svg" alt="error icon" loading="lazy" draggable="false">
        <h1>Failed to load cars.</h1>
        <p>Please try again later.</p>
      </div>`;
    return;
  }

  if (!cars || cars.length === 0) {
    container.innerHTML = `
      <div class="availability-con">
        <img src="/assets/icons/availability.svg" alt="Availability icon" loading="lazy" draggable="false">
        <h1>No cars available at this moment</h1>
        <p>Please try again later.</p>
      </div>`;
    return;
  }

  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ data: cars, ts: Date.now() }));
  } catch (_) {}

  allCars = cars;
  if (carNum) carNum.textContent = cars.length;
  if (totalCarNum) totalCarNum.textContent = cars.length;
  renderCars(document.getElementById("carSort")?.value ?? "popular");
}

let flatpickrLoaded = false;
let calendarsInitialized = false;

locationDialog.addEventListener("toggle", (e) => {
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

document.getElementById("locationChangeBtn").onclick = () => {
  const filter = JSON.parse(localStorage.getItem("locationData"));
  if (filter) {
    document.getElementById("changePickup").value = filter.pickupLoc || "";
    document.getElementById("changeDropoff").value = filter.dropoffLoc || "";
    document.getElementById("changePickupDate").value = filter.pickupDate || "";
    document.getElementById("changeDropoffDate").value = filter.dropoffDate || "";
    document.getElementById("changePickupTime").value = filter.pickupTime || "00:00";
    document.getElementById("changeDropoffTime").value = filter.dropoffTime || "00:00";
  }
};

function updateLocationData() {
  const newFilter = {
    pickupLoc: document.getElementById("changePickup").value,
    pickupDate: document.getElementById("changePickupDate").value,
    pickupTime: document.getElementById("changePickupTime").value,
    dropoffLoc: document.getElementById("changeDropoff").value,
    dropoffDate: document.getElementById("changeDropoffDate").value,
    dropoffTime: document.getElementById("changeDropoffTime").value,
  };
  if (dropoffCheck.checked) newFilter.dropoffLoc = newFilter.pickupLoc;
  localStorage.setItem("locationData", JSON.stringify(newFilter));
  calcDays(newFilter.pickupDate, newFilter.dropoffDate);
  displayLocationDataSearch();
  locationDialog.hidePopover();
}

document.getElementById("closeDialog").onclick = () => locationDialog.hidePopover();

filtersDialog.addEventListener("toggle", (e) => {
  document.body.style.overflow = e.newState === "open" ? "hidden" : "";
});
document.getElementById("filtersCloseDialog").onclick = () => filtersDialog.hidePopover();

function updatePriceRange() {
  let min = +minR.value,
    max = +maxR.value;
  if (max - min < GAP) {
    if (this === minR) minR.value = min = max - GAP;
    else maxR.value = max = min + GAP;
  }
  const total = +minR.max - +minR.min;
  fill.style.left = ((min - +minR.min) / total) * 100 + "%";
  fill.style.right = 100 - ((max - +minR.min) / total) * 100 + "%";
  document.getElementById("min-val").textContent = min;
  document.getElementById("max-val").textContent = max;
}
[minR, maxR].forEach((r) => {
  r.addEventListener("input", function () {
    updatePriceRange.call(this);
    activeFilters.minPrice = parseInt(minR.value);
    activeFilters.maxPrice = parseInt(maxR.value);
    syncAdvancedPills();
    renderCars();
  });
});
updatePriceRange.call(minR);

function mountAdvancedFilters() {
  const form = document.querySelector("#filtersDialog .main-dialog");
  const mobileSlot = document.querySelector(".mobile-advanced-filters");
  if (isMobile) mobileSlot.appendChild(form);
  else document.getElementById("filtersDialog").appendChild(form);
}
mountAdvancedFilters();
window.matchMedia("(max-width: 1024px)").addEventListener("change", mountAdvancedFilters);

filterBtn.onclick = () => {
  sidebarFilter.style.display = "block";
  document.body.style.overflow = "hidden";
};
closeSidebarBtn.onclick = () => {
  sidebarFilter.style.display = "none";
  document.body.style.overflow = "";
};

const sortSelect = document.getElementById("carSort");
if (sortSelect) sortSelect.addEventListener("change", () => renderCars(sortSelect.value));

loadCars();