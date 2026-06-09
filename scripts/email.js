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

// ---------------------------------------------------------------------------
// Phone number formatting & validation
// ---------------------------------------------------------------------------

/**
 * Each entry maps a dial prefix (longest match wins) to:
 *   name        – country name (shown in the hint)
 *   pattern     – regex the *digits-only* local part must satisfy
 *   format      – function(digits) → formatted string (including the + prefix)
 *   localDigits – expected digit count AFTER the country code
 */
const PHONE_PREFIXES = [
  // Albania
  { prefix: "355",  name: "Albania",        localDigits: 9,  pattern: /^6[789]\d{7}$|^\d{8,9}$/,
    format: (cc, d) => `+${cc} ${d.slice(0,2)} ${d.slice(2,5)} ${d.slice(5,7)} ${d.slice(7,9)}`.trimEnd() },

  // Kosovo
  { prefix: "383",  name: "Kosovo",         localDigits: 8,  pattern: /^4[45]\d{6}$|^\d{7,8}$/,
    format: (cc, d) => `+${cc} ${d.slice(0,2)} ${d.slice(2,5)} ${d.slice(5)}`.trimEnd() },

  // North Macedonia
  { prefix: "389",  name: "N. Macedonia",   localDigits: 8,  pattern: /^7[0-9]\d{6}$|^\d{7,8}$/,
    format: (cc, d) => `+${cc} ${d.slice(0,2)} ${d.slice(2,5)} ${d.slice(5)}`.trimEnd() },

  // Serbia
  { prefix: "381",  name: "Serbia",         localDigits: 9,  pattern: /^6[0-9]\d{7}$|^\d{8,9}$/,
    format: (cc, d) => `+${cc} ${d.slice(0,2)} ${d.slice(2,5)} ${d.slice(5,7)} ${d.slice(7,9)}`.trimEnd() },

  // Montenegro
  { prefix: "382",  name: "Montenegro",     localDigits: 8,  pattern: /^6[0-9]\d{6}$|^\d{7,8}$/,
    format: (cc, d) => `+${cc} ${d.slice(0,2)} ${d.slice(2,5)} ${d.slice(5)}`.trimEnd() },

  // Bosnia
  { prefix: "387",  name: "Bosnia",         localDigits: 8,  pattern: /^6[0-9]\d{6}$|^\d{7,8}$/,
    format: (cc, d) => `+${cc} ${d.slice(0,2)} ${d.slice(2,5)} ${d.slice(5)}`.trimEnd() },

  // Croatia
  { prefix: "385",  name: "Croatia",        localDigits: 8,  pattern: /^9[1-9]\d{6,7}$|^\d{7,9}$/,
    format: (cc, d) => `+${cc} ${d.slice(0,2)} ${d.slice(2,5)} ${d.slice(5)}`.trimEnd() },

  // Greece
  { prefix: "30",   name: "Greece",         localDigits: 10, pattern: /^[26]\d{9}$/,
    format: (cc, d) => `+${cc} ${d.slice(0,3)} ${d.slice(3,6)} ${d.slice(6,8)} ${d.slice(8,10)}`.trimEnd() },

  // Italy
  { prefix: "39",   name: "Italy",          localDigits: 10, pattern: /^3\d{9}$|^0\d{9}$/,
    format: (cc, d) => `+${cc} ${d.slice(0,3)} ${d.slice(3,6)} ${d.slice(6,8)} ${d.slice(8,10)}`.trimEnd() },

  // Germany
  { prefix: "49",   name: "Germany",        localDigits: 10, pattern: /^\d{10,11}$/,
    format: (cc, d) => `+${cc} ${d.slice(0,3)} ${d.slice(3,6)} ${d.slice(6,8)} ${d.slice(8)}`.trimEnd() },

  // France
  { prefix: "33",   name: "France",         localDigits: 9,  pattern: /^[67]\d{8}$|^0[1-9]\d{8}$/,
    format: (cc, d) => `+${cc} ${d.slice(0,1)} ${d.slice(1,3)} ${d.slice(3,5)} ${d.slice(5,7)} ${d.slice(7,9)}`.trimEnd() },

  // Spain
  { prefix: "34",   name: "Spain",          localDigits: 9,  pattern: /^[67]\d{8}$|^9\d{8}$/,
    format: (cc, d) => `+${cc} ${d.slice(0,3)} ${d.slice(3,5)} ${d.slice(5,7)} ${d.slice(7,9)}`.trimEnd() },

  // UK
  { prefix: "44",   name: "UK",             localDigits: 10, pattern: /^7\d{9}$|^[12]\d{9}$/,
    format: (cc, d) => `+${cc} ${d.slice(0,4)} ${d.slice(4,7)} ${d.slice(7,10)}`.trimEnd() },

  // Turkey
  { prefix: "90",   name: "Turkey",         localDigits: 10, pattern: /^5\d{9}$|^[23]\d{9}$/,
    format: (cc, d) => `+${cc} ${d.slice(0,3)} ${d.slice(3,6)} ${d.slice(6,8)} ${d.slice(8,10)}`.trimEnd() },

  // USA / Canada
  { prefix: "1",    name: "US/Canada",      localDigits: 10, pattern: /^[2-9]\d{2}[2-9]\d{6}$/,
    format: (cc, d) => `+${cc} (${d.slice(0,3)}) ${d.slice(3,6)}-${d.slice(6,10)}`.trimEnd() },

  // Switzerland
  { prefix: "41",   name: "Switzerland",    localDigits: 9,  pattern: /^[67]\d{8}$/,
    format: (cc, d) => `+${cc} ${d.slice(0,2)} ${d.slice(2,5)} ${d.slice(5,7)} ${d.slice(7,9)}`.trimEnd() },

  // Austria
  { prefix: "43",   name: "Austria",        localDigits: 10, pattern: /^6[567]\d{8}$|^\d{9,11}$/,
    format: (cc, d) => `+${cc} ${d.slice(0,3)} ${d.slice(3,6)} ${d.slice(6,8)} ${d.slice(8)}`.trimEnd() },

  // Netherlands
  { prefix: "31",   name: "Netherlands",    localDigits: 9,  pattern: /^6\d{8}$|^[1-9]\d{8}$/,
    format: (cc, d) => `+${cc} ${d.slice(0,1)} ${d.slice(1,4)} ${d.slice(4,6)} ${d.slice(6,9)}`.trimEnd() },

  // Belgium
  { prefix: "32",   name: "Belgium",        localDigits: 9,  pattern: /^4[789]\d{7}$|^\d{8,9}$/,
    format: (cc, d) => `+${cc} ${d.slice(0,3)} ${d.slice(3,5)} ${d.slice(5,7)} ${d.slice(7,9)}`.trimEnd() },

  // Sweden
  { prefix: "46",   name: "Sweden",         localDigits: 9,  pattern: /^7[02369]\d{7}$/,
    format: (cc, d) => `+${cc} ${d.slice(0,2)} ${d.slice(2,5)} ${d.slice(5,7)} ${d.slice(7,9)}`.trimEnd() },

  // Norway
  { prefix: "47",   name: "Norway",         localDigits: 8,  pattern: /^[49]\d{7}$/,
    format: (cc, d) => `+${cc} ${d.slice(0,2)} ${d.slice(2,4)} ${d.slice(4,6)} ${d.slice(6,8)}`.trimEnd() },

  // Denmark
  { prefix: "45",   name: "Denmark",        localDigits: 8,  pattern: /^\d{8}$/,
    format: (cc, d) => `+${cc} ${d.slice(0,2)} ${d.slice(2,4)} ${d.slice(4,6)} ${d.slice(6,8)}`.trimEnd() },

  // Poland
  { prefix: "48",   name: "Poland",         localDigits: 9,  pattern: /^[5-9]\d{8}$/,
    format: (cc, d) => `+${cc} ${d.slice(0,3)} ${d.slice(3,6)} ${d.slice(6,9)}`.trimEnd() },

  // Romania
  { prefix: "40",   name: "Romania",        localDigits: 9,  pattern: /^7\d{8}$|^\d{9}$/,
    format: (cc, d) => `+${cc} ${d.slice(0,3)} ${d.slice(3,6)} ${d.slice(6,9)}`.trimEnd() },

  // Bulgaria
  { prefix: "359",  name: "Bulgaria",       localDigits: 9,  pattern: /^8[789]\d{7}$|^\d{8,9}$/,
    format: (cc, d) => `+${cc} ${d.slice(0,2)} ${d.slice(2,5)} ${d.slice(5,7)} ${d.slice(7,9)}`.trimEnd() },

  // UAE
  { prefix: "971",  name: "UAE",            localDigits: 9,  pattern: /^5[0-9]\d{7}$|^[234]\d{7,8}$/,
    format: (cc, d) => `+${cc} ${d.slice(0,2)} ${d.slice(2,5)} ${d.slice(5,9)}`.trimEnd() },

  // Saudi Arabia
  { prefix: "966",  name: "Saudi Arabia",   localDigits: 9,  pattern: /^5\d{8}$|^[23]\d{8}$/,
    format: (cc, d) => `+${cc} ${d.slice(0,2)} ${d.slice(2,5)} ${d.slice(5,9)}`.trimEnd() },

  // Australia
  { prefix: "61",   name: "Australia",      localDigits: 9,  pattern: /^4\d{8}$|^[2-9]\d{8}$/,
    format: (cc, d) => `+${cc} ${d.slice(0,3)} ${d.slice(3,6)} ${d.slice(6,9)}`.trimEnd() },

  // China
  { prefix: "86",   name: "China",          localDigits: 11, pattern: /^1[3-9]\d{9}$/,
    format: (cc, d) => `+${cc} ${d.slice(0,3)} ${d.slice(3,7)} ${d.slice(7,11)}`.trimEnd() },

  // India
  { prefix: "91",   name: "India",          localDigits: 10, pattern: /^[6-9]\d{9}$/,
    format: (cc, d) => `+${cc} ${d.slice(0,5)} ${d.slice(5,10)}`.trimEnd() },
];

