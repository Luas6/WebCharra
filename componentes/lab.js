'use strict';

// Las demos no envían datos ni usan almacenamiento persistente.
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const motionButton = document.querySelector('.motion-control');
let paused = reducedMotion.matches;
function setMotion(value) {
  paused = value;
  document.body.classList.toggle('effects-paused', value);
  motionButton.setAttribute('aria-pressed', String(value));
  motionButton.textContent = value ? 'Efectos en pausa' : 'Pausar efectos';
  motionButton.disabled = reducedMotion.matches;
  motionButton.title = reducedMotion.matches ? 'Movimiento reducido activado en tu dispositivo' : 'Activar o pausar los efectos decorativos';
}
setMotion(paused);
motionButton.addEventListener('click', () => setMotion(!paused));
reducedMotion.addEventListener('change', () => setMotion(reducedMotion.matches));

// Luz y perspectiva: un único frame pendiente, solo con puntero preciso.
const spotlight = document.querySelector('.spotlight');
const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
let frame = 0;
spotlight.addEventListener('pointermove', (event) => {
  if (paused || reducedMotion.matches || !finePointer.matches) return;
  cancelAnimationFrame(frame);
  frame = requestAnimationFrame(() => {
    if (paused) return;
    const rect = spotlight.getBoundingClientRect();
    const x = Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width));
    const y = Math.max(0, Math.min(1, (event.clientY - rect.top) / rect.height));
    spotlight.style.setProperty('--mx', `${x * 100}%`);
    spotlight.style.setProperty('--my', `${y * 100}%`);
    spotlight.style.setProperty('--ry', `${(x - .5) * 14}deg`);
    spotlight.style.setProperty('--rx', `${(.5 - y) * 12}deg`);
  });
});
function resetSpotlight() { cancelAnimationFrame(frame); spotlight.removeAttribute('style'); }
spotlight.addEventListener('pointerleave', resetSpotlight);
spotlight.addEventListener('blur', resetSpotlight);
function lightSpotlight() {
  if (paused) return;
  spotlight.style.setProperty('--mx', '35%');
  spotlight.style.setProperty('--my', '65%');
}
spotlight.addEventListener('click', lightSpotlight);
spotlight.addEventListener('focus', lightSpotlight);

const filters = [...document.querySelectorAll('[data-filter]')];
const experiments = [...document.querySelectorAll('.experiment')];
filters.forEach(button => button.addEventListener('click', () => {
  filters.forEach(item => item.setAttribute('aria-pressed', String(item === button)));
  let count = 0;
  experiments.forEach(card => {
    card.hidden = button.dataset.filter !== 'all' && card.dataset.category !== button.dataset.filter;
    if (!card.hidden) count++;
  });
  document.querySelector('#result-count').textContent = `${count} experimentos`;
}));

// Tabs con foco itinerante y teclas de dirección, Inicio y Fin.
const tabs = [...document.querySelectorAll('[role="tab"]')];
function activateTab(tab, focus = false) {
  tabs.forEach(item => {
    const active = item === tab;
    item.setAttribute('aria-selected', String(active));
    item.tabIndex = active ? 0 : -1;
    document.getElementById(item.getAttribute('aria-controls')).hidden = !active;
  });
  if (focus) tab.focus();
}
tabs.forEach((tab, index) => {
  tab.addEventListener('click', () => activateTab(tab));
  tab.addEventListener('keydown', event => {
    let next;
    if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
    if (event.key === 'ArrowLeft') next = (index + tabs.length - 1) % tabs.length;
    if (event.key === 'Home') next = 0;
    if (event.key === 'End') next = tabs.length - 1;
    if (next !== undefined) { event.preventDefault(); activateTab(tabs[next], true); }
  });
});

const range = document.querySelector('#compare-range');
range.addEventListener('input', () => {
  document.querySelector('.comparison').style.setProperty('--split', `${range.value}%`);
  document.querySelector('#compare-output').textContent = `${range.value}% antes`;
});

