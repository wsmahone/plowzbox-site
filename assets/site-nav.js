/* ============================================================
   PlowzBox - site-nav.js (shared mobile navigation for the
   inner pages that do not load vision.js)
   ------------------------------------------------------------
   Brings the feature/story pages to parity with the homepage:
   a hamburger menu at <= 63.9rem instead of the nav links simply
   vanishing. Self-contained, no dependencies, no external calls.
   Progressive enhancement only: with no JS the page is unchanged
   (footer navigation still covers every page).
   Security discipline matches vision.js: createElement +
   textContent everywhere; innerHTML touches only the two
   hand-authored static icon constants below and the static
   stylesheet string.
   ============================================================ */
(function () {
  'use strict';

  var doc = document;
  doc.documentElement.classList.add('v-js');

  /* Injected styles mirror the homepage nav (assets/vision.css)
     so the menu looks and behaves identically. Static constant. */
  var CSS =
    '.v-navtoggle{display:none;align-items:center;justify-content:center;' +
    'width:2.75rem;height:2.75rem;border:1px solid var(--chq-border-strong);' +
    'border-radius:var(--chq-radius-md);background:var(--chq-surface);' +
    'cursor:pointer;padding:0;color:var(--chq-green-900);}' +
    '.v-navtoggle svg{display:block;}' +
    '.v-navtoggle .v-x{display:none;}' +
    '.v-nav-open .v-navtoggle .v-x{display:block;}' +
    '.v-nav-open .v-navtoggle .v-bars{display:none;}' +
    '@media (max-width:63.9rem){' +
    '.site-header .nav{gap:var(--chq-space-3);}' +
    '.site-header .nav>.btn-primary{flex:0 0 auto;white-space:nowrap;padding:0.6rem 0.95rem;}' +
    '.v-navtoggle{display:inline-flex;}' +
    '.site-header .nav-links{display:none;}' +
    '.v-nav-open .nav-links{display:flex;flex-direction:column;align-items:stretch;' +
    'gap:0;position:absolute;top:100%;left:0;right:0;background:var(--chq-surface);' +
    'border-bottom:1px solid var(--chq-border);box-shadow:var(--chq-shadow-lg);' +
    'padding:var(--chq-space-3) clamp(1.25rem,4vw,2.5rem) var(--chq-space-5);' +
    'max-height:calc(100dvh - 4.25rem);overflow:auto;}' +
    '.v-nav-open .nav-links>li{border-bottom:1px solid var(--chq-border);list-style:none;}' +
    '.v-nav-open .nav-links>li:last-child{border-bottom:0;}' +
    '.v-nav-open .nav-links>li>a{display:block;padding:0.7rem 0;font-size:var(--chq-text-base);}' +
    '}' +
    '@media (max-width:26rem){' +
    '.site-header .nav{gap:var(--chq-space-2);}' +
    '.site-header .nav>.btn-primary{padding:0.6rem 0.85rem;}' +
    '}';

  var BURGER_SVG =
    '<svg class="v-bars" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>' +
    '<svg class="v-x" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><line x1="5" y1="5" x2="19" y2="19"/><line x1="19" y1="5" x2="5" y2="19"/></svg>';

  function onReady(fn) {
    if (doc.readyState === 'loading') {
      doc.addEventListener('DOMContentLoaded', fn);
    } else { fn(); }
  }

  function initNav() {
    var nav = doc.querySelector('.site-header .nav');
    var links = doc.getElementById('nav-links') ||
                (nav && nav.querySelector('.nav-links'));
    if (!nav || !links) return;
    if (!links.id) links.id = 'nav-links';

    var style = doc.createElement('style');
    style.textContent = CSS;
    doc.head.appendChild(style);

    var btn = doc.createElement('button');
    btn.className = 'v-navtoggle';
    btn.type = 'button';
    btn.setAttribute('aria-expanded', 'false');
    btn.setAttribute('aria-controls', links.id);
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

  onReady(initNav);
})();
