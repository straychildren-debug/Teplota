
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
        { name: 'favicon', title: 'Фавиконка (иконка сайта)', type: 'image' },
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
        { name: 'title', title: 'Заголовок', type: 'text', rows: 3, description: 'Каждая строка = новая строка на сайте. *звёздочки* = оранжевый акцент. Пример:\nИнженерные системы\n*Премиум-класса*' },
        { name: 'subtitle', title: 'Подзаголовок', type: 'text' },
        { name: 'btnText', title: 'Текст кнопки', type: 'string' },
        { name: 'btnUrl', title: 'Ссылка кнопки', type: 'string' },
        { name: 'secondaryBtnText', title: 'Текст второй кнопки', type: 'string' },
        { name: 'secondaryBtnUrl', title: 'Ссылка второй кнопки', type: 'string' },
        { name: 'label', title: 'Лейбл над заголовком', type: 'string' },
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
      name: 'sections',
      title: 'Настройки секций',
      type: 'object',
      fields: [
        {
          name: 'advantages',
          title: 'Секция "Преимущества"',
          type: 'object',
          fields: [
            { name: 'title', title: 'Заголовок', type: 'string', description: 'Оберните текст в *звёздочки* для оранжевого акцента. Пример: НАШИ *ПРЕИМУЩЕСТВА*' },
          ]
        },
        {
          name: 'services',
          title: 'Секция "Услуги"',
          type: 'object',
          fields: [
            { name: 'title', title: 'Заголовок', type: 'string', description: '*звёздочки* = оранжевый акцент. Пример: НАШИ *УСЛУГИ*' },
            { name: 'subtitle', title: 'Подзаголовок', type: 'string' },
            { name: 'btnText', title: 'Текст кнопки', type: 'string' },
          ]
        },
        {
          name: 'products',
          title: 'Секция "Товары"',
          type: 'object',
          fields: [
            { name: 'title', title: 'Заголовок', type: 'string', description: '*звёздочки* = оранжевый акцент. Пример: НАШИ *ТОВАРЫ*' },
            { name: 'subtitle', title: 'Подзаголовок', type: 'string' },
            { name: 'btnText', title: 'Текст кнопки', type: 'string' },
          ]
        },
        {
          name: 'gallery',
          title: 'Секция "Работы"',
          type: 'object',
          fields: [
            { name: 'title', title: 'Заголовок', type: 'string', description: '*звёздочки* = оранжевый акцент. Пример: НАШИ *РАБОТЫ*' },
            { name: 'subtitle', title: 'Подзаголовок', type: 'string' },
            { name: 'btnText', title: 'Текст кнопки', type: 'string' },
          ]
        },
        {
          name: 'location',
          title: 'Секция "Карта"',
          type: 'object',
          fields: [
            { name: 'title', title: 'Заголовок', type: 'string', description: '*звёздочки* = оранжевый акцент. Пример: КАК НАС *НАЙТИ*' },
          ]
        },
        {
          name: 'contacts',
          title: 'Секция "Контакты"',
          type: 'object',
          fields: [
            { name: 'title', title: 'Заголовок', type: 'string', description: '*звёздочки* = оранжевый акцент. Пример: СВЯЖИТЕСЬ С *НАМИ*' },
            { name: 'subtitle', title: 'Подзаголовок', type: 'string' },
            { name: 'formNameLabel', title: 'Лейбл поля "Имя"', type: 'string' },
            { name: 'formPhoneLabel', title: 'Лейбл поля "Телефон"', type: 'string' },
            { name: 'formBtnText', title: 'Текст кнопки формы', type: 'string' },
          ]
        },
      ],
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
