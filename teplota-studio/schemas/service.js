
export default {
  name: 'service',
  title: 'Услуги',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Название услуги',
      type: 'string',
    },
    {
      name: 'image',
      title: 'Главное изображение',
      type: 'image',
      options: { hotspot: true },
    },
    {
      name: 'description',
      title: 'Краткое описание',
      type: 'text',
    },
    {
      name: 'content',
      title: 'Полное описание (Rich Text)',
      type: 'array',
      of: [{ type: 'block' }],
    },
    {
      name: 'photos',
      title: 'Дополнительные фото',
      type: 'array',
      of: [{ type: 'image', options: { hotspot: true } }],
    },
  ],
}
