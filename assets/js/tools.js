/* ============================================================
   SUGAR BLOOM ACADEMY — TOOLS & MATERIALS INTERACTION SCRIPTS
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  initHotspotPins();
  initFaqAccordion();
});

function initHotspotPins() {
  const pins = document.querySelectorAll('.tm-pin');

  pins.forEach(pin => {
    pin.addEventListener('click', (e) => {
      // Toggle active pin popover on mobile / touch
      const isAlreadyActive = pin.classList.contains('active');
      pins.forEach(p => p.classList.remove('active'));
      if (!isAlreadyActive) {
        pin.classList.add('active');
      }
      e.stopPropagation();
    });
  });

  document.addEventListener('click', () => {
    pins.forEach(p => p.classList.remove('active'));
  });
}

function initFaqAccordion() {
  const faqHeaders = document.querySelectorAll('.tm-faq-header');

  faqHeaders.forEach(header => {
    header.addEventListener('click', () => {
      const item = header.parentElement;
      const isActive = item.classList.contains('active');

      // Close all active items
      document.querySelectorAll('.tm-faq-item').forEach(i => i.classList.remove('active'));

      // Open clicked item if not active
      if (!isActive) {
        item.classList.add('active');
      }
    });
  });
}
