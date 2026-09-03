/* ============================================================
   RENDER — builds the data-driven sections from content.js.

   Mount points are empty elements carrying a data-render attribute:

     <div data-render="menu">      full menu, category by category
     <div data-render="featured">  the three featured drinks (home)
     <div data-render="beans">     retail coffee grid
     <div data-render="merch">     merchandise grid
     <ul  data-render="hours">     opening hours, today highlighted
     <div data-render="address">   address lines

   Everything redraws on a language change, so adding a drink is one
   entry in SITE.menu — never a hand-edited <li>.
   ============================================================ */

(function () {
  'use strict';

  var DAY_KEYS = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];

  /* ---- Tiny DOM helpers. textContent throughout: content is authored,
     but never interpolate strings into innerHTML on a site a client
     will go on editing. ------------------------------------------------ */

  function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined && text !== null && text !== '') node.textContent = text;
    return node;
  }

  function price(value) {
    return value + ' ' + window.I18N.v('brand.currency');
  }

  /* A branded image slot: house pattern + logo, never an empty box.
     Swap for <img class="ph-img"> once real photography exists. */
  function placeholder(modifier, altKey, useIcon) {
    var slot = el('div', 'ph' + (modifier ? ' ' + modifier : ''));
    slot.setAttribute('role', 'img');
    slot.setAttribute('aria-label', window.I18N.t('alt.' + (altKey || 'room')));
    slot.appendChild(el('span', 'ph__mark' + (useIcon ? ' ph__mark--icon' : '')));
    return slot;
  }

  /* ---- Menu ---------------------------------------------------------- */

  function menuItem(item) {
    var row = el('li', 'menu-item');
    row.appendChild(el('span', 'menu-item__name', window.I18N.pick(item.name)));
    row.appendChild(el('span', 'menu-item__dots'));
    row.appendChild(el('span', 'menu-item__price', price(item.price)));

    var desc = window.I18N.pick(item.desc);
    if (desc) row.appendChild(el('p', 'menu-item__desc', desc));
    return row;
  }

  function renderMenu(mount) {
    var frag = document.createDocumentFragment();

    window.SITE.menu.forEach(function (category) {
      var section = el('section', 'menu-category');
      section.id = category.id;

      var head = el('div', 'menu-category__head');
      head.appendChild(el('h2', 'menu-category__title', window.I18N.pick(category.name)));

      var note = window.I18N.pick(category.note);
      if (note) head.appendChild(el('p', 'menu-category__note', note));
      section.appendChild(head);

      var list = el('ul', 'menu-list');
      list.setAttribute('role', 'list');
      category.items.forEach(function (item) { list.appendChild(menuItem(item)); });
      section.appendChild(list);

      frag.appendChild(section);
    });

    mount.replaceChildren(frag);
  }

  /* ---- Featured drinks (home) ---------------------------------------- */

  function renderFeatured(mount) {
    var picks = [];
    window.SITE.menu.forEach(function (category) {
      category.items.forEach(function (item) {
        if (item.featured && picks.length < 3) picks.push(item);
      });
    });
    /* Nothing flagged? Fall back to the first three on the list rather
       than rendering an empty strip. */
    if (!picks.length) picks = window.SITE.menu[0].items.slice(0, 3);

    var frag = document.createDocumentFragment();
    picks.forEach(function (item, index) {
      var card = el('article', 'card card--flush');
      card.setAttribute('data-reveal', '');
      card.style.transitionDelay = (index * 90) + 'ms';
      card.appendChild(placeholder('ph--square', 'cup'));

      var body = el('div', 'card__body');
      body.appendChild(el('h3', 'card__title', window.I18N.pick(item.name)));
      body.appendChild(el('p', 'card__text', window.I18N.pick(item.desc)));
      body.appendChild(el('p', 'card__price', price(item.price)));
      card.appendChild(body);

      frag.appendChild(card);
    });

    mount.replaceChildren(frag);
  }

  /* ---- Shop ----------------------------------------------------------- */

  function metaRow(labelKey, value) {
    var wrap = el('span');
    wrap.appendChild(el('strong', null, window.I18N.t('shop.' + labelKey) + ': '));
    wrap.appendChild(document.createTextNode(value));
    return wrap;
  }

  function renderBeans(mount) {
    var frag = document.createDocumentFragment();

    window.SITE.beans.forEach(function (bean) {
      var card = el('article', 'card card--flush');
      card.setAttribute('data-reveal', '');
      card.appendChild(placeholder('ph--portrait', 'beans'));

      var body = el('div', 'card__body');
      body.appendChild(el('h3', 'card__title', window.I18N.pick(bean.name)));

      var meta = el('div', 'card__meta');
      meta.appendChild(metaRow('origin',  window.I18N.pick(bean.origin)));
      meta.appendChild(metaRow('process', window.I18N.pick(bean.process)));
      body.appendChild(meta);

      body.appendChild(el('p', 'card__text', window.I18N.pick(bean.notes)));

      var tags = el('div', 'tag-row');
      tags.appendChild(el('span', 'tag', bean.weight));
      body.appendChild(tags);

      body.appendChild(el('p', 'card__price', price(bean.price)));
      card.appendChild(body);

      frag.appendChild(card);
    });

    mount.replaceChildren(frag);
  }

  function renderMerch(mount) {
    var frag = document.createDocumentFragment();

    window.SITE.merch.forEach(function (product) {
      var card = el('article', 'card card--flush');
      card.setAttribute('data-reveal', '');
      card.appendChild(placeholder('ph--square', 'merch', true));

      var body = el('div', 'card__body');
      body.appendChild(el('h3', 'card__title', window.I18N.pick(product.name)));
      body.appendChild(el('p', 'card__text', window.I18N.pick(product.desc)));
      body.appendChild(el('p', 'card__price', price(product.price)));
      card.appendChild(body);

      frag.appendChild(card);
    });

    mount.replaceChildren(frag);
  }

  /* ---- Hours & address -------------------------------------------------- */

  function renderHours(mount) {
    var today = DAY_KEYS[new Date().getDay()];
    var frag = document.createDocumentFragment();

    window.SITE.hours.forEach(function (entry) {
      var row = el('li', 'info-row' + (entry.key === today ? ' is-today' : ''));
      row.appendChild(el('span', 'info-row__label', window.I18N.pick(entry.day)));
      row.appendChild(el('span', 'info-row__value', window.I18N.pick(entry.time)));
      frag.appendChild(row);
    });

    mount.replaceChildren(frag);
  }

  function renderAddress(mount) {
    var frag = document.createDocumentFragment();
    var lines = window.I18N.v('contact.addressLines') || [];
    lines.forEach(function (line) { frag.appendChild(el('p', null, line)); });
    mount.replaceChildren(frag);
  }

  /* ---- Wiring ------------------------------------------------------------ */

  var RENDERERS = {
    menu:     renderMenu,
    featured: renderFeatured,
    beans:    renderBeans,
    merch:    renderMerch,
    hours:    renderHours,
    address:  renderAddress
  };

  function renderAll() {
    document.querySelectorAll('[data-render]').forEach(function (mount) {
      var fn = RENDERERS[mount.getAttribute('data-render')];
      if (!fn) return;
      fn(mount);
      /* Generated markup gets the same bindings as static markup. */
      window.I18N.apply(mount);
      /* Let app.js observe any [data-reveal] we just created. */
      document.dispatchEvent(new CustomEvent('site:rendered', { detail: { mount: mount } }));
    });
  }

  function init() {
    if (!window.SITE || !window.I18N) return;
    renderAll();
    window.I18N.onChange(renderAll);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
