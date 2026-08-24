/* ===== Reusable JavaScript Slideshow Controller ===== */
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

/* ===== Temporary Form Feedback (replace with backend authentication later) ===== */
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

    /* Remember which of the 4 profiles the person picked, so add-expense.html
       can jump straight to the right category set. */
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

/* ===== Future Google Sign-In Placeholder ===== */
document.querySelectorAll('[data-google-button]').forEach((button) => {
  button.addEventListener('click', () => {
    const message = document.querySelector('.form-message');
    message.textContent = 'Google Sign-In will be connected when the backend is added.';
  });
});
