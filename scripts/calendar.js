if (document.getElementById('pickupDate')) {
  const pickup = flatpickr('#pickupDate', {
    mode: 'range',
    dateFormat: 'M j, Y',
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
}

if (document.getElementById('driverLicense')) {
  const driverLicense = flatpickr('#driverLicense', {
    mode: 'single',
    dateFormat: 'M j, Y',
    minDate: 'today',
    allowInput: false,
  });
}

function displayCalendarFleet() {
  const pickup = flatpickr('#changePickupDate', {
    mode: 'range',
    dateFormat: 'M j, Y',
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

function displayCalendarForm() {
  const pickupForm = flatpickr('#changeFormPickupDate', {
    static: true,
    appendTo: document.querySelector(".date-time-con"),
    mode: 'range',
    dateFormat: 'M j, Y',
    minDate: 'today',
    allowInput: false,
    position: 'above right',
    onChange(selectedDates) {
      if (selectedDates.length >= 1) {
        document.getElementById('changeFormPickupDate').value =
          selectedDates[0].toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: "numeric" });
      }
      if (selectedDates.length === 2) {
        document.getElementById('changeFormDropoffDate').value =
          selectedDates[1].toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: "numeric" });
        pickupForm.close();
      }
    }
  });
  document.getElementById('changeFormDropoffDate').addEventListener('click', () => pickupForm.open());
}