const { createClient } = require('@sanity/client');
const imageUrlBuilder = require('@sanity/image-url');
const { toHTML } = require('@portabletext/to-html');
const fs = require('fs');

const client = createClient({
  projectId: '77e5oip8',
  dataset: 'production',
  useCdn: false,
  apiVersion: '2023-05-03',
});

const builder = (imageUrlBuilder.default || imageUrlBuilder)(client);

// Mirrors the browser builder in sanity-client.js: auto('format') serves WebP/AVIF,
// fit('max') caps size without upscaling, quality 75 is visually lossless here.
function urlFor(source, opts = {}) {
  if (!source) return '';
  if (typeof source === 'string') return source;
  try {
    let b = builder.image(source).auto('format').fit('max').quality(opts.quality || 75);
    if (opts.width) b = b.width(opts.width);
    return b.url();
  } catch (e) {
    return '';
  }
}

function renderHTML(blocks) {
    if (!blocks) return '';
    try {
        return toHTML(blocks);
    } catch (e) {
        return '';
    }
}

const query = `{
    "siteSettings": *[_type == "siteSettings"][0],
    "about": *[_type == "about"][0],
    "services": *[_type == "service"],
    "products": *[_type == "product"],
    "gallery": *[_type == "gallery"],
    "advantages": *[_type == "advantage"]
}`;

// CORRECT FALLBACKS for social icons from assets/icons
const DEFAULT_SOCIALS = [
    { icon: 'assets/icons/Vector.png', url: '#', name: 'Social 1' },
    { icon: 'assets/icons/Vector-1.png', url: '#', name: 'Social 2' },
    { icon: 'assets/icons/Vector-2.png', url: '#', name: 'Social 3' }
];

async function sync() {
  try {
    console.log('Syncing data with CORRECT SOCIAL ICONS...');
    const s = await client.fetch(query);
    
    let socials = (s.siteSettings?.footer?.socials || s.siteSettings?.header?.socials || []).map(soc => ({
        ...soc,
        icon: urlFor(soc.icon)
    })).filter(soc => soc.icon);

    if (socials.length === 0) {
        socials = DEFAULT_SOCIALS;
    }

    const data = {
      header: {
        phone: s.siteSettings?.header?.phone || '+7 (927) 432-63-36',
        btnText: s.siteSettings?.header?.btnText || 'Заказать звонок',
        btnUrl: s.siteSettings?.header?.btnUrl || '#contacts',
        navLinks: s.siteSettings?.header?.navLinks || [],
        socials: socials,
        favicon: urlFor(s.siteSettings?.header?.favicon)
      },
      hero: {
        ...s.siteSettings?.hero,
        bg: urlFor(s.siteSettings?.hero?.background, { width: 1920 })
      },
      about: {
        ...s.about,
        image: urlFor(s.about?.image, { width: 900 }),
        text2: renderHTML(s.about?.text2),
        partners: s.about?.partners?.map(p => ({
            ...p,
            img: urlFor(p.img, { width: 240 })
        }))
      },
      advantages: (s.advantages || s.siteSettings?.advantages || []).map(a => ({
          ...a,
          icon: urlFor(a.icon || a.image)
      })),
      services: s.services?.map(item => ({
        id: item._id,
        title: item.title,
        image: urlFor(item.image, { width: 800 }),
        description: renderHTML(item.content) || item.description || '',
        photos: item.photos?.map(p => urlFor(p, { width: 1400 })) || []
      })),
      products: s.products?.map(item => ({
        id: item._id,
        title: item.title,
        image: urlFor(item.image, { width: 800 }),
        description: item.description || '',
        details: renderHTML(item.details) || ''
      })),
      gallery: s.gallery?.map(item => ({
        id: item._id,
        title: item.title,
        description: item.description,
        cover: urlFor(item.cover, { width: 800 }),
        photos: item.photos?.map(p => urlFor(p, { width: 1600 })) || []
      })),
      contact: s.siteSettings?.contact || {
        address: 'г. Казань, ул. Техническая, д. 23',
        email: 'teplota-kzn@mail.ru',
        mapLat: 55.782972,
        mapLng: 49.231998
      },
      footer: {
        copyright: s.siteSettings?.footer?.copyright || '© 2026 Теплота. Все права защищены.',
        links: s.siteSettings?.footer?.links || [
            { label: 'Политика конфиденциальности', url: '#' },
            { label: 'Оферта', url: '#' }
        ],
        socials: socials
      }
    };

    fs.writeFileSync('cms-data.json', JSON.stringify(data, null, 2));
    console.log('SUCCESS: Social icons fixed to local assets fallback.');
  } catch (err) {
    console.error('FAILED to sync:', err.message);
  }
}

sync();
