/* ============================================================
   SUGAR BLOOM ACADEMY — GALLERY INTERACTION SCRIPTS
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  initGalleryFilters();
  initGalleryLightbox();
  initInspectorPins();
  initArchiveTabs();
  initMediumTabs();
});

function initMediumTabs() {
  const chips = document.querySelectorAll('.gal-palette-chip');
  const titleEl = document.getElementById('medium-title');
  const descEl = document.getElementById('medium-desc');
  const flexEl = document.getElementById('medium-flex');
  const humidityEl = document.getElementById('medium-humidity');
  const originEl = document.getElementById('medium-origin');
  const cardDisplay = document.getElementById('medium-card-display');

  if (!chips.length || !titleEl) return;

  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      chips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');

      if (cardDisplay) {
        cardDisplay.style.opacity = '0.5';
        cardDisplay.style.transform = 'translateY(4px)';
      }

      setTimeout(() => {
        if (titleEl) titleEl.textContent = chip.dataset.title || '';
        if (descEl) descEl.textContent = chip.dataset.desc || '';
        if (flexEl) flexEl.textContent = chip.dataset.flex || '';
        if (humidityEl) humidityEl.textContent = chip.dataset.humidity || '';
        if (originEl) originEl.textContent = chip.dataset.origin || '';

        if (cardDisplay) {
          cardDisplay.style.opacity = '1';
          cardDisplay.style.transform = 'translateY(0)';
        }
      }, 150);
    });
  });
}

function initGalleryFilters() {
  const filterPills = document.querySelectorAll('.gal-filter-pill');
  const items = Array.from(document.querySelectorAll('.gal-item'));
  const gridContainer = document.querySelector('.gal-masonry-grid');
  const paginationContainer = document.getElementById('gal-pagination');
  const pageNumbersContainer = document.getElementById('gal-page-numbers');
  const prevBtn = document.getElementById('gal-prev-btn');
  const nextBtn = document.getElementById('gal-next-btn');

  if (!filterPills.length || !items.length) return;

  const ITEMS_PER_PAGE = 6;
  let currentPage = 1;
  let activeCategory = 'all';
  let filteredItems = [...items];

  function renderPaginationControls(totalPages) {
    if (!paginationContainer || !pageNumbersContainer) return;

    if (totalPages <= 1) {
      paginationContainer.style.display = 'none';
      return;
    }

    paginationContainer.style.display = 'flex';
    pageNumbersContainer.innerHTML = '';

    for (let i = 1; i <= totalPages; i++) {
      const numBtn = document.createElement('button');
      numBtn.type = 'button';
      numBtn.className = `gal-page-num ${i === currentPage ? 'active' : ''}`;
      numBtn.textContent = i;
      numBtn.setAttribute('aria-label', `Page ${i}`);
      numBtn.addEventListener('click', () => {
        if (currentPage !== i) {
          currentPage = i;
          applyGalleryState();
          scrollToGalleryTop();
        }
      });
      pageNumbersContainer.appendChild(numBtn);
    }

    if (prevBtn) prevBtn.disabled = (currentPage === 1);
    if (nextBtn) nextBtn.disabled = (currentPage === totalPages);
  }

  function scrollToGalleryTop() {
    if (gridContainer) {
      gridContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  function applyGalleryState() {
    // 1. Filter items based on activeCategory
    filteredItems = items.filter(item => {
      const itemCategory = (item.dataset.category || '').toLowerCase();
      return activeCategory === 'all' || itemCategory.includes(activeCategory);
    });

    const totalPages = Math.ceil(filteredItems.length / ITEMS_PER_PAGE) || 1;

    // Safety check on currentPage bounds
    if (currentPage > totalPages) currentPage = totalPages;
    if (currentPage < 1) currentPage = 1;

    // Determine current page index slice
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const visibleOnPage = filteredItems.slice(startIndex, endIndex);

    // Grid container maintains clean responsive grid layout & updates visible item count attribute
    if (gridContainer) {
      gridContainer.classList.remove('is-filtered');
      gridContainer.setAttribute('data-count', visibleOnPage.length);
    }

    // Synchronously show/hide items to eliminate flickering, ghost duplicates, or delayed layout reflows
    items.forEach(item => {
      if (visibleOnPage.includes(item)) {
        item.style.display = '';
        item.style.opacity = '1';
        item.style.transform = 'scale(1)';
        item.classList.remove('hidden-by-filter');
      } else {
        item.style.display = 'none';
        item.style.opacity = '0';
        item.style.transform = 'scale(1)';
        item.classList.add('hidden-by-filter');
      }
    });

    // Render pagination controls
    renderPaginationControls(totalPages);
  }

  // Filter Pill Click Handlers
  filterPills.forEach(pill => {
    pill.addEventListener('click', () => {
      filterPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');

      activeCategory = pill.dataset.filter.toLowerCase();
      currentPage = 1; // Reset to page 1 when category changes
      applyGalleryState();
    });
  });

  // Prev / Next button listeners
  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      if (currentPage > 1) {
        currentPage--;
        applyGalleryState();
        scrollToGalleryTop();
      }
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      const totalPages = Math.ceil(filteredItems.length / ITEMS_PER_PAGE);
      if (currentPage < totalPages) {
        currentPage++;
        applyGalleryState();
        scrollToGalleryTop();
      }
    });
  }

  // Initial render on load
  applyGalleryState();
}

function initGalleryLightbox() {
  const items = document.querySelectorAll('.gal-item');
  const lightbox = document.getElementById('gallery-lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxTitle = document.getElementById('lightbox-title');
  const lightboxCategory = document.getElementById('lightbox-category');
  const lightboxArtist = document.getElementById('lightbox-artist');
  const lightboxDesc = document.getElementById('lightbox-desc');
  const lightboxClose = document.getElementById('lightbox-close');

  if (!lightbox || !items.length) return;

  items.forEach(item => {
    item.addEventListener('click', () => {
      const img = item.querySelector('.gal-img');
      const title = item.dataset.title || 'Studio Masterwork';
      const category = item.dataset.category || 'Sugarcraft';
      const artist = item.dataset.artist || 'Sugar Bloom Atelier';
      const desc = item.dataset.desc || 'Handcrafted tiered masterwork created during Sugar Bloom Academy workshops.';

      if (img) {
        lightboxImg.src = img.src;
        lightboxImg.alt = title;
      }
      lightboxTitle.textContent = title;
      lightboxCategory.textContent = category.toUpperCase();
      lightboxArtist.textContent = `Artist: ${artist}`;
      lightboxDesc.textContent = desc;

      lightbox.classList.add('active');
    });
  });

  const closeLightbox = () => {
    lightbox.classList.remove('active');
  };

  if (lightboxClose) {
    lightboxClose.addEventListener('click', closeLightbox);
  }

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
      closeLightbox();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.classList.contains('active')) {
      closeLightbox();
    }
  });
}

function initInspectorPins() {
  const pins = document.querySelectorAll('.gal-inspector-pin');
  const tagEl = document.getElementById('insp-tag');
  const titleEl = document.getElementById('insp-title');
  const specsEl = document.getElementById('insp-specs');
  const descEl = document.getElementById('insp-desc');
  const chefEl = document.getElementById('insp-chef');

  if (!pins.length || !tagEl) return;

  pins.forEach(pin => {
    pin.addEventListener('click', () => {
      pins.forEach(p => p.classList.remove('active'));
      pin.classList.add('active');

      if (tagEl) tagEl.textContent = pin.dataset.tag;
      if (titleEl) titleEl.textContent = pin.dataset.title;
      if (specsEl) specsEl.textContent = pin.dataset.specs;
      if (descEl) descEl.textContent = pin.dataset.desc;
      if (chefEl) chefEl.textContent = pin.dataset.chef;
    });
  });
}

function initArchiveTabs() {
  const archiveTabs = document.querySelectorAll('.gal-archive-tab');
  const titleEl = document.getElementById('archive-title');
  const yearEl = document.getElementById('archive-year');
  const descEl = document.getElementById('archive-desc');
  const heroImgEl = document.getElementById('archive-heroimg');
  const img1El = document.getElementById('archive-img1');
  const img2El = document.getElementById('archive-img2');
  const cap1El = document.getElementById('archive-cap1');
  const cap2El = document.getElementById('archive-cap2');

  if (!archiveTabs.length || !titleEl) return;

  archiveTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      archiveTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      if (titleEl) titleEl.textContent = tab.dataset.title || '';
      if (yearEl) yearEl.textContent = tab.dataset.year || '';
      if (descEl) descEl.textContent = tab.dataset.desc || '';
      if (heroImgEl && tab.dataset.heroimg) {
        const path = tab.dataset.heroimg.startsWith('assets/images/') ? tab.dataset.heroimg : 'assets/images/' + tab.dataset.heroimg;
        heroImgEl.src = path;
      }
      if (img1El && tab.dataset.img1) {
        const path = tab.dataset.img1.startsWith('assets/images/') ? tab.dataset.img1 : 'assets/images/' + tab.dataset.img1;
        img1El.src = path;
      }
      if (img2El && tab.dataset.img2) {
        const path = tab.dataset.img2.startsWith('assets/images/') ? tab.dataset.img2 : 'assets/images/' + tab.dataset.img2;
        img2El.src = path;
      }
      if (cap1El && tab.dataset.cap1) cap1El.textContent = tab.dataset.cap1;
      if (cap2El && tab.dataset.cap2) cap2El.textContent = tab.dataset.cap2;
    });
  });
}

