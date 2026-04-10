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

// Helper to convert Sanity Portable Text to HTML
function renderHTML(blocks) {
    if (!blocks) return '';
    try {
        return toHTML(blocks);
    } catch (e) {
        console.warn('PortableText Error:', e.message);
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

async function sync() {
  try {
    console.log('Fetching and converting RICH data from Sanity...');
    const s = await client.fetch(query);
    
    const data = {
      header: {
        phone: s.siteSettings?.header?.phone,
        btnText: s.siteSettings?.header?.btnText,
        btnUrl: s.siteSettings?.header?.btnUrl,
        navLinks: s.siteSettings?.header?.navLinks,
        socials: s.siteSettings?.header?.socials?.map(soc => ({
            ...soc,
            icon: urlFor(soc.icon)
        })),
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
      contact: s.siteSettings?.contact || {},
      footer: {
        ...s.siteSettings?.footer,
        socials: s.siteSettings?.footer?.socials?.map(soc => ({
            ...soc,
            icon: urlFor(soc.icon)
        }))
      }
    };

    fs.writeFileSync('cms-data.json', JSON.stringify(data, null, 2));
    console.log('SUCCESS: cms-data.json updated with RICH content (Portable Text)!');
  } catch (err) {
    console.error('FAILED to sync:', err.message);
  }
}

sync();
