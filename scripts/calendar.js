if (document.getElementById('pickupDate')) {
  const today = new Date();
  const defaultDropoff = new Date();
  defaultDropoff.setDate(today.getDate() + 5);
  document.getElementById('dropoffDate').value =
    defaultDropoff.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  const pickup = flatpickr('#pickupDate', {
    mode: 'range',
    dateFormat: 'M j, Y',
    minDate: 'today',
    allowInput: false,
    position: 'below',
    defaultDate: "today",
    onChange(selectedDates) {
      if (selectedDates.length >= 1) {
        document.getElementById('pickupDate').value =
          selectedDates[0].toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
      }
      if (selectedDates.length === 2) {
        document.getElementById('dropoffDate').value =
          selectedDates[1].toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
      }
    }
  });
  pickup.config.onChange(pickup.selectedDates, null, pickup);

  const dropoffInput = document.getElementById('dropoffDate');
  dropoffInput.addEventListener('click', (event) => {
    event.preventDefault();
    pickup.open();
  });
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
  const locationDialog = document.getElementById('locationFilterDialog');
  const pickupElement = document.querySelector('#changePickupDate');
  let pickup = flatpickr(pickupElement, {
    static: true,
    appendTo: locationDialog?.querySelector('.date-time-con') || document.querySelector('.date-time-con'),
    mode: 'range',
    dateFormat: 'M j, Y',
    minDate: 'today',
    allowInput: false,
    position: 'above left',
    onReady(_, __, fp) {
      if (locationDialog) locationDialog.appendChild(fp.calendarContainer);
    },
    onChange(selectedDates) {
      if (selectedDates.length >= 1) {
        document.getElementById('changePickupDate').value =
          selectedDates[0].toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
      }
      if (selectedDates.length === 2) {
        document.getElementById('changeDropoffDate').value =
          selectedDates[1].toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        if (pickup && typeof pickup.close === 'function') pickup.close();
      }
    }
  });
  if (Array.isArray(pickup)) pickup = pickup[0];
  document.getElementById('changeDropoffDate').addEventListener('click', () => pickup.open());
}

function displayCalendarForm() {
  const pickupFormElement = document.querySelector('#changeFormPickupDate');
  let pickupForm = flatpickr(pickupFormElement, {
    static: true,
    appendTo: document.querySelector('.date-time-con'),
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
        if (pickupForm && typeof pickupForm.close === 'function') pickupForm.close();
      }
    }
  });
  if (Array.isArray(pickupForm)) pickupForm = pickupForm[0];
  document.getElementById('changeFormDropoffDate').addEventListener('click', () => pickupForm.open());
}