// Live form validation for Spendly (load BEFORE app.js)
(function () {
  'use strict';

  const rules = {
    name: (v) => (v.trim().length >= 2 ? '' : 'Please enter your full name.'),
    email: (v) => (/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) ? '' : 'Enter a valid email, like you@example.com.'),
    dob: (v) => {
      if (!v) return 'Please choose your date of birth.';
      const limit = new Date();
      limit.setFullYear(limit.getFullYear() - 13);
      return new Date(v) <= limit ? '' : 'You must be at least 13 years old.';
    },
    phone: (v) => (/^[0-9]{7,15}$/.test(v.replace(/\D/g, '')) ? '' : 'Enter 7 to 15 digits.'),
  };

  function passwordError(mode, v) {
    if (!v) return 'Please enter your password.';
    if (mode === 'login') return '';
    if (v.length < 8) return 'Use at least 8 characters.';
    if (!/[A-Za-z]/.test(v) || !/[0-9]/.test(v)) return 'Include at least one letter and one number.';
    return '';
  }

  function getError(form, input) {
    const value = input.value;
    if (input.name === 'password') return passwordError(form.dataset.validate, value);
    if (input.name === 'confirm') {
      if (!value) return 'Please confirm your password.';
      return value === form.elements.password.value ? '' : 'Passwords do not match.';
    }
    return rules[input.name] ? rules[input.name](value) : '';
  }

  function showError(input, message) {
    const label = input.closest('label');
    let box = label.querySelector('.field-error');
    if (!box) {
      box = document.createElement('span');
      box.className = 'field-error';
      box.id = 'err-' + input.name;
      box.setAttribute('role', 'alert');
      label.appendChild(box);
      input.setAttribute('aria-describedby', box.id);
    }
    box.textContent = message;
    input.setAttribute('aria-invalid', message ? 'true' : 'false');
    input.classList.toggle('has-error', Boolean(message));
  }

  function addPasswordToggle(input) {
    const wrap = document.createElement('div');
    wrap.className = 'password-wrap';
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'password-toggle';
    button.textContent = 'Show';
    button.setAttribute('aria-label', 'Show password');
    input.replaceWith(wrap);
    wrap.append(input, button);
    button.addEventListener('click', () => {
      const hidden = input.type === 'password';
      input.type = hidden ? 'text' : 'password';
      button.textContent = hidden ? 'Hide' : 'Show';
      button.setAttribute('aria-label', hidden ? 'Hide password' : 'Show password');
    });
  }

  document.querySelectorAll('form[data-validate]').forEach((form) => {
    const fields = [...form.querySelectorAll('input[name]')].filter(
      (input) => input.type !== 'radio' && (rules[input.name] || input.name === 'password' || input.name === 'confirm')
    );
    const message = form.querySelector('.form-message');

    fields.forEach((field) => {
      if (field.type === 'password') addPasswordToggle(field);

      field.addEventListener('blur', () => {
        field.dataset.touched = '1';
        showError(field, getError(form, field));
      });

      field.addEventListener('input', () => {
        if (field.dataset.touched) showError(field, getError(form, field));
        if (field.name === 'password' && form.elements.confirm && form.elements.confirm.dataset.touched) {
          showError(form.elements.confirm, getError(form, form.elements.confirm));
        }
      });
    });

    form.addEventListener('submit', (event) => {
      let firstBad = null;
      fields.forEach((field) => {
        field.dataset.touched = '1';
        const error = getError(form, field);
        showError(field, error);
        if (error && !firstBad) firstBad = field;
      });

      const radios = form.querySelectorAll('input[name="profession"]');
      const professionMissing = radios.length > 0 && !form.querySelector('input[name="profession"]:checked');

      if (firstBad || professionMissing) {
        event.preventDefault();
        event.stopImmediatePropagation(); // stops app.js from showing success and redirecting
        if (message) message.textContent = professionMissing && !firstBad
          ? 'Please choose what best describes you.'
          : 'Please fix the highlighted fields.';
        if (firstBad) firstBad.focus();
      }
    });
  });
})();
