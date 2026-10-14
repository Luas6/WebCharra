/* Colecciones del laboratorio: estados locales, sin peticiones ni persistencia. */
(() => {
  'use strict';
  const find = selector => document.querySelector(selector);

  const moods = {
    calma: ['Baja el ritmo.', 'Un poco de espacio para respirar y empezar sin prisa.'],
    energia: ['Enciende la idea.', 'Color, curiosidad y un pequeño impulso para probar algo nuevo.'],
    foco: ['Una cosa a la vez.', 'Menos ruido. Una intención clara y el siguiente paso.']
  };
  document.querySelectorAll('button[data-mood]').forEach(button => {
    button.addEventListener('click', () => {
      const mood = button.dataset.mood;
      find('.mood-demo').dataset.mood = mood;
      document.querySelectorAll('button[data-mood]').forEach(item => {
        item.setAttribute('aria-pressed', String(item === button));
      });
      if (find('#mood-title')) find('#mood-title').textContent = moods[mood][0];
      find('#mood-description').textContent = moods[mood][1];
    });
  });

  const rituals = [...document.querySelectorAll('.ritual-check')];
  rituals.forEach(input => input.addEventListener('change', () => {
    const done = rituals.filter(item => item.checked).length;
    find('#ritual-progress').value = done;
    find('#ritual-count').textContent = `${done} de ${rituals.length} hábitos${done === rituals.length ? ' · ¡Completado!' : ''}`;
  }));

  find('#billing-yearly').addEventListener('change', event => {
    const yearly = event.target.checked;
    find('#price-value').textContent = yearly ? '120' : '12';
    find('#price-period').textContent = yearly ? '/ año' : '/ mes';
    find('#billing-note').textContent = yearly
      ? '120 € al año · Ahorras 24 € frente a 12 mensualidades. Precios ficticios.'
      : 'Facturación mensual. Precios ficticios.';
  });

  find('#neon-power').addEventListener('click', event => {
    const on = find('.neon-demo').classList.toggle('is-on');
    event.currentTarget.setAttribute('aria-pressed', String(on));
    event.currentTarget.textContent = on ? 'Apagar neón' : 'Encender neón';
    find('#neon-status').textContent = on ? 'Neón encendido' : 'En reposo';
  });

  const euro = new Intl.NumberFormat('es-ES', {style: 'currency', currency: 'EUR', maximumFractionDigits: 0});
  find('#ticket-quantity').addEventListener('change', event => {
    find('#ticket-total').textContent = euro.format(Number(event.target.value) * 24);
  });

  const posterNames = {acid: 'Ácido', coral: 'Coral', blue: 'Azul eléctrico'};
  document.querySelectorAll('[data-poster-theme]').forEach(button => {
    button.addEventListener('click', () => {
      find('.poster-demo').dataset.theme = button.dataset.posterTheme;
      document.querySelectorAll('[data-poster-theme]').forEach(item => {
        item.setAttribute('aria-pressed', String(item === button));
      });
      if (find('#poster-theme-name')) find('#poster-theme-name').textContent = posterNames[button.dataset.posterTheme];
    });
  });

  find('#glass-blur').addEventListener('input', event => {
    const blur = `${event.target.value}px`;
    find('.glass-panel').style.setProperty('--blur', blur);
    find('#blur-value').textContent = `${event.target.value} px`;
  });

  // Avisos persistentes hasta cerrarlos. Sin temporizadores ni cambios de foco al añadir.
  const stack = find('#notification-stack');
  const messages = ['Tu boceto está listo.', 'Nueva idea en la colección.', 'Revisión de diseño completada.'];
  let notificationNumber = 0;
  find('#notify-demo').addEventListener('click', () => {
    if (stack.querySelectorAll('.glass-notification').length >= 3) {
      find('#notify-status').textContent = 'Hay 3 avisos. Cierra uno para probar otro.';
      return;
    }
    stack.querySelector('.notification-empty').hidden = true;
    const notification = document.createElement('div');
    notification.className = 'glass-notification';
    const message = document.createElement('span');
    message.textContent = messages[notificationNumber++ % messages.length];
    const dismiss = document.createElement('button');
    dismiss.type = 'button';
    dismiss.className = 'notification-dismiss';
    dismiss.textContent = '×';
    dismiss.setAttribute('aria-label', `Cerrar aviso: ${message.textContent}`);
    dismiss.addEventListener('click', () => {
      const next = notification.nextElementSibling?.querySelector('button') || notification.previousElementSibling?.querySelector('button');
      notification.remove();
      const count = stack.querySelectorAll('.glass-notification').length;
      stack.querySelector('.notification-empty').hidden = count !== 0;
      find('#notify-status').textContent = `Aviso cerrado. ${count} avisos pendientes.`;
      (next || find('#notify-demo')).focus();
    });
    notification.append(message, dismiss);
    stack.append(notification);
    find('#notify-status').textContent = `Aviso de demostración: ${message.textContent}`;
  });

  find('#glass-hour').addEventListener('input', event => {
    const hour = Number(event.target.value);
    const period = hour < 7 || hour >= 21 ? 'night' : hour < 17 ? 'day' : 'evening';
    find('.weather-demo').dataset.period = period;
    find('#glass-time').textContent = `${String(hour).padStart(2, '0')}:00`;
    find('#weather-label').textContent = {night: 'Noche', day: 'Luz de día', evening: 'Atardecer'}[period];
  });

  find('#orbit-speed').addEventListener('input', event => {
    const speed = Number(event.target.value);
    find('.orbital-demo').style.setProperty('--orbit-duration', `${12 / speed}s`);
    find('#orbit-value').textContent = `${speed}×`;
  });

  find('#flip-card').addEventListener('click', event => {
    const flipped = find('.flip-demo').classList.toggle('is-flipped');
    event.currentTarget.setAttribute('aria-pressed', String(flipped));
    event.currentTarget.textContent = flipped ? 'Ver anverso' : 'Ver reverso';
    find('.flip-face-front').setAttribute('aria-hidden', String(flipped));
    find('.flip-face-back').setAttribute('aria-hidden', String(!flipped));
  });

  find('#spring-demo').addEventListener('click', event => {
    const end = find('.spring-demo').classList.toggle('is-end');
    event.currentTarget.setAttribute('aria-pressed', String(end));
    event.currentTarget.textContent = end ? 'Volver al inicio' : 'Mover al otro extremo';
    find('#spring-status').textContent = end ? 'Posición final' : 'Posición inicial';
  });

  const palettes = [
    ['#F4F4F4', '#FF233C', '#8D99AE', '#2B2B2B'],
    ['#F7E8DD', '#D497A0', '#493E4D', '#E0EADC'],
    ['#D8FF4F', '#FF826C', '#221E2B', '#F5EEDC'],
    ['#5683FF', '#F7FF7A', '#351C2C', '#E7E1F0']
  ];
  let paletteIndex = 0;
  const paletteButtons = [...document.querySelectorAll('[data-swatch]')];
  function setPalette(palette) {
    paletteButtons.forEach((button, index) => {
      const hex = palette[index];
      button.querySelector('i').style.backgroundColor = hex;
      button.querySelector('code').textContent = hex;
      button.setAttribute('aria-label', `Copiar color ${hex}`);
    });
  }
  find('#palette-generate').addEventListener('click', () => {
    const nextOffset = 1 + Math.floor(Math.random() * (palettes.length - 1));
    paletteIndex = (paletteIndex + nextOffset) % palettes.length;
    setPalette(palettes[paletteIndex]);
    find('#palette-status').textContent = `Paleta ${paletteIndex + 1} de ${palettes.length} · No se guarda.`;
  });
  paletteButtons.forEach(button => button.addEventListener('click', async () => {
    const color = button.querySelector('code').textContent;
    try {
      await navigator.clipboard.writeText(color);
      find('#palette-status').textContent = `${color} copiado al portapapeles.`;
    } catch {
      find('#palette-status').textContent = `Color ${color}. El portapapeles no está disponible en este contexto.`;
    }
  }));

  find('#volume-level').addEventListener('input', event => {
    const value = Number(event.target.value);
    find('#volume-value').textContent = `${value}%`;
    find('.volume-meter').style.setProperty('--level', `${value}%`);
    find('#volume-caption').textContent = value < 25 ? 'Un nivel suave.' : value < 70 ? 'Un nivel cómodo para empezar.' : 'Un nivel intenso.';
  });

  const ideaSearch = find('#idea-search');
  function filterIdeas(query) {
    const normalized = query.trim().toLocaleLowerCase('es');
    let count = 0;
    document.querySelectorAll('#idea-results li').forEach(item => {
      item.hidden = normalized !== '' && !item.dataset.search.includes(normalized);
      if (!item.hidden) count++;
    });
    find('#search-status').textContent = `${count} ${count === 1 ? 'idea disponible' : 'ideas disponibles'}`;
  }
  ideaSearch.addEventListener('input', () => filterIdeas(ideaSearch.value));
  document.querySelectorAll('[data-query]').forEach(button => button.addEventListener('click', () => {
    ideaSearch.value = button.dataset.query;
    filterIdeas(ideaSearch.value);
    ideaSearch.focus();
  }));

  find('#booking-confirm').addEventListener('click', () => {
    const day = find('#visit-day').selectedOptions[0].textContent.split(' · ')[0];
    const date = find('#visit-day').selectedOptions[0].textContent.split(' · ')[1];
    const time = find('[name="visit-time"]:checked').value;
    find('#booking-summary').textContent = `${day} · ${date}, a las ${time}. Demo, sin reserva.`;
  });

  const password = find('#demo-password');
  find('#password-toggle').addEventListener('click', event => {
    const visible = password.type === 'password';
    password.type = visible ? 'text' : 'password';
    event.currentTarget.textContent = visible ? 'Ocultar texto' : 'Mostrar texto';
    event.currentTarget.setAttribute('aria-pressed', String(visible));
  });
  password.addEventListener('input', () => {
    const value = password.value;
    const score = [value.length >= 8, value.length >= 12, /[a-z]/.test(value) && /[A-Z]/.test(value), /\d/.test(value), /[^\w]/.test(value)].filter(Boolean).length;
    const labels = ['Muy corta', 'Básica', 'En progreso', 'Bastante variada', 'Variada', 'Variada y larga'];
    const meter = find('.strength-meter');
    meter.style.setProperty('--strength', `${score * 20}%`);
    meter.dataset.score = String(score);
    find('#strength-label').textContent = value ? `Orientación local: ${labels[score]}` : 'Esperando texto';
  });

  find('#loading-toggle').addEventListener('click', event => {
    const loaded = find('.loading-demo').classList.toggle('is-loaded');
    event.currentTarget.setAttribute('aria-pressed', String(loaded));
    event.currentTarget.textContent = loaded ? 'Volver a cargar' : 'Mostrar contenido';
    find('#loading-status').textContent = loaded ? 'Contenido de demostración disponible.' : 'Estado inicial: cargando.';
  });

  const places = {
    one: ['Plaza del Olmo', 'Punto de encuentro · Zona centro'],
    two: ['Patio de la Luz', 'Galería · Barrio imaginario'],
    three: ['Jardín del Río', 'Parque · Orilla ficticia']
  };
  document.querySelectorAll('[data-place]').forEach(button => button.addEventListener('click', () => {
    document.querySelectorAll('[data-place]').forEach(item => {
      item.setAttribute('aria-pressed', String(item === button));
    });
    const place = places[button.dataset.place];
    find('#atlas-place-name').textContent = place[0];
    find('#atlas-place-kind').textContent = place[1];
  }));

  const routeMinutes = {
    plaza: {patio: 8, jardin: 12},
    patio: {plaza: 8, jardin: 6},
    jardin: {plaza: 12, patio: 6}
  };
  let routeMode = 'walk';
  function updateRoute() {
    const from = find('#route-from').value;
    const to = find('#route-to').value;
    if (from === to) {
      find('#route-summary').textContent = 'Elige dos puntos distintos para ver el recorrido.';
      return;
    }
    const minutes = routeMinutes[from][to] + (routeMode === 'wheel' ? 4 : 0);
    find('#route-summary').textContent = `Ruta conceptual · ${minutes} min ${routeMode === 'wheel' ? 'accesible' : 'andando'}`;
  }
  find('#route-from').addEventListener('change', updateRoute);
  find('#route-to').addEventListener('change', updateRoute);
  document.querySelectorAll('[data-route-mode]').forEach(button => button.addEventListener('click', () => {
    routeMode = button.dataset.routeMode;
    document.querySelectorAll('[data-route-mode]').forEach(item => {
      item.setAttribute('aria-pressed', String(item === button));
    });
    find('.route-demo').dataset.mode = routeMode;
    updateRoute();
  }));

  const locatorQuery = find('#place-query');
  let locatorKind = 'all';
  function filterPlaces() {
    const query = locatorQuery.value.trim().toLocaleLowerCase('es');
    let count = 0;
    document.querySelectorAll('#locator-results li').forEach(item => {
      item.hidden = (locatorKind !== 'all' && item.dataset.kind !== locatorKind) ||
        (query !== '' && !item.dataset.name.includes(query));
      if (!item.hidden) count++;
    });
    find('#locator-status').textContent = `${count} ${count === 1 ? 'lugar ficticio' : 'lugares ficticios'} · No se usa tu ubicación.`;
  }
  locatorQuery.addEventListener('input', filterPlaces);
  document.querySelectorAll('[data-place-filter]').forEach(button => button.addEventListener('click', () => {
    locatorKind = button.dataset.placeFilter;
    document.querySelectorAll('[data-place-filter]').forEach(item => {
      item.setAttribute('aria-pressed', String(item === button));
    });
    filterPlaces();
  }));

  find('#copy-address').addEventListener('click', async () => {
    const address = 'Plaza del Olmo, 4 · Salamanca';
    try {
      await navigator.clipboard.writeText(address);
      find('#address-status').textContent = 'Dirección de ejemplo copiada.';
    } catch {
      find('#address-status').textContent = address + ' · Copia manualmente; portapapeles no disponible.';
    }
  });

  find('#service-radius').addEventListener('input', event => {
    const km = Number(event.target.value);
    find('.radius-map').style.setProperty('--radius-size', `${35 + km * 2.1}%`);
    find('#radius-value').textContent = `${km} km`;
    find('#radius-description').textContent = km < 6 ? 'Cobertura local y cercana.' : km < 14 ? 'Cobertura para varias zonas.' : 'Cobertura amplia de ejemplo.';
  });

  const clusters = {
    one: ['Zona norte', 12],
    two: ['Zona centro', 8],
    three: ['Zona sur', 5]
  };
  document.querySelectorAll('[data-cluster]').forEach(button => button.addEventListener('click', () => {
    document.querySelectorAll('[data-cluster]').forEach(item => {
      item.setAttribute('aria-pressed', String(item === button));
    });
    const cluster = clusters[button.dataset.cluster];
    find('#cluster-name').textContent = cluster[0];
    find('#cluster-count').textContent = `${cluster[1]} puntos de interés`;
  }));

})();

