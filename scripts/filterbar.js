const pickupInpt = document.getElementById("pickup")
const dropoffInpt = document.getElementById("dropoff")
const pickupDate = document.getElementById("pickupDate")
const dropoffDate = document.getElementById("dropoffDate")
const pickupTime = document.getElementById("pickupTime")
const dropoffTime = document.getElementById("dropoffTime")

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
  localStorage.setItem("homeFilters", JSON.stringify(filter))
  window.location.href = '/pages/fleet.html';
}

document.addEventListener('DOMContentLoaded', () => {
  if (window.location.pathname === "/pages/fleet.html") {
    const pickupInptTxt = document.getElementById("pickupTxt")
    const dropoffInptTxt = document.getElementById("dropoffTxt")
    const pickupDateTxt = document.getElementById("pickupDateTxt")
    const dropoffDateTxt = document.getElementById("dropoffDateTxt")
    const pickupTimeTxt = document.getElementById("pickupTimeTxt")
    const dropoffTimeTxt = document.getElementById("dropoffTimeTxt")

    const filter = JSON.parse(localStorage.getItem("homeFilters"))
    if (filter && pickupInptTxt) {
      pickupInptTxt.textContent = filter.pickupLoc
      pickupDateTxt.textContent = filter.pickupDate
      pickupTimeTxt.textContent = filter.pickupTime
      dropoffInptTxt.textContent = filter.dropoffLoc
      dropoffDateTxt.textContent = filter.dropoffDate
      dropoffTimeTxt.textContent = filter.dropoffTime

      const days = calcDays(filter.pickupDate, filter.dropoffDate);
      localStorage.setItem("tripLength", days)
    }
  }
});

  function calcDays(pickupStr, dropoffStr) {
    const year = new Date().getFullYear();
    const pickup = new Date(`${pickupStr} ${year}`);
    const dropoff = new Date(`${dropoffStr} ${year}`);

    const diff = dropoff - pickup;
    const days = Math.round(diff / (1000 * 60 * 60 * 60 * 24));
    return days;
  }