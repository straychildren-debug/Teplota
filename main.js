/**
 * TEPLOTA — main.js
 * Scroll + animation logic. CMS is initialized after DOM ready.
 */

// ─── Reveal Observer ─────────────────────────────────────────────────────────
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
  header.classList.toggle('scrolled', window.scrollY > 40);
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
  const a = e.target.closest('nav a');
  if (!a) return;
  const href = a.getAttribute('href');
  if (!href || !href.startsWith('#')) return;
  const target = document.querySelector(href);
  if (target) {
    e.preventDefault();
    window.scrollTo({ top: target.offsetTop - 90, behavior: 'smooth' });
  }
});

// ─── Gallery overlay styles ───────────────────────────────────────────────────
const galStyle = document.createElement('style');
galStyle.textContent = `
  .gallery-item { cursor: pointer; }
  .gallery-overlay {
    position: absolute; bottom: 0; left: 0; right: 0;
    padding: 20px 16px 14px;
    background: linear-gradient(to top, rgba(0,0,0,0.75), transparent);
    color: #fff; font-family: 'Outfit', sans-serif;
    font-size: 15px; font-weight: 700; text-transform: uppercase;
    letter-spacing: 0.04em; opacity: 0;
    transition: opacity 0.3s ease;
    border-radius: 0 0 12px 12px;
    pointer-events: none;
  }
  .gallery-item:hover .gallery-overlay { opacity: 1; }
  .btn-link {
    color: #FF5722; font-weight: 700; font-size: 15px;
    text-decoration: none; font-family: 'Outfit', sans-serif;
    text-transform: uppercase; letter-spacing: 0.04em;
    transition: opacity 0.2s;
  }
  .btn-link:hover { opacity: 0.7; }
`;
document.head.appendChild(galStyle);

// ─── Init ─────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  TepCMS.init();
  initMagnetic();

  // Re-run magnetic on any re-render (gallery/services buttons are dynamic)
  const observer = new MutationObserver(() => initMagnetic());
  observer.observe(document.body, { childList: true, subtree: true });
});
