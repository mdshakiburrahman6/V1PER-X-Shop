/* ============================================================
   V1PER X SHOP — Auth Pages Shared JavaScript
   File: auth-script.js

   TABLE OF CONTENTS:
   01. Theme Toggle (Dark / Light)
   02. Password Show / Hide Toggle
   03. Password Strength Meter
   04. Form Validation
   05. Show Alert Message
   06. Google Login (Placeholder)
   07. Shake Animation Helper
   ============================================================ */


/* ============================================================
   01. THEME TOGGLE
   — Dark/Light mode switch
   — localStorage e save hoy, page reload e persist kore
   — Customize: default theme change korte 'dark' → 'light'
============================================================ */
const html     = document.documentElement;
const themeBtn = document.getElementById('themeToggle');

/* Saved theme load koro (default: dark) */
const savedTheme = localStorage.getItem('viper-theme') || 'dark';
html.setAttribute('data-theme', savedTheme);
if (themeBtn) themeBtn.textContent = savedTheme === 'dark' ? '🌙' : '☀️';

/* Toggle on click */
themeBtn?.addEventListener('click', () => {
  const current = html.getAttribute('data-theme');
  const next    = current === 'dark' ? 'light' : 'dark';
  html.setAttribute('data-theme', next);
  themeBtn.textContent = next === 'dark' ? '🌙' : '☀️';
  localStorage.setItem('viper-theme', next);
});


/* ============================================================
   02. PASSWORD SHOW / HIDE TOGGLE
   — data-toggle-pw="inputId" attribute diye button e set kora hoy
   — Click korle password text/password type toggle hoy
============================================================ */
document.querySelectorAll('[data-toggle-pw]').forEach(btn => {
  btn.addEventListener('click', () => {
    const inputId = btn.getAttribute('data-toggle-pw');
    const input   = document.getElementById(inputId);
    if (!input) return;

    const isHidden    = input.type === 'password';
    input.type        = isHidden ? 'text' : 'password';
    btn.textContent   = isHidden ? '🙈' : '👁️';
  });
});


/* ============================================================
   03. PASSWORD STRENGTH METER
   — #strengthInput id er input watch kore
   — 3 ta .strength-bar fill kore level onujayi
   — #strengthText span e label dekhay
   — Customize: rules change korte checkStrength() edit koro
============================================================ */
const strengthInput = document.getElementById('strengthInput');
const strengthBars  = document.querySelectorAll('.strength-bar');
const strengthText  = document.getElementById('strengthText');

if (strengthInput) {
  strengthInput.addEventListener('input', () => {
    const level = checkStrength(strengthInput.value);
    renderStrength(level);
  });
}

/* Strength check logic */
function checkStrength(pw) {
  if (!pw) return 0;
  let score = 0;
  if (pw.length >= 8)           score++; /* Min 8 chars */
  if (/[A-Z]/.test(pw))         score++; /* Uppercase letter */
  if (/[0-9]/.test(pw))         score++; /* Number */
  if (/[^A-Za-z0-9]/.test(pw)) score++; /* Special character */

  if (score <= 1) return 1; /* Weak */
  if (score <= 2) return 2; /* Medium */
  return 3;                 /* Strong */
}

/* Strength bar UI render */
function renderStrength(level) {
  const config = {
    0: { label: '',          color: '',         cls: '' },
    1: { label: 'Weak 😟',   color: '#ef4444',  cls: 'weak' },
    2: { label: 'Medium 🙂', color: '#f59e0b',  cls: 'medium' },
    3: { label: 'Strong 💪', color: '#22c55e',  cls: 'strong' },
  };

  const c = config[level] || config[0];

  strengthBars.forEach((bar, i) => {
    bar.className = 'strength-bar';
    if (i < level) bar.classList.add(c.cls);
  });

  if (strengthText) {
    strengthText.textContent = c.label;
    strengthText.style.color = c.color;
  }
}


/* ============================================================
   04. FORM VALIDATION
   — validateField(inputEl, rules) → true/false return kore
   — rules object:
       required:  true/false
       email:     true/false (email format check)
       minLength: number
       maxLength: number
       match:     'otherInputId' (confirm password er jonno)
       label:     'Field Name' (error message e use hoy)
   — Blur event e auto validate hoy (live validation)
============================================================ */

/* Validate a single field */
function validateField(input, rules = {}) {
  const group   = input.closest('.form-group');
  const errorEl = group?.querySelector('.field-error');
  const value   = input.value.trim();
  let   msg     = '';

  if (rules.required && !value) {
    msg = `${rules.label || 'This field'} is required`;
  }
  else if (rules.email && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
    msg = 'Enter a valid email address';
  }
  else if (rules.minLength && value.length < rules.minLength) {
    msg = `Minimum ${rules.minLength} characters required`;
  }
  else if (rules.maxLength && value.length > rules.maxLength) {
    msg = `Maximum ${rules.maxLength} characters allowed`;
  }
  else if (rules.match) {
    const other = document.getElementById(rules.match);
    if (other && value !== other.value) {
      msg = 'Passwords do not match';
    }
  }

  /* Apply UI state */
  if (msg) {
    group?.classList.add('has-error');
    group?.classList.remove('has-success');
    if (errorEl) {
      errorEl.textContent = '⚠️ ' + msg;
      errorEl.classList.add('visible');
    }
    return false;
  } else {
    group?.classList.remove('has-error');
    if (value) group?.classList.add('has-success');
    if (errorEl) errorEl.classList.remove('visible');
    return true;
  }
}

/* Clear all validation states */
function clearValidation() {
  document.querySelectorAll('.form-group').forEach(g => {
    g.classList.remove('has-error', 'has-success');
    const err = g.querySelector('.field-error');
    if (err) err.classList.remove('visible');
  });
}

/* Setup blur-based live validation — call once per input */
function setupLiveValidation(inputId, rules) {
  const input = document.getElementById(inputId);
  input?.addEventListener('blur', () => validateField(input, rules));
}


/* ============================================================
   05. SHOW ALERT MESSAGE
   — showAlert(type, message) — 'success' or 'error'
   — .auth-alert element lagbe page e
============================================================ */
const authAlert = document.getElementById('authAlert');

function showAlert(type, message) {
  if (!authAlert) return;

  const icon = type === 'success' ? '✅' : '❌';
  authAlert.innerHTML  = `<span class="alert-icon">${icon}</span> ${message}`;
  authAlert.className  = `auth-alert show alert-${type}`;

  /* Success hole auto-hide (5s) */
  if (type === 'success') {
    setTimeout(() => authAlert.classList.remove('show'), 5000);
  }
}

function hideAlert() {
  authAlert?.classList.remove('show');
}


/* ============================================================
   06. GOOGLE LOGIN / REGISTER (Placeholder)
   — Real integration: Google One Tap or Firebase Auth
   — Ekhane shudhu placeholder notify dekhano hoyeche
============================================================ */
document.querySelectorAll('.btn-google').forEach(btn => {
  btn.addEventListener('click', () => {
    /* 🔧 CUSTOMIZE: Google OAuth ekhane add koro
       Example with Firebase:
       import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
       const provider = new GoogleAuthProvider();
       signInWithPopup(auth, provider).then(...);
    */
    showAlert('error', 'Google login coming soon! 🔔');
  });
});


/* ============================================================
   07. SHAKE ANIMATION HELPER
   — shakeEl(element) → card/input shake kore error a
============================================================ */
function shakeEl(el) {
  if (!el) return;
  el.classList.remove('shake');
  void el.offsetWidth; /* Reflow trigger */
  el.classList.add('shake');
  setTimeout(() => el.classList.remove('shake'), 500);
}
