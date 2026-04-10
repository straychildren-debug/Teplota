/**
 * TEPLOTA — cms.js
 * Loads data from Sanity CMS and renders the public website.
 * Admin panel removed — all content management is done via Sanity Studio.
 */

import { client, builder } from './sanity-client.js';
import { toHTML } from '@portabletext/to-html';

window.TepCMS = (() => {
  // ─── Default / Fallback Data ─────────────────────────────────────────────────
  const DEFAULT = {
    header: {
      phone: '+7 (843) 000-00-00',
      btnText: 'Вызвать мастера',
      btnUrl: 'tel:+78430000000',
      navLinks: [
        { label: 'О нас', url: '#about' },
        { label: 'Услуги', url: '#services' },
        { label: 'Товары', url: '#products' },
        { label: 'Наши работы', url: '#gallery' },
        { label: 'Контакты', url: '#contacts' }
      ],
      socials: [
        { icon: 'assets/icons/Vector.png', url: '#', name: 'Social 1' },
        { icon: 'assets/icons/Vector-1.png', url: '#', name: 'Social 2' },
        { icon: 'assets/icons/Vector-2.png', url: '#', name: 'Social 3' },
        { icon: 'assets/icons/Vector-3.png', url: '#', name: 'Social 4' }
      ]
    },
    hero: {
      title: 'Инженерные *системы*\nпремиум-класса',
      subtitle: 'Профессиональное проектирование и монтаж систем отопления, водоснабжения и канализации.',
      btnText: 'Получить консультацию',
      btnUrl: '#contacts'
    },
    about: {
      label: 'О компании',
      title: 'Более 10 лет *заботимся*\nо вашем комфорте',
      text1: 'Мы специализируемся на проектировании и монтаже инженерных систем любой сложности.',
      text2: 'Наши специалисты проходят регулярную сертификацию у ведущих мировых производителей оборудования.',
      stats: [
        { num: '500+', label: 'Реализованных проектов' },
        { num: '15 лет', label: 'Гарантия на материалы' }
      ],
      partners: [
        { img: 'assets/partner logo/logo_stout.jpg', name: 'Stout' },
        { img: 'assets/partner logo/logo_rommer.jpg', name: 'Rommer' },
        { img: 'assets/partner logo/logo_arrow.jpg', name: 'Arrow' }
      ]
    },
    services: [
      { id: 1, title: 'Монтаж отопления', image: 'assets/Наши услуги/Frame 20.jpg', description: 'Профессиональный монтаж систем отопления любой сложности.', photos: [] },
      { id: 2, title: 'Водоснабжение', image: 'assets/Наши услуги/Frame 20-1.jpg', description: 'Монтаж систем водоснабжения.', photos: [] },
      { id: 3, title: 'Канализация', image: 'assets/Наши услуги/Frame 20-2.jpg', description: 'Проектирование и монтаж систем канализации.', photos: [] },
      { id: 4, title: 'Проектирование', image: 'assets/Наши услуги/Frame 20-3.jpg', description: 'Комплексное проектирование инженерных сетей.', photos: [] },
      { id: 5, title: 'Сервис', image: 'assets/Наши услуги/Frame 20-4.jpg', description: 'Техническое обслуживание и ремонт.', photos: [] },
      { id: 6, title: 'Котельные', image: 'assets/Наши услуги/image 4.png', description: 'Монтаж и пуско-наладка котельных.', photos: [] }
    ],
    products: [
      { id: 1, title: 'Трубы', image: 'assets/Товары/Frame 120.png', description: 'Гарантия на работы до 3 лет, материалы до 15 лет.', details: '' },
      { id: 2, title: 'Арматура', image: 'assets/Товары/Frame 121.png', description: 'Запорно-регулирующая арматура от ведущих производителей.', details: '' },
      { id: 3, title: 'Фитинги', image: 'assets/Товары/Frame 122.png', description: 'Фитинги для труб любой сложности.', details: '' },
      { id: 4, title: 'Насосы', image: 'assets/Товары/Frame 123.png', description: 'Циркуляционные насосы Grundfos и Wilo.', details: '' },
      { id: 5, title: 'Котлы', image: 'assets/Товары/Frame 125.png', description: 'Котельная — сердце вашего дома.', details: '' },
      { id: 6, title: 'Радиаторы', image: 'assets/Товары/Frame 125-1.png', description: 'Индивидуальный подход к проектированию.', details: '' },
      { id: 7, title: 'Арматура ОВК', image: 'assets/Товары/Frame 126.png', description: 'Вентили и клапаны для точной настройки температуры.', details: '' },
      { id: 8, title: 'Водонагреватели', image: 'assets/Товары/Frame 126-1.png', description: 'Накопительные и проточные системы.', details: '' }
    ],
    gallery: [
      { id: 1, title: 'Объект 1', description: 'Монтаж системы отопления в частном доме', cover: 'assets/фото избранное/1/1.jpg', photos: [{ url: 'assets/фото избранное/1/1.jpg', caption: '' }, { url: 'assets/фото избранное/1/2.jpg', caption: '' }] },
      { id: 2, title: 'Объект 2', description: 'Комплексная разводка инженерных сетей', cover: 'assets/фото избранное/2/1.jpg', photos: [{ url: 'assets/фото избранное/2/1.jpg', caption: '' }, { url: 'assets/фото избранное/2/2.jpg', caption: '' }] },
      { id: 3, title: 'Объект 3', description: 'Котельная под ключ', cover: 'assets/фото избранное/3/1.jpg', photos: [{ url: 'assets/фото избранное/3/1.jpg', caption: '' }] }
    ],
    contact: {
      phones: [{ number: '+7 (843) 000-00-00', label: '' }],
      email: 'info@teplota-kazan.ru',
      address: 'г. Казань, ул. Техническая, д. 23',
      mapLat: 55.7963, mapLng: 49.1061
    },
    footer: {
      copyright: '© 2026 Теплота. Все права защищены.',
      links: [
        { label: 'Политика конфиденциальности', url: '#' },
        { label: 'Оферта', url: '#' }
      ],
      socials: [
        { icon: 'assets/icons/Vector.png', url: '#', name: 'VK' },
        { icon: 'assets/icons/Vector-1.png', url: '#', name: 'Telegram' },
        { icon: 'assets/icons/Vector-2.png', url: '#', name: 'WhatsApp' }
      ]
    },
    advantages: [
      { id: 1, title: 'Скрупулёзность', description: 'Скрупулезность и качество — наши главные ориентиры в работе.', icon: '' },
      { id: 2, title: 'Материалы', description: 'Используем качественные высокотехнологичные материалы от проверенных поставщиков.', icon: '' },
      { id: 3, title: 'Гарантия', description: 'Гарантия на работы до 3 лет, на материалы — до 15 лет.', icon: '' },
      { id: 4, title: 'Индивидуальность', description: 'Индивидуально проектируем системы от бюджетных до премиальных.', icon: '' },
      { id: 5, title: 'Доступность', description: 'Всегда на связи и беремся за задачи любой сложности.', icon: '' },
      { id: 6, title: 'Опыт', description: 'Беремся за любую сложность задач.', icon: '' }
    ]
  };

  // ─── Helpers ─────────────────────────────────────────────────────────────────
  // Normalize nav link URLs: strip domain, keep only hash
  function normalizeNavUrl(url) {
    if (!url) return '#';
    if (url.startsWith('#')) return url;
    try {
      const u = new URL(url);
      return u.hash || u.pathname || '#';
    } catch {
      return url;
    }
  }

  // ─── State ───────────────────────────────────────────────────────────────────
  let data = {};
  let map = null;
  let currentGalleryPhotos = [];
  let currentGalleryIndex = 0;

  // ─── Path helper ─────────────────────────────────────────────────────────────
  function fixPath(path) {
    if (!path || path.startsWith('http') || path.startsWith('data:') || path.startsWith('assets/')) return path;
    return path;
  }

  // ─── Load data ───────────────────────────────────────────────────────────────
  async function load() {
    // 1. Try live Sanity fetch
    try {
      console.log('CMS: Fetching from Sanity...');
      const query = `{
        "siteSettings": *[_type == "siteSettings"][0]{
          ...,
          header{ ..., favicon{ asset->{url} } }
        },
        "about": *[_type == "about"][0],
        "services": *[_type == "service"] | order(_createdAt asc),
        "products": *[_type == "product"] | order(_createdAt asc),
        "gallery": *[_type == "gallery"] | order(_createdAt asc),
        "advantages": *[_type == "advantage"] | order(_createdAt asc)
      }`;
      const s = await client.fetch(query);

      if (s.siteSettings || s.about || (s.services && s.services.length > 0)) {
        const navLinks = (s.siteSettings?.header?.navLinks || DEFAULT.header.navLinks)
          .map(l => ({ ...l, url: normalizeNavUrl(l.url) }));

         data = {
          header: {
            phone: s.siteSettings?.header?.phone || DEFAULT.header.phone,
            btnText: s.siteSettings?.header?.btnText || DEFAULT.header.btnText,
            btnUrl: s.siteSettings?.header?.btnUrl || DEFAULT.header.btnUrl,
            navLinks,
            favicon: (() => {
              const directUrl = s.siteSettings?.header?.favicon?.asset?.url;
              if (directUrl) return directUrl;
              const fav = s.siteSettings?.header?.favicon || s.siteSettings?.favicon;
              if (!fav) return '';
              try { return builder.image(fav); } catch { return ''; }
            })(),
            socials: s.siteSettings?.header?.socials?.map(soc => ({
              name: soc.name, url: soc.url,
              icon: soc.icon ? builder.image(soc.icon) : ''
            })) || DEFAULT.header.socials
          },
          hero: s.siteSettings?.hero ? {
            title: s.siteSettings.hero.title,
            subtitle: s.siteSettings.hero.subtitle,
            btnText: s.siteSettings.hero.btnText,
            btnUrl: normalizeNavUrl(s.siteSettings.hero.btnUrl),
            bg: s.siteSettings.hero.background ? builder.image(s.siteSettings.hero.background) : ''
          } : DEFAULT.hero,
          contact: {
            phones: s.siteSettings?.contact?.phones || DEFAULT.contact.phones,
            email: s.siteSettings?.contact?.email || DEFAULT.contact.email,
            address: s.siteSettings?.contact?.address || DEFAULT.contact.address,
            mapLat: s.siteSettings?.contact?.mapLat || DEFAULT.contact.mapLat,
            mapLng: s.siteSettings?.contact?.mapLng || DEFAULT.contact.mapLng,
          },
          footer: {
            copyright: s.siteSettings?.footer?.copyright || DEFAULT.footer.copyright,
            links: s.siteSettings?.footer?.links || DEFAULT.footer.links,
            socials: s.siteSettings?.footer?.socials?.map(soc => ({
              name: soc.name, url: soc.url,
              icon: soc.icon ? builder.image(soc.icon) : ''
            })) || DEFAULT.footer.socials
          },
          about: {
            label: s.about?.label || DEFAULT.about.label,
            title: s.about?.title || DEFAULT.about.title,
            text1: s.about?.text1 || DEFAULT.about.text1,
            text2: s.about?.text2 ? (typeof s.about.text2 === 'string' ? s.about.text2 : toHTML(s.about.text2)) : DEFAULT.about.text2,
            stats: s.about?.stats || DEFAULT.about.stats,
            partners: s.about?.partners?.map(p => ({
              name: p.name,
              img: typeof p.img === 'string' ? p.img : (p.img ? builder.image(p.img) : '')
            })) || DEFAULT.about.partners
          },
          services: s.services?.map(item => ({
            id: item._id,
            title: item.title,
            image: item.image ? builder.image(item.image) : '',
            description: item.content ? toHTML(item.content) : (item.description || ''),
            photos: (item.photos || []).map(p => typeof p === 'string' ? { url: p, caption: '' } : { url: builder.image(p), caption: p.caption || '' })
          })) || DEFAULT.services,
          products: s.products?.map(item => ({
            id: item._id,
            title: item.title,
            image: item.image ? builder.image(item.image) : '',
            description: item.description || '',
            details: item.details ? (typeof item.details === 'string' ? item.details : toHTML(item.details)) : ''
          })) || DEFAULT.products,
          gallery: s.gallery?.map(item => ({
            id: item._id,
            title: item.title,
            description: item.description || '',
            cover: item.cover ? builder.image(item.cover) : '',
            photos: (item.photos || []).map(p => typeof p === 'string' ? { url: p, caption: '' } : { url: builder.image(p), caption: p.caption || '' })
          })) || DEFAULT.gallery,
          advantages: (s.advantages?.length ? s.advantages : s.siteSettings?.advantages)?.map((item, idx) => ({
            id: item._id || idx,
            title: item.title,
            description: item.description || item.text || '',
            icon: typeof item.icon === 'string' ? item.icon : (item.icon ? builder.image(item.icon) : '')
          })) || DEFAULT.advantages
        };


        if (!data.header.navLinks) data.header.navLinks = DEFAULT.header.navLinks;
        console.log('CMS: Sanity live data loaded.');
        return;
      }
    } catch (e) {
      console.warn('CMS: Sanity live fetch failed.', e);
    }

    // 2. Fallback: cms-data.json (pre-synced snapshot)
    try {
      const resp = await fetch('/cms-data.json');
      if (resp.ok) {
        const json = await resp.json();
        // Normalize nav links from snapshot (may have full URLs)
        if (json.header?.navLinks) {
          json.header.navLinks = json.header.navLinks.map(l => ({ ...l, url: normalizeNavUrl(l.url) }));
        }
        // Normalize gallery photos from snapshot (plain string arrays)
        if (json.gallery) {
          json.gallery = json.gallery.map(g => ({
            ...g,
            photos: (g.photos || []).map(p => typeof p === 'string' ? { url: p, caption: '' } : p)
          }));
        }
        // Normalize service photos from snapshot
        if (json.services) {
          json.services = json.services.map(s => ({
            ...s,
            photos: (s.photos || []).map(p => typeof p === 'string' ? { url: p, caption: '' } : p)
          }));
        }
        // Merge defaults for top level keys just in case
        data = {
          ...DEFAULT,
          ...json,
          // Deep merge about specifically
          about: { ...DEFAULT.about, ...(json.about || {}) },
          contact: { ...DEFAULT.contact, ...(json.contact || {}) },
          header: { ...DEFAULT.header, ...(json.header || {}) },
          footer: { ...DEFAULT.footer, ...(json.footer || {}) }
        };
        console.log('CMS: Loaded from cms-data.json snapshot.');
        return;
      }
    } catch (e) {
      console.warn('CMS: cms-data.json not available.', e);
    }

    // 3. Hard defaults
    data = JSON.parse(JSON.stringify(DEFAULT));
    console.log('CMS: Using hardcoded defaults.');
  }

  // ─── Favicon ─────────────────────────────────────────────────────────────────
  function applyFavicon(url) {
    if (!url) return;
    const applyLink = (href) => {
      document.querySelectorAll('link[rel*="icon"]').forEach(el => el.remove());
      const link = document.createElement('link');
      link.rel = 'icon';
      link.href = href;
      document.head.appendChild(link);
    };

    fetch(url)
      .then(r => r.blob())
      .then(blob => {
        const blobUrl = URL.createObjectURL(blob);
        if (blob.type === 'image/svg+xml') {
          const img = new Image();
          img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = 64; canvas.height = 64;
            canvas.getContext('2d').drawImage(img, 0, 0, 64, 64);
            applyLink(canvas.toDataURL('image/png'));
            URL.revokeObjectURL(blobUrl);
          };
          img.onerror = () => applyLink(blobUrl);
          img.src = blobUrl;
        } else {
          applyLink(blobUrl);
        }
      })
      .catch(() => applyLink(url));
  }

  // ─── Toast ───────────────────────────────────────────────────────────────────
  function toast(msg, type = '') {
    const el = document.getElementById('cms-toast');
    if (!el) return;
    el.textContent = msg;
    el.className = 'show ' + type;
    setTimeout(() => el.className = '', 2500);
  }

  // ─── Scroll Reveal Re-init ───────────────────────────────────────────────────
  function reObserve() {
    if (!window.revealObserver) return;
    document.querySelectorAll('.reveal-item').forEach(el => {
      el.classList.remove('active');
      window.revealObserver.observe(el);
    });
  }

  // ─── Render: Header ──────────────────────────────────────────────────────────
  function renderHeader() {
    const d = data.header;
    const phoneEl = document.getElementById('header-phone-val');
    if (phoneEl) {
      phoneEl.href = `tel:${d.phone.replace(/[^+\d]/g, '')}`;
      phoneEl.textContent = d.phone;
    }
    const mobilePhone = document.getElementById('mobile-phone-val');
    if (mobilePhone) mobilePhone.textContent = d.phone;

    if (d.favicon) applyFavicon(d.favicon);

    // Nav Links (Desktop)
    const nav = document.querySelector('header nav');
    if (nav && d.navLinks) {
      nav.innerHTML = d.navLinks.map(l => `
        <a class="hover:text-brand dark:hover:text-brand transition-colors" href="${l.url}">${l.label}</a>
      `).join('');
    }

    // Nav Links (Mobile)
    const mobNav = document.querySelector('#mobile-menu-drawer nav');
    if (mobNav && d.navLinks) {
      mobNav.innerHTML = d.navLinks.map(l => `
        <a href="${l.url}" class="text-2xl font-bold hover:text-brand transition-colors">${l.label}</a>
      `).join('');
    }

    // Socials (mobile menu)
    const socialEl = document.getElementById('mobile-socials');
    if (socialEl && d.socials) {
      socialEl.innerHTML = d.socials.map(s => `
        <a href="${s.url}" target="_blank" class="group w-12 h-12 rounded-full bg-gray-100 dark:bg-dark-surface flex items-center justify-center hover:bg-brand transition-all">
          <img src="${fixPath(s.icon)}" alt="${s.name}" 
               class="w-6 h-6 object-contain transition-all opacity-70 group-hover:opacity-100 group-hover:brightness-0 group-hover:invert"
               style="filter: grayscale(1) brightness(0.4);">
        </a>
      `).join('');
    }
  }

  // ─── Render: Hero ────────────────────────────────────────────────────────────
  function renderHero() {
    const d = data.hero;
    if (!d) return;

    const heroBg = document.getElementById('hero-bg');
    if (heroBg && d.bg) heroBg.style.backgroundImage = `url('${d.bg}')`;

    const titleEl = document.getElementById('hero-title');
    if (titleEl && d.title) {
      // Support *word* markup → <span class="text-brand">word</span>
      const html = d.title.replace(/\*([^*]+)\*/g, '<span class="text-brand">$1</span>').replace(/\n/g, '<br/>');
      titleEl.innerHTML = html;
    }

    const subtitleEl = document.getElementById('hero-subtitle');
    if (subtitleEl && d.subtitle) {
      subtitleEl.innerHTML = d.subtitle.replace(/\n/g, '<br/>');
    }

    const btnEl = document.getElementById('hero-btn');
    if (btnEl) {
      if (d.btnText) btnEl.textContent = d.btnText;
      if (d.btnUrl) btnEl.href = d.btnUrl;
    }
  }

  // ─── Render: About ───────────────────────────────────────────────────────────
  function renderAbout() {
    const d = data.about;
    const setEl = (id, val) => { 
      const el = document.getElementById(id); 
      if (el) el.innerHTML = (val === undefined || val === null) ? '' : val; 
    };

    setEl('about-label', d.label);
    setEl('about-title', d.title);
    setEl('about-text1', d.text1);
    setEl('about-text2', d.text2);

    const statsGrid = document.getElementById('stats-grid');
    if (statsGrid) {
      statsGrid.innerHTML = (d.stats || []).map((st, i) => `
        <div class="stat-card reveal-item" data-index="${i}">
          <div class="stat-num text-4xl md:text-5xl font-black text-brand mb-1">${st.num}</div>
          <div class="stat-label text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">${st.label}</div>
        </div>
      `).join('');
    }

    const partnersGrid = document.getElementById('partners-grid');
    if (partnersGrid) {
      partnersGrid.innerHTML = (d.partners || []).map(p => `
        <img src="${p.img}" alt="${p.name}" class="h-8 w-auto object-contain">
      `).join('');
    }
    reObserve();
  }

  // ─── Render: Advantages ─────────────────────────────────────────────────────
  function renderAdvantages() {
    const grid = document.getElementById('advantage-grid');
    if (!grid) return;
    grid.innerHTML = (data.advantages || []).map(a => `
      <div class="advantage-card group bg-white dark:bg-dark-surface rounded-[2.5rem] p-8 md:p-10 border border-gray-100 dark:border-dark-border cursor-default
                  flex flex-col gap-6 w-[85vw] md:w-auto flex-shrink-0 md:flex-shrink snap-center transition-all duration-300
                  reveal-item">
        <div class="w-16 h-16 bg-brand/10 dark:bg-brand/20 rounded-2xl flex items-center justify-center transition-colors group-hover:bg-brand duration-500">
          ${a.icon ? `<img src="${a.icon}" alt="" class="w-8 h-8 object-contain group-hover:brightness-0 group-hover:invert transition-all duration-500">` : ''}
        </div>
        <div>
          <h3 class="font-black text-xl text-gray-900 dark:text-white mb-3 tracking-tight">${a.title || ''}</h3>
          <p class="text-gray-500 dark:text-dark-muted text-sm md:text-base leading-relaxed">${a.description || ''}</p>
        </div>
      </div>
    `).join('');

    // --- Auto-scroll Logic ---
    let interval;
    const startAutoScroll = () => {
      if (window.innerWidth >= 768) return; // Only mobile
      clearInterval(interval);
      interval = setInterval(() => {
        const cards = grid.children;
        if (!cards.length) return;
        const cardWidth = cards[0].offsetWidth + 20; // gap
        const maxScroll = grid.scrollWidth - grid.offsetWidth;
        
        if (grid.scrollLeft >= maxScroll - 10) {
          grid.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          grid.scrollBy({ left: cardWidth, behavior: 'smooth' });
        }
      }, 4000);
    };

    grid.addEventListener('mouseenter', () => clearInterval(interval));
    grid.addEventListener('mouseleave', startAutoScroll);
    grid.addEventListener('touchstart', () => clearInterval(interval));
    grid.addEventListener('touchend', startAutoScroll);

    startAutoScroll();
    reObserve();
  }

  // ─── Render: Services ────────────────────────────────────────────────────────
  function renderServices() {
    const grid = document.getElementById('service-list-grid');
    if (!grid) return;
    const list = data.services || [];
    if (!list.length) return;

    // Helper to update the big preview
    const updatePreview = (idx) => {
      const s = list[idx];
      const img = document.getElementById('service-preview-img');
      const title = document.getElementById('service-preview-title');
      const cards = grid.querySelectorAll('.service-item-card');
      
      if (!s) return;
      if (img) img.src = s.image;
      if (title) title.textContent = s.title;
      
      // Update active state without changing layout dimensions
      cards.forEach((c, i) => {
        const h4 = c.querySelector('h4');
        if (i === idx) {
          c.classList.add('border-brand', 'shadow-lg');
          c.classList.remove('border-transparent');
          if (h4) h4.classList.add('text-brand');
        } else {
          c.classList.remove('border-brand', 'shadow-lg');
          c.classList.add('border-transparent');
          if (h4) h4.classList.remove('text-brand');
        }
      });
    };

    grid.innerHTML = list.map((s, i) => `
      <div class="service-item-card group bg-gray-50/60 dark:bg-dark-surface p-4 md:p-5 rounded-[1.8rem] border-2 border-transparent 
                  cursor-pointer transition-all duration-300 flex items-center justify-center text-center h-24 md:h-28
                  hover:bg-white dark:hover:bg-dark-border"
           data-index="${i}" data-service-id="${s.id}">
        <h4 class="font-bold text-base md:text-lg text-gray-800 dark:text-white leading-tight transition-colors">${s.title}</h4>
      </div>
    `).join('');

    // Set initial preview (first item)
    updatePreview(0);

    // Add Events
    grid.querySelectorAll('.service-item-card').forEach(card => {
      card.addEventListener('mouseenter', () => updatePreview(parseInt(card.dataset.index)));
      card.addEventListener('click', () => openService(card.dataset.serviceId));
    });

    reObserve();
  }

  // ─── Render: Products ────────────────────────────────────────────────────────
  function renderProducts() {
    const grid = document.getElementById('product-grid');
    if (!grid) return;
    grid.innerHTML = (data.products || []).map(p => `
      <div class="product-card group bg-white dark:bg-dark-surface rounded-3xl p-6 border border-gray-100 dark:border-dark-border
                  flex flex-col items-center cursor-pointer hover:shadow-xl hover:scale-[1.02] transition-all duration-500 reveal-item" data-product-id="${p.id}">
        <div class="aspect-square w-full bg-gray-50 dark:bg-dark-bg rounded-2xl mb-5 flex items-center justify-center p-6 overflow-hidden">
          <img src="${p.image}" alt="${p.title}" class="max-h-full max-w-full object-contain transition-transform duration-500 group-hover:scale-110">
        </div>
        <h4 class="font-bold text-lg text-center text-gray-900 dark:text-white group-hover:text-brand transition-colors duration-300">${p.title}</h4>
        <p class="text-xs text-gray-400 dark:text-dark-muted mt-2 text-center line-clamp-2">${p.description}</p>
      </div>
    `).join('');

    grid.querySelectorAll('[data-product-id]').forEach(card => {
      card.addEventListener('click', () => openProduct(card.dataset.productId));
    });
    reObserve();
  }

  // ─── Render: Gallery ─────────────────────────────────────────────────────────
  let galleryInterval = null;
  function renderGallery() {
    const grid = document.getElementById('gallery-grid');
    if (!grid) return;
    if (galleryInterval) clearInterval(galleryInterval);

    grid.innerHTML = (data.gallery || []).map(g => `
      <div class="gallery-item flex-shrink-0 w-full snap-center rounded-[2.5rem] overflow-hidden relative group cursor-pointer shadow-xl hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] transition-all duration-700 reveal-item active:scale-95" data-gallery-id="${g.id}">
        <div class="h-[400px] md:h-[550px] relative overflow-hidden">
          <img src="${g.cover}" alt="${g.title}" class="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110">
          <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent transition-opacity duration-500 group-hover:from-black/100"></div>
        </div>
        <div class="absolute bottom-0 left-0 p-8 md:p-14 text-white w-full transform transition-transform duration-500 group-hover:-translate-y-2">
          <span class="text-xs font-bold text-brand uppercase tracking-[0.2em] mb-3 block opacity-80 group-hover:opacity-100">Реализованный объект</span>
          <h3 class="text-3xl md:text-5xl font-black leading-tight group-hover:text-brand-light transition-colors">${g.title}</h3>
          <p class="text-white/60 text-sm mt-4 max-w-xl group-hover:text-white/90 transition-colors line-clamp-2">${g.description}</p>
        </div>
      </div>
    `).join('');

    grid.querySelectorAll('[data-gallery-id]').forEach(card => {
      card.addEventListener('click', () => openGallery(card.dataset.galleryId));
    });

    const dotsContainer = document.getElementById('gallery-dots');
    if (dotsContainer) {
      const count = data.gallery?.length || 0;
      dotsContainer.innerHTML = Array.from({ length: count }).map((_, i) => `
        <button class="gallery-dot w-2 h-2 rounded-full bg-gray-300 dark:bg-dark-border transition-all duration-300 hover:bg-brand/50" data-index="${i}"></button>
      `).join('');

      const dots = dotsContainer.querySelectorAll('.gallery-dot');
      const updateDots = () => {
        const activeIndex = Math.round(grid.scrollLeft / grid.offsetWidth);
        dots.forEach((dot, idx) => {
          dot.classList.toggle('bg-brand', idx === activeIndex);
          dot.classList.toggle('w-8', idx === activeIndex);
          dot.classList.toggle('bg-gray-300', idx !== activeIndex);
        });
      };
      grid.onscroll = updateDots;
      updateDots();
      dots.forEach(dot => {
        dot.onclick = () => grid.scrollTo({ left: parseInt(dot.dataset.index) * grid.offsetWidth, behavior: 'smooth' });
      });
    }

    galleryInterval = setInterval(() => {
      if (!grid) return;
      const maxScroll = grid.scrollWidth - grid.clientWidth;
      grid.scrollLeft >= maxScroll - 10
        ? grid.scrollTo({ left: 0, behavior: 'smooth' })
        : grid.scrollTo({ left: grid.scrollLeft + grid.offsetWidth, behavior: 'smooth' });
    }, 8000);

    reObserve();
  }

  // ─── Render: Contact ─────────────────────────────────────────────────────────
  function renderContact() {
    const d = data.contact;
    const container = document.getElementById('contact-phones-list');
    const email = document.getElementById('contact-email');
    const address = document.getElementById('contact-address');

    if (container) {
      container.innerHTML = (d.phones || []).map(p => `
        <div class="flex flex-col">
          <span class="text-xs text-brand uppercase font-black tracking-[0.2em] mb-2">${p.label || 'Телефон'}</span>
          <a href="tel:${p.number.replace(/[^+\d]/g, '')}" class="text-2xl md:text-3xl font-black text-gray-900 dark:text-white hover:text-brand transition-all duration-300">${p.number}</a>
        </div>
      `).join('');
    }
    if (email) email.innerHTML = `<span class="text-brand mr-2">✉</span> ${d.email}`;
    if (address) address.innerHTML = `<span class="text-brand mr-2">📍</span> ${d.address}`;

    initMap();
  }

  // ─── Render: Footer ──────────────────────────────────────────────────────────
  function renderFooter() {
    const f = data.footer;
    const h = data.header;
    const copy = document.getElementById('footer-copy');
    if (copy) copy.textContent = f.copyright;

    const linksEl = document.getElementById('footer-links');
    if (linksEl) {
      linksEl.innerHTML = (f.links || []).map(l => `
        <a href="${l.url}" class="hover:text-brand transition-colors">${l.label}</a>
      `).join('');
    }

    const socialsEl = document.getElementById('footer-socials');
    if (socialsEl && (f.socials || h.socials)) {
      const socList = f.socials || h.socials;
      socialsEl.innerHTML = socList.map(s => `
        <a href="${s.url}" target="_blank" class="group w-12 h-12 rounded-full bg-gray-100 dark:bg-dark-surface flex items-center justify-center transition-all transform hover:-translate-y-1 hover:bg-brand shadow-sm">
          <img src="${fixPath(s.icon)}" alt="${s.name}" 
               class="w-6 h-6 object-contain transition-all opacity-70 group-hover:opacity-100 group-hover:brightness-0 group-hover:invert scale-110" 
               style="filter: grayscale(1) brightness(0.8);">
        </a>
      `).join('');
    }
  }

  // ─── Render All ──────────────────────────────────────────────────────────────
  function renderAll() {
    renderHeader();
    renderHero();
    renderAbout();
    renderAdvantages();
    renderServices();
    renderProducts();
    renderGallery();
    renderContact();
    renderFooter();
  }

  // ─── Map (Leaflet) ───────────────────────────────────────────────────────────
  function initMap() {
    const mapEl = document.getElementById('leaflet-map');
    if (!mapEl || typeof L === 'undefined') {
      if (mapEl) mapEl.innerHTML = '<div style="padding:20px;text-align:center;color:#999;">Карта временно недоступна</div>';
      return;
    }
    const d = data.contact;
    const lat = d.mapLat || 55.7961;
    const lng = d.mapLng || 49.1061;

    const isDesktop = window.innerWidth >= 1024;
    const offset = isDesktop ? 0.025 : 0;
    const viewLng = lng - offset;

    if (map) { map.remove(); map = null; }

    try {
      const bounds = L.latLng(lat, viewLng).toBounds(8000);
      map = L.map('leaflet-map', {
        dragging: true,
        scrollWheelZoom: false,
        doubleClickZoom: true,
        touchZoom: true,
        zoomControl: true,
        maxBounds: bounds,
        maxBoundsViscosity: 1.0
      }).setView([lat, viewLng], 14);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap'
      }).addTo(map);

      const marker = L.marker([lat, lng]).addTo(map);
      marker.bindTooltip('Мы здесь', {
        permanent: true,
        direction: 'top',
        offset: [0, -10],
        className: 'custom-map-tooltip'
      }).openTooltip();
    } catch (e) {
      console.error('Map init error:', e);
    }
  }

  // ─── Open Service Modal (viewer) ─────────────────────────────────────────────
  function openService(id) {
    const s = data.services.find(x => x.id == id);
    if (!s) return;
    document.getElementById('service-modal-cover').src = s.image;
    document.getElementById('service-modal-title').textContent = s.title;
    document.getElementById('service-modal-desc').innerHTML = s.description || '';
    const photosEl = document.getElementById('service-modal-photos');
    photosEl.innerHTML = (s.photos || []).map(ph => `<img src="${ph.url || ph}" class="rounded-xl cursor-pointer hover:opacity-80 transition-opacity" onclick="TepCMS.viewImage('${ph.url || ph}')">`).join('');
    document.getElementById('service-modal-overlay').classList.add('open');
  }

  // ─── Open Product Modal (viewer) ─────────────────────────────────────────────
  function openProduct(id) {
    const p = data.products.find(x => x.id == id);
    if (!p) return;
    document.getElementById('product-modal-cover').src = p.image;
    document.getElementById('product-modal-title').textContent = p.title;
    const content = (p.details && p.details.trim()) ? p.details : p.description;
    document.getElementById('product-modal-desc').innerHTML = content;
    document.getElementById('product-modal-overlay').classList.add('open');
  }

  // ─── Open Gallery Modal (viewer) ─────────────────────────────────────────────
  function openGallery(id) {
    const g = data.gallery.find(x => x.id == id);
    if (!g || !g.photos || g.photos.length === 0) return;
    currentGalleryPhotos = g.photos;
    currentGalleryIndex = 0;
    document.getElementById('gallery-modal-title').textContent = g.title;
    document.getElementById('gallery-modal-desc').textContent = g.description;
    updateGallerySlider();
    document.getElementById('gallery-modal-overlay').classList.add('open');
  }

  function updateGallerySlider() {
    const img = document.getElementById('gallery-modal-main-img');
    const counter = document.getElementById('gallery-modal-counter');
    const cap = document.getElementById('gallery-image-caption');
    const photo = currentGalleryPhotos[currentGalleryIndex];
    if (img) img.src = photo.url || photo;
    if (counter) counter.textContent = `${currentGalleryIndex + 1} / ${currentGalleryPhotos.length}`;
    if (cap) {
      const caption = photo.caption;
      cap.textContent = caption || '';
      cap.classList.toggle('hidden', !caption);
    }
  }

  function galleryNext() {
    if (currentGalleryPhotos.length <= 1) return;
    currentGalleryIndex = (currentGalleryIndex + 1) % currentGalleryPhotos.length;
    updateGallerySlider();
  }

  function galleryPrev() {
    if (currentGalleryPhotos.length <= 1) return;
    currentGalleryIndex = (currentGalleryIndex - 1 + currentGalleryPhotos.length) % currentGalleryPhotos.length;
    updateGallerySlider();
  }

  // Keyboard navigation for gallery modal
  window.addEventListener('keydown', e => {
    const overlay = document.getElementById('gallery-modal-overlay');
    if (overlay && overlay.classList.contains('open')) {
      if (e.key === 'ArrowRight') galleryNext();
      if (e.key === 'ArrowLeft') galleryPrev();
      if (e.key === 'Escape') overlay.classList.remove('open');
    }
  });

  // ─── Image Viewer ─────────────────────────────────────────────────────────────
  function viewImage(src) {
    const overlay = document.getElementById('img-viewer-overlay');
    if (!overlay) return;
    overlay.querySelector('img').src = src;
    overlay.classList.add('open');
  }

  // ─── Public API ───────────────────────────────────────────────────────────────
  return {
    async init() {
      console.log('TepCMS: Initializing...');
      await load();
      renderAll();
      console.log('TepCMS: Ready.');
    },
    openService, openProduct, openGallery,
    galleryNext, galleryPrev,
    viewImage,
    toast
  };
})();
