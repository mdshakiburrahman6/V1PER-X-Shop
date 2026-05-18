/* ============================================================
   V1PER X SHOP — Admin Shared JavaScript
   File: admin.js

   TABLE OF CONTENTS:
   01. Theme Toggle
   02. Sidebar Toggle (Mobile)
   03. Collapsible Nav Groups
   04. Scroll Reveal
   05. Toast Notification
   06. Modal Open / Close
   07. Confirm Delete Dialog
   08. Table Checkbox (Select All)
   09. Tag Input (Chips)
   10. Image Upload Preview
   11. Search & Filter Helper
   12. Inline Alert
   13. Form Validation
   14. Helpers (format, copy, debounce)
   ============================================================ */


/* ============================================================
   01. THEME TOGGLE
   — localStorage e save hoy
============================================================ */
const html    = document.documentElement;
const themBtn = document.getElementById('themeToggle');

const saved = localStorage.getItem('viper-theme') || 'dark';
html.setAttribute('data-theme', saved);
if (themBtn) themBtn.textContent = saved === 'dark' ? '🌙' : '☀️';

themBtn?.addEventListener('click', () => {
  const next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  html.setAttribute('data-theme', next);
  themBtn.textContent = next === 'dark' ? '🌙' : '☀️';
  localStorage.setItem('viper-theme', next);
});


/* ============================================================
   02. SIDEBAR TOGGLE (Mobile)
============================================================ */
const sidebar  = document.getElementById('adminSidebar');
const overlay  = document.getElementById('sidebarOverlay');
const menuBtn  = document.getElementById('mobileMenuBtn');

function openSidebar()  { sidebar?.classList.add('open'); overlay?.classList.add('active'); document.body.style.overflow = 'hidden'; }
function closeSidebar() { sidebar?.classList.remove('open'); overlay?.classList.remove('active'); document.body.style.overflow = ''; }

menuBtn?.addEventListener('click', () => sidebar?.classList.contains('open') ? closeSidebar() : openSidebar());
overlay?.addEventListener('click', closeSidebar);

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') { closeSidebar(); closeAllModals(); }
});


/* ============================================================
   03. COLLAPSIBLE NAV GROUPS
   — .nav-group-btn click e .nav-sub toggle hoy
============================================================ */
document.querySelectorAll('.nav-group-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const sub = btn.nextElementSibling;
    const isOpen = sub?.classList.contains('open');
    btn.classList.toggle('open', !isOpen);
    sub?.classList.toggle('open', !isOpen);
  });

  /* Auto-open if child is active */
  const sub = btn.nextElementSibling;
  if (sub?.querySelector('.nav-item.active')) {
    btn.classList.add('open');
    sub.classList.add('open');
  }
});


/* ============================================================
   04. SCROLL REVEAL
============================================================ */
const revealObs = new IntersectionObserver(entries => {
  entries.forEach((e, i) => {
    if (e.isIntersecting) {
      setTimeout(() => e.target.classList.add('in'), i * 55);
      revealObs.unobserve(e.target);
    }
  });
}, { threshold: 0.07 });

document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));


/* ============================================================
   05. TOAST NOTIFICATION
   — showToast('message', 'success'|'error'|'info'|'warning')
============================================================ */
let _toastTimer;

function showToast(msg, type = 'success', dur = 3400) {
  document.getElementById('_adminToast')?.remove();
  const icons = { success:'✅', error:'❌', info:'ℹ️', warning:'⚠️' };
  const clrs  = { success:'var(--admin-green)', error:'var(--admin-red)', info:'var(--admin-cyan)', warning:'var(--admin-accent2)' };

  const t = document.createElement('div');
  t.id = '_adminToast';
  t.style.cssText = `
    position:fixed; top:76px; right:18px; z-index:9999;
    background:var(--card); border:1px solid ${clrs[type]};
    border-radius:10px; padding:11px 16px;
    display:flex; align-items:center; gap:10px;
    font-family:var(--font-ui); font-size:13px; font-weight:500; color:var(--text);
    box-shadow:var(--shadow); min-width:230px; max-width:350px;
    transform:translateX(120%); transition:transform 0.32s cubic-bezier(.4,0,.2,1);
  `;
  t.innerHTML = `<span style="font-size:16px">${icons[type]}</span><span style="flex:1">${msg}</span>
    <span onclick="this.parentElement.remove()" style="cursor:pointer;opacity:.5;font-size:15px;padding:0 3px">✕</span>`;
  document.body.appendChild(t);
  requestAnimationFrame(() => { t.style.transform = 'translateX(0)'; });
  clearTimeout(_toastTimer);
  _toastTimer = setTimeout(() => { t.style.transform = 'translateX(120%)'; setTimeout(() => t.remove(), 380); }, dur);
}


