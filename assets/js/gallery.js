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
  const items = document.querySelectorAll('.gal-item');
  const gridContainer = document.querySelector('.gal-masonry-grid');

  if (!filterPills.length || !items.length) return;

  filterPills.forEach(pill => {
    pill.addEventListener('click', () => {
      filterPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');

      const targetCategory = pill.dataset.filter.toLowerCase();

      if (gridContainer) {
        if (targetCategory === 'all') {
          gridContainer.classList.remove('is-filtered');
        } else {
          gridContainer.classList.add('is-filtered');
        }
      }

      items.forEach(item => {
        const itemCategory = (item.dataset.category || '').toLowerCase();

        if (targetCategory === 'all' || itemCategory.includes(targetCategory)) {
          item.style.display = '';
          item.classList.remove('hidden-by-filter');
          setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'scale(1)';
          }, 40);
        } else {
          item.style.opacity = '0';
          item.style.transform = 'scale(0.95)';
          item.classList.add('hidden-by-filter');
          setTimeout(() => {
            item.style.display = 'none';
          }, 250);
        }
      });
    });
  });
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