const form = document.querySelector('#brief-form');
const steps = [...form.querySelectorAll('.step')];
const indicators = [...form.querySelectorAll('.step-indicators li')];
const back = document.querySelector('#flow-back');
const next = document.querySelector('#flow-next');
const projectName = document.querySelector('#project-name');
let current = 0;
function showStep() {
  steps.forEach((step, index) => { step.hidden = index !== current; });
  indicators.forEach((item, index) => {
    if (index === current) item.setAttribute('aria-current', 'step');
    else item.removeAttribute('aria-current');
  });
  back.disabled = current === 0;
  next.textContent = current === 2 ? 'Reiniciar ↺' : 'Continuar →';
  steps[current].querySelector('h5').focus();
  document.querySelector('#flow-status').textContent = `Paso ${current + 1} de 3`;
}
function clearNameError() {
  projectName.removeAttribute('aria-invalid');
  document.querySelector('#name-error').hidden = true;
}
form.addEventListener('submit', event => {
  event.preventDefault();
  if (current === 1 && projectName.value.trim().length < 2) {
    document.querySelector('#name-error').hidden = false;
    projectName.setAttribute('aria-invalid', 'true');
    projectName.focus();
    return;
  }
  if (current === 1) {
    document.querySelector('#summary-type').textContent = new FormData(form).get('project');
    document.querySelector('#summary-name').textContent = projectName.value.trim();
  }
  if (current === 2) { form.reset(); clearNameError(); current = 0; }
  else current++;
  showStep();
});
back.addEventListener('click', () => { if (current > 0) { current--; showStep(); } });
projectName.addEventListener('input', clearNameError);

const save = document.querySelector('#save-demo');
save.addEventListener('click', () => {
  if (save.disabled) return;
  save.disabled = true;
  save.classList.remove('done');
  save.classList.add('busy');
  save.setAttribute('aria-busy', 'true');
  document.querySelector('#save-label').textContent = 'Preparando…';
  document.querySelector('#save-status').textContent = 'Simulando una operación. No se envían datos.';
  setTimeout(() => {
    save.classList.remove('busy');
    save.classList.add('done');
    save.removeAttribute('aria-busy');
    save.disabled = false;
    document.querySelector('#save-label').textContent = 'Volver a probar ↺';
    document.querySelector('#save-status').textContent = '✓ Simulación completada. Nada se ha publicado.';
  }, 1200);
});

