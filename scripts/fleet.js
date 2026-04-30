const sidebarFilter = document.getElementById('sidebarFilter');
const closeSidebarBtn = document.getElementById('closeSidebarBtn');
const filterBtn = document.getElementById('filterBtn')
const automaticPopular = document.getElementById('automaticFilterBox');
const milagePopular = document.getElementById('milageFilterBox');
const acPopular = document.getElementById('acFilterBox');
const seatsPopular = document.getElementById('seatsFilterBox');
const electricPopular = document.getElementById('electricFilterBox');
const freeCancelPopular = document.getElementById('freeCancelFilterBox');
const specialPopular = document.getElementById('specialFilterBox');
const pillsCon = document.getElementById('filterPillsCon');
const carTypePills = document.querySelectorAll('.type-pill');
const locationDialog = document.getElementById("locationFilterDialog")
const filtersDialog = document.getElementById("filtersDialog");
const container = document.querySelector('.cars-card-con');
const carNum = document.getElementById('carNum');
let activeCarType = document.querySelector('.selected-type');
// location data
const pickupTxt = document.getElementById("pickupTxt");
const dropoffTxt = document.getElementById("dropoffTxt");
const pickupDateTxt = document.getElementById("pickupDateTxt");
const dropoffDateTxt = document.getElementById("dropoffDateTxt");
const pickupTimeTxt = document.getElementById("pickupTimeTxt");
const dropoffTimeTxt = document.getElementById("dropoffTimeTxt");

const minR = document.getElementById('min-range');
const maxR = document.getElementById('max-range');
const fill = document.getElementById('fill');
const GAP = 50;

// display location data
function displayLocationDataSearch() {
  const locationData = JSON.parse(localStorage.getItem("locationData"))
  pickupTxt.textContent = locationData.pickupLoc;
  dropoffTxt.textContent = locationData.dropoffLoc;
  pickupDateTxt.textContent = locationData.pickupDate;
  dropoffDateTxt.textContent = locationData.dropoffDate;
  pickupTimeTxt.textContent = locationData.pickupTime;
  dropoffTimeTxt.textContent = locationData.dropoffTime;
}
displayLocationDataSearch();

// cars display
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
  if (!storagePath) return 'https://jdhigikorvtxhslxudcs.supabase.co/storage/v1/object/public/cars/car-placeholder.avif';
  if (storagePath.startsWith('http')) return storagePath;
  return `${SUPABASE_URL}/storage/v1/object/public/${storagePath}`;
}
 
function capitalize(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}
 
// ─── Card Builder ────────────────────────────────────────────
 
function buildCarCard(car) {
  const pricing      = getTodayPrice(car.car_pricing);
  const photo        = getPrimaryPhoto(car.car_photos);
  const imageUrl     = getPhotoUrl(photo?.storage_path);
  const imageAlt     = photo?.alt_text ?? `${car.brand} ${car.model}`;
  const price        = pricing ? parseFloat(pricing.price_per_day).toFixed(2) : 'N/A';
  const transmission = capitalize(car.transmission);
  const trunkLitres  = car.trunk_litres ?? '—';
 
  return `
    <div class="car-card">
      <img
        src="${imageUrl}"
        alt="${imageAlt}"
        class="car-image"
        loading="lazy"
        draggable="false"
      >
      <div class="card-body">
        <h2 class="car-title">${car.brand} ${car.model}</h2>
        <ul class="car-features">
          <li><img src="/assets/icons/person.svg" alt="person icon" loading="lazy" draggable="false"> ${car.seats} Seats</li>
          <li><img src="/assets/icons/bag.svg" alt="bag icon" loading="lazy" draggable="false"> ${trunkLitres}L Trunk</li>
          <li><img src="/assets/icons/door.svg" alt="door icon" loading="lazy" draggable="false"> ${car.doors} Doors</li>
          <li><img src="/assets/icons/gears.svg" alt="gears icon" loading="lazy" draggable="false"> ${transmission}</li>
          ${car.has_ac ? `<li><img src="/assets/icons/ac.svg" alt="ac icon" loading="lazy" draggable="false"> A/C</li>` : ''}
        </ul>
        <ul class="car-amenities">
          ${car.mileage_unlimited ? `<li><img src="/assets/icons/checkmark.svg" alt="checkmark icon" loading="lazy" draggable="false"> Unlimited Mileage</li>` : ''}
          <li><img src="/assets/icons/checkmark.svg" alt="checkmark icon" loading="lazy" draggable="false"> Free Cancellation</li>
          <li><img src="/assets/icons/checkmark.svg" alt="checkmark icon" loading="lazy" draggable="false"> 24/7 Assistance</li>
        </ul>
        <div class="review-con">
          <div class="rating">
            <img src="/assets/icons/star.svg" alt="star icon" loading="lazy" draggable="false">
            <span>—</span>
          </div>
          <p>No reviews yet</p>
        </div>
      </div>
      <hr>
      <div class="card-end">
        <div class="car-price">
          <div class="price">
            <span class="currency-sign" style="font-size: 1em; font-weight: bold; color: var(--color-txt-primary);">€</span><span class="currency-num" style="font-size: 1em; font-weight: bold; color: var(--color-txt-primary);">${price}</span>
          </div>
          <span>per day</span>
        </div>
        <a href="/pages/booking.html?id=${car.id}" class="rent-now-btn">View Details</a>
      </div>
    </div>
  `;
}