/* ============================================================
   06. MODAL OPEN / CLOSE
   — openModal('id') / closeModal('id') / closeAllModals()
============================================================ */
function openModal(id)  { const m = document.getElementById(id); if(!m) return; m.classList.add('active'); document.body.style.overflow='hidden'; }
function closeModal(id) { const m = document.getElementById(id); if(!m) return; m.classList.remove('active'); document.body.style.overflow=''; }
function closeAllModals() { document.querySelectorAll('.modal-overlay.active').forEach(m => m.classList.remove('active')); document.body.style.overflow=''; }

document.querySelectorAll('.modal-overlay').forEach(ov => {
  ov.addEventListener('click', e => { if(e.target === ov) { ov.classList.remove('active'); document.body.style.overflow=''; } });
});
document.querySelectorAll('.modal-close').forEach(btn => btn.addEventListener('click', closeAllModals));


/* ============================================================
   07. CONFIRM DELETE DIALOG
   — confirmDel('Are you sure?') → Promise<boolean>
============================================================ */
function confirmDel(msg = 'Delete this item? This cannot be undone.') {
  return new Promise(resolve => resolve(window.confirm(msg)));
}


/* ============================================================
   08. TABLE CHECKBOX (Select All)
   — #selectAll checkbox → all .row-check toggle
   — Bulk action bar show/hide
============================================================ */
const selectAll = document.getElementById('selectAll');
const bulkBar   = document.getElementById('bulkBar');
const bulkCount = document.getElementById('bulkCount');

function updateBulkBar() {
  const checked = document.querySelectorAll('.row-check:checked');
  if (bulkBar) {
    bulkBar.classList.toggle('show', checked.length > 0);
    if (bulkCount) bulkCount.textContent = checked.length;
  }
}

selectAll?.addEventListener('change', () => {
  document.querySelectorAll('.row-check').forEach(c => { c.checked = selectAll.checked; });
  updateBulkBar();
});

document.querySelectorAll('.row-check').forEach(c => {
  c.addEventListener('change', () => {
    const all   = document.querySelectorAll('.row-check');
    const chkd  = document.querySelectorAll('.row-check:checked');
    if (selectAll) selectAll.indeterminate = chkd.length > 0 && chkd.length < all.length;
    if (selectAll) selectAll.checked = chkd.length === all.length;
    updateBulkBar();
  });
});

/* Clear selection */
function clearSelection() {
  document.querySelectorAll('.row-check, #selectAll').forEach(c => c.checked = false);
  if (selectAll) selectAll.indeterminate = false;
  updateBulkBar();
}


/* ============================================================
   09. TAG INPUT (Chips)
   — initTagInput('wrapperId', 'hiddenInputId')
   — Enter / comma press korle chip create hoy
============================================================ */
function initTagInput(wrapId, hiddenId) {
  const wrap   = document.getElementById(wrapId);
  const hidden = document.getElementById(hiddenId);
  if (!wrap || !hidden) return;

  const field = wrap.querySelector('.tag-input-field');
  let   tags  = hidden.value ? hidden.value.split(',').map(t=>t.trim()).filter(Boolean) : [];

  function renderTags() {
    /* Remove old chips */
    wrap.querySelectorAll('.tag-chip').forEach(c => c.remove());
    tags.forEach((tag, i) => {
      const chip = document.createElement('span');
      chip.className = 'tag-chip';
      chip.innerHTML = `${tag}<button class="tag-chip-rm" data-i="${i}">✕</button>`;
      wrap.insertBefore(chip, field);
    });
    hidden.value = tags.join(',');
  }

  function addTag(raw) {
    const t = raw.trim().replace(/,/g,'');
    if (t && !tags.includes(t)) { tags.push(t); renderTags(); }
    if (field) field.value = '';
  }

  field?.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); addTag(field.value); }
    if (e.key === 'Backspace' && !field.value && tags.length) { tags.pop(); renderTags(); }
  });

  field?.addEventListener('blur', () => { if (field.value.trim()) addTag(field.value); });

  wrap.addEventListener('click', e => {
    if (e.target.classList.contains('tag-chip-rm')) {
      tags.splice(parseInt(e.target.dataset.i), 1);
      renderTags();
    }
    field?.focus();
  });

  renderTags();
}


/* ============================================================
   10. IMAGE UPLOAD PREVIEW
   — initImageUpload('areaId', 'previewGridId')
============================================================ */
function initImageUpload(areaId, gridId) {
  const area = document.getElementById(areaId);
  const grid = document.getElementById(gridId);
  if (!area || !grid) return;

  const input = area.querySelector('input[type="file"]');

  input?.addEventListener('change', () => handleFiles(input.files));

  area.addEventListener('dragover', e => { e.preventDefault(); area.classList.add('dragover'); });
  area.addEventListener('dragleave', ()  => area.classList.remove('dragover'));
  area.addEventListener('drop', e => {
    e.preventDefault(); area.classList.remove('dragover');
    handleFiles(e.dataTransfer.files);
  });

  function handleFiles(files) {
    Array.from(files).forEach(file => {
      if (!file.type.startsWith('image/')) return;
      const reader = new FileReader();
      reader.onload = ev => {
        const item = document.createElement('div');
        item.className = 'img-prev-item';
        item.innerHTML = `<img src="${ev.target.result}" alt="Preview"/><button class="img-prev-rm">✕</button>`;
        item.querySelector('.img-prev-rm').onclick = () => item.remove();
        grid.appendChild(item);
      };
      reader.readAsDataURL(file);
    });
  }
}


