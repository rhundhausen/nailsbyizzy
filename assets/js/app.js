/* Nails by Izzy - lightbox + hero sparkle */
(function () {
  'use strict';

  /* ---------- Hamburger nav (phones) ---------- */
  var nav = document.getElementById('nav');
  var burger = document.getElementById('navBurger');
  if (nav && burger) {
    function setOpen(open) {
      nav.classList.toggle('is-open', open);
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    }
    burger.addEventListener('click', function () {
      setOpen(burger.getAttribute('aria-expanded') !== 'true');
    });
    /* Tapping a link (including an on-page anchor) closes the menu */
    nav.querySelectorAll('.nav__link').forEach(function (link) {
      link.addEventListener('click', function () { setOpen(false); });
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('is-open')) {
        setOpen(false);
        burger.focus();
      }
    });
    /* Leaving phone width: drop the open state so desktop nav is clean */
    window.matchMedia('(min-width:701px)').addEventListener('change', function (e) {
      if (e.matches) { setOpen(false); }
    });
  }

  /* ---------- Gallery lightbox ---------- */
  var lb = document.getElementById('lightbox');
  if (lb) {
    var img = document.getElementById('lbImg');
    var cap = document.getElementById('lbCap');
    var closeBtn = document.getElementById('lbClose');
    var lastFocus = null;

    function open(full, name) {
      lastFocus = document.activeElement;
      img.src = full;
      img.alt = name + ' nail set';
      cap.textContent = name;
      lb.hidden = false;
      lb.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      closeBtn.focus();
    }
    function close() {
      lb.hidden = true;
      lb.setAttribute('aria-hidden', 'true');
      img.src = '';
      document.body.style.overflow = '';
      if (lastFocus) { lastFocus.focus(); }
    }

    document.querySelectorAll('.card__btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        open(btn.getAttribute('data-full'), btn.getAttribute('data-name'));
      });
    });
    closeBtn.addEventListener('click', close);
    lb.addEventListener('click', function (e) {
      if (e.target === lb) { close(); }
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !lb.hidden) { close(); }
    });
  }

  /* ---------- Extra floating sparkles in the hero ---------- */
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var deco = document.querySelector('.hero__deco');
  if (deco && !reduce) {
    var extras = ['✨', '⭐', '🩷', '💫'];
    for (var i = 0; i < 5; i++) {
      var s = document.createElement('span');
      s.textContent = extras[i % extras.length];
      s.style.left = (8 + Math.random() * 84) + '%';
      s.style.top = (8 + Math.random() * 80) + '%';
      s.style.animationDelay = (Math.random() * 3).toFixed(2) + 's';
      s.style.fontSize = (0.8 + Math.random() * 0.9).toFixed(2) + 'rem';
      deco.appendChild(s);
    }
  }

  /* ---------- About Me carousel ---------- */
  var carousel = document.getElementById('carousel');
  if (carousel) {
    var slides = carousel.querySelectorAll('.carousel__slide');
    var dots = carousel.querySelectorAll('.carousel__dot');
    var idx = 0;
    function showSlide(n) {
      idx = (n + slides.length) % slides.length;
      slides.forEach(function (s, i) {
        var active = i === idx;
        s.classList.toggle('is-active', active);
        if (active) { s.removeAttribute('aria-hidden'); }
        else { s.setAttribute('aria-hidden', 'true'); }
      });
      dots.forEach(function (d, i) {
        var active = i === idx;
        d.classList.toggle('is-active', active);
        if (active) { d.setAttribute('aria-selected', 'true'); }
        else { d.removeAttribute('aria-selected'); }
      });
    }
    var prevBtn = document.getElementById('carouselPrev');
    var nextBtn = document.getElementById('carouselNext');
    if (prevBtn) { prevBtn.addEventListener('click', function () { showSlide(idx - 1); }); }
    if (nextBtn) { nextBtn.addEventListener('click', function () { showSlide(idx + 1); }); }
    dots.forEach(function (d) {
      d.addEventListener('click', function () {
        showSlide(parseInt(d.getAttribute('data-index'), 10));
      });
    });
    carousel.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') { showSlide(idx - 1); }
      else if (e.key === 'ArrowRight') { showSlide(idx + 1); }
    });
  }

  /* ---------- "How to order" floating popup (my-nails page) ---------- */
  var pop = document.getElementById('orderPop');
  if (pop) {
    var POP_KEY = 'orderPopDismissed';
    var popDismissed = false;
    try { popDismissed = sessionStorage.getItem(POP_KEY) === '1'; } catch (e) {}
    var popX = document.getElementById('orderPopX');
    function showPop() {
      if (popDismissed || !pop.hidden) { return; }
      pop.hidden = false;
      requestAnimationFrame(function () { pop.classList.add('is-visible'); });
    }
    function hidePop() {
      popDismissed = true;
      pop.classList.remove('is-visible');
      try { sessionStorage.setItem(POP_KEY, '1'); } catch (e) {}
      setTimeout(function () { pop.hidden = true; }, 400);
    }
    if (popX) { popX.addEventListener('click', hidePop); }
    window.addEventListener('scroll', function () {
      if (window.scrollY > 400) { showPop(); }
    }, { passive: true });
  }
})();
