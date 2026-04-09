
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
              name: 'navItem',
              title: 'Пункт навигации',
              type: 'object',
              fields: [
                { name: 'label', type: 'string', title: 'Название' },
                { name: 'url', type: 'string', title: 'Ссылка' },
              ],
            },
          ],
        },
        {
          name: 'socials',
          title: 'Соцсети (в шапке)',
          type: 'array',
          of: [
            {
              type: 'object',
              fields: [
                { name: 'name', title: 'Название', type: 'string' },
                { name: 'icon', title: 'Иконка', type: 'image' },
                { name: 'url', title: 'Ссылка', type: 'string' },
              ]
            }
          ]
        }
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
        { name: 'background', title: 'Фоновое изображение', type: 'image', options: { hotspot: true } },
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
              name: 'phoneItem',
              title: 'Телефон',
              type: 'object',
              fields: [
                { name: 'number', title: 'Номер телефона', type: 'string' },
                { name: 'label', title: 'Описание (отдел)', type: 'string' }
              ],
              preview: {
                select: { title: 'number', subtitle: 'label' }
              }
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
      name: 'advantages',
      title: 'Преимущества (список)',
      type: 'array',
      of: [
        {
          name: 'advantageItem',
          title: 'Преимущество',
          type: 'object',
          fields: [
            { name: 'text', title: 'Текст преимущества', type: 'text' },
            { name: 'icon', title: 'Иконка (эмодзи)', type: 'string' }
          ],
          preview: {
            select: { title: 'text', subtitle: 'icon' }
          }
        }
      ]
    },
    {
      name: 'footer',
      title: 'Подвал (Footer)',
      type: 'object',
      fields: [
        { name: 'copyright', title: 'Копирайт', type: 'string' },
        {
          name: 'links',
          title: 'Ссылки в подвале',
          type: 'array',
          of: [
            {
              type: 'object',
              fields: [
                { name: 'label', title: 'Текст', type: 'string' },
                { name: 'url', title: 'Ссылка', type: 'string' },
              ]
            }
          ]
        },
        {
          name: 'socials',
          title: 'Соцсети в подвале',
          type: 'array',
          of: [
            {
              type: 'object',
              fields: [
                { name: 'name', title: 'Название', type: 'string' },
                { name: 'icon', title: 'Иконка', type: 'image' },
                { name: 'url', title: 'Ссылка', type: 'string' },
              ]
            }
          ]
        }
      ],
    },
  ],
}
