/* ============================================================
   SUGAR BLOOM ACADEMY — HOME 2 INTERACTION SCRIPTS
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  initClipPathReveal();
  initTabs();
  initAnimatedCounters();
  initBeforeAfterSlider();
});

/* ── 1. Hero Image Clip-Path Reveal ── */
function initClipPathReveal() {
  const clipEl = document.querySelector('.h2-clip-reveal');
  if (!clipEl) return;

  setTimeout(() => {
    clipEl.classList.add('revealed');
  }, 150);
}

/* ── 2. Interactive Craft Tabs ── */
function initTabs() {
  const tabBtns = document.querySelectorAll('.h2-tab-btn');
  const tabPanes = document.querySelectorAll('.h2-tab-pane');

  if (!tabBtns.length) return;

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.dataset.tab;

      // Remove active from buttons
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      // Hide all panes
      tabPanes.forEach(pane => {
        pane.classList.remove('active');
      });

      // Show targeted pane
      const activePane = document.getElementById(targetId);
      if (activePane) {
        activePane.classList.add('active');
      }
    });
  });
}

/* ── 3. Animated Statistics Counter ── */
function initAnimatedCounters() {
  const statNumbers = document.querySelectorAll('[data-counter]');

  if (!statNumbers.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const targetVal = parseInt(el.dataset.counter, 10);
        const suffix = el.dataset.suffix || '';
        let currentVal = 0;
        const duration = 1600; // 1.6 seconds
        const stepTime = Math.max(Math.floor(duration / targetVal), 20);

        const timer = setInterval(() => {
          currentVal += 1;
          el.textContent = currentVal + suffix;
          if (currentVal >= targetVal) {
            el.textContent = targetVal + suffix;
            clearInterval(timer);
          }
        }, stepTime);

        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  statNumbers.forEach(num => observer.observe(num));
}

/* ── 4. Interactive Before / After Image Slider ── */
function initBeforeAfterSlider() {
  const container = document.querySelector('.h2-ba-container');
  if (!container) return;

  const afterImgPane = container.querySelector('.h2-ba-image-after');
  const handle = container.querySelector('.h2-ba-slider-handle');

  if (!afterImgPane || !handle) return;

  let isDragging = false;

  const updateSlider = (clientX) => {
    const rect = container.getBoundingClientRect();
    let x = clientX - rect.left;

    // Constrain within bounds
    if (x < 0) x = 0;
    if (x > rect.width) x = rect.width;

    const percentage = (x / rect.width) * 100;
    afterImgPane.style.width = `${percentage}%`;
    handle.style.left = `${percentage}%`;
  };

  container.addEventListener('mousedown', (e) => {
    isDragging = true;
    updateSlider(e.clientX);
  });

  window.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    updateSlider(e.clientX);
  });

  window.addEventListener('mouseup', () => {
    isDragging = false;
  });

  // Touch support for mobile devices
  container.addEventListener('touchstart', (e) => {
    isDragging = true;
    if (e.touches[0]) updateSlider(e.touches[0].clientX);
  });

  window.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
    if (e.touches[0]) updateSlider(e.touches[0].clientX);
  });

  window.addEventListener('touchend', () => {
    isDragging = false;
  });
}
