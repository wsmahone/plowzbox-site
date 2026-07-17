/* ============================================================
   PlowzBox - vision.js (scroll-narrative interaction layer)
   Owner: creative front-end. Pairs with assets/vision.css.
   Contract:
     - progressive enhancement only: the page is complete no-JS
     - IntersectionObserver, not scroll handlers (the one
       pointer handler is rAF-throttled and transform-only)
     - textContent for every dynamic string; innerHTML never
       touches anything message-like (only the two hand-authored
       static burger icon constants below)
     - full prefers-reduced-motion path: counters land on their
       final printed value, reveals stay visible, tilt/magnetic
       never attach
     - zero external resources, zero analytics
   ============================================================ */
(function () {
  'use strict';

  var doc = document;
  var root = doc.documentElement;
  root.classList.add('v-js');

  var motionQuery = window.matchMedia
    ? window.matchMedia('(prefers-reduced-motion: reduce)')
    : { matches: false };
  var pointerQuery = window.matchMedia
    ? window.matchMedia('(pointer: fine)')
    : { matches: false };
  function rm() { return !!motionQuery.matches; }
  var hasIO = 'IntersectionObserver' in window;

  function el(tag, className, text) {
    var n = doc.createElement(tag);
    if (className) n.className = className;
    if (text != null) n.textContent = text;
    return n;
  }

  function onReady(fn) {
    if (doc.readyState === 'loading') {
      doc.addEventListener('DOMContentLoaded', fn);
    } else { fn(); }
  }

  /* ============================================================
     1. Scroll reveals: .reveal -> .v-in with a light stagger
     ============================================================ */
  function initReveal() {
    var targets = [].slice.call(doc.querySelectorAll('.reveal'));
    if (!targets.length) return;
    if (rm() || !hasIO) {
      targets.forEach(function (t) { t.classList.add('v-in'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      var batch = 0;
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var node = entry.target;
        node.style.transitionDelay = Math.min(batch * 70, 280) + 'ms';
        node.classList.add('v-in');
        batch += 1;
        io.unobserve(node);
      });
    }, { rootMargin: '0px 0px -8%', threshold: 0.1 });
    targets.forEach(function (t) { io.observe(t); });
  }

  /* ============================================================
     2. Honest count-ups: .v-num[data-to] animates 0 -> the
        exact value already printed in the markup. Reduced
        motion (or no IO): the printed value simply stays.
     ============================================================ */
  function initCounters() {
    var nums = [].slice.call(doc.querySelectorAll('.v-num[data-to]'));
    if (!nums.length || rm() || !hasIO) return;

    function fmt(value, grouped) {
      var v = Math.round(value);
      return grouped ? v.toLocaleString('en-US') : String(v);
    }
    function run(node) {
      var to = parseInt(node.getAttribute('data-to'), 10);
      if (!isFinite(to)) return;
      var grouped = (node.textContent || '').indexOf(',') !== -1;
      var t0 = null;
      var DUR = 900;
      function tick(ts) {
        if (t0 === null) t0 = ts;
        var p = Math.min((ts - t0) / DUR, 1);
        var eased = 1 - Math.pow(1 - p, 3);
        node.textContent = fmt(to * eased, grouped);
        if (p < 1) window.requestAnimationFrame(tick);
      }
      window.requestAnimationFrame(tick);
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        io.unobserve(entry.target);
        run(entry.target);
      });
    }, { threshold: 0.4 });
    nums.forEach(function (n) { io.observe(n); });
  }

  /* ============================================================
     3. The day-clock rail: every [data-clock] element is a
        waypoint; [data-act] waypoints get a clickable dot.
        Desktop: fixed right rail. All widths: 3px top progress.
        Mobile: floating mono chip. All injected here (no-JS
        leaves no trace).
     ============================================================ */
  function initClock() {
    var points = [].slice.call(doc.querySelectorAll('[data-clock]'));
    if (points.length < 2 || !hasIO) return;

    var N = points.length;

    /* top hairline */
    var topbar = el('div', 'v-topbar');
    topbar.setAttribute('aria-hidden', 'true');
    var topfill = el('i');
    topbar.appendChild(topfill);
    doc.body.appendChild(topbar);

    /* right rail */
    var rail = el('nav', 'v-rail');
    rail.setAttribute('aria-label', 'Story progress');
    var clock = el('span', 'v-rail-clock', points[0].getAttribute('data-clock') || '');
    clock.setAttribute('aria-hidden', 'true');
    rail.appendChild(clock);
    var track = el('div', 'v-rail-track');
    var fill = el('div', 'v-rail-fill');
    track.appendChild(fill);
    var dots = [];
    points.forEach(function (p, i) {
      if (!p.hasAttribute('data-act')) return;
      var d = el('button', 'v-dot');
      d.type = 'button';
      d.setAttribute('aria-label', p.getAttribute('data-act') || 'Chapter');
      d.style.top = (N > 1 ? (i / (N - 1)) * 100 : 0) + '%';
      d.addEventListener('click', function () {
        p.scrollIntoView({ behavior: rm() ? 'auto' : 'smooth', block: 'start' });
      });
      dots.push({ idx: i, node: d });
      track.appendChild(d);
    });
    rail.appendChild(track);
    doc.body.appendChild(rail);

    /* mobile chip */
    var chip = el('span', 'v-clockchip', '');
    chip.setAttribute('aria-hidden', 'true');
    doc.body.appendChild(chip);

    var live = el('p', 'sr-only');
    live.setAttribute('aria-live', 'polite');
    doc.body.appendChild(live);

    var activeIdx = -1;
    var shown = false;
    function setActive(i) {
      if (i === activeIdx) return;
      activeIdx = i;
      var p = points[i];
      var time = p.getAttribute('data-clock') || '';
      var label = p.getAttribute('data-clock-label') || '';
      var ratio = N > 1 ? i / (N - 1) : 0;
      clock.textContent = time;
      clock.title = label;
      chip.textContent = time;
      fill.style.transform = 'scaleY(' + ratio + ')';
      topfill.style.transform = 'scaleX(' + ratio + ')';
      dots.forEach(function (d) {
        d.node.classList.toggle('is-past', d.idx <= i);
      });
      live.textContent = label ? time + '. ' + label : time;
      if (!shown) {
        shown = true;
        rail.classList.add('is-on');
        chip.classList.add('is-on');
      }
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        setActive(points.indexOf(entry.target));
      });
    }, { rootMargin: '-38% 0px -52% 0px', threshold: 0 });
    points.forEach(function (p) { io.observe(p); });

    /* park the chip when the funnel or footer is in view so it
       never sits on top of form controls */
    var funnel = doc.getElementById('request-demo');
    var footer = doc.querySelector('.site-footer');
    var hideIO = new IntersectionObserver(function (entries) {
      var anyVisible = entries.some(function (e) { return e.isIntersecting; });
      if (!shown) return;
      chip.classList.toggle('is-on', !anyVisible);
    }, { threshold: 0.05 });
    if (funnel) hideIO.observe(funnel);
    if (footer) hideIO.observe(footer);
  }

  /* ============================================================
     4. Magnetic CTAs (fine pointer + motion allowed only)
     ============================================================ */
  function initMagnetic() {
    if (rm() || !pointerQuery.matches) return;
    var btns = [].slice.call(doc.querySelectorAll(
      '.hero-ctas .btn, .early-ctas .btn, .nav > .btn'));
    btns.forEach(function (btn) {
      btn.classList.add('v-mag');
      var rect = null;
      var raf = 0;
      var nx = 0, ny = 0;
      function apply() {
        raf = 0;
        btn.style.transform = 'translate3d(' + nx + 'px,' + ny + 'px,0)';
      }
      btn.addEventListener('pointerenter', function () {
        rect = btn.getBoundingClientRect();
        btn.classList.remove('v-mag-out');
      });
      btn.addEventListener('pointermove', function (e) {
        if (!rect) rect = btn.getBoundingClientRect();
        nx = ((e.clientX - rect.left) / rect.width - 0.5) * 10;
        ny = ((e.clientY - rect.top) / rect.height - 0.5) * 8;
        if (!raf) raf = window.requestAnimationFrame(apply);
      });
      btn.addEventListener('pointerleave', function () {
        rect = null; nx = 0; ny = 0;
        btn.classList.add('v-mag-out');
        btn.style.transform = '';
      });
    });
  }

  /* ============================================================
     5. Hero device tilt (fine pointer + motion allowed only)
     ============================================================ */
  function initTilt() {
    if (rm() || !pointerQuery.matches) return;
    var hero = doc.querySelector('.hero');
    var core = doc.querySelector('.v-tilt-core');
    if (!hero || !core) return;
    var raf = 0, rx = 0, ry = 0;
    function apply() {
      raf = 0;
      core.style.setProperty('--v-rx', rx.toFixed(2) + 'deg');
      core.style.setProperty('--v-ry', ry.toFixed(2) + 'deg');
    }
    hero.addEventListener('pointermove', function (e) {
      var r = hero.getBoundingClientRect();
      ry = ((e.clientX - r.left) / r.width - 0.5) * 6;
      rx = (0.5 - (e.clientY - r.top) / r.height) * 4;
      if (!raf) raf = window.requestAnimationFrame(apply);
    }, { passive: true });
    hero.addEventListener('pointerleave', function () {
      rx = 0; ry = 0;
      if (!raf) raf = window.requestAnimationFrame(apply);
    });
  }

  /* ============================================================
     6. Versus chips: tap flips claim -> source
     ============================================================ */
  function initChips() {
    var chips = [].slice.call(doc.querySelectorAll('.v-chip'));
    chips.forEach(function (chip) {
      var front = chip.querySelector('.v-chip-front');
      var back = chip.querySelector('.v-chip-back');
      chip.addEventListener('click', function () {
        var flipped = chip.getAttribute('aria-pressed') === 'true';
        chip.setAttribute('aria-pressed', flipped ? 'false' : 'true');
        if (front) front.setAttribute('aria-hidden', flipped ? 'false' : 'true');
        if (back) back.setAttribute('aria-hidden', flipped ? 'true' : 'false');
      });
    });
  }

  /* ============================================================
     7. Mobile navigation toggle (injected; no-JS keeps today's
        behavior: links hidden under 48rem, CTA still visible)
     ============================================================ */
  var BURGER_SVG =
    '<svg class="v-bars" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>' +
    '<svg class="v-x" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><line x1="5" y1="5" x2="19" y2="19"/><line x1="19" y1="5" x2="5" y2="19"/></svg>';

  function initNav() {
    var nav = doc.querySelector('.site-header .nav');
    var links = doc.getElementById('nav-links');
    if (!nav || !links) return;
    var btn = el('button', 'v-navtoggle');
    btn.type = 'button';
    btn.setAttribute('aria-expanded', 'false');
    btn.setAttribute('aria-controls', 'nav-links');
    btn.setAttribute('aria-label', 'Menu');
    btn.innerHTML = BURGER_SVG; /* static hand-authored constant */
    nav.appendChild(btn);

    function setOpen(open) {
      doc.body.classList.toggle('v-nav-open', open);
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    }
    btn.addEventListener('click', function () {
      setOpen(!doc.body.classList.contains('v-nav-open'));
    });
    links.addEventListener('click', function (e) {
      var t = e.target;
      if (t && t.tagName === 'A') setOpen(false);
    });
    doc.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && doc.body.classList.contains('v-nav-open')) {
        setOpen(false);
        btn.focus();
      }
    });
  }

  onReady(function () {
    initReveal();
    initCounters();
    initClock();
    initMagnetic();
    initTilt();
    initChips();
    initNav();
  });
})();
