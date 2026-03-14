const pickupInpt = document.getElementById("pickup")
const dropoffInpt = document.getElementById("dropoff")
const pickupDate = document.getElementById("pickupDate")
const dropoffDate = document.getElementById("dropoffDate")
const pickupTime = document.getElementById("pickupTime")
const dropoffTime = document.getElementById("dropoffTime")

const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) || 
              (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

function getDateValue(inputId) {
  const el = document.getElementById(inputId);
  return isIOS ? el.dataset.formatted : el.value;
}

function filterFunction() {
  const filter = {
    pickupLoc: pickupInpt.value,
    pickupDate: getDateValue('pickupDate'),
    pickupTime: pickupTime.value,
    dropoffLoc: dropoffInpt.value,
    dropoffDate: getDateValue('dropoffDate'),
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

  const today = new Date().toISOString().split('T')[0];

  if (isIOS) {
    const pickupEl = document.getElementById('pickupDate');
    const dropoffEl = document.getElementById('dropoffDate');

    pickupEl.type = 'date';
    pickupEl.min = today;
    dropoffEl.type = 'date';
    dropoffEl.min = today;

    pickupEl.addEventListener('change', () => {
      const next = new Date(pickupEl.value + 'T00:00:00');
      next.setDate(next.getDate() + 1);
      dropoffEl.min = next.toISOString().split('T')[0];

      const date = new Date(pickupEl.value + 'T00:00:00');
      pickupEl.dataset.formatted = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    });

    dropoffEl.addEventListener('change', () => {
      const date = new Date(dropoffEl.value + 'T00:00:00');
      dropoffEl.dataset.formatted = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    });

    return;
  }

  if (!window.VanillaCalendarPro) return;
  const { Calendar } = window.VanillaCalendarPro;

  const dropoff = new Calendar('#dropoffDate', {
    inputMode: true,
    selectedTheme: 'light',
    dateMin: today,
    onClickDate(self) {
      const raw = self.context.selectedDates[0];
      if (!raw) return;
      const date = new Date(raw + 'T00:00:00');
      const formatted = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      document.querySelector('#dropoffDate').value = formatted;
    }
  });
  dropoff.init();

  const pickup = new Calendar('#pickupDate', {
    inputMode: true,
    selectedTheme: 'light',
    dateMin: today,
    onClickDate(self) {
      const raw = self.context.selectedDates[0];
      if (!raw) return;

      const next = new Date(raw + 'T00:00:00');
      next.setDate(next.getDate() + 1);
      dropoff.set({ dateMin: next.toISOString().split('T')[0] }, { dates: true, month: true, year: true });

      const date = new Date(raw + 'T00:00:00');
      const formatted = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      document.querySelector('#pickupDate').value = formatted;
    }
  });
  pickup.init();
});

function calcDays(pickupStr, dropoffStr) {
  const year = new Date().getFullYear();
  const pickup = new Date(`${pickupStr} ${year}`);
  const dropoff = new Date(`${dropoffStr} ${year}`);

  const diff = dropoff - pickup;
  const days = Math.round(diff / (1000 * 60 * 60 * 60 * 24));
  return days;
}