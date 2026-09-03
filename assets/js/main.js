/* ============================================================
   SUGAR BLOOM ACADEMY — GLOBAL JAVASCRIPT INTERACTIONS
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initNavDropdowns();
  initScrollAnimations();
  initFormValidation();
  initActiveNavLink();
  initAccordions();
  initPasswordToggles();
  initThemeToggle();
  initRtlToggle();
  initBackToTop();
});

// Run immediate theme & dir setup to prevent flashing
(function setupInitialThemeAndDir() {
  const savedTheme = localStorage.getItem('sugar_bloom_theme') || 'light';
  const savedDir = localStorage.getItem('sugar_bloom_dir') || 'ltr';
  document.documentElement.setAttribute('data-theme', savedTheme);
  document.documentElement.setAttribute('dir', savedDir);
})();


/* ── 1. Navbar Scroll Transformation & Mobile Menu ── */
function initNavbar() {
  const navbar = document.querySelector('.site-navbar');
  const mobileToggle = document.querySelector('.mobile-menu-toggle');
  const mobileDrawer = document.querySelector('.mobile-drawer');
  const drawerOverlay = document.querySelector('.drawer-overlay');
  const drawerClose = document.querySelector('.drawer-close');

  if (!navbar) return;

  // Scroll state detection
  const handleScroll = () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // Initial check

  // Mobile menu drawer toggling
  function openDrawer() {
    if (!mobileDrawer) return;
    mobileDrawer.classList.add('is-active');
    document.body.style.overflow = 'hidden';
    if (mobileToggle) mobileToggle.setAttribute('aria-expanded', 'true');
  }

  function closeDrawer() {
    if (!mobileDrawer) return;
    mobileDrawer.classList.remove('is-active');
    document.body.style.overflow = '';
    if (mobileToggle) mobileToggle.setAttribute('aria-expanded', 'false');
  }

  if (mobileToggle) {
    mobileToggle.addEventListener('click', () => {
      const isOpen = mobileDrawer && mobileDrawer.classList.contains('is-active');
      if (isOpen) closeDrawer();
      else openDrawer();
    });
  }

  if (drawerOverlay) drawerOverlay.addEventListener('click', closeDrawer);
  if (drawerClose) drawerClose.addEventListener('click', closeDrawer);

  // Close drawer on ESC key
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileDrawer && mobileDrawer.classList.contains('is-active')) {
      closeDrawer();
    }
  });
}

/* ── 1.5. Navbar Dropdown Toggles ── */
function initNavDropdowns() {
  document.querySelectorAll('.nav-dropdown-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const wrap = btn.closest('.nav-dropdown-wrap');
      if (wrap) {
        wrap.classList.toggle('open');
      }
    });
  });

  document.querySelectorAll('.drawer-dropdown-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const wrap = btn.closest('.drawer-dropdown-wrap');
      if (wrap) {
        wrap.classList.toggle('open');
      }
    });
  });

  document.addEventListener('click', (e) => {
    if (!e.target.closest('.nav-dropdown-wrap')) {
      document.querySelectorAll('.nav-dropdown-wrap.open').forEach(el => el.classList.remove('open'));
    }
  });
}

/* ── 2. Active Nav Link Indicator ── */
function initActiveNavLink() {
  const rawPath = window.location.pathname.split('/').pop() || 'index.html';
  const currentPath = rawPath.split('?')[0].split('#')[0] || 'index.html';
  
  // Reset all active classes
  document.querySelectorAll('.nav-link, .nav-dropdown-btn, .nav-dropdown-item, .drawer-link, .drawer-dropdown-btn, .drawer-sublink').forEach(el => {
    el.classList.remove('active');
  });

  const isHome1 = currentPath === 'index.html' || currentPath === '';
  const isHome2 = currentPath === 'home-2.html';

  if (isHome1 || isHome2) {
    // Highlight top-level Home dropdown buttons
    document.querySelectorAll('.nav-dropdown-btn, .drawer-dropdown-btn').forEach(btn => btn.classList.add('active'));

    const targetHref = isHome1 ? 'index.html' : 'home-2.html';
    document.querySelectorAll(`.nav-dropdown-item[href="${targetHref}"], .drawer-sublink[href="${targetHref}"]`).forEach(item => {
      item.classList.add('active');
    });
  } else {
    document.querySelectorAll(`.nav-link[href="${currentPath}"], .drawer-link[href="${currentPath}"]`).forEach(link => {
      link.classList.add('active');
    });
  }
}

