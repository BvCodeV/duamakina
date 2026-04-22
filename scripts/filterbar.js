const pickupInpt = document.getElementById("pickup")
const dropoffInpt = document.getElementById("dropoff")
const pickupDate = document.getElementById("pickupDate")
const dropoffDate = document.getElementById("dropoffDate")
const pickupTime = document.getElementById("pickupTime")
const dropoffTime = document.getElementById("dropoffTime")
const filterBtn = document.getElementById("filterBtn")
const fields = [pickupInpt, dropoffDate, pickupDate, dropoffDate]
let allFilled = true;

function filterFunction() {
  const filter = {
    pickupLoc: pickupInpt.value,
    pickupDate: pickupDate.value,
    pickupTime: pickupTime.value,
    dropoffLoc: dropoffInpt.value,
    dropoffDate: dropoffDate.value,
    dropoffTime: dropoffTime.value,
  }

  if (dropoffCheck.checked) {
    filter.dropoffLoc = filter.pickupLoc
  }
  calcDays(filter.pickupDate, filter.dropoffDate);
  fields.forEach(field => {
  if (!field.value) {
    field.style.border = "1px solid var(--color-error)";
    allFilled = false;
  } else {
    field.style.backgroundColor = "";
    allFilled = true;
  }
});

if (allFilled) {
  localStorage.setItem("locationData", JSON.stringify(filter));
  window.location.href = langHref('/pages/fleet.html');
}
}

filterBtn.addEventListener("click", filterFunction);