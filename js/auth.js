/* ============================================================
   V1PER X SHOP — Auth Modal JavaScript
   File: auth.js

   TABLE OF CONTENTS:
   01. Modal Open / Close
   02. Tab Switcher (Login ↔ Register)
   03. Password Show / Hide Toggle
   04. Password Strength Meter
   05. Form Validation
   06. Login Form Submit
   07. Register Form Submit
   08. Forgot Password
   09. Google Login (placeholder)
   10. Helper Utilities
   ============================================================ */


/* ============================================================
   01. MODAL OPEN / CLOSE
   — openAuthModal('login') ba openAuthModal('register') call koro
   — Overlay te click korle close hoy
   — ESC key press e close hoy
   — Body scroll lock hoy modal open hole
============================================================ */

const modalOverlay = document.getElementById('authModalOverlay');
const authModal    = document.getElementById('authModal');

/* Modal khola — tab specify korte paro: 'login' or 'register' */
function openAuthModal(tab = 'login') {
  modalOverlay.classList.add('active');
  document.body.style.overflow = 'hidden'; /* Scroll lock */
  switchTab(tab); /* Specified tab e shuru hobe */
}

/* Modal banda */
function closeAuthModal() {
  modalOverlay.classList.remove('active');
  document.body.style.overflow = ''; /* Scroll unlock */
  clearAllMessages(); /* Sob error/success clear koro */
}

/* Overlay (background) click e close */
modalOverlay.addEventListener('click', (e) => {
  if (e.target === modalOverlay) closeAuthModal();
});

/* ESC key e close */
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && modalOverlay.classList.contains('active')) {
    closeAuthModal();
  }
});

/* Close button (X) */
document.getElementById('authCloseBtn').addEventListener('click', closeAuthModal);


/* ============================================================
   02. TAB SWITCHER (Login ↔ Register)
   — switchTab('login') or switchTab('register')
   — HTML e onclick="switchTab('register')" use kora hoyeche
============================================================ */

const loginTab     = document.getElementById('loginTab');
const registerTab  = document.getElementById('registerTab');
const loginPanel   = document.getElementById('loginForm');
const registerPanel = document.getElementById('registerForm');

function switchTab(tab) {
  clearAllMessages();

  if (tab === 'login') {
    /* Login tab active koro */
    loginTab.classList.add('tab-active');
    registerTab.classList.remove('tab-active');

    /* Login panel show, register hide */
    loginPanel.classList.add('form-panel-active');
    registerPanel.classList.remove('form-panel-active');

  } else {
    /* Register tab active koro */
    registerTab.classList.add('tab-active');
    loginTab.classList.remove('tab-active');

    /* Register panel show, login hide */
    registerPanel.classList.add('form-panel-active');
    loginPanel.classList.remove('form-panel-active');
  }
}

/* Tab button clicks */
loginTab.addEventListener('click',    () => switchTab('login'));
registerTab.addEventListener('click', () => switchTab('register'));


/* ============================================================
   03. PASSWORD SHOW / HIDE TOGGLE
   — Eye icon click e password visible/hidden toggle
============================================================ */

function togglePassword(inputId, toggleBtn) {
  const input = document.getElementById(inputId);
  const isHidden = input.type === 'password';

  input.type = isHidden ? 'text' : 'password';
  toggleBtn.textContent = isHidden ? '🙈' : '👁️';
}

/* Setup all password toggles */
document.querySelectorAll('[data-toggle-pw]').forEach(btn => {
  btn.addEventListener('click', () => {
    const targetId = btn.getAttribute('data-toggle-pw');
    togglePassword(targetId, btn);
  });
});


/* ============================================================
   04. PASSWORD STRENGTH METER (Register form)
   — Password type korle live strength check hoy
   — Weak / Medium / Strong
============================================================ */

const regPasswordInput = document.getElementById('regPassword');
const strengthBars     = document.querySelectorAll('.strength-bar');
const strengthLabel    = document.getElementById('strengthLabel');

if (regPasswordInput) {
  regPasswordInput.addEventListener('input', () => {
    const val      = regPasswordInput.value;
    const strength = checkPasswordStrength(val);
    updateStrengthUI(strength);
  });
}

/* Password strength logic */
function checkPasswordStrength(password) {
  if (password.length === 0) return 0;

  let score = 0;
  if (password.length >= 8)              score++; /* Length */
  if (/[A-Z]/.test(password))            score++; /* Uppercase */
  if (/[0-9]/.test(password))            score++; /* Number */
  if (/[^A-Za-z0-9]/.test(password))    score++; /* Special char */

  if (score <= 1) return 1; /* Weak */
  if (score <= 2) return 2; /* Medium */
  return 3;                 /* Strong */
}

