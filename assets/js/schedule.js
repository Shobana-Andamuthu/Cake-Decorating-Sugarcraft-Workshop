/* ============================================================
   SUGAR BLOOM ACADEMY — SCHEDULE INTERACTION SCRIPTS
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  initMonthSelector();
  initScheduleFilters();
});

function initMonthSelector() {
  const monthPills = document.querySelectorAll('.sch-month-pill');
  const rows = document.querySelectorAll('.sch-row');

  if (!monthPills.length) return;

  monthPills.forEach(pill => {
    pill.addEventListener('click', () => {
      monthPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');

      const targetMonth = pill.dataset.month.toLowerCase();

      rows.forEach(row => {
        const rowMonth = (row.dataset.month || '').toLowerCase();
        if (targetMonth === 'all' || rowMonth.includes(targetMonth)) {
          row.style.display = 'grid';
          setTimeout(() => {
            row.style.opacity = '1';
            row.style.transform = 'translateY(0)';
          }, 40);
        } else {
          row.style.opacity = '0';
          row.style.transform = 'translateY(8px)';
          setTimeout(() => {
            row.style.display = 'none';
          }, 250);
        }
      });
    });
  });
}

function initScheduleFilters() {
  const levelSelect = document.getElementById('filter-level');
  const typeSelect = document.getElementById('filter-type');
  const monthSelect = document.getElementById('filter-month');
  const filterBtn = document.getElementById('filter-apply-btn');
  const rows = document.querySelectorAll('.sch-row');

  if (!filterBtn || !rows.length) return;

  filterBtn.addEventListener('click', () => {
    const levelVal = (levelSelect.value || '').toLowerCase();
    const typeVal = (typeSelect.value || '').toLowerCase();
    const monthVal = (monthSelect.value || '').toLowerCase();

    rows.forEach(row => {
      const rowLevel = (row.dataset.level || '').toLowerCase();
      const rowType = (row.dataset.type || '').toLowerCase();
      const rowMonth = (row.dataset.month || '').toLowerCase();

      const matchLevel = levelVal === 'all' || rowLevel.includes(levelVal);
      const matchType = typeVal === 'all' || rowType.includes(typeVal);
      const matchMonth = monthVal === 'all' || rowMonth.includes(monthVal);

      if (matchLevel && matchType && matchMonth) {
        row.style.display = 'grid';
        setTimeout(() => {
          row.style.opacity = '1';
          row.style.transform = 'translateY(0)';
        }, 40);
      } else {
        row.style.opacity = '0';
        row.style.transform = 'translateY(8px)';
        setTimeout(() => {
          row.style.display = 'none';
        }, 250);
      }
    });
  });
}
