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

  document.getElementById('pickupDate').value =
    today.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  const dropoffInput = document.getElementById('dropoffDate');
  const dropoffDateField = dropoffInput?.closest('.date');

  const openDropoffCalendar = () => {
    if (pickup && typeof pickup.open === 'function') {
      pickup.open();
    }
  };

  dropoffInput?.addEventListener('click', openDropoffCalendar);
  dropoffDateField?.addEventListener('click', openDropoffCalendar);
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
  const pickupElement = document.querySelector('#changePickupDate');
  const dropoffElement = document.querySelector('#changeDropoffDate');

  const updateDateFields = (selectedDates, fp) => {
    if (selectedDates.length >= 1) {
      document.getElementById('changePickupDate').value =
        selectedDates[0].toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    }
    if (selectedDates.length === 2) {
      document.getElementById('changeDropoffDate').value =
        selectedDates[1].toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
      if (fp && typeof fp.close === 'function') fp.close();
    }
  };

  const calendarConfig = {
    appendTo: pickupElement.parentElement,
    mode: 'range',
    dateFormat: 'M j, Y',
    minDate: 'today',
    allowInput: false,
    position: 'below',
    onChange(selectedDates, dateStr, fp) {
      updateDateFields(selectedDates, fp);
    }
  };

  let pickupCalendar = flatpickr(pickupElement, calendarConfig);
  let dropoffCalendar = flatpickr(dropoffElement, calendarConfig);

  if (Array.isArray(pickupCalendar)) pickupCalendar = pickupCalendar[0];
  if (Array.isArray(dropoffCalendar)) dropoffCalendar = dropoffCalendar[0];
}

function displayCalendarForm() {
  const pickupFormElement = document.querySelector('#changeFormPickupDate');
  let pickupForm = flatpickr(pickupFormElement, {
    static: true,
    appendTo: pickupFormElement.parentElement,
    mode: 'range',
    dateFormat: 'M j, Y',
    minDate: 'today',
    allowInput: false,
    position: 'below right',
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