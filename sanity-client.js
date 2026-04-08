
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
    if (!source) return ''
    // Если это уже строка (например, fallback URL), возвращаем как есть
    if (typeof source === 'string') return source
    
    try {
      return urlBuilder.image(source).url()
    } catch (e) {
      console.warn('Sanity Image Builder error:', e)
      return ''
    }
  }
}
