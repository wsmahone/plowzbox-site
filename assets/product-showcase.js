/* ============================================================
   PlowzBox · "See it in action" showcases (product-showcase.js)
   Mounts (index.html §3.5): #pbx-dashboard (tabbed owner-UI
   recreation), #pbx-call (missed call end to end), #pbx-inbox
   (channels -> one inbox), #pbx-box (appliance beauty).
   Contract: DOMContentLoaded boot; no-op when a mount is absent;
   no external resources; message-like text via textContent only
   (innerHTML only for static hand-authored icon SVG constants);
   prefers-reduced-motion gets complete static states. Numbers
   are illustrative; nothing shown exceeds shipping capability.
   ============================================================ */
(function () {
  'use strict';

  var motionQuery = window.matchMedia
    ? window.matchMedia('(prefers-reduced-motion: reduce)')
    : { matches: false, addEventListener: null };
  function rm() { return !!motionQuery.matches; }

  function el(tag, className, text) {
    var n = document.createElement(tag);
    if (className) n.className = className;
    if (text != null) n.textContent = text;
    return n;
  }
  /* icon holder for STATIC svg constants only */
  function icon(className, svg) {
    var n = el('span', className);
    n.setAttribute('aria-hidden', 'true');
    n.innerHTML = svg;
    return n;
  }
  function enter(parent, node) {
    parent.appendChild(node);
    window.requestAnimationFrame(function () {
      window.requestAnimationFrame(function () { node.classList.add('px-in'); });
    });
  }

  /* ---- static icon constants (16/18px strokes, brand palette) ---- */
  var S = 'fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"';
  var IC = {
    grass: '<svg width="15" height="15" viewBox="0 0 20 20" fill="none" stroke="#8fd4ae" stroke-width="2.2" stroke-linecap="round"><path d="M6,17 C5,12 5,8 4,5"/><path d="M10,17 C10,11 10,7 10,3"/><path d="M14,17 C15,12 15,8 16,5"/></svg>',
    chat: '<svg width="16" height="16" viewBox="0 0 24 24" ' + S + '><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>',
    mail: '<svg width="16" height="16" viewBox="0 0 24 24" ' + S + '><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M22 7l-10 7L2 7"/></svg>',
    phone: '<svg width="16" height="16" viewBox="0 0 24 24" ' + S + '><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"/></svg>',
    globe: '<svg width="16" height="16" viewBox="0 0 24 24" ' + S + '><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>',
    boxGrass: '<svg width="26" height="26" viewBox="0 0 20 20" fill="none" stroke="#8fd4ae" stroke-width="2" stroke-linecap="round"><path d="M6,17 C5,12 5,8 4,5"/><path d="M10,17 C10,11 10,7 10,3"/><path d="M14,17 C15,12 15,8 16,5"/></svg>'
  };

  /* ============================================================
     1. #pbx-dashboard · the owner dashboard, faithfully
     ============================================================ */
  function initDashboard(mount) {
    var state = { drafts: 3, tab: 'overview' };
    var WEEKDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    var MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July',
      'August', 'September', 'October', 'November', 'December'];

    var dash = el('div', 'px-dash');
    dash.setAttribute('role', 'group');
    dash.setAttribute('aria-label',
      'Interactive recreation of the PlowzBox owner dashboard with Overview, Inbox, and Day Board tabs. Illustrative numbers, not live data.');

    var browser = el('div', 'px-browser');
    browser.appendChild(el('i'));
    browser.appendChild(el('i'));
    browser.appendChild(el('i'));
    browser.appendChild(el('span', '', 'plowzbox.local · owner dashboard'));
    dash.appendChild(browser);

    var top = el('div', 'px-topbar');
    top.appendChild(icon('px-brand-dot', IC.grass));
    var who = el('div');
    who.appendChild(el('div', 'px-brand-name', 'Wayneview Lawn & Snow'));
    who.appendChild(el('div', 'px-brand-sub', 'Owner Dashboard'));
    top.appendChild(who);
    var sys = el('div', 'px-sys');
    sys.appendChild(el('span', 'px-sys-dot'));
    sys.appendChild(el('span', '', 'AI engine: local · All systems on your box'));
    top.appendChild(sys);
    dash.appendChild(top);

    var tabsBar = el('div', 'px-tabs');
    tabsBar.setAttribute('role', 'tablist');
    tabsBar.setAttribute('aria-label', 'Dashboard sections (demo)');
    var TABS = [
      { id: 'overview', label: 'Overview' },
      { id: 'inbox', label: 'Inbox' },
      { id: 'dayboard', label: 'Day Board' }
    ];
    var tabBtns = {};
    TABS.forEach(function (t) {
      var b = el('button', 'px-tab', t.label);
      b.type = 'button';
      b.setAttribute('role', 'tab');
      b.addEventListener('click', function () { show(t.id); });
      tabBtns[t.id] = b;
      tabsBar.appendChild(b);
    });
    tabsBar.appendChild(el('span', 'px-tabs-more', '+ Route · Quotes · Money · Reviews · Crew'));
    dash.appendChild(tabsBar);

    var body = el('div', 'px-body');
    dash.appendChild(body);
    dash.appendChild(el('div', 'px-dash-note',
      'The owner dashboard, recreated faithfully from the product UI · illustrative numbers, not live data'));
    mount.appendChild(dash);

    var timers = [];
    function later(ms, fn) { timers.push(window.setTimeout(fn, ms)); }
    function clearTimers() { timers.forEach(window.clearTimeout); timers = []; }

    function tile(opts) {
      var t = el('div', 'px-tile' + (opts.mod ? ' px-tile--' + opts.mod : ''));
      var lab = el('div', 'px-tile-label');
      if (opts.dot) lab.appendChild(el('i', 'px-live-dot'));
      lab.appendChild(el('span', '', opts.label));
      t.appendChild(lab);
      t.appendChild(el('div', 'px-tile-value', opts.value));
      t.appendChild(el('div', 'px-tile-sub', opts.sub));
      return t;
    }
    function row(time, name, sub, pillText, pillMod) {
      var r = el('div', 'px-row');
      r.appendChild(el('span', 'px-row-time', time));
      r.appendChild(el('span', 'px-row-name', name));
      r.appendChild(el('span', 'px-row-sub', sub));
      r.appendChild(el('span', 'px-pill px-pill--' + pillMod, pillText));
      return r;
    }
    function card(title, linkText, linkFn) {
      var c = el('div', 'px-card');
      var h = el('div', 'px-card-head');
      h.appendChild(el('span', 'px-card-title', title));
      if (linkText) {
        var l = el('button', 'px-link', linkText);
        l.type = 'button';
        l.addEventListener('click', linkFn);
        h.appendChild(l);
      }
      c.appendChild(h);
      return c;
    }

    /* ---- Overview ---- */
    function renderOverview(root) {
      var now = new Date();
      var greet = now.getHours() < 12 ? 'Good morning'
        : (now.getHours() < 17 ? 'Good afternoon' : 'Good evening');
      var head = el('div', 'px-view-head');
      var hl = el('div');
      hl.appendChild(el('div', 'px-greet', greet));
      hl.appendChild(el('div', 'px-date',
        WEEKDAYS[now.getDay()] + ', ' + MONTHS[now.getMonth()] + ' ' + now.getDate() + ' · Today at a glance'));
      head.appendChild(hl);
      var refresh = el('button', 'px-refresh', 'Refresh');
      refresh.type = 'button';
      refresh.addEventListener('click', function () { show('overview', true); });
      head.appendChild(refresh);
      root.appendChild(head);

      var tiles = el('div', 'px-tiles');
      var draftsTile = tile({
        label: 'Replies waiting', value: rm() ? String(state.drafts) : String(Math.max(state.drafts - 1, 0)),
        sub: 'Drafted for your approval', mod: 'go', dot: true
      });
      tiles.appendChild(tile({ label: 'Jobs today', value: '7', sub: '2 done · 5 to go' }));
      tiles.appendChild(draftsTile);
      tiles.appendChild(tile({ label: 'Needs attention', value: '1', sub: 'Flagged straight to you', mod: 'alert' }));
      tiles.appendChild(tile({ label: 'Open quotes', value: '4', sub: '2 going quiet · follow-ups drafted', mod: 'alert' }));
      tiles.appendChild(tile({ label: 'Waiting to be paid', value: '4', sub: 'Reminders drafted, not sent' }));
      tiles.appendChild(tile({ label: 'Reviews', value: '2', sub: 'Requests ready after good jobs' }));
      root.appendChild(tiles);

      /* subtle life: a new draft lands and the count ticks up */
      if (!rm()) {
        later(1900, function () {
          var v = draftsTile.querySelector('.px-tile-value');
          if (!v) return;
          v.textContent = '';
          var span = el('span', 'px-tick', String(state.drafts));
          v.appendChild(span);
        });
      }

      var sched = card("Today's schedule", 'Open day board', function () { show('dayboard'); });
      sched.appendChild(row('8:00', 'Maple St', 'weekly mowing · Crew A', 'Done', 'done'));
      sched.appendChild(row('9:30', 'Cedar Ln', 'spring cleanup · Crew B', 'In progress', 'prog'));
      sched.appendChild(row('11:00', 'Birchwood HOA', 'mowing · Crew A', 'En route', 'route'));
      sched.appendChild(row('1:00', 'Orchard Rd', 'quote visit · You', 'Scheduled', 'sched'));
      root.appendChild(sched);

      var two = el('div', 'px-two');
      var msgs = card('Latest messages', 'Open inbox', function () { show('inbox'); });
      [['Dana M.', '"How much for weekly mowing?"'],
       ['(315) 555-0119', 'Missed call · voicemail transcribed'],
       ['Cedar Ln HOA', '"Can we get a cleanup quote?"']].forEach(function (m) {
        var r = el('div', 'px-mini-row');
        r.appendChild(el('span', 'px-mini-who', m[0]));
        r.appendChild(el('span', 'px-mini-what', m[1]));
        msgs.appendChild(r);
      });
      var wait = card('Waiting on you');
      [['Reply: mowing price question', 'Ready', 'warn'],
       ['Follow-up: cleanup quote', 'Ready', 'warn'],
       ['Upset customer detected', 'Needs you', 'danger']].forEach(function (w) {
        var r = el('div', 'px-mini-row');
        r.appendChild(el('span', 'px-mini-what', w[0]));
        r.appendChild(el('span', 'px-pill px-pill--' + w[2], w[1]));
        wait.appendChild(r);
      });
      two.appendChild(msgs);
      two.appendChild(wait);
      root.appendChild(two);
    }

    /* ---- Inbox (approval queue) ---- */
    function draftItem(meta, pillText, bodyText, groundText) {
      var d = el('div', 'px-card px-draft');
      var m = el('div', 'px-draft-meta');
      m.appendChild(el('span', '', meta));
      m.appendChild(el('span', 'px-pill px-pill--sched', pillText));
      d.appendChild(m);
      d.appendChild(el('div', 'px-draft-body', bodyText));
      d.appendChild(el('span', 'px-ground', groundText));
      var actions = el('div', 'px-draft-actions');
      actions.style.marginTop = '9px';
      var approve = el('button', 'px-btn px-btn--primary', 'Approve and send');
      var edit = el('button', 'px-btn px-btn--ghost', 'Edit');
      var reject = el('button', 'px-btn px-btn--danger', 'Reject');
      [approve, edit, reject].forEach(function (b) { b.type = 'button'; actions.appendChild(b); });
      d.appendChild(actions);
      var note = el('div');
      d.appendChild(note);

      approve.addEventListener('click', function () {
        d.classList.add('is-approved');
        actions.remove();
        note.className = 'px-sent-note';
        note.textContent = 'Approved · sent from your business number ✓';
        state.drafts = Math.max(state.drafts - 1, 0);
        syncBadge();
      });
      reject.addEventListener('click', function () {
        d.classList.add('is-approved');
        actions.remove();
        note.className = 'px-sent-note';
        note.style.color = 'var(--chq-ink-secondary)';
        note.textContent = 'Rejected · nothing was sent';
        state.drafts = Math.max(state.drafts - 1, 0);
        syncBadge();
      });
      edit.addEventListener('click', function () {
        note.className = 'px-sent-note';
        note.style.color = 'var(--chq-ink-secondary)';
        note.textContent = 'In the product, you rewrite the reply here before it sends.';
      });
      return d;
    }
    var badgeEl = null;
    function syncBadge() {
      if (badgeEl) badgeEl.textContent = 'Replies waiting for your approval (' + state.drafts + ')';
    }
    function renderInbox(root) {
      var head = el('div', 'px-view-head');
      var hl = el('div');
      hl.appendChild(el('div', 'px-greet', 'Inbox'));
      hl.appendChild(el('div', 'px-date', 'Every channel lands here · you hold the approve button'));
      head.appendChild(hl);
      root.appendChild(head);

      var flag = el('div', 'px-flag');
      flag.appendChild(el('strong', '', '1 needs you: '));
      flag.appendChild(el('span', '', 'an upset customer is flagged to you, never answered automatically.'));
      root.appendChild(flag);

      var q = el('div', 'px-card');
      var qh = el('div', 'px-card-head');
      badgeEl = el('span', 'px-card-title');
      syncBadge();
      qh.appendChild(badgeEl);
      q.appendChild(qh);
      q.appendChild(draftItem('New customer · (315) 555-0184 · Text', 'Price question',
        'Hi! Weekly mowing for a yard your size is $60 per visit, straight from our price book. Want me to get you on the schedule?',
        'GROUNDED · YOUR PRICE BOOK'));
      q.appendChild(draftItem('Dana M. · Quote #241 · Follow-up', 'Going quiet',
        'Hi Dana, just checking in on the spring cleanup quote from Saturday. Happy to answer anything, or get you on the schedule this week.',
        'GROUNDED · YOUR CALENDAR'));
      root.appendChild(q);
    }

    /* ---- Day Board ---- */
    function renderDayboard(root) {
      var head = el('div', 'px-view-head');
      var hl = el('div');
      hl.appendChild(el('div', 'px-greet', 'Day Board'));
      hl.appendChild(el('div', 'px-date', 'Today · 3 crews out · route optimized'));
      head.appendChild(hl);
      head.appendChild(el('span', 'px-pill px-pill--warn', 'Rain day'));
      root.appendChild(head);

      var w = card('Weather advisory');
      var wl = el('div', 'px-weather');
      wl.appendChild(el('span', 'px-pill px-pill--warn', 'Rain'));
      var wt = el('span');
      wt.appendChild(el('b', '', '2 jobs at risk tomorrow. '));
      wt.appendChild(document.createTextNode(
        'Reschedule texts are drafted in English and Spanish, waiting for your approval.'));
      wl.appendChild(wt);
      w.appendChild(wl);
      root.appendChild(w);

      var jobs = card('Jobs · Tuesday');
      jobs.appendChild(row('8:00', 'Maple St', 'weekly mowing · Crew A · gate code on file', 'Done', 'done'));
      jobs.appendChild(row('9:30', 'Cedar Ln', 'spring cleanup · Crew B', 'In progress', 'prog'));
      jobs.appendChild(row('11:00', 'Birchwood HOA', 'mowing · Crew A · "on our way" text sent', 'En route', 'route'));
      jobs.appendChild(row('1:00', 'Orchard Rd', 'quote visit · You', 'Scheduled', 'sched'));
      jobs.appendChild(row('3:00', 'Foxglove Ct', 'hedge trim · Crew B', 'Scheduled', 'sched'));
      root.appendChild(jobs);
    }

    var RENDER = { overview: renderOverview, inbox: renderInbox, dayboard: renderDayboard };
    function show(id, force) {
      if (!force && state.tab === id && body.childNodes.length) return;
      clearTimers();
      state.tab = id;
      TABS.forEach(function (t) {
        tabBtns[t.id].classList.toggle('is-active', t.id === id);
        tabBtns[t.id].setAttribute('aria-selected', t.id === id ? 'true' : 'false');
      });
      body.textContent = '';
      var view = el('div', 'px-view');
      RENDER[id](view);
      body.appendChild(view);
    }
    show('overview', true);
  }

  /* ============================================================
     2. #pbx-call · a missed call, handled end to end
     ============================================================ */
  var CALL_TEXT = {
    number: '(315) 555-0184',
    ringing: 'Incoming call…',
    missed: 'Missed · 2:14 PM · you were on the mower',
    textback: 'Sorry we missed your call! This is Wayneview Lawn & Snow. How can we help?',
    textbackMeta: 'Automatic text-back · from your business number · in seconds',
    vmTag: 'VOICEMAIL · TRANSCRIBED ON THE BOX',
    vm: '"Hi, this is Dana on Cedar Lane. I need a spring cleanup and wanted to get a price…"',
    draftTagWaiting: 'Drafted · grounded in your price book',
    draftTagApproved: 'Approved · sending',
    draft: 'Hi Dana, thanks for the voicemail. A spring cleanup for a yard your size is $220 from our price book. Want Thursday morning?',
    sentMeta: 'Sent · approved by you ✓'
  };
  var CALL_STEPS = [
    ['A call you can’t take',
     '2:14 PM. You’re on the mower and a new number is ringing.'],
    ['Missed call, texted back in seconds',
     'The box replies from your business number automatically, day or night.'],
    ['The voicemail becomes text',
     'Transcribed right on the box. The audio never leaves your building.'],
    ['A reply is drafted from your price book',
     'Real price, real availability. It never invents a number.'],
    ['You approve. It sends.',
     'One tap from the truck. Nothing goes out without you.']
  ];

  function initCall(mount) {
    var wrap = el('div', 'px-call');

    /* left: step rail */
    var rail = el('ol', 'px-steps');
    rail.setAttribute('aria-label', 'The five steps of how PlowzBox handles a missed call');
    var stepBtns = [];
    CALL_STEPS.forEach(function (s, i) {
      var li = el('li');
      var b = el('button', 'px-step');
      b.type = 'button';
      b.appendChild(el('span', 'px-step-dot'));
      b.appendChild(el('span', 'px-step-t', s[0]));
      b.appendChild(el('span', 'px-step-s', s[1]));
      b.addEventListener('click', function () { jumpTo(i); });
      li.appendChild(b);
      rail.appendChild(li);
      stepBtns.push(b);
    });
    wrap.appendChild(rail);

    /* right: the owner's phone */
    var side = el('div', 'px-callphone-wrap');
    var local = el('span', 'px-local');
    var led = el('i', 'px-local-led');
    local.appendChild(led);
    local.appendChild(el('span', '', 'HANDLED ON THE BOX · LOCALLY'));
    side.appendChild(local);

    var phone = el('div', 'px-callphone');
    var screen = el('div', 'px-callscreen');
    var head = el('div', 'px-callhead');
    head.appendChild(icon('px-callhead-ic', IC.phone));
    var hw = el('div');
    hw.appendChild(el('div', 'px-callhead-name', 'Your business line'));
    hw.appendChild(el('div', 'px-callhead-sub', 'Wayneview Lawn & Snow · answered by PlowzBox'));
    head.appendChild(hw);
    screen.appendChild(head);
    var feed = el('div', 'px-callfeed');
    feed.setAttribute('role', 'log');
    feed.setAttribute('aria-label',
      'Demo: a missed call gets an automatic text-back, the voicemail is transcribed on the box, a reply is drafted from the price book, and the owner approves it.');
    screen.appendChild(feed);
    phone.appendChild(screen);
    side.appendChild(phone);
    wrap.appendChild(side);
    mount.appendChild(wrap);

    /* ---- builders ---- */
    function callBanner() {
      var c = el('div', 'px-evt px-evt-call is-ringing');
      c.appendChild(icon('px-ring', IC.phone));
      var w = el('div');
      w.appendChild(el('div', 'px-call-who', CALL_TEXT.number));
      var st = el('div', 'px-call-state', CALL_TEXT.ringing);
      w.appendChild(st);
      c.appendChild(w);
      return { node: c, state: st };
    }
    function bub(text) { return el('div', 'px-evt px-bub px-bub--out', text); }
    function meta(text) { return el('div', 'px-evt px-evt-meta px-evt-meta--out', text); }
    function vmCard() {
      var v = el('div', 'px-evt px-vm');
      v.appendChild(el('div', 'px-vm-tag', CALL_TEXT.vmTag));
      v.appendChild(el('div', 'px-vm-text', CALL_TEXT.vm));
      return v;
    }
    function draftCard() {
      var d = el('div', 'px-evt px-draftcard');
      var tag = el('div', 'px-draftcard-tag', CALL_TEXT.draftTagWaiting);
      d.appendChild(tag);
      d.appendChild(el('div', 'px-draftcard-body', CALL_TEXT.draft));
      var a = el('div', 'px-draftcard-actions');
      var edit = el('span', 'px-tapbtn px-tapbtn--ghost', 'Edit');
      var ok = el('span', 'px-tapbtn px-tapbtn--primary', 'Approve');
      a.appendChild(edit);
      a.appendChild(ok);
      d.appendChild(a);
      return { node: d, tag: tag, ok: ok };
    }

    /* ---- timeline ---- */
    var timers = [];
    function later(ms, fn) { timers.push(window.setTimeout(fn, ms)); }
    function clearTimers() { timers.forEach(window.clearTimeout); timers = []; }
    function ledHot(ms) {
      led.classList.add('is-hot');
      later(ms || 900, function () { led.classList.remove('is-hot'); });
    }
    function setStep(i) {
      stepBtns.forEach(function (b, k) { b.classList.toggle('is-on', k <= i); });
    }

    var refs = {};
    function stage(i, instant) {
      var put = instant
        ? function (n) { feed.appendChild(n); n.classList.add('px-in'); }
        : function (n) { enter(feed, n); };
      if (i === 0) {
        refs.call = callBanner();
        put(refs.call.node);
      } else if (i === 1) {
        if (refs.call) {
          refs.call.node.classList.remove('is-ringing');
          refs.call.node.classList.add('is-missed');
          refs.call.state.textContent = CALL_TEXT.missed;
        }
        if (!instant) ledHot(900);
        put(bub(CALL_TEXT.textback));
        put(meta(CALL_TEXT.textbackMeta));
      } else if (i === 2) {
        if (!instant) ledHot(1100);
        put(vmCard());
      } else if (i === 3) {
        if (!instant) ledHot(1300);
        refs.draft = draftCard();
        put(refs.draft.node);
      } else if (i === 4) {
        if (refs.draft) {
          if (!instant) {
            refs.draft.ok.classList.add('px-press');
            refs.draft.ok.appendChild(el('span', 'px-tapripple'));
            later(380, function () {
              refs.draft.ok.classList.remove('px-press');
              approveDraft();
            });
          } else {
            approveDraft();
          }
        }
        if (instant) { put(meta(CALL_TEXT.sentMeta)); }
        else later(750, function () { enter(feed, meta(CALL_TEXT.sentMeta)); });
      }
      setStep(i);
    }
    function approveDraft() {
      refs.draft.node.classList.add('is-approved');
      refs.draft.tag.textContent = CALL_TEXT.draftTagApproved;
      refs.draft.ok.textContent = 'Approved ✓';
    }
    function reset() {
      feed.classList.remove('px-fade');
      feed.textContent = '';
      refs = {};
    }
    function renderStatic() {
      clearTimers();
      reset();
      for (var i = 0; i <= 4; i++) stage(i, true);
    }
    var OFFSETS = [400, 2600, 5600, 8600, 12200];
    function runFrom(k) {
      clearTimers();
      reset();
      for (var i = 0; i < k; i++) stage(i, true);
      for (var j = k; j <= 4; j++) {
        (function (idx, delay) { later(delay, function () { stage(idx, false); }); })(
          j, OFFSETS[j] - (k > 0 ? OFFSETS[k] - 500 : 0));
      }
      later(16600 - (k > 0 ? OFFSETS[k] - 500 : 0), function () { feed.classList.add('px-fade'); });
      later(17600 - (k > 0 ? OFFSETS[k] - 500 : 0), function () { runFrom(0); });
    }
    function jumpTo(k) {
      if (rm()) { renderStatic(); setStep(4); return; }
      runFrom(k);
    }
    function start() {
      if (rm()) { renderStatic(); } else { runFrom(0); }
    }
    start();
    if (motionQuery.addEventListener) motionQuery.addEventListener('change', start);
  }

  /* ============================================================
     3. #pbx-inbox · one inbox, every channel
     ============================================================ */
  var CHANNELS = [
    { name: 'Text', snip: '"How much for weekly mowing?"', ic: 'chat' },
    { name: 'Email', snip: '"Can we get a cleanup quote?"', ic: 'mail' },
    { name: 'Phone', snip: 'Missed call · voicemail', ic: 'phone' },
    { name: 'Website', snip: 'Booking request · Thursdays', ic: 'globe' }
  ];
  var INBOX_ROWS = [
    { tag: 'Text', who: 'Dana M.', what: 'Weekly mowing price question', state: 'Draft ready', mod: 'draft' },
    { tag: 'Email', who: 'Cedar Ln HOA', what: 'Spring cleanup quote request', state: 'Draft ready', mod: 'draft' },
    { tag: 'Phone', who: '(315) 555-0119', what: 'Voicemail transcribed · reply drafted', state: 'Draft ready', mod: 'draft' },
    { tag: 'Website', who: 'M. Alvarez', what: 'Every-other-Thursday mowing', state: 'Booked ✓', mod: 'booked' }
  ];

  function initInbox(mount) {
    var flow = el('div', 'px-flow');
    flow.setAttribute('aria-label',
      'Diagram: texts, email, phone calls, and website requests all flow into one inbox on the PlowzBox. Replies are drafted for approval; bookings land on the real schedule.');

    var chans = el('div', 'px-chans');
    var chanEls = [];
    CHANNELS.forEach(function (c) {
      var n = el('div', 'px-chan');
      n.appendChild(icon('px-chan-ic', IC[c.ic]));
      var w = el('div');
      w.appendChild(el('div', 'px-chan-name', c.name));
      w.appendChild(el('div', 'px-chan-snip', c.snip));
      n.appendChild(w);
      chans.appendChild(n);
      chanEls.push(n);
    });
    flow.appendChild(chans);

    var conduit = el('div', 'px-conduit');
    var boxNode = el('div', 'px-conduit-box');
    boxNode.appendChild(icon('', IC.boxGrass));
    var cled = el('i', 'px-conduit-led');
    boxNode.appendChild(cled);
    conduit.appendChild(boxNode);
    conduit.appendChild(el('div', 'px-conduit-label', 'PLOWZBOX\nLOCAL AI'));
    flow.appendChild(conduit);

    var inbox = el('div', 'px-inbox');
    var ih = el('div', 'px-inbox-head');
    ih.appendChild(el('span', 'px-inbox-title', 'One inbox'));
    ih.appendChild(el('span', 'px-inbox-sub', 'plowzbox.local'));
    inbox.appendChild(ih);
    var list = el('div', 'px-inbox-list');
    inbox.appendChild(list);
    flow.appendChild(inbox);
    mount.appendChild(flow);

    function rowNode(r) {
      var n = el('div', 'px-in-row');
      n.appendChild(el('span', 'px-in-tag', r.tag));
      n.appendChild(el('span', 'px-in-who', r.who));
      n.appendChild(el('span', 'px-in-what', r.what));
      n.appendChild(el('span', 'px-in-state px-in-state--' + r.mod, r.state));
      return n;
    }

    var timers = [];
    function later(ms, fn) { timers.push(window.setTimeout(fn, ms)); }
    function clearTimers() { timers.forEach(window.clearTimeout); timers = []; }

    function renderStatic() {
      clearTimers();
      list.textContent = '';
      INBOX_ROWS.forEach(function (r) {
        var n = rowNode(r);
        n.classList.add('px-in');
        list.appendChild(n);
      });
      chanEls.forEach(function (c) { c.classList.remove('is-live'); });
    }
    var k = 0;
    function cycle() {
      var idx = k % 4;
      chanEls.forEach(function (c, i) { c.classList.toggle('is-live', i === idx); });
      later(650, function () {
        cled.classList.add('is-hot');
        later(500, function () { cled.classList.remove('is-hot'); });
      });
      later(1150, function () {
        var n = rowNode(INBOX_ROWS[idx]);
        list.insertBefore(n, list.firstChild);
        window.requestAnimationFrame(function () {
          window.requestAnimationFrame(function () { n.classList.add('px-in'); });
        });
        while (list.children.length > 4) list.removeChild(list.lastChild);
      });
      k += 1;
      later(2700, cycle);
    }
    function start() {
      if (rm()) { renderStatic(); return; }
      clearTimers();
      list.textContent = '';
      /* seed two rows so the inbox never looks empty */
      [INBOX_ROWS[2], INBOX_ROWS[3]].forEach(function (r) {
        var n = rowNode(r);
        n.classList.add('px-in');
        list.appendChild(n);
      });
      cycle();
    }
    start();
    if (motionQuery.addEventListener) motionQuery.addEventListener('change', start);
  }

  /* ============================================================
     4. #pbx-box · the appliance beauty moment
     ============================================================ */
  function initBox(mount) {
    var hero = el('div', 'px-hero');
    var glow = el('div', 'px-hero-glow');
    var img = document.createElement('img');
    img.src = 'assets/img/plowzbox-nuc.svg';
    img.alt = 'The PlowzBox appliance: a matte-black mini computer with a green status light.';
    img.width = 760; img.height = 490;
    img.loading = 'lazy';
    glow.appendChild(img);
    hero.appendChild(glow);
    hero.appendChild(el('p', 'px-hero-line',
      'Everything above runs on this box. On your shelf.'));
    hero.appendChild(el('p', 'px-hero-sub',
      'The dashboard, the call handling, the inbox, the AI itself: all of it lives on the PlowzBox at your shop. Not in someone else’s cloud.'));
    var specs = el('ul', 'px-specs');
    ['LOCAL AI · 7B + 14B MODELS', 'FULL-DISK ENCRYPTION', 'NO INBOUND CONNECTIONS', 'ONE CABLE TO YOUR ROUTER']
      .forEach(function (s) { specs.appendChild(el('li', 'px-spec', s)); });
    hero.appendChild(specs);
    mount.appendChild(hero);
  }

  /* ============================================================
     boot
     ============================================================ */
  function boot() {
    var m;
    if ((m = document.getElementById('pbx-dashboard'))) initDashboard(m);
    if ((m = document.getElementById('pbx-call'))) initCall(m);
    if ((m = document.getElementById('pbx-inbox'))) initInbox(m);
    if ((m = document.getElementById('pbx-box'))) initBox(m);
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
