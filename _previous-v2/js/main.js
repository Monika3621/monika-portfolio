/* ==========================================================================
   MONIKA.K — Developer Profile
   Renders content from js/data.js and wires up interactions.
   ========================================================================== */
(function () {
  'use strict';

  var DATA = window.PORTFOLIO;
  var doc = document;
  var root = doc.documentElement;
  var $ = function (sel, ctx) { return (ctx || doc).querySelector(sel); };
  var $$ = function (sel, ctx) { return Array.prototype.slice.call((ctx || doc).querySelectorAll(sel)); };

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  var mobileMq = window.matchMedia('(max-width: 900px)');

  /* ---------- Helpers ---------- */
  function esc(str) {
    return String(str).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function pad(n) { return String(n).padStart(2, '0'); }

  var ICONS = {
    check: '<path d="M20 6 9 17l-5-5"/>',
    arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    external: '<path d="M15 3h6v6M10 14 21 3M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>',
    flutter: '<path d="M14 2 4 12l3 3L17 2zM14 11l-6 6 5 5h6l-5-5 6-6z"/>',
    api: '<path d="M12 22v-5M9 8V2M15 8V2M18 8v5a4 4 0 0 1-4 4h-4a4 4 0 0 1-4-4V8Z"/>',
    flame: '<path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.07-2.14-.22-4.05 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.15.43-2.29 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>',
    layers: '<path d="m12 2 10 5-10 5L2 7zM2 17l10 5 10-5M2 12l10 5 10-5"/>',
    map: '<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>',
    cube: '<path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16zM3.3 7 12 12l8.7-5M12 22V12"/>',
    code: '<path d="m16 18 6-6-6-6M8 6l-6 6 6 6"/>',
    branch: '<path d="M6 3v12M18 9a9 9 0 0 1-9 9"/><circle cx="18" cy="6" r="3"/><circle cx="6" cy="18" r="3"/>',
  };

  function icon(name) {
    return '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true">' + (ICONS[name] || '') + '</svg>';
  }

  var LEVELS = { 3: 'Primary', 2: 'Working knowledge', 1: 'Familiar' };

  function initials(name) {
    var caps = name.replace(/[^A-Za-z]/g, ' ').match(/[A-Z]/g) || [name[0]];
    return caps.slice(0, 2).join('');
  }

  function phone(p) {
    return (
      '<div class="phone" style="--h:' + p.hue + '" aria-hidden="true"><div class="phone__screen">' +
      '<div class="phone__app"><span class="phone__logo">' + esc(initials(p.name)) + '</span>' +
      '<span class="phone__title">' + esc(p.name) + '</span></div>' +
      '<div class="phone__hero"></div>' +
      '<div class="phone__row"><i></i><span></span></div>' +
      '<div class="phone__row"><i></i><span></span></div>' +
      '<div class="phone__row"><i></i><span></span></div>' +
      '<div class="phone__tabs"><i></i><i></i><i></i><i></i></div>' +
      '</div></div>'
    );
  }

  function techList(items) {
    return '<ul class="tech">' + items.map(function (t) { return '<li>' + esc(t) + '</li>'; }).join('') + '</ul>';
  }

  /* ==========================================================================
     RENDER
     ========================================================================== */
  function renderProfileLinks() {
    var p = DATA.profile;
    $$('[data-link="linkedin"]').forEach(function (a) { a.href = p.linkedin; });
    $$('[data-link="github"]').forEach(function (a) { a.href = p.github; });
    $$('[data-link="email"]').forEach(function (a) { a.href = 'mailto:' + p.email; });

    if (p.avatar) {
      var init = $('.avatar__initials');
      var img = doc.createElement('img');
      img.src = p.avatar;
      img.alt = p.name;
      img.width = 60;
      img.height = 60;
      init.replaceWith(img);
    }
  }

  function renderTimeline() {
    $('#timeline').innerHTML = DATA.career.map(function (c) {
      return (
        '<li class="tl' + (c.current ? ' is-current' : '') + '" tabindex="0">' +
        '<span class="tl__node" aria-hidden="true"></span>' +
        '<div class="tl__side"><span>LEVEL</span><strong>' + esc(c.level) + '</strong></div>' +
        '<article class="tl__card">' +
        '<div class="tl__meta"><span>' + esc(c.period) + '</span>' +
        '<span class="tl__badge">' + (c.current ? '● CURRENT' : 'COMPLETED') + '</span></div>' +
        '<h3 class="tl__title">' + esc(c.title) + '</h3>' +
        '<p class="tl__company">' + esc(c.company) + '</p>' +
        '<p class="tl__desc">' + esc(c.description) + '</p>' +
        '<div class="tl__tags"><ul>' + c.tags.map(function (t, i) {
          return '<li class="chip" style="--i:' + i + '">' + esc(t) + '</li>';
        }).join('') + '</ul></div>' +
        '<p class="tl__hint">HOVER TO VIEW LOADOUT</p>' +
        '</article></li>'
      );
    }).join('');
  }

  function renderLoadout() {
    $('#loadout').innerHTML = DATA.skills.map(function (s) {
      return (
        '<section class="slot slot--' + s.size + ' reveal" aria-label="' + esc(s.category) + '">' +
        '<header class="slot__head"><div>' +
        '<p class="slot__id">SLOT ' + esc(s.slot) + '</p>' +
        '<h3 class="slot__title">' + esc(s.category) + '</h3></div>' +
        '<span class="slot__count">' + pad(s.items.length) + ' ITEMS</span></header>' +
        '<ul class="slot__items">' + s.items.map(function (it, i) {
          return (
            '<li class="skill" data-level="' + it.level + '" style="--i:' + i + '">' +
            '<span class="skill__name">' + esc(it.name) + '</span>' +
            '<span class="skill__lvl"><span class="pips" data-level="' + it.level + '"><i></i><i></i><i></i></span>' +
            '<small>' + LEVELS[it.level] + '</small></span></li>'
          );
        }).join('') + '</ul></section>'
      );
    }).join('');
  }

  function renderMissions() {
    var total = pad(DATA.projects.length);
    $('#mission-list').innerHTML = DATA.projects.map(function (p, i) {
      var no = pad(i + 1);
      return (
        '<div class="mission" role="listitem" data-index="' + i + '" style="--i:' + i + ';--h:' + p.hue + '">' +
        '<button class="mission__select" type="button" data-open="' + i + '" aria-label="Mission ' + no + ': ' + esc(p.name) + ' — view details">' +
        '<span class="mission__no">M-' + no + ' / ' + total + '</span>' +
        '<span><span class="mission__name">' + esc(p.name) + '</span>' +
        '<span class="mission__cat">' + esc(p.category) + '</span></span>' +
        '<span class="mission__arrow">' + icon('arrow') + '</span>' +
        '</button>' +
        '<div class="mission__extra">' +
        '<div class="mission__thumb">' + phone(p) + '</div>' +
        '<p class="mission__desc">' + esc(p.description) + '</p>' +
        techList(p.tech) +
        '<div class="mission__actions">' +
        '<button class="btn btn--primary btn--sm" type="button" data-open="' + i + '"><span>View Details</span>' + icon('arrow') + '</button>' +
        (p.link ? '<a class="link-arrow" href="' + esc(p.link.url) + '" target="_blank" rel="noopener">' + esc(p.link.label) + ' →</a>' : '') +
        '</div></div></div>'
      );
    }).join('');
  }

  var activeMission = -1;

  function renderBrief(i) {
    if (i === activeMission) return;
    activeMission = i;
    var p = DATA.projects[i];
    var no = pad(i + 1);

    $$('.mission').forEach(function (m) { m.classList.toggle('is-active', +m.dataset.index === i); });

    $('#mission-brief').innerHTML =
      '<article class="brief tilt brief--swap" data-no="' + no + '">' +
      phone(p) +
      '<div class="brief__body">' +
      '<div class="brief__top"><span>MISSION <b>' + no + '</b> / ' + pad(DATA.projects.length) + '</span><span>BRIEFING</span></div>' +
      '<h3 class="brief__name">' + esc(p.name) + '</h3>' +
      '<p class="brief__cat"><span class="chip">' + esc(p.category) + '</span></p>' +
      '<p class="brief__desc">' + esc(p.description) + '</p>' +
      techList(p.tech) +
      '<div class="brief__actions">' +
      '<button class="btn btn--primary btn--sm magnetic" type="button" data-open="' + i + '"><span>View Details</span>' + icon('arrow') + '</button>' +
      (p.link ? '<a class="link-arrow" href="' + esc(p.link.url) + '" target="_blank" rel="noopener">' + esc(p.link.label) + ' →</a>' : '') +
      '</div></div></article>';

    bindMagnetic($('#mission-brief'));
  }

  function renderExploring() {
    $('#exploring').innerHTML = DATA.exploring.map(function (e, i) {
      return '<li style="--i:' + i + '"><span>' + esc(e) + '</span><small>' + pad(i + 1) + '</small></li>';
    }).join('');
  }

  function renderBadges() {
    $('#badges').innerHTML = DATA.achievements.map(function (a, i) {
      var id = 'tip-' + i;
      return (
        '<li class="badge" style="--i:' + i + '">' +
        '<button class="badge__btn" type="button" aria-describedby="' + id + '">' +
        '<span class="badge__icon">' + icon(a.icon) + '</span>' +
        '<span class="badge__text"><span class="badge__check">✓ UNLOCKED</span>' +
        '<span class="badge__title">' + esc(a.title) + '</span></span>' +
        '</button>' +
        '<span class="badge__tip" role="tooltip" id="' + id + '">' + esc(a.tip) + '</span>' +
        '</li>'
      );
    }).join('');
  }

  function renderQuest() {
    var done = DATA.quest.filter(function (q) { return q.done; }).length;
    var active = DATA.quest.length - done;

    $('#quest-meta').innerHTML =
      '<span class="is-done">■ <b>' + pad(done) + '</b> COMPLETE</span>' +
      '<span class="is-active">■ <b>' + pad(active) + '</b> IN PROGRESS</span>';

    $('#objectives').innerHTML = DATA.quest.map(function (q, i) {
      return (
        '<li class="obj ' + (q.done ? 'is-done' : 'is-active') + '" style="--i:' + i + '">' +
        '<span class="obj__box" aria-hidden="true">' + (q.done ? icon('check') : '') + '</span>' +
        '<span class="obj__text">' + esc(q.text) + '</span>' +
        '<span class="obj__tag">' + (q.done ? 'COMPLETE' : 'IN PROGRESS') + '</span>' +
        '</li>'
      );
    }).join('');
  }

  /* ==========================================================================
     BOOT (page-in transition)
     ========================================================================== */
  function boot(done) {
    var el = $('#boot');
    var seen = false;
    try { seen = sessionStorage.getItem('booted') === '1'; sessionStorage.setItem('booted', '1'); } catch (e) { }

    var delay = reduceMotion ? 0 : seen ? 150 : 800;
    setTimeout(function () {
      el.classList.add('is-done');
      done();
      setTimeout(function () { el.remove(); }, 700);
    }, delay);
  }

  /* ==========================================================================
     THEME
     ========================================================================== */
  function initTheme() {
    var btn = $('#theme-toggle');
    function sync() {
      var light = root.getAttribute('data-theme') === 'light';
      btn.setAttribute('aria-label', light ? 'Switch to dark mode' : 'Switch to light mode');
      $('meta[name="theme-color"]').setAttribute('content', light ? '#f3f5fc' : '#05060d');
    }
    sync();
    btn.addEventListener('click', function () {
      var next = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
      root.classList.add('theme-anim');
      root.setAttribute('data-theme', next);
      try { localStorage.setItem('theme', next); } catch (e) { }
      sync();
      setTimeout(function () { root.classList.remove('theme-anim'); }, 550);
    });
  }

  /* ==========================================================================
     NAVIGATION
     ========================================================================== */
  function initNav() {
    var nav = $('#nav');
    var toggle = $('#nav-toggle');
    var indicator = $('#nav-indicator');
    var links = $$('.nav__link');

    function setMenu(open) {
      nav.classList.toggle('is-open', open);
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
      doc.body.classList.toggle('is-locked', open);
    }

    toggle.addEventListener('click', function () { setMenu(!nav.classList.contains('is-open')); });
    links.forEach(function (l) { l.addEventListener('click', function () { setMenu(false); }); });
    doc.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('is-open')) { setMenu(false); toggle.focus(); }
    });
    mobileMq.addEventListener('change', function (e) { if (!e.matches) setMenu(false); });

    function moveIndicator(link) {
      if (!link || mobileMq.matches) { indicator.style.opacity = 0; return; }
      indicator.style.opacity = 1;
      indicator.style.width = (link.offsetWidth - 24) + 'px';
      indicator.style.transform = 'translateX(' + (link.offsetLeft + 12) + 'px)';
    }

    function setActive(id) {
      var current = null;
      links.forEach(function (l) {
        var on = l.dataset.section === id;
        l.classList.toggle('is-active', on);
        if (on) { current = l; l.setAttribute('aria-current', 'true'); } else l.removeAttribute('aria-current');
      });
      moveIndicator(current);
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) setActive(en.target.dataset.nav); });
    }, { rootMargin: '-45% 0px -50% 0px' });
    $$('[data-nav]').forEach(function (s) { io.observe(s); });

    window.addEventListener('resize', function () { moveIndicator($('.nav__link.is-active')); });
    if (doc.fonts && doc.fonts.ready) doc.fonts.ready.then(function () { moveIndicator($('.nav__link.is-active')); });
  }

  /* ==========================================================================
     SCROLL-DRIVEN (nav state, progress bar, timeline fill)
     ========================================================================== */
  function initScroll() {
    var nav = $('#nav');
    var progress = $('#nav-progress');
    var wrap = $('#timeline-wrap');
    var fill = $('#timeline-fill');
    var ticking = false;

    function update() {
      ticking = false;
      var y = window.scrollY;
      var vh = window.innerHeight;
      var max = doc.documentElement.scrollHeight - vh;
      nav.classList.toggle('is-scrolled', y > 12);
      progress.style.transform = 'scaleX(' + (max > 0 ? y / max : 0) + ')';

      var r = wrap.getBoundingClientRect();
      var p = Math.min(1, Math.max(0, (vh * 0.65 - r.top) / r.height));
      fill.style.transform = 'scaleY(' + p + ')';
    }

    window.addEventListener('scroll', function () {
      if (!ticking) { ticking = true; requestAnimationFrame(update); }
    }, { passive: true });
    window.addEventListener('resize', update);
    update();
  }

  /* ==========================================================================
     REVEAL + COUNTERS
     ========================================================================== */
  function countUp(el) {
    var target = +el.dataset.count;
    var width = +el.dataset.pad || 1;
    if (reduceMotion) { el.textContent = String(target).padStart(width, '0'); return; }
    var start = null;
    var dur = 1400;
    function step(t) {
      if (!start) start = t;
      var k = Math.min(1, (t - start) / dur);
      var eased = 1 - Math.pow(1 - k, 3);
      el.textContent = String(Math.round(eased * target)).padStart(width, '0');
      if (k < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  function scramble(el) {
    var final = el.dataset.scramble;
    if (reduceMotion) return;
    var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#<>/';
    var frame = 0;
    var total = 22;
    (function tick() {
      var out = '';
      for (var i = 0; i < final.length; i++) {
        var revealAt = (i / final.length) * total;
        out += frame >= revealAt + 6 || final[i] === '.' ? final[i] : chars[(Math.random() * chars.length) | 0];
      }
      el.textContent = out;
      frame++;
      if (frame < total + 8) setTimeout(tick, 40);
      else el.textContent = final;
    })();
  }

  function initReveal() {
    var targets = $$('.reveal, .board__log, .badges, .objectives');

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        var el = en.target;
        el.classList.add('is-in');
        io.unobserve(el);

        $$('[data-count]', el).forEach(countUp);
        $$('[data-scramble]', el).forEach(scramble);

        // Drop the stagger delays once the entrance has played
        if (el.classList.contains('slot') || el.classList.contains('board__log')) {
          setTimeout(function () { el.classList.add('is-settled'); }, 1200);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

    targets.forEach(function (t) { io.observe(t); });
  }

  /* ==========================================================================
     CAREER TIMELINE interactions
     ========================================================================== */
  function initTimeline() {
    var wrap = $('#timeline-wrap');
    $$('.tl', wrap).forEach(function (item) {
      item.addEventListener('mouseenter', function () { wrap.classList.add('has-hover'); });
      item.addEventListener('mouseleave', function () { wrap.classList.remove('has-hover'); });
    });

    // Touch devices: open every card's loadout once it scrolls into view
    if (!finePointer) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) { en.target.classList.add('is-open'); io.unobserve(en.target); }
        });
      }, { threshold: 0.5 });
      $$('.tl', wrap).forEach(function (t) { io.observe(t); });
    }
  }

  /* ==========================================================================
     SKILL LOADOUT interactions
     ========================================================================== */
  function initLoadout() {
    var loadout = $('#loadout');
    var buttons = $$('.legend__item');

    buttons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var on = btn.getAttribute('aria-pressed') !== 'true';
        buttons.forEach(function (b) { b.setAttribute('aria-pressed', 'false'); });
        btn.setAttribute('aria-pressed', String(on));
        loadout.classList.toggle('is-filtering', on);
        $$('.skill', loadout).forEach(function (s) {
          s.classList.toggle('is-match', on && s.dataset.level === btn.dataset.level);
        });
      });
    });

    if (finePointer) {
      $$('.slot', loadout).forEach(function (slot) {
        slot.addEventListener('pointermove', function (e) {
          var r = slot.getBoundingClientRect();
          slot.style.setProperty('--mx', e.clientX - r.left + 'px');
          slot.style.setProperty('--my', e.clientY - r.top + 'px');
        });
      });
    }
  }

  /* ==========================================================================
     PROJECT MISSIONS + DETAIL PANEL
     ========================================================================== */
  var modal, modalContent, modalCrumb, lastFocus, closeTimer;

  function renderDetail(i) {
    var p = DATA.projects[i];
    var no = pad(i + 1);
    var total = pad(DATA.projects.length);
    var next = (i + 1) % DATA.projects.length;

    modalCrumb.textContent = 'MISSIONS / ' + no + ' / ' + p.name.toUpperCase();
    modalContent.innerHTML =
      '<div class="detail">' +
      '<div class="detail__main">' +
      '<p class="detail__no">MISSION ' + no + ' / ' + total + '</p>' +
      '<h2 class="detail__name" id="modal-title">' + esc(p.name) + '</h2>' +
      '<dl class="detail__meta">' +
      '<div><dt>Category</dt><dd>' + esc(p.category) + '</dd></div>' +
      '<div><dt>Role</dt><dd>' + esc(p.role) + '</dd></div>' +
      '<div><dt>Platform</dt><dd>Flutter mobile app</dd></div>' +
      '</dl>' +
      '<h3 class="detail__h">Description</h3>' +
      '<div class="detail__desc"><p>' + esc(p.description) + '</p>' +
      (p.details ? '<p>' + esc(p.details) + '</p>' : '') + '</div>' +
      '<h3 class="detail__h">Key features</h3>' +
      '<ul class="features">' + p.features.map(function (f) {
        return '<li>' + icon('check') + '<span>' + esc(f) + '</span></li>';
      }).join('') + '</ul>' +
      '<h3 class="detail__h">Tech stack</h3>' + techList(p.tech) +
      '<div class="detail__cta">' +
      (p.link ? '<a class="btn btn--primary magnetic" href="' + esc(p.link.url) + '" target="_blank" rel="noopener"><span>' + esc(p.link.label) + ' →</span></a>' : '') +
      '<button class="btn btn--ghost magnetic" type="button" data-next="' + next + '"><span>Next mission: ' + esc(DATA.projects[next].name) + '</span>' + icon('arrow') + '</button>' +
      '</div>' +
      '</div>' +
      '<aside class="detail__aside">' + phone(p) + '</aside>' +
      '</div>';

    bindMagnetic(modalContent);
  }

  function openModal(i, trigger) {
    clearTimeout(closeTimer);
    lastFocus = trigger || doc.activeElement;
    renderDetail(i);
    modal.hidden = false;
    doc.body.classList.add('is-locked');
    $('.modal__panel', modal).scrollTop = 0;
    // next frame so the transition runs
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        modal.classList.add('is-open');
        $('.modal__panel', modal).focus({ preventScroll: true });
      });
    });
  }

  function closeModal() {
    if (modal.hidden) return;
    modal.classList.remove('is-open');
    doc.body.classList.remove('is-locked');
    closeTimer = setTimeout(function () { modal.hidden = true; }, reduceMotion ? 0 : 650);
    if (lastFocus && lastFocus.focus) lastFocus.focus({ preventScroll: true });
  }

  function initMissions() {
    modal = $('#modal');
    modalContent = $('#modal-content');
    modalCrumb = $('#modal-crumb');

    renderBrief(0);

    var list = $('#mission-list');
    // Preview on hover/focus (desktop board)
    list.addEventListener('mouseover', function (e) {
      var m = e.target.closest('.mission');
      if (m && !mobileMq.matches) renderBrief(+m.dataset.index);
    });
    list.addEventListener('focusin', function (e) {
      var m = e.target.closest('.mission');
      if (m && !mobileMq.matches) renderBrief(+m.dataset.index);
    });

    // Open detail panel
    doc.addEventListener('click', function (e) {
      var opener = e.target.closest('[data-open]');
      if (opener) { openModal(+opener.dataset.open, opener); return; }

      var next = e.target.closest('[data-next]');
      if (next) {
        var panel = $('.modal__panel', modal);
        renderDetail(+next.dataset.next);
        panel.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
        return;
      }

      if (e.target.closest('[data-close]')) closeModal();
    });

    doc.addEventListener('keydown', function (e) {
      if (modal.hidden) return;
      if (e.key === 'Escape') { closeModal(); return; }
      if (e.key === 'Tab') {
        var f = $$('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])', modal)
          .filter(function (el) { return el.offsetParent !== null; });
        if (!f.length) return;
        var first = f[0], last = f[f.length - 1];
        if (e.shiftKey && (doc.activeElement === first || doc.activeElement === $('.modal__panel', modal))) {
          e.preventDefault(); last.focus();
        } else if (!e.shiftKey && doc.activeElement === last) {
          e.preventDefault(); first.focus();
        }
      }
    });
  }

  /* ==========================================================================
     ACHIEVEMENTS (tap to toggle tooltip on touch)
     ========================================================================== */
  function initBadges() {
    var badges = $$('.badge');
    badges.forEach(function (b) {
      $('.badge__btn', b).addEventListener('click', function () {
        var open = !b.classList.contains('is-open');
        badges.forEach(function (x) { x.classList.remove('is-open'); });
        b.classList.toggle('is-open', open);
      });
    });
    doc.addEventListener('click', function (e) {
      if (!e.target.closest('.badge')) badges.forEach(function (x) { x.classList.remove('is-open'); });
    });
  }

  /* ==========================================================================
     BEYOND MOBILE — responsive preview toggle
     ========================================================================== */
  function initBrowser() {
    var mini = $('#mini');
    var btns = $$('.browser__toggle button');
    btns.forEach(function (b) {
      b.addEventListener('click', function () {
        btns.forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); });
        mini.dataset.view = b.dataset.view;
      });
    });
  }

  /* ==========================================================================
     CONTACT FORM — composes an email in the visitor's mail app
     ========================================================================== */
  function initForm() {
    var form = $('#contact-form');
    var status = $('#form-status');

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var fields = {
        name: form.elements.name,
        email: form.elements.email,
        message: form.elements.message,
      };
      var ok = true;
      Object.keys(fields).forEach(function (k) {
        var el = fields[k];
        var valid = el.value.trim() !== '' && (k !== 'email' || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(el.value.trim()));
        el.closest('.field').classList.toggle('is-invalid', !valid);
        el.setAttribute('aria-invalid', String(!valid));
        if (!valid) ok = false;
      });

      if (!ok) {
        status.className = 'cform__status mono is-err';
        status.textContent = '! Please fill in every field with a valid email.';
        var bad = $('.is-invalid input, .is-invalid textarea', form);
        if (bad) bad.focus();
        return;
      }

      var name = fields.name.value.trim();
      var subject = 'Project enquiry from ' + name;
      var body = fields.message.value.trim() + '\n\n— ' + name + ' (' + fields.email.value.trim() + ')';
      window.location.href = 'mailto:' + DATA.profile.email +
        '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);

      status.className = 'cform__status mono is-ok';
      status.textContent = '✓ Opening your email app with the message ready to send.';
    });

    form.addEventListener('input', function (e) {
      var field = e.target.closest('.field');
      if (field && field.classList.contains('is-invalid') && e.target.value.trim()) {
        field.classList.remove('is-invalid');
        e.target.removeAttribute('aria-invalid');
      }
    });
  }

  /* ==========================================================================
     POINTER EFFECTS (desktop only): cursor glow, magnetic buttons, tilt
     ========================================================================== */
  function bindMagnetic(ctx) {
    if (!finePointer || reduceMotion) return;
    $$('.magnetic', ctx).forEach(function (el) {
      if (el._mag) return;
      el._mag = true;
      el.addEventListener('pointermove', function (e) {
        var r = el.getBoundingClientRect();
        var x = (e.clientX - r.left - r.width / 2) * 0.22;
        var y = (e.clientY - r.top - r.height / 2) * 0.3;
        el.style.setProperty('--mx', Math.max(-10, Math.min(10, x)) + 'px');
        el.style.setProperty('--my', Math.max(-8, Math.min(8, y)) + 'px');
      });
      el.addEventListener('pointerleave', function () {
        el.style.setProperty('--mx', '0px');
        el.style.setProperty('--my', '0px');
      });
    });
  }

  function bindTilt(container) {
    if (!finePointer || reduceMotion) return;
    container.addEventListener('pointermove', function (e) {
      var el = $('.tilt', container);
      if (!el) return;
      var r = el.getBoundingClientRect();
      var px = (e.clientX - r.left) / r.width - 0.5;
      var py = (e.clientY - r.top) / r.height - 0.5;
      el.classList.add('is-tilting');
      el.style.setProperty('--rx', (-py * 7).toFixed(2) + 'deg');
      el.style.setProperty('--ry', (px * 9).toFixed(2) + 'deg');
    });
    container.addEventListener('pointerleave', function () {
      var el = $('.tilt', container);
      if (!el) return;
      el.classList.remove('is-tilting');
      el.style.setProperty('--rx', '0deg');
      el.style.setProperty('--ry', '0deg');
    });
  }

  function initCursorGlow() {
    if (!finePointer || reduceMotion) return;
    var glow = $('#cursor-glow');
    var x = 0, y = 0, cx = 0, cy = 0, raf = null;
    function loop() {
      cx += (x - cx) * 0.15;
      cy += (y - cy) * 0.15;
      glow.style.transform = 'translate3d(' + cx.toFixed(1) + 'px,' + cy.toFixed(1) + 'px,0)';
      raf = Math.abs(x - cx) + Math.abs(y - cy) > 0.5 ? requestAnimationFrame(loop) : null;
    }
    window.addEventListener('pointermove', function (e) {
      x = e.clientX; y = e.clientY;
      if (!glow.classList.contains('is-on')) { cx = x; cy = y; glow.classList.add('is-on'); }
      if (!raf) raf = requestAnimationFrame(loop);
    }, { passive: true });
    doc.addEventListener('pointerleave', function () { glow.classList.remove('is-on'); });
  }

  /* ==========================================================================
     INIT
     ========================================================================== */
  renderProfileLinks();
  renderTimeline();
  renderLoadout();
  renderMissions();
  renderExploring();
  renderBadges();
  renderQuest();

  initTheme();
  initNav();
  initScroll();
  initTimeline();
  initLoadout();
  initMissions();
  initBadges();
  initBrowser();
  initForm();

  bindMagnetic(doc);
  bindTilt($('.hero__card'));
  bindTilt($('#mission-brief'));
  initCursorGlow();

  boot(initReveal);
})();
