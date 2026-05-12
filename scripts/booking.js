function getCarIdFromUrl() {
  return new URLSearchParams(window.location.search).get('id');
}
 
function getTodayPrice(pricingRows) {
  if (!pricingRows || pricingRows.length === 0) return null;
  const today = new Date().toISOString().split('T')[0];
  const match = pricingRows.find(p => {
    const from = p.valid_from ?? '0000-01-01';
    const to   = p.valid_to   ?? '9999-12-31';
    return today >= from && today <= to;
  });
  return match ?? pricingRows[0];
}
 
function getPhotoUrl(storagePath) {
  if (!storagePath) return '/assets/images/placeholder-car.jpg';
  if (storagePath.startsWith('http')) return storagePath;
  return `${SUPABASE_URL}/storage/v1/object/public/${storagePath}`;
}
 
function capitalize(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}
 
function translateFuel(fuel) {
  const map = { gasoline: 'Gasoline', diesel: 'Diesel', electric: 'Electric', hybrid: 'Hybrid' };
  return map[fuel] ?? capitalize(fuel);
}
 
function translateTransmission(t) {
  const map = { automatic: 'Automatic', manual: 'Manual' };
  return map[t] ?? capitalize(t);
}

function translateInsurance(insurance) {
  const map = { basic: 'Basic', premium: 'Premium' };
  return map[insurance] ?? capitalize(insurance);
}
 
function translateCategory(c) {
  const map = {
    compact: 'Compact', suv: 'SUV', luxury: 'Luxury', van: 'Van',
    minivan: 'Minivan', sedan: 'Sedan', coupe: 'Coupe',
    convertible: 'Convertible', pickup: 'Pickup'
  };
  return map[c] ?? capitalize(c);
}
 
let galleryPhotos = [];
let currentIndex  = 0;
 
function setMainImage(index) {
  if (!galleryPhotos.length) return;
  currentIndex = (index + galleryPhotos.length) % galleryPhotos.length;
 
  const mainImg = document.getElementById('main-img');
  if (mainImg) {
    mainImg.src = getPhotoUrl(galleryPhotos[currentIndex].storage_path);
    mainImg.alt = galleryPhotos[currentIndex].alt_text ?? 'Car image';
  }
 
  document.querySelectorAll('#dot').forEach((dot, i) => {
    dot.classList.toggle('active', i === currentIndex);
  });
 
  document.querySelectorAll('.other-imgs').forEach((img, i) => {
    img.classList.toggle('active-thumb', i === currentIndex);
  });
}
 
function buildGallery(photos) {
  galleryPhotos = [...photos].sort((a, b) => {
    if (a.is_primary && !b.is_primary) return -1;
    if (!a.is_primary && b.is_primary) return 1;
    return (a.sort_order ?? 0) - (b.sort_order ?? 0);
  });
 
  const mainImg = document.getElementById('main-img');
  if (mainImg && galleryPhotos.length) {
    mainImg.style.opacity = '0.5';
    const firstUrl = getPhotoUrl(galleryPhotos[0].storage_path);
    const preload  = new Image();
    preload.onload = () => {
      mainImg.src           = firstUrl;
      mainImg.style.opacity = '1';
    };
    preload.src = firstUrl;
  }
 
  const thumbContainer = document.querySelector('.image-con-end');
  if (thumbContainer) {
    thumbContainer.innerHTML = galleryPhotos.map((photo, i) => `
      <img
        src="${getPhotoUrl(photo.storage_path)}"
        alt="${photo.alt_text ?? 'Car image'}"
        id="other-img"
        class="other-imgs${i === 0 ? ' active-thumb' : ''}"
        loading="${i === 0 ? 'eager' : 'lazy'}"
        draggable="false"
        data-index="${i}"
      >
    `).join('');
 
    thumbContainer.querySelectorAll('.other-imgs').forEach(img => {
      img.addEventListener('click', () => setMainImage(parseInt(img.dataset.index)));
    });
  }
 
  const dotsContainer = document.querySelector('.dots');
  if (dotsContainer) {
    dotsContainer.innerHTML = galleryPhotos.map((_, i) => `
      <div id="dot" class="${i === 0 ? 'active' : ''}" data-index="${i}"></div>
    `).join('');
    dotsContainer.querySelectorAll('#dot').forEach(dot => {
      dot.addEventListener('click', () => setMainImage(parseInt(dot.dataset.index)));
    });
  }
 
  document.getElementById('leftArrow')?.addEventListener('click',  () => setMainImage(currentIndex - 1));
  document.getElementById('rightArrow')?.addEventListener('click', () => setMainImage(currentIndex + 1));
 
  currentIndex = 0;
}
 
