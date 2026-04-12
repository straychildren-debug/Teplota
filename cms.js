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
    ],
    sections: {
      advantages: { title: 'НАШИ ПРЕИМУЩЕСТВА' },
      services: { title: 'НАШИ SERVICES', subtitle: 'Комплексный монтаж инженерных систем любой сложности', btnText: 'Заказать услугу' },
      products: { title: 'OUR PRODUCTS', subtitle: 'Современное котельное оборудование для вашего дома', btnText: 'Заказать оборудование' },
      gallery:  { title: 'НАШИ WORKS', subtitle: 'Примеры реализованных нами проектов', btnText: '' },
      location: { title: 'LOCATION MAP' },
      contacts: { title: 'CONTACT US', subtitle: 'Оставьте заявку, и мы свяжемся с вами в ближайшее время', formNameLabel: 'Ваше имя', formPhoneLabel: 'Номер телефона', formBtnText: 'Заказать звонок' },
    }
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
            label: s.siteSettings.hero.label || DEFAULT.hero.label || '',
            title: s.siteSettings.hero.title,
            subtitle: s.siteSettings.hero.subtitle,
            btnText: s.siteSettings.hero.btnText,
            btnUrl: normalizeNavUrl(s.siteSettings.hero.btnUrl),
            secondaryBtnText: s.siteSettings.hero.secondaryBtnText || '',
            secondaryBtnUrl: normalizeNavUrl(s.siteSettings.hero.secondaryBtnUrl || '#gallery'),
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
          })) || DEFAULT.advantages,
          sections: {
            advantages: {
              title: s.siteSettings?.sections?.advantages?.title || DEFAULT.sections.advantages.title,
            },
            services: {
              title: s.siteSettings?.sections?.services?.title || DEFAULT.sections.services.title,
              subtitle: s.siteSettings?.sections?.services?.subtitle || DEFAULT.sections.services.subtitle,
              btnText: s.siteSettings?.sections?.services?.btnText || DEFAULT.sections.services.btnText,
            },
            products: {
              title: s.siteSettings?.sections?.products?.title || DEFAULT.sections.products.title,
              subtitle: s.siteSettings?.sections?.products?.subtitle || DEFAULT.sections.products.subtitle,
              btnText: s.siteSettings?.sections?.products?.btnText || DEFAULT.sections.products.btnText,
            },
            gallery: {
              title: s.siteSettings?.sections?.gallery?.title || DEFAULT.sections.gallery.title,
              subtitle: s.siteSettings?.sections?.gallery?.subtitle || DEFAULT.sections.gallery.subtitle,
              btnText: s.siteSettings?.sections?.gallery?.btnText || DEFAULT.sections.gallery.btnText,
            },
            location: {
              title: s.siteSettings?.sections?.location?.title || DEFAULT.sections.location.title,
            },
            contacts: {
              title: s.siteSettings?.sections?.contacts?.title || DEFAULT.sections.contacts.title,
              subtitle: s.siteSettings?.sections?.contacts?.subtitle || DEFAULT.sections.contacts.subtitle,
              formNameLabel: s.siteSettings?.sections?.contacts?.formNameLabel || DEFAULT.sections.contacts.formNameLabel,
              formPhoneLabel: s.siteSettings?.sections?.contacts?.formPhoneLabel || DEFAULT.sections.contacts.formPhoneLabel,
              formBtnText: s.siteSettings?.sections?.contacts?.formBtnText || DEFAULT.sections.contacts.formBtnText,
            },
          }
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
        <a class="hover:text-gray-900 dark:hover:text-white transition-colors" href="${l.url}">${l.label}</a>
      `).join('');
    }

    // Nav Links (Mobile)
    const mobNav = document.querySelector('#mobile-menu-drawer nav');
    if (mobNav && d.navLinks) {
      mobNav.innerHTML = d.navLinks.map(l => `
        <a href="${l.url}" class="text-xl font-bold hover:text-[#f36e21] transition-colors">${l.label}</a>
      `).join('');
    }

    // Socials (mobile menu)
    const socialEl = document.getElementById('mobile-socials');
    if (socialEl && d.socials) {
      socialEl.innerHTML = d.socials.map(s => `
        <a href="${s.url}" target="_blank" class="group w-10 h-10 rounded-full bg-gray-100 dark:bg-white/5 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-white/10 transition-all text-gray-400 hover:text-white">
          <img src="${fixPath(s.icon)}" alt="${s.name}"
               class="w-5 h-5 object-contain transition-all opacity-60 group-hover:opacity-100 social-icon-auto">
        </a>
      `).join('');
    }
  }

  // ─── Render: Hero ────────────────────────────────────────────────────────────
  function renderHero() {
    const d = data.hero;
    if (!d) return;

    const heroBg = document.getElementById('hero-bg');
    if (heroBg) {
      if (d.bg) {
        console.log('CMS: Applying hero background:', d.bg);
        heroBg.style.backgroundImage = `url('${d.bg}')`;
        heroBg.classList.remove('bg-hero-pattern');
      } else {
        console.log('CMS: No hero background in data — restoring default pattern');
        heroBg.style.backgroundImage = '';
        heroBg.classList.add('bg-hero-pattern');
      }
    }

    const titleEl = document.getElementById('hero-title');
    if (titleEl && d.title) {
      // Support *word* markup → orange accent, \n → line break
      const html = accentTitle(d.title).replace(/\n/g, '<br/>');
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
        <div class="stat-card" data-index="${i}">
          <div class="text-[#f36e21] font-bold text-4xl md:text-5xl mb-1" data-count-up>${st.num}</div>
          <div class="text-xs font-semibold tracking-wider text-[#1a1b26]/70 uppercase">${st.label}</div>
        </div>
      `).join('');
    }

    const partnersGrid = document.getElementById('partners-grid');
    if (partnersGrid) {
      partnersGrid.innerHTML = (d.partners || []).map(p => `
        <img src="${p.img}" alt="${p.name}" class="h-6 w-auto object-contain partner-icon-auto">
      `).join('');
    }
    reObserve();
  }

  // ─── Render: Advantages ─────────────────────────────────────────────────────
  function renderAdvantages() {
    const grid = document.getElementById('advantage-grid');
    if (!grid) return;
    grid.innerHTML = (data.advantages || []).map(a => `
      <div class="glass-panel group rounded-2xl p-8 border border-gray-200 dark:border-white/5
                  flex flex-col gap-5 cursor-default transition-all duration-300 hover:border-[#f36e21]/30 hover:shadow-[0_0_20px_rgba(243,110,33,0.15)]
                  reveal-item">
        <div class="w-14 h-14 bg-[#f36e21]/10 rounded-2xl flex items-center justify-center transition-colors group-hover:bg-[#f36e21] duration-500">
          ${a.icon ? `<img src="${a.icon}" alt="" class="w-7 h-7 object-contain group-hover:brightness-0 group-hover:invert transition-all duration-500">` : ''}
        </div>
        <div>
          <h3 class="font-bold text-lg text-gray-900 dark:text-white mb-2">${a.title || ''}</h3>
          <p class="text-gray-600 dark:text-[#94a3b8] text-sm leading-relaxed">${a.description || ''}</p>
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
    const previewImg = document.getElementById('service-preview-img');
    const previewTitle = document.getElementById('service-preview-title');
    if (!grid) return;
    const list = data.services || [];
    if (!list.length) return;

    // Set initial preview to first service
    if (previewImg && list[0]) {
      previewImg.src = list[0].image;
      previewImg.alt = list[0].title;
      if (previewTitle) previewTitle.textContent = list[0].title;
    }

    grid.innerHTML = list.map((s, i) => `
      <div class="service-list-item group flex items-center gap-4 p-3 rounded-xl cursor-pointer
                  transition-all duration-300 ${i === 0 ? 'selected' : ''} reveal-item"
           data-service-id="${s.id}" data-service-img="${s.image}" data-service-title="${s.title}">
        <div class="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
          <img src="${s.image}" alt="${s.title}" loading="lazy" class="w-full h-full object-cover">
        </div>
        <div class="flex-1">
          <h3 class="font-semibold text-sm text-gray-900 dark:text-white group-hover:text-[#f36e21] transition-colors leading-tight">${s.title}</h3>
        </div>
        <svg class="ml-auto w-5 h-5 flex-shrink-0 text-gray-400 group-hover:text-[#f36e21] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
        </svg>
      </div>
    `).join('');

    // Hover interaction — update preview
    grid.querySelectorAll('[data-service-id]').forEach(item => {
      item.addEventListener('mouseenter', () => {
        if (previewImg) {
          previewImg.style.opacity = '0';
          setTimeout(() => {
            previewImg.src = item.dataset.serviceImg;
            previewImg.alt = item.dataset.serviceTitle;
            if (previewTitle) previewTitle.textContent = item.dataset.serviceTitle;
            previewImg.style.opacity = '1';
          }, 250);
        }
        grid.querySelectorAll('.service-list-item').forEach(el => el.classList.remove('selected'));
        item.classList.add('selected');
      });

      item.addEventListener('click', () => openService(item.dataset.serviceId));
    });

    reObserve();
  }

  // ─── Render: Products ────────────────────────────────────────────────────────
  function renderProducts() {
    const grid = document.getElementById('product-grid');
    if (!grid) return;
    grid.innerHTML = (data.products || []).map(p => `
      <div class="product-card group flex flex-col
                  cursor-pointer reveal-item" data-product-id="${p.id}">
        <div class="product-image flex-1 p-6 flex items-center justify-center">
          <img src="${p.image}" alt="${p.title}" loading="lazy" class="max-h-full max-w-full object-contain filter drop-shadow-xl transition-transform duration-300 group-hover:scale-105">
        </div>
        <div class="px-6 pb-5 mt-auto">
          <h3 class="font-semibold text-base leading-tight group-hover:text-[#f36e21] transition-colors m-0">${p.title}</h3>
        </div>
        <div class="product-ring"></div>
      </div>
    `).join('');

    grid.querySelectorAll('[data-product-id]').forEach(card => {
      card.addEventListener('click', () => openProduct(card.dataset.productId));
    });
    reObserve();
  }

  // ─── Render: Gallery ─────────────────────────────────────────────────────────
  function renderGallery() {
    const grid = document.getElementById('gallery-grid');
    if (!grid) return;
    const items = data.gallery || [];
    if (!items.length) return;

    grid.innerHTML = items.map((g, i) => `
      <div class="gallery-carousel-item">
        <div class="gallery-carousel-card reveal-item" data-gallery-id="${g.id}">
          <div class="aspect-video relative overflow-hidden">
            <img src="${g.cover}" alt="${g.title}" loading="lazy" class="w-full h-full object-cover">
          </div>
          <div class="p-6">
            <h3 class="font-semibold text-lg text-gray-900 dark:text-white leading-tight">${g.title}</h3>
            <p class="text-gray-600 dark:text-[#94a3b8] text-sm mt-2 line-clamp-2">${g.description}</p>
          </div>
        </div>
      </div>
    `).join('');

    grid.querySelectorAll('[data-gallery-id]').forEach(card => {
      card.addEventListener('click', () => openGallery(card.dataset.galleryId));
    });

    reObserve();
    initGalleryCarousel();
  }

  // ─── Gallery Carousel Logic ─────────────────────────────────────────────────
  function initGalleryCarousel() {
    const wrapper = document.getElementById('gallery-carousel-wrapper');
    const track = document.getElementById('gallery-grid');
    if (!wrapper || !track) return;
    const items = track.querySelectorAll('.gallery-carousel-item');
    if (!items.length) return;
    let current = 0;
    const total = items.length;

    function goTo(idx) {
      current = ((idx % total) + total) % total;
      track.style.transform = `translateX(-${current * 100}%)`;
      updateDots();
    }

    // Build dots
    const dotsEl = document.getElementById('gallery-dots');
    if (dotsEl) {
      dotsEl.innerHTML = Array.from({ length: total }, (_, i) =>
        `<button class="gallery-dot${i === 0 ? ' active' : ''}" data-idx="${i}"></button>`
      ).join('');
      dotsEl.addEventListener('click', e => {
        const dot = e.target.closest('[data-idx]');
        if (dot) goTo(+dot.dataset.idx);
      });
    }

    function updateDots() {
      if (!dotsEl) return;
      dotsEl.querySelectorAll('.gallery-dot').forEach((d, i) => {
        d.classList.toggle('active', i === current);
      });
    }

    document.getElementById('gallery-prev')?.addEventListener('click', () => goTo(current - 1));
    document.getElementById('gallery-next')?.addEventListener('click', () => goTo(current + 1));

    // Touch/swipe support for mobile
    let touchStartX = 0;
    let touchEndX = 0;
    wrapper.addEventListener('touchstart', e => {
      touchStartX = e.changedTouches[0].screenX;
      stopAutoTimer();
    }, { passive: true });
    wrapper.addEventListener('touchend', e => {
      touchEndX = e.changedTouches[0].screenX;
      const diff = touchStartX - touchEndX;
      if (Math.abs(diff) > 50) {
        if (diff > 0) goTo(current + 1);
        else goTo(current - 1);
      }
      startAutoTimer();
    }, { passive: true });

    // Auto-advance every 5 seconds (pauses when off-screen)
    let autoTimer = null;
    function startAutoTimer() {
      clearInterval(autoTimer);
      autoTimer = setInterval(() => goTo(current + 1), 5000);
    }
    function stopAutoTimer() { clearInterval(autoTimer); autoTimer = null; }

    wrapper.addEventListener('mouseenter', stopAutoTimer);
    wrapper.addEventListener('mouseleave', startAutoTimer);

    // Only auto-advance when gallery is visible
    const visibilityObs = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) startAutoTimer();
        else stopAutoTimer();
      });
    }, { threshold: 0.1 });
    visibilityObs.observe(wrapper);
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
          <span class="text-xs text-gray-500 uppercase font-bold tracking-[0.2em] mb-1">${p.label || 'Телефон'}</span>
          <a href="tel:${p.number.replace(/[^+\d]/g, '')}" class="text-2xl font-bold text-gray-900 dark:text-white hover:text-[#f36e21] transition-all duration-300">${p.number}</a>
        </div>
      `).join('');
    }
    if (email) email.innerHTML = `<span class="text-xs text-gray-500 uppercase font-bold tracking-[0.2em] block mb-1">Email</span><a href="mailto:${d.email}" class="text-gray-900 dark:text-white hover:text-[#f36e21] transition-colors">${d.email}</a>`;
    if (address) address.innerHTML = `<span class="text-xs text-gray-500 uppercase font-bold tracking-[0.2em] block mb-1">Адрес</span><span class="text-gray-600 dark:text-[#94a3b8]">${d.address}</span>`;

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
        <a href="${s.url}" target="_blank" class="group w-10 h-10 rounded-full bg-gray-100 dark:bg-white/5 flex items-center justify-center transition-all duration-300 hover:bg-[#f36e21] hover:-translate-y-1">
          <img src="${fixPath(s.icon)}" alt="${s.name}"
               class="w-5 h-5 object-contain transition-all opacity-70 group-hover:opacity-100 social-icon-auto">
        </a>
      `).join('');
    }
  }

  // ─── Render All ──────────────────────────────────────────────────────────────
  // Convert *text* to orange <span> for section titles
  function accentTitle(text) {
    if (!text) return text;
    return text.replace(/\*([^*]+)\*/g, '<span class="text-[#f36e21]">$1</span>');
  }

  function renderSections() {
    const sec = data.sections || {};

    // Helper: set text content if element exists and value is truthy
    function setText(id, val) {
      const el = document.getElementById(id);
      if (el && val) el.textContent = val;
    }
    function setHTML(id, val) {
      const el = document.getElementById(id);
      if (el && val) el.innerHTML = val;
    }
    function setPlaceholder(id, val) {
      const el = document.getElementById(id);
      if (el && val) el.placeholder = val;
    }

    // Advantages
    if (sec.advantages?.title) setHTML('advantages-title', accentTitle(sec.advantages.title));

    // Services
    if (sec.services?.title) setHTML('services-title', accentTitle(sec.services.title));
    setText('services-subtitle', sec.services?.subtitle);
    setText('services-section-btn', sec.services?.btnText);

    // Products
    if (sec.products?.title) setHTML('products-title', accentTitle(sec.products.title));
    setText('products-subtitle', sec.products?.subtitle);
    setText('products-section-btn', sec.products?.btnText);

    // Gallery
    if (sec.gallery?.title) setHTML('gallery-title', accentTitle(sec.gallery.title));
    setText('gallery-subtitle', sec.gallery?.subtitle);

    // Location
    if (sec.location?.title) setHTML('location-title', accentTitle(sec.location.title));

    // Contacts
    if (sec.contacts?.title) setHTML('contacts-title', accentTitle(sec.contacts.title));
    setText('contacts-subtitle', sec.contacts?.subtitle);
    setPlaceholder('form-name-input', sec.contacts?.formNameLabel);
    setPlaceholder('form-phone-input', sec.contacts?.formPhoneLabel);
    setText('form-submit-btn', sec.contacts?.formBtnText);

    // Hero secondary button
    const heroSec = data.hero || {};
    setText('hero-btn-secondary', heroSec.secondaryBtnText);
  }

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
    renderSections();
  }

  // ─── Map (Yandex Maps) ──────────────────────────────────────────────────────
  function initMap() {
    const mapEl = document.getElementById('yandex-map');
    if (!mapEl || typeof ymaps === 'undefined') {
      return;
    }
    const d = data.contact;
    const lat = d.mapLat || 55.7961;
    const lng = d.mapLng || 49.1061;

    if (map) { map.destroy(); map = null; }

    try {
      const isDark = document.documentElement.classList.contains('dark');

      map = new ymaps.Map('yandex-map', {
        center: [lat, lng],
        zoom: 15,
        controls: ['zoomControl']
      }, {
        suppressMapOpenBlock: true
      });

      // Disable scroll zoom, allow drag and touch
      map.behaviors.disable('scrollZoom');

      const placemark = new ymaps.Placemark([lat, lng], {
        balloonContent: 'Теплота — инженерные системы',
        hintContent: 'Теплота здесь'
      }, {
        preset: 'islands#redDotIcon',
        iconColor: '#f36e21'
      });

      map.geoObjects.add(placemark);

      // Custom label above pin
      const label = new ymaps.Placemark([lat, lng], {
        iconContent: 'Теплота здесь'
      }, {
        preset: 'islands#orangeStretchyIcon'
      });
      map.geoObjects.add(label);

      // Return map to center after dragging
      let returnTimer = null;
      map.events.add('actionend', () => {
        clearTimeout(returnTimer);
        returnTimer = setTimeout(() => {
          map.panTo([lat, lng], { flying: true, duration: 800 });
        }, 2500);
      });
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
    toast,
    initMap
  };
})();
