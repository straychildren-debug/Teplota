/* ============================================================
   ТЕПЛОТА — интерфейс лендинга
   Меню · маска телефона · валидация · отправка заявки · появление блоков
   ============================================================ */
(function () {
  'use strict';

  /* ============================================================
     КУДА УХОДИТ ЗАЯВКА

     Заявка отправляется POST-запросом на FORM_ENDPOINT, а оттуда
     серверная функция (api/lead.js) кладёт её в Telegram. Токен бота
     живёт в переменных окружения хостинга и в браузер не попадает.

     Функция выполняется только там, где хостинг это умеет: Vercel,
     Netlify, Cloudflare. На статическом хостинге вроде GitHub Pages
     адрес вернёт 404 — тогда включается запасной путь: письмо через
     почтовый клиент посетителя на FORM_EMAIL. Заявка не теряется,
     ошибку посетитель не видит.

     Тот же запасной путь работает, если FORM_ENDPOINT очистить.
     ============================================================ */
  var FORM_ENDPOINT = '/api/lead';
  var FORM_PHONE = '+7 927 432-63-36';
  var FORM_EMAIL = 'teplota16@bk.ru';
  var FORM_SUBJECT = 'Заявка с сайта «Теплота»';

  var doc = document;
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Тень у шапки при скролле ---------- */
  var header = doc.getElementById('header');
  if (header) {
    var onScroll = function () {
      header.classList.toggle('is-stuck', window.scrollY > 8);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ---------- Мобильное меню ---------- */
  var burger = doc.getElementById('burger');
  var menu = doc.getElementById('mobile-menu');

  function closeMenu() {
    if (!menu || !burger) return;
    menu.classList.remove('is-open');
    burger.setAttribute('aria-expanded', 'false');
    doc.body.classList.remove('nav-open');
  }

  if (burger && menu) {
    burger.addEventListener('click', function () {
      var open = burger.getAttribute('aria-expanded') === 'true';
      if (open) {
        closeMenu();
      } else {
        menu.classList.add('is-open');
        burger.setAttribute('aria-expanded', 'true');
        doc.body.classList.add('nav-open');
      }
    });

    menu.addEventListener('click', function (e) {
      if (e.target.closest('a')) closeMenu();
    });

    doc.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeMenu();
    });

    window.addEventListener('resize', function () {
      if (window.innerWidth >= 1024) closeMenu();
    });
  }

  /* ---------- Аккордеон «Вопросы» ---------- */
  doc.querySelectorAll('.faq-q').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var item = btn.closest('.faq-item');
      var open = btn.getAttribute('aria-expanded') === 'true';

      doc.querySelectorAll('.faq-item.is-open').forEach(function (other) {
        if (other !== item) {
          other.classList.remove('is-open');
          var q = other.querySelector('.faq-q');
          if (q) q.setAttribute('aria-expanded', 'false');
        }
      });

      item.classList.toggle('is-open', !open);
      btn.setAttribute('aria-expanded', open ? 'false' : 'true');
    });
  });

  /* ---------- Маска телефона ---------- */
  var phone = doc.getElementById('phone');
  if (phone) {
    var format = function (value) {
      var d = value.replace(/\D/g, '');
      if (!d) return '';
      if (d[0] === '8') d = '7' + d.slice(1);
      if (d[0] !== '7') d = '7' + d;
      d = d.slice(0, 11);

      var out = '+7';
      if (d.length > 1) out += ' (' + d.slice(1, 4);
      if (d.length >= 4) out += ')';
      if (d.length > 4) out += ' ' + d.slice(4, 7);
      if (d.length > 7) out += '-' + d.slice(7, 9);
      if (d.length > 9) out += '-' + d.slice(9, 11);
      return out;
    };

    var apply = function () {
      phone.value = format(phone.value);
    };

    phone.addEventListener('input', apply);
    phone.addEventListener('focus', function () {
      if (!phone.value) phone.value = '+7 (';
    });
    phone.addEventListener('blur', function () {
      if (phone.value.replace(/\D/g, '').length < 2) phone.value = '';
    });
  }

  /* ---------- Валидация и отправка заявки ---------- */
  var form = doc.getElementById('join-form');
  var card = doc.getElementById('form-card');

  function markField(el, ok) {
    var wrap = el.closest('.field');
    if (!wrap) return;
    if (el.type === 'checkbox') {
      var label = el.closest('.consent');
      if (label) label.classList.toggle('has-error', !ok);
    }
    wrap.classList.toggle('has-error', !ok);
  }

  if (form && card) {
    /* Правила берём из разметки: data-required, при необходимости data-rule="phone".
       Так форму можно менять в HTML, не трогая скрипт. */
    var checks = {
      text: function (v) { return v.trim().length >= 2; },
      phone: function (v) { return v.replace(/\D/g, '').length === 11; },
      select: function (v) { return v !== ''; },
      email: function (v) { return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v.trim()); }
    };

    var rules = [].map.call(form.querySelectorAll('[data-required]'), function (el) {
      var kind = el.getAttribute('data-rule');
      if (!kind) kind = el.tagName === 'SELECT' ? 'select' : (el.type === 'email' ? 'email' : 'text');
      return { el: el, test: checks[kind] || checks.text };
    });

    rules.forEach(function (rule) {
      var recheck = function () {
        var wrap = rule.el.closest('.field');
        if (wrap && wrap.classList.contains('has-error')) markField(rule.el, rule.test(rule.el.value));
      };
      rule.el.addEventListener('input', recheck);
      rule.el.addEventListener('change', recheck);
    });

    var consent = form.querySelector('input[type="checkbox"][data-required]')
      || document.getElementById('consent');
    if (consent) {
      consent.addEventListener('change', function () {
        if (consent.checked) markField(consent, true);
      });
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var firstBad = null;

      rules.forEach(function (rule) {
        if (rule.el.type === 'checkbox') return;
        var ok = rule.test(rule.el.value);
        markField(rule.el, ok);
        if (!ok && !firstBad) firstBad = rule.el;
      });

      if (consent) {
        markField(consent, consent.checked);
        if (!consent.checked && !firstBad) firstBad = consent;
      }

      if (firstBad) {
        firstBad.focus({ preventScroll: true });
        firstBad.scrollIntoView({ block: 'center', behavior: reduceMotion ? 'auto' : 'smooth' });
        return;
      }

      /* ---------- Отправка ---------- */
      var btn = form.querySelector('button[type="submit"]');
      var errBox = card.querySelector('.form-fail');
      var label = btn ? btn.textContent : '';

      function collect() {
        var out = {};
        [].forEach.call(form.elements, function (el) {
          if (!el.name || el.type === 'submit') return;
          /* ключом берём подпись поля — так письмо и заявка читаются по-русски */
          var wrap = el.closest('.field');
          var lab = wrap ? wrap.querySelector('label') : null;
          var key = lab ? lab.textContent.replace(/\s+/g, ' ').replace(/ — по желанию/, '').trim() : el.name;
          out[key] = el.type === 'checkbox' ? (el.checked ? 'да' : 'нет') : el.value.trim();
        });
        out['Страница'] = location.href;
        return out;
      }

      function busy(on) {
        if (!btn) return;
        btn.disabled = on;
        btn.textContent = on ? 'Отправляем…' : label;
      }

      function fail(text) {
        busy(false);
        if (!errBox) return;
        errBox.textContent = text;
        errBox.hidden = false;
      }

      function succeed() {
        busy(false);
        if (errBox) errBox.hidden = true;
        card.classList.add('is-done');
        card.scrollIntoView({ block: 'center', behavior: reduceMotion ? 'auto' : 'smooth' });
      }

      var payload = collect();

      /* Запасной путь без сервера: письмо через почтовый клиент посетителя */
      function byMail() {
        var lines = Object.keys(payload).map(function (k) { return k + ': ' + payload[k]; });
        window.location.href = 'mailto:' + FORM_EMAIL
          + '?subject=' + encodeURIComponent(FORM_SUBJECT)
          + '&body=' + encodeURIComponent(lines.join('\n'));
        succeed();
      }

      if (errBox) errBox.hidden = true;

      if (!FORM_ENDPOINT) return byMail();

      busy(true);
      fetch(FORM_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(payload)
      }).then(function (r) {
        /* Обработчика по адресу нет — например, сайт на статическом хостинге.
           Это не сбой: молча уводим заявку письмом, чтобы она не потерялась. */
        if (r.status === 404 || r.status === 405) return byMail();
        if (!r.ok) throw new Error('HTTP ' + r.status);
        succeed();
      }).catch(function () {
        fail('Не удалось отправить заявку. Позвоните нам: ' + FORM_PHONE + ' — или напишите на ' + FORM_EMAIL + '.');
      });
    });
  }

  /* ---------- Появление блоков при скролле ---------- */
  var revealables = doc.querySelectorAll('.reveal');

  if (reduceMotion || !('IntersectionObserver' in window)) {
    revealables.forEach(function (el) { el.classList.add('is-in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-in');
        io.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });

    revealables.forEach(function (el, i) {
      el.style.transitionDelay = (i % 4) * 60 + 'ms';
      io.observe(el);
    });
  }
})();
