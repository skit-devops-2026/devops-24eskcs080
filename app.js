// Slideshow controller
document.querySelectorAll('.slideshow, .image-slider').forEach((slider) => {
  const slides = [...slider.querySelectorAll('.slide, .gallery-image')];
  const controls = [...slider.querySelectorAll('[data-slide]')];
  let activeSlide = 0;
  let timer;

  function showSlide(index) {
    activeSlide = (index + slides.length) % slides.length;
    slides.forEach((slide, slideIndex) => slide.classList.toggle('is-active', slideIndex === activeSlide));
    controls.forEach((control, controlIndex) => {
      const isCurrent = controlIndex === activeSlide;
      control.classList.toggle('is-active', isCurrent);
      control.setAttribute('aria-selected', isCurrent);
    });
  }

  function startAutoPlay() {
    clearInterval(timer);
    timer = setInterval(() => showSlide(activeSlide + 1), 6000);
  }

  controls.forEach((control) => control.addEventListener('click', () => {
    showSlide(Number(control.dataset.slide));
    startAutoPlay();
  }));

  slider.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowRight') { showSlide(activeSlide + 1); startAutoPlay(); }
    if (event.key === 'ArrowLeft') { showSlide(activeSlide - 1); startAutoPlay(); }
  });

  slider.addEventListener('mouseenter', () => clearInterval(timer));
  slider.addEventListener('mouseleave', startAutoPlay);
  showSlide(0);
  startAutoPlay();
});

// Form feedback
document.querySelectorAll('[data-demo-form]').forEach((form) => {
  const dateOfBirth = form.querySelector('input[name="dob"]');
  const phoneNumber = form.querySelector('input[name="phone"]');

  if (dateOfBirth) {
    const today = new Date();
    today.setDate(today.getDate() - 1);
    dateOfBirth.max = today.toISOString().split('T')[0];
  }

  if (phoneNumber) {
    phoneNumber.addEventListener('input', () => {
      phoneNumber.value = phoneNumber.value.replace(/[^0-9]/g, '');
      phoneNumber.setCustomValidity(phoneNumber.validity.patternMismatch ? 'Enter 7 to 15 digits.' : '');
    });
  }

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const message = form.querySelector('.form-message');

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    message.textContent = form.classList.contains('contact-form')
      ? 'Thanks — your message is ready to send once the contact backend is connected.'
      : 'Form saved for now — connect this to your backend to create the account.';

    const professionInput = form.querySelector('input[name="profession"]:checked');
    if (professionInput) {
      try { localStorage.setItem('spendly_profession', professionInput.value); }
      catch (error) { /* storage unavailable, ignore */ }
    }

    const redirectTo = form.dataset.redirect;
    if (redirectTo) {
      message.textContent += ' Taking you to add your expenses…';
      setTimeout(() => { window.location.href = redirectTo; }, 1100);
    }
  });
});

// Google sign-in placeholder
document.querySelectorAll('[data-google-button]').forEach((button) => {
  button.addEventListener('click', () => {
    const message = document.querySelector('.form-message');
    message.textContent = 'Google Sign-In will be connected when the backend is added.';
  });
});
// Profiles and categories
const SPENDLY_PERSONAS = {
  student: {
    label: 'Student',
    icon: '🎓',
    tagline: 'Learning & growing',
    categories: [
      { id: 'tuition', label: 'University / college fees', icon: '🎓' },
      { id: 'transport', label: 'Transportation fee', icon: '🚌' },
      { id: 'hostel', label: 'Hostel charges', icon: '🏨' },
      { id: 'academic', label: 'Extra academic expenditure', icon: '📚' },
      { id: 'personal', label: 'Personal expenditure', icon: '🧾' },
    ],
  },
  salaried: {
    label: 'Salaried employee',
    icon: '💼',
    tagline: 'Working professional',
    categories: [
      { id: 'housing', label: 'Housing (rent, etc.)', icon: '🏠' },
      { id: 'taxes', label: 'Taxes', icon: '🧾' },
      { id: 'debt', label: 'Debt & loan repayments', icon: '💳' },
      { id: 'household', label: 'Household (groceries & food)', icon: '🛒' },
      { id: 'maintenance', label: 'Home maintenance', icon: '🔧' },
      { id: 'vehicle', label: 'Vehicle & equipment', icon: '🚗' },
      { id: 'utilities', label: 'Utilities & bills', icon: '💡' },
      { id: 'healthcare', label: 'Healthcare', icon: '🩺' },
      { id: 'commute', label: 'Transportation', icon: '🚌' },
      { id: 'family', label: 'Personal & family', icon: '👨‍👩‍👧' },
      { id: 'occasional', label: 'Occasional expenses', icon: '🎉' },
    ],
  },
  business: {
    label: 'Business person',
    icon: '🚀',
    tagline: 'Building something',
    categories: [
      { id: 'homekeeping', label: 'Home keeping & maintenance', icon: '🏠' },
      { id: 'security', label: 'Security services', icon: '🔒' },
      { id: 'taxes', label: 'Taxes', icon: '🧾' },
      { id: 'travel', label: 'Travel & holidays', icon: '✈️' },
      { id: 'healthcare', label: 'Healthcare & medical', icon: '🩺' },
      { id: 'occasions', label: 'Occasions & events', icon: '🎉' },
      { id: 'family', label: 'Family support', icon: '👨‍👩‍👧' },
      { id: 'lifestyle', label: 'Personal & lifestyle', icon: '✦' },
      { id: 'community', label: 'Social & community expenditure', icon: '🤝' },
    ],
  },
  retired: {
    label: 'Retired',
    icon: '🌿',
    tagline: 'Enjoying the next chapter',
    categories: [
      { id: 'homekeeping', label: 'Home keeping', icon: '🏠' },
      { id: 'maintenance', label: 'Home maintenance & security', icon: '🔒' },
      { id: 'taxes', label: 'Taxes', icon: '🧾' },
      { id: 'healthcare', label: 'Healthcare & medical', icon: '🩺' },
      { id: 'travel', label: 'Travel & holidays', icon: '✈️' },
      { id: 'occasions', label: 'Occasions & events', icon: '🎉' },
      { id: 'family', label: 'Family support', icon: '👨‍👩‍👧' },
      { id: 'lifestyle', label: 'Personal & lifestyle', icon: '✦' },
    ],
  },
};

