const dayNumber = document.querySelectorAll(".dayNum");
const addonsCon = document.getElementById("addonCon");
const addonCheck = document.querySelectorAll(".addonCheck");
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
let pricePerDay = 50;

const getStorageData = () => ({
  locationData: JSON.parse(localStorage.getItem("locationData")),
  days: parseFloat(localStorage.getItem("daysCalc")) || 1,
});

const getCurrencySelect = () => document.getElementById("currencySelect").value;
const triggerPriceUpdate = () => window.updatePrice?.(getCurrencySelect());

function displayData() {
  const { locationData } = getStorageData();
  pickupDateForm.textContent = locationData.pickupDate;
  dropoffDateForm.textContent = locationData.dropoffDate;
  pickupTimeForm.textContent = locationData.pickupTime;
  dropoffTimeForm.textContent = locationData.dropoffTime;
  pickupLocationForm.textContent = locationData.pickupLoc;
  dropoffLocationForm.textContent = locationData.dropoffLoc;
}

function displayDate() {
  const { days } = getStorageData();
  dayNumber.forEach(day => day.textContent = days);
}

function updateFinalPrice() {
  const { days } = getStorageData();
  let carPrice = pricePerDay * days;

  carFinalPrice.textContent = carPrice;
  carFinalPrice.dataset.basePrice = carPrice;
  
  let finalPrice = pricePerDay * days;
  addonCheck.forEach(check => {
    if (check.checked) finalPrice += parseFloat(check.dataset.price) * days;
  });

  finalAmount.dataset.basePrice = finalPrice;
  finalAmount.textContent = finalPrice;
  triggerPriceUpdate();
}

function updateAddons() {
  const { days } = getStorageData();
  addonsCon.innerHTML = "";

  addonCheck.forEach(check => {
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

displayData();
displayDate();
updateFinalPrice();
addonCheck.forEach(check => check.addEventListener("change", updateAddons));
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
  formPickupLoc.value = locationData.pickupLoc || "";
  formDropoffLoc.value = locationData.dropoffLoc || "";
  formPickupDate.value = locationData.pickupDate || "";
  formDropoffDate.value = locationData.dropoffDate || "";
  formPickupTime.value = locationData.pickupTime || "00:00";
  formDropoffTime.value = locationData.dropoffTime || "00:00";
};

function updateLocationData() {
  const updatedLocationData = {
    pickupLoc: formPickupLoc.value,
    dropoffLoc: formDropoffLoc.value,
    pickupDate: formPickupDate.value,
    dropoffDate: formDropoffDate.value,
    pickupTime: formPickupTime.value,
    dropoffTime: formDropoffTime.value,
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