const references = {
  spotlight: {
    title: 'Spotlight & profundidad', description: 'Gradiente radial controlado por variables CSS y una inclinación limitada. La tarjeta conserva su contenido sin movimiento.',
    use: 'Destacar un proyecto, una membresía o una tarjeta de producto. No lo uses en grandes bloques de lectura.',
    access: 'Efecto decorativo: nunca ocultar información detrás del hover. Desactivar la perspectiva con movimiento reducido y en pantallas táctiles.',
    code: '.card {\n  background: radial-gradient(220px at var(--x) var(--y),\n    #FF233C55, transparent);\n  transform: rotateY(var(--angle, 0deg));\n}\n@media (prefers-reduced-motion: reduce) {\n  .card { transform: none; }\n}'
  },
  tabs: {
    title: 'Pestañas con intención', description: 'Una región, varios contextos. La selección visual y los atributos accesibles se actualizan juntos.',
    use: 'Paneles de producto, vistas de un dashboard o contenidos relacionados que no necesitan URL propia.',
    access: 'Usar tablist, tab y tabpanel. Conectar aria-controls y aria-labelledby. Flechas para moverse; Inicio y Fin para los extremos.',
    code: '<button role="tab" id="tab-a"\n  aria-controls="panel-a" aria-selected="true">Diseño</button>\n<section role="tabpanel" id="panel-a"\n  aria-labelledby="tab-a" tabindex="0">Contenido</section>'
  },
  compare: {
    title: 'Comparador antes / después', description: 'Dos superficies superpuestas. Un range nativo controla el recorte de la capa superior.',
    use: 'Rediseños, fotografía o visualización de cambios. Mantener la misma escala en ambos lados.',
    access: 'Etiqueta explícita y control nativo para teclado y táctil. No transmitir diferencias importantes solo por color.',
    code: 'range.addEventListener("input", () => {\n  comparison.style.setProperty("--split", `${range.value}%`);\n});\n/* Capa anterior */\n.before {\n  clip-path: inset(0 calc(100% - var(--split)) 0 0);\n}'
  },
  stepper: {
    title: 'Formulario por pasos', description: 'Separar una decisión grande en decisiones pequeñas. La demo conserva las respuestas al retroceder.',
    use: 'Briefings, configuración inicial o procesos que realmente requieren varias etapas. Para dos campos, un formulario simple suele ser mejor.',
    access: 'Anunciar el paso, mover el foco a su encabezado y explicar los errores junto al campo. Validar también en servidor en un proyecto real.',
    code: 'function showStep(index) {\n  steps.forEach((step, i) => { step.hidden = i !== index; });\n  steps[index].querySelector("h5").focus();\n  status.textContent = `Paso ${index + 1} de ${steps.length}`;\n}\n// Esta demo no tiene backend ni guarda datos.'
  },
  accordion: {
    title: 'Divulgación progresiva', description: 'El navegador ya sabe abrir, cerrar y anunciar este control. No hace falta una librería.',
    use: 'Preguntas frecuentes y detalles secundarios. Dejar siempre visibles precios, condiciones críticas e información esencial.',
    access: 'Mantener summary como control nativo. No introducir botones adicionales dentro de summary ni eliminar el foco visible.',
    code: '<details>\n  <summary>¿Cómo funciona?</summary>\n  <p>La respuesta, disponible también sin JavaScript.</p>\n</details>'
  },
  feedback: {
    title: 'Feedback de una acción', description: 'El botón comunica el estado y evita acciones repetidas. La confirmación permanece visible.',
    use: 'Guardados, envíos o cargas. Aquí se usa un temporizador; en producción debe reflejar la respuesta real del servidor, incluidos los errores.',
    access: 'Anunciar progreso con role="status", conservar una etiqueta textual y no depender únicamente de una animación o icono.',
    code: 'button.disabled = true;\nbutton.setAttribute("aria-busy", "true");\nstatus.textContent = "Procesando…";\n// Tras recibir respuesta real, gestionar éxito o error.\nbutton.disabled = false;\nbutton.removeAttribute("aria-busy");'
  }
};
const dialog = document.querySelector('#reference-dialog');
let opener;
document.querySelectorAll('[data-reference]').forEach(button => button.addEventListener('click', () => {
  const ref = references[button.dataset.reference];
  opener = button;
  document.querySelector('#reference-title').textContent = ref.title;
  document.querySelector('#reference-description').textContent = ref.description;
  document.querySelector('#reference-use').textContent = ref.use;
  document.querySelector('#reference-access').textContent = ref.access;
  document.querySelector('#reference-code').textContent = ref.code;
  document.querySelector('#copy-status').textContent = '';
  dialog.showModal();
  document.querySelector('#close-dialog').focus();
}));
document.querySelector('#close-dialog').addEventListener('click', () => dialog.close());
dialog.addEventListener('close', () => { opener?.focus(); });
document.querySelector('#copy-code').addEventListener('click', async () => {
  const status = document.querySelector('#copy-status');
  try {
    await navigator.clipboard.writeText(document.querySelector('#reference-code').textContent);
    status.textContent = 'Código copiado.';
  } catch {
    status.textContent = 'No se pudo acceder al portapapeles. Selecciona el código y cópialo manualmente.';
  }
});
