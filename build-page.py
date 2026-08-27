# -*- coding: utf-8 -*-
"""Собирает index.html из контента Теплоты (cms-data.json) в новом дизайне.

Тексты не переписываются руками — берутся из CMS, поэтому страницу
можно пересобрать после любой правки контента:  python build.py
"""
import io, json, os, re, html

HERE = os.path.dirname(os.path.abspath(__file__))


def _first(*candidates):
    """Первый существующий путь — чтобы скрипт работал и в отдельной папке,
    и внутри репозитория Теплоты, где статика лежит в public/."""
    for c in candidates:
        if c and os.path.exists(c):
            return c
    return candidates[-1]


CMS_JSON = os.environ.get('CMS_JSON') or _first(
    os.path.join(HERE, 'cms-data.json'),
    os.path.join(r'D:\AI_projects\Teplota', 'cms-data.json'))

MAP_JSON = os.environ.get('MAP_JSON') or _first(
    os.path.join(HERE, 'images', '_map.json'),
    os.path.join(HERE, 'public', 'images', '_map.json'))

OUT_HTML = os.environ.get('OUT_HTML') or os.path.join(HERE, 'index.html')

# Статику отдаём с отпечатком содержимого: после деплоя браузер обязан
# забрать новые стили и скрипт, а не показывать посетителю прежние из кэша.
ASSET_DIR = os.path.join(HERE, 'public') if os.path.exists(os.path.join(HERE, 'public', 'css')) else HERE


def stamp(rel):
    import hashlib
    path = os.path.join(ASSET_DIR, rel)
    try:
        h = hashlib.sha1(io.open(path, 'rb').read()).hexdigest()[:8]
    except OSError:
        return ''
    return '?v=' + h

data = json.load(io.open(CMS_JSON, encoding='utf-8'))
imap = json.load(io.open(MAP_JSON, encoding='utf-8'))

E = html.escape

# В репозитории Теплоты статика лежит в public/ и отдаётся vite как есть,
# поэтому пути должны быть абсолютными. Определяем раскладку сами —
# так скрипт запускается одинаково и в Windows, и в CI, без переменных.
IN_REPO = os.path.exists(os.path.join(HERE, 'public', 'images', '_map.json'))
PREFIX = os.environ.get('ASSET_PREFIX', '/' if IN_REPO else '')


def img(name):
    return PREFIX + 'images/' + name if name else ''


def strip_tags(s):
    return re.sub(r'<[^>]+>', ' ', s or '').replace('&nbsp;', ' ').strip()


def intro(desc, limit=180):
    """Первый абзац описания — как краткий текст на плитке."""
    m = re.search(r'<p>(.*?)</p>', desc or '', re.S)
    t = strip_tags(m.group(1) if m else desc)
    t = re.sub(r'\s+', ' ', t)
    if len(t) > limit:
        cut = t[:limit].rsplit(' ', 1)[0]
        t = cut + '…'
    return t


def rich(fragment):
    """HTML из CMS отдаём как есть — это собственный контент сайта."""
    return (fragment or '').strip()


PHONE_MAIN = data['header']['phone']
PHONE_TEL = 'tel:' + re.sub(r'\D', '', PHONE_MAIN)
contact = data['contact']

# ---------------------------------------------------------------- секции

def hero():
    h = data['hero']
    title = h['title'].replace('*', '')
    sub = h['subtitle']
    return u'''
    <section class="hero blueprint blueprint--on-orange">
      <div class="hero-photo">
        <img src="%(img)s" alt="Монтаж инженерных систем">
      </div>

      <div class="shell">
        <div class="hero-top">
          <span class="eyebrow eyebrow--light">Инженерные системы под ключ</span>
          <span class="meta meta--light">Казань · Республика Татарстан</span>
        </div>

        <div class="hero-body">
          <div class="hero-lead">
            <h1 class="hero-kicker">Комплексный монтаж<em>отопления, водоснабжения и канализации</em></h1>
            <p class="hero-text">%(sub)s</p>

            <div class="chip-row">
              <span class="chip chip--light">отопление</span>
              <span class="chip chip--light">водоснабжение</span>
              <span class="chip chip--light">канализация</span>
              <span class="chip chip--light">тёплый пол</span>
              <span class="chip chip--light">автоматизация</span>
            </div>

            <div class="hero-cta">
              <a class="btn btn--light" href="#contacts">%(btn)s</a>
              <a class="btn btn--ghost-light" href="#works">%(btn2)s</a>
            </div>
          </div>

          <div class="hero-figure">
            <b>500<sup>+</sup></b>
            <i>реализованных<br>проектов</i>
          </div>
        </div>

        <div class="hero-mega">Теплота</div>
      </div>
    </section>
''' % {'img': img(imap['hero']), 'sub': E(sub),
       'btn': E(data['hero']['btnText']), 'btn2': E(data['hero']['secondaryBtnText'])}


