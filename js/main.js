/* ==========================================================================
   MONIKA K — portfolio interactions
   ========================================================================== */
(function () {
  'use strict';

  var cfg = window.SITE_CONFIG || {};
  var root = document.documentElement;
  var body = document.body;
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  var $ = function (sel, ctx) { return (ctx || document).querySelector(sel); };
  var $$ = function (sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); };
  var clamp = function (v, min, max) { return Math.min(max, Math.max(min, v)); };

  /* ---------- Config ---------- */
  function applyConfig() {
    $$('[data-config]').forEach(function (el) {
      var key = el.getAttribute('data-config');
      if (key === 'email' && cfg.email) {
        el.href = 'mailto:' + cfg.email;
        el.textContent = cfg.email;
      } else if (key === 'email-link' && cfg.email) {
        el.href = 'mailto:' + cfg.email;
      } else if (key === 'github' && cfg.github) {
        el.href = cfg.github;
      } else if (key === 'availability' && typeof cfg.availability === 'string') {
        el.textContent = cfg.availability;
      }
    });
    if (cfg.availability === '') {
      $$('[data-config-show="availability"]').forEach(function (el) { el.hidden = true; });
    }
    var year = $('#year');
    if (year) year.textContent = new Date().getFullYear();
  }

  /* ---------- Hero name split ---------- */
  function splitName() {
    $$('[data-split]').forEach(function (el) {
      var text = el.textContent;
      el.textContent = '';
      text.split('').forEach(function (ch, i) {
        var span = document.createElement('span');
        span.className = 'char';
        span.style.setProperty('--i', i);
        span.textContent = ch === ' ' ? ' ' : ch;
        el.appendChild(span);
      });
    });
  }

  /* ---------- Intro ---------- */
  function runIntro(done) {
    var intro = $('#intro');
    var count = $('#intro-count');
    var seen = false;
    try { seen = sessionStorage.getItem('intro-seen') === '1'; } catch (e) { }

    if (!intro || reduceMotion || seen) {
      if (intro) intro.classList.add('is-gone');
      done();
      return;
    }

    var start = performance.now();
    var duration = 900;
    function tick(now) {
      var t = clamp((now - start) / duration, 0, 1);
      var eased = 1 - Math.pow(1 - t, 3);
      count.textContent = Math.round(eased * 100);
      if (t < 1) return requestAnimationFrame(tick);
      intro.classList.add('is-done');
      try { sessionStorage.setItem('intro-seen', '1'); } catch (e) { }
      setTimeout(done, 250);
      setTimeout(function () { intro.classList.add('is-gone'); }, 1100);
    }
    requestAnimationFrame(tick);
  }

  /* ---------- Reveal on scroll ---------- */
  function initReveal() {
    var items = $$('.reveal');
    if (!('IntersectionObserver' in window) || reduceMotion) {
      items.forEach(function (el) { el.classList.add('is-in'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in');
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    items.forEach(function (el) { io.observe(el); });
  }

  /* ---------- Navigation ---------- */
  function initNav() {
    var nav = $('#nav');
    var toggle = $('#nav-toggle');
    var pill = $('#nav-pill');
    var links = $$('.nav__link');
    var progress = $('#nav-progress');
    var lastY = window.scrollY;
    var current = null;

    function setOpen(open) {
      nav.classList.toggle('is-open', open);
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
      body.classList.toggle('is-locked', open);
      if (open) nav.classList.remove('is-hidden');
    }

    toggle.addEventListener('click', function () {
      setOpen(!nav.classList.contains('is-open'));
    });
    $$('#nav-menu a').forEach(function (a) {
      a.addEventListener('click', function () { setOpen(false); });
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('is-open')) {
        setOpen(false);
        toggle.focus();
      }
    });

    function movePill(link) {
      if (!pill || !link || window.innerWidth <= 960) return;
      var list = link.parentElement.parentElement;
      var listLeft = list.getBoundingClientRect().left + list.clientLeft;
      var box = link.getBoundingClientRect();
      pill.style.width = box.width + 'px';
      pill.style.transform = 'translateX(' + (box.left - listLeft) + 'px)';
      pill.style.opacity = '1';
    }

    function setActive(id) {
      if (id === current) return;
      current = id;
      links.forEach(function (l) {
        var on = l.getAttribute('data-section') === id;
        l.classList.toggle('is-active', on);
        if (on) {
          l.setAttribute('aria-current', 'true');
          movePill(l);
        } else {
          l.removeAttribute('aria-current');
        }
      });
    }

    // Active section = the last section whose top has passed ~40% of the viewport
    var sections = $$('main [data-nav]');
    function onScroll() {
      var y = window.scrollY;
      var max = document.documentElement.scrollHeight - window.innerHeight;
      if (progress) progress.style.setProperty('--p', max > 0 ? (y / max).toFixed(4) : 0);

      nav.classList.toggle('is-scrolled', y > 20);
      if (!nav.classList.contains('is-open')) {
        nav.classList.toggle('is-hidden', y > lastY && y > 400);
      }
      lastY = y;

      var mark = window.innerHeight * 0.4;
      var active = 'home';
      for (var i = 0; i < sections.length; i++) {
        if (sections[i].getBoundingClientRect().top <= mark) active = sections[i].getAttribute('data-nav');
      }
      if (y >= max - 4) active = 'contact';
      setActive(active);
    }

    var ticking = false;
    window.addEventListener('scroll', function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () { onScroll(); ticking = false; });
    }, { passive: true });
    window.addEventListener('resize', function () {
      var activeLink = $('.nav__link.is-active');
      if (activeLink) movePill(activeLink);
      if (window.innerWidth > 960 && nav.classList.contains('is-open')) setOpen(false);
    });

    // Fonts change link widths — re-measure once they're in
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(function () {
        var activeLink = $('.nav__link.is-active');
        if (activeLink) movePill(activeLink);
      });
    }
    onScroll();
  }

  /* ---------- Custom cursor ---------- */
  function initCursor() {
    if (!finePointer || reduceMotion) return;
    var ring = $('#cursor');
    var dot = $('#cursor-dot');
    var label = $('#cursor-label');
    var mx = -100, my = -100, rx = -100, ry = -100;

    window.addEventListener('pointermove', function (e) {
      mx = e.clientX;
      my = e.clientY;
      dot.style.transform = 'translate(' + mx + 'px,' + my + 'px)';
      ring.classList.add('is-visible');
      dot.classList.add('is-visible');
    }, { passive: true });

    document.addEventListener('pointerleave', function () {
      ring.classList.remove('is-visible');
      dot.classList.remove('is-visible');
    });

    (function loop() {
      rx += (mx - rx) * 0.18;
      ry += (my - ry) * 0.18;
      ring.style.transform = 'translate(' + rx + 'px,' + ry + 'px)';
      requestAnimationFrame(loop);
    })();

    document.addEventListener('pointerover', function (e) {
      var labelled = e.target.closest('[data-cursor]');
      var interactive = e.target.closest('a, button, summary, label, input, textarea');
      if (labelled && !interactive) {
        label.textContent = labelled.getAttribute('data-cursor');
        ring.classList.add('is-label');
        ring.classList.remove('is-hover');
      } else if (interactive) {
        ring.classList.add('is-hover');
        ring.classList.remove('is-label');
      } else {
        ring.classList.remove('is-hover', 'is-label');
      }
    });
  }

  /* ---------- Magnetic buttons ---------- */
  function initMagnetic() {
    if (!finePointer || reduceMotion) return;
    $$('.magnetic').forEach(function (el) {
      el.addEventListener('pointermove', function (e) {
        var r = el.getBoundingClientRect();
        var x = (e.clientX - r.left - r.width / 2) * 0.25;
        var y = (e.clientY - r.top - r.height / 2) * 0.35;
        el.style.transform = 'translate(' + x + 'px,' + y + 'px)';
      });
      el.addEventListener('pointerleave', function () { el.style.transform = ''; });
    });
  }

  /* ---------- Spotlight glow follows the pointer ---------- */
  function initSpot() {
    if (!finePointer) return;
    document.addEventListener('pointermove', function (e) {
      var card = e.target.closest && e.target.closest('.spot, .spotlight');
      if (!card) return;
      var r = card.getBoundingClientRect();
      card.style.setProperty('--mx', (e.clientX - r.left) + 'px');
      card.style.setProperty('--my', (e.clientY - r.top) + 'px');
    }, { passive: true });
  }

  /* ---------- Hero phone showcase ---------- */
  var showcase = { next: null };
  function initShowcase() {
    var wrap = $('#showcase');
    if (!wrap) return;
    var phone = $('.phone', wrap);
    var screens = $$('.screen', wrap);
    var dots = $$('#showcase-dots i');
    var name = $('#showcase-name');
    var index = 0;
    var timer = null;

    function show(i) {
      var prev = screens[index];
      index = (i + screens.length) % screens.length;
      var next = screens[index];
      if (prev !== next) {
        prev.classList.remove('is-active');
        prev.classList.add('is-leaving');
        setTimeout(function () { prev.classList.remove('is-leaving'); }, 700);
      }
      next.classList.add('is-active');
      dots.forEach(function (d, j) { d.classList.toggle('on', j === index); });
      name.textContent = next.getAttribute('data-screen');
    }

    function start() {
      if (reduceMotion) return;
      stop();
      timer = setInterval(function () { show(index + 1); }, 3800);
    }
    function stop() { if (timer) clearInterval(timer); }

    showcase.next = function () { show(index + 1); start(); };

    phone.addEventListener('click', showcase.next);
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) stop(); else start();
    });
    start();

    // Subtle 3D tilt toward the pointer
    if (finePointer && !reduceMotion) {
      var hero = $('#home');
      hero.addEventListener('pointermove', function (e) {
        var r = phone.getBoundingClientRect();
        var dx = (e.clientX - (r.left + r.width / 2)) / window.innerWidth;
        var dy = (e.clientY - (r.top + r.height / 2)) / window.innerHeight;
        phone.style.setProperty('--ry', (dx * 18).toFixed(2) + 'deg');
        phone.style.setProperty('--rx', (-dy * 14).toFixed(2) + 'deg');
      });
      hero.addEventListener('pointerleave', function () {
        phone.style.setProperty('--ry', '0deg');
        phone.style.setProperty('--rx', '0deg');
      });
    }
  }

  /* ---------- Counters ---------- */
  function initCounters() {
    var els = $$('[data-count]');
    function run(el) {
      var target = parseInt(el.getAttribute('data-count'), 10);
      if (reduceMotion) { el.textContent = target; return; }
      var start = performance.now();
      var duration = 1400 + target * 4;
      (function tick(now) {
        var t = clamp((now - start) / duration, 0, 1);
        el.textContent = Math.round((1 - Math.pow(1 - t, 4)) * target);
        if (t < 1) requestAnimationFrame(tick);
      })(start);
    }
    if (!('IntersectionObserver' in window)) { els.forEach(run); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { run(entry.target); io.unobserve(entry.target); }
      });
    }, { threshold: 0.6 });
    els.forEach(function (el) { io.observe(el); });
  }

  /* ---------- Scroll-linked progress lines ---------- */
  function initProgressLines() {
    var timeline = $('#timeline');
    var tlFill = $('#timeline-fill');
    var steps = $('#steps');
    var stepItems = $$('.step', steps);
    var stepsFill = $('#steps-fill');
    var mobileQuery = window.matchMedia('(max-width: 960px)');

    function update() {
      var vh = window.innerHeight;
      if (timeline && tlFill) {
        var r = timeline.getBoundingClientRect();
        var p = clamp((vh * 0.6 - r.top) / r.height, 0, 1);
        tlFill.style.setProperty('--p', p.toFixed(3));
      }
      if (steps && stepsFill) {
        var s = steps.getBoundingClientRect();
        var sp;
        if (mobileQuery.matches) {
          sp = clamp((vh * 0.6 - s.top) / s.height, 0, 1);
        } else {
          sp = clamp((vh * 0.75 - s.top) / (vh * 0.45), 0, 1);
        }
        stepsFill.parentElement.style.setProperty('--p', sp.toFixed(3));
        stepItems.forEach(function (step, i) {
          step.classList.toggle('is-lit', sp >= i / (stepItems.length - 1) - 0.02);
        });
      }
    }

    var ticking = false;
    window.addEventListener('scroll', function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () { update(); ticking = false; });
    }, { passive: true });
    window.addEventListener('resize', update);
    update();
  }

  /* ---------- Experiments filter ---------- */
  function initLabFilter() {
    var buttons = $$('.lab-filter__btn');
    var items = $$('#lab .exp');
    buttons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var f = btn.getAttribute('data-filter');
        buttons.forEach(function (b) {
          var on = b === btn;
          b.classList.toggle('is-active', on);
          b.setAttribute('aria-pressed', String(on));
        });
        items.forEach(function (it) {
          it.classList.toggle('is-dimmed', f !== 'all' && it.getAttribute('data-group') !== f);
        });
      });
    });
  }

  /* ---------- Code editor: highlighting + tabs ---------- */
  var DART = /(\/\/[^\n]*)|('(?:[^'\\\n]|\\.)*')|(@\w+)|\b(class|extends|final|const|return|async|await|try|on|catch|switch|super|this|enum|void|null|true|false|if|else)\b|\b([A-Z]\w*)\b|\b(\d+)\b/g;

  function escapeHtml(s) {
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  function highlight(src) {
    var out = '';
    var last = 0;
    src.replace(DART, function (m, com, str, ann, kw, type, num, offset) {
      out += escapeHtml(src.slice(last, offset));
      var cls = com ? 't-c' : str ? 't-s' : ann ? 't-a' : kw ? 't-k' : type ? 't-t' : 't-n';
      out += '<span class="' + cls + '">' + escapeHtml(m) + '</span>';
      last = offset + m.length;
      return m;
    });
    out += escapeHtml(src.slice(last));
    return out.split('\n').map(function (line, i) {
      return '<span class="ln" style="--n:' + i + '">' + (line || ' ') + '</span>';
    }).join('');
  }

  function initEditor() {
    var panes = $$('.code');
    panes.forEach(function (pre) {
      var code = $('code', pre);
      code.innerHTML = highlight(code.textContent);
    });

    var tabs = $$('.editor__tab');
    function select(i, focus) {
      tabs.forEach(function (t, j) {
        var on = i === j;
        t.classList.toggle('is-active', on);
        t.setAttribute('aria-selected', String(on));
        t.tabIndex = on ? 0 : -1;
        if (on && focus) t.focus();
      });
      panes.forEach(function (p, j) {
        var on = i === j;
        p.hidden = !on;
        p.classList.toggle('is-active', on);
      });
    }
    tabs.forEach(function (tab, i) {
      tab.tabIndex = i === 0 ? 0 : -1;
      tab.addEventListener('click', function () { select(i); });
      tab.addEventListener('keydown', function (e) {
        if (e.key === 'ArrowRight') select((i + 1) % tabs.length, true);
        if (e.key === 'ArrowLeft') select((i - 1 + tabs.length) % tabs.length, true);
      });
    });
  }

  /* ---------- Case notes modal ---------- */
  function initModal() {
    var modal = $('#modal');
    var panel = $('.modal__panel', modal);
    var content = $('#modal-content');
    var lastFocus = null;

    function open(id) {
      var tpl = document.getElementById('case-' + id);
      if (!tpl) return;
      lastFocus = document.activeElement;
      content.innerHTML = '';
      content.appendChild(tpl.content.cloneNode(true));
      modal.hidden = false;
      modal.classList.remove('is-closing');
      body.classList.add('is-locked');
      panel.scrollTop = 0;
      panel.focus();
    }

    function close() {
      if (modal.hidden) return;
      modal.classList.add('is-closing');
      setTimeout(function () {
        modal.hidden = true;
        modal.classList.remove('is-closing');
        body.classList.remove('is-locked');
        if (lastFocus) lastFocus.focus();
      }, reduceMotion ? 0 : 280);
    }

    document.addEventListener('click', function (e) {
      var btn = e.target.closest('[data-open-case]');
      if (btn) { open(btn.getAttribute('data-open-case')); return; }
      if (e.target.closest('a, button')) return;
      var card = e.target.closest('[data-case]');
      if (card) open(card.getAttribute('data-case'));
    });

    $$('[data-close]', modal).forEach(function (el) { el.addEventListener('click', close); });

    document.addEventListener('keydown', function (e) {
      if (modal.hidden) return;
      if (e.key === 'Escape') { close(); return; }
      if (e.key !== 'Tab') return;
      var focusables = $$('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])', panel);
      if (!focusables.length) return;
      var first = focusables[0];
      var last = focusables[focusables.length - 1];
      if (e.shiftKey && (document.activeElement === first || document.activeElement === panel)) {
        e.preventDefault(); last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault(); first.focus();
      }
    });
  }

  /* ---------- Toast ---------- */
  var toastTimer = null;
  function toast(html) {
    var el = $('#toast');
    if (!el) return;
    el.innerHTML = html;
    el.classList.add('is-visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { el.classList.remove('is-visible'); }, 2600);
  }

  /* ---------- Copy email ---------- */
  function initCopy() {
    var btn = $('#copy-email');
    if (!btn) return;
    btn.addEventListener('click', function () {
      var email = cfg.email || $('.email-card__addr').textContent.trim();
      function done() {
        btn.classList.add('is-copied');
        btn.setAttribute('aria-label', 'Email address copied');
        toast('Email copied to clipboard');
        setTimeout(function () {
          btn.classList.remove('is-copied');
          btn.setAttribute('aria-label', 'Copy email address');
        }, 2000);
      }
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(email).then(done, function () { fallbackCopy(email); done(); });
      } else {
        fallbackCopy(email);
        done();
      }
    });
  }

  function fallbackCopy(text) {
    var ta = document.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly', '');
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    body.appendChild(ta);
    ta.select();
    try { document.execCommand('copy'); } catch (e) { }
    body.removeChild(ta);
  }

  /* ---------- Contact form → mail app ---------- */
  function initForm() {
    var form = $('#contact-form');
    if (!form) return;
    var status = $('#form-status');

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var nameEl = $('#cf-name');
      var emailEl = $('#cf-email');
      var messageEl = $('#cf-message');
      var name = nameEl.value.trim();
      var email = emailEl.value.trim();
      var message = messageEl.value.trim();
      var topicEl = form.querySelector('input[name="topic"]:checked');
      var topic = topicEl ? topicEl.value : 'Hello';

      var fields = [
        [nameEl, !!name],
        [emailEl, /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)],
        [messageEl, !!message],
      ];
      var firstBad = null;
      fields.forEach(function (f) {
        f[0].parentElement.classList.toggle('is-invalid', !f[1]);
        f[0].setAttribute('aria-invalid', String(!f[1]));
        if (!f[1] && !firstBad) firstBad = f[0];
      });
      if (firstBad) {
        status.textContent = 'Please add your name, a valid email and a short message.';
        status.classList.add('is-error');
        firstBad.focus();
        return;
      }

      status.classList.remove('is-error');
      var to = cfg.email || '';
      var subject = topic + ' — from ' + name;
      var bodyText = message + '\n\n— ' + name + ' (' + email + ')';
      window.location.href = 'mailto:' + to + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(bodyText);
      status.textContent = 'Opening your email app…';
    });

    $$('input, textarea', form).forEach(function (el) {
      el.addEventListener('input', function () { el.parentElement.classList.remove('is-invalid'); });
    });
  }

  /* ---------- Hot reload easter egg (press R) ---------- */
  function initHotReload() {
    document.addEventListener('keydown', function (e) {
      if (e.key !== 'r' && e.key !== 'R') return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      var tag = (e.target.tagName || '').toLowerCase();
      if (tag === 'input' || tag === 'textarea' || e.target.isContentEditable) return;
      if (!$('#modal').hidden) return;

      var t0 = performance.now();
      var phone = $('.phone');
      if (phone) {
        phone.classList.add('is-reloading');
        setTimeout(function () { phone.classList.remove('is-reloading'); }, 60);
      }
      if (showcase.next) showcase.next();

      // Replay the hero name: snap letters back without a transition, then animate in again
      body.classList.add('no-trans');
      body.classList.remove('is-ready');
      void body.offsetWidth;
      body.classList.remove('no-trans');
      requestAnimationFrame(function () {
        body.classList.add('is-ready');
        var ms = Math.max(1, Math.round(performance.now() - t0 + 180 + Math.random() * 120));
        toast('<svg class="icon"><use href="#i-zap"/></svg>Reloaded 1 of 1 libraries in ' + ms + 'ms.');
      });
    });
  }

  /* ---------- Boot ---------- */
  applyConfig();
  splitName();
  initNav();
  initCursor();
  initMagnetic();
  initSpot();
  initShowcase();
  initCounters();
  initProgressLines();
  initLabFilter();
  initEditor();
  initModal();
  initCopy();
  initForm();
  initHotReload();

  runIntro(function () {
    body.classList.add('is-ready');
    initReveal();
  });
})();
