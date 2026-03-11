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