def stats():
    return u'''
    <section class="sec blueprint" id="about" style="padding-block: 0 clamp(36px, 4.6vw, 68px);">
      <div class="shell">
        <div class="stats">
          <div class="stat reveal"><b>500<sup>+</sup></b><span>реализованных проектов в Татарстане</span></div>
          <div class="stat reveal"><b>15 лет</b><span>гарантия на материалы и оборудование</span></div>
          <div class="stat reveal"><b>с 2010</b><span>года на рынке инженерных систем</span></div>
          <div class="stat reveal"><b>3 года</b><span>гарантия на выполненные работы</span></div>
        </div>
      </div>
    </section>
'''


def manifest():
    a = data['about']
    text1 = a['text1'].replace('\n', ' ')
    return u'''
    <section class="manifest">
      <div class="manifest-photo is-plate">
        <img src="%(img)s" alt="Специалист «Теплоты» с планшетом">
      </div>

      <div class="shell manifest-inner">
        <div class="manifest-copy">
          <h2>Любая сложность<br>монтажа нам по плечу</h2>
          <p>%(text1)s. %(title)s: проектируем, поставляем оборудование, монтируем и
            обслуживаем — от квартиры до большого коттеджа.</p>

          <div class="pillars">
            <div class="pillar"><b>С 2010 года</b><span>на рынке ОВК</span></div>
            <div class="pillar"><b>Официальный дилер</b><span>Stout · Rommer · Arrowhead</span></div>
            <div class="pillar"><b>Гарантия</b><span>до 15 лет на материалы</span></div>
          </div>
        </div>
      </div>
    </section>
''' % {'img': img(imap['about']), 'text1': E(text1),
       'title': E(a['title'].replace(u'Теплота — мы профессиональная', u'«Теплота» — профессиональная'))}


def services():
    out = []
    for s in data['services']:
        pic = imap['services'].get(s['title'])
        out.append(u'''
          <article class="tile reveal">
            <div class="tile-pic"><img src="%(img)s" alt="%(t)s" loading="lazy"></div>
            <div class="tile-body">
              <h3>%(t)s</h3>
              <p>%(intro)s</p>
              <details class="more">
                <summary><span class="more-open">Что входит в услугу</span><span class="more-close">Свернуть</span></summary>
                <div class="rich">%(full)s</div>
              </details>
            </div>
          </article>''' % {'img': img(pic), 't': E(s['title']),
                           'intro': E(intro(s.get('description'))),
                           'full': rich(s.get('description'))})

    return u'''
    <section class="sec sec--paper2 blueprint" id="services">
      <div class="shell">
        <div class="sec-head">
          <span class="eyebrow">Что мы делаем</span>
          <h2 class="h2">Наши услуги<em>комплексный монтаж инженерных систем любой сложности</em></h2>
        </div>
        <div class="tiles">%s
        </div>
      </div>
    </section>
''' % ''.join(out)


