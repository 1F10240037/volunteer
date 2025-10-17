'use strict';

// 多重読込でも一回だけ初期化
if (!window.__MEGURI_INIT__) {
  window.__MEGURI_INIT__ = true;

  document.addEventListener('DOMContentLoaded', function () {
    // JSが生きている時だけアニメ適用（壊れても内容は見える）
    document.documentElement.classList.add('js-enabled');

    /* util */
    var $  = function (s, c) { return (c || document).querySelector(s); };
    var $$ = function (s, c) { return Array.from((c || document).querySelectorAll(s)); };
    var hasMM = (typeof matchMedia === 'function');
    var prefersReduced = hasMM && matchMedia('(prefers-reduced-motion: reduce)').matches === true;

    /* 年号 */
    var y = $('#y');
    if (y) y.textContent = String(new Date().getFullYear());

    /* ===（回転語はHTMLから削除したので特に処理不要）=== */

    /* ナビ */
    (function () {
      var hamburger = $('#hamburger');
      var menu = $('#menu');
      var aboutBtn = $('#aboutBtn');
      var aboutSub = $('#aboutSub');
      var body = document.body;

      var openMenu = function () {
        if (menu) menu.classList.add('open');
        if (hamburger) hamburger.setAttribute('aria-expanded', 'true');
        body.classList.add('no-scroll');
      };
      var closeMenu = function () {
        if (menu) menu.classList.remove('open');
        if (hamburger) hamburger.setAttribute('aria-expanded', 'false');
        body.classList.remove('no-scroll');
        closeSub();
      };
      var toggleMenu = function () {
        if (!menu) return;
        if (menu.classList.contains('open')) closeMenu(); else openMenu();
      };
      if (hamburger) hamburger.addEventListener('click', toggleMenu);

      var openSub = function () {
        if (aboutSub) aboutSub.classList.add('open');
        if (aboutBtn) aboutBtn.setAttribute('aria-expanded', 'true');
        if (aboutSub) aboutSub.setAttribute('aria-hidden', 'false');
      };
      var closeSub = function () {
        if (aboutSub) aboutSub.classList.remove('open');
        if (aboutBtn) aboutBtn.setAttribute('aria-expanded', 'false');
        if (aboutSub) aboutSub.setAttribute('aria-hidden', 'true');
      };
      var toggleSub = function () {
        if (!aboutSub) return;
        if (aboutSub.classList.contains('open')) closeSub(); else openSub();
      };
      if (aboutBtn) {
        aboutBtn.addEventListener('click', function (e) { e.stopPropagation(); toggleSub(); });
      }
      document.addEventListener('click', function (e) {
        if (!aboutSub || !aboutSub.classList.contains('open')) return;
        var inside = aboutSub.contains(e.target) || (aboutBtn && aboutBtn.contains(e.target));
        if (!inside) closeSub();
      });
      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') { closeSub(); closeMenu(); }
      });
    })();

    /* スクロール：ナビ影 & パララックス */
    (function () {
      var nav = $('#nav');
      var photo = $('.photo-ph');
      var ticking = false;
      var onScroll = function () {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(function () {
          var y = window.scrollY || 0;
          if (nav) nav.classList.toggle('is-scrolled', y > 6);
          if (photo && !prefersReduced) {
            photo.style.transform = 'translateY(' + (y * 0.15) + 'px)';
            if (!photo.dataset.wc) { photo.style.willChange = 'transform'; photo.dataset.wc = '1'; }
          }
          ticking = false;
        });
      };
      window.addEventListener('scroll', onScroll, { passive: true });
      onScroll();
    })();

    /* フェードイン（IntersectionObserver） */
    (function () {
      // ヒーロー内は初期表示で appear（真っ白回避）
      $$('.hero .fade-in').forEach(function (el) { el.classList.add('appear'); });

      // セクション内の要素すべて
      var items = $$('.section.fade-in, .section .fade-in, .section .sec-title');
      if (!items.length) return;

      if (prefersReduced) { items.forEach(function (el) { el.classList.add('appear'); }); return; }

      if ('IntersectionObserver' in window) {
        var io = new IntersectionObserver(function (entries, obs) {
          entries.forEach(function (e) {
            if (e.isIntersecting) { e.target.classList.add('appear'); obs.unobserve(e.target); }
          });
        }, { threshold: 0.01, rootMargin: '0px 0px -20%' });
        items.forEach(function (el) { io.observe(el); });
      } else {
        var onScroll = function () {
          var vh = window.innerHeight || document.documentElement.clientHeight;
          items.forEach(function (el) {
            var r = el.getBoundingClientRect();
            if (r.top < vh * 0.86) el.classList.add('appear');
          });
        };
        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();
      }
    })();
  });
}
