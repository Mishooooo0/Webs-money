/* ============================================================
   SITE — language switching and the template shelf.

   Self-contained, like site.css: the front door must not import from a
   template branch that could be mid-reskin.

   Arabic ships inside index.html as static markup, so this file's only
   job on first paint is to restore a stored English preference. Nothing
   here is required for the page to be readable.
   ============================================================ */

(function () {
  'use strict';

  var STORAGE_KEY = 'obsidian.lang';
  var DEFAULT_LANG = 'ar';

  /* Every string the page can show in either language. The Arabic half is
     duplicated from index.html on purpose: the HTML is what a visitor
     without JavaScript reads, this is what the toggle swaps to and back. */
  var STRINGS = {
    skip:            { ar: 'تخطَّ إلى المحتوى', en: 'Skip to content' },
    brand:           { ar: 'أوبسيديان', en: 'Obsidian-Hub' },
    strapline:       { ar: 'أوبسيديان · Obsidian-Hub', en: 'Obsidian-Hub · أوبسيديان' },

    heroTitle:       { ar: 'مواقع عربية للأعمال الصغيرة',
                       en: 'Arabic-first websites for small businesses' },
    heroLede:        { ar: 'نبدأ من قالب جاهز، نكسوه بهويتك ومحتواك، ونسلّمك موقعًا يفتح سريعًا ويقرأ بالعربية كما يجب.',
                       en: 'We start from a finished template, dress it in your identity and your words, and hand you a site that opens fast and reads properly in Arabic.' },
    ctaTemplates:    { ar: 'شاهد القوالب', en: 'See the templates' },
    ctaContact:      { ar: 'تواصل معنا', en: 'Get in touch' },

    whatEyebrow:     { ar: 'ما الذي تحصل عليه', en: 'What you get' },
    whatTitle:       { ar: 'مبني للعربية، لا مترجم إليها',
                       en: 'Built for Arabic, not translated into it' },
    f1Title:         { ar: 'العربية أولًا', en: 'Arabic first' },
    f1Body:          { ar: 'الاتجاه من اليمين، والخط والمسافات مضبوطة للعربية من الأساس — لا قالب إنجليزي مقلوب.',
                       en: 'Right-to-left throughout, with type and spacing set for Arabic from the start — not an English layout flipped over.' },
    f2Title:         { ar: 'لغتان بضغطة', en: 'Two languages, one tap' },
    f2Body:          { ar: 'زر واحد ينقل الموقع كاملًا إلى الإنجليزية ويعيده. المحتوى مكتوب مرة واحدة في ملف واحد.',
                       en: 'One button moves the whole site to English and back. The content is written once, in one file.' },
    f3Title:         { ar: 'بدون اعتماديات', en: 'No dependencies' },
    f3Body:          { ar: 'ملفات HTML و CSS فقط. لا إطار عمل ولا خطوة بناء، ولا شيء ينكسر بعد سنة لأن مكتبة تحدّثت.',
                       en: 'Plain HTML and CSS. No framework, no build step, and nothing that breaks a year from now because a library moved on.' },
    f4Title:         { ar: 'الملفات ملكك', en: 'The files are yours' },
    f4Body:          { ar: 'تستلم الموقع ملفات كاملة. تستضيفه حيث تشاء، وتنقله متى شئت، دون العودة إلينا.',
                       en: 'You receive the site as complete files. Host it where you like and move it whenever you like, without coming back to us.' },

    tplEyebrow:      { ar: 'القوالب', en: 'Templates' },
    tplTitle:        { ar: 'ثلاثة قوالب، كلها تعمل الآن',
                       en: 'Three templates, all of them working today' },
    tplLede:         { ar: 'افتح أيًّا منها وتصفّحه كما يتصفّحه زبونك. ما تراه هو ما يُسلَّم، بمحتواك أنت مكان المحتوى التجريبي.',
                       en: 'Open any of them and browse as your customer would. What you see is what ships, with your content in place of the sample.' },
    view:            { ar: 'التفاصيل', en: 'Details' },
    allDetails:      { ar: 'كل التفاصيل ←', en: 'All the detail →' },

    howEyebrow:      { ar: 'كيف نعمل', en: 'How it works' },
    howTitle:        { ar: 'أربع خطوات، لا أكثر', en: 'Four steps, no more' },
    s1Title:         { ar: 'تختار قالبًا', en: 'You pick a template' },
    s1Body:          { ar: 'تفتح القوالب الثلاثة وتختار الأقرب لنشاطك.',
                       en: 'Open all three and choose the one closest to your business.' },
    s2Title:         { ar: 'نكسوه بهويتك', en: 'We dress it in your identity' },
    s2Body:          { ar: 'اسمك وألوانك وصورك ومحتواك، ومنيو أو قائمة خدمات إن كان النشاط يحتاجها.',
                       en: 'Your name, colours, photographs and words — plus a menu or service list if the business needs one.' },
    s3Title:         { ar: 'تراجعه قبل النشر', en: 'You review it before launch' },
    s3Body:          { ar: 'ترى الموقع كاملًا وتطلب ما تريد تعديله، قبل أن يراه أحد.',
                       en: 'You see the whole site and ask for changes before anyone else sees it.' },
    s4Title:         { ar: 'ينطلق', en: 'It ships' },
    s4Body:          { ar: 'نربطه بنطاقك ونسلّمك الملفات.',
                       en: 'We connect it to your domain and hand you the files.' },

    contactEyebrow:  { ar: 'تواصل', en: 'Contact' },
    contactTitle:    { ar: 'احكِ لنا عن نشاطك', en: 'Tell us about your business' },
    contactLede:     { ar: 'أرسل اسم النشاط ونوعه، ونرد عليك بالقالب الأنسب وما نحتاجه منك للبدء.',
                       en: 'Send the name and the kind of business, and we will reply with the template that fits and what we need from you to start.' },
    labelWhatsapp:   { ar: 'واتساب', en: 'WhatsApp' },
    labelEmail:      { ar: 'البريد', en: 'Email' },
    labelInstagram:  { ar: 'إنستقرام', en: 'Instagram' },

    footLeft:        { ar: 'عربية أولًا · RTL · بدون اعتماديات',
                       en: 'Arabic-first · RTL · no dependencies' }
  };

  var lang = readStored();

  function readStored() {
    try {
      var v = window.localStorage.getItem(STORAGE_KEY);
      if (v === 'ar' || v === 'en') return v;
    } catch (err) { /* private mode or blocked storage — fall through */ }
    return DEFAULT_LANG;
  }

  function writeStored(v) {
    try { window.localStorage.setItem(STORAGE_KEY, v); }
    catch (err) { /* not fatal — the choice just won't survive a reload */ }
  }

  function t(key) { var s = STRINGS[key]; return s ? s[lang] : ''; }

  /* Unwrap an { ar, en } pair from the catalogue for the active language. */
  function pick(v) {
    return (v && typeof v === 'object' && ('ar' in v)) ? v[lang] : v;
  }

  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text !== undefined && text !== null && text !== '') n.textContent = text;
    return n;
  }

  /* ---- Template cards ------------------------------------------------ */

  function card(tpl) {
    var a = el('a', 'card');
    /* The card opens the detail on templates.html, not the live demo. The
       demo is one more click from there, behind the page list and what the
       template holds — which is what someone deciding actually needs. */
    a.href = 'templates.html#' + tpl.id;
    /* The accent drives the swatch and the "view" arrow, so each card
       carries a hint of the template it opens. */
    a.style.setProperty('--sw', tpl.accent);

    var thumb = el('div', 'thumb');
    thumb.appendChild(el('span', null, tpl.number));

    /* The screenshot fades in over the swatch once it loads. CI renders
       these into shots/, and a missing one simply never fades in — the
       card still reads. */
    var img = new Image();
    img.alt = '';
    img.addEventListener('load', function () { img.classList.add('is-loaded'); });
    img.src = 'shots/' + tpl.id + '/index.jpg';
    thumb.appendChild(img);
    a.appendChild(thumb);

    var body = el('div', 'body');
    body.appendChild(el('h3', null, pick(tpl.name)));
    /* The other language's name, as a quiet second line. */
    body.appendChild(el('p', 'en', lang === 'ar' ? tpl.name.en : tpl.name.ar));
    body.appendChild(el('p', null, pick(tpl.desc)));
    body.appendChild(el('p', 'fits', pick(tpl.fits)));
    body.appendChild(el('p', 'go', t('view')));
    a.appendChild(body);

    return a;
  }

  function renderShelf() {
    var mount = document.querySelector('[data-shelf="templates"]');
    if (!mount) return;

    var list = (window.CATALOGUE && window.CATALOGUE.templates) || [];
    /* Only entries with a dest are published, and only those have a page
       to link to. Client entries carry none — that is what keeps them
       unpublishable, see hub/catalogue.js. */
    var shown = list.filter(function (tpl) { return tpl.dest; });

    /* An empty grid reads as a broken page, so let the <noscript> block's
       job fall to nobody rather than leaving a visible hole: hide the
       whole section if the catalogue somehow arrives empty. */
    var section = mount.closest('section');
    if (section) section.hidden = !shown.length;
    if (!shown.length) return;

    mount.replaceChildren.apply(mount, shown.map(card));
  }

  /* ---- Language ------------------------------------------------------- */

  function apply() {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';

    document.querySelectorAll('[data-i18n]').forEach(function (n) {
      var v = t(n.getAttribute('data-i18n'));
      if (v) n.textContent = v;
    });

    var toggle = document.querySelector('[data-lang-toggle]');
    if (toggle) toggle.textContent = lang === 'ar' ? 'English' : 'العربية';

    /* Re-render rather than patch: the cards carry text in both languages
       and the arrow direction flips with dir. */
    renderShelf();
  }

  function init() {
    var toggle = document.querySelector('[data-lang-toggle]');
    if (toggle) {
      toggle.addEventListener('click', function () {
        lang = lang === 'ar' ? 'en' : 'ar';
        writeStored(lang);
        apply();
      });
    }
    apply();
  }

  /* The same minimal surface assets/js/i18n.js exposes on the template
     branches. tools/audit.js drives the language switch through it, so
     honouring the contract is what gets this page audited in English
     rather than twice in Arabic. */
  window.I18N = {
    get: function () { return lang; },
    set: function (next) {
      if (next !== 'ar' && next !== 'en') return;
      lang = next;
      writeStored(lang);
      apply();
    }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
