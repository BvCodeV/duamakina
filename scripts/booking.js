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
const changeBtn = document.getElementById("changeBtn");
const locationForm = document.getElementById("locationFilterDialog");
const carName = document.getElementById('carName');
const carNamePrice = document.getElementById('carNamePrice');
const carTransmission = document.getElementById('carTransmission');
const carLuggage = document.getElementById('carLuggage');
const carSeats = document.getElementById('carSeats');
const mainImg = document.getElementById('mainImg');
const addonPage = document.getElementById('addonPage');
const infoPage = document.getElementById('infoPage');
const bookingNxtBtn = document.getElementById('bookingNxtBtn');
const formSendBtn = document.getElementById('formSendBtn');
const addonsCardCon = document.getElementById('addonsCardCon');

let pricePerDay = 0;
const EXTRA_ICON_MAP = {
  'baby-seat':          'baby-seat.svg',
  'booster-seat':       'booster-seat.svg',
  'child-seat':         'child-seat.svg',
  'wifi':               'wifi.svg',
  'insurance':          'insurance-booking.svg',
  'insurance-booking':  'insurance-booking.svg',
  'gps':                'gps.svg',
  'additional-driver':  'driverPlus.svg',
  'driver-plus':        'driverPlus.svg',
};

function getIconForSlug(slug) {  if (EXTRA_ICON_MAP[slug]) return EXTRA_ICON_MAP[slug];
  const key = Object.keys(EXTRA_ICON_MAP).find(k => slug.includes(k) || k.includes(slug));
  return key ? EXTRA_ICON_MAP[key] : 'default-addon.svg';
}

function getCarIdFromUrl() {
  return new URLSearchParams(window.location.search).get('id');
}

const getStorageData = () => ({
  locationData: JSON.parse(localStorage.getItem("locationData")),
  days: parseFloat(localStorage.getItem("daysCalc")) || 1,
});

const getCurrencySelect = () => document.getElementById("currencySelect").value;
const triggerPriceUpdate = () => window.updatePrice?.(getCurrencySelect());

const getAddonChecks = () => document.querySelectorAll(".addonCheck");


function displayData() {
  const { locationData } = getStorageData();
  if (!locationData) return;
  pickupDateForm.textContent     = locationData.pickupDate;
  dropoffDateForm.textContent    = locationData.dropoffDate;
  pickupTimeForm.textContent     = locationData.pickupTime;
  dropoffTimeForm.textContent    = locationData.dropoffTime;
  pickupLocationForm.textContent = locationData.pickupLoc;
  dropoffLocationForm.textContent = locationData.dropoffLoc;
}

function displayDate() {
  const { days } = getStorageData();
  document.querySelectorAll(".dayNum").forEach(day => day.textContent = days);
}

function updateFinalPrice(currentPricePerDay = pricePerDay) {
  const { days } = getStorageData();
  const carPrice = currentPricePerDay * days;

  carFinalPrice.textContent        = carPrice;
  carFinalPrice.dataset.basePrice  = carPrice;

  let finalPrice = carPrice;
  getAddonChecks().forEach(check => {
    if (check.checked) finalPrice += parseFloat(check.dataset.price) * days;
  });

  finalAmount.dataset.basePrice = finalPrice;
  finalAmount.textContent       = finalPrice;
  triggerPriceUpdate();
}

function updateAddons() {
  const { days } = getStorageData();
  addonsCon.innerHTML = "";

  getAddonChecks().forEach(check => {
    const card = check.closest(".addons-card-check");
    if (check.checked) {
      addonsCon.style.display = "flex";
      card?.classList.add("checked");

      const addonPrice = parseFloat(check.dataset.price) * days;
      addonsCon.insertAdjacentHTML("beforeend", `
        <div class="addon-card">
          <div class="addon-item items">
            <p class="addon-name">${check.getAttribute("data-name")}</p>
            <span>X</span>
            <p class="days"><span class="dayNum">${days}</span> days</p>
          </div>
          <div class="price-item">
            <span class="currency-sign">€</span>
            <span class="currency-num">${addonPrice}</span>
          </div>
        </div>`);
    } else {
      card?.classList.remove("checked");
    }
  });

  triggerPriceUpdate();
  updateFinalPrice();
}


function getTodayPrice(pricingRows) {
  if (!pricingRows || pricingRows.length === 0) return null;
  const today = new Date().toISOString().split('T')[0];
  const match = pricingRows.find(p => {
    const from = p.valid_from ?? '0000-01-01';
    const to   = p.valid_to   ?? '9999-12-31';
    return today >= from && today <= to;
  });
  return match ?? pricingRows[0];
}

function getPrimaryPhoto(photos) {
  if (!photos || photos.length === 0) return null;
  return photos.find(p => p.is_primary) ?? photos[0];
}

function getPhotoUrl(storagePath) {
  if (!storagePath)
    return "https://jdhigikorvtxhslxudcs.supabase.co/storage/v1/object/public/cars/car-placeholder.avif";
  if (storagePath.startsWith("http")) return storagePath;
  return `${SUPABASE_URL}/storage/v1/object/public/${storagePath}`;
}

