import { cacheGet, cacheSet } from "/scripts/cache.js";
const overviewBtn = document.getElementById("overviewBtn");
const faqBtn = document.getElementById("faqBtn");
const carFaq = document.getElementById("carFaq");
const carOverview = document.getElementById("carOverview");
const carType = document.getElementById("carType");
const carFuel = document.getElementById("carFuel");
const carYear = document.getElementById("carYear");
const overviewTitle = document.getElementById("overviewTitle");
const overviewDesc = document.getElementById("overviewDesc");
const quality1 = document.getElementById("quality1");
const quality2 = document.getElementById("quality2");
const quality3 = document.getElementById("quality3");
const carName = document.getElementById("car-name");
const depositAmount = document.getElementById("depositAmount");
const depositSign = document.getElementById("depositSign");
const refundableTxt = document.getElementById("refundableTxt");
const SKELETON_IDS = [
  "car-name",
  "carType",
  "carYear",
  "carFuel",
  "pricePerDay",
  "main-img",
];

function showSkeletons() {
  SKELETON_IDS.forEach((id) => {
    document.getElementById(id)?.classList.add("skeleton");
  });
}

function hideSkeletons() {
  SKELETON_IDS.forEach((id) => {
    document.getElementById(id)?.classList.remove("skeleton");
  });
}

function getCarIdFromUrl() {
  return new URLSearchParams(window.location.search).get("id");
}

function getTodayPrice(pricingRows) {
  if (!pricingRows || pricingRows.length === 0) return null;
  const today = new Date().toISOString().split("T")[0];
  const match = pricingRows.find((p) => {
    const from = p.valid_from ?? "0000-01-01";
    const to = p.valid_to ?? "9999-12-31";
    return today >= from && today <= to;
  });
  return match ?? pricingRows[0];
}

function getPhotoUrl(storagePath) {
  if (!storagePath) return "/assets/images/placeholder-car.jpg";
  if (storagePath.startsWith("http")) return storagePath;
  return `${SUPABASE_URL}/storage/v1/object/public/${storagePath}`;
}

function capitalize(str) {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
}

const EN_FUEL = {
  gasoline: "Petrol",
  diesel: "Diesel",
  electric: "Electric",
  hybrid: "Hybrid",
  "plug-in hybrid": "Plug-in Hybrid",
  lpg: "LPG",
};

const EN_TRANSMISSION = {
  automatic: "Automatic",
  manual: "Manual",
};

const EN_INSURANCE = {
  basic: "Basic",
  premium: "Premium",
  full: "Premium",
  "third-party": "Basic",
  none: "No insurance",
};

const EN_CATEGORY = {
  economy: "Economy",
  compact: "Compact",
  sedan: "Sedan",
  suv: "SUV",
  luxury: "Luxury",
  van: "Van",
  minivan: "Minivan",
  coupe: "Coupe",
  convertible: "Convertible",
  pickup: "Pickup",
};

function translateFuel(fuel) {
  const code = (fuel || "").toLowerCase();
  return (
    window.DuaI18n?.tv?.("values.fuel", code) ??
    EN_FUEL[code] ??
    capitalize(fuel)
  );
}

function translateTransmission(t) {
  const code = (t || "").toLowerCase();
  return (
    window.DuaI18n?.tv?.("values.transmission", code) ??
    EN_TRANSMISSION[code] ??
    capitalize(t)
  );
}

function translateInsurance(insurance) {
  const code = (insurance || "").toLowerCase();
  return (
    window.DuaI18n?.tv?.("values.insurance", code) ??
    EN_INSURANCE[code] ??
    capitalize(insurance)
  );
}

function translateCategory(c) {
  const code = (c || "").toLowerCase();
  return (
    window.DuaI18n?.tv?.("values.category", code) ??
    EN_CATEGORY[code] ??
    capitalize(c)
  );
}

let galleryPhotos = [];

let currentIndex = 0;

function setMainImage(index) {
  if (!galleryPhotos.length) return;
  currentIndex = (index + galleryPhotos.length) % galleryPhotos.length;
  const mainImg = document.getElementById("main-img");
  if (mainImg) {
    mainImg.src = getPhotoUrl(galleryPhotos[currentIndex].storage_path);
    mainImg.alt = galleryPhotos[currentIndex].alt_text ?? "Car image";
  }
  document.querySelectorAll("#dot").forEach((dot, i) => {
    dot.classList.toggle("active", i === currentIndex);
  });
  document.querySelectorAll(".other-imgs").forEach((img, i) => {
    img.classList.toggle("active-thumb", i === currentIndex);
  });
}

