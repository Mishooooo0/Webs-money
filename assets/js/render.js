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

  /* A branded image slot: house pattern + logo, never an empty box. */
  function placeholder(modifier, altKey, useIcon, item) {
    var slot = el('div', 'ph' + (modifier ? ' ' + modifier : ''));
    slot.setAttribute('role', 'img');
    slot.setAttribute('aria-label', altFor(item, altKey));
    slot.appendChild(el('span', 'ph__mark' + (useIcon ? ' ph__mark--icon' : '')));
    return slot;
  }

  /* Intrinsic size per slot ratio. A real photo and its placeholder reserve
     exactly the same box, so nothing shifts as the image loads. */
  var SLOT_SIZE = {
    'ph--hero':     [1600, 1000],
    'ph--square':   [800, 800],
    'ph--portrait': [1000, 1250],
    'ph--wide':     [1680, 720],
    'ph--tall':     [900, 1200]
  };

  /* The image for a data item: a real photograph when the item carries an
     `image` path, the branded placeholder when it does not. That is the whole
     of the photo workflow — adding photography is a content edit in
     content.js, never a code change here. See BRAND.md section 6. */
  /* Alt text, most specific first. Slot keys differ between templates, so a
     key that does not exist on this branch must fall back rather than leave
     an image with an empty alt. */
  function altFor(item, altKey) {
    return window.I18N.pick(item && item.alt)
        || window.I18N.t('alt.' + (altKey || 'room'))
        || window.I18N.t('alt.product')
        || window.I18N.t('alt.hero')
        || window.I18N.v('brand.primary');
  }

  function media(item, modifier, altKey, useIcon) {
    var src = item && item.image;
    if (!src) return placeholder(modifier, altKey, useIcon, item);

    var size = SLOT_SIZE[modifier] || SLOT_SIZE['ph--square'];
    var img = el('img', 'ph-img' + (modifier ? ' ' + modifier : ''));
    img.src = src;
    img.loading = 'lazy';
    img.decoding = 'async';
    img.width = size[0];
    img.height = size[1];
    /* Per-item alt beats the generic slot alt, which beats nothing at all. */
    img.alt = altFor(item, altKey);
    return img;
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

  /* A café menu and a salon service list are the same structure with a
     different row, so the category loop is shared and only the row differs. */
  function renderCategoryList(mount, categories, rowFn) {
    var frag = document.createDocumentFragment();

    (categories || []).forEach(function (category) {
      var section = el('section', 'menu-category');
      if (category.id) section.id = category.id;

      var head = el('div', 'menu-category__head');
      head.appendChild(el('h2', 'menu-category__title', window.I18N.pick(category.name)));

      var note = window.I18N.pick(category.note);
      if (note) head.appendChild(el('p', 'menu-category__note', note));
      section.appendChild(head);

      var list = el('ul', 'menu-list');
      list.setAttribute('role', 'list');
      category.items.forEach(function (item) { list.appendChild(rowFn(item)); });
      section.appendChild(list);

      frag.appendChild(section);
    });

    mount.replaceChildren(frag);
  }

  function renderMenu(mount) {
    renderCategoryList(mount, window.SITE.menu, menuItem);
  }

  /* ---- Services (template 2) ------------------------------------------
     Same row as a menu item, with a duration column between name and price. */

  function serviceRow(item) {
    var row = el('li', 'menu-item service-item');
    row.appendChild(el('span', 'menu-item__name', window.I18N.pick(item.name)));
    row.appendChild(el('span', 'menu-item__dots'));

    var duration = window.I18N.pick(item.duration);
    row.appendChild(el('span', 'service-item__duration', duration || ''));
    row.appendChild(el('span', 'menu-item__price', price(item.price)));

    var desc = window.I18N.pick(item.desc);
    if (desc) row.appendChild(el('p', 'menu-item__desc', desc));
    return row;
  }

  function renderServices(mount) {
    renderCategoryList(mount, window.SITE.services, serviceRow);
  }

  /* ---- Featured drinks (home) ---------------------------------------- */

  function renderFeatured(mount) {
    /* Whichever schema this branch carries — a café menu or a service list. */
    var categories = window.SITE.menu || window.SITE.services || window.SITE.catalog || [];
    var picks = [];
    categories.forEach(function (category) {
      category.items.forEach(function (item) {
        if (item.featured && picks.length < 3) picks.push(item);
      });
    });
    /* Nothing flagged? Fall back to the first three on the list rather
       than rendering an empty strip. */
    if (!picks.length && categories.length) picks = categories[0].items.slice(0, 3);

    var frag = document.createDocumentFragment();
    picks.forEach(function (item, index) {
      var card = el('article', 'card card--flush');
      card.setAttribute('data-reveal', '');
      card.style.transitionDelay = (index * 90) + 'ms';
      card.appendChild(media(item, 'ph--square', 'cup'));

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
      card.appendChild(media(bean, 'ph--portrait', 'beans'));

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
      card.appendChild(media(product, 'ph--square', 'merch', true));

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

  /* ---- Generic card grids (template 3 onward) --------------------------
     Every template so far wants the same thing at some point: a grid of
     items with a picture, a name, a line of text, optional tags and a
     price. Rather than a fourth near-identical renderer, these two read
     their data source from the mount:

         <div class="product-grid" data-render="cards"   data-source="products">
         <div                      data-render="catalog" data-source="catalog">

     `cards` renders one flat array; `catalog` renders categories, each
     with its own heading and grid. Both accept any array in SITE, so a new
     template usually needs no new renderer at all. */

  function productCard(item) {
    var card = el('article', 'card card--flush');
    card.setAttribute('data-reveal', '');
    card.appendChild(media(item, item.ratio || 'ph--portrait', 'product'));

    var body = el('div', 'card__body');
    body.appendChild(el('h3', 'card__title', window.I18N.pick(item.name)));

    var desc = window.I18N.pick(item.desc);
    if (desc) body.appendChild(el('p', 'card__text', desc));

    var tags = window.I18N.pick(item.tags) || [];
    if (tags.length) {
      var row = el('div', 'tag-row');
      tags.forEach(function (t) { row.appendChild(el('span', 'tag', t)); });
      body.appendChild(row);
    }

    if (item.price) body.appendChild(el('p', 'card__price', price(item.price)));

    card.appendChild(body);
    return card;
  }

  function renderCards(mount) {
    var items = window.I18N.v(mount.getAttribute('data-source') || 'products') || [];
    var frag = document.createDocumentFragment();
    items.forEach(function (item) { frag.appendChild(productCard(item)); });
    mount.replaceChildren(frag);
  }

  function renderCatalog(mount) {
    var groups = window.I18N.v(mount.getAttribute('data-source') || 'catalog') || [];
    var frag = document.createDocumentFragment();

    groups.forEach(function (group) {
      var section = el('section', 'catalog-group');
      if (group.id) section.id = group.id;

      var head = el('div', 'menu-category__head');
      head.appendChild(el('h2', 'menu-category__title', window.I18N.pick(group.name)));
      var note = window.I18N.pick(group.note);
      if (note) head.appendChild(el('p', 'menu-category__note', note));
      section.appendChild(head);

      var grid = el('div', 'product-grid');
      group.items.forEach(function (item) { grid.appendChild(productCard(item)); });
      section.appendChild(grid);

      frag.appendChild(section);
    });

    mount.replaceChildren(frag);
  }

  /* ---- Team, packages, testimonials, FAQ (template 2) ------------------ */

  function renderTeam(mount) {
    var frag = document.createDocumentFragment();

    (window.SITE.team || []).forEach(function (person) {
      var card = el('article', 'card card--flush');
      card.setAttribute('data-reveal', '');
      card.appendChild(media(person, 'ph--portrait', 'team'));

      var body = el('div', 'card__body');
      body.appendChild(el('h3', 'card__title', window.I18N.pick(person.name)));

      var role = window.I18N.pick(person.role);
      if (role) body.appendChild(el('p', 'card__role', role));

      var bio = window.I18N.pick(person.bio);
      if (bio) body.appendChild(el('p', 'card__text', bio));

      card.appendChild(body);
      frag.appendChild(card);
    });

    mount.replaceChildren(frag);
  }

  function renderPackages(mount) {
    var frag = document.createDocumentFragment();

    (window.SITE.packages || []).forEach(function (pack) {
      var card = el('article', 'card package' + (pack.featured ? ' package--featured' : ''));
      card.setAttribute('data-reveal', '');
      card.appendChild(el('h3', 'card__title', window.I18N.pick(pack.name)));

      var desc = window.I18N.pick(pack.desc);
      if (desc) card.appendChild(el('p', 'card__text', desc));

      /* `includes` is an { ar: [...], en: [...] } pair, so pick() hands back
         the array for the active language. */
      var includes = window.I18N.pick(pack.includes) || [];
      if (includes.length) {
        var list = el('ul', 'package__list');
        list.setAttribute('role', 'list');
        includes.forEach(function (line) { list.appendChild(el('li', null, line)); });
        card.appendChild(list);
      }

      card.appendChild(el('p', 'card__price', price(pack.price)));
      frag.appendChild(card);
    });

    mount.replaceChildren(frag);
  }

  function renderTestimonials(mount) {
    var frag = document.createDocumentFragment();

    (window.SITE.testimonials || []).forEach(function (item) {
      var card = el('figure', 'card quote-card');
      card.setAttribute('data-reveal', '');
      card.appendChild(el('blockquote', 'quote-card__text', window.I18N.pick(item.text)));
      card.appendChild(el('figcaption', 'quote-card__cite', window.I18N.pick(item.name)));
      frag.appendChild(card);
    });

    mount.replaceChildren(frag);
  }

  /* <details>/<summary> rather than a scripted accordion: it is keyboard
     accessible for free, and it still opens with JavaScript disabled. */
  function renderFaq(mount) {
    var frag = document.createDocumentFragment();

    (window.SITE.faq || []).forEach(function (item) {
      var row = el('details', 'faq__item');
      row.appendChild(el('summary', 'faq__q', window.I18N.pick(item.q)));
      row.appendChild(el('p', 'faq__a', window.I18N.pick(item.a)));
      frag.appendChild(row);
    });

    mount.replaceChildren(frag);
  }

  /* ---- Wiring ------------------------------------------------------------ */

  /* Keyed by data-render. A renderer with no mount point on the page simply
     never fires, so this one engine serves both templates and stays
     byte-identical on every branch — which is what keeps merges clean. */
  var RENDERERS = {
    /* shared */
    featured:     renderFeatured,
    hours:        renderHours,
    address:      renderAddress,
    /* template 1 — cafés and restaurants */
    menu:         renderMenu,
    beans:        renderBeans,
    merch:        renderMerch,
    /* generic — any array in SITE, chosen with data-source */
    cards:        renderCards,
    catalog:      renderCatalog,
    /* template 2 — services and booking */
    services:     renderServices,
    team:         renderTeam,
    packages:     renderPackages,
    testimonials: renderTestimonials,
    faq:          renderFaq
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