/* ── 3. Scroll Reveal Animations (IntersectionObserver) ── */
function initScrollAnimations() {
  const revealElements = document.querySelectorAll('[data-reveal]');

  if (!('IntersectionObserver' in window)) {
    // Fallback for older browsers
    revealElements.forEach(el => el.classList.add('revealed'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        // Unobserve after animating once if preferred
        // observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  revealElements.forEach(el => observer.observe(el));
}

/* ── 4. Form Validation & Smooth Interactions ── */
function initFormValidation() {
  const forms = document.querySelectorAll('[data-validate-form]');

  forms.forEach(form => {
    const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');

    inputs.forEach(input => {
      // Clear error on input
      input.addEventListener('input', () => {
        clearInputError(input);
      });

      input.addEventListener('blur', () => {
        validateSingleInput(input);
      });
    });

    form.addEventListener('submit', (e) => {
      let isValid = true;
      inputs.forEach(input => {
        if (!validateSingleInput(input)) {
          isValid = false;
        }
      });

      // Confirm password validation if applicable
      const pwd = form.querySelector('input[name="password"]');
      const confirmPwd = form.querySelector('input[name="confirm_password"]');
      if (pwd && confirmPwd && confirmPwd.value.trim() !== '') {
        if (pwd.value !== confirmPwd.value) {
          showInputError(confirmPwd, 'Passwords do not match');
          isValid = false;
        }
      }

      if (!isValid) {
        e.preventDefault();
        // Shake feedback or highlight
        const firstError = form.querySelector('.error');
        if (firstError) firstError.focus();
      } else {
        // Demonstrate successful interaction
        const submitBtn = form.querySelector('button[type="submit"]');
        if (submitBtn && !form.dataset.customSubmit) {
          e.preventDefault();
          const originalText = submitBtn.innerHTML;
          submitBtn.disabled = true;
          submitBtn.innerHTML = `
            <svg class="animate-spin" style="width:18px;height:18px;margin-right:8px;display:inline-block;animation:spin 1s linear infinite" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg> Processing...
          `;

          setTimeout(() => {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalText;
            showFormToast(form.dataset.successMessage || 'Form submitted successfully!');
            form.reset();
          }, 1200);
        }
      }
    });
  });
}

function validateSingleInput(input) {
  const value = input.value.trim();
  const type = input.type;

  if (input.hasAttribute('required') && !value) {
    showInputError(input, 'This field is required');
    return false;
  }

  if (type === 'email' && value) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      showInputError(input, 'Please enter a valid email address');
      return false;
    }
  }

  if (type === 'password' && value && value.length < 6) {
    showInputError(input, 'Password must be at least 6 characters');
    return false;
  }

  if (type === 'tel' && value) {
    const phoneRegex = /^[\d\s\+\-\(\)]{7,}$/;
    if (!phoneRegex.test(value)) {
      showInputError(input, 'Please enter a valid phone number');
      return false;
    }
  }

  clearInputError(input);
  return true;
}

function showInputError(input, message) {
  input.classList.add('error');
  const parent = input.closest('.form-group') || input.parentElement;
  let errorEl = parent.querySelector('.form-error');

  if (!errorEl) {
    errorEl = document.createElement('span');
    errorEl.className = 'form-error visible';
    parent.appendChild(errorEl);
  }

  errorEl.textContent = message;
  errorEl.classList.add('visible');
}

function clearInputError(input) {
  input.classList.remove('error');
  const parent = input.closest('.form-group') || input.parentElement;
  const errorEl = parent ? parent.querySelector('.form-error') : null;
  if (errorEl) {
    errorEl.classList.remove('visible');
    errorEl.textContent = '';
  }
}

/* ── 5. Form Toast Notification ── */
function showFormToast(message) {
  let toast = document.querySelector('.global-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'global-toast';
    toast.style.cssText = `
      position: fixed;
      bottom: 2rem;
      right: 2rem;
      background: #3B2424;
      color: #FAF6F0;
      padding: 1rem 1.75rem;
      border-radius: 9999px;
      border: 1px solid #C9A96E;
      box-shadow: 0 10px 30px rgba(0,0,0,0.25);
      z-index: 9999;
      font-size: 0.9375rem;
      font-family: 'Jost', sans-serif;
      display: flex;
      align-items: center;
      gap: 0.75rem;
      transform: translateY(100px);
      opacity: 0;
      transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
    `;
    document.body.appendChild(toast);
  }

  toast.innerHTML = `
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#C9A96E" stroke-width="2">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
      <polyline points="22 4 12 14.01 9 11.01"></polyline>
    </svg>
    <span>${message}</span>
  `;

  setTimeout(() => {
    toast.style.transform = 'translateY(0)';
    toast.style.opacity = '1';
  }, 50);

  setTimeout(() => {
    toast.style.transform = 'translateY(100px)';
    toast.style.opacity = '0';
  }, 4000);
}

/* ── 6. Password Visibility Toggle ── */
function initPasswordToggles() {
  const toggleBtns = document.querySelectorAll('.toggle-password-btn');
  toggleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const input = btn.previousElementSibling || btn.parentElement.querySelector('input');
      if (!input) return;

      if (input.type === 'password') {
        input.type = 'text';
        btn.innerHTML = `
          <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
            <line x1="1" y1="1" x2="23" y2="23"></line>
          </svg>
        `;
      } else {
        input.type = 'password';
        btn.innerHTML = `
          <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
            <circle cx="12" cy="12" r="3"></circle>
          </svg>
        `;
      }
    });
  });
}