function buildGallery(photos) {
  galleryPhotos = [...photos].sort((a, b) => {
    if (a.is_primary && !b.is_primary) return -1;
    if (!a.is_primary && b.is_primary) return 1;
    return (a.sort_order ?? 0) - (b.sort_order ?? 0);
  });
  const mainImg = document.getElementById("main-img");
  if (mainImg && galleryPhotos.length) {
    mainImg.style.opacity = "0.5";
    const firstUrl = getPhotoUrl(galleryPhotos[0].storage_path);
    const preload = new Image();
    preload.onload = () => {
      mainImg.src = firstUrl;
      mainImg.style.opacity = "1";
    };
    preload.src = firstUrl;
  }
  const thumbContainer = document.querySelector(".image-con-end");
  if (thumbContainer) {
    thumbContainer.innerHTML = galleryPhotos
      .map(
        (photo, i) =>
          `\n      <img\n        src="${getPhotoUrl(photo.storage_path)}"\n        alt="${photo.alt_text ?? "Car image"}"\n        id="other-img"\n        class="other-imgs${i === 0 ? " active-thumb" : ""}"\n        loading="${i === 0 ? "eager" : "lazy"}"\n        draggable="false"\n        data-index="${i}"\n      >\n    `,
      )
      .join("");
    thumbContainer.querySelectorAll(".other-imgs").forEach((img) => {
      img.addEventListener("click", () =>
        setMainImage(parseInt(img.dataset.index)),
      );
    });
  }
  const dotsContainer = document.querySelector(".dots");
  if (dotsContainer) {
    dotsContainer.innerHTML = galleryPhotos
      .map(
        (_, i) =>
          `\n      <div id="dot" class="${i === 0 ? "active" : ""}" data-index="${i}"></div>\n    `,
      )
      .join("");
    dotsContainer.querySelectorAll("#dot").forEach((dot) => {
      dot.addEventListener("click", () =>
        setMainImage(parseInt(dot.dataset.index)),
      );
    });
  }
  document
    .getElementById("leftArrow")
    ?.addEventListener("click", () => setMainImage(currentIndex - 1));
  document
    .getElementById("rightArrow")
    ?.addEventListener("click", () => setMainImage(currentIndex + 1));
  currentIndex = 0;
}

let currentCar = null;

function specLabels(car) {
  return {
    gears: translateTransmission(car.transmission),
    "insurance-booking": translateInsurance(car.insurance_type),
    year: car.year ? car.year.toString() : null,
    person:
      window.DuaI18n?.plural?.("seats", car.seats) ?? `${car.seats} Seats`,
    bag: car.trunk_litres
      ? (window.DuaI18n?.plural?.("bags", car.trunk_litres) ??
        `${car.trunk_litres} Bags`)
      : `— ${window.DuaI18n?.plural?.("bags", 2) ?? "Bags"}`,
    door: window.DuaI18n?.plural?.("doors", car.doors) ?? `${car.doors} Doors`,
    ac: car.has_ac ? "A/C" : null,
    fuel: translateFuel(car.fuel),
  };
}

function renderSpecGrid(car) {
  const specMap = specLabels(car);
  document.querySelectorAll(".spec-con").forEach((con) => {
    const img = con.querySelector("img");
    const p = con.querySelector("p");
    if (!img || !p) return;
    for (const [icon, value] of Object.entries(specMap)) {
      if (img.src.includes(`/${icon}.svg`)) {
        if (value === null) {
          con.style.display = "none";
        } else {
          con.style.display = "";
          p.textContent = value;
          if (!p.hasAttribute("data-i18n-original")) {
            p.setAttribute("data-i18n-original", value);
          }
        }
        break;
      }
    }
  });
}

function renderMileagePolicy(car) {
  const mileagePolicy = document.getElementById("milage-policy");
  if (!mileagePolicy) return;
  const pImg = mileagePolicy.querySelector("img")?.outerHTML ?? "";
  if (car.mileage_unlimited) {
    const label =
      window.DuaI18n?.t?.("car.faq.mileage.unlimited") ?? "Unlimited mileage";
    mileagePolicy.innerHTML = `${pImg} ${label}`;
  } else {
    const kmLimit = car.mileage_limit_km ?? "—";
    const fee = parseFloat(car.extra_km_fee ?? 0).toFixed(2);
    const label =
      window.DuaI18n?.t?.("car.faq.mileage.km_limit", {
        km: kmLimit,
        fee: fee,
      }) ?? `${kmLimit} km limit · €${fee}/km extra`;
    mileagePolicy.innerHTML = `${pImg} ${label}`;
  }
}

