/* ============================================================
   I18N — language state, direction, and text hydration.

   Arabic ships as the static default inside the HTML, so the site is
   readable and crawlable with JavaScript off. This module only has to
   swap text when the visitor asks for English (and re-assert Arabic on
   the way back).

   FOUR BINDING ATTRIBUTES, understood anywhere in the markup:

     data-i18n="nav.home"                → textContent from SITE.t.nav.home
     data-i18n-attr="alt:alt.hero"       → attribute  from SITE.t.alt.hero
     data-site="brand.primary"           → textContent from SITE.brand.primary
     data-site-attr="href:contact.maps"  → attribute  from SITE.contact.maps

   The data-site pair reads the top level of SITE and auto-unwraps an
   { ar, en } pair if it finds one, so brand names, phone numbers and
   links all resolve from content.js too. Comma-separate to set more
   than one attribute: data-site-attr="href:contact.maps,title:brand.primary"
   ============================================================ */

(function () {
  'use strict';

  var STORAGE_KEY = 'site.lang';
  var DEFAULT_LANG = 'ar';           // Arabic-first
  var RTL = { ar: true };
  var listeners = [];

  /* Walk a dotted path: resolve(SITE, 'contact.maps'). */
  function resolve(root, path) {
    return String(path).split('.').reduce(function (node, key) {
      return (node && typeof node === 'object') ? node[key] : undefined;
    }, root);
  }

  /* Unwrap an { ar, en } pair for the active language; pass through
     anything else untouched (plain strings, numbers, arrays). */
  function pick(value, lang) {
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      if ('ar' in value || 'en' in value) {
        return value[lang] !== undefined ? value[lang] : value[DEFAULT_LANG];
      }
    }
    return value;
  }

  function readStored() {
    try {
      var stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored === 'ar' || stored === 'en') return stored;
    } catch (err) { /* private mode, blocked storage — fall through */ }
    return DEFAULT_LANG;
  }

  function writeStored(lang) {
    try { window.localStorage.setItem(STORAGE_KEY, lang); }
    catch (err) { /* not fatal — the choice just won't survive a reload */ }
  }

  var I18N = {
    lang: readStored(),

    /* A translated string, by dotted path under SITE.t */
    t: function (path) {
      var value = pick(resolve(window.SITE.t, path), this.lang);
      return value === undefined ? '' : value;
    },

    /* Any value from SITE, auto-unwrapped for the active language */
    v: function (path) {
      return pick(resolve(window.SITE, path), this.lang);
    },

    /* Unwrap an { ar, en } object the caller already holds */
    pick: function (value) { return pick(value, this.lang); },

    isRTL: function () { return !!RTL[this.lang]; },

    /* Hydrate a subtree. render.js calls this after injecting markup so
       generated content picks up the same bindings as static markup. */
    apply: function (root) {
      var scope = root || document;
      var self = this;

      scope.querySelectorAll('[data-i18n]').forEach(function (el) {
        var value = self.t(el.getAttribute('data-i18n'));
        if (value) el.textContent = value;
      });

      scope.querySelectorAll('[data-site]').forEach(function (el) {
        var value = self.v(el.getAttribute('data-site'));
        if (value !== undefined && value !== null) el.textContent = value;
      });

      applyAttrs(scope, '[data-i18n-attr]', 'data-i18n-attr', function (p) { return self.t(p); });
      applyAttrs(scope, '[data-site-attr]', 'data-site-attr', function (p) { return self.v(p); });
    },

    set: function (lang) {
      if (lang !== 'ar' && lang !== 'en') return;
      this.lang = lang;
      writeStored(lang);
      paint(this);
      listeners.forEach(function (fn) { fn(lang); });
    },

    toggle: function () { this.set(this.lang === 'ar' ? 'en' : 'ar'); },

    /* render.js subscribes so its grids redraw in the new language. */
    onChange: function (fn) { listeners.push(fn); }
  };

  function applyAttrs(scope, selector, attrName, lookup) {
    scope.querySelectorAll(selector).forEach(function (el) {
      el.getAttribute(attrName).split(',').forEach(function (pair) {
        var half = pair.split(':');
        if (half.length !== 2) return;
        var value = lookup(half[1].trim());
        if (value) el.setAttribute(half[0].trim(), value);
      });
    });
  }

  /* Push language + direction onto the document, then re-hydrate. */
  function paint(inst) {
    var html = document.documentElement;
    html.setAttribute('lang', inst.lang);
    html.setAttribute('dir', inst.isRTL() ? 'rtl' : 'ltr');
    inst.apply(document);

    /* The toggle shows the language you'd switch TO, not the current one. */
    document.querySelectorAll('[data-lang-toggle]').forEach(function (btn) {
      btn.setAttribute('aria-label', inst.t('common.langLabel'));
      btn.setAttribute('lang', inst.lang === 'ar' ? 'en' : 'ar');
    });
  }

  function init() {
    paint(I18N);
    document.querySelectorAll('[data-lang-toggle]').forEach(function (btn) {
      btn.addEventListener('click', function () { I18N.toggle(); });
    });
  }

  window.I18N = I18N;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
