
export default {
  name: 'gallery',
  title: 'Наши работы (Галерея)',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Название проекта',
      type: 'string',
    },
    {
      name: 'description',
      title: 'Описание проекта',
      type: 'text',
    },
    {
      name: 'cover',
      title: 'Обложка',
      type: 'image',
      options: { hotspot: true },
    },
    {
      name: 'photos',
      title: 'Слайды галереи',
      type: 'array',
      of: [
        {
          type: 'image',
          options: { hotspot: true },
          fields: [
            {
              name: 'caption',
              type: 'string',
              title: 'Подпись к фото',
            },
          ],
        },
      ],
    },
  ],
}
