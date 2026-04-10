
import { createClient } from '@sanity/client'
import imageUrlBuilder from '@sanity/image-url'

export const client = createClient({
  projectId: '77e5oip8',
  dataset: 'production',
  useCdn: true,
  apiVersion: '2023-05-03',
})

const urlBuilder = imageUrlBuilder(client)

/**
 * Helper to get direct Sanity image URLs.
 * NOTE: This returns the URL string immediately.
 */
export const builder = {
  image: (source) => {
    if (!source) return ''
    if (typeof source === 'string') return source
    
    try {
      // Return the URL directly to simplify client-side usage
      return urlBuilder.image(source).url()
    } catch (e) {
      console.warn('Sanity Image Builder error:', e)
      return ''
    }
  }
}
