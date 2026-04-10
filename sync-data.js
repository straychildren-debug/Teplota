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

function urlFor(source) {
  if (!source) return '';
  if (typeof source === 'string') return source;
  try {
    return builder.image(source).url();
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

const DEFAULT_SOCIALS = [
    { icon: 'https://cdn.sanity.io/images/77e5oip8/production/cc60a68f537a4e1dafba7b9252d294b419bdd3ab-48x48.svg', url: '#', name: 'VK' },
    { icon: 'https://cdn.sanity.io/images/77e5oip8/production/cfa419c227f66a7aa257d9574ae85c3c9da3fe6e-48x48.svg', url: '#', name: 'Telegram' },
    { icon: 'https://cdn.sanity.io/images/77e5oip8/production/2bb0f13c3944af0e76811c117c904a8e19180714-48x48.svg', url: '#', name: 'WhatsApp' }
];

async function sync() {
  try {
    console.log('Syncing data with proper fallbacks...');
    const s = await client.fetch(query);
    
    // Fallback socials derived from header if footer socials are empty
    const socials = (s.siteSettings?.footer?.socials || s.siteSettings?.header?.socials || []).map(soc => ({
        ...soc,
        icon: urlFor(soc.icon)
    }));

    const data = {
      header: {
        phone: s.siteSettings?.header?.phone || '+7 (927) 432-63-36',
        btnText: s.siteSettings?.header?.btnText || 'Заказать звонок',
        btnUrl: s.siteSettings?.header?.btnUrl || '#contacts',
        navLinks: s.siteSettings?.header?.navLinks || [],
        socials: socials.length ? socials : DEFAULT_SOCIALS,
        favicon: urlFor(s.siteSettings?.header?.favicon)
      },
      hero: {
        ...s.siteSettings?.hero,
        bg: urlFor(s.siteSettings?.hero?.background)
      },
      about: {
        ...s.about,
        text2: renderHTML(s.about?.text2),
        partners: s.about?.partners?.map(p => ({
            ...p,
            img: urlFor(p.img)
        }))
      },
      advantages: (s.advantages || s.siteSettings?.advantages || []).map(a => ({
          ...a,
          icon: urlFor(a.icon || a.image)
      })),
      services: s.services?.map(item => ({
        id: item._id,
        title: item.title,
        image: urlFor(item.image),
        description: renderHTML(item.content) || item.description || '',
        photos: item.photos?.map(p => urlFor(p)) || []
      })),
      products: s.products?.map(item => ({
        id: item._id,
        title: item.title,
        image: urlFor(item.image),
        description: item.description || '',
        details: renderHTML(item.details) || ''
      })),
      gallery: s.gallery?.map(item => ({
        id: item._id,
        title: item.title,
        description: item.description,
        cover: urlFor(item.cover),
        photos: item.photos?.map(p => urlFor(p)) || []
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
        socials: socials.length ? socials : DEFAULT_SOCIALS
      }
    };

    fs.writeFileSync('cms-data.json', JSON.stringify(data, null, 2));
    console.log('SUCCESS: Data synced with fallbacks ensured.');
  } catch (err) {
    console.error('FAILED to sync:', err.message);
  }
}

sync();
