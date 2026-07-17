/* ============================================================
   PlowzBox — Request-a-demo funnel logic (pages/demo.html)
   Vanilla JS, no libraries, no external resources.

   DELIVERY CHAIN (honest, in order):
   1. PRIMARY — POST the lead as JSON to a form backend
      (Formspree) which emails it to wills@plowz.com. This
      needs ONE owner setup step; see pages/DEMO-FUNNEL-SETUP.md.
      Until the endpoint below is configured, no network request
      is attempted at all (keeps the console clean and never
      sends data to a made-up URL).
   2. FALLBACK — if the endpoint is not configured, or the POST
      fails or times out, the funnel shows a prefilled
      mailto:wills@plowz.com carrying every answer, plus a
      copy-paste block. A lead is never lost.

   PRIVACY: no trackers, no cookies, no storage. The only place
   this data goes is the configured form backend (over HTTPS)
   or the visitor's own email app.
   ============================================================ */
(function () {
  'use strict';

  /* ------------------------------------------------------------
     OWNER SETUP — the one line to change.
     Create a free Formspree form that delivers to wills@plowz.com
     and paste its endpoint here, e.g.
       https://formspree.io/f/abcdwxyz
     Full instructions: pages/DEMO-FUNNEL-SETUP.md
     ------------------------------------------------------------ */
  var FORM_ENDPOINT = 'https://formspree.io/f/YOUR_FORM_ID'; // <-- paste real Formspree endpoint
  var FALLBACK_EMAIL = 'wills@plowz.com';
  var FETCH_TIMEOUT_MS = 8000;

  var form = document.getElementById('demo-funnel');
  if (!form) return;

  var steps = Array.prototype.slice.call(form.querySelectorAll('.df-step'));
  var TOTAL = steps.length; // question steps only (terminal screens live outside)
  var current = 0;
  var submitting = false;
  var submitted = false;

  var progressFill = document.getElementById('df-progress-fill');
  var progressCount = document.getElementById('df-progress-count');
  var progressLabel = document.getElementById('df-progress-label');
  var progressWrap = document.getElementById('df-progress');
  var liveRegion = document.getElementById('df-live');
  var cardBody = document.getElementById('df-body');
  var successScreen = document.getElementById('df-success');
  var fallbackScreen = document.getElementById('df-fallback');

  var STEP_LABELS = ['About you', 'Your operation', 'Your headache', 'How to reach you'];

  /* ---------- helpers ---------- */

  function announce(text) {
    if (liveRegion) liveRegion.textContent = text;
  }

  function endpointConfigured() {
    return FORM_ENDPOINT.indexOf('YOUR_FORM_ID') === -1 &&
           /^https:\/\//.test(FORM_ENDPOINT);
  }

  function field(name) {
    return form.elements[name];
  }

  function textValue(name) {
    var el = field(name);
    return el && typeof el.value === 'string' ? el.value.trim() : '';
  }

  function radioValue(name) {
    var group = form.querySelectorAll('input[name="' + name + '"]');
    for (var i = 0; i < group.length; i++) {
      if (group[i].checked) return group[i].value;
    }
    return '';
  }

  /* ---------- validation ---------- */

  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  function validPhone(v) {
    if (!/^[0-9()+\-.\s]+$/.test(v)) return false;
    var digits = v.replace(/\D/g, '');
    return digits.length >= 10 && digits.length <= 15;
  }

  var validators = {
    name: function (v) { return v.length >= 2 ? '' : 'Please tell us your name.'; },
    business: function (v) { return v.length >= 2 ? '' : 'Please tell us your business name.'; },
    crews: function (v) { return v ? '' : 'Pick the closest fit.'; },
    headache: function (v) { return v ? '' : 'Pick one, even if it is a coin toss.'; },
    phone: function (v) {
      if (!v) return 'Please add a phone number.';
      return validPhone(v) ? '' : 'That phone number does not look complete. Ten digits or more, numbers only is fine.';
    },
    email: function (v) {
      if (!v) return 'Please add an email address.';
      return EMAIL_RE.test(v) ? '' : 'That email address does not look right. Check for a typo?';
    },
    preferred: function (v) { return v ? '' : 'Pick how you would like us to reach out.'; }
  };

  var STEP_FIELDS = [
    ['name', 'business'],
    ['crews'],
    ['headache'],
    ['phone', 'email', 'preferred']
  ];

  function valueFor(name) {
    var el = field(name);
    if (el && el.length !== undefined && !el.tagName) return radioValue(name); // RadioNodeList
    var probe = form.querySelector('input[name="' + name + '"]');
    if (probe && probe.type === 'radio') return radioValue(name);
    return textValue(name);
  }

  function errorFor(name) {
    return validators[name] ? validators[name](valueFor(name)) : '';
  }

  function stepValid(idx) {
    var names = STEP_FIELDS[idx] || [];
    for (var i = 0; i < names.length; i++) {
      if (errorFor(names[i])) return false;
    }
    return true;
  }

  function showFieldError(name, message) {
    var errEl = document.getElementById('err-' + name);
    var input = form.querySelector('input[name="' + name + '"]');
    if (errEl) {
      errEl.textContent = message;
      errEl.classList.toggle('is-visible', !!message);
    }
    if (input && input.type !== 'radio') {
      input.setAttribute('aria-invalid', message ? 'true' : 'false');
    }
  }

  function clearFieldError(name) { showFieldError(name, ''); }

  function reportStepErrors(idx) {
    var names = STEP_FIELDS[idx] || [];
    var firstBad = null;
    names.forEach(function (name) {
      var msg = errorFor(name);
      showFieldError(name, msg);
      if (msg && !firstBad) firstBad = name;
    });
    if (firstBad) {
      var input = form.querySelector('input[name="' + firstBad + '"]');
      if (input) input.focus();
    }
  }

  function refreshNextState() {
    var step = steps[current];
    if (!step) return;
    var next = step.querySelector('.df-next');
    if (!next) return;
    var ok = stepValid(current);
    next.disabled = !ok;
    next.setAttribute('aria-disabled', ok ? 'false' : 'true');
  }

  /* ---------- step navigation ---------- */

  function showStep(idx, focusHeading) {
    current = idx;
    steps.forEach(function (s, i) {
      s.classList.toggle('is-active', i === idx);
    });
    var pct = ((idx + 1) / TOTAL) * 100;
    if (progressFill) progressFill.style.width = pct + '%';
    var track = progressWrap ? progressWrap.querySelector('[role="progressbar"]') : null;
    if (track) track.setAttribute('aria-valuenow', String(idx + 1));
    if (progressCount) progressCount.textContent = 'Step ' + (idx + 1) + ' of ' + TOTAL;
    if (progressLabel) progressLabel.textContent = STEP_LABELS[idx] || '';
    announce('Step ' + (idx + 1) + ' of ' + TOTAL + ': ' + (STEP_LABELS[idx] || ''));
    refreshNextState();
    if (focusHeading) {
      var h = steps[idx].querySelector('h2');
      if (h) h.focus();
    }
  }

  function goNext() {
    if (!stepValid(current)) { reportStepErrors(current); return; }
    if (current < TOTAL - 1) {
      showStep(current + 1, true);
    } else {
      submitLead();
    }
  }

  function goBack() {
    if (current > 0) showStep(current - 1, true);
  }

  /* ---------- payload + fallback body ---------- */

  function collectAnswers() {
    return {
      name: textValue('name'),
      business: textValue('business'),
      crews: radioValue('crews'),
      headache: radioValue('headache'),
      phone: textValue('phone'),
      email: textValue('email'),
      preferred: radioValue('preferred')
    };
  }

  function buildPayload(a) {
    return {
      name: a.name,
      business: a.business,
      crew_size: a.crews,
      biggest_headache: a.headache,
      phone: a.phone,
      email: a.email,
      preferred_contact: a.preferred,
      lead_source: 'plowzbox.com demo funnel',
      page: window.location.href,
      submitted_at: new Date().toISOString(),
      _subject: 'PlowzBox demo request: ' + a.business,
      _replyto: a.email
    };
  }

  function buildEmailBody(a) {
    return [
      'PlowzBox demo request',
      '',
      'Name: ' + a.name,
      'Business: ' + a.business,
      'Crew size: ' + a.crews,
      'Biggest headache: ' + a.headache,
      'Phone: ' + a.phone,
      'Email: ' + a.email,
      'Preferred contact: ' + a.preferred,
      '',
      'Source: plowzbox.com demo funnel (email fallback)',
      'Sent: ' + new Date().toString()
    ].join('\n');
  }

  function buildMailtoHref(a) {
    var subject = 'PlowzBox demo request: ' + a.business;
    return 'mailto:' + FALLBACK_EMAIL +
      '?subject=' + encodeURIComponent(subject) +
      '&body=' + encodeURIComponent(buildEmailBody(a));
  }

  /* ---------- terminal screens ----------
     All user data lands in the DOM via textContent / setAttribute
     only. Nothing user-typed is ever parsed as HTML. */

  function hideFunnel() {
    form.hidden = true;
    if (progressWrap) progressWrap.hidden = true;
  }

  function showSuccess(a) {
    hideFunnel();
    var nameSlot = document.getElementById('df-success-name');
    if (nameSlot) nameSlot.textContent = a.name ? 'Thanks, ' + a.name + '.' : 'Thanks.';
    fillRecap('df-success-recap', a);
    successScreen.hidden = false;
    var h = successScreen.querySelector('h2');
    if (h) h.focus();
    announce('Request received. We will reach out within one business day.');
  }

  function showFallback(a) {
    hideFunnel();
    var link = document.getElementById('df-mailto-link');
    if (link) link.setAttribute('href', buildMailtoHref(a));
    var pre = document.getElementById('df-copy-body');
    if (pre) pre.textContent = 'To: ' + FALLBACK_EMAIL + '\n\n' + buildEmailBody(a);
    fillRecap('df-fallback-recap', a);
    fallbackScreen.hidden = false;
    var h = fallbackScreen.querySelector('h2');
    if (h) h.focus();
    announce('One more tap needed. Use the send by email button to finish your request.');
  }

  function fillRecap(id, a) {
    var recap = document.getElementById(id);
    if (!recap) return;
    var rows = [
      ['Name', a.name], ['Business', a.business], ['Crews', a.crews],
      ['Headache', a.headache], ['Phone', a.phone], ['Email', a.email],
      ['Reach out by', a.preferred]
    ];
    var dl = document.createElement('dl');
    rows.forEach(function (row) {
      var dt = document.createElement('dt');
      dt.textContent = row[0];
      var dd = document.createElement('dd');
      dd.textContent = row[1]; // textContent: user input is never rendered as HTML
      dl.appendChild(dt);
      dl.appendChild(dd);
    });
    recap.textContent = '';
    recap.appendChild(dl);
  }

  /* ---------- submit ---------- */

  function setSending(btn, sending) {
    if (!btn) return;
    btn.disabled = sending;
    btn.setAttribute('aria-disabled', sending ? 'true' : 'false');
    var label = btn.querySelector('.df-next-label');
    var spin = btn.querySelector('.df-spinner');
    if (label) label.textContent = sending ? 'Sending' : 'Request my demo';
    if (spin) spin.hidden = !sending;
  }

  function submitLead() {
    if (submitting || submitted) return; // double-submit guard
    var a = collectAnswers();

    // Honeypot: bots that fill the hidden field get a quiet success
    // and nothing is sent anywhere.
    var pot = field('company_website');
    if (pot && pot.value) { submitted = true; showSuccess(a); return; }

    // No backend configured yet: skip the network entirely and go
    // straight to the email fallback. Honest, and console-clean.
    if (!endpointConfigured()) {
      submitted = true;
      showFallback(a);
      return;
    }

    submitting = true;
    var btn = steps[TOTAL - 1].querySelector('.df-next');
    setSending(btn, true);
    announce('Sending your request.');

    var controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
    var timer = controller ? setTimeout(function () { controller.abort(); }, FETCH_TIMEOUT_MS) : null;

    fetch(FORM_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(buildPayload(a)),
      signal: controller ? controller.signal : undefined
    }).then(function (res) {
      if (timer) clearTimeout(timer);
      submitting = false;
      if (res.ok) {
        submitted = true;
        showSuccess(a);
      } else {
        submitted = true;
        showFallback(a); // backend refused: hand the lead to email
      }
    }).catch(function () {
      if (timer) clearTimeout(timer);
      submitting = false;
      submitted = true;
      setSending(btn, false);
      showFallback(a); // network failed or timed out: never lose the lead
    });
  }

  /* ---------- copy-to-clipboard on the fallback screen ---------- */

  var copyBtn = document.getElementById('df-copy-btn');
  if (copyBtn) {
    copyBtn.addEventListener('click', function () {
      var pre = document.getElementById('df-copy-body');
      var text = pre ? pre.textContent : '';
      function done(ok) {
        copyBtn.textContent = ok ? 'Copied' : 'Copy failed, select the text above instead';
        setTimeout(function () { copyBtn.textContent = 'Copy my answers'; }, 2500);
      }
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(function () { done(true); }, function () { done(false); });
      } else {
        done(false);
      }
    });
  }

  /* ---------- wiring ---------- */

  form.addEventListener('submit', function (e) {
    e.preventDefault(); // Enter key or button: always route through goNext
    goNext();
  });

  form.addEventListener('click', function (e) {
    var t = e.target;
    if (t.closest && t.closest('.df-back')) {
      e.preventDefault();
      goBack();
    }
  });

  // Live validation: clear errors as the user types, enable/disable Continue.
  form.addEventListener('input', function (e) {
    var name = e.target && e.target.name;
    if (name && validators[name]) {
      // Only soften while typing; full message shows on blur/continue.
      if (!errorFor(name)) clearFieldError(name);
    }
    refreshNextState();
  });

  form.addEventListener('change', function (e) {
    var name = e.target && e.target.name;
    if (name && validators[name]) showFieldError(name, errorFor(name));
    refreshNextState();
  });

  // Momentum: clicking a chip on a single-question step advances after a
  // beat. Pointer clicks only (e.detail > 0): keyboard users arrowing
  // through the radios are never yanked to the next step mid-choice.
  form.addEventListener('click', function (e) {
    if (e.target && e.target.type === 'radio' && e.detail > 0 &&
        STEP_FIELDS[current].length === 1 && stepValid(current)) {
      var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      setTimeout(function () {
        if (stepValid(current) && !submitted && !submitting) goNext();
      }, reduce ? 0 : 260);
    }
  });

  form.addEventListener('focusout', function (e) {
    var name = e.target && e.target.name;
    if (name && validators[name] && e.target.type !== 'radio') {
      if (valueFor(name)) showFieldError(name, errorFor(name));
    }
  });

  showStep(0, false);
})();
