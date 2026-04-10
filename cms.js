/**
 * TEPLOTA CMS ENGINE
 * cms.js — Integrated with Sanity CMS
 */

import { client, builder } from './sanity-client.js';
import { toHTML } from '@portabletext/to-html';

window.TepCMS = (() => {
  // ─── Default Data ────────────────────────────────────────────────────────────
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
      subtitle: 'Профессиональное проектирование и монтаж систем отопления, водоснабжения и канализации. Создаём уют и тепло в вашем доме более 10 лет.',
      btnText: 'Получить консультацию',
      btnUrl: '#contacts'
    },
    about: {
      label: 'О компании',
      title: 'Более 10 лет *заботимся*\nо вашем комфорте',
      text1: 'Мы специализируемся на проектировании и монтаже инженерных систем любой сложности — от компактных квартир до премиальных загородных домов.',
      text2: 'Наши специалисты проходят регулярную сертификацию у ведущих мировых производителей оборудования, что гарантирует эталонное качество исполнения.',
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
      { id: 1, title: 'Монтаж отопления', image: 'assets/Наши услуги/Frame 20.jpg', description: 'Профессиональный монтаж систем отопления любой сложности. Работаем с частными домами, квартирами и коммерческими объектами.', photos: [] },
      { id: 2, title: 'Водоснабжение', image: 'assets/Наши услуги/Frame 20-1.jpg', description: 'Монтаж систем водоснабжения. Горячая и холодная вода в каждой точке вашего дома.', photos: [] },
      { id: 3, title: 'Канализация', image: 'assets/Наши услуги/Frame 20-2.jpg', description: 'Проектирование и монтаж систем канализации. Работаем аккуратно и в срок.', photos: [] },
      { id: 4, title: 'Проектирование', image: 'assets/Наши услуги/Frame 20-3.jpg', description: 'Комплексное проектирование инженерных сетей с соблюдением всех норм и стандартов.', photos: [] },
      { id: 5, title: 'Сервис', image: 'assets/Наши услуги/Frame 20-4.jpg', description: 'Техническое обслуживание и ремонт инженерного оборудования. Выезд в течение 24 часов.', photos: [] },
      { id: 6, title: 'Котельные', image: 'assets/Наши услуги/image 4.png', description: 'Монтаж и пуско-наладка котельных. От бытовых установок до крупных промышленных объектов.', photos: [] }
    ],
    products: [
      { id: 1, title: 'Трубы', image: 'assets/Товары/Frame 120.png',
        description: 'Гарантия на работы до 3 лет, материалы до 15 лет.',
        details: '' },
      { id: 2, title: 'Арматура', image: 'assets/Товары/Frame 121.png',
        description: 'Запорно-регулирующая арматура от ведущих производителей.',
        details: '' },
      { id: 3, title: 'Фитинги', image: 'assets/Товары/Frame 122.png',
        description: 'Фитинги для труб любой сложности.',
        details: '' },
      { id: 4, title: 'Насосы', image: 'assets/Товары/Frame 123.png',
        description: 'Циркуляционные насосы Grundfos и Wilo.',
        details: '' },
      { id: 5, title: 'Котлы', image: 'assets/Товары/Frame 125.png',
        description: 'Котельная — сердце вашего дома.',
        details: '' },
      { id: 6, title: 'Радиаторы', image: 'assets/Товары/Frame 125-1.png',
        description: 'Индивидуальный подход к проектированию систем ОВК.',
        details: '' },
      { id: 7, title: 'Арматура ОВК', image: 'assets/Товары/Frame 126.png',
        description: 'Вентили и клапаны для точной настройки температуры.',
        details: '' },
      { id: 8, title: 'Водонагреватели', image: 'assets/Товары/Frame 126-1.png',
        description: 'Накопительные и проточные системы для бесперебойной подачи воды.',
        details: '' }
    ],
    gallery: [
      {
        id: 1, title: 'Объект 1', description: 'Монтаж системы отопления в частном доме', cover: 'assets/фото избранное/1/1.jpg',
        photos: [
          'assets/фото избранное/1/1.jpg', 'assets/фото избранное/1/2.jpg',
          'assets/фото избранное/1/3.jpg', 'assets/фото избранное/1/4.jpg'
        ]
      },
      {
        id: 2, title: 'Объект 2', description: 'Комплексная разводка инженерных сетей', cover: 'assets/фото избранное/2/1.jpg',
        photos: [
          'assets/фото избранное/2/1.jpg', 'assets/фото избранное/2/2.jpg',
          'assets/фото избранное/2/3.jpg', 'assets/фото избранное/2/4.jpg',
          'assets/фото избранное/2/5.jpg', 'assets/фото избранное/2/6.jpg'
        ]
      },
      {
        id: 3, title: 'Объект 3', description: 'Котельная под ключ', cover: 'assets/фото избранное/3/1.jpg',
        photos: [
          'assets/фото избранное/3/1.jpg', 'assets/фото избранное/3/2.jpg',
          'assets/фото избранное/3/3.jpg', 'assets/фото избранное/3/4.jpg'
        ]
      },
      {
        id: 4, title: 'Объект 4', description: '', cover: 'assets/фото избранное/4/5436142924502004308.jpg',
        photos: ['assets/фото избранное/4/5436142924502004308.jpg']
      },
      {
        id: 5, title: 'Объект 5', description: '', cover: 'assets/фото избранное/5/5436142924502004322.jpg',
        photos: ['assets/фото избранное/5/5436142924502004322.jpg']
      },
      {
        id: 6, title: 'Объект 6', description: '', cover: 'assets/фото избранное/6/5436142924502004331.jpg',
        photos: ['assets/фото избранное/6/5436142924502004331.jpg']
      }
    ],
    contact: {
      phones: [
        { number: '+7 (843) 000-00-00', label: '' }
      ],
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
      { id: 1, text: 'Скрупулезность и качество - наши главные ориентиры в работе.', icon: 'assets/icons/quality.svg' },
      { id: 2, text: 'Используем качественные высокотехнологичные материалы от проверенных поставщиков.', icon: 'assets/icons/tech.svg' },
      { id: 3, text: 'Гарантия на работы до 3х лет, на материалы — до 15 лет.', icon: 'assets/icons/speed.svg' },
      { id: 4, text: 'Индивидуально проектируем системы от бюджетных до премиальных.', icon: 'assets/icons/team.svg' },
      { id: 5, text: 'Всегда на связи и беремся за задачи любой сложности.', icon: 'assets/icons/support.svg' },
      { id: 6, text: 'Беремся за любую сложность задач.', icon: 'assets/icons/complexity.svg' }
    ]
  };

  // ─── State ────────────────────────────────────────────────────────────────────
  let data = {};
  let editMode = false;
  let map = null, marker = null;
  let previewMode = false;
  let currentGalleryPhotos = [];
  let currentGalleryIndex = 0;
  let lastImagePickerCallback = null;
  let currentPasteHandler = null;
  const SESSION_KEY = 'tep_admin_session';
  const isAdmin = () => sessionStorage.getItem(SESSION_KEY) === 'true';

  // Helper to fix icon paths (Sanity sometimes returns just the filename)
  function fixPath(path, type = 'icon') {
    if (!path || path.startsWith('http') || path.startsWith('data:') || path.startsWith('assets/')) return path;
    if (type === 'icon') return `assets/icons/${path}`;
    if (type === 'partner') return `assets/partner logo/${path}`;
    return `assets/${path}`;
  }

  // ─── Persistence ─────────────────────────────────────────────────────────────
  async function load() {
    try {
      console.log('CMS: Loading from Sanity (Project ID: 77e5oip8)...');
      // GROQ Query to get everything in one request
      const query = `{
          "siteSettings": *[_type == "siteSettings"][0],
          "about": *[_type == "about"][0],
          "services": *[_type == "service"],
          "products": *[_type == "product"],
          "gallery": *[_type == "gallery"],
          "advantages": *[_type == "advantage"]
      }`;
      const s = await client.fetch(query);

      if (s.siteSettings || s.about || (s.services && s.services.length > 0)) {
        // Map Sanity schema to our internal app data structure
        data = {
          header: {
            phone: s.siteSettings?.header?.phone || DEFAULT.header.phone,
            btnText: s.siteSettings?.header?.btnText || DEFAULT.header.btnText,
            btnUrl: s.siteSettings?.header?.btnUrl || DEFAULT.header.btnUrl,
            navLinks: s.siteSettings?.header?.navLinks || DEFAULT.header.navLinks,
            favicon: s.siteSettings?.header?.favicon ? builder.image(s.siteSettings.header.favicon) : '',
            socials: s.siteSettings?.header?.socials?.map(soc => ({
              name: soc.name,
              url: soc.url,
              icon: soc.icon ? builder.image(soc.icon) : ''
            })) || DEFAULT.header.socials
          },
          hero: s.siteSettings?.hero ? {
            title: s.siteSettings.hero.title,
            subtitle: s.siteSettings.hero.subtitle,
            btnText: s.siteSettings.hero.btnText,
            btnUrl: s.siteSettings.hero.btnUrl,
            bg: s.siteSettings.hero.background ? builder.image(s.siteSettings.hero.background) : DEFAULT.hero.bg
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
              name: soc.name,
              url: soc.url,
              icon: soc.icon ? builder.image(soc.icon) : ''
            })) || DEFAULT.footer.socials
          },
          about: {
            label: s.about?.label || DEFAULT.about.label,
            title: s.about?.title || DEFAULT.about.title,
            text1: s.about?.text1 || DEFAULT.about.text1,
            text2: s.about?.text2 ? toHTML(s.about.text2) : DEFAULT.about.text2,
            stats: s.about?.stats || DEFAULT.about.stats,
            partners: s.about?.partners?.map(p => ({
              name: p.name,
              img: p.img ? builder.image(p.img) : ''
            })) || DEFAULT.about.partners
          },
          services: s.services?.map(item => ({
            id: item._id,
            title: item.title,
            image: item.image ? builder.image(item.image) : '',
            description: item.content ? toHTML(item.content) : (item.description || ''),
            photos: item.photos?.map(p => builder.image(p)) || []
          })) || DEFAULT.services,
          products: s.products?.map(item => ({
            id: item._id,
            title: item.title,
            image: item.image ? builder.image(item.image) : '',
            description: item.description,
            details: item.details ? toHTML(item.details) : ''
          })) || DEFAULT.products,
          gallery: s.gallery?.map(item => ({
            id: item._id,
            title: item.title,
            description: item.description,
            cover: item.cover ? builder.image(item.cover) : '',
            photos: item.photos?.map(p => builder.image(p)) || []
          })) || DEFAULT.gallery,
          advantages: s.advantages?.map((item, idx) => ({
            id: item._id || idx,
            title: item.title,
            description: item.description || item.text,
            icon: item.icon ? builder.image(item.icon) : ''
          })) || s.siteSettings?.advantages?.map((item, idx) => ({
            id: idx,
            title: item.title,
            description: item.description || item.text,
            icon: item.icon ? builder.image(item.icon) : ''
          })) || DEFAULT.advantages
        };

        // Ensure header nav links are there
        if (!data.header.navLinks) data.header.navLinks = DEFAULT.header.navLinks;
        
        console.log('CMS: Sanity data loaded and mapped.');
        return;
      }
    } catch (e) {
      console.warn('CMS: Sanity fetch failed or empty, using fallbacks.', e);
    }

    // --- FALLBACK LOGIC (Original) ---
    try {
      const resp = await fetch('/cms-data.json');
      if (resp.ok) {
        data = await resp.json();
        localStorage.setItem('tepData', JSON.stringify(data));
        return;
      }
    } catch (e) {}

    try {
      const saved = localStorage.getItem('tepData');
      if (saved) {
        data = JSON.parse(saved);
        Object.keys(DEFAULT).forEach(key => {
          if (data[key] === undefined) data[key] = JSON.parse(JSON.stringify(DEFAULT[key]));
        });
      } else {
        data = JSON.parse(JSON.stringify(DEFAULT));
      }
    } catch(e) {
      data = JSON.parse(JSON.stringify(DEFAULT));
    }
  }

  async function save() {
    localStorage.setItem('tepData', JSON.stringify(data));
    toast('Сохранено в браузере!', 'success');

    // Attempt to save to disk if running locally
    try {
      const resp = await fetch('/api/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (resp.ok) {
        toast('Сохранено в код (GitHub)!', 'success');
      }
    } catch (e) {
      console.warn('CMS: Disk save unavailable.');
    }
  }

  function exportData() {
    const json = JSON.stringify(data, null, 2);
    console.log('CMS_DATA_EXPORT:', json);
    
    // Create a temporary textarea to copy to clipboard
    const el = document.createElement('textarea');
    el.value = json;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);

    alert('Все измененные данные скопированы в буфер обмена!\n\nВставьте этот текст в чат со мной (Antigravity), чтобы я мог обновить код и сохранить их навсегда (в GitHub).');
  }

  function reset() {
    if (confirm('Сбросить все изменения до исходных настроек?')) {
      localStorage.removeItem('tepData');
      location.reload();
    }
  }

  function preview() {
    previewMode = !previewMode;
    
    // Toggle editor classes and elements
    document.body.classList.toggle('cms-active', !previewMode && editMode);
    
    const previewBtn = document.getElementById('cms-preview-btn');
    if (previewBtn) {
      previewBtn.innerHTML = previewMode ? '✏️ Вернуться к правкам' : '👁 Предпросмотр';
    }

    // Hide/show the bottom toggle button and topbar title
    const toggleBtn = document.getElementById('cms-toggle-btn');
    if (toggleBtn) toggleBtn.style.display = previewMode ? 'none' : (isAdmin() ? 'flex' : 'none');
    
    const topbarTitle = document.querySelector('.cms-topbar-title');
    if (topbarTitle) {
      topbarTitle.innerHTML = previewMode 
        ? '<span>👁</span> Режим предпросмотра — так сайт видят посетители' 
        : '<span>✏️</span> Режим редактора — изменения сохраняются локально';
    }

    // Refresh views to remove/add edit buttons
    renderAll();
    if (!previewMode && editMode) attachInlineEditors();
    
    toast(previewMode ? 'Режим просмотра включен' : 'Возврат в режим редактирования');
  }

  // ─── Toast ────────────────────────────────────────────────────────────────────
  function toast(msg, type = '') {
    const el = document.getElementById('cms-toast');
    el.textContent = msg;
    el.className = 'show ' + type;
    setTimeout(() => el.className = '', 2500);
  }

  // ─── Rich Text Editor helpers ────────────────────────────────────────────────
  // Stores and retrieves raw HTML — no intermediate text conversion.
  function richEditorHTML(id, initialHTML) {
    // initialHTML is raw HTML (may be plain text for backward compat)
    const content = initialHTML || '';
    return `
      <div class="rich-toolbar" data-for="${id}">
        <button type="button" class="rich-btn" title="Жирный" onclick="document.execCommand('bold')"><b>B</b></button>
        <button type="button" class="rich-btn" onclick="document.execCommand('italic')" title="Курсив"><i>I</i></button>
        <button type="button" class="rich-btn" onclick="document.execCommand('insertUnorderedList')" title="Список">≡</button>
        <button type="button" class="rich-btn" onclick="document.execCommand('removeFormat')" title="Очистить форматирование">✕</button>
        <select class="rich-btn" onchange="TepCMS.applyFontSize('${id}', this.value)" title="Размер шрифта">
          <option value="">Размер</option>
          <option value="12">12px</option>
          <option value="14">14px</option>
          <option value="16">16px</option>
          <option value="18">18px</option>
          <option value="20">20px</option>
          <option value="24">24px</option>
          <option value="32">32px</option>
          <option value="48">48px</option>
          <option value="64">64px</option>
        </select>
        <span style="margin-left:auto;font-size:11px;color:#bbb;">Ctrl+B = жирный&nbsp;&nbsp;Enter = новая строка</span>
      </div>
      <div class="rich-editor" id="${id}" contenteditable="true">${content}</div>
    `;
  }

  // Returns cleaned inner HTML from contenteditable
  function getRichEditorValue(id) {
    const el = document.getElementById(id);
    if (!el) return '';
    // Clean up: remove empty trailing <br> tags browsers leave behind
    let html = el.innerHTML
      .replace(/<br\s*\/?>(\s*<br\s*\/?>)+\s*$/gi, '')
      .trim();
    return html;
  }

  function applyFontSize(id, size) {
    if (!size) return;
    const el = document.getElementById(id);
    if (!el) return;
    
    // Focus the editor first to make sure execCommand works on the right place
    el.focus();
    
    // Use a temporary font size to find the selection
    document.execCommand('fontSize', false, '7');
    
    // Find all <font size="7"> elements and replace them with <span style="font-size: ...px">
    const fontEls = el.querySelectorAll('font[size="7"]');
    fontEls.forEach(f => {
      f.removeAttribute('size');
      f.style.fontSize = size + 'px';
      // Change to span if you prefer cleaner HTML, but font with style also works.
      // Let's keep it as is or change to span.
      const span = document.createElement('span');
      span.style.fontSize = size + 'px';
      span.innerHTML = f.innerHTML;
      f.parentNode.replaceChild(span, f);
    });
  }

  // ─── File to Base64 ───────────────────────────────────────────────────────────
  function fileToBase64(file) {
    return new Promise((res, rej) => {
      const reader = new FileReader();
      reader.onload = e => res(e.target.result);
      reader.onerror = rej;
      reader.readAsDataURL(file);
    });
  }

  function pickImage(callback) {
    lastImagePickerCallback = callback;
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async () => {
      if (input.files[0]) {
        const b64 = await fileToBase64(input.files[0]);
        callback(b64);
        lastImagePickerCallback = null;
      }
    };
    input.click();
    toast('Выберите файл или вставьте из буфера (Ctrl+V)', 'success');
  }

  // Handle global paste for images
  window.addEventListener('paste', async e => {
    const isExplicit = !!lastImagePickerCallback;
    const handler = lastImagePickerCallback || currentPasteHandler;
    if (!handler) return;
    
    const clipboardData = e.clipboardData || (e.originalEvent && e.originalEvent.clipboardData);
    if (!clipboardData || !clipboardData.items) return;

    const items = clipboardData.items;
    let found = false;
    for (let item of items) {
      if (item.type.indexOf('image') !== -1) {
        const file = item.getAsFile();
        if (!file) continue;
        const b64 = await fileToBase64(file);
        handler(b64);
        found = true;
        
        if (isExplicit) {
          lastImagePickerCallback = null;
          break; 
        }
      }
    }
    
    if (found) {
      toast('Изображение вставлено!', 'success');
    }
  });

  // ─── Render: Header ──────────────────────────────────────────────────────────
  function renderHeader() {
    const d = data.header;
    const phoneEl = document.getElementById('header-phone-val');
    const favEl = document.getElementById('site-favicon');
    
    if (phoneEl) { 
        phoneEl.href = `tel:${d.phone.replace(/[^+\d]/g, '')}`; 
        phoneEl.textContent = d.phone; 
    }
    if (favEl && d.favicon) {
        favEl.href = d.favicon;
    }
    
    // Header Socials (used in mobile menu)
    const socialEl = document.getElementById('mobile-socials');
    if (socialEl && d.socials) {
       socialEl.innerHTML = d.socials.map(s => `
         <a href="${s.url}" target="_blank" class="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
            <img src="${fixPath(s.icon)}" alt="${s.name}" class="w-5 h-5 object-contain">
         </a>
       `).join('');
    }
  }

  // ─── Render: Hero ────────────────────────────────────────────────────────────
  function renderHero() {
    const d = data.hero;
    const h1 = document.getElementById('hero-title');
    const sub = document.getElementById('hero-subtitle');
    const btn = document.getElementById('hero-btn');
    const bg = document.getElementById('hero-bg');
    
    if (h1) h1.innerHTML = cmsToHtml(d.title);
    if (sub) sub.innerHTML = d.subtitle || '';
    if (btn) { btn.href = d.btnUrl; btn.textContent = d.btnText; }
    if (bg && d.bg) {
      bg.style.backgroundImage = `url(${d.bg})`;
    }
  }

  // ─── Render: About ───────────────────────────────────────────────────────────
  function renderAbout() {
    const d = data.about;
    const lbl = document.getElementById('about-label');
    const ttl = document.getElementById('about-title');
    const t1 = document.getElementById('about-text1');
    const t2 = document.getElementById('about-text2');
    if (lbl) lbl.textContent = d.label;
    if (ttl) ttl.innerHTML = cmsToHtml(d.title);
    if (t1) t1.innerHTML = d.text1 || '';
    if (t2) t2.innerHTML = d.text2 || '';

    const statsEl = document.getElementById('stats-grid');
    if (statsEl) {
      statsEl.innerHTML = d.stats.map((s, i) => `
        <div class="stat-item reveal-item" data-index="${i}" style="position:relative;">
          <div class="text-4xl font-bold text-brand mb-2" data-edit="about.stats.${i}.num">${s.num}</div>
          <div class="text-sm font-medium text-gray-500 uppercase tracking-wide" data-edit="about.stats.${i}.label">${s.label}</div>
          ${editMode ? `<button class="cms-delete-btn" onclick="TepCMS.deleteStat(${i})">×</button>` : ''}
        </div>
      `).join('');
      if (editMode) {
        statsEl.insertAdjacentHTML('beforeend', `<button class="cms-add-btn" onclick="TepCMS.addStat()">+ Статистика</button>`);
      }
    }

    const partnersEl = document.getElementById('partners-grid');
    if (partnersEl) {
      partnersEl.innerHTML = d.partners.map((p, i) => `
        <div class="partner-item" style="position:relative; display:flex; align-items:center; justify-content:center;">
          <img src="${p.img}" alt="${p.name}" class="h-8 object-contain">
          ${editMode ? `
            <button class="cms-delete-btn" onclick="TepCMS.deletePartner(${i})" style="top:50%;transform:translateY(-50%);">×</button>
            <div class="cms-upload-overlay" onclick="TepCMS.uploadPartner(${i})"><span>📷</span> Загрузить</div>
          ` : ''}
        </div>
      `).join('');
      if (editMode) {
        partnersEl.insertAdjacentHTML('beforeend', `<button class="cms-add-btn" onclick="TepCMS.addPartner()">+ Партнёр</button>`);
      }
    }
  }

  // ─── Render: Advantages ─────────────────────────────────────────────────────
  function renderAdvantages() {
    const grid = document.getElementById('advantage-grid');
    if (!grid) return;
    grid.innerHTML = (data.advantages || []).map((a, i) => {
      const isHighlighted = i === 2; // Make the 3rd card highlighted for visual variety
      const cardClass = isHighlighted 
        ? "glass-effect-orange p-8 rounded-2xl shadow-lg transform md:-translate-y-2 reveal-item group transition-all duration-300 hover:scale-[1.02]" 
        : "bg-white p-8 rounded-2xl shadow-sm border border-brand-border hover:shadow-md transition-all duration-300 hover:scale-[1.02] reveal-item group";
      
      const iconContainerClass = "w-14 h-14 mb-6 rounded-2xl flex items-center justify-center transition-colors " + 
        (isHighlighted ? "bg-white/20" : "bg-orange-50 group-hover:bg-orange-100");
      
      const titleClass = isHighlighted ? "text-white font-serif text-xl font-bold mb-3" : "text-gray-900 font-serif text-xl font-bold mb-3";
      const descClass = isHighlighted ? "text-white/80 text-sm leading-relaxed" : "text-gray-600 text-sm leading-relaxed";
      
      const iconHtml = a.icon && a.icon.length > 5 // Check if it's a URL/Path or a simple Emoji
        ? `<img src="${a.icon}" alt="icon" class="w-10 h-10 object-contain" style="${isHighlighted ? 'filter: brightness(0) invert(1);' : ''}">`
        : `<span class="text-3xl">${a.icon || '✨'}</span>`;

      return `
      <div class="${cardClass}" style="position:relative;">
        <div class="${iconContainerClass}">
          ${iconHtml}
        </div>
        <h3 class="${titleClass}">${a.title || 'Преимущество'}</h3>
        <p class="${descClass}">${a.description || a.text || ''}</p>
        ${editMode ? `<button class="cms-delete-btn" onclick="TepCMS.deleteAdvantage(${i})">×</button>` : ''}
      </div>
    `}).join('');
    reObserve();
  }

  // ─── Render: Services ────────────────────────────────────────────────────────
  function renderServices() {
    const grid = document.getElementById('service-grid');
    if (!grid) return;
    grid.innerHTML = data.services.map((s, i) => {
      const isBig = i === 0;
      const gridClasses = isBig 
        ? 'md:col-span-2 md:row-span-2 h-full min-h-[400px]' 
        : 'h-80 md:h-full';
      
      return `
        <div class="group relative ${gridClasses} rounded-2xl overflow-hidden block cursor-pointer reveal-item" style="position:relative;" data-service-id="${s.id}">
          <img src="${s.image}" alt="${s.title}" class="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110">
          <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
          <div class="absolute bottom-0 left-0 p-6 text-white w-full">
            <h3 class="font-bold ${isBig ? 'text-3xl' : 'text-xl'} mb-1">${s.title}</h3>
          </div>
          ${editMode ? `
            <button class="cms-section-btn" data-edit-btn="${s.id}">✏️ Редактировать</button>
            <button class="cms-delete-btn" data-del-btn="${s.id}">×</button>
          ` : ''}
        </div>
      `;
    }).join('');

    // Attach listeners
    grid.querySelectorAll('[data-service-id]').forEach(card => {
      const id = card.dataset.serviceId;
      card.onclick = (e) => {
        TepCMS.openService(id);
      };

      if (editMode) {
        const editBtn = card.querySelector('[data-edit-btn]');
        if (editBtn) editBtn.onclick = (e) => { e.stopPropagation(); TepCMS.editService(id); };
        const delBtn = card.querySelector('[data-del-btn]');
        if (delBtn) delBtn.onclick = (e) => { e.stopPropagation(); TepCMS.deleteService(id); };
      }
    });

    if (editMode) {
      grid.insertAdjacentHTML('beforeend', `<button class="cms-add-btn" id="cms-add-service-btn" style="height:200px;">+ Добавить услугу</button>`);
      const addBtn = document.getElementById('cms-add-service-btn');
      if (addBtn) addBtn.onclick = () => TepCMS.addService();
    }
    reObserve();
  }

  // ─── Render: Products ───────────────────────────────────────────────────────
  function renderProducts() {
    const grid = document.getElementById('product-grid');
    if (!grid) return;
    grid.innerHTML = (data.products || []).map(p => `
      <div class="bg-white rounded-2xl p-6 shadow-sm border border-brand-border flex flex-col items-center cursor-pointer reveal-item" style="position:relative;" data-product-id="${p.id}">
        <div class="h-36 w-full flex items-center justify-center mb-4 relative p-4">
          <img src="${p.image}" alt="${p.name || p.title}" id="prod-img-${p.id}" class="max-h-full max-w-full object-contain transform transition-transform hover:scale-110">
          ${editMode ? `<div class="cms-upload-overlay" data-upload-product="${p.id}"><span>📷</span> Фото</div>` : ''}
        </div>
        <div class="text-center">
          <h4 class="font-bold text-lg mb-1">${p.name || p.title}</h4>
          <p class="text-brand font-semibold mb-4">${p.price || ''}</p>
        </div>
        <button class="w-full py-2 border border-brand text-brand hover:bg-brand hover:text-white rounded-full transition-colors text-sm font-medium mt-auto" onclick="event.stopPropagation(); TepCMS.openProduct(${p.id})">
          Подробнее
        </button>
        ${editMode ? `
          <button class="cms-section-btn" data-edit-product="${p.id}">✏️ Изменить</button>
          <button class="cms-delete-btn" data-del-product="${p.id}">×</button>
        ` : ''}
      </div>
    `).join('');

    // Programmatic listeners
    grid.querySelectorAll('[data-product-id]').forEach(card => {
      const id = card.dataset.productId;
      card.addEventListener('click', (e) => {
        if (editMode) return;
        TepCMS.openProduct(id);
      });
      if (editMode) {
        const editBtn = card.querySelector('[data-edit-product]');
        if (editBtn) editBtn.addEventListener('click', e => { e.stopPropagation(); TepCMS.editProduct(id); });
        const delBtn = card.querySelector('[data-del-product]');
        if (delBtn) delBtn.addEventListener('click', e => { e.stopPropagation(); TepCMS.deleteProduct(id); });
        const uploadBtn = card.querySelector('[data-upload-product]');
        if (uploadBtn) uploadBtn.addEventListener('click', e => { e.stopPropagation(); TepCMS.uploadProductImage(id); });
      }
    });

    if (editMode) {
      const addBtn = document.createElement('button');
      addBtn.className = 'cms-add-btn';
      addBtn.textContent = '+ Добавить товар';
      addBtn.addEventListener('click', () => TepCMS.addProduct());
      grid.appendChild(addBtn);
    }
    reObserve();
  }

  // ─── Open Product Modal (visitor) ────────────────────────────────────────────
  function openProduct(id) {
    const p = data.products.find(x => x.id == id);
    if (!p) return;
    document.getElementById('product-modal-cover').src = p.image;
    document.getElementById('product-modal-title').textContent = p.title;
    // Show full details in modal; stored as raw HTML
    const content = (p.details && p.details.trim()) ? p.details : p.description;
    document.getElementById('product-modal-desc').innerHTML = content;
    document.getElementById('product-modal-overlay').classList.add('open');
  }

  // ─── Edit Product Modal (CMS) ────────────────────────────────────────────────
  function editProduct(id) {
    const p = data.products.find(x => x.id === id);
    if (!p) return;
    const body = `
      <div class="cms-field"><label>Название товара</label><input id="ep-title" value="${p.title.replace(/"/g,'&quot;')}"></div>
      <div class="cms-field">
        <label>Короткое описание <span style="color:#999;font-weight:400;font-size:11px;">— видно на карточке</span></label>
        ${richEditorHTML('ep-desc', p.description)}
      </div>
      <div class="cms-field">
        <label>Подробное описание <span style="color:#999;font-weight:400;font-size:11px;">— видно только в модальном окне</span></label>
        ${richEditorHTML('ep-details', p.details || '')}
      </div>
      <div class="cms-field">
        <label>Фото товара</label>
        <div style="display:flex;align-items:center;gap:12px;">
          <img id="ep-cover-preview" src="${p.image}" style="height:80px;border-radius:8px;object-fit:cover;">
          <button class="cms-btn secondary" id="ep-pick-img">Изменить фото</button>
        </div>
      </div>
    `;
    const sync = () => {
      p.title = document.getElementById('ep-title').value;
      p.description = getRichEditorValue('ep-desc');
      p.details = getRichEditorValue('ep-details');
    };

    openModal('Редактировать товар', body, () => {
      sync();
      renderProducts();
    }, (b64) => {
      sync();
      p.image = b64;
      editProduct(id);
    });
    setTimeout(() => {
      const btn = document.getElementById('ep-pick-img');
      if (btn) btn.onclick = () => pickImage(b64 => {
        p.image = b64;
        const prev = document.getElementById('ep-cover-preview');
        if (prev) prev.src = b64;
      });
    }, 50);
  }

  // ─── Render: Gallery (Works) ────────────────────────────────────────────────
  let galleryInterval = null;
  function renderGallery() {
    const grid = document.getElementById('gallery-grid');
    if (!grid) return;
    
    // Clear interval if exists to prevent duplicates
    if (galleryInterval) clearInterval(galleryInterval);

    grid.innerHTML = (data.gallery || []).map((g, i) => `
      <div class="flex-shrink-0 w-80 md:w-[675px] snap-start rounded-[2.5rem] overflow-hidden relative group cursor-pointer shadow-xl hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] transition-all duration-700 reveal-item active:scale-95" onclick="TepCMS.openGallery('${g.id}')">
        <div class="h-[480px] relative overflow-hidden">
          <img src="${g.cover}" alt="${g.title}" class="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110">
          <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent transition-opacity duration-500 group-hover:from-black/100"></div>
        </div>
        <div class="absolute bottom-0 left-0 p-10 text-white w-full transform transition-transform duration-500 group-hover:-translate-y-2">
          <span class="text-xs font-bold text-brand uppercase tracking-[0.2em] mb-3 block opacity-80 group-hover:opacity-100">Реализованный объект</span>
          <h3 class="font-serif text-3xl font-bold leading-tight group-hover:text-brand-light transition-colors">${g.title}</h3>
        </div>
        ${editMode ? `
          <div class="absolute top-6 right-6 flex gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
            <button class="w-12 h-12 bg-white/90 backdrop-blur shadow-lg rounded-full flex items-center justify-center text-gray-900 border border-gray-200" onclick="event.stopPropagation(); TepCMS.editGallery('${g.id}')">✏️</button>
            <button class="w-12 h-12 bg-white/90 backdrop-blur shadow-lg rounded-full flex items-center justify-center text-red-500 border border-gray-200" onclick="event.stopPropagation(); TepCMS.deleteGallery('${g.id}')">×</button>
          </div>
        ` : ''}
      </div>
    `).join('');

    if (editMode) {
      grid.insertAdjacentHTML('beforeend', `
        <div class="flex-shrink-0 w-80 md:w-[675px] h-[480px] snap-start rounded-[2.5rem] border-4 border-dashed border-gray-200 flex items-center justify-center group cursor-pointer hover:border-brand transition-all bg-gray-50/50" onclick="TepCMS.addGallery()">
          <div class="text-center">
            <span class="text-6xl text-gray-200 group-hover:text-brand transition-colors block mb-4">+</span>
            <span class="text-gray-400 font-bold uppercase tracking-widest text-xs">Добавить проект</span>
          </div>
        </div>
      `);
    }

    // Auto-scroll logic - more subtle
    let scrollDir = 1;
    galleryInterval = setInterval(() => {
        if (!grid) return;
        const maxScroll = grid.scrollWidth - grid.clientWidth;
        if (grid.scrollLeft >= maxScroll - 50) scrollDir = -1;
        if (grid.scrollLeft <= 50) scrollDir = 1;
        grid.scrollBy({ left: 510 * scrollDir, behavior: 'smooth' });
    }, 6000);
    
    reObserve();
  }

  // ─── Render: Contact ────────────────────────────────────────────────────────
  function renderContact() {
    const d = data.contact;
    const container = document.getElementById('contact-phones-list');
    const email = document.getElementById('contact-email');
    const address = document.getElementById('contact-address');
    
    if (container) {
      container.innerHTML = (d.phones || []).map(p => `
        <div class="contact-phone-item flex flex-col">
          <a href="tel:${p.number.replace(/[^+\d]/g,'')}" class="text-2xl font-bold text-gray-900 hover:text-brand">${p.number}</a>
          ${p.label ? `<span class="text-xs text-brand uppercase font-bold tracking-widest">${p.label}</span>` : ''}
        </div>
      `).join('');
    }
    
    if (email) email.innerHTML = `<span class="text-brand">✉</span> ${d.email}`;
    if (address) address.innerHTML = `<span class="text-brand">📍</span> ${d.address}`;
    initMap();
  }

  // ─── Render: Footer ─────────────────────────────────────────────────────────
  function renderFooter() {
    const d = data.footer;
    const copy = document.getElementById('footer-copy');
    if (copy) copy.textContent = d.copyright;

    const linksEl = document.getElementById('footer-links');
    if (linksEl) {
      linksEl.innerHTML = (d.links || []).map((l, i) => `
        <a href="${l.url}" class="hover:text-brand transition-colors" data-footer-link="${i}">${l.label}</a>
      `).join('');
    }
    const socialsEl = document.getElementById('footer-socials');
    if (socialsEl) {
      socialsEl.innerHTML = (d.socials || []).map((s, i) => `
        <a href="${s.url}" target="_blank" class="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-all shadow-sm" style="position:relative;">
          <img src="${fixPath(s.icon)}" alt="${s.name}" class="w-5 h-5 object-contain" style="filter: grayscale(1) brightness(0.3); opacity: 0.7;">
          ${editMode ? `<button class="cms-delete-btn" onclick="TepCMS.deleteFooterSocial(${i})" style="top:-4px;right:-4px;">×</button>` : ''}
        </a>
      `).join('');
    }
  }

  // ─── Render All ─────────────────────────────────────────────────────────────
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
    if (editMode) attachSectionEditButtons();
  }

  // Dynamically inject edit buttons for admins so they don't clutter the base HTML
  function attachSectionEditButtons() {
    const sections = [
      { id: 'main-header', label: 'Шапку', fn: 'editHeader' },
      { sel: '.hero', label: 'Hero', fn: 'editHero' },
      { id: 'about', label: 'О нас', fn: 'editAbout' },
      { id: 'advantages', label: 'Преимущества', fn: 'editAdvantages' },
      { id: 'contacts', label: 'Контакты', fn: 'editContact' },
      { sel: 'footer', label: 'Футер', fn: 'editFooter' }
    ];

    sections.forEach(s => {
      const el = s.id ? document.getElementById(s.id) : document.querySelector(s.sel);
      if (!el) return;
      if (el.querySelector('.cms-section-btn-auto')) return;
      const btn = document.createElement('button');
      btn.className = 'cms-section-btn cms-section-btn-auto';
      btn.innerHTML = `✏️ Редактировать ${s.label}`;
      btn.onclick = () => TepCMS[s.fn]();
      // Adjust positioning
      if (s.id === 'main-header') btn.style.top = '10px';
      if (s.sel === '.hero') btn.style.top = '100px';
      if (s.id === 'about') btn.style.top = '140px';
      el.appendChild(btn);
    });
  }

  // ─── Map (Leaflet) ───────────────────────────────────────────────────────────
  function initMap() {
    const mapEl = document.getElementById('leaflet-map');
    if (!mapEl || typeof L === 'undefined') {
      if (mapEl) mapEl.innerHTML = '<div style="padding:20px; text-align:center; color:#999; border:1px solid #eee; border-radius:12px;">Карта временно недоступна (проверьте подключение к интернету)</div>';
      return;
    }
    const d = data.contact;
    const lat = d.mapLat || (d.coords && d.coords[0]) || 55.7961;
    const lng = d.mapLng || (d.coords && d.coords[1]) || 49.1061;
    
    if (map) { map.remove(); map = null; }
    try {
      map = L.map('leaflet-map').setView([lat, lng], 14);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap'
      }).addTo(map);
      marker = L.marker([lat, lng], { draggable: editMode }).addTo(map);
      if (editMode) {
        marker.on('dragend', e => {
          const pos = marker.getLatLng();
          if (data.contact.coords) data.contact.coords = [pos.lat, pos.lng];
          data.contact.mapLat = pos.lat;
          data.contact.mapLng = pos.lng;
          toast('Позиция маркера обновлена');
        });
        map.on('click', e => {
          marker.setLatLng(e.latlng);
          data.contact.mapLat = e.latlng.lat;
          data.contact.mapLng = e.latlng.lng;
          toast('Пин перемещён. Не забудьте Сохранить!');
        });
      }
    } catch (e) {
      console.error('Map init error:', e);
    }
  }

  // ─── Toggle Edit Mode ────────────────────────────────────────────────────────
  function toggleEdit() {
    editMode = !editMode;
    document.body.classList.toggle('cms-active', editMode);
    document.getElementById('cms-topbar').classList.toggle('visible', editMode);
    document.getElementById('main-header').style.marginTop = editMode ? '56px' : '';
    document.getElementById('cms-toggle-btn').classList.toggle('active', editMode);
    document.getElementById('cms-toggle-btn').innerHTML = editMode
      ? '<span class="btn-icon">✅</span> Режим редактора'
      : '<span class="btn-icon">✏️</span> Редактировать сайт';
    renderAll();
    if (editMode) {
      attachInlineEditors();
    }
  }

  // ─── Inline Text Editors ─────────────────────────────────────────────────────
  function attachInlineEditors() {
    // Make hero text editable
    const heroTitle = document.getElementById('hero-title');
    const heroSub = document.getElementById('hero-subtitle');
    const heroBtn = document.getElementById('hero-btn');
    if (heroTitle) {
      heroTitle.contentEditable = 'true';
      heroTitle.addEventListener('blur', () => { data.hero.title = htmlToCms(heroTitle.innerHTML); });
    }
    if (heroSub) {
      heroSub.contentEditable = 'true';
      heroSub.addEventListener('blur', () => { data.hero.subtitle = heroSub.textContent; });
    }
    // About
    ['about-label','about-text1','about-text2'].forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        el.contentEditable = 'true';
        el.addEventListener('blur', () => {
          if (id === 'about-label') data.about.label = el.textContent;
          if (id === 'about-text1') data.about.text1 = el.textContent;
          if (id === 'about-text2') data.about.text2 = el.textContent;
        });
      }
    });
    // Stat inline edits
    document.querySelectorAll('.stat-num').forEach(el => {
      el.contentEditable = 'true';
      const idx = el.closest('.stat-card')?.dataset.index;
      if (idx !== undefined) el.addEventListener('blur', () => { data.about.stats[idx].num = el.textContent; });
    });
    document.querySelectorAll('.stat-label').forEach(el => {
      el.contentEditable = 'true';
      const idx = el.closest('.stat-card')?.dataset.index;
      if (idx !== undefined) el.addEventListener('blur', () => { data.about.stats[idx].label = el.textContent; });
    });
    // Product inline edits
    document.querySelectorAll('[data-edit^="product."]').forEach(el => {
      el.contentEditable = 'true';
      el.addEventListener('blur', () => {
        const parts = el.dataset.edit.split('.');
        const id = parseInt(parts[1]);
        const field = parts[2];
        const prod = data.products.find(p => p.id === id);
        if (prod) prod[field] = el.textContent;
      });
    });
    // Contact inline
    ['contact-email', 'contact-address'].forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        el.contentEditable = 'true';
        el.addEventListener('blur', () => {
          if (id === 'contact-email') data.contact.email = el.textContent;
          if (id === 'contact-address') data.contact.address = el.textContent;
        });
      }
    });
    // Footer copyright
    const copy = document.getElementById('footer-copy');
    if (copy) {
      copy.contentEditable = 'true';
      copy.addEventListener('blur', () => { data.footer.copyright = copy.textContent; });
    }
    // Section titles
    const svcTitle = document.getElementById('services-title');
    if (svcTitle) { svcTitle.contentEditable = 'true'; svcTitle.addEventListener('blur', () => { data.services_title = htmlToCms(svcTitle.innerHTML); }); }
    const prodTitle = document.getElementById('products-title');
    if (prodTitle) { prodTitle.contentEditable = 'true'; prodTitle.addEventListener('blur', () => { data.products_title = htmlToCms(prodTitle.innerHTML); }); }
  }

  // ─── CMS Modal Helpers ───────────────────────────────────────────────────────
  function openModal(title, bodyHTML, onSave, onPaste = null) {
    document.getElementById('cms-modal-title').textContent = title;
    document.getElementById('cms-modal-body').innerHTML = bodyHTML;
    document.getElementById('cms-modal-overlay').classList.add('open');
    document.getElementById('cms-modal-save').onclick = () => { onSave(); closeModal(); };
    currentPasteHandler = onPaste;
    
    // Add paste hint if supported
    const footer = document.getElementById('cms-modal-footer');
    if (footer && onPaste && !footer.querySelector('.cms-paste-hint')) {
      const hint = document.createElement('span');
      hint.className = 'cms-paste-hint';
      hint.style.cssText = 'font-size:11px; color:#999; margin-right:auto;';
      hint.textContent = 'Можно вставлять фото Ctrl+V';
      footer.prepend(hint);
    }
  }
  function closeModal() { 
    document.getElementById('cms-modal-overlay').classList.remove('open'); 
    lastImagePickerCallback = null; 
    currentPasteHandler = null;
    // Clear hint
    const hint = document.querySelector('.cms-paste-hint');
    if (hint) hint.remove();
  }

  // ─── Services CRUD ───────────────────────────────────────────────────────────
  function openService(id) {
    const s = data.services.find(x => x.id == id);
    if (!s) return;
    console.log('Opening service modal for:', s.title);
    document.getElementById('service-modal-cover').src = s.image;
    document.getElementById('service-modal-title').textContent = s.title;
    
    // Service description is now stored as raw HTML
    const descEl = document.getElementById('service-modal-desc');
    descEl.innerHTML = s.description || '';
    
    const photosEl = document.getElementById('service-modal-photos');
    const photos = s.photos || [];
    photosEl.innerHTML = photos.map(ph => `<img src="${ph}" onclick="TepCMS.viewImage('${ph}')">`).join('');
    document.getElementById('service-modal-overlay').classList.add('open');
  }

  // Helper to format text into paragraphs and lists
  function formatDescription(text) {
    if (!text) return '';
    // Apply bold replacement (*text* -> <span>text</span>)
    const processed = text.replace(/\*([^\*]+)\*/g, '<span>$1</span>');
    const lines = processed.split('\n');
    let html = '';
    let inList = false;

    lines.forEach(line => {
      const trimmed = line.trim();
      if (!trimmed) {
        if (inList) { html += '</ul>'; inList = false; }
        return;
      }

      if (trimmed.startsWith('-') || trimmed.startsWith('—')) {
        if (!inList) { html += '<ul>'; inList = true; }
        html += `<li>${trimmed.substring(1).trim()}</li>`;
      } else {
        if (inList) { html += '</ul>'; inList = false; }
        html += `<p>${trimmed}</p>`;
      }
    });

    if (inList) html += '</ul>';
    return html;
  }

  function cmsToHtml(text) {
    if (!text) return '';
    // If it already contains HTML tags, return as is (to support font-size spans)
    if (text.includes('<') && text.includes('>')) return text;
    return text.split('\n').map(l => {
      let line = l.trim();
      return line.replace(/\*([^\*]+)\*/g, '<span>$1</span>');
    }).join('<br>');
  }

  function htmlToCms(html) {
    if (!html) return '';
    // If it contains styles, don't convert spans to asterisks
    if (html.includes('style=')) return html.replace(/<br\s*\/?>/gi, '\n');
    return html
      .replace(/<span>(.*?)<\/span>/gi, '*$1*')
      .replace(/<br\s*\/?>/gi, '\n');
  }

  function editService(id) {
    const s = data.services.find(x => x.id === id);
    if (!s) return;
    const body = `
      <div class="cms-field"><label>Название</label><input id="es-title" value="${s.title.replace(/"/g,'&quot;')}"></div>
      <div class="cms-field">
        <label>Описание (новая строка = новый абзац, «- пункт» = список)</label>
        ${richEditorHTML('es-desc', s.description)}
      </div>
      <div class="cms-field">
        <label>Обложка</label>
        <div style="display:flex;align-items:center;gap:12px;">
          <img id="es-cover-preview" src="${s.image}" style="height:80px;border-radius:8px;object-fit:cover;">
          <button class="cms-btn secondary" onclick="TepCMS._pickServiceCover(${id})">Изменить фото</button>
        </div>
      </div>
      <div class="cms-field">
        <label>Фотографии в модальном окне</label>
        <div class="cms-photo-grid" id="es-photos">
          ${(s.photos||[]).map((ph, i) => `
            <div class="cms-photo-item">
              <img src="${ph}">
              <button class="cms-delete-btn" onclick="TepCMS._deleteServicePhoto(${id}, ${i})">×</button>
            </div>
          `).join('')}
          <div class="cms-photo-add" onclick="TepCMS._addServicePhoto(${id})"><span>+</span> Добавить фото</div>
        </div>
      </div>
    `;
    const sync = () => {
      s.title = document.getElementById('es-title').value;
      s.description = getRichEditorValue('es-desc');
    };

    openModal('Редактировать услугу', body, () => {
      sync();
      renderServices();
    }, (b64) => {
      sync();
      s.photos.push(b64);
      editService(id);
    });
  }

  function _pickServiceCover(id) {
    pickImage(b64 => {
      const s = data.services.find(x => x.id === id);
      if (s) { s.image = b64; document.getElementById('es-cover-preview').src = b64; }
    });
  }
  function _addServicePhoto(id) {
    pickImage(b64 => {
      const s = data.services.find(x => x.id === id);
      if (s) { s.photos.push(b64); editService(id); }
    });
  }
  function _deleteServicePhoto(id, idx) {
    const s = data.services.find(x => x.id === id);
    if (s) { s.photos.splice(idx, 1); editService(id); }
  }
  function deleteService(id) {
    if (confirm('Удалить эту услугу?')) { 
      data.services = data.services.filter(s => s.id !== id); 
      renderServices(); 
      toast('Услуга удалена. Не забудьте сохранить!');
    }
  }
  function addService() {
    const newId = Date.now();
    data.services.push({ id: newId, title: 'Новая услуга', image: 'assets/Наши услуги/Frame 20.jpg', description: 'Описание услуги...', photos: [] });
    renderServices();
    editService(newId);
  }

  // ─── Products CRUD ───────────────────────────────────────────────────────────
  function uploadProductImage(id) {
    pickImage(b64 => {
      const p = data.products.find(x => x.id === id);
      if (p) { p.image = b64; const imgEl = document.getElementById(`prod-img-${id}`); if (imgEl) imgEl.src = b64; }
    });
  }
  function deleteProduct(id) {
    if (confirm('Удалить этот товар?')) { 
      data.products = data.products.filter(p => p.id !== id); 
      renderProducts(); 
      toast('Товар удален. Не забудьте сохранить!');
    }
  }
  function addProduct() {
    const newId = Date.now();
    data.products.push({ id: newId, title: 'Новый товар', image: 'assets/Товары/Frame 120.png', description: 'Короткое описание...', details: '' });
    renderProducts();
    editProduct(newId);
  }

  // ─── About CRUD ──────────────────────────────────────────────────────────────
  function addStat() {
    data.about.stats.push({ num: '0', label: 'Новая статистика' });
    renderAbout();
    if (editMode) attachInlineEditors();
  }
  function deleteStat(i) {
    data.about.stats.splice(i, 1);
    renderAbout();
    if (editMode) attachInlineEditors();
  }
  function uploadPartner(i) {
    pickImage(b64 => { data.about.partners[i].img = b64; renderAbout(); });
  }
  function deletePartner(i) {
    if (confirm('Удалить партнёра?')) { data.about.partners.splice(i, 1); renderAbout(); }
  }
  function addPartner() {
    pickImage(b64 => {
      const name = prompt('Название партнёра:') || 'Партнёр';
      data.about.partners.push({ img: b64, name });
      renderAbout();
    });
  }

  // ─── Gallery Slider logic ───────────────────────────────────────────────────
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
    if (img) img.src = photo.url;
    if (counter) counter.textContent = `${currentGalleryIndex + 1} / ${currentGalleryPhotos.length}`;
    
    if (cap) {
      if (photo.caption && photo.caption.trim()) {
        cap.textContent = photo.caption;
        cap.classList.add('show');
      } else {
        cap.classList.remove('show');
      }
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

  // Keyboard navigation for gallery
  window.addEventListener('keydown', e => {
    const overlay = document.getElementById('gallery-modal-overlay');
    if (overlay && overlay.classList.contains('open')) {
      if (e.key === 'ArrowRight') galleryNext();
      if (e.key === 'ArrowLeft') galleryPrev();
      if (e.key === 'Escape') overlay.classList.remove('open');
    }
  });

  function editGallery(id) {
    const g = data.gallery.find(x => x.id == id);
    if (!g) return;
    const body = `
      <div class="cms-field"><label>Название проекта</label><input id="eg-title" value="${g.title}"></div>
      <div class="cms-field"><label>Описание проекта</label><textarea id="eg-desc">${g.description}</textarea></div>
      <div class="cms-field">
        <label>Обложка</label>
        <div style="display:flex;align-items:center;gap:12px;">
          <img id="eg-cover" src="${g.cover}" style="height:80px;border-radius:8px;object-fit:cover;">
          <button class="cms-btn secondary" onclick="TepCMS._pickGalleryCover(${id})">Изменить обложку</button>
        </div>
      </div>
      <div class="cms-field">
        <label>Фотографии проекта</label>
        <div class="cms-photo-grid" id="eg-photos">
          ${g.photos.map((ph, i) => `
            <div class="cms-photo-item">
              <img src="${ph.url}">
              <input type="text" placeholder="Описание..." value="${ph.caption || ''}" 
                onchange="TepCMS._updateGalleryCaption(${id}, ${i}, this.value)"
                style="width:100%;font-size:11px;padding:4px;margin-top:4px;border:1px solid #ddd;border-radius:4px;">
              <button class="cms-delete-btn" onclick="TepCMS._deleteGalleryPhoto(${id}, ${i})">×</button>
            </div>
          `).join('')}
          <div class="cms-photo-add" onclick="TepCMS._addGalleryPhoto(${id})"><span>+</span> Добавить фото</div>
        </div>
      </div>
    `;
    const sync = () => {
      g.title = document.getElementById('eg-title').value;
      g.description = document.getElementById('eg-desc').value;
    };

    openModal('Редактировать галерею', body, () => {
      sync();
      renderGallery();
    }, (b64) => {
      sync();
      g.photos.push({ url: b64, caption: '' });
      editGallery(id);
    });
  }
  function _pickGalleryCover(id) {
    pickImage(b64 => { const g = data.gallery.find(x => x.id === id); if (g) { g.cover = b64; document.getElementById('eg-cover').src = b64; } });
  }
  function _addGalleryPhoto(id) {
    pickImage(b64 => { const g = data.gallery.find(x => x.id === id); if (g) { g.photos.push({ url: b64, caption: '' }); editGallery(id); } });
  }
  function _updateGalleryCaption(id, idx, val) {
    const g = data.gallery.find(x => x.id == id);
    if (g && g.photos[idx]) g.photos[idx].caption = val;
  }
  function _deleteGalleryPhoto(id, idx) {
    const g = data.gallery.find(x => x.id == id);
    if (g) { g.photos.splice(idx, 1); editGallery(id); }
  }
  function deleteGallery(id) {
    if (confirm('Удалить эту галерею?')) { 
      data.gallery = data.gallery.filter(g => g.id !== id); 
      renderGallery(); 
      toast('Проект удален. Не забудьте сохранить!');
    }
  }
  function addGallery() {
    const newId = Date.now();
    data.gallery.push({ id: newId, title: 'Новый проект', description: '', cover: 'assets/фото избранное/1/1.jpg', photos: [] });
    renderGallery();
    editGallery(newId);
  }

  // ─── Header Edit ─────────────────────────────────────────────────────────────
  function editHeader() {
    const d = data.header;
    const body = `
      <div class="cms-field"><label>Телефон</label><input id="eh-phone" value="${d.phone}"></div>
      <div class="cms-field"><label>Текст кнопки</label><input id="eh-btn-text" value="${d.btnText}"></div>
      <div class="cms-field"><label>Ссылка кнопки</label><input id="eh-btn-url" value="${d.btnUrl}"></div>
      <div class="cms-field">
        <label>Пункты меню</label>
        <div id="eh-nav-links">
          ${d.navLinks.map((l, i) => `
            <div class="cms-social-item">
              <input placeholder="Название" value="${l.label}" onchange="TepCMS._updateNavLink(${i}, 'label', this.value)">
              <input placeholder="URL (напр. #about)" value="${l.url}" onchange="TepCMS._updateNavLink(${i}, 'url', this.value)">
              <button onclick="TepCMS._deleteNavLink(${i})" style="background:#fee;border:none;padding:6px 10px;border-radius:6px;cursor:pointer;color:#e53935;">×</button>
            </div>
          `).join('')}
        </div>
        <button class="cms-btn secondary" onclick="TepCMS._addNavLink()" style="margin-top:10px;">+ Добавить пункт</button>
      </div>
    `;
    openModal('Редактировать шапку', body, () => {
      d.phone = document.getElementById('eh-phone').value;
      d.btnText = document.getElementById('eh-btn-text').value;
      d.btnUrl = document.getElementById('eh-btn-url').value;
      renderHeader();
    });
  }

  function _updateNavLink(i, field, val) { data.header.navLinks[i][field] = val; }
  function _deleteNavLink(i) { data.header.navLinks.splice(i, 1); editHeader(); }
  function _addNavLink() { data.header.navLinks.push({ label: 'Новый раздел', url: '#' }); editHeader(); }
  function _updateSocial(i, val) { data.header.socials[i].url = val; }
  function _deleteHeaderSocial(i) { data.header.socials.splice(i, 1); editHeader(); }
  function _addHeaderSocial() {
    pickImage(b64 => {
      const url = prompt('URL профиля (напр. https://vk.com/...):') || '#';
      data.header.socials.push({ icon: b64, url, name: 'Social' });
      editHeader();
    });
  }
  function _changeHeaderIcon(i) {
    pickImage(b64 => { data.header.socials[i].icon = b64; editHeader(); });
  }

  // ─── Footer Edit ─────────────────────────────────────────────────────────────
  function editFooter() {
    const d = data.footer;
    const body = `
      <div class="cms-field"><label>Текст копирайта</label><input id="ef-copy" value="${d.copyright}"></div>
      <div class="cms-field">
        <label>Ссылки в футере</label>
        <div id="ef-links">
          ${d.links.map((l, i) => `
            <div class="cms-social-item">
              <input placeholder="Название" value="${l.label}" onchange="TepCMS._updateFooterLink(${i}, 'label', this.value)">
              <input placeholder="URL" value="${l.url}" onchange="TepCMS._updateFooterLink(${i}, 'url', this.value)">
              <button onclick="TepCMS._deleteFooterLink(${i})" style="background:#fee;border:none;padding:6px 10px;border-radius:6px;cursor:pointer;color:#e53935;">×</button>
            </div>
          `).join('')}
        </div>
        <button class="cms-btn secondary" onclick="TepCMS._addFooterLink()" style="margin-top:8px;">+ Ссылка</button>
      </div>
      <div class="cms-field">
        <label>Соц. иконки в футере</label>
        <div id="ef-socials">
          ${d.socials.map((s, i) => `
            <div class="cms-social-item">
              <img src="${s.icon}" style="width:24px;height:24px;object-fit:contain;border:1px solid #eee;border-radius:4px;">
              <input placeholder="URL профиля" value="${s.url}" onchange="TepCMS._updateFooterSocial(${i}, this.value)">
              <button onclick="TepCMS._changeFooterIcon(${i})" class="cms-btn secondary">🖼</button>
              <button onclick="TepCMS._deleteFooterSocial(${i})" style="background:#fee;border:none;padding:6px 10px;border-radius:6px;cursor:pointer;color:#e53935;">×</button>
            </div>
          `).join('')}
        </div>
        <button class="cms-btn secondary" onclick="TepCMS._addFooterSocial()" style="margin-top:8px;">+ Соцсеть</button>
      </div>
    `;
    openModal('Редактировать футер', body, () => {
      d.copyright = document.getElementById('ef-copy').value;
      renderFooter();
    });
  }

  function _updateFooterLink(i, field, val) { data.footer.links[i][field] = val; }
  function _deleteFooterLink(i) { data.footer.links.splice(i, 1); editFooter(); }
  function _addFooterLink() { data.footer.links.push({ label: 'Новая ссылка', url: '#' }); editFooter(); }
  function _updateFooterSocial(i, val) { data.footer.socials[i].url = val; }
  function _deleteFooterSocial(i) { data.footer.socials.splice(i, 1); editFooter(); }
  function _addFooterSocial() {
    pickImage(b64 => {
      const url = prompt('URL профиля (напр. https://t.me/...):') || '#';
      data.footer.socials.push({ icon: b64, url, name: 'Social' });
      renderFooter();
    });
  }
  function _changeFooterIcon(i) {
    pickImage(b64 => { data.footer.socials[i].icon = b64; editFooter(); });
  }

  function addFooterLink() { data.footer.links.push({ label: 'Новая ссылка', url: '#' }); renderFooter(); }
  function deleteFooterSocial(i) { data.footer.socials.splice(i, 1); renderFooter(); }
  function addFooterSocial() {
    pickImage(b64 => {
      const url = prompt('URL профиля:') || '#';
      data.footer.socials.push({ icon: b64, url, name: 'Social' });
      renderFooter();
    });
  }

  // ─── Image Viewer ────────────────────────────────────────────────────────────
  function viewImage(src) {
    const overlay = document.getElementById('img-viewer-overlay');
    overlay.querySelector('img').src = src;
    overlay.classList.add('open');
  }

  // ─── Edit Hero Modal ──────────────────────────────────────────────────────────
  function editHero() {
    const d = data.hero;
    const body = `
      <div class="cms-field">
        <label>Заголовок</label>
        <p style="font-size:11px;color:#999;margin-bottom:5px;">Используйте *слово* для выделения цветом или выберите размер шрифта.</p>
        ${richEditorHTML('eh2-title', d.title)}
      </div>
      <div class="cms-field">
        <label>Подзаголовок</label>
        ${richEditorHTML('eh2-sub', d.subtitle)}
      </div>
      <div class="cms-field"><label>Текст кнопки</label><input id="eh2-btn-text" value="${d.btnText}"></div>
      <div class="cms-field"><label>Ссылка кнопки</label><input id="eh2-btn-url" value="${d.btnUrl}"></div>
    `;
    const sync = () => {
      d.title = getRichEditorValue('eh2-title');
      d.subtitle = getRichEditorValue('eh2-sub');
      d.btnText = document.getElementById('eh2-btn-text').value;
      d.btnUrl = document.getElementById('eh2-btn-url').value;
    };
    openModal('Редактировать главный экран', body, () => {
      sync();
      renderHero();
    });
  }

  // ─── Edit About Modal ─────────────────────────────────────────────────────────
  function editAbout() {
    const d = data.about;
    const body = `
      <div class="cms-field"><label>Метка раздела</label><input id="ea-label" value="${d.label}"></div>
      <div class="cms-field">
        <label>Заголовок</label>
        <p style="font-size:11px;color:#999;margin-bottom:5px;">Используйте *слово* для выделения цветом или выберите размер шрифта.</p>
        ${richEditorHTML('ea-title', d.title)}
      </div>
      <div class="cms-field">
        <label>Текст 1 (основной)</label>
        ${richEditorHTML('ea-text1', d.text1)}
      </div>
      <div class="cms-field">
        <label>Текст 2 (дополнительный)</label>
        ${richEditorHTML('ea-text2', d.text2)}
      </div>
    `;
    const sync = () => {
      d.label = document.getElementById('ea-label').value;
      d.title = getRichEditorValue('ea-title');
      d.text1 = getRichEditorValue('ea-text1');
      d.text2 = getRichEditorValue('ea-text2');
    };
    openModal('Редактировать О компании', body, () => {
      sync();
      renderAbout();
      if (editMode) attachInlineEditors();
    });
  }

  // ─── Advantages CRUD ────────────────────────────────────────────────────────
  function editAdvantages() {
    const list = data.advantages || [];
    const body = `
      <div id="adv-editor-list">
        ${list.map((a, i) => `
          <div class="cms-field" style="border: 1px solid #eee; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
            <div style="display:flex; gap:10px; margin-bottom:10px;">
              <div style="flex: 0 0 60px;">
                <label>Иконка</label>
                <input type="text" class="adv-icon-input" value="${a.icon||'✨'}" style="text-align:center; font-size:20px;">
              </div>
              <div style="flex: 1;">
                <label>Текст преимущества</label>
                <textarea class="adv-text-input" style="min-height:60px;">${a.text}</textarea>
              </div>
            </div>
            <button class="cms-btn secondary" onclick="TepCMS.deleteAdvantage(${i}); TepCMS.editAdvantages();" style="width:100%;">Удалить это преимущество</button>
          </div>
        `).join('')}
      </div>
      <button class="cms-btn" onclick="TepCMS.addAdvantage(); TepCMS.editAdvantages();" style="width:100%; border:2px dashed var(--primary-accent); background:none; color:var(--primary-accent);">+ Добавить новое преимущество</button>
    `;
    openModal('Редактировать преимущества', body, () => {
      const texts = document.querySelectorAll('.adv-text-input');
      const icons = document.querySelectorAll('.adv-icon-input');
      data.advantages = [];
      texts.forEach((el, i) => {
        data.advantages.push({ id: Date.now() + i, text: el.value, icon: icons[i].value });
      });
      renderAdvantages();
    });
  }

  function addAdvantage() {
    if (!data.advantages) data.advantages = [];
    data.advantages.push({ id: Date.now(), text: 'Новое преимущество...', icon: '✨' });
    renderAdvantages();
  }

  function deleteAdvantage(i) {
    if (confirm('Удалить это преимущество?')) {
      data.advantages.splice(i, 1);
      renderAdvantages();
    }
  }

  // ─── Edit Contact Modal ───────────────────────────────────────────────────────
  function editContact() {
    const d = data.contact;
    const body = `
      <div class="cms-field">
        <label>Список телефонов</label>
        <div id="ec-phones-list">
          ${(d.phones || []).map((p, i) => `
            <div class="cms-social-item" style="margin-bottom:8px;">
              <input placeholder="Номер телефона" value="${p.number}" onchange="TepCMS._updateContactPhone(${i}, 'number', this.value)">
              <input placeholder="Описание (напр. отдел продаж)" value="${p.label || ''}" onchange="TepCMS._updateContactPhone(${i}, 'label', this.value)">
              <button onclick="TepCMS._deleteContactPhone(${i})" class="cms-delete-btn" style="position:static;">×</button>
            </div>
          `).join('')}
        </div>
        <button class="cms-btn secondary" onclick="TepCMS._addContactPhone()" style="margin-top:5px;">+ Добавить телефон</button>
      </div>
      <div class="cms-field"><label>Email</label><input id="ec-email" value="${d.email}"></div>
      <div class="cms-field"><label>Адрес</label><input id="ec-address" value="${d.address}"></div>
      <div class="cms-field">
        <label>Карта — кликните на карте чтобы переместить пин</label>
        <p style="font-size:13px;color:#999;margin-bottom:8px;">Широта: <strong id="ec-lat">${d.mapLat.toFixed(5)}</strong>, Долгота: <strong id="ec-lng">${d.mapLng.toFixed(5)}</strong></p>
      </div>
    `;
    openModal('Редактировать контакты', body, () => {
      d.email = document.getElementById('ec-email').value;
      d.address = document.getElementById('ec-address').value;
      renderContact();
    });
    // Activate map click mode for coordinate selection
    if (map) {
      toast('Кликните на карте, чтобы переместить пин', '');
    }
  }

  function _updateContactPhone(i, field, val) { data.contact.phones[i][field] = val; }
  function _deleteContactPhone(i) { data.contact.phones.splice(i, 1); editContact(); }
  function _addContactPhone() { 
    if(!data.contact.phones) data.contact.phones = [];
    data.contact.phones.push({ number: '', label: '' }); 
    editContact(); 
  }

  // ─── Scroll Reveal Re-init ───────────────────────────────────────────────────
  function reObserve() {
    if (!window.revealObserver) return;
    document.querySelectorAll('.reveal-item').forEach(el => {
      el.classList.remove('active');
      window.revealObserver.observe(el);
    });
  }

  // ─── Public API ──────────────────────────────────────────────────────────────
  return {
    async init() {
      console.log('TepCMS: Initializing...');
      await load();

      // Check admin auth — URL ?admin=1 activates edit mode only if session is valid
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get('admin') === '1') {
        if (sessionStorage.getItem('tep_admin_session') === 'true') {
          renderAll();
          // Show logout button in topbar
          const topbarActions = document.getElementById('cms-topbar-actions');
          if (topbarActions && !topbarActions.querySelector('#cms-logout-btn')) {
            const logoutBtn = document.createElement('button');
            logoutBtn.id = 'cms-logout-btn';
            logoutBtn.className = 'cms-topbar-btn';
            logoutBtn.textContent = '🚪 Выйти';
            logoutBtn.onclick = () => TepCMS.logout();
            topbarActions.prepend(logoutBtn);
          }
          // Auto-enable edit mode for admin
          setTimeout(() => {
            editMode = true;
            document.body.classList.add('cms-active');
            document.getElementById('cms-topbar').classList.add('visible');
            const hdr = document.getElementById('main-header');
            if (hdr) hdr.style.marginTop = '56px';
            const toggleBtn = document.getElementById('cms-toggle-btn');
            if (toggleBtn) {
              toggleBtn.classList.add('active');
              toggleBtn.innerHTML = '<span class="btn-icon">✅</span> Режим редактора';
            }
            renderAll();
            attachInlineEditors();
          }, 0);
        } else {
          // Not authenticated — redirect to admin login
          window.location.href = '/admin.html';
          return;
        }
      } else {
        // Normal public visitor — render without edit mode
        renderAll();
        // Hide the edit toggle button from public visitors
        const toggleBtn = document.getElementById('cms-toggle-btn');
        if (toggleBtn) toggleBtn.style.display = 'none';
      }

      console.log('TepCMS: Ready.');
    },
    logout() {
      sessionStorage.removeItem('tep_admin_session');
      // Remove ?admin=1 from URL and reload
      const url = new URL(window.location.href);
      url.searchParams.delete('admin');
      window.location.href = url.toString();
    },
    toggleEdit, save, reset, preview, applyFontSize, exportData,
    openService, editService, deleteService, addService,
    openProduct, editProduct,
    _pickServiceCover, _addServicePhoto, _deleteServicePhoto,
    uploadProductImage, deleteProduct, addProduct,
    addStat, deleteStat, uploadPartner, deletePartner, addPartner,
    openGallery, editGallery, deleteGallery, addGallery,
    galleryNext, galleryPrev,
    _pickGalleryCover, _addGalleryPhoto, _deleteGalleryPhoto, _updateGalleryCaption,
    editHero, editAbout, editAdvantages, editContact,
    editHeader, editFooter,
    _updateNavLink, _deleteNavLink, _addNavLink,
    _updateSocial, _deleteHeaderSocial, _addHeaderSocial, _changeHeaderIcon,
    _updateFooterLink, _deleteFooterLink, _addFooterLink,
    _updateFooterSocial, _deleteFooterSocial, _addFooterSocial, _changeFooterIcon,
    addFooterLink, deleteFooterSocial, addFooterSocial,
    deleteAdvantage, addAdvantage,
    _updateContactPhone, _deleteContactPhone, _addContactPhone,
    viewImage
  };
})();
