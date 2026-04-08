
export default {
  name: 'about',
  title: 'О компании',
  type: 'document',
  fields: [
    { name: 'label', title: 'Ярлык', type: 'string' },
    { name: 'title', title: 'Заголовок', type: 'string' },
    { name: 'text1', title: 'Текст 1', type: 'text' },
    { name: 'text2', title: 'Текст 2 (Rich)', type: 'array', of: [{ type: 'block' }] },
    {
      name: 'stats',
      title: 'Статистика',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'num', title: 'Число', type: 'string' },
            { name: 'label', title: 'Подпись', type: 'string' },
          ],
        },
      ],
    },
    {
      name: 'partners',
      title: 'Партнеры',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'name', title: 'Название', type: 'string' },
            { name: 'img', title: 'Логотип', type: 'image' },
          ],
        },
      ],
    },
  ],
}
