'use strict';

// Bootstrap/CSS resuelven el diseño; JS solo detecta scroll y visibilidad.
(() => {
  const header = document.querySelector('.site-header');
  const hero = document.querySelector('#inicio');
  const contact = document.querySelector('#contacto');
  const footer = document.querySelector('footer');
  const shortcut = document.querySelector('.floating-contact');
  if (!header || !hero || !contact || !footer || !shortcut) return;

  function updateHeaderHeight() {
    document.body.style.setProperty('--header-height', `${header.getBoundingClientRect().height}px`);
  }

  updateHeaderHeight();
  if ('ResizeObserver' in window) {
    new ResizeObserver(updateHeaderHeight).observe(header);
  } else {
    window.addEventListener('resize', updateHeaderHeight, {passive:true});
  }

  let previousY = Math.max(0, window.scrollY);
  let framePending = false;
  window.addEventListener('scroll', () => {
    if (framePending) return;
    framePending = true;
    window.requestAnimationFrame(() => {
      const y = Math.max(0, Math.min(window.scrollY, document.documentElement.scrollHeight - window.innerHeight));
      // Umbral pequeño para evitar parpadeos por movimientos involuntarios.
      if (y <= 8 || Math.abs(y - previousY) >= 8) {
        header.classList.toggle('is-hidden', y > 8 && y > previousY);
        previousY = y;
      }
      framePending = false;
    });
  }, {passive:true});
  header.addEventListener('focusin', () => header.classList.remove('is-hidden'));

  if (!('IntersectionObserver' in window)) return;

  const visible = new Map([[hero, true], [contact, false], [footer, false]]);
  function updateShortcut() {
    const show = !visible.get(hero) && !visible.get(contact) && !visible.get(footer);
    // No retirar un enlace mientras tiene el foco del teclado.
    shortcut.hidden = !show && document.activeElement !== shortcut;
  }

  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) visible.set(entry.target, entry.isIntersecting);
    updateShortcut();
  });
  [hero, contact, footer].forEach(section => observer.observe(section));
  shortcut.addEventListener('blur', updateShortcut);
})();
