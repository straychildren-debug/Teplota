import { createClient } from '@sanity/client'
import { createImageUrlBuilder } from '@sanity/image-url'

export const client = createClient({
  projectId: '77e5oip8',
  dataset: 'production',
  useCdn: true,
  apiVersion: '2023-05-03',
})

const urlBuilder = createImageUrlBuilder(client)

export const builder = {
  // opts.width — cap the delivered width (fit:max never upscales, keeps aspect ratio)
  // auto('format') serves WebP/AVIF to supporting browsers; quality 75 is visually lossless here
  image: (source, opts = {}) => {
    if (!source) return '';
    if (typeof source === 'string') return source;

    // Check if it's an asset with a direct URL (like SVGs often have)
    if (source.asset && source.asset.url) return source.asset.url;

    try {
      let b = urlBuilder.image(source).auto('format').fit('max').quality(opts.quality || 75);
      if (opts.width) b = b.width(opts.width);
      // Only call .url() if the builder object exists and has it
      return b && typeof b.url === 'function' ? b.url() : '';
    } catch (e) {
      console.warn('Sanity Image Builder error:', e);
      return '';
    }
  }
}