/* Strength bar UI update */
function updateStrengthUI(level) {
  const labels  = ['', 'Weak 😟', 'Medium 🙂', 'Strong 💪'];
  const classes = ['', 'weak',    'medium',     'strong'];
  const colors  = ['', '#ef4444', '#f59e0b',    '#22c55e'];

  strengthBars.forEach((bar, i) => {
    bar.className = 'strength-bar';
    if (i < level) bar.classList.add(classes[level]);
  });

  if (strengthLabel) {
    strengthLabel.textContent = regPasswordInput.value ? labels[level] : '';
    strengthLabel.style.color = colors[level];
  }
}


/* ============================================================
   05. FORM VALIDATION
   — Input validate kora + error message show/hide
============================================================ */

/* Single field validate */
function validateField(input, rules) {
  const group    = input.closest('.form-group');
  const errorEl  = group?.querySelector('.field-error');
  const value    = input.value.trim();
  let   errorMsg = '';

  /* Required check */
  if (rules.required && !value) {
    errorMsg = `${rules.label || 'This field'} is required`;
  }
  /* Email format */
  else if (rules.email && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
    errorMsg = 'Please enter a valid email address';
  }
  /* Min length */
  else if (rules.minLength && value.length < rules.minLength) {
    errorMsg = `Minimum ${rules.minLength} characters required`;
  }
  /* Match another field */
  else if (rules.match) {
    const matchInput = document.getElementById(rules.match);
    if (matchInput && value !== matchInput.value) {
      errorMsg = 'Passwords do not match';
    }
  }

  /* UI update */
  if (errorMsg) {
    group?.classList.add('has-error');
    group?.classList.remove('has-success');
    if (errorEl) {
      errorEl.textContent = errorMsg;
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

/* Clear all validation states and messages */
function clearAllMessages() {
  document.querySelectorAll('.form-group').forEach(g => {
    g.classList.remove('has-error', 'has-success');
    const err = g.querySelector('.field-error');
    if (err) err.classList.remove('visible');
  });
  document.querySelectorAll('.auth-message').forEach(m => m.classList.remove('show'));
  /* Reset inputs */
  document.querySelectorAll('.form-input').forEach(i => i.value = '');
  /* Reset password strength */
  strengthBars.forEach(b => { b.className = 'strength-bar'; });
  if (strengthLabel) strengthLabel.textContent = '';
}

/* Show global message inside modal */
function showAuthMessage(formId, type, text) {
  const msgEl = document.querySelector(`#${formId} .auth-message`);
  if (!msgEl) return;
  msgEl.className = `auth-message show ${type}`;
  msgEl.innerHTML = `${type === 'success' ? '✅' : '❌'} ${text}`;
}


/* ============================================================
   06. LOGIN FORM SUBMIT
   — Validate → Loading → API call (placeholder)
   — Customize: fetch() call diye real API connect koro
============================================================ */

document.getElementById('loginForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const emailInput = document.getElementById('loginEmail');
  const passInput  = document.getElementById('loginPassword');
  const submitBtn  = document.getElementById('loginSubmitBtn');

  /* Validate */
  const emailOk = validateField(emailInput,  { required: true, email: true, label: 'Email' });
  const passOk  = validateField(passInput,   { required: true, minLength: 6, label: 'Password' });

  if (!emailOk || !passOk) return;

  /* Loading state */
  submitBtn.classList.add('loading');
  submitBtn.textContent = 'Logging in...';

  try {
    /* =====================================================
       🔧 REAL API CALL EKHANE KORTE HOBE:
       
       const res = await fetch('/api/login', {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify({
           email: emailInput.value,
           password: passInput.value
         })
       });
       const data = await res.json();
       if (!res.ok) throw new Error(data.message || 'Login failed');
       
    ===================================================== */

    /* Demo: 1.5s delay simulate kore */
    await new Promise(r => setTimeout(r, 1500));

    /* Success */
    showAuthMessage('loginForm', 'success', 'Login successful! Welcome back 🎮');
    setTimeout(() => closeAuthModal(), 2000);

  } catch (err) {
    /* Error handling */
    showAuthMessage('loginForm', 'error', err.message || 'Login failed. Please try again.');
    authModal.classList.add('shake');
    setTimeout(() => authModal.classList.remove('shake'), 500);

  } finally {
    submitBtn.classList.remove('loading');
    submitBtn.innerHTML = '→ Login';
  }
});


/* ============================================================
   07. REGISTER FORM SUBMIT
   — Validate all fields → API call
   — Customize: fetch() call diye real API connect koro
============================================================ */

document.getElementById('registerForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const nameInput      = document.getElementById('regName');
  const emailInput     = document.getElementById('regEmail');
  const passInput      = document.getElementById('regPassword');
  const confirmInput   = document.getElementById('regConfirm');
  const submitBtn      = document.getElementById('registerSubmitBtn');

  /* Validate all fields */
  const nameOk    = validateField(nameInput,    { required: true, label: 'Username', minLength: 3 });
  const emailOk   = validateField(emailInput,   { required: true, email: true, label: 'Email' });
  const passOk    = validateField(passInput,     { required: true, minLength: 6, label: 'Password' });
  const confirmOk = validateField(confirmInput,  { required: true, match: 'regPassword', label: 'Confirm Password' });

  if (!nameOk || !emailOk || !passOk || !confirmOk) return;

  /* Loading state */
  submitBtn.classList.add('loading');
  submitBtn.textContent = 'Creating account...';

  try {
    /* =====================================================
       🔧 REAL API CALL EKHANE KORTE HOBE:
       
       const res = await fetch('/api/register', {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify({
           username: nameInput.value,
           email: emailInput.value,
           password: passInput.value
         })
       });
       const data = await res.json();
       if (!res.ok) throw new Error(data.message || 'Registration failed');
       
    ===================================================== */

    /* Demo: 1.5s delay */
    await new Promise(r => setTimeout(r, 1500));

    /* Success → auto switch to login */
    showAuthMessage('registerForm', 'success', 'Account created! Please login now 🎉');
    setTimeout(() => switchTab('login'), 2200);

  } catch (err) {
    showAuthMessage('registerForm', 'error', err.message || 'Registration failed. Try again.');
    authModal.classList.add('shake');
    setTimeout(() => authModal.classList.remove('shake'), 500);

  } finally {
    submitBtn.classList.remove('loading');
    submitBtn.innerHTML = '🎮 Create Account';
  }
});


/* ============================================================
   08. FORGOT PASSWORD
   — Click e simple modal/notify show kore
   — Customize: real reset flow ekhane add koro
============================================================ */

document.getElementById('forgotPasswordBtn').addEventListener('click', () => {
  const email = document.getElementById('loginEmail').value.trim();

  if (!email) {
    /* Email na dile field highlight koro */
    validateField(document.getElementById('loginEmail'), { required: true, label: 'Email' });
    return;
  }

  /* Placeholder — real API call ekhane */
  showAuthMessage('loginForm', 'success', `Password reset link sent to ${email} 📧`);
});


/* ============================================================
   09. GOOGLE LOGIN (Placeholder)
   — Real Google OAuth integration er jonno
   — Google One Tap or Firebase auth use korte paro
============================================================ */

document.querySelectorAll('.btn-google').forEach(btn => {
  btn.addEventListener('click', () => {
    /* 🔧 CUSTOMIZE: Real Google OAuth ekhane */
    if (typeof notify === 'function') {
      notify('Google login integration coming soon! 🔔');
    } else {
      alert('Google login coming soon!');
    }
  });
});


/* ============================================================
   10. HELPER — Live validation on blur
   — Input theke focus sore gele validate hoy
============================================================ */

/* Login form live validation */
document.getElementById('loginEmail')?.addEventListener('blur', function() {
  validateField(this, { required: true, email: true, label: 'Email' });
});
document.getElementById('loginPassword')?.addEventListener('blur', function() {
  validateField(this, { required: true, minLength: 6, label: 'Password' });
});

/* Register form live validation */
document.getElementById('regName')?.addEventListener('blur', function() {
  validateField(this, { required: true, minLength: 3, label: 'Username' });
});
document.getElementById('regEmail')?.addEventListener('blur', function() {
  validateField(this, { required: true, email: true, label: 'Email' });
});
document.getElementById('regPassword')?.addEventListener('blur', function() {
  validateField(this, { required: true, minLength: 6, label: 'Password' });
});
document.getElementById('regConfirm')?.addEventListener('blur', function() {
  validateField(this, { required: true, match: 'regPassword', label: 'Confirm Password' });
});
