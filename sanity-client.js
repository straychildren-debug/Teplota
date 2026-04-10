import { createClient } from '@sanity/client'
import imageUrlBuilder from '@sanity/image-url'

export const client = createClient({
  projectId: '77e5oip8',
  dataset: 'production',
  useCdn: true,
  apiVersion: '2023-05-03',
})

const urlBuilder = imageUrlBuilder(client)

export const builder = {
  image: (source) => {
    if (!source) return '';
    if (typeof source === 'string') return source;
    
    // Check if it's an asset with a direct URL (like SVGs often have)
    if (source.asset && source.asset.url) return source.asset.url;

    try {
      const b = urlBuilder.image(source);
      // Only call .url() if the builder object exists and has it
      return b && typeof b.url === 'function' ? b.url() : '';
    } catch (e) {
      console.warn('Sanity Image Builder error:', e);
      return '';
    }
  }
}
