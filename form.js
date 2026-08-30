/* ============================================================
   Форма заявки в блоке «Контакты»

   Живёт отдельно от cms.js: тот отвечает за контент, этот — за
   поведение формы. Список услуг подтягивается из того же
   cms-data.json, что и остальной сайт, поэтому не разъезжается
   с разделом «Наши услуги».
   ============================================================ */

/* ------------------------------------------------------------
   КУДА УХОДИТ ЗАЯВКА

   POST на FORM_ENDPOINT, оттуда серверная функция кладёт заявку
   в MAX. Токен живёт в переменных окружения функции и в
   браузер не попадает.

   Если обработчик недоступен или ответил ошибкой — показываем
   телефоны и кнопку «Отправить письмом». Почтовое приложение
   открывается только по нажатию: подставлять его самим нельзя,
   посетитель этого не ждёт.
   ------------------------------------------------------------ */
const FORM_ENDPOINT = 'https://functions.yandexcloud.net/d4e0dp7ecii85f4ckhdq';
const FORM_EMAIL = 'teplota16@bk.ru';
const FORM_PHONES = ['+7 905 313-34-53', '+7 927 432-63-36'];
const FORM_SUBJECT = 'Заявка с сайта «Теплота»';

const form = document.getElementById('contact-form');
const doneBox = document.getElementById('form-done');
const failBox = document.getElementById('form-fail');

