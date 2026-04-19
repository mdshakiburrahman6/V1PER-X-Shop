/* ============================================================
   V1PER X SHOP — Dashboard Shared JavaScript
   File: dashboard.js

   TABLE OF CONTENTS:
   01. Theme Toggle (Dark / Light)
   02. Sidebar Toggle (Mobile)
   03. Scroll Reveal Animation
   04. Active Nav Item Highlight
   05. Notification Toast
   06. Modal Open / Close
   07. Confirm Dialog
   08. Copy to Clipboard
   09. Number Format Helper
   10. Date Format Helper
   ============================================================ */


/* ============================================================
   01. THEME TOGGLE
   — localStorage e save hoy, persist kore
============================================================ */
const html     = document.documentElement;
const themeBtn = document.getElementById('themeToggle');

/* Saved theme load */
const savedTheme = localStorage.getItem('viper-theme') || 'dark';
html.setAttribute('data-theme', savedTheme);
if (themeBtn) themeBtn.textContent = savedTheme === 'dark' ? '🌙' : '☀️';

themeBtn?.addEventListener('click', () => {
  const next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  html.setAttribute('data-theme', next);
  themeBtn.textContent = next === 'dark' ? '🌙' : '☀️';
  localStorage.setItem('viper-theme', next);
});


/* ============================================================
   02. SIDEBAR TOGGLE (Mobile)
   — Hamburger click → sidebar open/close
   — Overlay click → sidebar close
============================================================ */
const sidebar        = document.getElementById('sidebar');
const sidebarOverlay = document.getElementById('sidebarOverlay');
const menuBtn        = document.getElementById('mobileMenuBtn');

function openSidebar() {
  sidebar?.classList.add('open');
  sidebarOverlay?.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeSidebar() {
  sidebar?.classList.remove('open');
  sidebarOverlay?.classList.remove('active');
  document.body.style.overflow = '';
}

menuBtn?.addEventListener('click', () => {
  sidebar?.classList.contains('open') ? closeSidebar() : openSidebar();
});

sidebarOverlay?.addEventListener('click', closeSidebar);

/* ESC key e sidebar close */
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    closeSidebar();
    closeAllModals();
  }
});


/* ============================================================
   03. SCROLL REVEAL ANIMATION
   — .reveal class element gulo scroll e fade+slide hoy
============================================================ */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      /* Staggered delay for multiple cards */
      setTimeout(() => {
        entry.target.classList.add('in');
      }, i * 60);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.08 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));


/* ============================================================
   04. ACTIVE NAV ITEM HIGHLIGHT
   — Current page URL match kore active class set kore
============================================================ */
const currentPage = window.location.pathname.split('/').pop() || 'index.html';

document.querySelectorAll('.nav-item').forEach(item => {
  const href = item.getAttribute('href') || '';
  if (href === currentPage || href.includes(currentPage)) {
    item.classList.add('active');
  }
});


/* ============================================================
   05. NOTIFICATION TOAST
   — showToast('message', 'success'|'error'|'info'|'warning')
   — Auto hide after 3.5s
   — Customize: duration, position change korte CSS edit koro
============================================================ */
let toastTimer;

function showToast(message, type = 'success', duration = 3500) {
  /* Existing toast remove */
  const existing = document.getElementById('dashToast');
  if (existing) existing.remove();

  const icons = {
    success: '✅',
    error:   '❌',
    info:    'ℹ️',
    warning: '⚠️',
  };

  const colors = {
    success: 'var(--success)',
    error:   'var(--danger)',
    info:    'var(--info)',
    warning: 'var(--warning)',
  };

  const toast = document.createElement('div');
  toast.id = 'dashToast';
  toast.style.cssText = `
    position: fixed;
    top: 84px; right: 20px;
    z-index: 9999;
    background: var(--card);
    border: 1px solid ${colors[type]};
    border-radius: 10px;
    padding: 12px 18px;
    display: flex;
    align-items: center;
    gap: 10px;
    font-family: var(--font-ui, 'Inter', sans-serif);
    font-size: 13px;
    font-weight: 500;
    color: var(--text);
    box-shadow: var(--shadow);
    min-width: 240px;
    max-width: 360px;
    transform: translateX(120%);
    transition: transform 0.35s cubic-bezier(.4,0,.2,1);
  `;

  toast.innerHTML = `
    <span style="font-size:17px;">${icons[type]}</span>
    <span style="flex:1;">${message}</span>
    <span onclick="this.parentElement.remove()" style="cursor:pointer;opacity:0.5;font-size:16px;padding:2px 4px;">✕</span>
  `;

  document.body.appendChild(toast);

  /* Slide in */
  requestAnimationFrame(() => {
    toast.style.transform = 'translateX(0)';
  });

  /* Auto hide */
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.style.transform = 'translateX(120%)';
    setTimeout(() => toast.remove(), 400);
  }, duration);
}


/* ============================================================
   06. MODAL OPEN / CLOSE
   — openModal('modalId') / closeModal('modalId')
   — Modal HTML: .modal-overlay#modalId > .modal-card
============================================================ */
function openModal(id) {
  const modal = document.getElementById(id);
  if (!modal) return;
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeModal(id) {
  const modal = document.getElementById(id);
  if (!modal) return;
  modal.classList.remove('active');
  document.body.style.overflow = '';
}

function closeAllModals() {
  document.querySelectorAll('.modal-overlay.active').forEach(m => {
    m.classList.remove('active');
  });
  document.body.style.overflow = '';
}

/* Overlay click e modal close */
document.querySelectorAll('.modal-overlay').forEach(overlay => {
  overlay.addEventListener('click', e => {
    if (e.target === overlay) {
      overlay.classList.remove('active');
      document.body.style.overflow = '';
    }
  });
});

/* .modal-close button click e close */
document.querySelectorAll('.modal-close').forEach(btn => {
  btn.addEventListener('click', () => closeAllModals());
});


/* ============================================================
   07. CONFIRM DIALOG
   — confirmAction(message) → Promise<boolean>
   — Native confirm er instead custom use korte extend koro
============================================================ */
function confirmAction(message) {
  return new Promise(resolve => {
    resolve(window.confirm(message));
    /* 🔧 CUSTOMIZE: Custom modal diye replace korte parbe */
  });
}


/* ============================================================
   08. COPY TO CLIPBOARD
   — copyText('text') → clipboard e copy + toast show
============================================================ */
async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
    showToast('Copied to clipboard!', 'success', 2000);
  } catch {
    showToast('Failed to copy', 'error', 2000);
  }
}


/* ============================================================
   09. NUMBER FORMAT HELPER
   — formatNum(1234567) → "1,234,567"
   — formatCurrency(12.5) → "$12.50"
============================================================ */
function formatNum(n) {
  return Number(n).toLocaleString();
}

function formatCurrency(n, symbol = '$') {
  return `${symbol}${Number(n).toFixed(2)}`;
}


/* ============================================================
   10. DATE FORMAT HELPER
   — formatDate('2024-01-15') → "Jan 15, 2024"
   — formatDateTime → includes time
============================================================ */
function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

function formatDateTime(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}
