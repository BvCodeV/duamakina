const EMAILJS_PUBLIC_KEY = "ZmJ9on6U4osdjkTZZ";
const EMAILJS_SERVICE_ID = "service_xma17yl";
const EMAILJS_OWNER_TEMPLATE = "template_omk94b4";
const EMAILJS_USER_TEMPLATE = "template_xf6v0rh";
const HCAPTCHA_SITE_KEY = "e32011ba-d8ce-4e7c-a9a6-7d5ebb086d3a";

const OWNER_EMAIL = "duamakina@outlook.com";

const COOLDOWN_KEY = "duamakina_last_sent";
const COOLDOWN_MS = 60_000;

const REQUIRED_FIELDS = [
  { id: "fullName", label: "Full Name" },
  { id: "email", label: "Email" },
  { id: "phone", label: "Phone Number" },
  { id: "driverName", label: "Driver's Full Name" },
  { id: "driverAge", label: "Driver's Age" },
  { id: "driverLicense", label: "License Expiry Date" },
];

function injectValidationStyles() {
  if (document.getElementById("dm-validation-styles")) return;
  const style = document.createElement("style");
  style.id = "dm-validation-styles";
  style.textContent = `
    /* Red border on invalid field */
    .dm-field-error {
      border-color: var(--color-error, #e53e3e) !important;
      background-color: oklch(from var(--color-error, #e53e3e) 0.97 0.01 h / 0.08) !important;
      animation: dm-shake 0.35s ease;
    }

    /* Shake animation on first validation attempt */
    @keyframes dm-shake {
      0%   { transform: translateX(0); }
      20%  { transform: translateX(-5px); }
      40%  { transform: translateX(5px); }
      60%  { transform: translateX(-4px); }
      80%  { transform: translateX(4px); }
      100% { transform: translateX(0); }
    }

    /* Small error message below the field */
    .dm-error-msg {
      display: block;
      font-size: 0.78rem;
      color: var(--color-error, #e53e3e);
      margin-top: 3px;
      padding-left: 0.75em;
      animation: dm-fade-in 0.2s ease;
    }

    @keyframes dm-fade-in {
      from { opacity: 0; transform: translateY(-4px); }
      to   { opacity: 1; transform: translateY(0); }
    }
  `;
  document.head.appendChild(style);
}

function markFieldError(el, message = "This field is required") {
  el.classList.add("dm-field-error");

  // Remove any existing error message first
  const existing = el.parentElement.querySelector(".dm-error-msg");
  if (existing) existing.remove();

  // Insert error message after the input
  const msg = document.createElement("span");
  msg.className = "dm-error-msg";
  msg.textContent = message;
  el.insertAdjacentElement("afterend", msg);

  // Auto-clear when user starts typing / changes value
  const clearOnInput = () => {
    clearFieldError(el);
    el.removeEventListener("input", clearOnInput);
    el.removeEventListener("change", clearOnInput);
  };
  el.addEventListener("input", clearOnInput);
  el.addEventListener("change", clearOnInput); // covers flatpickr / selects
}

function clearFieldError(el) {
  el.classList.remove("dm-field-error");
  const msg = el.parentElement?.querySelector(".dm-error-msg");
  if (msg) msg.remove();
}

