  const pickup = flatpickr('#pickupDate', {
    mode: 'range',
    dateFormat: 'M j, y',
    minDate: 'today',
    allowInput: false,
    position: 'below',
    onChange(selectedDates) {
      if (selectedDates.length >= 1) {
        document.getElementById('pickupDate').value =
          selectedDates[0].toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: "numeric" });
      }
      if (selectedDates.length === 2) {
        document.getElementById('dropoffDate').value =
          selectedDates[1].toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: "numeric" });
      }
    }
  });

  document.getElementById('dropoffDate').addEventListener('click', () => pickup.open());

function initializeModalCalendars() {
  const pickup = flatpickr('#changePickupDate', {
    mode: 'range',
    dateFormat: 'M j, y',
    minDate: 'today',
    allowInput: false,
    position: 'above left',
    onReady(_, __, fp) {
      locationDialog.appendChild(fp.calendarContainer);
    },
    onChange(selectedDates) {
      if (selectedDates.length >= 1) {
        document.getElementById('changePickupDate').value =
          selectedDates[0].toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: "numeric" });
      }
      if (selectedDates.length === 2) {
        document.getElementById('changeDropoffDate').value =
          selectedDates[1].toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: "numeric" });
        pickup.close();
      }
    }
  });

  document.getElementById('changeDropoffDate').addEventListener('click', () => pickup.open());
}