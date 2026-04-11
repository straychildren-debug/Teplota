/**
 * TEPLOTA — main.js
 * Scroll, animation, mobile menu, and theme toggle logic.
 * CMS is initialized after DOM ready from cms.js.
 */
import './index.css';

// ─── Dark Mode Toggle ──────────────────────────────────────────────────────────
const THEME_KEY = 'tep-theme';

function applyTheme(isDark) {
  document.documentElement.classList.toggle('dark', isDark);
  const sun = document.getElementById('icon-sun');
  const moon = document.getElementById('icon-moon');
  if (sun) sun.classList.toggle('hidden', !isDark);
  if (moon) moon.classList.toggle('hidden', isDark);
  // Swap logos
  document.querySelectorAll('img.logo').forEach(img => {
    img.src = isDark ? 'assets/logo white.svg' : 'assets/logo.svg';
  });
}

// Apply saved or system theme immediately
const saved = localStorage.getItem(THEME_KEY);
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
applyTheme(saved ? saved === 'dark' : prefersDark);

document.getElementById('theme-toggle')?.addEventListener('click', () => {
  const isDark = !document.documentElement.classList.contains('dark');
  applyTheme(isDark);
  localStorage.setItem(THEME_KEY, isDark ? 'dark' : 'light');
});

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

// ─── Header Scroll ────────────────────────────────────────────────────────────
const header = document.getElementById('main-header');
window.addEventListener('scroll', () => {
  header?.classList.toggle('scrolled', window.scrollY > 40);
});

// ─── Magnetic Buttons ─────────────────────────────────────────────────────────
function initMagnetic() {
  document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const r = btn.getBoundingClientRect();
      btn.style.transform = `translate(${(e.clientX - r.left - r.width/2) * 0.12}px, ${(e.clientY - r.top - r.height/2) * 0.12}px)`;
    });
    btn.addEventListener('mouseleave', () => { btn.style.transform = ''; });
  });
}

// ─── Smooth Scroll ────────────────────────────────────────────────────────────
document.addEventListener('click', e => {
  const a = e.target.closest('nav a, #mobile-menu-drawer nav a');
  if (!a) return;
  const href = a.getAttribute('href');
  if (!href || !href.startsWith('#')) return;
  const target = document.querySelector(href);
  if (target) {
    e.preventDefault();
    closeMobileMenu();
    window.scrollTo({ top: target.offsetTop - 90, behavior: 'smooth' });
  }
});

// ─── Init ─────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  TepCMS.init();
  initMagnetic();
  const observer = new MutationObserver(() => initMagnetic());
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
