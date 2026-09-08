/* ============================================================
   TEMPLATES — render one section per template from hub/catalogue.js.

   Nothing about a template is written into templates.html: the page list,
   what it holds, the names and the accent all come from the catalogue,
   which tools/check-hub.js §2b compares against the branch on every push.
   So what this page says about a template cannot drift away from what
   the template actually is.

   Self-contained, like site.js. Zero dependencies.
   ============================================================ */

(function () {
  'use strict';

  var STORAGE_KEY = 'obsidian.lang';   /* shared with site.js and analytics.js */
  var DEFAULT_LANG = 'ar';

  var STRINGS = {
    skip:      { ar: 'تخطَّ إلى المحتوى', en: 'Skip to content' },
    brand:     { ar: 'أوبسيديان', en: 'Obsidian-Hub' },
    title:     { ar: 'القوالب · أوبسيديان', en: 'Templates · Obsidian-Hub' },

    pageTitle: { ar: 'القوالب', en: 'The templates' },
    pageLede:  { ar: 'كل قالب هنا موقع كامل يعمل الآن، لا صورة تصميم. تحت كل واحد صفحاته وما يحتويه، ورابط تفتحه وتتصفّحه كما يتصفّحه زبونك.',
                 en: 'Each of these is a complete, working site — not a mockup. Under every one: its pages, what it holds, and a link to open it and browse as your customer would.' },

    holdsLabel: { ar: 'يحتوي على', en: 'What it holds' },
    pagesLabel: { ar: 'صفحاته', en: 'Its pages' },
    openPage:   { ar: 'افتح القالب', en: 'Open the template' },
    fitsLabel:  { ar: 'يناسب', en: 'Fits' },
    backHome:   { ar: '← الرئيسية', en: '← Home' }
  };

  /* "5 صفحات" is not a rule Arabic follows: 1 is صفحة, 2 صفحتان, 3–10
     صفحات, 11+ صفحة again. Getting it wrong on a page that sells careful
     Arabic would be the wrong thing to get wrong. */
  function pageCount(n) {
    if (lang === 'en') return n + (n === 1 ? ' page' : ' pages');
    if (n === 1) return 'صفحة واحدة';
    if (n === 2) return 'صفحتان';
    if (n <= 10) return n + ' صفحات';
    return n + ' صفحة';
  }

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

  /* ---- One page thumbnail -------------------------------------------- */

  function shot(tpl, pg) {
    var a = el('a', 'shot');
    a.href = tpl.dest + '/' + pg.file;

    var frame = el('div', 'frame');
    var img = new Image();
    img.alt = '';
    img.addEventListener('load', function () { img.classList.add('is-loaded'); });
    /* Rendered by .github/pages/shoot.js into _site/shots/. A shot that is
       missing simply never fades in and the accent frame stands in for it,
       so the gallery reads with or without CI having run. */
    img.src = 'shots/' + tpl.id + '/' + pg.file.replace(/\.html$/, '') + '.jpg';
    frame.appendChild(img);
    a.appendChild(frame);

    a.appendChild(el('span', 'cap', pick(pg)));
    /* The other language's name for the same page, quietly. */
    a.appendChild(el('span', 'cap-en', lang === 'ar' ? pg.en : pg.ar));
    return a;
  }

  /* ---- One template --------------------------------------------------- */

  function section(tpl) {
    var sec = el('section', 'tpl');
    sec.id = tpl.id;
    sec.style.setProperty('--sw', tpl.accent);

    var wrap = el('div', 'wrap');

    var head = el('div', 'tpl-head');
    head.appendChild(el('span', 'tpl-num u-ltr', tpl.number));
    var titles = document.createElement('div');
    titles.appendChild(el('h2', null, pick(tpl.name)));
    titles.appendChild(el('p', 'en', lang === 'ar' ? tpl.name.en : tpl.name.ar));
    head.appendChild(titles);
    wrap.appendChild(head);

    wrap.appendChild(el('p', 'tpl-desc', pick(tpl.desc)));
    wrap.appendChild(el('p', 'tpl-fits', t('fitsLabel') + ': ' + pick(tpl.fits)));

    /* What it holds. The catalogue guarantees a non-empty holds[] and
       check-hub fails the build otherwise, but a mount with nothing in it
       still leaves a visible hole — so the label goes up with the list, or
       neither does. */
    var holds = tpl.holds || [];
    if (holds.length) {
      wrap.appendChild(el('span', 'eyebrow', t('holdsLabel')));
      var ul = el('ul', 'holds');
      holds.forEach(function (h) { ul.appendChild(el('li', null, pick(h))); });
      wrap.appendChild(ul);
    }

    var pages = tpl.pages || [];
    if (pages.length) {
      var subHead = el('div', 'sub-head');
      subHead.appendChild(el('span', 'eyebrow', t('pagesLabel')));
      subHead.appendChild(el('span', 'count', pageCount(pages.length)));
      wrap.appendChild(subHead);

      var gallery = el('div', 'gallery');
      /* A scrolling row is only discoverable if it announces itself. */
      gallery.setAttribute('role', 'group');
      gallery.setAttribute('aria-label', pick(tpl.name) + ' — ' + t('pagesLabel'));
      gallery.tabIndex = 0;
      pages.forEach(function (pg) { gallery.appendChild(shot(tpl, pg)); });
      wrap.appendChild(gallery);
    }

    var cta = el('div', 'tpl-cta');
    var link = el('a', 'btn btn--onlight', t('openPage'));
    link.href = tpl.dest + '/';
    cta.appendChild(link);
    wrap.appendChild(cta);

    sec.appendChild(wrap);
    return sec;
  }

  function render() {
    var mount = document.querySelector('[data-templates]');
    if (!mount) return;

    var list = ((window.CATALOGUE && window.CATALOGUE.templates) || [])
      .filter(function (tpl) { return tpl.dest; });

    mount.replaceChildren.apply(mount, list.map(section));
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

  /* The same contract site.js and the template branches expose. tools/audit.js
     drives the language switch through it. */
  window.I18N = {
    get: function () { return lang; },
    set: function (next) {
      if (next !== 'ar' && next !== 'en') return;
      lang = next;
      writeStored(lang);
      apply();
      /* A re-render drops the element the URL fragment pointed at, so the
         browser has nothing to keep in view. Put it back. */
      if (location.hash) {
        var target = document.getElementById(location.hash.slice(1));
        if (target) target.scrollIntoView();
      }
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

    /* Sections are built after the browser has already tried to resolve the
       fragment, so #cafe arriving from a homepage card would land nowhere. */
    if (location.hash) {
      var target = document.getElementById(location.hash.slice(1));
      if (target) target.scrollIntoView();
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