function populatePage(car) {
  const pricing = getTodayPrice(car.car_pricing);
  const pricePerDay = pricing ? parseFloat(pricing.price_per_day) : 0;
 
  const carName = document.getElementById('car-name');
  if (carName) carName.textContent = `${car.brand} ${car.model}`;
 
  const carType = document.getElementById('car-type');
  if (carType) carType.textContent = translateCategory(car.category);
 
  document.title = `${car.brand} ${car.model} — Dua Makina`;
 
  const specMap = {
    'gears':  translateTransmission(car.transmission),
    'insurance-booking': translateInsurance(car.insurance_type),
    'year':   car.year ? car.year.toString() : null,
    'license-plate': car.license_plate ?? '—',
    'person': `${car.seats} Seats`,
    'bag':    car.trunk_litres ? `${car.trunk_litres}L Trunk` : '— Trunk',
    'door':   `${car.doors} Doors`,
    'ac':     car.has_ac ? 'A/C' : null,
    'fuel':   translateFuel(car.fuel)
  };
 
  document.querySelectorAll('.spec-con').forEach(con => {
    const img = con.querySelector('img');
    const p   = con.querySelector('p');
    if (!img || !p) return;
 
    for (const [icon, value] of Object.entries(specMap)) {
      if (img.src.includes(`/${icon}.svg`)) {
        if (value === null) {
          con.style.display = 'none';
        } else {
          p.textContent = value;
        }
        break;
      }
    }
  });
 
  const mileagePolicy = document.getElementById('milage-policy');
  if (mileagePolicy) {
    const pImg = mileagePolicy.querySelector('img')?.outerHTML ?? '';
    if (car.mileage_unlimited) {
      mileagePolicy.innerHTML = `${pImg} Unlimited mileage`;
    } else {
      mileagePolicy.innerHTML = `${pImg} ${car.mileage_limit_km ?? '—'} km limit · €${parseFloat(car.extra_km_fee ?? 0).toFixed(2)}/km extra`;
    }
  }
 
  const crossBorderDetails = [...document.querySelectorAll('details')].find(d =>
    d.querySelector('summary')?.textContent.includes('ndërkufitare')
  );
  if (crossBorderDetails) {
    const p = crossBorderDetails.querySelector('p');
    if (p) {
      if (car.cross_border_allowed && car.car_cross_border_permissions?.length) {
        const countries = car.car_cross_border_permissions
          .map(cbp => cbp.cross_border_countries?.country_name)
          .filter(Boolean)
          .join(', ');
        p.textContent = `This vehicle is authorised for travel to: ${countries}.`;
      } else {
        p.textContent = 'This vehicle is not authorised for cross-border travel.';
      }
    }
  }
 
  const ferryDetails = [...document.querySelectorAll('details')].find(d =>
    d.querySelector('summary')?.textContent.includes('traget')
  );
  if (ferryDetails) {
    const p = ferryDetails.querySelector('p');
    if (p) {
      if (car.ferry_allowed) {
        const feeText = car.ferry_fee > 0 ? ` Ferry fee: €${parseFloat(car.ferry_fee).toFixed(2)}.` : '';
        p.textContent = `Ferry travel is permitted with prior notice.${feeText} Please inform us when making your reservation.`;
      } else {
        p.textContent = 'Ferry travel is not permitted for this vehicle.';
      }
    }
  }
 
  const depositDetails = [...document.querySelectorAll('details')].find(d =>
    d.querySelector('summary')?.textContent.includes('Depozita')
  );
  if (depositDetails && car.deposit_amount != null) {
    const depositSpan = depositDetails.querySelector('#depositAmount');
    if (depositSpan) {
      depositSpan.textContent = parseFloat(car.deposit_amount).toFixed(2);
    }
  }
 
  const pricePerDayEl = document.getElementById('pricePerDay');
  if (pricePerDayEl) pricePerDayEl.textContent = pricePerDay.toFixed(2);
 
  updateTotalPrice(pricePerDay);
 
  if (car.car_photos?.length) {
    buildGallery(car.car_photos);
  }
 
  const bookNow = document.getElementById('bookNow');
  if (bookNow) {
    const url = new URL(bookNow.href, window.location.origin);
    url.searchParams.set('id', car.id);
    bookNow.href = url.toString();
  }
}
 
let pricePerDayGlobal = 0;
 
function updateTotalPrice(pricePerDay) {
  pricePerDayGlobal = pricePerDay;
 
  const days = parseFloat(localStorage.getItem('daysCalc')) || 1;
 
  const dayNumEl = document.getElementById('dayNum');
  if (dayNumEl) dayNumEl.textContent = days;
 
  const total = (pricePerDay * days).toFixed(2);
  document.querySelectorAll('.total-price').forEach(el => {
    el.textContent = total;
  });
 
  return total;
}
 
window.finalPriceFunction = function() {
  return updateTotalPrice(pricePerDayGlobal);
};
 
async function loadCarDetails() {
  const carId = getCarIdFromUrl();
  if (!carId) return;
 
  const { data: car, error } = await supabaseClient
    .from('cars')
    .select(`
      id, brand, model, year, category, color, license_plate, 
      fuel, transmission, seats, doors, has_ac, trunk_litres,
      mileage_unlimited, mileage_limit_km, extra_km_fee,
      deposit_amount, ferry_allowed, cross_border_allowed, ferry_fee,
      insurance_type, insurance_notes,
      car_pricing ( price_per_day, valid_from, valid_to ),
      car_photos  ( storage_path, alt_text, is_primary, sort_order ),
      car_cross_border_permissions (
        cross_border_countries ( country_name, country_code, fee )
      )
    `)
    .eq('id', carId)
    .single();
 
  if (error || !car) return;
 
  populatePage(car);
}

async function handleShare() {
  const url = window.location.href;

  if (navigator.share) {
    await navigator.share({ title: document.title, url });
  } else if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(url);
    alert("Link copied!");
  } else {
    prompt("Copy this link:", url);
  }
}

document.getElementById("shareBtn").addEventListener("click", handleShare);

document.addEventListener('DOMContentLoaded', loadCarDetails);