const pickupInpt = document.getElementById("pickup");
const dropoffInpt = document.getElementById("dropoff");
const pickupDate = document.getElementById("pickupDate");
const dropoffDate = document.getElementById("dropoffDate");
const pickupTime = document.getElementById("pickupTime");
const dropoffTime = document.getElementById("dropoffTime");
const filterBarBtN = document.getElementById("filterBtn");
const requiredElements = [pickupInpt, dropoffInpt, pickupDate, dropoffDate, pickupTime, dropoffTime, filterBarBtN];
const isFilterbarPage = requiredElements.every(Boolean);
const fields = [pickupInpt, dropoffInpt, pickupDate, dropoffDate, pickupTime, dropoffTime];

function filterFunction() {
  if (!isFilterbarPage) return;
  const filter = {
    pickupLoc: pickupInpt.value,
    pickupDate: pickupDate.value,
    pickupTime: pickupTime.value,
    dropoffLoc: dropoffInpt.value,
    dropoffDate: dropoffDate.value,
    dropoffTime: dropoffTime.value,
  }

  if (dropoffCheck?.checked) {
    filter.dropoffLoc = filter.pickupLoc
  }
  calcDays(filter.pickupDate, filter.dropoffDate);
  const allFilled = fields.every((field) => {
    const filled = Boolean(field.value);
    field.style.border = filled ? "" : "1px solid var(--color-error)";
    return filled;
  });

if (allFilled) {
  localStorage.setItem("locationData", JSON.stringify(filter));
  window.location.href = '/pages/fleet.html';
}
}

filterBarBtN?.addEventListener("click", filterFunction);