// Sort so longest prefix is tried first (avoids "1" matching before "39" etc.)
PHONE_PREFIXES.sort((a, b) => b.prefix.length - a.prefix.length);

/**
 * Given a raw phone string, strip everything except digits.
 * If the result starts with a known prefix, return { entry, localDigits }.
 */
function matchPhonePrefix(raw) {
  const digits = raw.replace(/\D/g, "");
  for (const entry of PHONE_PREFIXES) {
    if (digits.startsWith(entry.prefix)) {
      const local = digits.slice(entry.prefix.length);
      return { entry, local, digits };
    }
  }
  return null;
}

/**
 * Format a raw phone string in real-time (called on every keystroke).
 * Returns the formatted string, or the raw input if no prefix is matched yet.
 */
function formatPhoneNumber(raw) {
  // Strip everything except digits and leading +
  const cleaned = raw.replace(/[^\d+]/g, "");
  // Remove leading + for digit matching
  const digitsOnly = cleaned.replace(/^\+/, "");

  const match = matchPhonePrefix(digitsOnly);
  if (!match) return raw; // Unknown prefix — don't reformat yet

  const { entry, local } = match;
  // Only format once we have enough digits to do something useful
  if (local.length < 2) return raw;

  return entry.format(entry.prefix, local);
}

