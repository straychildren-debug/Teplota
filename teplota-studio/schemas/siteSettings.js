
export default {
  name: 'siteSettings',
  title: 'Настройки сайта',
  type: 'document',
  fields: [
    {
      name: 'header',
      title: 'Шапка',
      type: 'object',
      fields: [
        { name: 'phone', title: 'Телефон', type: 'string' },
        { name: 'btnText', title: 'Текст кнопки', type: 'string' },
        { name: 'btnUrl', title: 'Ссылка кнопки', type: 'string' },
        {
          name: 'navLinks',
          title: 'Навигация',
          type: 'array',
          of: [
            {
              type: 'object',
              fields: [
                { name: 'label', type: 'string', title: 'Название' },
                { name: 'url', type: 'string', title: 'Ссылка' },
              ],
            },
          ],
        },
      ],
    },
    {
      name: 'hero',
      title: 'Главный блок (Hero)',
      type: 'object',
      fields: [
        { name: 'title', title: 'Заголовок (с тегами <span>)', type: 'string' },
        { name: 'subtitle', title: 'Подзаголовок', type: 'text' },
        { name: 'btnText', title: 'Текст кнопки', type: 'string' },
        { name: 'btnUrl', title: 'Ссылка кнопки', type: 'string' },
      ],
    },
    {
      name: 'contact',
      title: 'Контакты',
      type: 'object',
      fields: [
        {
          name: 'phones',
          title: 'Телефоны',
          type: 'array',
          of: [
            {
              type: 'object',
              fields: [
                { name: 'number', title: 'Номер телефона', type: 'string' },
                { name: 'label', title: 'Описание (отдел)', type: 'string' }
              ]
            }
          ]
        },
        { name: 'email', title: 'Email', type: 'string' },
        { name: 'address', title: 'Адрес', type: 'string' },
        { name: 'mapLat', title: 'Широта (Lat)', type: 'number' },
        { name: 'mapLng', title: 'Долгота (Lng)', type: 'number' },
      ],
    },
    {
      name: 'footer',
      title: 'Подвал (Footer)',
      type: 'object',
      fields: [
        { name: 'copyright', title: 'Копирайт', type: 'string' },
      ],
    },
  ],
}