(function () {
  const step2 = document.getElementById('expenseStep2');
  const fieldsContainer = document.getElementById('categoryFields');
  const personaBar = document.getElementById('personaBar');
  const totalDisplay = document.getElementById('expenseTotal');
  const form = document.getElementById('expenseForm');
  const breakdown = document.getElementById('breakdown');
  const breakdownList = document.getElementById('breakdownList');
  const formMessage = form ? form.querySelector('.form-message') : null;

  if (!form) return;

  const money = (value) => '₹' + value.toLocaleString('en-IN', { maximumFractionDigits: 0 });

  function renderCategoryFields(personaKey) {
    const persona = SPENDLY_PERSONAS[personaKey];
    fieldsContainer.innerHTML = '';

    persona.categories.forEach((category) => {
      const field = document.createElement('div');
      field.className = 'category-field';
      field.innerHTML = `
        <label for="cat-${category.id}"><span>${category.icon}</span> ${category.label}</label>
        <div class="amount-input"><span>₹</span><input type="number" id="cat-${category.id}" name="${category.id}" min="0" step="1" placeholder="0" inputmode="numeric"></div>`;
      fieldsContainer.appendChild(field);
    });

    personaBar.innerHTML = `<p>Showing categories for <strong>${persona.icon} ${persona.label}</strong></p><button type="button" id="changePersona">Change profile</button>`;
    document.getElementById('changePersona').addEventListener('click', () => {
      step2.style.display = 'none';
      breakdown.classList.remove('is-visible');
      document.querySelectorAll('input[name="persona"]').forEach((input) => { input.checked = false; });
    });

    step2.style.display = 'block';
    updateTotal();
  }

  function updateTotal() {
    const inputs = [...fieldsContainer.querySelectorAll('input[type="number"]')];
    const total = inputs.reduce((sum, input) => sum + (parseFloat(input.value) || 0), 0);
    totalDisplay.textContent = money(total);
    return total;
  }

  document.querySelectorAll('input[name="persona"]').forEach((input) => {
    input.addEventListener('change', () => renderCategoryFields(input.value));
  });

  fieldsContainer.addEventListener('input', updateTotal);

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const checked = document.querySelector('input[name="persona"]:checked');
    if (!checked) {
      formMessage.textContent = 'Pick a profile above to get started.';
      return;
    }

    const persona = SPENDLY_PERSONAS[checked.value];
    const inputs = [...fieldsContainer.querySelectorAll('input[type="number"]')];
    const values = {};
    let total = 0;
    inputs.forEach((input) => {
      const amount = parseFloat(input.value) || 0;
      values[input.name] = amount;
      total += amount;
    });

    if (total === 0) {
      formMessage.textContent = 'Add at least one amount before saving.';
      return;
    }

    try {
      localStorage.setItem('spendly_expenses', JSON.stringify({ persona: checked.value, values, total, savedAt: Date.now() }));
    } catch (error) { /* storage unavailable, ignore */ }

    formMessage.textContent = 'Saved for now — connect this to your backend to store it for good.';

    breakdownList.innerHTML = '';
    persona.categories.forEach((category) => {
      const amount = values[category.id] || 0;
      if (amount <= 0) return;
      const pct = total ? Math.round((amount / total) * 100) : 0;
      const row = document.createElement('div');
      row.className = 'breakdown-row';
      row.innerHTML = `<span>${category.icon} ${category.label}</span><span>${money(amount)}</span><div class="breakdown-track"><i style="width:${pct}%"></i></div>`;
      breakdownList.appendChild(row);
    });
    breakdown.classList.add('is-visible');
  });

  let savedPersona = null;
  try { savedPersona = localStorage.getItem('spendly_profession'); } catch (error) { /* ignore */ }
  if (savedPersona && SPENDLY_PERSONAS[savedPersona]) {
    const radio = document.querySelector(`input[name="persona"][value="${savedPersona}"]`);
    if (radio) { radio.checked = true; renderCategoryFields(savedPersona); }
  }
})();
//this comment is for completion of the code block