/**
 * TEPLOTA — main.js  (PREMIUM drop-in)
 * Scroll, animation, mobile menu, theme toggle. CMS is initialized here.
 * Only two changes vs the original: CSS import → premium.css, and the
 * default theme is now DARK.
 */
import './premium.css';
import './teplota-industrial-redesign.css';

// ─── Dark Mode Toggle ──────────────────────────────────────────────────────────
const THEME_KEY = 'tep-theme';

function applyTheme(isDark) {
  document.documentElement.classList.toggle('dark', isDark);
  const sun = document.getElementById('icon-sun');
  const moon = document.getElementById('icon-moon');
  if (sun) sun.classList.toggle('hidden', !isDark);
  if (moon) moon.classList.toggle('hidden', isDark);
  document.querySelectorAll('.mobile-icon-sun').forEach(el => el.classList.toggle('hidden', !isDark));
  document.querySelectorAll('.mobile-icon-moon').forEach(el => el.classList.toggle('hidden', isDark));
  document.querySelectorAll('img.logo').forEach(img => {
    img.src = isDark ? '/assets/logo white.svg' : '/assets/logo.svg';
  });
}

// Default theme is DARK (was: system preference)
const saved = localStorage.getItem(THEME_KEY);
applyTheme(saved ? saved === 'dark' : true);

function toggleTheme() {
  const isDark = !document.documentElement.classList.contains('dark');
  applyTheme(isDark);
  localStorage.setItem(THEME_KEY, isDark ? 'dark' : 'light');
}
document.getElementById('theme-toggle')?.addEventListener('click', toggleTheme);
document.getElementById('mobile-theme-toggle')?.addEventListener('click', toggleTheme);

// ─── Reveal Observer ──────────────────────────────────────────────────────────
const revealOptions = { threshold: 0.12, rootMargin: '0px 0px -40px 0px' };
window.revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('active');
      revealObserver.unobserve(entry.target);
    }
  });
}, revealOptions);
// Observe static reveal items present at load
document.querySelectorAll('.reveal-item').forEach(el => revealObserver.observe(el));

// ─── Header Scroll & Parallax (rAF-throttled) ───────────────────────────────
const header = document.getElementById('main-header');
const heroImg = document.getElementById('hero-bg');
let parallaxSections = null;
let scrollTicking = false;

function onScroll() {
  const scrollY = window.scrollY;
  header?.classList.toggle('scrolled', scrollY > 40);
  if (window.innerWidth < 768) { scrollTicking = false; return; }
  if (heroImg && scrollY < window.innerHeight * 1.1) heroImg.style.transform = `translateY(${scrollY * 0.28}px)`;
  if (!parallaxSections) parallaxSections = document.querySelectorAll('.parallax-section');
  const vh = window.innerHeight;
  parallaxSections.forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top < vh && rect.bottom > 0) {
      const speed = parseFloat(el.dataset.speed || '0.05');
      el.style.transform = `translateY(-${(vh - rect.top) * speed}px)`;
    }
  });
  scrollTicking = false;
}
window.addEventListener('scroll', () => {
  if (!scrollTicking) { requestAnimationFrame(onScroll); scrollTicking = true; }
}, { passive: true });

// ─── Count-Up Animation ──────────────────────────────────────────────────────
function animateCountUp(el) {
  const text = el.textContent.trim();
  const match = text.match(/^(\d+)/);
  if (!match) return;
  const target = parseInt(match[1]);
  const suffix = text.replace(match[1], '');
  const duration = 2000;
  const start = performance.now();
  function update(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(target * eased) + suffix;
    if (progress < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}
const countObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('[data-count-up]').forEach(animateCountUp);
      countObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

// ─── Magnetic Buttons (primary CTAs) ─────────────────────────────────────────
function initMagnetic() {
  document.querySelectorAll('.btn:not([data-magnetic])').forEach(btn => {
    btn.dataset.magnetic = '1';
    let rafId = null;
    btn.addEventListener('mousemove', e => {
      if (rafId) return;
      rafId = requestAnimationFrame(() => {
        const r = btn.getBoundingClientRect();
        btn.style.transform = `translate(${(e.clientX - r.left - r.width/2) * 0.12}px, ${(e.clientY - r.top - r.height/2) * 0.12}px)`;
        rafId = null;
      });
    });
    btn.addEventListener('mouseleave', () => {
      if (rafId) { cancelAnimationFrame(rafId); rafId = null; }
      btn.style.transform = '';
    });
  });
}

// ─── Smooth Scroll ────────────────────────────────────────────────────────────
document.addEventListener('click', e => {
  const a = e.target.closest('nav a, #mobile-menu-drawer nav a, a[href^="#"]');
  if (!a) return;
  const href = a.getAttribute('href');
  if (!href || !href.startsWith('#') || href.length < 2) return;
  const target = document.querySelector(href);
  if (target) {
    e.preventDefault();
    closeMobileMenu();
    window.scrollTo({ top: target.offsetTop - 84, behavior: 'smooth' });
  }
});

// ─── Init ─────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  TepCMS.init().then(() => {
    // Re-observe items the CMS injected, and start the count-up
    document.querySelectorAll('.reveal-item').forEach(el => {
      if (!el.classList.contains('active')) window.revealObserver.observe(el);
    });
    const statsGrid = document.getElementById('stats-grid');
    if (statsGrid) countObserver.observe(statsGrid);
    initMagnetic();
  });
  initMagnetic();
  let mutationTimer = null;
  const observer = new MutationObserver(() => {
    clearTimeout(mutationTimer);
    mutationTimer = setTimeout(initMagnetic, 200);
  });
  observer.observe(document.body, { childList: true, subtree: true });
});

// ─── Mobile Menu ──────────────────────────────────────────────────────────────
const mobileMenu = document.getElementById('mobile-menu');
const mobileDrawer = document.getElementById('mobile-menu-drawer');
const mobileOverlay = document.getElementById('mobile-menu-overlay');

function openMobileMenu() {
  if (!mobileMenu) return;
  mobileMenu.style.pointerEvents = 'auto';
  mobileOverlay.classList.remove('opacity-0');
  mobileOverlay.classList.add('opacity-100');
  mobileDrawer.classList.remove('translate-x-full');
}
function closeMobileMenu() {
  if (!mobileMenu) return;
  mobileMenu.style.pointerEvents = 'none';
  mobileOverlay.classList.remove('opacity-100');
  mobileOverlay.classList.add('opacity-0');
  mobileDrawer.classList.add('translate-x-full');
}
document.getElementById('mobile-menu-btn')?.addEventListener('click', openMobileMenu);
document.getElementById('mobile-menu-close')?.addEventListener('click', closeMobileMenu);
mobileOverlay?.addEventListener('click', closeMobileMenu);
