/**
 * Приём заявок с сайта «Теплота» и отправка их в Telegram.
 * Yandex Cloud Function, точка входа: index.handler
 *
 * Внешних зависимостей нет — только модули самого Node,
 * поэтому функцию можно вставить в редактор в консоли одним файлом.
 *
 * Переменные окружения (задаются при создании версии функции):
 *   TELEGRAM_BOT_TOKEN — токен от @BotFather
 *   TELEGRAM_CHAT_ID   — свой id, id группы (отрицательный) или @имя_канала
 *   ALLOWED_ORIGINS    — домены сайта через запятую,
 *                        например: https://teplota.su,https://www.teplota.su
 */

const https = require('https');

/* Поля и их порядок в сообщении; остальное допишется следом */
const ORDER = ['Ваше имя', 'Телефон', 'Что нужно сделать', 'Объект', 'Комментарий', 'Страница'];
const SKIP = ['Согласен на обработку персональных данных и ознакомлен с политикой конфиденциальности'];

/* Грубый ограничитель: живёт, пока живёт контейнер функции.
   Полной защиты не даёт, но отсекает простой автоматический спам. */
const seen = new Map();
const PER_HOUR = 15;

function clean(v) {
  return String(v == null ? '' : v).replace(/\s+/g, ' ').trim().slice(0, 500);
}

function esc(v) {
  return clean(v).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function buildMessage(data) {
  const lines = ['<b>Заявка с сайта «Теплота»</b>', ''];

  for (const key of ORDER) {
    if (data[key]) lines.push(esc(key) + ': ' + esc(data[key]));
  }
  for (const key of Object.keys(data)) {
    if (ORDER.includes(key) || SKIP.includes(key) || !data[key]) continue;
    lines.push(esc(key) + ': ' + esc(data[key]));
  }

  return lines.join('\n').slice(0, 4000);
}

function sendToTelegram(token, payload) {
  const body = JSON.stringify(payload);

  return new Promise((resolve) => {
    const req = https.request(
      {
        host: 'api.telegram.org',
        path: '/bot' + token + '/sendMessage',
        method: 'POST',
        timeout: 10000,
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(body)
        }
      },
      (res) => {
        let out = '';
        res.on('data', (c) => { out += c; });
        res.on('end', () => done({ code: res.statusCode, body: out }));
      }
    );

    const deadline = setTimeout(() => {
      req.destroy();
      resolve({ code: 0, body: 'timeout: соединение не установилось' });
    }, 8000);

    const done = (r) => { clearTimeout(deadline); resolve(r); };
    req.on('timeout', () => { req.destroy(); done({ code: 0, body: 'timeout' }); });
    req.on('error', (e) => done({ code: 0, body: String(e && e.message) }));
    req.write(body);
    req.end();
  });
}

function reply(statusCode, origin, payload) {
  const headers = {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Vary': 'Origin'
  };
  if (origin) headers['Access-Control-Allow-Origin'] = origin;

  return { statusCode, headers, body: JSON.stringify(payload) };
}

/* Диагностика: GET ?selftest=1 — проверяет, достучится ли функция
   до Telegram. Токен не используется, секретов не отдаёт. */
function selftest() {
  return new Promise((resolve) => {
    const started = Date.now();
    const req = https.request(
      { host: 'api.telegram.org', path: '/', method: 'HEAD', timeout: 8000 },
      (res) => resolve({ reachable: true, status: res.statusCode, ms: Date.now() - started })
    );
    const deadline = setTimeout(() => {
      req.destroy();
      resolve({ reachable: false, error: 'timeout', ms: Date.now() - started });
    }, 8000);
    req.on('error', (e) => {
      clearTimeout(deadline);
      resolve({ reachable: false, error: String(e && e.message), ms: Date.now() - started });
    });
    req.on('timeout', () => req.destroy());
    req.end();
  });
}

module.exports.handler = async (event) => {
  const headers = event.headers || {};

  const q = event.queryStringParameters || {};
  if (q.selftest) {
    const r = await selftest();
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify({
        telegram: r,
        env: {
          token: process.env.TELEGRAM_BOT_TOKEN ? 'задан' : 'НЕТ',
          chatId: process.env.TELEGRAM_CHAT_ID ? 'задан' : 'НЕТ',
          origins: process.env.ALLOWED_ORIGINS || 'НЕТ'
        }
      })
    };
  }

  const origin = headers.Origin || headers.origin || '';

  const allowed = String(process.env.ALLOWED_ORIGINS || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

  const okOrigin = allowed.includes(origin) ? origin : '';

  if (event.httpMethod === 'OPTIONS') return reply(204, okOrigin, {});
  if (event.httpMethod !== 'POST') return reply(405, okOrigin, { error: 'method_not_allowed' });
  if (origin && !okOrigin) return reply(403, '', { error: 'forbidden_origin' });

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) {
    console.error('не заданы TELEGRAM_BOT_TOKEN или TELEGRAM_CHAT_ID');
    return reply(500, okOrigin, { error: 'not_configured' });
  }

  /* Ограничитель по адресу отправителя */
  const ip = (event.requestContext && event.requestContext.identity
    && event.requestContext.identity.sourceIp) || 'unknown';
  const now = Date.now();
  const hits = (seen.get(ip) || []).filter((t) => t > now - 3600000);
  if (hits.length >= PER_HOUR) return reply(429, okOrigin, { error: 'too_many' });
  hits.push(now);
  seen.set(ip, hits);

  let raw = event.body || '';
  if (event.isBase64Encoded) raw = Buffer.from(raw, 'base64').toString('utf8');
  if (raw.length > 8000) return reply(413, okOrigin, { error: 'too_large' });

  let data;
  try { data = JSON.parse(raw); } catch (e) { data = null; }
  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    return reply(400, okOrigin, { error: 'bad_request' });
  }

  const digits = clean(data['Телефон']).replace(/\D/g, '');
  if (digits.length < 10) return reply(400, okOrigin, { error: 'bad_phone' });

  const r = await sendToTelegram(token, {
    chat_id: chatId,
    text: buildMessage(data),
    parse_mode: 'HTML',
    disable_web_page_preview: true
  });

  if (r.code !== 200) {
    /* Подробности только в лог функции, наружу не отдаём */
    console.error('telegram ответил', r.code, r.body.slice(0, 300));
    return reply(502, okOrigin, { error: 'upstream' });
  }

  return reply(200, okOrigin, { ok: true });
};
