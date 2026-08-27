/**
 * Приём заявки с сайта и отправка её в Telegram.
 *
 * Serverless-функция (Vercel: файл в /api → адрес /api/lead).
 * Токен бота НИКОГДА не попадает в браузер: он читается из переменных
 * окружения хостинга, запрос к Telegram уходит с сервера.
 *
 * Переменные окружения:
 *   TELEGRAM_BOT_TOKEN — токен от @BotFather
 *   TELEGRAM_CHAT_ID   — куда слать заявки: свой id, id группы
 *                        (у групп он отрицательный) или @имя_канала
 *   ALLOWED_ORIGIN     — домен сайта, например https://teplota.su
 *
 * Как узнать TELEGRAM_CHAT_ID, не показывая токен никому:
 *   1. напишите боту любое сообщение (для группы — добавьте бота в неё
 *      и напишите там);
 *   2. откройте в браузере
 *      https://api.telegram.org/bot<ВАШ_ТОКЕН>/getUpdates
 *   3. в ответе найдите "chat":{"id":...} — это и есть нужное число.
 */

const TG_API = 'https://api.telegram.org/bot';

/* Поля и порядок в сообщении */
const ORDER = ['Ваше имя', 'Телефон', 'Что нужно сделать', 'Объект', 'Комментарий', 'Страница'];
const CONSENT = 'Согласен на обработку персональных данных и ознакомлен с политикой конфиденциальности';

function clean(v) {
  return String(v == null ? '' : v)
    .slice(0, 500)
    .replace(/[\u0000-\u001f\u007f]/g, ' ')
    .trim();
}

/* Telegram HTML: экранируем только то, что он считает разметкой */
function esc(v) {
  return clean(v).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function buildMessage(data) {
  const lines = ['<b>Заявка с сайта «Теплота»</b>', ''];

  for (const key of ORDER) {
    if (data[key]) lines.push(`<b>${esc(key)}:</b> ${esc(data[key])}`);
  }
  for (const key of Object.keys(data)) {
    if (ORDER.includes(key) || key === CONSENT || !data[key]) continue;
    lines.push(`<b>${esc(key)}:</b> ${esc(data[key])}`);
  }

  return lines.join('\n').slice(0, 4000);
}

export default async function handler(req, res) {
  const origin = process.env.ALLOWED_ORIGIN || '*';
  res.setHeader('Access-Control-Allow-Origin', origin);
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Vary', 'Origin');

  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'method_not_allowed' });

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    console.error('lead: не заданы TELEGRAM_BOT_TOKEN или TELEGRAM_CHAT_ID');
    return res.status(500).json({ error: 'not_configured' });
  }

  let data = req.body;
  if (typeof data === 'string') {
    try { data = JSON.parse(data); } catch { data = null; }
  }
  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    return res.status(400).json({ error: 'bad_request' });
  }

  /* Простейшая защита от мусора: телефон обязателен, объём ограничен */
  if (clean(data['Телефон']).replace(/\D/g, '').length < 10) {
    return res.status(400).json({ error: 'bad_phone' });
  }
  if (JSON.stringify(data).length > 4000) {
    return res.status(413).json({ error: 'too_large' });
  }

  try {
    const r = await fetch(`${TG_API}${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: buildMessage(data),
        parse_mode: 'HTML',
        disable_web_page_preview: true
      })
    });

    const body = await r.json().catch(() => ({}));

    if (!r.ok || body.ok === false) {
      /* description пишем только в лог хостинга: в нём может быть лишнее */
      console.error('lead: Telegram отказал', r.status, body.description || '');
      return res.status(502).json({ error: 'upstream' });
    }

    return res.status(200).json({ ok: true });
  } catch (e) {
    console.error('lead: запрос к Telegram не прошёл', e && e.message);
    return res.status(502).json({ error: 'upstream' });
  }
}