/* ── 7. Accordion Trigger Utility ── */
function initAccordions() {
  const accordionItems = document.querySelectorAll('[data-accordion-item]');

  accordionItems.forEach(item => {
    const header = item.querySelector('[data-accordion-header]');
    const content = item.querySelector('[data-accordion-content]');

    if (!header || !content) return;

    header.addEventListener('click', () => {
      const isOpen = item.classList.contains('active');

      // Close sibling accordions if parent has container attribute
      const parentContainer = item.closest('[data-accordion-group]');
      if (parentContainer) {
        parentContainer.querySelectorAll('[data-accordion-item]').forEach(sibling => {
          sibling.classList.remove('active');
          const sibContent = sibling.querySelector('[data-accordion-content]');
          if (sibContent) sibContent.style.maxHeight = null;
        });
      }

      if (!isOpen) {
        item.classList.add('active');
        content.style.maxHeight = content.scrollHeight + 'px';
      } else {
        item.classList.remove('active');
        content.style.maxHeight = null;
      }
    });
  });
}

/* ── 8. Theme Toggle (Light / Dark) ── */
function initThemeToggle() {
  const currentTheme = localStorage.getItem('sugar_bloom_theme') || 'light';
  applyTheme(currentTheme);

  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.theme-toggle-btn');
    if (btn) {
      e.preventDefault();
      e.stopPropagation();
      const activeTheme = document.documentElement.getAttribute('data-theme') || 'light';
      const newTheme = activeTheme === 'dark' ? 'light' : 'dark';
      applyTheme(newTheme);
    }
  });
}

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('sugar_bloom_theme', theme);

  const themeBtns = document.querySelectorAll('.theme-toggle-btn');
  themeBtns.forEach(btn => {
    if (theme === 'dark') {
      btn.innerHTML = `
        <svg width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="5"></circle>
          <line x1="12" y1="1" x2="12" y2="3"></line>
          <line x1="12" y1="21" x2="12" y2="23"></line>
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
          <line x1="1" y1="12" x2="3" y2="12"></line>
          <line x1="21" y1="12" x2="23" y2="12"></line>
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
        </svg>
        <span>Light</span>
      `;
      btn.setAttribute('aria-label', 'Switch to Light Mode');
    } else {
      btn.innerHTML = `
        <svg width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
        </svg>
        <span>Dark</span>
      `;
      btn.setAttribute('aria-label', 'Switch to Dark Mode');
    }
  });
}

/* ── 9. RTL / LTR Toggle ── */
function initRtlToggle() {
  const currentDir = localStorage.getItem('sugar_bloom_dir') || 'ltr';
  applyDirection(currentDir);

  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.rtl-toggle-btn');
    if (btn) {
      e.preventDefault();
      e.stopPropagation();
      const activeDir = document.documentElement.getAttribute('dir') || 'ltr';
      const newDir = activeDir === 'rtl' ? 'ltr' : 'rtl';
      applyDirection(newDir);
    }
  });
}

function applyDirection(dir) {
  document.documentElement.setAttribute('dir', dir);
  localStorage.setItem('sugar_bloom_dir', dir);

  const rtlBtns = document.querySelectorAll('.rtl-toggle-btn');
  rtlBtns.forEach(btn => {
    btn.innerHTML = dir === 'rtl' ? '<span>LTR</span>' : '<span>RTL</span>';
    btn.setAttribute('aria-label', dir === 'rtl' ? 'Switch to Left-to-Right layout' : 'Switch to Right-to-Left layout');
  });
}

/* ── 10. Back to Top Arrow Button ── */
function initBackToTop() {
  const rawPath = window.location.pathname.split('/').pop() || 'index.html';
  const currentPath = rawPath.split('?')[0].split('#')[0] || 'index.html';

  // Do NOT show Back-to-Top arrow on Login and Register pages
  if (currentPath === 'login.html' || currentPath === 'register.html') {
    return;
  }

  let backToTopBtn = document.getElementById('back-to-top');
  if (!backToTopBtn) {
    backToTopBtn = document.createElement('button');
    backToTopBtn.type = 'button';
    backToTopBtn.id = 'back-to-top';
    backToTopBtn.className = 'back-to-top-btn';
    backToTopBtn.setAttribute('aria-label', 'Back to top');
    backToTopBtn.innerHTML = `
      <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">
        <path d="M18 15l-6-6-6 6"/>
      </svg>
    `;
    document.body.appendChild(backToTopBtn);
  }

  const handleScroll = () => {
    if (window.scrollY > 300) {
      backToTopBtn.classList.add('visible');
    } else {
      backToTopBtn.classList.remove('visible');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}