if (form) {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Список услуг из CMS ---------- */
  (async () => {
    const select = document.getElementById('form-service-input');
    if (!select) return;
    try {
      const res = await fetch('/cms-data.json', { cache: 'no-cache' });
      const data = await res.json();
      const titles = (data.services || []).map((s) => s && s.title).filter(Boolean);
      if (!titles.length) return;
      const other = select.lastElementChild;
      titles.forEach((t) => {
        const opt = document.createElement('option');
        opt.textContent = t;
        select.insertBefore(opt, other);
      });
    } catch (e) {
      /* Не достучались до данных — останется вариант «Другое» */
    }
  })();

  /* ---------- Маска телефона ---------- */
  const phone = document.getElementById('form-phone-input');
  if (phone) {
    const format = (value) => {
      let d = value.replace(/\D/g, '');
      if (!d) return '';
      if (d[0] === '8') d = '7' + d.slice(1);
      if (d[0] !== '7') d = '7' + d;
      d = d.slice(0, 11);

      let out = '+7';
      if (d.length > 1) out += ' (' + d.slice(1, 4);
      if (d.length >= 4) out += ')';
      if (d.length > 4) out += ' ' + d.slice(4, 7);
      if (d.length > 7) out += '-' + d.slice(7, 9);
      if (d.length > 9) out += '-' + d.slice(9, 11);
      return out;
    };

    phone.addEventListener('input', () => { phone.value = format(phone.value); });
    phone.addEventListener('focus', () => { if (!phone.value) phone.value = '+7 ('; });
    phone.addEventListener('blur', () => {
      if (phone.value.replace(/\D/g, '').length < 2) phone.value = '';
    });
  }

  /* ---------- Проверка полей ----------
     Правила берём из разметки: data-required, при необходимости
     data-rule="phone". Форму можно менять в HTML, не трогая скрипт. */
  const checks = {
    text: (v) => v.trim().length >= 2,
    phone: (v) => v.replace(/\D/g, '').length === 11,
    select: (v) => v !== ''
  };

  const rules = [].map.call(form.querySelectorAll('[data-required]'), (el) => {
    const kind = el.getAttribute('data-rule')
      || (el.tagName === 'SELECT' ? 'select' : 'text');
    return { el, test: checks[kind] || checks.text };
  });

  function mark(el, ok) {
    const wrap = el.closest('.tp-field');
    if (wrap) wrap.classList.toggle('has-error', !ok);
  }

  rules.forEach((rule) => {
    if (rule.el.type === 'checkbox') {
      rule.el.addEventListener('change', () => { if (rule.el.checked) mark(rule.el, true); });
      return;
    }
    const recheck = () => {
      const wrap = rule.el.closest('.tp-field');
      if (wrap && wrap.classList.contains('has-error')) mark(rule.el, rule.test(rule.el.value));
    };
    rule.el.addEventListener('input', recheck);
    rule.el.addEventListener('change', recheck);
  });

  /* ---------- Отправка ---------- */
  const btn = document.getElementById('form-submit-btn');
  const btnLabel = btn ? btn.innerHTML : '';

  function busy(on) {
    if (!btn) return;
    btn.disabled = on;
    btn.innerHTML = on ? 'Отправляем…' : btnLabel;
  }

  function fail(text, mailHref) {
    busy(false);
    if (!failBox) return;

    const phones = FORM_PHONES
      .map((p) => '<a href="tel:' + p.replace(/\D/g, '') + '">' + p + '</a>')
      .join('<span class="tp-fail-sep">·</span>');

    failBox.innerHTML = '<b>' + text + '</b>'
      + '<span class="tp-fail-phones">' + phones + '</span>'
      + (mailHref
        ? '<a class="tp-fail-mail" href="' + mailHref + '">Отправить письмом</a>'
        : '');

    failBox.hidden = false;
    failBox.scrollIntoView({ block: 'center', behavior: reduceMotion ? 'auto' : 'smooth' });
  }

  function succeed() {
    busy(false);
    if (failBox) failBox.hidden = true;
    form.hidden = true;
    if (doneBox) {
      doneBox.hidden = false;
      doneBox.scrollIntoView({ block: 'center', behavior: reduceMotion ? 'auto' : 'smooth' });
    }
  }

  function collect() {
    const out = {};
    [].forEach.call(form.elements, (el) => {
      if (!el.name || el.type === 'submit') return;
      const wrap = el.closest('.tp-field');
      const lab = wrap ? wrap.querySelector('label') : null;
      const key = lab
        ? lab.textContent.replace(/\s+/g, ' ').replace(/ — по желанию/, '').trim()
        : el.name;
      out[key] = el.type === 'checkbox' ? (el.checked ? 'да' : 'нет') : el.value.trim();
    });
    out['Страница'] = location.href;
    return out;
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    let firstBad = null;
    rules.forEach((rule) => {
      const ok = rule.el.type === 'checkbox' ? rule.el.checked : rule.test(rule.el.value);
      mark(rule.el, ok);
      if (!ok && !firstBad) firstBad = rule.el;
    });

    if (firstBad) {
      firstBad.focus({ preventScroll: true });
      firstBad.scrollIntoView({ block: 'center', behavior: reduceMotion ? 'auto' : 'smooth' });
      return;
    }

    const payload = collect();

    /* Письмо готовим заранее, но открываем только по нажатию:
       подставлять почтовое приложение самим нельзя — посетитель
       этого не ждёт. */
    const lines = Object.keys(payload).map((k) => k + ': ' + payload[k]);
    const mailHref = 'mailto:' + FORM_EMAIL
      + '?subject=' + encodeURIComponent(FORM_SUBJECT)
      + '&body=' + encodeURIComponent(lines.join('\n'));

    if (failBox) failBox.hidden = true;

    if (!FORM_ENDPOINT) {
      return fail('Заявка пока не отправляется автоматически. Позвоните нам:', mailHref);
    }

    busy(true);
    fetch(FORM_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(payload)
    }).then((r) => {
      if (r.ok) return succeed();
      if (r.status === 429) {
        return fail('Вы уже отправили несколько заявок. Позвоните нам:');
      }
      fail('Не удалось отправить заявку. Позвоните нам:', mailHref);
    }).catch(() => {
      fail('Не удалось отправить заявку. Позвоните нам:', mailHref);
    });
  });
}
