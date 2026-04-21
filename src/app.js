// =============================================
// PowerTrack Pro – App Controller
// =============================================

const PAGE_TITLES = {
  dashboard: 'Dashboard',
  today:     "Today's Schedule",
  customers: 'Customers',
  schedule:  'Schedule',
};

let _navHistory = ['dashboard'];

// ---- NAVIGATION ----

function navigate(page, filterHint) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const target = document.getElementById('page-' + page);
  if (target) target.classList.add('active');

  document.querySelectorAll('.nav-item').forEach(item => {
    item.classList.toggle('active', item.dataset.page === page);
  });

  document.getElementById('page-title').textContent = PAGE_TITLES[page] || page;

  // Track history for back button
  const last = _navHistory[_navHistory.length - 1];
  if (last !== page) _navHistory.push(page);

  // Show back button on all pages except dashboard
  const backBtn = document.getElementById('back-btn');
  if (backBtn) backBtn.style.display = (page !== 'dashboard') ? 'inline-flex' : 'none';

  if (filterHint !== undefined && page === 'customers') {
    const sel = document.getElementById('filter-status');
    if (sel) { sel.value = filterHint; renderCustomers(); }
  }
}

function goBack() {
  // Pop current page
  if (_navHistory.length > 1) _navHistory.pop();
  const prev = _navHistory[_navHistory.length - 1] || 'dashboard';
  navigate(prev);
}

// ---- BIND NAV ----
document.querySelectorAll('.nav-item').forEach(item => {
  item.addEventListener('click', () => {
    _navHistory = ['dashboard']; // reset history on sidebar click
    navigate(item.dataset.page);
  });
});

// ---- TOPBAR DATE ----
function setTopbarDate() {
  document.getElementById('topbar-date').textContent =
    TODAY.toLocaleDateString('en-IN', {
      weekday: 'short', day: 'numeric', month: 'short', year: 'numeric'
    });
}

// ---- BOOT ----
(function init() {
  setTopbarDate();
  document.getElementById('page-title').textContent = 'Loading…';
  loadData(function() {
    document.getElementById('page-title').textContent = PAGE_TITLES['dashboard'];
    renderAll();
    console.log('Pulse Marketing & Services BMS initialized. Customers:', customers.length);
  });
})();