/**
 * Validate a fully-entered phone number.
 * Returns { valid: bool, message: string }
 */
function validatePhoneNumber(raw) {
  const digitsOnly = raw.replace(/\D/g, "");

  if (!digitsOnly) return { valid: false, message: "Phone number is required" };
  if (digitsOnly.length < 7) return { valid: false, message: "Phone number is too short" };

  const match = matchPhonePrefix(digitsOnly);
  if (!match) {
    return {
      valid: false,
      message: "Unknown country code — start with + and your country code (e.g. +355 for Albania)",
    };
  }

  const { entry, local } = match;
  const tooShort = local.length < entry.localDigits - 1;
  const tooLong  = local.length > entry.localDigits + 1;

  if (tooShort) return { valid: false, message: `${entry.name} numbers need ${entry.localDigits} digits after +${entry.prefix}` };
  if (tooLong)  return { valid: false, message: `${entry.name} numbers should have ${entry.localDigits} digits after +${entry.prefix}` };

  if (!entry.pattern.test(local)) {
    return { valid: false, message: `This doesn't look like a valid ${entry.name} number` };
  }

  return { valid: true, message: `✓ ${entry.name} number` };
}

/**
 * Show a small inline country hint below the phone field (green when valid).
 */
function updatePhoneHint(el, message, isValid) {
  let hint = el.parentElement.querySelector(".dm-phone-hint");
  if (!hint) {
    hint = document.createElement("span");
    hint.className = "dm-phone-hint";
    hint.style.cssText =
      "display:block;font-size:0.78rem;margin-top:3px;padding-left:0.75em;transition:color .2s;";
    el.insertAdjacentElement("afterend", hint);
  }
  hint.textContent = message;
  hint.style.color = isValid
    ? "var(--color-success, #2f855a)"
    : "var(--color-text-muted, #888)";
}