function sortCars(cars, sortValue) {
  const sorted = [...cars];
  switch (sortValue) {
    case 'lToH':
      return sorted.sort((a, b) => {
        const pa = parseFloat(getTodayPrice(a.car_pricing)?.price_per_day ?? Infinity);
        const pb = parseFloat(getTodayPrice(b.car_pricing)?.price_per_day ?? Infinity);
        return pa - pb;
      });
    case 'hToL':
      return sorted.sort((a, b) => {
        const pa = parseFloat(getTodayPrice(a.car_pricing)?.price_per_day ?? 0);
        const pb = parseFloat(getTodayPrice(b.car_pricing)?.price_per_day ?? 0);
        return pb - pa;
      });
    case 'newest':
      return sorted.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    case 'popular':
    default:
      return sorted.sort((a, b) => a.brand.localeCompare(b.brand));
  }
}
 
 
let allCars = [];
 
function renderCars(sortValue = 'popular') {
  if (!container) return;
  const sorted = sortCars(allCars, sortValue);
  container.innerHTML = sorted.map(buildCarCard).join('');
}
 
async function loadCars() {
  if (!container) {
    console.error('No .cars-card-con element found in the DOM.');
    return;
  }
 
  container.innerHTML = '<p class="loading-msg">Loading cars...</p>';
 
  const { data: cars, error } = await supabaseClient
    .from('cars')
    .select(`
      id,
      brand,
      model,
      year,
      category,
      seats,
      doors,
      has_ac,
      trunk_litres,
      transmission,
      mileage_unlimited,
      is_available,
      is_active,
      created_at,
      car_pricing ( price_per_day, valid_from, valid_to, is_special_offer ),
      car_photos  ( storage_path, alt_text, is_primary, sort_order )
    `)
    .eq('is_active', true)
    .eq('is_available', true);
 
  if (error) {
    console.error('Error fetching cars:', error.message);
    container.innerHTML = '<p class="error-msg">Failed to load cars. Please try again later.</p>';
    return;
  }
 
  if (!cars || cars.length === 0) {
    container.innerHTML = '<p class="empty-msg">No cars available at the moment.</p>';
    return;
  }
 
  allCars = cars;
  
  if (carNum) carNum.textContent = cars.length;

  const sortSelect = document.getElementById('carSort');
  renderCars(sortSelect?.value ?? 'popular');
}
 
document.addEventListener('DOMContentLoaded', () => {
  loadCars();
 
  const sortSelect = document.getElementById('carSort');
  if (sortSelect) {
    sortSelect.addEventListener('change', () => renderCars(sortSelect.value));
  }
});

