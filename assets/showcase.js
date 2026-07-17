/* ============================================================
   PlowzBox · showcase widgets (assets/showcase.js)
   Owner: interaction/motion engineer.

   Populates four mount points left empty by index.html:
     #pb-appliance  · isometric hero scene (box + router + shelf)
     #pb-sms-demo   · looping "draft -> approve -> send" phone
     #pb-dashboard  · static owner-dashboard preview
     #pb-channels   · four channels flowing into one inbox

   Contract: runs on DOMContentLoaded; no-ops gracefully when a
   mount is absent. No external resources. All dynamic text is
   set via textContent. Respects prefers-reduced-motion (renders
   a clean static end-state and lets showcase.css kill motion).
   ============================================================ */
(function () {
  'use strict';

  var motionQuery = window.matchMedia
    ? window.matchMedia('(prefers-reduced-motion: reduce)')
    : { matches: false, addEventListener: null };

  function reducedMotion() {
    return !!motionQuery.matches;
  }

  /* -------- tiny DOM helpers (textContent only · never innerHTML
     for anything message-like) -------- */
  function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text != null) node.textContent = text;
    return node;
  }

  /* Static, hand-authored SVG scenes (no interpolated data). */
  function injectSvg(mount, svgMarkup) {
    mount.innerHTML = svgMarkup;
  }

  /* ============================================================
     1. #pb-appliance · isometric scene
     Iso projection used while drawing: px = 320 + (x - y),
     py = 140 + (x + y)/2 - z. Hand-tuned afterwards.
     ============================================================ */
  var APPLIANCE_SVG =
    '<svg class="pb-scene" viewBox="142 42 542 326" xmlns="http://www.w3.org/2000/svg" role="img" ' +
      'aria-label="Illustration: the PlowzBox appliance on a shelf beside your wifi router, connected by one cable, status light on.">' +
      /* no <defs>/url(#id) references: keeps the scene safe under
         <base href>, duplication, or hidden-subtree rendering */
      '<g class="pb-float">' +

        /* shelf */
        '<polygon points="320,124 620,274 490,339 190,189" fill="#ece5d4"/>' +
        '<polygon points="620,274 490,339 490,355 620,290" fill="#bfb296"/>' +
        '<polygon points="190,189 490,339 490,355 190,205" fill="#d4c9b0"/>' +
        '<g stroke="#dccfb4" stroke-width="1.4" opacity="0.8">' +
          '<line x1="290" y1="139" x2="590" y2="289"/>' +
          '<line x1="250" y1="159" x2="550" y2="309"/>' +
          '<line x1="215" y1="176.5" x2="515" y2="326.5"/>' +
        '</g>' +

        /* soft shadows under devices (sized to stay on the shelf) */
        '<g fill="var(--chq-green-950)">' +
          '<ellipse cx="335" cy="199" rx="60" ry="20" opacity="0.10" transform="rotate(26.5 335 199)"/>' +
          '<ellipse cx="478" cy="268" rx="64" ry="24" opacity="0.12" transform="rotate(26.5 478 268)"/>' +
        '</g>' +

        /* little potted plant (front-left of shelf) */
        '<g>' +
          '<path d="M212,168 C208,158 210,150 213,146 M217,168 C217,156 218,148 222,142 M221,168 C226,159 230,154 233,151" ' +
            'fill="none" stroke="var(--chq-green-500)" stroke-width="2.4" stroke-linecap="round"/>' +
          '<path d="M206,167 L229,167 L226,182 L209,182 Z" fill="var(--chq-neutral-300)"/>' +
          '<rect x="204.5" y="165" width="26" height="5" rx="2.5" fill="var(--chq-neutral-400)"/>' +
        '</g>' +

        /* ---- router ---- */
        '<polygon points="415,178.5 355,208.5 355,236.5 415,206.5" fill="var(--chq-neutral-300)"/>' +
        '<polygon points="255,158.5 355,208.5 355,236.5 255,186.5" fill="var(--chq-neutral-200)"/>' +
        '<polygon points="315,128.5 415,178.5 355,208.5 255,158.5" fill="var(--chq-neutral-100)"/>' +
        '<g stroke="var(--chq-neutral-800)" stroke-width="4.5" stroke-linecap="round">' +
          '<line x1="340" y1="141" x2="334" y2="106"/>' +
          '<line x1="380" y1="161" x2="388" y2="126"/>' +
        '</g>' +
        '<circle cx="334" cy="104" r="3" fill="var(--chq-neutral-800)"/>' +
        '<circle cx="388" cy="124" r="3" fill="var(--chq-neutral-800)"/>' +
        '<g fill="var(--chq-green-500)">' +
          '<circle cx="275" cy="176" r="2.2"/>' +
          '<circle cx="287" cy="182" r="2.2"/>' +
          '<circle cx="299" cy="188" r="2.2" opacity="0.45"/>' +
        '</g>' +

        /* wifi arcs above the router antenna */
        '<g class="pb-wifi" transform="translate(334,97)" fill="none" ' +
          'stroke="var(--chq-green-400)" stroke-width="3" stroke-linecap="round">' +
          '<path d="M -9,-6 A 11,11 0 0 1 9,-6"/>' +
          '<path d="M -16,-12 A 20,20 0 0 1 16,-12"/>' +
          '<path d="M -23,-18 A 29,29 0 0 1 23,-18"/>' +
        '</g>' +

        /* cable: router -> box, sagging onto the shelf */
        '<path d="M370,223 C380,240 370,250 383,252 C392,253.5 394,251 400,253" ' +
          'fill="none" stroke="var(--chq-neutral-800)" stroke-width="2.4" ' +
          'stroke-linecap="round" opacity="0.75"/>' +

        /* ---- the PlowzBox ---- */
        '<polygon points="580,213 505,250.5 505,316.5 580,279" fill="var(--chq-green-800)"/>' +
        '<polygon points="395,195.5 505,250.5 505,316.5 395,261.5" fill="var(--chq-green-700)"/>' +
        '<polygon points="470,158 580,213 505,250.5 395,195.5" fill="var(--chq-green-600)"/>' +
        /* top highlight edges */
        '<polyline points="395,195.5 470,158 580,213" fill="none" stroke="var(--chq-green-400)" stroke-width="1.6" opacity="0.6"/>' +
        /* vents on the right face */
        '<g stroke="var(--chq-green-900)" stroke-width="2.6" stroke-linecap="round" opacity="0.65">' +
          '<line x1="520" y1="272" x2="548" y2="258"/>' +
          '<line x1="520" y1="281" x2="548" y2="267"/>' +
          '<line x1="520" y1="290" x2="548" y2="276"/>' +
        '</g>' +
        /* grass-blade mark on the front face */
        '<g transform="translate(444,246)" fill="none" stroke="var(--chq-green-300)" ' +
          'stroke-width="2.6" stroke-linecap="round">' +
          '<path d="M0,0 C-1,-7 -4,-12 -8,-16"/>' +
          '<path d="M6,3 C6,-6 5,-14 3,-20"/>' +
          '<path d="M12,6 C13,-2 16,-8 20,-12"/>' +
        '</g>' +
        /* status LED (blinks) */
        '<circle class="pb-led-halo" cx="410" cy="243" r="10" fill="var(--chq-green-300)" opacity="0"/>' +
        '<circle cx="410" cy="243" r="4.6" fill="var(--chq-green-900)"/>' +
        '<circle class="pb-led-core" cx="410" cy="243" r="3.2" fill="var(--chq-green-300)"/>' +

        /* labels */
        '<g font-family="var(--chq-font-sans)" font-size="12" font-weight="700" letter-spacing="1.5">' +
          '<path d="M240,92 C266,106 286,120 302,135" fill="none" stroke="var(--chq-neutral-400)" ' +
            'stroke-width="1.4" stroke-dasharray="1 4" stroke-linecap="round"/>' +
          '<circle cx="303" cy="136" r="2.4" fill="var(--chq-neutral-400)"/>' +
          '<rect x="152" y="64" width="122" height="27" rx="13.5" fill="var(--chq-green-900)"/>' +
          '<text x="213" y="82" text-anchor="middle" fill="var(--chq-green-200)">YOUR ROUTER</text>' +

          '<path d="M600,156 C590,172 580,188 571,203" fill="none" stroke="var(--chq-neutral-400)" ' +
            'stroke-width="1.4" stroke-dasharray="1 4" stroke-linecap="round"/>' +
          '<circle cx="570" cy="205" r="2.4" fill="var(--chq-neutral-400)"/>' +
          '<rect x="558" y="126" width="114" height="27" rx="13.5" fill="var(--chq-green-700)"/>' +
          '<text x="615" y="144" text-anchor="middle" fill="#ffffff">PLOWZBOX</text>' +
        '</g>' +
      '</g>' +
    '</svg>';

  function initAppliance(mount) {
    mount.classList.add('pb-mounted');
    injectSvg(mount, APPLIANCE_SVG);
  }

  /* ============================================================
     2. #pb-sms-demo · looping approve-to-send scene
     ============================================================ */
  var SMS_TEXT = {
    inbound: 'Hi, how much for weekly mowing on a small yard?',
    draft: 'Lawn Mowing is $60. Want me to get you on the schedule?',
    tagWaiting: 'Drafted · waiting for your approval',
    tagApproved: 'Approved · sending',
    metaIn: 'New customer · 4:12 PM',
    metaOut: 'Sent · approved by you ✓',
    caption: 'The assistant drafts; you approve. Nothing sends without you.'
  };

  function initSms(mount) {
    mount.classList.add('pb-mounted');

    var wrap = el('div', 'pb-sms');
    var phone = el('div', 'pb-phone');
    var screen = el('div', 'pb-screen');

    var header = el('div', 'pb-chat-header');
    header.appendChild(el('div', 'pb-avatar', 'NC'));
    var who = el('div', '');
    who.appendChild(el('div', 'pb-chat-name', 'New customer'));
    who.appendChild(el('div', 'pb-chat-sub', '(555) 013-2847'));
    header.appendChild(who);
    header.appendChild(el('span', 'pb-chat-badge', 'PlowzBox assistant'));

    var chat = el('div', 'pb-chat');
    chat.setAttribute('role', 'log');
    chat.setAttribute('aria-label',
      'Demo conversation: a customer texts, the assistant drafts a reply, the owner approves, the reply sends.');

    screen.appendChild(header);
    screen.appendChild(chat);
    phone.appendChild(screen);
    wrap.appendChild(phone);
    wrap.appendChild(el('p', 'pb-caption', SMS_TEXT.caption));
    mount.appendChild(wrap);

    /* ---- piece builders ---- */
    function bubble(dir, text) {
      return el('div', 'pb-bubble pb-bubble--' + dir, text);
    }
    function meta(dir, text) {
      return el('div', 'pb-meta pb-meta--' + dir, text);
    }
    function typingNode() {
      var t = el('div', 'pb-typing');
      t.appendChild(el('i'));
      t.appendChild(el('i'));
      t.appendChild(el('i'));
      return t;
    }
    function approvalCard() {
      var card = el('div', 'pb-card');
      var tag = el('div', 'pb-card-tag', SMS_TEXT.tagWaiting);
      var body = el('div', 'pb-card-body', SMS_TEXT.draft);
      var actions = el('div', 'pb-card-actions');
      var edit = el('span', 'pb-btn pb-btn--ghost', 'Edit');
      var approve = el('span', 'pb-btn pb-btn--primary', 'Approve');
      actions.appendChild(edit);
      actions.appendChild(approve);
      card.appendChild(tag);
      card.appendChild(body);
      card.appendChild(actions);
      return { card: card, tag: tag, approve: approve };
    }

    /* ---- animation loop ---- */
    var timers = [];
    function later(ms, fn) { timers.push(window.setTimeout(fn, ms)); }
    function clearTimers() {
      for (var i = 0; i < timers.length; i++) window.clearTimeout(timers[i]);
      timers = [];
    }
    function enter(node) {
      chat.appendChild(node);
      /* two RAFs so the transition reliably runs after insert */
      window.requestAnimationFrame(function () {
        window.requestAnimationFrame(function () {
          node.classList.add('pb-in');
          chat.scrollTop = chat.scrollHeight;
        });
      });
    }

    function renderStatic() {
      clearTimers();
      chat.classList.remove('pb-reset');
      chat.textContent = '';
      var b1 = bubble('in', SMS_TEXT.inbound);
      var m1 = meta('in', SMS_TEXT.metaIn);
      var parts = approvalCard();
      parts.card.classList.add('pb-approved');
      parts.tag.textContent = SMS_TEXT.tagApproved;
      parts.approve.textContent = 'Approved ✓';
      var b2 = bubble('out', SMS_TEXT.draft);
      var m2 = meta('out', SMS_TEXT.metaOut);
      var all = [b1, m1, parts.card, b2, m2];
      for (var i = 0; i < all.length; i++) {
        all[i].classList.add('pb-in');
        chat.appendChild(all[i]);
      }
    }

    function runLoop() {
      clearTimers();
      chat.classList.remove('pb-reset');
      chat.textContent = '';

      var typing = typingNode();
      var parts = approvalCard();

      later(400, function () { enter(bubble('in', SMS_TEXT.inbound)); });
      later(800, function () { enter(meta('in', SMS_TEXT.metaIn)); });
      later(1700, function () { enter(typing); });
      later(3500, function () { typing.classList.add('pb-out'); });
      later(3850, function () {
        if (typing.parentNode) typing.parentNode.removeChild(typing);
        enter(parts.card);
      });
      later(6100, function () {
        parts.approve.classList.add('pb-press');
        parts.approve.appendChild(el('span', 'pb-ripple'));
      });
      later(6500, function () {
        parts.approve.classList.remove('pb-press');
        parts.card.classList.add('pb-approved');
        parts.tag.textContent = SMS_TEXT.tagApproved;
        parts.approve.textContent = 'Approved ✓';
      });
      later(7300, function () {
        parts.card.classList.add('pb-done');
        enter(bubble('out', SMS_TEXT.draft));
      });
      later(7800, function () { enter(meta('out', SMS_TEXT.metaOut)); });
      later(11600, function () { chat.classList.add('pb-reset'); });
      later(12400, runLoop);
    }

    function start() {
      if (reducedMotion()) renderStatic();
      else runLoop();
    }
    start();

    if (motionQuery.addEventListener) {
      motionQuery.addEventListener('change', start);
    }
  }

  /* ============================================================
     3. #pb-dashboard · owner dashboard preview (illustrative)
     ============================================================ */
  var DASH_TILES = [
    { label: 'Jobs today', value: '7', sub: '3 crews out', tone: 'brand' },
    { label: 'Replies waiting', value: '3', sub: 'drafts ready to approve', tone: 'warn', dot: true },
    { label: 'Needs attention', value: '1', sub: 'flagged straight to you', tone: 'danger' },
    { label: 'Waiting to be paid', value: '4', sub: 'invoices out', tone: 'info' }
  ];
  var DASH_ROWS = [
    { time: '8:00', name: 'Maple St', desc: 'weekly mowing · Crew A', chip: 'Done', tone: 'done' },
    { time: '10:30', name: 'Cedar Ln', desc: 'spring cleanup · Crew B', chip: 'On site', tone: 'active' },
    { time: '1:00', name: 'Orchard Rd', desc: 'quote visit · You', chip: 'Up next', tone: 'soon' }
  ];

  function initDashboard(mount) {
    mount.classList.add('pb-mounted');

    var dash = el('div', 'pb-dash');
    dash.setAttribute('role', 'img');
    dash.setAttribute('aria-label',
      'Preview of the PlowzBox owner dashboard: overview tiles for jobs today, replies waiting, needs attention, and waiting to be paid, plus the day’s schedule. Illustrative numbers.');

    var bar = el('div', 'pb-dash-bar');
    bar.appendChild(el('i'));
    bar.appendChild(el('i'));
    bar.appendChild(el('i'));
    bar.appendChild(el('span', '', 'plowzbox.local · owner dashboard'));
    dash.appendChild(bar);

    var body = el('div', 'pb-dash-body');
    var head = el('div', 'pb-dash-head');
    head.appendChild(el('div', 'pb-dash-title', 'Overview'));
    head.appendChild(el('span', 'pb-chip', 'Today'));
    body.appendChild(head);

    var tiles = el('div', 'pb-tiles');
    for (var i = 0; i < DASH_TILES.length; i++) {
      var t = DASH_TILES[i];
      var tile = el('div', 'pb-tile pb-tile--' + t.tone);
      var label = el('div', 'pb-tile-label');
      if (t.dot) label.appendChild(el('i', 'pb-dot'));
      label.appendChild(el('span', '', t.label));
      tile.appendChild(label);
      tile.appendChild(el('div', 'pb-tile-value', t.value));
      tile.appendChild(el('div', 'pb-tile-sub', t.sub));
      tiles.appendChild(tile);
    }
    body.appendChild(tiles);

    var rows = el('div', 'pb-rows');
    for (var j = 0; j < DASH_ROWS.length; j++) {
      var r = DASH_ROWS[j];
      var row = el('div', 'pb-row');
      row.appendChild(el('span', 'pb-row-time', r.time));
      row.appendChild(el('span', 'pb-row-name', r.name));
      row.appendChild(el('span', 'pb-row-desc', r.desc));
      row.appendChild(el('span', 'pb-row-chip pb-row-chip--' + r.tone, r.chip));
      rows.appendChild(row);
    }
    body.appendChild(rows);
    dash.appendChild(body);
    dash.appendChild(el('div', 'pb-footnote', 'Illustrative preview · not live data'));
    mount.appendChild(dash);
  }

  /* ============================================================
     4. #pb-channels · four channels, one inbox
     ============================================================ */
  var CHANNELS_SVG =
    '<svg class="pb-channels-svg" viewBox="0 0 640 398" xmlns="http://www.w3.org/2000/svg" role="img" ' +
      'aria-label="Diagram: text messages, email, phone calls, and website requests all flow into one PlowzBox inbox.">' +
      /* base connector paths */
      '<g fill="none" stroke="var(--chq-neutral-200)" stroke-width="2">' +
        '<path d="M166,58 C300,58 330,150 430,172"/>' +
        '<path d="M166,152 C290,152 320,172 430,184"/>' +
        '<path d="M166,246 C290,246 320,208 430,196"/>' +
        '<path d="M166,340 C300,340 330,230 430,208"/>' +
      '</g>' +
      /* animated flow overlays */
      '<g>' +
        '<path class="pb-flow" d="M166,58 C300,58 330,150 430,172"/>' +
        '<path class="pb-flow" d="M166,152 C290,152 320,172 430,184"/>' +
        '<path class="pb-flow" d="M166,246 C290,246 320,208 430,196"/>' +
        '<path class="pb-flow" d="M166,340 C300,340 330,230 430,208"/>' +
      '</g>' +

      /* channel pills */
      '<g font-family="var(--chq-font-sans)" font-size="14" font-weight="600">' +

        '<g transform="translate(16,35)">' +
          '<rect width="150" height="46" rx="23" fill="var(--chq-surface)" stroke="var(--chq-border-strong)"/>' +
          '<g transform="translate(15,14)" fill="none" stroke="var(--chq-green-700)" stroke-width="1.8" stroke-linejoin="round">' +
            '<path d="M3,0.5 h12 a2.5,2.5 0 0 1 2.5,2.5 v6 a2.5,2.5 0 0 1 -2.5,2.5 h-7 l-4.5,4 v-4 h-0.5 a2.5,2.5 0 0 1 -2.5,-2.5 v-6 a2.5,2.5 0 0 1 2.5,-2.5 z"/>' +
          '</g>' +
          '<text x="44" y="28.5" fill="var(--chq-ink)">Text</text>' +
        '</g>' +

        '<g transform="translate(16,129)">' +
          '<rect width="150" height="46" rx="23" fill="var(--chq-surface)" stroke="var(--chq-border-strong)"/>' +
          '<g transform="translate(15,15)" fill="none" stroke="var(--chq-green-700)" stroke-width="1.8" stroke-linejoin="round">' +
            '<rect x="0.5" y="1.5" width="17" height="13" rx="2.2"/>' +
            '<path d="M1.5,3.5 L9,9.5 L16.5,3.5"/>' +
          '</g>' +
          '<text x="44" y="28.5" fill="var(--chq-ink)">Email</text>' +
        '</g>' +

        '<g transform="translate(16,223)">' +
          '<rect width="150" height="46" rx="23" fill="var(--chq-surface)" stroke="var(--chq-border-strong)"/>' +
          '<g transform="translate(15,15)">' +
            '<path d="M3.8,0.8 C2.2,0.8 1.2,1.9 1.3,3.4 C1.8,9.6 6.6,14.3 12.7,14.7 C14.2,14.8 15.3,13.8 15.3,12.2 v-2 l-3.6,-1.1 -1.4,1.5 c-2.1,-1 -3.7,-2.5 -4.7,-4.6 l1.5,-1.4 -1.1,-3.6 z" ' +
              'fill="none" stroke="var(--chq-green-700)" stroke-width="1.8" stroke-linejoin="round"/>' +
          '</g>' +
          '<text x="44" y="28.5" fill="var(--chq-ink)">Phone</text>' +
        '</g>' +

        '<g transform="translate(16,317)">' +
          '<rect width="150" height="46" rx="23" fill="var(--chq-surface)" stroke="var(--chq-border-strong)"/>' +
          '<g transform="translate(15,14)" fill="none" stroke="var(--chq-green-700)" stroke-width="1.7">' +
            '<circle cx="9" cy="8" r="7.5"/>' +
            '<ellipse cx="9" cy="8" rx="3.4" ry="7.5"/>' +
            '<line x1="1.5" y1="8" x2="16.5" y2="8"/>' +
          '</g>' +
          '<text x="44" y="28.5" fill="var(--chq-ink)">Website</text>' +
        '</g>' +
      '</g>' +

      /* inbox node */
      '<rect class="pb-inbox-pulse" x="428" y="130" width="204" height="130" rx="20" ' +
        'fill="none" stroke="var(--chq-green-400)" stroke-width="2"/>' +
      '<rect x="436" y="138" width="188" height="114" rx="16" fill="var(--chq-green-800)" stroke="var(--chq-green-600)"/>' +
      '<rect x="442" y="144" width="176" height="50" rx="11" fill="#ffffff" opacity="0.05"/>' +
      '<g transform="translate(522,182)" fill="none" stroke="var(--chq-green-300)" stroke-width="2.6" stroke-linecap="round">' +
        '<path d="M0,0 C-1,-7 -4,-12 -8,-16"/>' +
        '<path d="M6,3 C6,-6 5,-14 3,-20"/>' +
        '<path d="M12,6 C13,-2 16,-8 20,-12"/>' +
      '</g>' +
      '<g font-family="var(--chq-font-sans)" text-anchor="middle">' +
        '<text x="530" y="214" font-size="18" font-weight="700" fill="#ffffff">PlowzBox</text>' +
        '<text x="530" y="234" font-size="11.5" fill="var(--chq-green-200)">one inbox · on your box</text>' +
      '</g>' +
    '</svg>';

  function initChannels(mount) {
    mount.classList.add('pb-mounted');
    injectSvg(mount, CHANNELS_SVG);
    mount.appendChild(el('p', 'pb-caption',
      'Text, email, phone, and website · one AI inbox, on the box you own.'));
  }

  /* ============================================================
     boot
     ============================================================ */
  function boot() {
    var m;
    if ((m = document.getElementById('pb-appliance'))) initAppliance(m);
    if ((m = document.getElementById('pb-sms-demo'))) initSms(m);
    if ((m = document.getElementById('pb-dashboard'))) initDashboard(m);
    if ((m = document.getElementById('pb-channels'))) initChannels(m);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
