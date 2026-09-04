/* ============================================================
   HUB — renders both shelves from catalogue.js, and wires the gate.

   Deliberately plain: no framework, no build, no dependency. The hub is
   the one page that has to work even when a template branch is broken.
   ============================================================ */

(function () {
  'use strict';

  var STRINGS = {
    title:          { ar: 'قوالب مواقع للأعمال الصغيرة', en: 'Website templates for small businesses' },
    lede:           { ar: 'قوالب ثنائية اللغة، عربية أولًا مع تبديل للإنجليزية. بدون أي اعتماديات، وبدون خطوة بناء — مجرد ملفات تُرفع وتعمل.',
                      en: 'Bilingual templates, Arabic-first with an English toggle. No dependencies and no build step — just files you upload.' },
    templatesTitle: { ar: 'القوالب', en: 'Templates' },
    clientsTitle:   { ar: 'مشاريع العملاء', en: 'Client projects' },
    preview:        { ar: 'شاهد القالب', en: 'View template' },
    openRepo:       { ar: 'افتح المستودع الخاص', en: 'Open private repo' },
    viewLive:       { ar: 'شاهد الموقع', en: 'View live site' },
    basedOn:        { ar: 'مبني على', en: 'Built on' },
    startWith:      { ar: 'ابدأ مشروع عميل:', en: 'Start a client project:' },
    gateTitle:      { ar: 'هذا القسم مغلق', en: 'This section is closed' },
    gateText:       { ar: 'مشاريع العملاء محفوظة في مستودع خاص. أدخل كلمة المرور لعرض القائمة.',
                      en: 'Client projects live in a private repo. Enter the passphrase to see the list.' },
    gateLabel:      { ar: 'كلمة المرور', en: 'Passphrase' },
    gatePlaceholder:{ ar: 'كلمة المرور', en: 'Passphrase' },
    gateSubmit:     { ar: 'دخول', en: 'Enter' },
    gateWrong:      { ar: 'كلمة المرور غير صحيحة.', en: 'That passphrase is not right.' },
    gateInsecure:   { ar: 'يتطلب هذا اتصالًا آمنًا (https).', en: 'This needs a secure connection (https).' },
    gateNote:       { ar: 'هذه بوابة للترتيب فقط، وليست حماية. المواقع نفسها غير منشورة هنا إطلاقًا — هي في مستودع خاص تتحكم فيه صلاحيات GitHub.',
                      en: 'This gate is for tidiness, not protection. The sites themselves are never published here — they live in a private repo, behind GitHub’s own access control.' },
    footLeft:       { ar: 'عربية أولًا · RTL · بدون اعتماديات', en: 'Arabic-first · RTL · no dependencies' },
    empty:          { ar: 'لا يوجد شيء هنا بعد.', en: 'Nothing here yet.' },
    status: {
      building: { ar: 'قيد التنفيذ', en: 'Building' },
      review:   { ar: 'قيد المراجعة', en: 'In review' },
      live:     { ar: 'منشور',       en: 'Live' },
      paused:   { ar: 'متوقف',       en: 'Paused' }
    }
  };

  var lang = 'ar';
  var C = window.CATALOGUE || { templates: [], clients: [] };

  function t(key) { var s = STRINGS[key]; return s ? s[lang] : ''; }
  function pick(v) { return (v && typeof v === 'object' && ('ar' in v)) ? v[lang] : v; }

  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text) n.textContent = text;
    return n;
  }

  /* The swatch shows immediately; a screenshot fades over it if CI has shot
     one. Before the first deploy there are no shots, and the shelf still
     reads correctly rather than showing broken images.

     Only entries with a `dest` are ever requested. That is not a special
     case for clients — it falls straight out of the privacy rule: a client
     has no `dest` because it is never published, so there is nothing to
     screenshot, so we must not ask for one and log a 404 doing it. */
  function thumb(entry, label) {
    var box = el('div', 'thumb');
    box.style.setProperty('--sw', entry.accent);
    box.appendChild(el('span', null, label));

    if (entry.dest) {
      var img = new Image();
      img.alt = '';
      img.loading = 'lazy';
      img.onload = function () { img.classList.add('is-loaded'); };
      img.src = 'shots/' + entry.id + '.jpg';
      box.appendChild(img);
    }
    return box;
  }

  function templateCard(tpl) {
    var card = el('a', 'card');
    card.href = tpl.dest + '/';
    card.style.setProperty('--sw', tpl.accent);
    card.appendChild(thumb(tpl, 'Template ' + tpl.number));

    var body = el('div', 'body');
    body.appendChild(el('h3', null, pick(tpl.name)));
    body.appendChild(el('p', 'en', lang === 'ar' ? tpl.name.en : tpl.name.ar));
    body.appendChild(el('p', null, pick(tpl.desc)));
    body.appendChild(el('p', 'fits', pick(tpl.fits)));

    var cmd = el('code', 'cmd', 'tools/start-project.sh ' + tpl.id + ' <client>');
    cmd.title = t('startWith');
    body.appendChild(cmd);

    body.appendChild(el('span', 'go', t('preview')));
    card.appendChild(body);
    return card;
  }

  function clientCard(client) {
    /* Links to the private repo, or to the client's own live site once it
       is deployed. Never to anything on this origin — no client site is
       published here. */
    var href = client.liveUrl || client.repo;
    var card = el('a', 'card');
    card.href = href;
    card.target = '_blank';
    card.rel = 'noopener';
    card.style.setProperty('--sw', client.accent);

    var from = (C.templates.filter(function (x) { return x.id === client.from; })[0] || {}).name;
    card.appendChild(thumb(client, 'Client'));

    var body = el('div', 'body');
    var status = el('span', 'pill pill--status', (STRINGS.status[client.status] || {})[lang] || client.status);
    status.style.setProperty('--sw', client.accent);
    body.appendChild(status);

    body.appendChild(el('h3', null, pick(client.name)));
    body.appendChild(el('p', 'en', pick(client.location)));
    if (client.note) body.appendChild(el('p', null, pick(client.note)));
    if (from) body.appendChild(el('p', 'fits', t('basedOn') + ' — ' + pick(from)));

    body.appendChild(el('span', 'go', client.liveUrl ? t('viewLive') : t('openRepo')));
    card.appendChild(body);
    return card;
  }

  function fill(shelf, items, build) {
    var mount = document.querySelector('[data-shelf="' + shelf + '"]');
    if (!mount) return;
    mount.replaceChildren();
    if (!items.length) { mount.appendChild(el('p', 'fits', t('empty'))); return; }
    items.forEach(function (item) { mount.appendChild(build(item)); });
  }

  function render() {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';

    document.querySelectorAll('[data-t]').forEach(function (n) {
      var v = t(n.getAttribute('data-t'));
      if (v) n.textContent = v;
    });
    document.querySelectorAll('[data-t-attr]').forEach(function (n) {
      n.getAttribute('data-t-attr').split(',').forEach(function (pair) {
        var half = pair.split(':');
        if (half.length === 2) n.setAttribute(half[0].trim(), t(half[1].trim()));
      });
    });

    document.querySelector('[data-lang-toggle]').textContent = lang === 'ar' ? 'English' : 'العربية';
    document.querySelector('[data-count="templates"]').textContent = C.templates.length;
    document.querySelector('[data-count="clients"]').textContent = C.clients.length;

    fill('templates', C.templates, templateCard);
    if (window.HubGate && window.HubGate.isOpen()) fill('clients', C.clients, clientCard);
  }

  function openClientShelf() {
    document.querySelector('[data-gate]').hidden = true;
    var shelf = document.querySelector('[data-shelf="clients"]');
    shelf.hidden = false;
    fill('clients', C.clients, clientCard);
  }

  function init() {
    document.querySelector('[data-lang-toggle]').addEventListener('click', function () {
      lang = lang === 'ar' ? 'en' : 'ar';
      render();
    });

    var form = document.querySelector('[data-gate-form]');
    var input = document.querySelector('[data-gate-input]');
    var error = document.querySelector('[data-gate-error]');

    form.addEventListener('submit', async function (event) {
      event.preventDefault();
      var ok = await window.HubGate.check(input.value);
      if (ok === null) { error.textContent = t('gateInsecure'); return; }
      if (!ok) { error.textContent = t('gateWrong'); input.select(); return; }
      error.textContent = '';
      window.HubGate.remember();
      openClientShelf();
    });

    render();
    if (window.HubGate.isOpen()) openClientShelf();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
