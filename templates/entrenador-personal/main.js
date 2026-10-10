/* Entradas suaves y formularios de demostración, sin librerías ni envíos. */
(() => {
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const elements = document.querySelectorAll(
    '.section-kicker, .section-title, .section-subtitle, .servicio-card, .guia-card, .asesoria-info, .asesoria-form-wrapper, .testimonio-card, .contacto-info, .contacto-mapa'
  );
  let observer;

  function setMotion() {
    observer?.disconnect();
    document.querySelector('.hero').classList.toggle('is-ready', !motion.matches);
    elements.forEach(element => {
      element.classList.remove('reveal', 'is-visible');
      element.style.removeProperty('--reveal-delay');
    });
    if (motion.matches || !('IntersectionObserver' in window)) return;

    observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.08 });

    elements.forEach(element => {
      const siblings = [...element.parentElement.children];
      const index = siblings.indexOf(element);
      const isCard = element.matches('.servicio-card, .guia-card, .testimonio-card');
      element.style.setProperty('--reveal-delay', `${isCard ? (index % 3) * 90 : 0}ms`);
      element.classList.add('reveal');
      observer.observe(element);
    });
  }

  setMotion();
  motion.addEventListener('change', setMotion);

  // Las anclas navegan de verdad; solo los formularios se simulan.
  document.querySelectorAll('form').forEach(form => {
    const feedback = document.createElement('p');
    feedback.className = 'form-feedback';
    feedback.setAttribute('role', 'status');
    feedback.hidden = true;
    form.append(feedback);
    form.addEventListener('submit', event => {
      event.preventDefault();
      feedback.textContent = 'Esto es una demostración. No se han enviado datos ni se tramitan solicitudes o descargas.';
      feedback.hidden = false;
    });
  });
})();
