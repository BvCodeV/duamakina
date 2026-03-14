const pickupInpt = document.getElementById("pickup")
const dropoffInpt = document.getElementById("dropoff")
const pickupDate = document.getElementById("pickupDate")
const dropoffDate = document.getElementById("dropoffDate")
const pickupTime = document.getElementById("pickupTime")
const dropoffTime = document.getElementById("dropoffTime")
// test html 
const pickupInptTxt = document.getElementById("pickupTxt")
const dropoffInptTxt = document.getElementById("dropoffTxt")
const pickupDateTxt = document.getElementById("pickupDateTxt")
const dropoffDateTxt = document.getElementById("dropoffDateTxt")
const pickupTimeTxt = document.getElementById("pickupTimeTxt")
const dropoffTimeTxt = document.getElementById("dropoffTimeTxt")

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

  window.location.href = '/test.html';
}

document.addEventListener('DOMContentLoaded', () => {
  if (window.location.pathname === "/test.html") {
    const filter = JSON.parse(localStorage.getItem("homeFilters"))
    pickupInptTxt.textContent = filter.pickupLoc
    pickupDateTxt.textContent = filter.pickupDate
    pickupTimeTxt.textContent = filter.pickupTime
    dropoffInptTxt.textContent = filter.dropoffLoc
    dropoffDateTxt.textContent = filter.dropoffDate
    dropoffTimeTxt.textContent = filter.dropoffTime
  }
});