def steps():
    return u'''
    <section class="sec blueprint" id="how">
      <div class="shell">
        <div class="sec-head">
          <span class="eyebrow">Как мы работаем</span>
          <h2 class="h2">Порядок работ<em>от выезда на объект до пусконаладки и гарантии</em></h2>
        </div>

        <div class="steps">
          <article class="step reveal">
            <span class="step-badge">01</span>
            <h3>Замер и проект</h3>
            <ul>
              <li>Выезд специалиста и консультация на объекте</li>
              <li>Индивидуальный теплотехнический расчёт</li>
              <li>Схема разводки и подбор оборудования под бюджет</li>
            </ul>
            <p class="step-time">1–5 дней</p>
            <p class="step-note">Считаем под конкретный дом: этажность, площадь, тип топлива и задачи заказчика.</p>
          </article>

          <article class="step reveal">
            <span class="step-badge">02</span>
            <h3>Поставка и монтаж</h3>
            <ul>
              <li>Котлы, радиаторы, трубы и автоматика от проверенных брендов</li>
              <li>Монтаж отопления, водоснабжения и канализации</li>
              <li>Прокладка труб, установка коллекторов и насосных групп</li>
            </ul>
            <p class="step-time">от 2 недель</p>
            <p class="step-note">Срок зависит от площади объекта, состава систем и готовности строительной части.</p>
          </article>

          <article class="step reveal">
            <span class="step-badge">03</span>
            <h3>Пусконаладка и гарантия</h3>
            <ul>
              <li>Опрессовка, тестирование и ввод в эксплуатацию</li>
              <li>Балансировка системы и обучение заказчика</li>
              <li>Гарантийный сервис и поддержка</li>
            </ul>
            <p class="step-time">1–3 дня</p>
            <p class="step-note">Гарантия на работы — до 3 лет, на материалы и оборудование — до 15 лет.</p>
          </article>
        </div>
      </div>
    </section>
'''


def advantages():
    items = []
    for a in data['advantages']:
        items.append(u'''
          <div class="value-item reveal">
            <b>%s</b>
            <span>%s</span>
          </div>''' % (E(a['title']), E(a.get('description') or a.get('text', ''))))

    return u'''
    <section class="values blueprint blueprint--on-orange" id="advantages">
      <div class="values-photo is-scene">
        <img src="%(img)s" alt="Котельная с газовым и твердотопливным котлом">
      </div>

      <div class="shell values-inner">
        <div class="values-copy">
          <span class="eyebrow eyebrow--light">Почему мы</span>
          <h2 style="margin-top:20px">Наши преимущества</h2>
          <p>Мы индивидуально подходим к каждому заказчику и работаем на качественных
            материалах от проверенных поставщиков — это позволяет выполнять монтаж
            в короткие сроки и отвечать за результат.</p>
          <a class="underlink" href="#contacts">
            Обсудить проект
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
              stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
          </a>
        </div>

        <div class="value-list">%(items)s
        </div>
      </div>
    </section>
''' % {'img': img(imap['values']), 'items': ''.join(items)}


def products():
    out = []
    for p in data['products']:
        pic = imap['products'].get(p['title'])
        details = rich(p.get('details'))
        more = u'''
              <details class="more">
                <summary><span class="more-open">Подробнее</span><span class="more-close">Свернуть</span></summary>
                <div class="rich">%s</div>
              </details>''' % details if details else ''
        out.append(u'''
          <article class="good reveal">
            <div class="good-pic"><img src="%(img)s" alt="%(t)s" loading="lazy"></div>
            <h3>%(t)s</h3>
            <p>%(d)s</p>%(more)s
          </article>''' % {'img': img(pic), 't': E(p['title']),
                          'd': E(p.get('description', '')), 'more': more})

    return u'''
    <section class="sec blueprint" id="products">
      <div class="shell">
        <div class="sec-head">
          <span class="eyebrow">Оборудование</span>
          <h2 class="h2">Наши товары<em>современное котельное оборудование для вашего дома</em></h2>
        </div>
        <div class="goods">%s
        </div>
      </div>
    </section>
''' % ''.join(out)


