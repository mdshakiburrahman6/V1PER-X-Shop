/* ============================================================
   V1PER X SHOP — Main JavaScript
   File: script.js

   TABLE OF CONTENTS:
   01. Theme Toggle (Dark / Light Mode)
   02. Hamburger Mobile Menu
   03. Scroll To Top Button
   04. Notification Toast
   05. Hero Particle Dots (Canvas-free floating dots)
   06. Hero Slider Dots (Auto-rotate)
   07. Category Filter (Product grid filter)
   08. Scroll Reveal Animation (IntersectionObserver)
   ============================================================ */


/* ============================================================
   01. THEME TOGGLE
   — Dark/Light mode switch
   — HTML element er data-theme attribute change kore
   — Button emoji o change hoy: 🌙 ↔ ☀️
   — Customize: localStorage e save korte parbe (ektu niche comment e dekhano ache)
   ============================================================ */
const html      = document.documentElement;
const themeBtn  = document.getElementById('themeToggle');
let   isDark    = true; /* Default theme: dark */

themeBtn.addEventListener('click', () => {
  isDark = !isDark;
  html.setAttribute('data-theme', isDark ? 'dark' : 'light');
  themeBtn.textContent = isDark ? '🌙' : '☀️';

  /* Optional: Theme preference localStorage e save korte uncomment koro
  localStorage.setItem('viper-theme', isDark ? 'dark' : 'light');
  */
});

/* Optional: Page load e saved theme restore korte uncomment koro
const savedTheme = localStorage.getItem('viper-theme');
if (savedTheme) {
  isDark = savedTheme === 'dark';
  html.setAttribute('data-theme', savedTheme);
  themeBtn.textContent = isDark ? '🌙' : '☀️';
}
*/


/* ============================================================
   02. HAMBURGER MOBILE MENU
   — Mobile e header hamburger icon click korle menu toggle
   — .active class hamburger animation er jonno
   — .open class mobile menu show/hide er jonno
   — closeMobile() HTML e onclick e call kora hoyeche
   ============================================================ */
const hamburgerBtn = document.getElementById('hamburger');
const mobileMenu   = document.getElementById('mobileMenu');

hamburgerBtn.addEventListener('click', () => {
  hamburgerBtn.classList.toggle('active');
  mobileMenu.classList.toggle('open');
});

/* Mobile menu link click korle menu band hobe */
function closeMobile() {
  hamburgerBtn.classList.remove('active');
  mobileMenu.classList.remove('open');
}

/* Page e click korle (menu er baire) menu close koro */
document.addEventListener('click', (e) => {
  if (
    mobileMenu.classList.contains('open') &&
    !mobileMenu.contains(e.target) &&
    !hamburgerBtn.contains(e.target)
  ) {
    closeMobile();
  }
});


/* ============================================================
   03. SCROLL TO TOP BUTTON
   — 400px scroll er pore button visible hobe
   — Button click korle top e smooth scroll
   — Customize: 400 change kore threshold adjust koro
   ============================================================ */
const scrollTopBtn = document.getElementById('scrollTop');

window.addEventListener('scroll', () => {
  const showAfterPx = 400; /* এই value change kore threshold adjust koro */
  scrollTopBtn.classList.toggle('visible', window.scrollY > showAfterPx);
});

scrollTopBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});


/* ============================================================
   04. NOTIFICATION TOAST
   — Buy/Demo click e top-right e popup dekha dey
   — 2800ms por automatically hide hoy
   — Call: notify('Tomar message ekhane') 
   — Customize: duration change korte notifDuration value badao
   ============================================================ */
let notifTimer;
const notifDuration = 2800; /* milliseconds — koto kshen dekhabe */

function notify(message) {
  const notifEl   = document.getElementById('notification');
  const notifText = document.getElementById('notifText');

  notifText.textContent = message;
  notifEl.classList.add('show');

  /* Previous timer clear kore new timer set koro */
  clearTimeout(notifTimer);
  notifTimer = setTimeout(() => {
    notifEl.classList.remove('show');
  }, notifDuration);
}


/* ============================================================
   05. HERO PARTICLE DOTS
   — Hero section e random floating colored dots
   — Pure JS diye DOM e div create kora hoy (no canvas)
   — Customize:
       particleCount  = kototgulo dot dekhabe
       particleColors = ki ki color er dot hobe
   ============================================================ */
