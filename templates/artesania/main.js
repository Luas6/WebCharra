(() => {
  'use strict';

  const cards = [...document.querySelectorAll('.product-card')];
  const products = new Map(cards.map(card => [card.dataset.id, {
    id: card.dataset.id,
    name: card.querySelector('h3').textContent,
    price: Number(card.dataset.price),
    description: card.dataset.description,
    art: card.querySelector('.product-art svg')
  }]));
  const money = new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' });
  const cart = new Map(); // Solo memoria: sin cookies, localStorage, red ni datos personales.
  const detailDialog = document.getElementById('product-dialog');
  const cartDialog = document.getElementById('cart-dialog');
  const cartItems = document.getElementById('cart-items');
  const finishMessage = document.getElementById('finish-message');
  const status = document.getElementById('cart-status');
  let activeProduct = null;
  let statusTimer;
  const dialogsSupported = typeof cartDialog.showModal === 'function';

  function announce(message) {
    clearTimeout(statusTimer);
    status.textContent = message;
    statusTimer = setTimeout(() => { status.textContent = ''; }, 4500);
  }

  function artwork(product, className) {
    const svg = product.art.cloneNode(true);
    svg.removeAttribute('role');
    svg.removeAttribute('aria-label');
    svg.setAttribute('aria-hidden', 'true');
    if (className) svg.setAttribute('class', className);
    return svg;
  }

  function button(label, text, action, id, className) {
    const element = document.createElement('button');
    element.type = 'button';
    element.textContent = text;
    element.setAttribute('aria-label', label);
    element.dataset.action = action;
    element.dataset.id = id;
    if (className) element.className = className;
    return element;
  }

  function renderCart(focusTarget) {
    let total = 0;
    let count = 0;
    const fragment = document.createDocumentFragment();
    cart.forEach((quantity, id) => {
      const product = products.get(id);
      count += quantity;
      total += product.price * quantity;
      const item = document.createElement('li');
      item.className = 'cart-item';
      item.append(artwork(product, 'cart-thumb'));
      const info = document.createElement('div');
      const title = document.createElement('h3');
      title.textContent = product.name;
      const price = document.createElement('p');
      price.textContent = `${money.format(product.price)} / ud. · ficticio`;
      const controls = document.createElement('div');
      controls.className = 'quantity-controls';
      controls.setAttribute('role', 'group');
      controls.setAttribute('aria-label', `Cantidad de ${product.name}`);
      const decrease = button(`Reducir cantidad de ${product.name}`, '−', 'decrease', id);
      const quantityText = document.createElement('span');
      quantityText.textContent = quantity;
      quantityText.setAttribute('aria-label', `${quantity} unidades`);
      const increase = button(`Aumentar cantidad de ${product.name}`, '+', 'increase', id);
      increase.disabled = quantity >= 99;
      controls.append(decrease, quantityText, increase);
      info.append(title, price, controls);
      item.append(info, button(`Eliminar ${product.name} de la bolsa`, 'Eliminar', 'remove', id, 'remove-button'));
      fragment.append(item);
    });
    cartItems.replaceChildren(fragment);
    document.querySelector('.cart-count').textContent = count;
    document.getElementById('cart-total').textContent = money.format(total);
    document.getElementById('cart-empty').hidden = count > 0;
    document.getElementById('cart-finish').disabled = count === 0;
    finishMessage.hidden = true;
    if (focusTarget) {
      const replacement = [...cartItems.querySelectorAll('button')].find(element =>
        element.dataset.id === focusTarget.id && element.dataset.action === focusTarget.action && !element.disabled);
      (replacement || cartItems.querySelector('button') || cartDialog.querySelector('[data-close]')).focus();
    }
  }

  function addToCart(id) {
    const product = products.get(id);
    if (!product) return;
    const quantity = cart.get(id) || 0;
    if (quantity >= 99) {
      announce('Máximo de 99 unidades por pieza en esta demo.');
      return;
    }
    cart.set(id, quantity + 1);
    renderCart();
    announce(`${product.name} añadida a la bolsa demo. No es una compra real.`);
  }

  document.querySelectorAll('[data-filter]').forEach(filter => {
    filter.disabled = false;
    filter.addEventListener('click', () => {
      document.querySelectorAll('[data-filter]').forEach(other => {
        other.setAttribute('aria-pressed', String(other === filter));
      });
      let count = 0;
      cards.forEach(card => {
        card.hidden = filter.dataset.filter !== 'todos' && card.dataset.category !== filter.dataset.filter;
        if (!card.hidden) count++;
      });
      document.getElementById('filter-status').textContent = `${count} piezas imaginadas`;
    });
  });

  if (dialogsSupported) {
    document.querySelectorAll('[data-cart-open], [data-add], [data-detail]').forEach(control => { control.disabled = false; });
    document.querySelector('[data-cart-open]').addEventListener('click', () => cartDialog.showModal());
    cards.forEach(card => {
      card.querySelector('[data-add]').addEventListener('click', () => addToCart(card.dataset.id));
      card.querySelector('[data-detail]').addEventListener('click', () => {
        activeProduct = card.dataset.id;
        const product = products.get(activeProduct);
        document.getElementById('detail-title').textContent = product.name;
        document.getElementById('detail-description').textContent = product.description;
        document.getElementById('detail-price').textContent = `${money.format(product.price)} · precio de ejemplo`;
        document.getElementById('detail-art').replaceChildren(artwork(product));
        detailDialog.showModal();
      });
    });
    document.getElementById('detail-add').addEventListener('click', () => {
      addToCart(activeProduct);
      detailDialog.close();
    });
    [detailDialog, cartDialog].forEach(dialog => {
      dialog.querySelector('[data-close]').addEventListener('click', () => dialog.close());
      dialog.addEventListener('click', event => {
        const bounds = dialog.getBoundingClientRect();
        if (event.target === dialog && (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom)) dialog.close();
      });
    });
    cartItems.addEventListener('click', event => {
      const control = event.target.closest('button[data-action]');
      if (!control) return;
      const { id, action } = control.dataset;
      const quantity = cart.get(id);
      if (!quantity) return;
      if (action === 'remove' || (action === 'decrease' && quantity === 1)) cart.delete(id);
      else cart.set(id, Math.min(99, quantity + (action === 'increase' ? 1 : -1)));
      renderCart({ id, action });
      announce(`${products.get(id).name}: ${cart.get(id) || 0} unidades en la bolsa demo.`);
    });
    document.getElementById('cart-finish').addEventListener('click', () => { finishMessage.hidden = false; });
  } else {
    document.getElementById('filter-status').textContent = 'Tu navegador permite explorar el catálogo, pero no abrir la bolsa demo.';
  }

  // Escena de tres actos: composición, expansión y constelación.
  // Las coordenadas son centros relativos al viewport; el scroll es reversible.
  const hero = document.querySelector('.hero');
  const desktop = window.matchMedia('(min-width: 960px)');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  let nearby = false;
  let listening = false;
  let frame = 0;
  const copy = hero.querySelector('.hero-copy');
  const trajectories = [
    { element: hero.querySelector('.flying-vase'), size: 0.29, points: [
      [0, .77, .43, 1, 0], [.3, .88, .2, .85, -24], [.57, .14, .27, 1.08, 25], [.8, .8, .22, .8, -15], [1, .79, .55, .9, 0]
    ] },
    { element: hero.querySelector('.flying-pleat'), size: 0.26, points: [
      [0, .6, .58, 1, 0], [.3, .13, .25, 1.2, -32], [.57, .88, .72, .9, 30], [.8, .18, .25, .85, -20], [1, .22, .57, .9, 0]
    ] },
    { element: hero.querySelector('.flying-candle'), size: 0.25, points: [
      [0, .73, .7, 1, 0], [.3, .48, .8, 1.12, 18], [.57, .8, .22, .85, -20], [.8, .52, .73, 1.5, 8], [1, .5, .68, 1.1, 0]
    ] }
  ];
  const clamp = value => Math.max(0, Math.min(1, value));
  const ease = value => value * value * (3 - 2 * value);
  const ramp = (progress, start, end) => ease(clamp((progress - start) / (end - start)));
  const windowOpacity = (p, start, peak, fall, end) => ramp(p, start, peak) * (1 - ramp(p, fall, end));

  function movePiece(trajectory, progress, width, height) {
    const points = trajectory.points;
    let end = points.findIndex(point => point[0] >= progress);
    end = Math.max(1, end < 0 ? points.length - 1 : end);
    const a = points[end - 1];
    const b = points[end];
    const t = ease(clamp((progress - a[0]) / (b[0] - a[0])));
    const mix = index => a[index] + (b[index] - a[index]) * t;
    const size = Math.min(width * trajectory.size, height * .53);
    const style = trajectory.element.style;
    style.setProperty('--piece-size', `${size.toFixed(1)}px`);
    style.setProperty('--x', (mix(1) * width - size / 2).toFixed(2));
    style.setProperty('--y', (mix(2) * height - size / 2).toFixed(2));
    style.setProperty('--scale', mix(3).toFixed(3));
    style.setProperty('--turn', mix(4).toFixed(2));
  }

  function updateScene() {
    frame = 0;
    if (!listening) return;
    const rect = hero.getBoundingClientRect();
    const range = Math.max(1, rect.height - window.innerHeight);
    const progress = Math.max(0, Math.min(1, -rect.top / range));
    hero.style.setProperty('--progress', progress.toFixed(4));
    const style = hero.style;
    style.setProperty('--intro-opacity', (1 - ramp(progress, .04, .23)).toFixed(3));
    style.setProperty('--intro-shift', (ramp(progress, 0, .25) * 150).toFixed(1));
    style.setProperty('--pedestal-opacity', (1 - ramp(progress, .02, .25)).toFixed(3));
    style.setProperty('--pedestal-drop', (ramp(progress, 0, .3) * 220).toFixed(1));
    style.setProperty('--chapter-one-opacity', windowOpacity(progress, .2, .3, .48, .61).toFixed(3));
    style.setProperty('--chapter-two-opacity', windowOpacity(progress, .59, .7, .89, 1).toFixed(3));
    style.setProperty('--chapter-offset', `${((1 - ramp(progress, .2, .35)) * 50).toFixed(1)}px`);
    style.setProperty('--halo-opacity', ramp(progress, .08, .3).toFixed(3));
    style.setProperty('--halo-x', (Math.sin(progress * Math.PI * 2) * 180).toFixed(1));
    style.setProperty('--halo-y', (Math.sin(progress * Math.PI) * 110).toFixed(1));
    // Ne pas masquer un lien qui possède déjà le focus clavier.
    const away = progress > .23 && !copy.contains(document.activeElement);
    copy.classList.toggle('is-away', away);
    copy.inert = away;
    hero.querySelector('.cinema-step').textContent = `${progress < .23 ? '01' : progress < .61 ? '02' : '03'} / 03`;
    trajectories.forEach(trajectory => movePiece(trajectory, progress, window.innerWidth, window.innerHeight));
  }
  function scheduleScene() {
    if (!frame && listening) frame = requestAnimationFrame(updateScene);
  }
  function syncScene() {
    const cinematic = desktop.matches && !reduced.matches;
    hero.classList.toggle('cinematic', cinematic);
    const enabled = nearby && desktop.matches && !reduced.matches && !document.hidden;
    if (enabled && !listening) {
      listening = true;
      window.addEventListener('scroll', scheduleScene, { passive: true });
      window.addEventListener('resize', scheduleScene, { passive: true });
      scheduleScene();
    } else if (!enabled && listening) {
      listening = false;
      window.removeEventListener('scroll', scheduleScene);
      window.removeEventListener('resize', scheduleScene);
      cancelAnimationFrame(frame);
      frame = 0;
    }
    if (!cinematic) {
      hero.style.setProperty('--progress', '0');
      copy.classList.remove('is-away');
      copy.inert = false;
    }
  }
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      nearby = entries[0].isIntersecting;
      syncScene();
    }, { rootMargin: '150px 0px' });
    observer.observe(hero);
    desktop.addEventListener('change', syncScene);
    reduced.addEventListener('change', syncScene);
    document.addEventListener('visibilitychange', syncScene);
  }
})();
