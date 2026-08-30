/**
 * Приём заявок с сайта «Теплота» и отправка их в MAX.
 * Yandex Cloud Function, точка входа: index.handler
 *
 * Внешних зависимостей нет — только модули самого Node,
 * поэтому функцию можно вставить в редактор в консоли одним файлом.
 *
 * Переменные окружения (задаются на странице функции в консоли):
 *   MAX_BOT_TOKEN   — токен бота из MAX: Чат-боты → Расширенные
 *                     настройки → Настроить
 *   MAX_CHAT_ID     — id чата, куда падают заявки
 *   MAX_USER_ID     — можно вместо чата: id получателя в личку
 *   ALLOWED_ORIGINS — домены сайта через запятую, например:
 *                     https://teplota.su,https://www.teplota.su
 *
 * Токен в коде не хранится и в браузер не попадает.
 * Документация метода: https://dev.max.ru/docs-api/methods/POST/messages
 */

const https = require('https');

const MAX_HOST = 'platform-api2.max.ru';

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

function buildMessage(data) {
  const lines = ['Заявка с сайта «Теплота»', ''];

  for (const key of ORDER) {
    if (data[key]) lines.push(clean(key) + ': ' + clean(data[key]));
  }
  for (const key of Object.keys(data)) {
    if (ORDER.includes(key) || SKIP.includes(key) || !data[key]) continue;
    lines.push(clean(key) + ': ' + clean(data[key]));
  }

  return lines.join('\n').slice(0, 3900);
}

/* Один запрос к MAX с жёстким дедлайном: штатный socket timeout не
   срабатывает, когда соединение режут на этапе установки. */
function maxRequest(method, path, token, payload) {
  const body = payload ? JSON.stringify(payload) : null;

  return new Promise((resolve) => {
    const headers = { 'Authorization': token };
    if (body) {
      headers['Content-Type'] = 'application/json';
      headers['Content-Length'] = Buffer.byteLength(body);
    }

    const req = https.request(
      { host: MAX_HOST, path, method, headers, timeout: 8000 },
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
    if (body) req.write(body);
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

module.exports.handler = async (event) => {
  const headers = event.headers || {};
  const q = event.queryStringParameters || {};
  const token = process.env.MAX_BOT_TOKEN;
  const chatId = process.env.MAX_CHAT_ID;
  const userId = process.env.MAX_USER_ID;

  /* ---------- Диагностика: GET ?selftest=1 ----------
     Показывает, доступен ли MAX с этой площадки и заданы ли
     переменные. Значение токена наружу не отдаётся. */
  if (q.selftest) {
    const r = token
      ? await maxRequest('GET', '/updates?limit=1', token, null)
      : { code: 0, body: 'токен не задан' };

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify({
        max: { код: r.code, ответ: String(r.body).slice(0, 400) },
        переменные: {
          MAX_BOT_TOKEN: token ? 'задан' : 'НЕТ',
          MAX_CHAT_ID: chatId || 'НЕТ',
          MAX_USER_ID: userId || 'НЕТ',
          ALLOWED_ORIGINS: process.env.ALLOWED_ORIGINS || 'НЕТ'
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

  if (!token || (!chatId && !userId)) {
    console.error('не заданы MAX_BOT_TOKEN или MAX_CHAT_ID/MAX_USER_ID');
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

  const target = chatId
    ? 'chat_id=' + encodeURIComponent(chatId)
    : 'user_id=' + encodeURIComponent(userId);

  const r = await maxRequest('POST', '/messages?' + target, token, {
    text: buildMessage(data),
    notify: true
  });

  if (r.code !== 200) {
    /* Подробности только в лог функции, наружу не отдаём */
    console.error('MAX ответил', r.code, String(r.body).slice(0, 300));
    return reply(502, okOrigin, { error: 'upstream' });
  }

  return reply(200, okOrigin, { ok: true });
};