// Fichas consumidas por el diálogo común de lab.js; fragmentos, no componentes completos.
window.labCollectionReferences = {
  mood: {
    title: 'Un estado, otra atmósfera',
    description: 'Una paleta pastel que responde a una selección explícita. Cambian el color, la forma decorativa y el mensaje.',
    use: 'Personalización ligera, selección de ambiente o presentación de variantes de un producto.',
    access: 'Cada opción tiene un nombre y aria-pressed. El estado se explica con texto, no solamente con color.',
    code: 'button.addEventListener("click", () => {\n  card.dataset.mood = button.dataset.mood;\n  options.forEach(option => {\n    option.setAttribute("aria-pressed", String(option === button));\n  });\n});'
  },
  ritual: {
    title: 'Pequeños rituales',
    description: 'Una lista amable que traduce las tareas marcadas en progreso visible. Solo se mantiene mientras esta página siga abierta.',
    use: 'Onboarding, listas de preparación o seguimiento de pasos sencillos. No confundir una demo con un registro persistente.',
    access: 'Casillas nativas con etiquetas completas, progress con nombre accesible y un resumen textual de la cantidad.',
    code: 'const done = checkboxes.filter(input => input.checked).length;\nprogress.value = done;\noutput.textContent = `${done} de ${checkboxes.length} hábitos`;'
  },
  billing: {
    title: 'Precios sin sorpresas',
    description: 'Alternancia entre 12 € mensuales y 120 € anuales. El importe anual no se disfraza de mensual y se explica el ahorro.',
    use: 'Comparar modalidades de una suscripción. Los importes de esta tarjeta son ficticios; no hay contratación.',
    access: 'Checkbox etiquetado. Mostrar siempre periodo, total y condiciones, sin información esencial solo en tooltips.',
    code: 'input.addEventListener("change", () => {\n  price.textContent = input.checked ? "120" : "12";\n  period.textContent = input.checked ? "/ año" : "/ mes";\n});'
  },
  neon: {
    title: 'Luz bajo demanda',
    description: 'Un rótulo de neón construido con sombras y contraste, activado por una acción del visitante. Sin parpadeos.',
    use: 'Portadas de eventos, lanzamientos o un acento visual puntual dentro de una interfaz oscura.',
    access: 'Evitar destellos y cambios rápidos de luminosidad. La etiqueta y aria-pressed comunican el encendido sin depender del brillo.',
    code: 'const on = demo.classList.toggle("is-on");\nbutton.setAttribute("aria-pressed", String(on));\nstatus.textContent = on ? "Neón encendido" : "En reposo";'
  },
  ticket: {
    title: 'Una entrada con carácter',
    description: 'Tipografía, bordes duros y color ácido en una entrada digital. La cantidad actualiza un total real dentro de la demo.',
    use: 'Reservas, talleres o entradas. En producción, precios y disponibilidad deben validarse en servidor.',
    access: 'Selector nativo con etiqueta y total textual. El código de barras decorativo no contiene datos ni sirve para acceder a un evento.',
    code: 'const euros = new Intl.NumberFormat("es-ES", {\n  style: "currency", currency: "EUR", maximumFractionDigits: 0\n});\nselect.addEventListener("change", () => {\n  total.textContent = euros.format(Number(select.value) * 24);\n});'
  },
  poster: {
    title: 'Un póster, tres personalidades',
    description: 'Variaciones de color con una única estructura. Los temas viven en atributos y variables CSS, no en copias del componente.',
    use: 'Explorar direcciones de arte, portadas de campañas o variantes de un sistema de diseño.',
    access: 'Nombrar los temas, marcar la selección y comprobar contraste en todas las combinaciones, no solo en la predeterminada.',
    code: 'poster.dataset.theme = "coral";\n/* Cada tema conserva la misma estructura HTML. */\n.poster-demo[data-theme="coral"] {\n  --poster-bg: #ff826c;\n  --poster-ink: #271725;\n}'
  },
  glass: {
    title: 'Cristal a tu medida',
    description: 'Una superficie translúcida sobre un fondo de color. El deslizador permite observar el efecto real de backdrop-filter.',
    use: 'Paneles pequeños, controles flotantes y tarjetas con contexto visual detrás. El desenfoque grande tiene coste de renderizado.',
    access: 'El fondo semitransparente debe mantener contraste incluso con blur a cero o en navegadores sin backdrop-filter.',
    code: '.glass-panel {\n  background: rgb(20 25 50 / 75%);\n  backdrop-filter: blur(var(--blur, 14px));\n}\nslider.addEventListener("input", () => {\n  panel.style.setProperty("--blur", `${slider.value}px`);\n});'
  },
  notifications: {
    title: 'Avisos que no interrumpen',
    description: 'Una pequeña bandeja de avisos apilados. Permanece visible hasta cerrarla y limita la cantidad de mensajes a tres.',
    use: 'Confirmaciones secundarias y novedades. Los errores importantes deben mostrarse junto a su campo o contexto.',
    access: 'Anunciar una sola vez mediante role="status", sin robar el foco al añadir y devolviéndolo a un control válido al cerrar.',
    code: 'const message = document.createElement("span");\nmessage.textContent = "Tu boceto está listo.";\nnotification.append(message, closeButton);\nstack.append(notification);\nstatus.textContent = message.textContent;\n// No usar innerHTML con contenido del usuario.'
  },
  weather: {
    title: 'Un paisaje que cambia contigo',
    description: 'Un selector de hora transforma luz, fondo y texto de una tarjeta atmosférica. No consulta un servicio meteorológico.',
    use: 'Vistas previas de temas día/noche, horarios o estados ambientales de una interfaz.',
    access: 'Hora y estado se muestran en texto. El dibujo es decorativo; el range funciona con teclado y sin arrastrar con ratón.',
    code: 'const hour = Number(slider.value);\nconst period = hour < 7 || hour >= 21 ? "night"\n  : hour < 17 ? "day" : "evening";\ncard.dataset.period = period;\ntime.textContent = `${String(hour).padStart(2, "0")}:00`;'
  },
  orbit: {
    title: 'Órbitas en calma',
    description: 'Trayectorias CSS que comparten una duración configurable. Un único valor controla el ritmo de la composición.',
    use: 'Ilustraciones decorativas y estados de exploración. No usar movimiento infinito para distraer de información importante.',
    access: 'Se detiene con el control de efectos y con prefers-reduced-motion. La velocidad seleccionada también aparece en texto.',
    code: 'slider.addEventListener("input", () => {\n  scene.style.setProperty("--orbit-duration", `${12 / Number(slider.value)}s`);\n});\n/* La órbita usa animation-duration: var(--orbit-duration, 12s). */'
  },
  flip: {
    title: 'La otra cara de la idea',
    description: 'Un giro 3D revela el reverso de una tarjeta. El control se queda fuera de la superficie que gira.',
    use: 'Fichas breves, tarjetas de presentación o pases. Evitar ocultar condiciones de compra o contenido indispensable.',
    access: 'Acción por botón, no solo hover. Ocultar a lectores de pantalla la cara inactiva y mostrar la elegida instantáneamente con movimiento reducido.',
    code: 'const flipped = demo.classList.toggle("is-flipped");\nfront.setAttribute("aria-hidden", String(flipped));\nback.setAttribute("aria-hidden", String(!flipped));\nbutton.setAttribute("aria-pressed", String(flipped));'
  },
  spring: {
    title: 'Un poco de elasticidad',
    description: 'Una transición con una curva de aceleración elástica: anticipación, llegada y un pequeño rebote visual.',
    use: 'Cambios puntuales de posición y confirmaciones visuales. El rebote no debe retrasar la interacción.',
    access: 'El estado final se anuncia en texto. En pausa o con movimiento reducido, el cambio se realiza sin transición.',
    code: 'button.addEventListener("click", () => {\n  const end = demo.classList.toggle("is-end");\n  status.textContent = end ? "Posición final" : "Posición inicial";\n});\n/* Curva elástica: cubic-bezier(.34, 1.4, .64, 1). */'
  },
  palette: {
    title: 'Paletas que se pueden probar',
    description: 'Cuatro combinaciones locales generadas desde una lista pequeña. Se puede regenerar la paleta o copiar una muestra.',
    use: 'Explorar direcciones visuales o debatir una primera combinación. No sustituye una revisión de contraste y accesibilidad.',
    access: 'Cada muestra es un botón con el valor del color en su nombre. El estado de copia se anuncia en texto y no depende solo del color.',
    code: 'button.addEventListener("click", async () => {\n  const color = button.dataset.hex;\n  await navigator.clipboard.writeText(color);\n  status.textContent = `${color} copiado.`;\n});'
  },
  volume: {
    title: 'Un valor, varias señales',
    description: 'Un range nativo actualiza el porcentaje, la barra y una etiqueta textual. No hay audio detrás del control.',
    use: 'Intensidad, zoom o cualquier valor continuo con una salida visible.',
    access: 'El control mantiene teclado nativo y el valor también se representa con texto; la barra es decorativa.',
    code: 'range.addEventListener("input", () => {\n  output.textContent = `${range.value}%`;\n  meter.style.setProperty("--level", `${range.value}%`);\n});'
  },
  search: {
    title: 'Búsqueda local instantánea',
    description: 'Filtra un conjunto pequeño en el navegador. Los botones rápidos rellenan el campo en vez de crear otro estado paralelo.',
    use: 'Catálogos pequeños y listas visibles. Para grandes volúmenes, indexar y buscar en servidor.',
    access: 'Campo con etiqueta, resultados ocultos correctamente y recuento textual actualizado.',
    code: 'const query = input.value.trim().toLocaleLowerCase("es");\nitems.forEach(item => {\n  item.hidden = !item.dataset.search.includes(query);\n});\nstatus.textContent = `${visible} ideas disponibles`;'
  },
  booking: {
    title: 'Elegir una hora disponible',
    description: 'Select nativo para el día y radios etiquetados para la hora; un resumen explica la elección. No se reserva una cita.',
    use: 'Agendas sencillas, citas o turnos. En producción validar disponibilidad en servidor antes de confirmar.',
    access: 'Agrupar horas con fieldset y legend; mostrar un resumen legible antes de cualquier acción real.',
    code: 'const day = select.selectedOptions[0].textContent;\nconst time = form.querySelector(\n  \'input[name="visit-time"]:checked\'\n).value;\nsummary.textContent = `${day}, a las ${time}`;'
  },
  strength: {
    title: 'Orientación privada en el campo',
    description: 'Evalúa longitud y diversidad localmente para ilustrar feedback progresivo. No es un verificador de seguridad ni guarda el texto.',
    use: 'Acompañar un campo de contraseña con requisitos concretos. Nunca sugerir que una clave es segura solo por una puntuación.',
    access: 'Permitir mostrar u ocultar el valor con un botón; no solicitar contraseñas reales en una demo.',
    code: 'const score = [value.length >= 8,\n  /[A-Z]/.test(value), /\\d/.test(value),\n  /[^\\w]/.test(value)\n].filter(Boolean).length;\nlabel.textContent = descriptions[score];'
  },
  loading: {
    title: 'Skeleton con contexto',
    description: 'El esqueleto se sustituye por contenido local para comparar estados. No simula una carga cronometrada ni hace peticiones.',
    use: 'Reservar espacio mientras llega contenido real. Si la operación tarda, ofrecer estado y alternativa de error.',
    access: 'El shimmer es decorativo, se detiene con pausa/reduced motion y un texto de estado describe el cambio.',
    code: 'const loaded = card.classList.toggle("is-loaded");\nbutton.setAttribute("aria-pressed", String(loaded));\nstatus.textContent = loaded\n  ? "Contenido disponible" : "Cargando";'
  },
  atlas: {
    title: 'Mapa ilustrado con puntos de interés',
    description: 'Un callejero SVG esquemático con marcadores seleccionables y una ficha textual sincronizada.',
    use: 'Portadas de sitios, ubicaciones conceptuales y mapas donde importa mostrar relaciones espaciales sin teselas ni SDK externo.',
    access: 'Los marcadores son botones con nombres y estado aria-pressed. El resumen repite el lugar seleccionado en texto.',
    code: 'pins.forEach(pin => pin.addEventListener("click", () => {\n  pins.forEach(item => item.setAttribute(\n    "aria-pressed", String(item === pin)\n  ));\n  summary.textContent = places[pin.dataset.place];\n}));'
  },
  route: {
    title: 'Planificador conceptual de rutas',
    description: 'Selecciona dos ubicaciones y un modo de recorrido. La estimación se obtiene de datos ficticios locales.',
    use: 'Comparadores de recorrido y planificación inicial. Para navegación real se requiere un proveedor y cálculo actualizado.',
    access: 'Selects y botones funcionan con teclado; se impide presentar un trayecto hacia el mismo punto como ruta válida.',
    code: 'const minutes = routes[from][to] +\n  (mode === "wheel" ? 4 : 0);\nstatus.textContent = `${minutes} min`;\n// En una app real, calcula y valida la ruta en el servicio.'
  },
  locator: {
    title: 'Buscador de lugares cercano',
    description: 'Un directorio de tres negocios ficticios que combina búsqueda textual y filtros por categoría.',
    use: 'Directorios con un conjunto pequeño de lugares propios. Esta demo no pide permiso de ubicación ni usa GPS.',
    access: 'Input type=search, filtros marcados con aria-pressed y número de resultados anunciado.',
    code: 'items.forEach(item => {\n  item.hidden = (kind !== "all" && item.dataset.kind !== kind) ||\n    !item.dataset.name.includes(query);\n});\nstatus.textContent = `${visible} lugares`;'
  },
  venue: {
    title: 'Ficha de negocio con contexto',
    description: 'Una tarjeta junta nombre, tipo, horario, dirección ilustrativa y un mapa de barrio abstracto.',
    use: 'Información de contacto y ubicación. Sustituir todos los datos de muestra por dirección y horarios verificados.',
    access: 'El mapa es decorativo y se excluye del árbol accesible; dirección y controles permanecen como texto y botones normales.',
    code: 'button.addEventListener("click", async () => {\n  try {\n    await navigator.clipboard.writeText(address);\n    status.textContent = "Dirección copiada";\n  } catch {\n    status.textContent = address;\n  }\n});'
  },
  radius: {
    title: 'Radio de cobertura',
    description: 'Un deslizador transforma el área esquemática y actualiza los kilómetros y una descripción de alcance.',
    use: 'Presentar de manera aproximada dónde trabaja un negocio. No representa un análisis geográfico ni una posición real.',
    access: 'Range nativo, medida visible y explicación en texto. El área dibujada es ilustrativa, no una escala cartográfica.',
    code: 'range.addEventListener("input", () => {\n  output.textContent = `${range.value} km`;\n  circle.style.setProperty("--radius-size", `${range.value}%`);\n});'
  },
  cluster: {
    title: 'Agrupación de marcadores',
    description: 'Tres burbujas muestran cómo resumir conjuntos densos y permiten consultar el recuento por zona.',
    use: 'Mapas de densidad o resultados geográficos numerosos. No sustituye el acceso a cada punto individual.',
    access: 'Cada grupo es un botón con zona y recuento en su nombre; el grupo activo se indica también con aria-pressed y resumen textual.',
    code: 'clusters.forEach(button => button.addEventListener("click", () => {\n  button.setAttribute("aria-pressed", "true");\n  count.textContent = `${cluster.count} puntos`;\n}));'
  }
};
