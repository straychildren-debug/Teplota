
export default {
  name: 'advantage',
  title: 'Преимущества',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Заголовок',
      type: 'string',
    },
    {
      name: 'description',
      title: 'Описание',
      type: 'text',
    },
    {
      name: 'icon',
      title: 'Иконка (Картинка)',
      type: 'image',
      options: { hotspot: true },
    },
  ],
}
