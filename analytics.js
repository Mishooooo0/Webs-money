/* ============================================================
   ANALYTICS — read /_stats and render it.

   /_stats is served by tools/site-server.js to loopback only. There are
   exactly two outcomes and the page must show which one happened:

     it responds  → real numbers
     it does not  → say so

   There is no third state where the page shows zeros. A zero that means
   "no server" is indistinguishable from a zero that means "nobody came",
   and quietly showing the first as the second is the one failure an
   analytics page cannot afford.

   Zero dependencies, like everything else here.
   ============================================================ */

(function () {
  'use strict';

  var TOP_N = 12;        /* Enough to see the shape; past this it is a table. */
  var STORAGE_KEY = 'obsidian.lang';   /* shared with site.js, so the choice carries over */

  /* U+2066 / U+2069 isolate a Latin path inside Arabic. Without them a
     string like "/_stats" reorders around the surrounding text — the same
     bidi trap as the price strings in the templates. */
  var L = '\u2066', P = '\u2069';

  var STRINGS = {
    navBrand:      { ar: 'الزيارات', en: 'Visits' },
    loading:       { ar: '…جارٍ القراءة', en: 'Reading…' },

    unavailTitle:  { ar: 'لا توجد أرقام هنا', en: 'Nothing is counting here' },
    unavailBody1:  { ar: 'هذه الصفحة تقرأ العدّاد من ' + L + '/_stats' + P + '، وهو لا يعمل إلا حين يكون الموقع مُقدَّمًا من خادم Node الخاص بنا. الاستضافة الحالية ثابتة، فلا يوجد ما يَعُدّ.',
                     en: 'This page reads the counter from ' + L + '/_stats' + P + ', which only exists when the site is served by our own Node server. This host is static, so there is nothing doing the counting.' },
    unavailBody2:  { ar: 'شغّل الموقع محليًا عبر ' + L + 'tools/server.js' + P + ' لترى الأرقام، أو فعّل Cloudflare Web Analytics للاستضافة الثابتة — الخطوات مكتوبة داخل ' + L + 'index.html' + P + ' وفي ' + L + 'SITE.md' + P + '.',
                     en: 'Run the site locally with ' + L + 'tools/server.js' + P + ' to see real numbers, or switch on Cloudflare Web Analytics for static hosting — the steps are written inside ' + L + 'index.html' + P + ' and in ' + L + 'SITE.md' + P + '.' },

    heroLabel:     { ar: 'زائر منذ بداية العدّ', en: 'Visitors since counting began' },
    kpiViews:      { ar: 'مشاهدات الصفحات', en: 'Page views' },
    kpiTodayVisits:{ ar: 'زوّار اليوم', en: 'Visitors today' },
    kpiTodayViews: { ar: 'مشاهدات اليوم', en: 'Views today' },
    kpiLastSeen:   { ar: 'آخر زيارة', en: 'Last visit' },

    pagesTitle:    { ar: 'الصفحات الأكثر زيارة', en: 'Most visited pages' },
    noPages:       { ar: 'لم تُسجَّل أي صفحة بعد.', en: 'No pages recorded yet.' },
    tableShow:     { ar: 'اعرض كجدول', en: 'Show as a table' },
    tableHide:     { ar: 'أخفِ الجدول', en: 'Hide the table' },
    thPage:        { ar: 'الصفحة', en: 'Page' },
    thViews:       { ar: 'المشاهدات', en: 'Views' },
    sincePrefix:   { ar: 'منذ ', en: 'Since ' },

    privacy:       { ar: 'العدّاد لا يضع كوكيز ولا يحفظ عنوان IP. الزائر يُحتسب عبر بصمة يومية تُمزج بملح عشوائي يتغيّر كل يوم، فلا يمكن ربط زيارات اليوم بزيارات الأمس. الزواحف المعروفة مستبعَدة من العد.',
                     en: 'The counter sets no cookies and stores no IP address. A visitor is counted through a daily fingerprint mixed with a random salt that changes every day, so today\u2019s visits cannot be matched against yesterday\u2019s. Known crawlers are left out of the count.' },
    title:         { ar: 'الزيارات · أوبسيديان', en: 'Visits · Obsidian-Hub' }
  };

  var lang = readStored();
  function readStored() {
    try {
      var v = window.localStorage.getItem(STORAGE_KEY);
      if (v === 'ar' || v === 'en') return v;
    } catch (err) { /* blocked storage — fall through */ }
    return 'ar';
  }
  function writeStored(v) {
    try { window.localStorage.setItem(STORAGE_KEY, v); } catch (err) { /* not fatal */ }
  }
  function t(key) { var s = STRINGS[key]; return s ? s[lang] : ''; }

  /* Number and date formatting follow the active language. */
  function LANGTAG() { return lang; }

  function $(sel) { return document.querySelector(sel); }
  function show(state) {
    document.querySelectorAll('[data-state]').forEach(function (n) {
      n.hidden = n.getAttribute('data-state') !== state;
    });
  }

  /* 1,284 / 12.9K — proportional figures at display size, so no padding. */
  function compact(n) {
    if (typeof n !== 'number' || !isFinite(n)) return '—';
    try {
      return new Intl.NumberFormat(LANGTAG(), { notation: 'compact', maximumFractionDigits: 1 }).format(n);
    } catch (err) {
      return String(n);
    }
  }

  function relative(iso) {
    if (!iso) return '—';
    var then = new Date(iso);
    if (isNaN(then)) return '—';
    var secs = Math.round((then - Date.now()) / 1000);
    var units = [['second', 60], ['minute', 60], ['hour', 24], ['day', 7], ['week', 4.35], ['month', 12], ['year', Infinity]];
    var value = secs;
    for (var i = 0; i < units.length; i++) {
      if (Math.abs(value) < units[i][1] || units[i][1] === Infinity) {
        try {
          return new Intl.RelativeTimeFormat(LANGTAG(), { numeric: 'auto' }).format(Math.round(value), units[i][0]);
        } catch (err) {
          return then.toLocaleDateString(LANGTAG());
        }
      }
      value /= units[i][1];
    }
    return then.toLocaleDateString(LANGTAG());
  }

  function onDate(iso) {
    if (!iso) return '';
    var d = new Date(iso);
    if (isNaN(d)) return '';
    try { return t('sincePrefix') + d.toLocaleDateString(LANGTAG(), { year: 'numeric', month: 'long', day: 'numeric' }); }
    catch (err) { return ''; }
  }

  /* ---- Pages ---------------------------------------------------------- */

  function renderPages(pages) {
    var mount = $('[data-pages]');
    var tbody = document.querySelector('[data-table] tbody');
    if (!mount) return;

    var rows = Object.keys(pages || {})
      .map(function (name) { return { name: name, n: pages[name] }; })
      .sort(function (a, b) { return b.n - a.n; });

    mount.replaceChildren();
    if (tbody) tbody.replaceChildren();

    /* An empty page list is a real state on a site nobody has opened yet.
       Say that, rather than leaving a blank strip that reads as broken. */
    if (!rows.length) {
      var empty = document.createElement('p');
      empty.className = 'privacy';
      empty.style.marginTop = '0';
      empty.textContent = t('noPages');
      mount.appendChild(empty);
      return;
    }

    var max = rows[0].n || 1;

    rows.slice(0, TOP_N).forEach(function (row) {
      var wrap = document.createElement('div');
      wrap.className = 'page-row';
      /* Hover target is the whole row, not the 10px bar. */
      wrap.title = row.name + ' — ' + row.n;

      var name = document.createElement('span');
      name.className = 'name';
      name.textContent = row.name;

      var n = document.createElement('span');
      n.className = 'n';
      n.textContent = row.n;

      var track = document.createElement('div');
      track.className = 'track';
      var fill = document.createElement('div');
      fill.className = 'fill';
      fill.style.width = Math.max(1, Math.round((row.n / max) * 100)) + '%';
      track.appendChild(fill);

      wrap.append(name, n, track);
      mount.appendChild(wrap);
    });

    /* The table carries every row, not just the top slice. */
    if (tbody) {
      rows.forEach(function (row) {
        var tr = document.createElement('tr');
        var td1 = document.createElement('td');
        td1.textContent = row.name;
        var td2 = document.createElement('td');
        td2.className = 'num';
        td2.textContent = row.n;
        tr.append(td1, td2);
        tbody.appendChild(tr);
      });
    }
  }

  /* ---- Site selection --------------------------------------------------
     tools/site-server.js keys its counts by site. Served with
     singleSite there is exactly one, which is the normal case. If a
     multi-site run put several in the file, ask rather than guess — and
     never sum them, which would invent a number that is not any site's. */

  function chooseSite(sites, onPick) {
    var keys = Object.keys(sites || {});
    if (!keys.length) return null;
    if (keys.length === 1) return sites[keys[0]];

    var preferred = keys.indexOf('obsidian-hub') !== -1 ? 'obsidian-hub' : keys[0];
    var sel = document.createElement('select');
    sel.style.cssText = 'margin-bottom:20px;padding:8px 12px;border:1px solid var(--line);border-radius:8px;background:var(--surface);font:inherit';
    keys.forEach(function (k) {
      var o = document.createElement('option');
      o.value = k; o.textContent = k;
      if (k === preferred) o.selected = true;
      sel.appendChild(o);
    });
    sel.addEventListener('change', function () { onPick(sites[sel.value]); });

    var host = $('[data-state="ready"]');
    if (host) host.insertBefore(sel, host.firstChild);
    return sites[preferred];
  }

  /* ---- Render --------------------------------------------------------- */

  function paint(site, since) {
    if (!site) return;
    lastSite = site; lastSince = since;
    var set = function (key, value) {
      var n = document.querySelector('[data-stat="' + key + '"]');
      if (n) n.textContent = value;
    };
    set('visits', compact(site.visits));
    set('views', compact(site.views));
    set('todayVisits', compact(site.todayVisits));
    set('todayViews', compact(site.todayViews));
    set('lastSeen', relative(site.lastSeen));
    set('since', onDate(since));
    renderPages(site.pages);
  }

  /* ---- Language ------------------------------------------------------- */

  /* Held so a language change can re-render the numbers: compact() and the
     date formatters are locale-aware, so the figures themselves change. */
  var lastSite = null, lastSince = null;

  function apply() {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.title = t('title');

    document.querySelectorAll('[data-i18n]').forEach(function (n) {
      var v = t(n.getAttribute('data-i18n'));
      if (v) n.textContent = v;
    });

    var langBtn = $('[data-lang-toggle]');
    if (langBtn) langBtn.textContent = lang === 'ar' ? 'English' : 'العربية';

    /* The table button's label is state-dependent, so [data-i18n] above
       has just overwritten it with the "show" string. Put the right one
       back if the table is open. */
    var tbl = $('[data-table]'), tblBtn = $('[data-table-toggle]');
    if (tbl && tblBtn) tblBtn.textContent = tbl.hidden ? t('tableShow') : t('tableHide');

    if (lastSite) paint(lastSite, lastSince);
  }

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
    var langBtn = $('[data-lang-toggle]');
    if (langBtn) {
      langBtn.addEventListener('click', function () {
        window.I18N.set(lang === 'ar' ? 'en' : 'ar');
      });
    }

    var toggle = $('[data-table-toggle]');
    var table = $('[data-table]');
    if (toggle && table) {
      toggle.addEventListener('click', function () {
        table.hidden = !table.hidden;
        toggle.textContent = table.hidden ? t('tableShow') : t('tableHide');
      });
    }

    apply();

    fetch('_stats', { headers: { Accept: 'application/json' } })
      .then(function (res) {
        if (!res.ok) throw new Error('HTTP ' + res.status);
        return res.json();
      })
      .then(function (data) {
        if (!data || !data.sites) throw new Error('unexpected shape');
        show('ready');
        var site = chooseSite(data.sites, function (next) { paint(next, data.since); });
        if (!site) throw new Error('no sites recorded');
        paint(site, data.since);
      })
      .catch(function () {
        /* 404 on a static host, a network error, or a shape we do not
           recognise — all the same to the reader: there is nothing to show. */
        show('unavailable');
      });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