function removePhoneHint(el) {
  el.parentElement.querySelector(".dm-phone-hint")?.remove();
}

/**
 * Wire up live formatting + hint on the phone input.
 * Call once during initEmailModule.
 */
function wirePhoneField() {
  const el = document.getElementById("phone");
  if (!el) return;

  // Show placeholder hint
  if (!el.placeholder || el.placeholder === "") {
    el.placeholder = "+355 69 123 4567";
  }

  el.addEventListener("input", () => {
    // Remember cursor position
    const cursorPos = el.selectionStart;
    const oldLen = el.value.length;

    const formatted = formatPhoneNumber(el.value);
    el.value = formatted;

    // Restore cursor roughly (accounts for added spaces/dashes)
    const newLen = el.value.length;
    const diff = newLen - oldLen;
    try { el.setSelectionRange(cursorPos + diff, cursorPos + diff); } catch (_) {}

    // Live hint
    const raw = el.value;
    const digitsOnly = raw.replace(/\D/g, "");
    const match = matchPhonePrefix(digitsOnly);
    if (match && digitsOnly.length > match.entry.prefix.length + 1) {
      const result = validatePhoneNumber(raw);
      updatePhoneHint(el, result.message, result.valid);
    } else if (match) {
      updatePhoneHint(el, `${match.entry.name} (+${match.entry.prefix})`, false);
    } else {
      removePhoneHint(el);
    }
  });

  // On blur — run full validation if there's a value
  el.addEventListener("blur", () => {
    if (!el.value.trim()) return;
    const result = validatePhoneNumber(el.value);
    if (!result.valid) {
      markFieldError(el, result.message);
      removePhoneHint(el);
    } else {
      clearFieldError(el);
      updatePhoneHint(el, result.message, true);
    }
  });
}

// ---------------------------------------------------------------------------