(function createParticles() {
  const container     = document.getElementById('particles');
  const particleCount = 20; /* Dot er sankhya */
  const particleColors = [
    '#f97316', /* Orange (accent) */
    '#06b6d4', /* Cyan */
    '#f59e0b', /* Gold */
    '#22c55e', /* Green */
  ];

  for (let i = 0; i < particleCount; i++) {
    const dot = document.createElement('div');
    dot.className = 'particle';

    /* Random position */
    dot.style.left = Math.random() * 100 + '%';
    dot.style.top  = Math.random() * 100 + '%';

    /* Random animation timing */
    dot.style.animationDelay    = Math.random() * 8 + 's';
    dot.style.animationDuration = (4 + Math.random() * 6) + 's';

    /* Random color from palette */
    const randomColor = particleColors[Math.floor(Math.random() * particleColors.length)];
    dot.style.background = randomColor;

    container.appendChild(dot);
  }
})();


/* ============================================================
   06. HERO SLIDER DOTS
   — Hero section er niche 3ta dot auto-rotate hoy
   — .active class diye active dot highlighted thake
   — Customize:
       dotInterval = koto millisecond por dot switch hobe
   ============================================================ */
const sliderDots  = document.querySelectorAll('.dot');
let   activeDot   = 0;
const dotInterval = 3000; /* 3 second */

if (sliderDots.length > 0) {
  setInterval(() => {
    sliderDots[activeDot].classList.remove('active');
    activeDot = (activeDot + 1) % sliderDots.length;
    sliderDots[activeDot].classList.add('active');
  }, dotInterval);

  /* Manual dot click e switch */
  sliderDots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      sliderDots[activeDot].classList.remove('active');
      activeDot = index;
      dot.classList.add('active');
    });
  });
}


/* ============================================================
   07. CATEGORY FILTER
   — "All / Non Root / Root / iPhone / PC" button click e
     respective product grid show/hide hoy
   — filterCat() HTML er onclick e call kora hoyeche
   — Customize: notun category add korte HTML e product card e
     data-category="newcat" add koro
   ============================================================ */
function filterCat(clickedBtn, selectedCat) {
  /* Sab button theke active class remove koro */
  document.querySelectorAll('.cat-btn').forEach(btn => btn.classList.remove('active'));

  /* Clicked button active koro */
  clickedBtn.classList.add('active');

  const allGrids   = document.querySelectorAll('.product-grid');
  const allHeaders = document.querySelectorAll('.section-header[data-cat]');

  if (selectedCat === 'all') {
    /* Sob kicchu show koro */
    allGrids.forEach(grid     => grid.style.display = '');
    allHeaders.forEach(header => header.style.display = '');
    document.querySelectorAll('.product-card').forEach(card => card.style.display = '');
  } else {
    /* Selected category match kora grid show, baki hide */
    allGrids.forEach((grid, i) => {
      if (grid.getAttribute('data-cat') === selectedCat) {
        grid.style.display = 'grid';
        if (allHeaders[i]) allHeaders[i].style.display = '';
        grid.querySelectorAll('.product-card').forEach(card => card.style.display = '');
      } else {
        grid.style.display = 'none';
        if (allHeaders[i]) allHeaders[i].style.display = 'none';
      }
    });
  }
}


/* ============================================================
   08. SCROLL REVEAL ANIMATION
   — Page scroll korle cards fade+slide up kore appear kore
   — IntersectionObserver use kora hoyeche (performance friendly)
   — Customize:
       revealThreshold = koto % visible hole trigger hobe (0.0 - 1.0)
       revealDelay     = notun cards er jonno stagger delay add korte
   ============================================================ */
const revealThreshold = 0.1; /* 10% visible hole trigger */

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity   = '1';
      entry.target.style.transform = 'translateY(0)';
      /* Ek bar reveal hole observer unobserve koro (performance) */
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: revealThreshold });

/* Kono kono card reveal korbe setar selector ekhane */
document.querySelectorAll('.product-card, .feature-card, .testimonial-card').forEach(card => {
  card.style.opacity   = '0';
  card.style.transform = 'translateY(24px)';
  card.style.transition = [
    'opacity 0.5s ease',
    'transform 0.5s ease',
    'border-color 0.3s ease',
    'box-shadow 0.3s ease',
  ].join(', ');
  revealObserver.observe(card);
});
