/* ===== The 4 profiles and their expenditure categories =====
   Taken from the profile sketch: Student, Salaried employee, Business
   person, Retired. Edit these arrays any time to add/rename a category —
   the form and breakdown rebuild themselves from this data automatically. */
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

    /* No backend yet — save locally so the entry survives a refresh. */
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

  /* If they just picked a profile on the sign-up page, jump straight to it. */
  let savedPersona = null;
  try { savedPersona = localStorage.getItem('spendly_profession'); } catch (error) { /* ignore */ }
  if (savedPersona && SPENDLY_PERSONAS[savedPersona]) {
    const radio = document.querySelector(`input[name="persona"][value="${savedPersona}"]`);
    if (radio) { radio.checked = true; renderCategoryFields(savedPersona); }
  }
})();
