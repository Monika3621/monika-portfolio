/* Monika K — Portfolio interactions */
(function () {
  'use strict';

  var root = document.documentElement;
  var CONTACT_EMAIL = 'monikaksee0911@gmail.com';

  /* ---------- Theme toggle ---------- */
  var themeToggle = document.getElementById('theme-toggle');
  var darkQuery = window.matchMedia('(prefers-color-scheme: dark)');

  function currentTheme() {
    var set = root.getAttribute('data-theme');
    if (set === 'light' || set === 'dark') return set;
    return darkQuery.matches ? 'dark' : 'light';
  }

  function updateToggleLabel() {
    var next = currentTheme() === 'dark' ? 'light' : 'dark';
    themeToggle.setAttribute('aria-label', 'Switch to ' + next + ' mode');
  }

  themeToggle.addEventListener('click', function () {
    var next = currentTheme() === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    try { localStorage.setItem('theme', next); } catch (e) {}
    updateToggleLabel();
  });
  updateToggleLabel();

  /* ---------- Sticky nav state ---------- */
  var nav = document.getElementById('nav');
  function onScroll() {
    nav.classList.toggle('is-scrolled', window.scrollY > 10);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile menu ---------- */
  var navToggle = document.getElementById('nav-toggle');
  var navMenu = document.getElementById('nav-menu');

  function setMenu(open) {
    navMenu.classList.toggle('is-open', open);
    nav.classList.toggle('menu-open', open);
    navToggle.setAttribute('aria-expanded', String(open));
    navToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  }

  navToggle.addEventListener('click', function () {
    setMenu(navToggle.getAttribute('aria-expanded') !== 'true');
  });
  navMenu.addEventListener('click', function (e) {
    if (e.target.closest('a')) setMenu(false);
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') setMenu(false);
  });
  document.addEventListener('click', function (e) {
    if (navMenu.classList.contains('is-open') && !nav.contains(e.target)) setMenu(false);
  });
  window.addEventListener('resize', function () {
    if (window.innerWidth > 880) setMenu(false);
  });

  /* ---------- Active nav link ---------- */
  var links = Array.prototype.slice.call(document.querySelectorAll('.nav__link'));
  var sections = links
    .map(function (l) { return document.querySelector(l.getAttribute('href')); })
    .filter(Boolean);

  function setActive(id) {
    links.forEach(function (l) {
      l.classList.toggle('is-active', l.getAttribute('href') === '#' + id);
    });
  }

  if ('IntersectionObserver' in window) {
    var sectionObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) setActive(entry.target.id);
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach(function (s) { sectionObserver.observe(s); });

    // Clear highlight when back at the hero
    var hero = document.getElementById('home');
    new IntersectionObserver(function (entries) {
      if (entries[0].isIntersecting) setActive(null);
    }, { rootMargin: '-45% 0px -50% 0px' }).observe(hero);
  }

  /* ---------- Scroll reveal ---------- */
  var reveals = document.querySelectorAll('.reveal');

  // Stagger siblings inside grids so cards cascade in
  ['.hero__content', '.skills', '.projects', '.timeline', '.extra-grid'].forEach(function (sel) {
    var group = document.querySelector(sel);
    if (!group) return;
    group.querySelectorAll(':scope > .reveal').forEach(function (el, i) {
      el.style.setProperty('--delay', (i % 3) * 0.08 + 's');
    });
  });

  if ('IntersectionObserver' in window) {
    var revealObserver = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    reveals.forEach(function (el) { revealObserver.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('is-visible'); });
  }

  /* ---------- Contact form ---------- */
  // No backend: validates, then opens the visitor's email client with the message pre-filled.
  // To send directly from the page, point the form at a service like Formspree instead.
  var form = document.getElementById('contact-form');
  var status = document.getElementById('form-status');
  var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function setError(field, message) {
    var wrap = field.closest('.field');
    wrap.classList.toggle('has-error', !!message);
    wrap.querySelector('.field__error').textContent = message || '';
    field.setAttribute('aria-invalid', message ? 'true' : 'false');
  }

  function validate() {
    var ok = true;
    var name = form.elements.name;
    var email = form.elements.email;
    var message = form.elements.message;

    if (!name.value.trim()) { setError(name, 'Please enter your name.'); ok = false; } else setError(name);
    if (!emailPattern.test(email.value.trim())) { setError(email, 'Please enter a valid email address.'); ok = false; } else setError(email);
    if (message.value.trim().length < 10) { setError(message, 'Please write a message (at least 10 characters).'); ok = false; } else setError(message);

    return ok;
  }

  form.addEventListener('input', function (e) {
    if (e.target.closest('.field.has-error')) validate();
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    status.textContent = '';
    if (!validate()) {
      var firstInvalid = form.querySelector('[aria-invalid="true"]');
      if (firstInvalid) firstInvalid.focus();
      return;
    }

    var name = form.elements.name.value.trim();
    var email = form.elements.email.value.trim();
    var message = form.elements.message.value.trim();

    var subject = 'Portfolio enquiry from ' + name;
    var body = message + '\n\n— ' + name + ' (' + email + ')';
    window.location.href = 'mailto:' + CONTACT_EMAIL +
      '?subject=' + encodeURIComponent(subject) +
      '&body=' + encodeURIComponent(body);

    status.textContent = 'Opening your email app… Thanks for reaching out!';
    form.reset();
  });
})();