def works():
    out = []
    for g in data['gallery']:
        pic = imap['gallery'].get(g['title'])
        desc = g.get('description', '')
        place = ''
        m = re.search(r'([^.]+)\.\s*$', desc.strip())
        if m and len(m.group(1)) < 40:
            place = m.group(1).strip()
            desc = desc[:m.start()].strip()
        out.append(u'''
          <article class="tile reveal">
            <div class="tile-pic">
              <img src="%(img)s" alt="%(t)s" loading="lazy">%(tag)s
            </div>
            <div class="tile-body">
              <h3>%(t)s</h3>
              <p>%(d)s</p>
            </div>
          </article>''' % {
            'img': img(pic), 't': E(g['title']), 'd': E(desc),
            'tag': (u'<span class="tile-tag">%s</span>' % E(place)) if place else ''})

    return u'''
    <section class="sec sec--paper2 blueprint" id="works">
      <div class="shell">
        <div class="sec-head">
          <span class="eyebrow">Наши работы</span>
          <h2 class="h2">Объекты, сданные под ключ<em>частные дома и коттеджи в Казани и по Татарстану</em></h2>
        </div>
        <div class="tiles tiles--works">%s
        </div>
      </div>
    </section>
''' % ''.join(out)


def contacts():
    rows = []
    for ph in contact['phones']:
        rows.append(u'''
            <div class="contact-row">
              <span class="meta meta--light">%s</span>
              <a href="tel:%s">%s</a>
            </div>''' % (E(ph['label']), re.sub(r'\D', '', ph['number']), E(ph['number'])))
    rows.append(u'''
            <div class="contact-row">
              <span class="meta meta--light">Почта</span>
              <a href="mailto:%s">%s</a>
            </div>''' % (E(contact['email']), E(contact['email'])))
    rows.append(u'''
            <div class="contact-row">
              <span class="meta meta--light">Адрес</span>
              <p class="addr">%s</p>
            </div>''' % E(contact['address']))

    service_opts = ''.join(u'<option>%s</option>' % E(s['title']) for s in data['services'])

    return u'''
    <section class="join blueprint blueprint--on-orange" id="contacts">
      <div class="shell join-inner">
        <div class="join-copy">
          <h2>Рассчитать<br>смету</h2>
          <p>Оставьте заявку — перезвоним, зададим несколько вопросов по объекту
            и подготовим расчёт.</p>

          <div class="contact-list">%(rows)s
          </div>
        </div>

        <div class="form-card" id="form-card">
          <form class="form-grid" id="join-form" novalidate>
            <div class="field">
              <label for="name">Ваше имя</label>
              <input type="text" id="name" name="name" placeholder="Как к вам обращаться" autocomplete="name" data-required>
              <span class="field-err">Напишите, как к вам обращаться</span>
            </div>

            <div class="field">
              <label for="phone">Телефон</label>
              <input type="tel" id="phone" name="phone" placeholder="+7 (___) ___-__-__" inputmode="tel" autocomplete="tel" data-required data-rule="phone">
              <span class="field-err">Введите номер полностью</span>
            </div>

            <div class="field field--full">
              <label for="service">Что нужно сделать</label>
              <select id="service" name="service" data-required>
                <option value="">Выберите услугу</option>
                %(opts)s
                <option>Другое / несколько систем</option>
              </select>
              <span class="field-err">Выберите услугу</span>
            </div>

            <div class="field field--full">
              <label for="object">Объект <span style="text-transform:none;letter-spacing:0">— по желанию</span></label>
              <input type="text" id="object" name="object" placeholder="Например: частный дом 140 м², два этажа">
            </div>

            <div class="field field--full">
              <label for="note">Комментарий <span style="text-transform:none;letter-spacing:0">— по желанию</span></label>
              <textarea id="note" name="note" placeholder="Сроки, стадия строительства, пожелания по оборудованию"></textarea>
            </div>

            <div class="field field--full">
              <label class="consent" for="consent">
                <input type="checkbox" id="consent" name="consent" data-required>
                <span>Согласен на обработку персональных данных и ознакомлен с политикой конфиденциальности</span>
              </label>
              <span class="field-err" style="margin-top:6px">Без согласия отправить заявку нельзя</span>
            </div>

            <div class="field field--full">
              <button class="btn btn--primary btn--wide" type="submit">Отправить заявку</button>
            </div>
          </form>

          <p class="form-fail" role="alert" hidden></p>

          <div class="form-done" role="status" aria-live="polite">
            <div class="done-ico" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"
                stroke-linejoin="round"><path d="m5 12.5 4.5 4.5L19 7"/></svg>
            </div>
            <h3>Заявка принята</h3>
            <p>Перезвоним в рабочее время. Если нужно срочно — звоните на %(phone)s.</p>
          </div>
        </div>
      </div>
    </section>
''' % {'rows': ''.join(rows), 'opts': service_opts, 'phone': E(PHONE_MAIN)}


