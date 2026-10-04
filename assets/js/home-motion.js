'use strict';

// Animaciones aisladas: sin dependencias, eventos de scroll ni almacenamiento.
(() => {
  const root = document.documentElement;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const visual = document.querySelector('.hero-visual');
  const cards = document.querySelectorAll('.service-card, .work-card, .template-card');
  cards.forEach(card => card.classList.add('reveal-card'));
  const reveals = document.querySelectorAll('.steps > div, .reveal-card');

  function updateMotion() {
    const enabled = !reducedMotion.matches && !document.hidden;
    root.classList.toggle('motion-enabled', enabled);
    if (!enabled) {
      reveals.forEach(item => { if (item.classList.contains('is-revealed')) item.classList.add('motion-complete'); });
    }
  }

  reducedMotion.addEventListener('change', updateMotion);
  document.addEventListener('visibilitychange', updateMotion);
  reveals.forEach(item => {
    item.addEventListener('animationend', event => {
      if (event.animationName === 'home-step-line' || event.animationName === 'home-card-line') item.classList.add('motion-complete');
    });
    // No desplazar una tarjeta mientras se utiliza su enlace con el teclado.
    item.addEventListener('focusin', () => item.classList.add('is-revealed', 'motion-complete'));
  });

  if ('IntersectionObserver' in window) {
    // El banner solo consume recursos de animación mientras está a la vista.
    const heroObserver = new IntersectionObserver(entries => {
      for (const entry of entries) entry.target.classList.toggle('is-in-view', entry.isIntersecting);
    });
    heroObserver.observe(visual);

    const revealObserver = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add('is-revealed');
        if (reducedMotion.matches || document.hidden) entry.target.classList.add('motion-complete');
        revealObserver.unobserve(entry.target);
      }
    }, {threshold:0.2});
    reveals.forEach(item => revealObserver.observe(item));
  } else {
    // Sin observadores, se conserva la versión estática y legible.
    reveals.forEach(item => item.classList.add('is-revealed', 'motion-complete'));
  }

  updateMotion();
})();