/* ============================================================
   11. SEARCH & FILTER HELPER
   — filterTable('tableBodyId', searchVal, colIndex)
   — colIndex = which column to search (0-based, skip checkbox)
============================================================ */
function filterTable(bodyId, searchVal, colIndex = 1) {
  const body = document.getElementById(bodyId);
  if (!body) return;
  const q = searchVal.toLowerCase().trim();
  let visible = 0;
  body.querySelectorAll('tr').forEach(row => {
    const cell = row.cells[colIndex];
    const match = !q || (cell?.textContent.toLowerCase().includes(q));
    row.style.display = match ? '' : 'none';
    if (match) visible++;
  });
  return visible;
}

/* Filter by select dropdown value */
function filterBySelect(bodyId, val, colIndex) {
  const body = document.getElementById(bodyId);
  if (!body) return;
  body.querySelectorAll('tr').forEach(row => {
    const cell = row.cells[colIndex];
    const match = !val || cell?.textContent.includes(val);
    row.style.display = match ? '' : 'none';
  });
}


/* ============================================================
   12. INLINE ALERT
   — showAlert('alertId', 'success'|'error'|'info', 'message')
   — hideAlert('alertId')
============================================================ */
function showAlert(id, type, msg) {
  const el = document.getElementById(id);
  if (!el) return;
  el.className = `alert alert-${type}`;
  el.innerHTML = `<span>${{success:'✅',error:'❌',info:'ℹ️',warn:'⚠️'}[type]||'ℹ️'}</span> ${msg}`;
  el.classList.remove('hidden');
  if (type === 'success') setTimeout(() => el.classList.add('hidden'), 4500);
}

function hideAlert(id) { document.getElementById(id)?.classList.add('hidden'); }


/* ============================================================
   13. FORM VALIDATION
   — validateField(inputEl, rules) → true/false
   — rules: { required, minLength, maxLength, email, label }
============================================================ */
function validateField(input, rules = {}) {
  const grp = input.closest('.form-group');
  const err = grp?.querySelector('.field-error');
  const val = input.value.trim();
  let   msg = '';

  if (rules.required && !val)                                          msg = `${rules.label || 'Field'} is required`;
  else if (rules.email && val && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) msg = 'Invalid email address';
  else if (rules.minLength && val.length < rules.minLength)            msg = `Min ${rules.minLength} characters`;
  else if (rules.maxLength && val.length > rules.maxLength)            msg = `Max ${rules.maxLength} characters`;
  else if (rules.min !== undefined && parseFloat(val) < rules.min)     msg = `Minimum value: ${rules.min}`;

  if (msg) {
    grp?.classList.add('has-error'); grp?.classList.remove('has-success');
    if (err) { err.textContent = '⚠️ ' + msg; err.classList.add('show'); }
    return false;
  } else {
    grp?.classList.remove('has-error');
    if (val) grp?.classList.add('has-success');
    if (err) err.classList.remove('show');
    return true;
  }
}

function clearValidation() {
  document.querySelectorAll('.form-group').forEach(g => {
    g.classList.remove('has-error','has-success');
    g.querySelector('.field-error')?.classList.remove('show');
  });
}


/* ============================================================
   14. HELPERS
============================================================ */
/* Copy text to clipboard */
async function copyText(text) {
  try { await navigator.clipboard.writeText(text); showToast('Copied!','success',1800); }
  catch { showToast('Copy failed','error',1800); }
}

/* Format number with commas */
function fmtNum(n) { return Number(n).toLocaleString(); }

/* Format currency */
function fmtCur(n, sym='$') { return `${sym}${Number(n).toFixed(2)}`; }

/* Format date */
function fmtDate(d) { return new Date(d).toLocaleDateString('en-US',{year:'numeric',month:'short',day:'numeric'}); }

/* Debounce */
function debounce(fn, ms=300) { let t; return (...a) => { clearTimeout(t); t=setTimeout(()=>fn(...a),ms); }; }

/* Generate random ID */
function randId(prefix='ADM') { return `${prefix}-${Date.now().toString(36).toUpperCase()}`; }

/* Slugify string */
function slugify(str) { return str.toLowerCase().replace(/\s+/g,'-').replace(/[^a-z0-9-]/g,''); }