def partners_block():
    logos = []
    names = {'Aeeowhead': 'Arrowhead'}
    for pt in data['about']['partners']:
        f = imap['partners'].get(pt['name'])
        nm = names.get(pt['name'], pt['name'])
        if f:
            logos.append(u'<img src="%s" alt="%s" loading="lazy">' % (img(f), E(nm)))
    return u'''
        <div class="partners reveal">
          <span class="meta">Официальный дилер</span>
          %s
        </div>''' % '\n          '.join(logos)


def footer():
    f = data['footer']
    links = ''.join(u'<li><a href="%s">%s</a></li>' % (E(l['url']), E(l['label'])) for l in f['links'])
    srv = ''.join(u'<li><a href="#services">%s</a></li>' % E(s['title']) for s in data['services'])
    return u'''
  <footer class="site-footer">
    <div class="shell">
      <div class="footer-top">
        <div class="footer-brand">
          <a class="brand" href="#top" aria-label="Теплота — наверх">
            <img class="logo" src="images/logo-white.svg" alt="Теплота" width="220" height="33">
          </a>
          <p>Монтаж отопления, водоснабжения и канализации под ключ. Казань, Набережные Челны
            и вся Республика Татарстан.</p>
        </div>

        <div class="footer-col">
          <h4>Разделы</h4>
          <ul>
            <li><a href="#about">О компании</a></li>
            <li><a href="#services">Услуги</a></li>
            <li><a href="#products">Товары</a></li>
            <li><a href="#works">Наши работы</a></li>
            <li><a href="#contacts">Контакты</a></li>
          </ul>
        </div>

        <div class="footer-col">
          <h4>Услуги</h4>
          <ul>%(srv)s</ul>
        </div>

        <div class="footer-col">
          <h4>Контакты</h4>
          <a class="footer-phone" href="%(tel)s">%(phone)s</a>
          <ul>
            <li><a href="mailto:%(mail)s">%(mail)s</a></li>
            <li>%(addr)s</li>
            <li><a href="#contacts">Рассчитать смету</a></li>
          </ul>
        </div>
      </div>

      <div class="footer-bottom">
        <p>%(cr)s</p>
        <ul style="display:flex;gap:20px">%(links)s</ul>
      </div>
    </div>
  </footer>
''' % {'srv': srv, 'tel': PHONE_TEL, 'phone': E(PHONE_MAIN), 'mail': E(contact['email']),
       'addr': E(contact['address']), 'cr': E(f['copyright']), 'links': links}


