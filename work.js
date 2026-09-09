/* ============================================================
   WORK — render the clients whose sites are actually live.

   The filter is the whole design: a client appears only when it has a
   liveUrl. Everything else in the catalogue entry — repo, note, location,
   status — is internal working state and is never rendered here.

   Self-contained, like the other page scripts. Zero dependencies.
   ============================================================ */

(function () {
  'use strict';

  var STORAGE_KEY = 'obsidian.lang';   /* shared with the other pages */
  var DEFAULT_LANG = 'ar';

  /* U+2066 / U+2069 isolate a Latin run inside Arabic, so a path and the
     punctuation after it cannot reorder around the surrounding text. Same
     guard analytics.js uses, and the same class of bug as the price
     strings in the templates. */
  var L = '\u2066', P = '\u2069';

  var STRINGS = {
    skip:       { ar: 'تخطَّ إلى المحتوى', en: 'Skip to content' },
    brand:      { ar: 'أوبسيديان', en: 'Obsidian-Hub' },
    title:      { ar: 'أعمالنا · أوبسيديان', en: 'Our work · Obsidian-Hub' },

    pageTitle:  { ar: 'أعمالنا', en: 'Our work' },
    pageLede:   { ar: 'مواقع انطلقت فعلًا. كل واحد منها مبني على أحد قوالبنا، ومكسو بهوية صاحبه ومحتواه.',
                  en: 'Sites that have actually launched. Each one is built on one of our templates and dressed in its owner’s identity and words.' },

    waitTitle:  { ar: 'لا يوجد ما يُعرض بعد', en: 'Nothing to show yet' },
    waitBody:   { ar: 'تظهر هنا مواقع العملاء بمجرد انطلاقها. لا يُعرض أي عميل قبل أن يكون موقعه منشورًا على نطاقه.',
                  en: 'Client sites appear here once they launch. No client is shown before their site is live on their own domain.' },
    waitHow:    { ar: 'لإضافة عميل: ضع رابط موقعه في ' + L + 'liveUrl' + P + ' داخل ' + L + 'hub/catalogue.js' + P + '. تظهر البطاقة هنا، ويظهر رابط الصفحة في الرئيسية، دون أي تعديل آخر.',
                  en: 'To add one: put the site’s address in ' + L + 'liveUrl' + P + ' inside ' + L + 'hub/catalogue.js' + P + '. The card appears here and the link to this page appears on the homepage, with nothing else to edit.' },

    builtOn:    { ar: 'مبني على قالب', en: 'Built on the' },
    visit:      { ar: 'زر الموقع', en: 'Visit the site' },

    navHome:      { ar: 'الرئيسية', en: 'Home' },
    navTemplates: { ar: 'القوالب', en: 'Templates' }
  };

  var lang = readStored();

  function readStored() {
    try {
      var v = window.localStorage.getItem(STORAGE_KEY);
      if (v === 'ar' || v === 'en') return v;
    } catch (err) { /* blocked storage — fall through */ }
    return DEFAULT_LANG;
  }
  function writeStored(v) {
    try { window.localStorage.setItem(STORAGE_KEY, v); } catch (err) { /* not fatal */ }
  }
  function t(key) { var s = STRINGS[key]; return s ? s[lang] : ''; }
  function pick(v) { return (v && typeof v === 'object' && ('ar' in v)) ? v[lang] : v; }

  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text !== undefined && text !== null && text !== '') n.textContent = text;
    return n;
  }

  /* Only clients with a live site. A client mid-build is not portfolio
     material, and its name is not ours to publish. */
  function live() {
    return ((window.CATALOGUE && window.CATALOGUE.clients) || [])
      .filter(function (c) { return c.liveUrl; });
  }

  /* The template a client was built on, by name rather than by id. */
  function templateName(from) {
    var tpl = ((window.CATALOGUE && window.CATALOGUE.templates) || [])
      .filter(function (x) { return x.id === from; })[0];
    return tpl ? pick(tpl.name) : '';
  }

  function card(client) {
    var a = el('a', 'card client');
    a.href = client.liveUrl;
    /* Someone else's site, so it opens in its own tab. noopener because
       a new tab would otherwise get a handle on this window. */
    a.target = '_blank';
    a.rel = 'noopener';
    a.style.setProperty('--sw', client.accent || '');

    var panel = el('div', 'panel');
    /* The first character of the name stands in for a logo we do not have.
       Array.from, not [0] — a surrogate pair would be cut in half. */
    var name = pick(client.name) || '';
    panel.appendChild(el('span', 'initial', Array.from(name)[0] || ''));
    a.appendChild(panel);

    var body = el('div', 'body');
    body.appendChild(el('h3', null, name));
    body.appendChild(el('p', 'en', lang === 'ar' ? client.name.en : client.name.ar));

    var built = templateName(client.from);
    if (built) body.appendChild(el('p', 'built', t('builtOn') + ' ' + built));

    body.appendChild(el('p', 'go', t('visit')));
    a.appendChild(body);
    return a;
  }

  function render() {
    var mount = document.querySelector('[data-clients]');
    var waiting = document.querySelector('[data-state="waiting"]');
    if (!mount) return;

    var list = live();

    /* Exactly one of the two is on screen. An empty grid beside a hidden
       notice would be the visible hole this page exists to avoid. */
    mount.hidden = !list.length;
    if (waiting) waiting.hidden = !!list.length;

    if (!list.length) {
      mount.replaceChildren();
      return;
    }

    /* Once there is work to show, the page is worth indexing. */
    var noindex = document.querySelector('meta[data-noindex]');
    if (noindex) noindex.remove();

    mount.replaceChildren.apply(mount, list.map(card));
  }

  /* ---- Language ------------------------------------------------------- */

  function apply() {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.title = t('title');

    document.querySelectorAll('[data-i18n]').forEach(function (n) {
      var v = t(n.getAttribute('data-i18n'));
      if (v) n.textContent = v;
    });

    var toggle = document.querySelector('[data-lang-toggle]');
    if (toggle) toggle.textContent = lang === 'ar' ? 'English' : 'العربية';

    render();
  }

  /* The same contract the other pages expose; tools/audit.js drives the
     language switch through it. */
  window.I18N = {
    get: function () { return lang; },
    set: function (next) {
      if (next !== 'ar' && next !== 'en') return;
      lang = next;
      writeStored(lang);
      apply();
    }
  };

  function init() {
    var toggle = document.querySelector('[data-lang-toggle]');
    if (toggle) {
      toggle.addEventListener('click', function () {
        window.I18N.set(lang === 'ar' ? 'en' : 'ar');
      });
    }
    apply();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