function updatePage(car) {
  const pricing            = getTodayPrice(car.car_pricing);
  const currentPricePerDay = pricing ? parseFloat(pricing.price_per_day) : 0;
  pricePerDay              = currentPricePerDay;

  const photo    = getPrimaryPhoto(car.car_photos);
  const imageUrl = getPhotoUrl(photo?.storage_path);
  const imageAlt = photo?.alt_text ?? `${car.brand} ${car.model}`;

  if (carName)         carName.textContent         = `${car.brand} ${car.model}`;
  if (carNamePrice)    carNamePrice.textContent     = `${car.brand} ${car.model}`;
  if (carLuggage)      carLuggage.textContent       = `${car.trunk_litres}`;
  if (carSeats)        carSeats.textContent         = `${car.seats}`;
  if (carTransmission) carTransmission.textContent  = `${car.transmission}`;
  if (mainImg)        { mainImg.src      = imageUrl; mainImg.alt = imageAlt; }

  updateFinalPrice(currentPricePerDay);
}

function buildAddonCard(extra, priceOverride) {
  const effectivePrice = priceOverride !== null && priceOverride !== undefined
    ? parseFloat(priceOverride)
    : parseFloat(extra.price);

  const icon    = getIconForSlug(extra.slug);
  const safeId  = `addon_${extra.slug.replace(/[^a-z0-9]/gi, '_')}`;

  const card = document.createElement('div');
  card.className = 'addons-card addons-card-check';
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
      <h3 class="addon-title">${extra.name}</h3>
      <p class="addon-description">${extra.description ?? ''}</p>
      <p class="addon-price">
        <span class="currency-sign">€</span><span class="currency-num">${effectivePrice.toFixed(2)}</span>/dite
      </p>
    </div>
  `;

  card.querySelector('.addonCheck').addEventListener('change', updateAddons);

  return card;
}

async function loadCarExtras(carId) {
  if (!addonsCardCon) return;

  const { data, error } = await supabaseClient
    .from('car_extras')
    .select(`
      price_override,
      extras (
        id, slug, name, description, price, is_active
      )
    `)
    .eq('car_id', carId);

  if (error || !data) {
    console.error('Failed to load car extras:', error);
    return;
  }

  addonsCardCon.innerHTML = '';

  data
    .filter(row => row.extras?.is_active)
    .forEach(row => {
      const card = buildAddonCard(row.extras, row.price_override);
      addonsCardCon.appendChild(card);
    });
}

async function loadCarDetails() {
  const carId = getCarIdFromUrl();
  if (!carId) return;

  const { data: car, error } = await supabaseClient
    .from('cars')
    .select(`
      id, brand, model, year, category, color, license_plate,
      fuel, transmission, seats, doors, has_ac, trunk_litres,
      mileage_unlimited, mileage_limit_km, extra_km_fee,
      deposit_amount, ferry_allowed, cross_border_allowed, ferry_fee,
      insurance_type, insurance_notes,
      car_pricing ( price_per_day, valid_from, valid_to ),
      car_photos  ( storage_path, alt_text, is_primary, sort_order ),
      car_cross_border_permissions (
        cross_border_countries ( country_name, country_code, fee )
      )
    `)
    .eq('id', carId)
    .single();

  if (error || !car) return;

  updatePage(car);

  await loadCarExtras(carId);

  updateFinalPrice();
}

bookingNxtBtn.addEventListener('click', () => {
  addonPage.style.display    = 'none';
  infoPage.style.display     = 'flex';
  bookingNxtBtn.style.display = 'none';
  formSendBtn.style.display  = 'block';
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

let calendarsInitialized = false;
locationForm.addEventListener("toggle", (e) => {
  document.body.style.overflow = e.newState === "open" ? "hidden" : "";
  if (e.newState === "open" && !calendarsInitialized) {
    displayCalendarForm();
    calendarsInitialized = true;
  }
});

changeBtn.onclick = () => {
  const { locationData } = getStorageData();
  if (!locationData) return;
  formPickupLoc.value   = locationData.pickupLoc  || "";
  formDropoffLoc.value  = locationData.dropoffLoc || "";
  formPickupDate.value  = locationData.pickupDate || "";
  formDropoffDate.value = locationData.dropoffDate || "";
  formPickupTime.value  = locationData.pickupTime  || "00:00";
  formDropoffTime.value = locationData.dropoffTime || "00:00";
};

function updateLocationData() {
  const updatedLocationData = {
    pickupLoc:    formPickupLoc.value,
    dropoffLoc:   formDropoffLoc.value,
    pickupDate:   formPickupDate.value,
    dropoffDate:  formDropoffDate.value,
    pickupTime:   formPickupTime.value,
    dropoffTime:  formDropoffTime.value,
  };
  if (dropoffCheck.checked) updatedLocationData.dropoffLoc = updatedLocationData.pickupLoc;
  localStorage.setItem("locationData", JSON.stringify(updatedLocationData));
  calcDays(updatedLocationData.pickupDate, updatedLocationData.dropoffDate);
  displayData();
  displayDate();
  updateAddons();
  updateFinalPrice();
  locationForm.hidePopover();
}

document.getElementById("closeDialog").onclick = () => locationForm.hidePopover();
document.addEventListener('DOMContentLoaded', loadCarDetails);
displayData();
displayDate();
updateFinalPrice();