function injectValidationStyles() {
  if (document.getElementById("dm-validation-styles")) return;
  const style = document.createElement("style");
  style.id = "dm-validation-styles";
  style.textContent = `
    /* Red border on invalid field */
    .dm-field-error {
        border-color: var(--color-error, #e53e3e) !important;
        outline: 2px solid rgba(229,62,62,0.12) !important;
        background-color: rgba(229,62,62,0.03) !important;
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

  try {
    el.style.setProperty("border-color", "var(--color-error, #e53e3e)", "important");
    el.style.setProperty("outline", "2px solid rgba(229,62,62,0.12)", "important");
    el.style.setProperty("background-color", "rgba(229,62,62,0.03)", "important");
  } catch (_) {}

  // Remove any existing error message first
  const existing = el.parentElement.querySelector(".dm-error-msg");
  if (existing) existing.remove();

  // Insert error message after the input
  const msg = document.createElement("span");
  msg.className = "dm-error-msg";
  msg.textContent = message;
  try {
    msg.style.cssText = "display:block;color:var(--color-error,#e53e3e);font-size:0.78rem;margin-top:4px;padding-left:0.75em;z-index:999999;position:relative;";
  } catch (_) {}
  try {
    if (el.parentElement) {
      el.insertAdjacentElement("afterend", msg);
    } else {
      document.body.appendChild(msg);
    }
  } catch (err) {
    try {
      document.body.appendChild(msg);
    } catch (_) {}
  }

  // Auto-clear when user starts typing / changes value
  const clearOnInput = () => {
    clearFieldError(el);
    el.removeEventListener("input", clearOnInput);
    el.removeEventListener("change", clearOnInput);
  };
  el.addEventListener("input", clearOnInput);
  el.addEventListener("change", clearOnInput); // covers flatpickr / selects

  try {
    setTimeout(() => {
      try {
        el.style.setProperty("border-color", "var(--color-error, #e53e3e)", "important");
        el.style.setProperty("outline", "2px solid rgba(229,62,62,0.12)", "important");
        el.style.setProperty("background-color", "rgba(229,62,62,0.03)", "important");
      } catch (_) {}
    }, 60);
  } catch (_) {}
}

function clearFieldError(el) {
  el.classList.remove("dm-field-error");
  try {
    el.style.borderColor = "";
    el.style.outline = "";
    el.style.backgroundColor = "";
  } catch (_) {}

  const msg = el.parentElement?.querySelector(".dm-error-msg");
  if (msg) msg.remove();
}


function validateRequiredFields(options = {}) {
  const { showErrors = true } = options;
  let firstInvalid = null;
  const invalidLabels = [];
  const invalidIds = [];

  REQUIRED_FIELDS.forEach(({ id, label }) => {
    const el = document.getElementById(id);
    if (!el) return;

    clearFieldError(el);

    const value = el.value?.trim() || "";
    const isEmpty = value === "";

    const isEmailBad =
      id === "email" &&
      value !== "" &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

    const isAgeBad =
      id === "driverAge" &&
      value !== "" &&
      (isNaN(Number(value)) || Number(value) < 18 || Number(value) > 75);

    const phoneCheck =
      id === "phone" && value !== ""
        ? validatePhoneNumber(value)
        : null;
    const isPhoneBad = phoneCheck !== null && !phoneCheck.valid;

    if (isEmpty) {
      if (showErrors) markFieldError(el, "This field is required");
      invalidLabels.push(label);
      invalidIds.push(id);
      if (!firstInvalid) firstInvalid = el;
    } else if (isEmailBad) {
      if (showErrors) markFieldError(el, "Please enter a valid email address");
      invalidLabels.push(label + " (invalid format)");
      invalidIds.push(id);
      if (!firstInvalid) firstInvalid = el;
    } else if (isAgeBad) {
      if (showErrors) markFieldError(el, "Please enter a valid age (18 – 75)");
      invalidLabels.push(label + " (invalid age)");
      invalidIds.push(id);
      if (!firstInvalid) firstInvalid = el;
    } else if (isPhoneBad) {
      if (showErrors) {
        markFieldError(el, phoneCheck.message);
        removePhoneHint(el);
      }
      invalidLabels.push(label + " (invalid number)");
      invalidIds.push(id);
      if (!firstInvalid) firstInvalid = el;
    }
  });

  if (showErrors && firstInvalid) {
    firstInvalid.scrollIntoView({ behavior: "smooth", block: "center" });
    // Small timeout so scroll completes before focus
    setTimeout(() => firstInvalid.focus(), 350);
  }

  return { isValid: invalidLabels.length === 0, invalidLabels, invalidIds };
}

function updateSendButtonState() {
  const btn = document.getElementById("formSendBtn");
  if (!btn) return;
  const termsCheck = document.getElementById("termsCheck");
  const { isValid } = validateRequiredFields({ showErrors: false });
  const ready = isValid && !!termsCheck?.checked;
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

function initEmailModule() {
  try {
    emailjs.init(EMAILJS_PUBLIC_KEY);
  } catch (e) {
    // ignore if emailjs not available yet
  }
  injectValidationStyles();
  injectHcaptchaModal();
  wireFormSendBtn();
  wireRequiredFieldListeners();
  wirePhoneField();
  updateSendButtonState();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initEmailModule);
} else {
  initEmailModule();
}

function wireFormSendBtn() {
  const btn = document.getElementById("formSendBtn");
  if (!btn) return;

  btn.removeAttribute("onclick");
  btn.type = "button";
  btn.disabled = false; // ensure it's never hard-disabled

  const handler = async (e) => {
    e.preventDefault();

    const { isValid } = validateRequiredFields(); // marks red borders + error msgs
    if (!isValid) return; // inline errors are already visible — no Swal needed

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
  };

  btn.addEventListener("click", handler);
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