function validateRequiredFields(options = {}) {
  const { showErrors = true } = options;
  let firstInvalid = null;
  const invalidLabels = [];

  REQUIRED_FIELDS.forEach(({ id, label }) => {
    const el = document.getElementById(id);
    if (!el) return;

    clearFieldError(el);

    const value = el.value?.trim() || "";
    const isEmpty = value === "";

    // Extra check: email format
    const isEmailBad =
      id === "email" &&
      value !== "" &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

    // Extra check: driver age range (matches booking.html placeholder 25-70 context)
    const isAgeBad =
      id === "driverAge" &&
      value !== "" &&
      (isNaN(Number(value)) || Number(value) < 18 || Number(value) > 75);

    if (isEmpty) {
      if (showErrors) markFieldError(el, "This field is required");
      invalidLabels.push(label);
      if (!firstInvalid) firstInvalid = el;
    } else if (isEmailBad) {
      if (showErrors) markFieldError(el, "Please enter a valid email address");
      invalidLabels.push(label + " (invalid format)");
      if (!firstInvalid) firstInvalid = el;
    } else if (isAgeBad) {
      if (showErrors) markFieldError(el, "Please enter a valid age (18 – 75)");
      invalidLabels.push(label + " (invalid age)");
      if (!firstInvalid) firstInvalid = el;
    }
  });

  if (showErrors && firstInvalid) {
    firstInvalid.scrollIntoView({ behavior: "smooth", block: "center" });
    // Small timeout so scroll completes before focus
    setTimeout(() => firstInvalid.focus(), 350);
  }

  return { isValid: invalidLabels.length === 0, invalidLabels };
}

function updateSendButtonState() {
  const btn = document.getElementById("formSendBtn");
  if (!btn) return;

  const termsCheck = document.getElementById("termsCheck");
  const { isValid } = validateRequiredFields({ showErrors: false });
  btn.disabled = !isValid || !termsCheck?.checked;
}

function wireRequiredFieldListeners() {
  REQUIRED_FIELDS.forEach(({ id }) => {
    const el = document.getElementById(id);
    if (!el) return;

    const eventName = el.tagName === "SELECT" || el.type === "checkbox" ? "change" : "input";
    el.addEventListener(eventName, updateSendButtonState);
    el.addEventListener("blur", () => validateRequiredFields({ showErrors: false }));
  });

  const termsCheck = document.getElementById("termsCheck");
  termsCheck?.addEventListener("change", updateSendButtonState);
}

document.addEventListener("DOMContentLoaded", () => {
  emailjs.init(EMAILJS_PUBLIC_KEY);
  injectValidationStyles();
  injectHcaptchaModal();
  wireFormSendBtn();
  wireRequiredFieldListeners();
  updateSendButtonState();
});

function wireFormSendBtn() {
  const btn = document.getElementById("formSendBtn");
  if (!btn) return;

  btn.removeAttribute("onclick");

  btn.addEventListener("click", async () => {
    const { isValid, invalidLabels } = validateRequiredFields();

    const termsCheck = document.getElementById("termsCheck");
    if (!termsCheck?.checked) {
      Swal.fire({
        title: "Terms & Conditions",
        text: "Please agree to the Terms & Conditions and Privacy Policy before sending your inquiry.",
        icon: "warning",
        confirmButtonText: "OK",
        confirmButtonColor: "var(--color-primary)",
      });
      return;
    }

    const lastSent = parseInt(localStorage.getItem(COOLDOWN_KEY) || "0", 10);
    const elapsed = Date.now() - lastSent;
    if (elapsed < COOLDOWN_MS) {
      const remaining = Math.ceil((COOLDOWN_MS - elapsed) / 1000);
      Swal.fire({
        title: "Please wait",
        text: `You can send another inquiry in ${remaining} second${remaining !== 1 ? "s" : ""}.`,
        icon: "info",
        confirmButtonText: "OK",
        confirmButtonColor: "var(--color-primary)",
      });
      return;
    }

    const token = await showCaptchaModal();
    if (!token) return;

    await sendInquiry(token);
  });
}

