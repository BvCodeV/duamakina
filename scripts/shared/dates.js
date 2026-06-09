export function calcRentalDays(pickupStr, dropoffStr) {
  const pickup = new Date(pickupStr);
  const dropoff = new Date(dropoffStr);

  if (Number.isNaN(pickup.getTime()) || Number.isNaN(dropoff.getTime())) {
    return 1;
  }

  const diff = dropoff - pickup;
  return Math.max(1, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

export function formatDateInput(date) {
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function buildHalfHourTimes() {
  const times = [];
  for (let hour = 0; hour < 24; hour += 1) {
    for (const minute of [0, 30]) {
      times.push(`${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`);
    }
  }
  return times;
}
