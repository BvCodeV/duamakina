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
let activeCarType = document.querySelector('.selected-type');
const minR = document.getElementById('min-range');
const maxR = document.getElementById('max-range');
const fill = document.getElementById('fill');
const GAP = 50;

filterBtn.onclick = () => {
  sidebarFilter.style.display = 'block';
  document.body.style.overflow = 'hidden';
}

closeSidebarBtn.onclick = () => {
  sidebarFilter.style.display = 'none';
  document.body.style.overflow = '';
}

carTypePills.forEach(div => {
  div.addEventListener("click", () => {
    if (activeCarType) activeCarType.classList.remove('selected-type');
    activeCarType = div;
    div.classList.add('selected-type')
  })
})

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

// Handle modal open button
document.getElementById("locationChangeBtn").onclick = () => {
  const filter = JSON.parse(localStorage.getItem("homeFilters"));
  if (filter) {
    document.getElementById("changePickup").value = filter.pickupLoc || '';
    document.getElementById("changeDropoff").value = filter.dropoffLoc || '';
    document.getElementById("changePickupDate").value = filter.pickupDate || '';
    document.getElementById("changeDropoffDate").value = filter.dropoffDate || '';
    document.getElementById("changePickupTime").value = filter.pickupTime || '00:00';
    document.getElementById("changeDropoffTime").value = filter.dropoffTime || '00:00';
  }
};

locationDialog.addEventListener('toggle', (e) => {
  document.body.style.overflow = e.newState === 'open' ? 'hidden' : '';
});

filtersDialog.addEventListener('toggle', (e) => {
  document.body.style.overflow = e.newState === 'open' ? 'hidden' : '';
});

document.getElementById("closeDialog").onclick = () => locationDialog.hidePopover();
document.getElementById("filtersCloseDialog").onclick = () => filtersDialog.hidePopover();

function updateFilter() {
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

  // Update localStorage
  localStorage.setItem("homeFilters", JSON.stringify(newFilter));

  // Update displayed values on the page
  document.getElementById("pickupTxt").textContent = newFilter.pickupLoc;
  document.getElementById("dropoffTxt").textContent = newFilter.dropoffLoc;
  document.getElementById("pickupDateTxt").textContent = newFilter.pickupDate;
  document.getElementById("dropoffDateTxt").textContent = newFilter.dropoffDate;
  document.getElementById("pickupTimeTxt").textContent = newFilter.pickupTime;
  document.getElementById("dropoffTimeTxt").textContent = newFilter.dropoffTime;

  // Close the modal
  locationDialog.hidePopover();
}

let calendarsInitialized = false;

locationDialog.addEventListener('toggle', (e) => {
  document.body.style.overflow = e.newState === 'open' ? 'hidden' : '';
  if (e.newState === 'open' && !calendarsInitialized) {
    initializeModalCalendars();
    calendarsInitialized = true;
  }
});

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