document.addEventListener("languageChanged", () => {
  if (!currentCar) return;
  if (carType) carType.textContent = translateCategory(currentCar.category);
  if (carFuel) carFuel.textContent = translateFuel(currentCar.fuel);
  renderSpecGrid(currentCar);
  renderMileagePolicy(currentCar);
  if (refundableTxt) {
    if (!currentCar.deposit_amount || currentCar.deposit_amount <= 0) {
      const fallback = "No deposit required";
      refundableTxt.setAttribute("data-i18n-original", fallback);
      refundableTxt.textContent =
        window.DuaI18n?.t?.("common.unit.no_deposit_required") ?? fallback;
    } else {
      const fallback = "(refundable upon return)";
      refundableTxt.setAttribute("data-i18n-original", fallback);
      refundableTxt.textContent =
        window.DuaI18n?.t?.("car.faq.deposit_payment.refundable") ?? fallback;
    }
  }
});

function populatePage(car) {
  currentCar = car;
  const pricing = getTodayPrice(car.car_pricing);
  const pricePerDay = pricing ? parseFloat(pricing.price_per_day) : 0;
  if (carName) carName.textContent = `${car.brand} ${car.model}`;
  if (carType) carType.textContent = translateCategory(car.category);
  document.title = `${car.brand} ${car.model} — Dua Makina`;
  if (carYear) carYear.textContent = `${car.year}`;
  if (carFuel) carFuel.textContent = translateFuel(car.fuel);
  if (car.deposit_amount > 0) {
    if (depositAmount) {
      const depositValue = parseFloat(car.deposit_amount);
      depositAmount.dataset.basePrice = depositValue;
      depositAmount.textContent = depositValue.toFixed(2);
    }
    if (refundableTxt) {
      const fallback = "(refundable upon return)";
      refundableTxt.setAttribute("data-i18n-original", fallback);
      refundableTxt.textContent =
        window.DuaI18n?.t?.("car.faq.deposit_payment.refundable") ?? fallback;
    }
  } else {
    if (depositAmount) depositAmount.style.display = "none";
    if (depositSign) depositSign.style.display = "none";
    if (refundableTxt) {
      const fallback = "No deposit required";
      refundableTxt.setAttribute("data-i18n-original", fallback);
      refundableTxt.textContent =
        window.DuaI18n?.t?.("common.unit.no_deposit_required") ?? fallback;
    }
  }
  renderSpecGrid(car);
  renderMileagePolicy(car);
  const pricePerDayEl = document.getElementById("pricePerDay");
  if (pricePerDayEl) pricePerDayEl.textContent = pricePerDay.toFixed(2);
  updateTotalPrice(pricePerDay);
  if (car.car_photos?.length) {
    buildGallery(car.car_photos);
  }
  const bookNow = document.getElementById("bookNow");
  if (bookNow) {
    const url = new URL(bookNow.href, window.location.origin);
    url.searchParams.set("id", car.id);
    bookNow.href = url.toString();
  }
  hideSkeletons();
  window.DuaI18n?.translatePage?.();
}

function populateExtraDetails(car) {
  const desc = car.car_descriptions?.[0];
  const noTitle =
    window.DuaI18n?.t?.("car.overview.no_title") ??
    "No title available at this time";
  const noDescription =
    window.DuaI18n?.t?.("car.overview.no_description") ??
    "No description available at this time. Please try again later.";
  const noQuality =
    window.DuaI18n?.t?.("car.overview.no_quality") ?? "No quality available";
  if (overviewTitle) overviewTitle.textContent = desc?.title ?? noTitle;
  if (overviewDesc) overviewDesc.textContent = desc?.short_desc ?? noDescription;
  if (quality1) quality1.textContent = desc?.quality_1 ?? noQuality;
  if (quality2) quality2.textContent = desc?.quality_2 ?? noQuality;
  if (quality3) quality3.textContent = desc?.quality_3 ?? noQuality;
  const crossBorderBody = document.getElementById("crossBorderBody");
  if (crossBorderBody) {
    if (car.cross_border_allowed && car.car_cross_border_permissions?.length) {
      const countries = car.car_cross_border_permissions
        .map((cbp) => cbp.cross_border_countries?.country_name)
        .filter(Boolean)
        .join(", ");
      crossBorderBody.textContent =
        window.DuaI18n?.t?.("car.faq.cross_border.body_countries", {
          countries: countries,
        }) ?? `This vehicle is authorised for travel to: ${countries}.`;
    } else {
      crossBorderBody.textContent =
        window.DuaI18n?.t?.("car.faq.cross_border.body_none") ??
        "This vehicle is not authorised for cross-border travel.";
    }
  }
  const ferryBody = document.getElementById("ferryBody");
  if (ferryBody) {
    if (car.ferry_allowed) {
      const feeText =
        car.ferry_fee > 0
          ? " " +
            (window.DuaI18n?.t?.("car.faq.ferry.fee_line", {
              fee: parseFloat(car.ferry_fee).toFixed(2),
            }) ?? `Ferry fee: €${parseFloat(car.ferry_fee).toFixed(2)}.`)
          : "";
      ferryBody.textContent =
        (window.DuaI18n?.t?.("car.faq.ferry.body_permitted") ??
          "Ferry travel is permitted with prior notice.") +
        feeText +
        " " +
        (window.DuaI18n?.t?.("car.faq.ferry.body_inform") ??
          "Please inform us when making your reservation.");
    } else {
      ferryBody.textContent =
        window.DuaI18n?.t?.("car.faq.ferry.body_not_permitted") ??
        "Ferry travel is not permitted for this vehicle.";
    }
  }
  window.DuaI18n?.translatePage?.();
}