// filter Pills
carTypePills.forEach(div => {
  div.addEventListener("click", () => {
    if (activeCarType) activeCarType.classList.remove('selected-type');
    activeCarType = div;
    div.classList.add('selected-type')
  })
});
const pillsConfig = [
  { checkbox: automaticPopular, label: 'Automatic' },
  { checkbox: milagePopular,    label: 'Unlimited Mileage' },
  { checkbox: acPopular,        label: 'AC' },
  { checkbox: seatsPopular,     label: '4+ Seats' },
  { checkbox: electricPopular,  label: 'Electric' },
  { checkbox: freeCancelPopular, label: 'Free Cancellation' },
  { checkbox: specialPopular,   label: 'Special Offers' },
];
pillsCon.addEventListener('click', (e) => {
  if (e.target.tagName === 'BUTTON') {
    const pill = e.target.closest('.filter-pill');
    const label = pill.dataset.label;

    // Uncheck the corresponding checkbox
    const match = pillsConfig.find(item => item.label === label);
    if (match) match.checkbox.checked = false;

    pill.remove();
  }
});
pillsConfig.forEach(({ checkbox, label }) => {
  checkbox.addEventListener('change', () => {
    if (checkbox.checked) {
      pillsCon.insertAdjacentHTML('beforeend', `
        <div class="filter-pill" data-label="${label}">
          <p>${label}</p>
          <button>X</button>
        </div>
      `);
    } else {
      // Remove pill when unchecked
      pillsCon.querySelector(`[data-label="${label}"]`)?.remove();
    }
  });
});

// location dialog

let calendarsInitialized = false;
locationDialog.addEventListener('toggle', (e) => {
  document.body.style.overflow = e.newState === 'open' ? 'hidden' : '';
  if (e.newState === 'open' && !calendarsInitialized) {
    displayCalendarFleet();
    calendarsInitialized = true;
  }
});
document.getElementById("locationChangeBtn").onclick = () => {
  const filter = JSON.parse(localStorage.getItem("locationData"));
  if (filter) {
    document.getElementById("changePickup").value = filter.pickupLoc || '';
    document.getElementById("changeDropoff").value = filter.dropoffLoc || '';
    document.getElementById("changePickupDate").value = filter.pickupDate || '';
    document.getElementById("changeDropoffDate").value = filter.dropoffDate || '';
    document.getElementById("changePickupTime").value = filter.pickupTime || '00:00';
    document.getElementById("changeDropoffTime").value = filter.dropoffTime || '00:00';
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

  if (dropoffCheck.checked) {
    newFilter.dropoffLoc = newFilter.pickupLoc
  }
  localStorage.setItem("locationData", JSON.stringify(newFilter));
  calcDays(newFilter.pickupDate, newFilter.dropoffDate);
  displayLocationDataSearch();
  locationDialog.hidePopover();
}
document.getElementById("closeDialog").onclick = () => locationDialog.hidePopover();

// filters dialog

filtersDialog.addEventListener('toggle', (e) => {
  document.body.style.overflow = e.newState === 'open' ? 'hidden' : '';
});
document.getElementById("filtersCloseDialog").onclick = () => filtersDialog.hidePopover();

// price range slider

function updatePriceRange() {
  let min = +minR.value, max = +maxR.value;
  if (max - min < GAP) {
    if (this === minR) minR.value = min = max - GAP;
    else maxR.value = max = min + GAP;
  }
  const total = +minR.max - +minR.min;
  fill.style.left  = ((min - +minR.min) / total * 100) + '%';
  fill.style.right = (100 - (max - +minR.min) / total * 100) + '%';
  document.getElementById('min-val').value = min;
  document.getElementById('max-val').value = max;
}
[minR, maxR].forEach(r => r.addEventListener('input', updatePriceRange));
updatePriceRange.call(minR);

// mobile filters

function mountAdvancedFilters() {
  const isMobile = window.matchMedia('(max-width: 1024px)').matches;
  const form = document.querySelector('#filtersDialog .main-dialog');
  const mobileSlot = document.querySelector('.mobile-advanced-filters');

  if (isMobile) {
    mobileSlot.appendChild(form);
  } else {
    document.getElementById('filtersDialog').appendChild(form);
  }
}
mountAdvancedFilters();
window.matchMedia('(max-width: 1024px)').addEventListener('change', mountAdvancedFilters);
filterBtn.onclick = () => {
  sidebarFilter.style.display = 'block';
  document.body.style.overflow = 'hidden';
}
closeSidebarBtn.onclick = () => {
  sidebarFilter.style.display = 'none';
  document.body.style.overflow = '';
}