function injectHcaptchaModal() {
  if (document.getElementById("dm-captcha-modal")) return;

  const overlay = document.createElement("div");
  overlay.id = "dm-captcha-modal";
  overlay.innerHTML = `
    <div id="dm-captcha-box">
      <div id="dm-captcha-header">
        <img src="/assets/icons/favicon.svg" alt="DuaMakina" onerror="this.style.display='none'">
        <span>Human Verification</span>
      </div>
      <p id="dm-captcha-subtext">Please complete the challenge below to send your inquiry.</p>
      <div id="dm-hcaptcha-widget"></div>
      <div id="dm-captcha-footer">
        <button id="dm-captcha-cancel">Cancel</button>
        <button id="dm-captcha-confirm" disabled>Verify & Send</button>
      </div>
    </div>
  `;

  overlay.style.cssText = `
    display:none; position:fixed; inset:0; background:rgba(0,0,0,.55);
    backdrop-filter:blur(4px); z-index:99999;
    align-items:center; justify-content:center;
  `;

  const box = overlay.querySelector("#dm-captcha-box");
  box.style.cssText = `
    background:var(--color-surface, #fff); border-radius:16px;
    padding:28px 32px; max-width:370px; width:90%;
    box-shadow:0 24px 60px rgba(0,0,0,.25);
    display:flex; flex-direction:column; gap:16px;
    font-family:var(--font-body, sans-serif);
  `;

  overlay.querySelector("#dm-captcha-header").style.cssText = `
    display:flex; align-items:center; gap:10px;
    font-size:1.1rem; font-weight:700;
    color:var(--color-primary, #111);
  `;
  overlay.querySelector("#dm-captcha-header img").style.cssText =
    "width:28px;height:28px;";
  overlay.querySelector("#dm-captcha-subtext").style.cssText = `
    font-size:.875rem; color:var(--color-text-muted, #666); margin:0;
  `;
  overlay.querySelector("#dm-captcha-footer").style.cssText = `
    display:flex; justify-content:flex-end; gap:10px; margin-top:4px;
  `;

  const sharedBtnStyle = `
    padding:10px 22px; border:none; border-radius:8px; cursor:pointer;
    font-size:.9rem; font-weight:600; transition:opacity .2s;
  `;
  overlay.querySelector("#dm-captcha-cancel").style.cssText =
    sharedBtnStyle +
    "background:var(--color-surface-alt,#f2f2f2);color:var(--color-text,#333);";
  overlay.querySelector("#dm-captcha-confirm").style.cssText =
    sharedBtnStyle +
    "background:var(--color-primary,#111);color:#fff;opacity:.5;";

  document.body.appendChild(overlay);
}

let _captchaResolve = null;
let _hcaptchaWidgetId = null;

function showCaptchaModal() {
  return new Promise((resolve) => {
    _captchaResolve = resolve;

    const overlay = document.getElementById("dm-captcha-modal");
    const container = document.getElementById("dm-hcaptcha-widget");
    const originalConfirmBtn = document.getElementById("dm-captcha-confirm");
    const originalCancelBtn = document.getElementById("dm-captcha-cancel");
    const confirmBtn = originalConfirmBtn.cloneNode(true);
    const cancelBtn = originalCancelBtn.cloneNode(true);

    originalConfirmBtn.replaceWith(confirmBtn);
    originalCancelBtn.replaceWith(cancelBtn);

    overlay.style.display = "flex";
    confirmBtn.disabled = true;
    confirmBtn.style.opacity = ".5";
    confirmBtn._token = null;
    container.innerHTML = "";

    if (typeof hcaptcha !== "undefined") {
      _hcaptchaWidgetId = hcaptcha.render(container, {
        sitekey: HCAPTCHA_SITE_KEY,
        callback: (token) => {
          confirmBtn.disabled = false;
          confirmBtn.style.opacity = "1";
          confirmBtn._token = token;
        },
        "expired-callback": () => {
          confirmBtn.disabled = true;
          confirmBtn.style.opacity = ".5";
          confirmBtn._token = null;
        },
      });
    } else {
      container.innerHTML =
        '<p style="color:red;font-size:.8rem;">Verification unavailable. Please reload the page.</p>';
    }

    confirmBtn.addEventListener("click", () => {
      const token = confirmBtn._token;
      closeCaptchaModal();
      resolve(token || null);
    });
    cancelBtn.addEventListener("click", () => {
      closeCaptchaModal();
      resolve(null);
    });

    confirmBtn.style.cssText =
      "padding:10px 22px;border:none;border-radius:8px;cursor:pointer;font-size:.9rem;font-weight:600;transition:opacity .2s;background:var(--color-primary,#111);color:#fff;opacity:.5;";
  });
}