let pricePerDayGlobal = 0;

function updateTotalPrice(pricePerDay) {
  pricePerDayGlobal = pricePerDay;
  const days = parseFloat(localStorage.getItem("daysCalc")) || 1;
  const dayNumEl = document.getElementById("dayNum");
  if (dayNumEl) dayNumEl.textContent = days;
  const total = (pricePerDay * days).toFixed(2);
  document.querySelectorAll(".total-price").forEach((el) => {
    el.textContent = total;
  });
  return total;
}

window.finalPriceFunction = function () {
  return updateTotalPrice(pricePerDayGlobal);
};

async function loadCarDetails() {
  const carId = getCarIdFromUrl();
  if (!carId) return;
  showSkeletons();
  const cached = cacheGet(`car_${carId}`);
  if (cached) {
    populatePage(cached);
    populateExtraDetails(cached);
    return;
  }
  const { data: car, error: error } = await supabaseClient
    .from("cars")
    .select(
      `\n      id, brand, model, year, category, color,\n      fuel, transmission, seats, doors, has_ac, trunk_litres,\n      mileage_unlimited, mileage_limit_km, extra_km_fee,\n      deposit_amount, ferry_allowed, cross_border_allowed, ferry_fee,\n      insurance_type, insurance_notes,\n      car_pricing ( price_per_day, valid_from, valid_to ),\n      car_photos  ( storage_path, alt_text, is_primary, sort_order )\n    `,
    )
    .eq("id", carId)
    .single();
  if (error || !car) {
    hideSkeletons();
    return;
  }
  populatePage(car);
  cacheSet(`car_${carId}`, car);
  const loadExtra = async () => {
    const { data: extra } = await supabaseClient
      .from("cars")
      .select(
        `\n        car_descriptions ( title, short_desc, quality_1, quality_2, quality_3 ),\n        car_cross_border_permissions (\n          cross_border_countries ( country_name, country_code, fee )\n        )\n      `,
      )
      .eq("id", carId)
      .single();
    if (extra) {
      const fullCar = {
        ...car,
        ...extra,
      };
      populateExtraDetails(fullCar);
      cacheSet(`car_${carId}`, fullCar);
    }
  };
  if ("requestIdleCallback" in window) {
    requestIdleCallback(loadExtra, {
      timeout: 2e3,
    });
  } else {
    setTimeout(loadExtra, 300);
  }
}

async function handleShare() {
  const url = window.location.href;
  if (navigator.share) {
    await navigator.share({
      title: document.title,
      url: url,
    });
  } else if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(url);
    alert("Link copied!");
  } else {
    prompt("Copy this link:", url);
  }
}

function changeInfo(carPage) {
  if (carPage === "overview") {
    overviewBtn.classList.add("selected-button");
    faqBtn.classList.remove("selected-button");
    carOverview.style.display = "flex";
    carFaq.style.display = "none";
  } else if (carPage === "faq") {
    overviewBtn.classList.remove("selected-button");
    faqBtn.classList.add("selected-button");
    carOverview.style.display = "none";
    carFaq.style.display = "flex";
  } else {
    overviewBtn.classList.add("selected-button");
    faqBtn.classList.remove("selected-button");
    carOverview.style.display = "block";
    carFaq.style.display = "none";
  }
}

overviewBtn?.addEventListener("click", () => changeInfo("overview"));

faqBtn?.addEventListener("click", () => changeInfo("faq"));

document.getElementById("shareBtn")?.addEventListener("click", handleShare);

loadCarDetails();
