const dropoffCheck = document.getElementById('dropoffCheck');
const dropoffLoc = document.getElementById('dropoffLoc');

document.addEventListener('DOMContentLoaded', () => {
  if (dropoffCheck?.checked && dropoffLoc) {
    dropoffLoc.style.display = 'none';
  }
});

dropoffCheck?.addEventListener('change', () => {
  if (!dropoffLoc) return;
  if (dropoffCheck.checked) {
    dropoffLoc.style.display = 'none';
  } else {
    dropoffLoc.style.display = 'flex';
  }
});

function calcDays(pickupStr, dropoffStr) {
  const pickup = new Date(pickupStr);
  const dropoff = new Date(dropoffStr);

  if (Number.isNaN(pickup.getTime()) || Number.isNaN(dropoff.getTime())) {
    localStorage.setItem("daysCalc", 1);
    return 1;
  }

  const diff = dropoff - pickup;
  const days = Math.max(1, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  localStorage.setItem("daysCalc", days);
  return days;
}