function closeCaptchaModal() {
  const overlay = document.getElementById("dm-captcha-modal");
  overlay.style.display = "none";
  if (typeof hcaptcha !== "undefined" && _hcaptchaWidgetId !== null) {
    try {
      hcaptcha.reset(_hcaptchaWidgetId);
    } catch (_) {}
  }
}

function collectBookingData() {
  const pickupLocation =
    document.getElementById("pickupLocationForm")?.textContent?.trim() || "—";
  const dropoffLocation =
    document.getElementById("dropOffLocationForm")?.textContent?.trim() || "—";
  const pickupDate =
    document.getElementById("pickupDateForm")?.textContent?.trim() || "—";
  const dropoffDate =
    document.getElementById("dropOffDateForm")?.textContent?.trim() || "—";
  const pickupTime =
    document.getElementById("pickupTimeForm")?.textContent?.trim() || "—";
  const dropoffTime =
    document.getElementById("dropOffTimeForm")?.textContent?.trim() || "—";
  const days = document.querySelector(".dayNum")?.textContent?.trim() || "1";

  const carName =
    document.getElementById("carName")?.textContent?.trim() || "—";
  const carTransmission =
    document.getElementById("carTransmission")?.textContent?.trim() || "—";
  const carSeats =
    document.getElementById("carSeats")?.textContent?.trim() || "—";
  const carLuggage =
    document.getElementById("carLuggage")?.textContent?.trim() || "—";
  const carPricePerDay =
    document.getElementById("carPricePerDay")?.textContent?.trim() || "—";
  const carTotalPrice =
    document.getElementById("carFinalPrice")?.textContent?.trim() || "—";

  const depositEl = document.querySelector(".deposit-amount");
  const depositAmount = depositEl?.textContent?.trim() || "No deposit";

  const currencySign =
    document.querySelector(".currency-sign")?.textContent?.trim() || "€";
  const currencySelect =
    document.getElementById("currencySelect")?.value || "EUR";

  const addonRows = [];
  document.querySelectorAll(".addonCheck").forEach((check) => {
    if (check.checked) {
      const name = check.getAttribute("data-name") || "Addon";
      const price = parseFloat(check.dataset.price) || 0;
      const total = (price * parseFloat(days)).toFixed(2);
      addonRows.push(
        `• ${name}: ${currencySign}${price}/day × ${days} days = ${currencySign}${total}`,
      );
    }
  });
  const addonsList =
    addonRows.length > 0 ? addonRows.join("\n") : "None selected";

  const borderRows = [];
  document.querySelectorAll(".countryCheck").forEach((check) => {
    if (check.checked) {
      const name = check.getAttribute("data-name") || "Country";
      const fee = parseFloat(check.dataset.price) || 0;
      borderRows.push(`• ${name}: ${currencySign}${fee}`);
    }
  });
  const crossBorderList =
    borderRows.length > 0 ? borderRows.join("\n") : "No cross-border travel";

  const totalPrice =
    document.getElementById("finalAmount")?.textContent?.trim() || "—";

  const fullName = document.getElementById("fullName")?.value?.trim() || "—";
  const email = document.getElementById("email")?.value?.trim() || "—";
  const phone = document.getElementById("phone")?.value?.trim() || "—";
  const driverName =
    document.getElementById("driverName")?.value?.trim() || "—";
  const driverAge = document.getElementById("driverAge")?.value?.trim() || "—";
  const driverLicenseExpiry =
    document.getElementById("driverLicense")?.value?.trim() || "—";
  const specialRequests =
    document.getElementById("requests")?.value?.trim() || "None";
  const carPhoto = document.getElementById("mainImg")?.src?.trim() || "";

  const now = new Date();
  const submissionDate = now.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
  const submissionTime = now.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  const rand = String(Math.floor(1000 + Math.random() * 9000));
  const orderNumber = `DM-${y}${m}${d}-${rand}`;

  return {
    order_number: orderNumber,
    car_name: carName,
    car_photo: carPhoto,
    car_transmission: carTransmission,
    car_seats: carSeats,
    car_luggage: carLuggage,
    car_price_per_day: `${currencySign}${carPricePerDay}`,
    car_total_price: `${currencySign}${carTotalPrice}`,
    deposit_amount:
      depositAmount === "No deposit"
        ? "No deposit required"
        : `${currencySign}${depositAmount}`,
    days,
    pickup_location: pickupLocation,
    dropoff_location: dropoffLocation,
    pickup_date: pickupDate,
    dropoff_date: dropoffDate,
    pickup_time: pickupTime,
    dropoff_time: dropoffTime,
    addons_list: addonsList,
    cross_border_list: crossBorderList,
    total_price: `${currencySign}${totalPrice}`,
    currency: currencySelect,
    full_name: fullName,
    email,
    phone,
    driver_name: driverName,
    driver_age: driverAge,
    driver_license_expiry: driverLicenseExpiry,
    special_requests: specialRequests,
    submission_date: submissionDate,
    submission_time: submissionTime,
    to_owner_email: OWNER_EMAIL,
  };
}
async function sendInquiry(captchaToken) {
  Swal.fire({
    title: "Sending Inquiry…",
    text: "Please wait while we process your request.",
    icon: "info",
    allowOutsideClick: false,
    allowEscapeKey: false,
    showConfirmButton: false,
    didOpen: () => Swal.showLoading(),
  });

  try {
    const data = collectBookingData();
    data.captcha_token = captchaToken;

    // Send to owner
    const ownerPayload = {
      ...data,
      to_email: OWNER_EMAIL,
      email: OWNER_EMAIL,
      from_name: data.full_name,
      from_email: data.email,
      to_name: "DuaMakina Team",
      reply_to: data.email,
    };
    await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_OWNER_TEMPLATE,
      ownerPayload,
    );

    // Send to user
    const userPayload = {
      ...data,
      to_email: data.email,
      email: data.email,
      user_email: data.email,
      user_name: data.full_name,
      to_name: data.full_name,
      from_name: "DuaMakina",
      from_email: OWNER_EMAIL,
      reply_to: OWNER_EMAIL,
    };
    await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_USER_TEMPLATE, userPayload);

    // // Subscribe to weekly marketing
    // if (BREVO_API_KEY && BREVO_LIST_ID) {
    //   subscribeToMarketing(data.email, data.full_name).catch(() => {});
    // }

    localStorage.setItem(COOLDOWN_KEY, Date.now().toString());

    Swal.fire({
      title: "Inquiry Sent Successfully! 🎉",
      html: `
        <p style="margin-bottom:8px;">
          Thank you, <strong>${data.full_name}</strong>! Your rental inquiry has been received.
        </p>
        <p style="font-size:.9rem;color:#666;">
          Your order number is <strong>${data.order_number}</strong>.<br><br>
          Please allow up to <strong>48 hours</strong> for our team to review availability
          and confirm your booking. A confirmation email has been sent to
          <strong>${data.email}</strong>.
        </p>
      `,
      icon: "success",
      confirmButtonText: "Done",
      confirmButtonColor: "var(--color-primary)",
    });
  } catch (err) {
    console.error("[DuaMakina] Email send error:", err);

    Swal.fire({
      title: "Something Went Wrong",
      text: "We couldn't send your inquiry. Please try again later or contact us directly.",
      icon: "error",
      confirmButtonText: "OK",
      confirmButtonColor: "var(--color-primary)",
    });
  }
}

// async function subscribeToMarketing(email, fullName) {
//   const [firstName, ...rest] = fullName.split(" ");
//   const lastName = rest.join(" ") || "";

//   await fetch("https://api.brevo.com/v3/contacts", {
//     method: "POST",
//     headers: {
//       accept: "application/json",
//       "content-type": "application/json",
//       "api-key": BREVO_API_KEY,
//     },
//     body: JSON.stringify({
//       email,
//       attributes: { FIRSTNAME: firstName, LASTNAME: lastName },
//       listIds: [BREVO_LIST_ID],
//       updateEnabled: true,
//     }),
//   });
// }
