const automaticPopular = document.getElementById('automaticFilterBox');
const milagePopular = document.getElementById('milageFilterBox');
const acPopular = document.getElementById('acFilterBox');
const doorsPopular = document.getElementById('doorsFilterBox');
const suvPopular = document.getElementById('suvFilterBox');
const pillsCon = document.getElementById('filterPillsCon');
const carTypePills = document.querySelectorAll('.type-pill')
let activeCarType = document.querySelector('.selected-type');

carTypePills.forEach(div => {
  div.addEventListener("click", () => {
    if (activeCarType) activeCarType.classList.remove('selected-type');
    activeCarType = div;
    div.classList.add('selected-type')
  })
})

const pillsConfig = [
  { checkbox: automaticPopular, label: 'Automatic' },
  { checkbox: milagePopular,    label: 'Unlimited Mileage' },
  { checkbox: acPopular,        label: 'AC' },
  { checkbox: doorsPopular,     label: '4+ Doors' },
  { checkbox: suvPopular,       label: 'SUV' },
];

pillsCon.addEventListener('click', (e) => {
  if (e.target.tagName === 'BUTTON') {
    const pill = e.target.closest('.filter-pill');
    const label = pill.dataset.label;

    // Uncheck the corresponding checkbox
    const match = pillsConfig.find(item => item.label === label);
    if (match) match.checkbox.checked = false;

    pill.remove();
  }
});

pillsConfig.forEach(({ checkbox, label }) => {
  checkbox.addEventListener('change', () => {
    if (checkbox.checked) {
      pillsCon.insertAdjacentHTML('beforeend', `
        <div class="filter-pill" data-label="${label}">
          <p>${label}</p>
          <button>X</button>
        </div>
      `);
    } else {
      // Remove pill when unchecked
      pillsCon.querySelector(`[data-label="${label}"]`)?.remove();
    }
  });
});