# ---------------------------------------------------------------- страница
PAGE = u'''<!DOCTYPE html>
<html lang="ru">

<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Монтаж отопления, водоснабжения и канализации в Татарстане под ключ — Казань, Набережные Челны</title>
  <meta name="description"
    content="Профессиональный комплексный монтаж систем отопления, водоснабжения и канализации в Республике Татарстан. Частные дома, коттеджи. Работаем под ключ в Казани и по всей РТ.">
  <meta name="theme-color" content="#e5431b">

  <link rel="icon" type="image/svg+xml" href="%(pfx)sfavicon.svg">
  <link rel="icon" type="image/png" sizes="83x83" href="%(pfx)sfavicon.png">
  <link rel="shortcut icon" href="%(pfx)sfavicon.ico">

  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="stylesheet"
    href="https://fonts.googleapis.com/css2?family=Golos+Text:wght@400;500;600;700;900&family=JetBrains+Mono:wght@400;500;700&display=swap">
  <link rel="stylesheet" href="%(pfx)scss/styles.css%(css_v)s">

  <!-- Yandex.Metrika counter -->
  <script type="text/javascript">
    (function (m, e, t, r, i, k, a) {
      m[i] = m[i] || function () { (m[i].a = m[i].a || []).push(arguments) };
      m[i].l = 1 * new Date();
      for (var j = 0; j < document.scripts.length; j++) { if (document.scripts[j].src === r) { return; } }
      k = e.createElement(t), a = e.getElementsByTagName(t)[0], k.async = 1, k.src = r, a.parentNode.insertBefore(k, a)
    })(window, document, 'script', 'https://mc.yandex.ru/metrika/tag.js?id=110328542', 'ym');

    ym(110328542, 'init', {
      ssr: true, webvisor: true, clickmap: true, ecommerce: 'dataLayer',
      referrer: document.referrer, url: location.href,
      accurateTrackBounce: true, trackLinks: true
    });
  </script>
  <noscript>
    <div><img src="https://mc.yandex.ru/watch/110328542" style="position:absolute; left:-9999px;" alt="" /></div>
  </noscript>
  <!-- /Yandex.Metrika counter -->
</head>

<body>

  <header class="site-header" id="header">
    <div class="shell header-bar">
      <a class="brand" href="#top" aria-label="Теплота — на главную">
        <span class="logo-wrap">
          <img class="logo logo--dark" src="images/logo.svg" alt="Теплота" width="219" height="34">
          <img class="logo logo--light" src="images/logo-white.svg" alt="" aria-hidden="true" width="220" height="33">
        </span>
      </a>

      <nav class="site-nav" aria-label="Основная навигация">
        <ul>
          <li><a href="#about">О компании</a></li>
          <li><a href="#services">Услуги</a></li>
          <li><a href="#products">Товары</a></li>
          <li><a href="#works">Наши работы</a></li>
          <li><a href="#contacts">Контакты</a></li>
        </ul>
      </nav>

      <div class="header-side">
        <a class="header-phone" href="%(tel)s">%(phone)s</a>
        <a class="btn btn--primary" href="#contacts">%(cta)s</a>
        <button class="burger" type="button" id="burger" aria-expanded="false" aria-controls="mobile-menu"
          aria-label="Меню">
          <span></span><span></span><span></span>
        </button>
      </div>
    </div>
  </header>

  <div class="mobile-menu" id="mobile-menu">
    <a class="m-link" href="#about">О компании</a>
    <a class="m-link" href="#services">Услуги</a>
    <a class="m-link" href="#products">Товары</a>
    <a class="m-link" href="#works">Наши работы</a>
    <a class="m-link" href="#contacts">Контакты</a>
    <div class="m-foot">
      <a class="m-phone" href="%(tel)s">%(phone)s</a>
      <a class="btn btn--light btn--wide" href="#contacts">Рассчитать смету</a>
    </div>
  </div>

  <main id="top">
%(hero)s%(stats)s%(manifest)s%(services)s%(steps)s%(advantages)s%(products)s%(works)s%(contacts)s  </main>
%(footer)s
  <script src="%(pfx)sjs/app.js%(js_v)s" defer></script>
</body>

</html>
'''

# партнёров подвешиваем в конец полосы с цифрами
stats_html = stats().replace('</div>\n      </div>\n    </section>',
                             '</div>\n' + partners_block() + '\n      </div>\n    </section>')

page = PAGE % {
    'pfx': PREFIX,
    'css_v': stamp(os.path.join('css', 'styles.css')),
    'js_v': stamp(os.path.join('js', 'app.js')),
    'tel': PHONE_TEL, 'phone': E(PHONE_MAIN), 'cta': E(data['header']['btnText']),
    'hero': hero(), 'stats': stats_html, 'manifest': manifest(), 'services': services(),
    'steps': steps(), 'advantages': advantages(), 'products': products(),
    'works': works(), 'contacts': contacts(), 'footer': footer(),
}

io.open(OUT_HTML, 'w', encoding='utf-8').write(page)
print('index.html собран: %d КБ' % (len(page.encode('utf-8')) // 1024))
print('услуг: %d, товаров: %d, работ: %d, преимуществ: %d'
      % (len(data['services']), len(data['products']),
         len(data['gallery']), len(data['advantages'])))
