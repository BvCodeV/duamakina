const dropoffCheck = document.getElementById('dropoffCheck');
const dropoffLoc = document.getElementById('dropoffLoc');

document.addEventListener('DOMContentLoaded', () => {
  if (dropoffCheck.checked) {
    dropoffLoc.style.display = 'none';
  }
});

dropoffCheck.addEventListener('change', () => {
  if (dropoffCheck.checked) {
    dropoffLoc.style.display = 'none';
  } else {
    dropoffLoc.style.display = 'flex';
  }
});

function calcDays(pickupStr, dropoffStr) {
  const pickup = new Date(pickupStr);
  const dropoff = new Date(dropoffStr);

  const diff = dropoff - pickup;
  const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
  localStorage.setItem("daysCalc", days);
  return days;
}