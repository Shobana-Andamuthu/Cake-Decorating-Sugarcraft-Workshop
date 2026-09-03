/* ============================================================
   SUGAR BLOOM ACADEMY — WORKSHOPS PAGE INTERACTION SCRIPTS
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  initWorkshopFilters();
  initMasteryPanelSwitch();
});

function initWorkshopFilters() {
  const filterPills = document.querySelectorAll('.ws-filter-pill');
  const listItems = document.querySelectorAll('.ws-list-item');

  if (!filterPills.length || !listItems.length) return;

  filterPills.forEach(pill => {
    pill.addEventListener('click', () => {
      // Toggle active class on pills
      filterPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');

      const filterVal = pill.dataset.filter.toLowerCase();

      listItems.forEach(item => {
        const category = (item.dataset.category || '').toLowerCase();
        const level = (item.dataset.level || '').toLowerCase();

        if (filterVal === 'all' || category.includes(filterVal) || level.includes(filterVal)) {
          item.style.display = 'grid';
          setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
          }, 50);
        } else {
          item.style.opacity = '0';
          item.style.transform = 'translateY(10px)';
          setTimeout(() => {
            item.style.display = 'none';
          }, 300);
        }
      });
    });
  });
}

function initMasteryPanelSwitch() {
  const masteryRows = document.querySelectorAll('.ws-mastery-row');
  const badgeEl = document.getElementById('mastery-badge');
  const titleEl = document.getElementById('mastery-title');
  const descEl = document.getElementById('mastery-desc');
  const outcomeEl = document.getElementById('mastery-outcome');
  const bulletsEl = document.getElementById('mastery-bullets');

  if (!masteryRows.length || !badgeEl) return;

  masteryRows.forEach(row => {
    row.addEventListener('click', () => {
      masteryRows.forEach(r => r.classList.remove('active'));
      row.classList.add('active');

      const badge = row.dataset.badge;
      const title = row.dataset.title;
      const desc = row.dataset.desc;
      const outcome = row.dataset.outcome;
      const b1 = row.dataset.b1;
      const b2 = row.dataset.b2;
      const b3 = row.dataset.b3;

      if (badgeEl) badgeEl.textContent = badge;
      if (titleEl) titleEl.textContent = title;
      if (descEl) descEl.textContent = desc;
      if (outcomeEl) outcomeEl.textContent = outcome;

      if (bulletsEl) {
        bulletsEl.innerHTML = `
          <div class="ws-mastery-bullet">
            <span class="text-rose font-bold">✓</span>
            <span>${b1}</span>
          </div>
          <div class="ws-mastery-bullet">
            <span class="text-rose font-bold">✓</span>
            <span>${b2}</span>
          </div>
          <div class="ws-mastery-bullet">
            <span class="text-rose font-bold">✓</span>
            <span>${b3}</span>
          </div>
        `;
      }
    });
  });
}

