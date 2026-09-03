/* ============================================================
   APP — navigation, sticky header, scroll reveal, small chores.
   No brand decisions live here; this file is identical across skins.
   ============================================================ */

(function () {
  'use strict';

  /* ---- Sticky header shadow ------------------------------------------ */

  function initHeader() {
    var header = document.querySelector('[data-header]');
    if (!header) return;

    var ticking = false;
    function update() {
      header.classList.toggle('is-stuck', window.scrollY > 8);
      ticking = false;
    }
    window.addEventListener('scroll', function () {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(update);
    }, { passive: true });
    update();
  }

  /* ---- Mobile drawer --------------------------------------------------- */

  function initNav() {
    var toggle = document.querySelector('[data-nav-toggle]');
    var nav    = document.querySelector('[data-nav]');
    var scrim  = document.querySelector('[data-nav-scrim]');
    if (!toggle || !nav) return;

    function setOpen(open) {
      toggle.setAttribute('aria-expanded', String(open));
      nav.classList.toggle('is-open', open);
      if (scrim) scrim.classList.toggle('is-open', open);
      /* Stop the page behind the drawer from scrolling. */
      document.body.style.overflow = open ? 'hidden' : '';
    }

    toggle.addEventListener('click', function () {
      setOpen(toggle.getAttribute('aria-expanded') !== 'true');
    });

    if (scrim) scrim.addEventListener('click', function () { setOpen(false); });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
        setOpen(false);
        toggle.focus();
      }
    });

    /* Tapping a link should close the drawer, not leave it hanging open
       behind the next page paint. */
    nav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () { setOpen(false); });
    });

    /* Coming back above the breakpoint must not leave the page locked. */
    window.matchMedia('(min-width: 881px)').addEventListener('change', function (event) {
      if (event.matches) setOpen(false);
    });
  }

  /* ---- Mark the current page in the nav -------------------------------- */

  function initCurrentPage() {
    var here = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('[data-nav] a[href]').forEach(function (link) {
      var target = link.getAttribute('href').split('/').pop();
      if (target === here) link.setAttribute('aria-current', 'page');
    });
  }

  /* ---- Scroll reveal ---------------------------------------------------- */

  function initReveal() {
    /* No IntersectionObserver? Show everything rather than hide it. */
    if (!('IntersectionObserver' in window)) {
      document.querySelectorAll('[data-reveal]').forEach(function (node) {
        node.classList.add('is-visible');
      });
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.06 });

    function observe(root) {
      (root || document).querySelectorAll('[data-reveal]:not(.is-visible)')
        .forEach(function (node) { observer.observe(node); });
    }

    observe(document);
    /* render.js fires this after it injects cards, so generated content
       animates in on the same terms as static content. */
    document.addEventListener('site:rendered', function (event) {
      observe(event.detail && event.detail.mount);
    });
  }

  /* ---- Footer year ------------------------------------------------------- */

  function initYear() {
    var year = String(new Date().getFullYear());
    document.querySelectorAll('[data-year]').forEach(function (node) {
      node.textContent = year;
    });
  }

  function init() {
    document.documentElement.classList.remove('no-js');
    initHeader();
    initNav();
    initCurrentPage();
    initReveal();
    initYear();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
