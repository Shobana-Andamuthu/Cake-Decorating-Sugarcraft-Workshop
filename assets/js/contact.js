/* ============================================================
   SUGAR BLOOM ACADEMY — CONTACT & ENROLLMENT SCRIPTS
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  initContactForm();
  initContactFAQ();
});

function initContactForm() {
  const form = document.getElementById('enrollment-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    let isValid = true;
    const requiredInputs = form.querySelectorAll('[required]');

    requiredInputs.forEach(input => {
      if (!input.value.trim()) {
        input.classList.add('is-invalid');
        isValid = false;
      } else {
        input.classList.remove('is-invalid');
      }
    });

    if (!isValid) {
      showFormNotification('Please fill out all required enrollment fields.', 'error');
      return;
    }

    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;

    // Spinner Loading State
    submitBtn.disabled = true;
    submitBtn.innerHTML = `
      <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      Reserving Workstation...
    `;

    setTimeout(() => {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalText;
      form.reset();
      showFormNotification('Workstation reservation inquiry submitted! Chef Vivienne’s concierge team will contact you within 24 hours.', 'success');
    }, 1500);
  });
}

function showFormNotification(message, type) {
  const container = document.getElementById('form-notification-container');
  if (!container) return;

  const notification = document.createElement('div');
  notification.className = `p-4 rounded-xl text-sm font-semibold mb-4 transition-all duration-300 ${
    type === 'error' ? 'bg-red-100 text-red-800 border border-red-200' : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
  }`;
  notification.textContent = message;

  container.innerHTML = '';
  container.appendChild(notification);

  setTimeout(() => {
    notification.remove();
  }, 6000);
}

function initContactFAQ() {
  const faqItems = document.querySelectorAll('.cnt-faq-item');
  if (!faqItems.length) return;

  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.cnt-faq-question');
    questionBtn.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      faqItems.forEach(otherItem => otherItem.classList.remove('active'));

      if (!isActive) {
        item.classList.add('active');
      }
    });
  });
}
