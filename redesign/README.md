# Teplota — Industrial redesign (как накатить)

Один файл-оверрайд поверх твоего продакшна (репозиторий `Teplota`: `premium.css` + `index.html`).

## Установка

1. Скопируй `teplota-industrial-redesign.css` в корень проекта (рядом с `premium.css`).
2. Подключи его **после** premium.css:

   **Вариант A — через `<link>` в `index.html`:**
   ```html
   <link rel="stylesheet" href="/teplota-industrial-redesign.css">
   ```
   (после того, как подключается premium.css)

   **Вариант B — через Vite/`main.js`:**
   ```js
   import './premium.css';
   import './teplota-industrial-redesign.css';   // ← после premium.css
   ```

3. Готово. Разметку и классы менять не нужно.

## Что меняется
- **Шрифты** → единый премиальный гротеск **Manrope** (с кириллицей), вместо Inter + Playfair.
- **Палитра (тёмная тема)** → индастриал: холодный `#08090A`, чёткие угольные поверхности, контрастнее тонкие линии.
- **Радиусы** → тугие технические (плитки/карточки 8px, панели 10–12px); кнопки остаются pill.
- **Тени** → плоская точная модель.
- **Фон** → вместо клеточки и «орбов» — еле заметный **инженерный чертёж** (`/assets/blueprint_pattern.png`, он уже есть в репозитории) в правом верхнем углу + мягкая тёплая заливка сверху.

## Зависимости
- Использует уже существующий ассет `public/assets/blueprint_pattern.png` (путь `/assets/blueprint_pattern.png`). Если положишь его в другое место — поправь путь в `.tp-bg::before`.
- Оверрайд опирается на переменные и классы твоего `premium.css` (`--primary`, `.tp-bg`, `#advantage-grid`, `#service-list-grid`, `#product-grid`, `#hero-title`). Если менял их имена — синхронизируй.

## Тонкая настройка
- Заметность чертежа: `.tp-bg::before { opacity }` (сейчас .07 на тёмной).
- Положение: `background-position` / `background-size` в `.tp-bg::before`.
- Радиусы: значения `8px` в блоке под комментарием «Тугие радиусы».
