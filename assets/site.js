'use strict';
(() => {
  document.documentElement.classList.add('js-ready');
  const toggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('#main-navigation');
  function closeMenu(restoreFocus = false) {
    if (!toggle || !nav) return;
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Open navigation');
    nav.classList.remove('is-open');
    if (restoreFocus) toggle.focus();
  }
  toggle?.addEventListener('click', () => {
    const open = toggle.getAttribute('aria-expanded') !== 'true';
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
    nav.classList.toggle('is-open', open);
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && toggle?.getAttribute('aria-expanded') === 'true') closeMenu(true);
  });
  document.addEventListener('click', event => {
    if (toggle?.getAttribute('aria-expanded') === 'true' && !event.target.closest('.site-header')) closeMenu();
  });
  nav?.addEventListener('click', event => { if (event.target.closest('a')) closeMenu(); });
  const desktop = matchMedia('(min-width: 701px)');
  desktop.addEventListener('change', () => {
    if (desktop.matches) {
      const focusedToggle = document.activeElement === toggle;
      closeMenu();
      if (focusedToggle) nav?.querySelector('a')?.focus();
    }
  });

  // Progressive enhancement: all content is visible until observation is ready.
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  if ('IntersectionObserver' in window && !motion.matches) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08 });
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    document.documentElement.classList.add('motion-enabled');
    motion.addEventListener('change', event => {
      if (event.matches) {
        document.documentElement.classList.remove('motion-enabled');
        observer.disconnect();
      }
    });
  }

  const search = document.querySelector('#guide-search');
  const filters = [...document.querySelectorAll('[data-filter]')];
  const cards = [...document.querySelectorAll('.guide-library .guide-card')];
  const count = document.querySelector('.guide-count');
  const empty = document.querySelector('.empty-guides');
  let category = 'all';
  function updateGuides() {
    const query = search?.value.trim().toLowerCase() || '';
    let found = 0;
    cards.forEach(card => {
      const matches = (category === 'all' || card.dataset.category === category) &&
        (!query || card.dataset.search.includes(query));
      card.hidden = !matches;
      if (matches) found++;
    });
    if (count) count.textContent = `${found} ${found === 1 ? 'guide' : 'guides'}${query ? ' matching your search' : category === 'all' ? ' to help you get started' : ' in ' + category.toLowerCase()}`;
    if (empty) empty.hidden = found !== 0;
    filters.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.filter === category)));
  }
  filters.forEach(button => button.addEventListener('click', () => {
    category = button.dataset.filter;
    updateGuides();
  }));
  search?.addEventListener('input', updateGuides);
  document.querySelector('#reset-guides')?.addEventListener('click', () => {
    category = 'all';
    if (search) search.value = '';
    updateGuides();
    search?.focus();
  });

  const state = document.querySelector('#registry-state');
  const stateLink = document.querySelector('#registry-link');
  state?.addEventListener('change', () => {
    stateLink.href = state.value || 'https://www.sba.gov/counseling/launch-your-business/state-registration-lookup/';
    const name = state.options[state.selectedIndex].text;
    stateLink.textContent = !state.value || name.startsWith('Another') ? 'Open official state directory ↗' : `Open ${name} official website ↗`;
    stateLink.setAttribute('aria-label', stateLink.textContent + ' (opens in a new tab)');
  });

  const topic = document.querySelector('#contact-topic');
  const contactLink = document.querySelector('#topic-whatsapp');
  topic?.addEventListener('change', () => {
    contactLink.href = 'https://wa.me/923164248897?text=' + encodeURIComponent('Hello UD Marketing, I would like to discuss ' + topic.value + '.');
  });
})();
