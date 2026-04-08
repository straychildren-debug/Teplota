
export default {
  name: 'product',
  title: 'Товары',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Название товара',
      type: 'string',
    },
    {
      name: 'image',
      title: 'Изображение товара',
      type: 'image',
      options: { hotspot: true },
    },
    {
      name: 'description',
      title: 'Краткое описание',
      type: 'string',
    },
    {
      name: 'details',
      title: 'Подробное описание',
      type: 'array',
      of: [{ type: 'block' }],
    },
  ],
}
