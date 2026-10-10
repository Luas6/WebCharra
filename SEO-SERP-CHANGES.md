# SEO, SERP y GEO — WebCharra

## Sustitución de la demo de clínica por artesanía
- Banner ampliado a una escena cinematográfica de tres actos en escritorio: objetos en capas SVG independientes, trayectorias por el viewport, rotación, escala, halos y textos secuenciales. Progreso reversible con el scroll, sin interceptar la rueda ni instalar librerías. Móvil y movimiento reducido conservan la composición estática; sin JavaScript no aparece la escena larga. Probados cinco puntos del recorrido en Chrome, sin desbordamiento ni excepciones JS; carrito comprobado tras el cambio.
- La home enlaza ahora a `/templates/artesania/`: tienda ficticia de velas y objetos decorativos, con carrito de demostración, sin pagos ni pedidos reales.
- La antigua URL `/templates/clinica/` conserva únicamente una página de traslado con `meta refresh` y enlace alternativo a la tienda. No es una redirección HTTP 301: GitHub Pages sirve este HTML estático.
- Se elimina el CSS de clínica que ya no utiliza ninguna página. La nueva demo utiliza sus propios estilos y JavaScript, sin dependencias adicionales.
- La tienda mantiene `noindex,follow` y queda fuera del sitemap comercial. Schema describe una demostración de WebCharra, no una tienda real ni productos con ofertas ficticias.
- `llms.txt` actualizado para identificar la nueva demo y el carácter ficticio de marca, productos y precios.
- Validación local de la tienda en Chrome: 320, 390, 768 y 1280 px sin desbordamiento horizontal; seis productos; filtros, detalle modal, añadir, aumentar cantidades, eliminar y mensaje de finalización ficticia comprobados. Banner con progreso de scroll comprobado; preferencia de movimiento reducido sin animaciones activas. Sin excepciones JavaScript en estas pruebas. Capturas móvil/escritorio revisadas, JSON-LD y sintaxis JavaScript válidos.

## Revisión posterior: schema y breadcrumbs de las páginas existentes
- Sin crear páginas nuevas: revisión de los 13 HTML existentes.
- Todas las páginas cuentan con datos estructurados y una entidad `ProfessionalService` de WebCharra identificada con el mismo `@id`, datos reales de contacto y dirección. `WebSite` y la página correspondiente quedan relacionados mediante `isPartOf` y `publisher`.
- Las cuatro landings de servicios incorporan `Service`, con proveedor, área de servicio, enlace al aviso legal y relaciones con su `WebPage`. No se utiliza `Product` ni se inventan tarifas de mantenimiento.
- El artículo conserva `Article`, autor y publisher vinculados a WebCharra. Las FAQ están relacionadas con sus páginas y corresponden a las preguntas y respuestas visibles.
- Las 12 páginas interiores tienen breadcrumbs visibles y `BreadcrumbList` con el mismo orden, nombres y URL final canonical. No se crea una ruta ficticia `/blog/` ni una categoría intermedia inexistente.
- Legales, laboratorio y demos mantienen su `noindex`. El laboratorio utiliza `CollectionPage`; las demos se describen como páginas de demostración, no como restaurantes, clínicas o entrenadores reales.
- En home se verifican las condiciones visibles: 200/250 € con IVA, dominio excluido, un año de mantenimiento con actualizaciones, backups, seguridad y resolución de incidencias por nuestra parte; dos iteraciones de cambios; sin entrega de código; cambios de contenido solicitados a WebCharra y editor únicamente acordado. Hosting y renovación según presupuesto. También queda visible que WordPress no es la especialidad ni la recomendación por defecto.
- Las ofertas de home incluyen proveedor, IVA, alcance y enlace a las condiciones; se corrige una secuencia textual defectuosa en el nombre de `WebPage`.
- Validaciones locales realizadas: JSON-LD parseable en 13/13 páginas, referencias `@id` definidas, canonical concordante, posiciones y textos de breadcrumbs, coincidencia FAQ visible/schema, recursos internos existentes, UTF-8 estricto y `git diff --check` sin errores de espacios.
- Estas pruebas no sustituyen la validación de elegibilidad de resultados enriquecidos de Google ni garantizan su aparición. No se publica ni se hace commit.

Fecha: 10 de octubre de 2026. Cambios locales; no publicados ni enviados a Search Console.

## URLs creadas
- https://webcharra.es/disenador-web-freelance-salamanca/
- https://webcharra.es/paginas-web-autonomos-salamanca/
- https://webcharra.es/paginas-web-pequenas-empresas-salamanca/
- https://webcharra.es/mantenimiento-web-salamanca/
- https://webcharra.es/blog/cuanto-cuesta-pagina-web-salamanca/

No existía otra URL dedicada a estas intenciones. La home tenía resúmenes de freelance, precios y soporte; se mantienen como puerta de entrada y se enlazan las páginas de detalle. No se crea una página adicional para pequeños negocios ni para WordPress.

## URLs modificadas
- `/`: metadatos, H1, condiciones comerciales, enlaces a las landings y artículo, datos estructurados.
- `/aviso-legal/`: condiciones confirmadas de contratación, dominio, mantenimiento y código.
- `/templates/bar-restaurante/`, `/templates/clinica/`, `/templates/entrenador-personal/`: noindex, canonical y Open Graph con URLs de WebCharra; eliminación de schemas de negocios de demostración.
- `sitemap.xml` y `llms.txt` actualizados. `robots.txt` revisado y conservado: permite rastreo y declara el sitemap correcto.

## Keyword principal de cada página
| URL | Keyword / intención |
|---|---|
| `/` | diseño web Salamanca — contratar diseño y desarrollo |
| `/disenador-web-freelance-salamanca/` | diseñador web freelance Salamanca — trato directo |
| `/paginas-web-autonomos-salamanca/` | páginas web para autónomos Salamanca — presencia de un profesional |
| `/paginas-web-pequenas-empresas-salamanca/` | diseño web para pequeñas empresas Salamanca — servicios y captación local |
| `/mantenimiento-web-salamanca/` | mantenimiento web Salamanca — alcance de soporte |
| `/blog/cuanto-cuesta-pagina-web-salamanca/` | cuánto cuesta una página web en Salamanca — costes antes de contratar |

## Keywords secundarias
- Home: desarrollo web Salamanca, creación de páginas web Salamanca, páginas web Salamanca, diseño de páginas web para empresas.
- Freelance: desarrollador web freelance Salamanca, freelance web Salamanca.
- Autónomos: diseño web autónomos Salamanca, web para autónomos, página web para profesionales, negocio local.
- Pequeñas empresas: páginas web pequeños negocios Salamanca, web para pymes Salamanca, web para comercio local.
- Mantenimiento: soporte web Salamanca, actualizar página web Salamanca, mantenimiento página web Salamanca; WordPress tratado con límites claros, no como especialidad.
- Artículo: precio página web Salamanca, costes de dominio, alojamiento y mantenimiento.

## Title final
Ver inventario de metadatos al final, extraído del HTML implementado.

## Meta description final
Ver inventario de metadatos al final. La descripción de home tiene 153 caracteres.

## H1
Un H1 por página comercial; inventario al final.

## Schema añadido
- Home: WebSite, WebPage y FAQPage junto al ProfessionalService existente; ofertas de 200/250 € con IVA y alcance visible. Dirección concordante con el domicilio ya publicado en el aviso legal, sin crear una sede nueva.
- Landings: WebPage, BreadcrumbList y FAQPage correspondientes al contenido visible, con referencias a la entidad de WebCharra.
- Artículo: Article y breadcrumbs, con FAQ visible y datos de publicación.
- Sin añadir reseñas, puntuaciones, credenciales o resultados ficticios.
- FAQPage expresa el contenido; no garantiza resultados enriquecidos en Google.

## Enlaces internos añadidos
- Home → freelance, autónomos y pequeñas empresas en tarjetas específicas; mantenimiento y artículo junto a los precios.
- Freelance → home, artículo de costes, autónomos, proyectos y contacto.
- Autónomos → home, precios, mantenimiento y contacto.
- Pequeñas empresas → proyectos, servicios relacionados y contacto.
- Mantenimiento → costes, servicios y contacto.
- Artículo → home, autónomos, freelance, mantenimiento y contacto.
- Navegación y footer reutilizados de la home, con anclas hacia sus secciones. Se conservan los proyectos publicados; no se presentan las demos como clientes.

## Cambios técnicos
- HTML estático con contenido rastreable sin ejecutar JavaScript.
- Reutilización de `home.css`, `legal.css`, cabecera y footer; Bootstrap utilities para composición y espaciados. Sin dependencias nuevas ni framework de compilación.
- Canonicals HTTPS autorreferentes y URLs con barra final para las páginas indexables.
- Open Graph, Twitter cards, idioma español y favicon en las páginas comerciales.
- Sitemap con las seis URLs comerciales prioritarias; retirada de demos noindex.
- `llms.txt` con entidad, contacto, precios y límites de servicio confirmados. No es una garantía de indexación ni de aparición en IA.
- Mantenimiento corregido de tres años a uno. Plan Salamanca 200 €, Inicial 250 €, IVA incluido, dominio excluido; hosting y renovación pendientes de presupuesto.
- Dos iteraciones de cambios, actualizaciones, backups, seguridad y resolución de incidencias por WebCharra. No entrega del código; editor de contenido solo si se acuerda como función.
- No se añade una imagen pesada al hero de las nuevas páginas. Imágenes de proyectos con dimensiones y carga diferida; no se añade JS de interacción nuevo.

## Posibles problemas encontrados
- La arquitectura se basa en las intenciones solicitadas y el inventario del sitio, no en un estudio cuantitativo de volúmenes. La consulta de búsqueda externa no devolvió resultados locales útiles: no permite afirmar un análisis medido de la SERP de Salamanca.
- Sin acceso a Search Console ni métricas de campo: la referencia de una búsqueda semanal es información del propietario; no hay mejora de posicionamiento o Core Web Vitals medida.
- No existe `package.json`, comando de build ni pipeline de producción: el HTML es el artefacto que sirve GitHub Pages. No se añade un build artificial.
- Playwright y Puppeteer no están instalados. Se usa Chrome headless disponible en el equipo, sin instalar paquetes, para verificar dimensiones de viewport y desbordamiento. La revisión manual completa en dispositivos reales continúa pendiente.
- Las demos tenían canonicals externos y schemas de negocios de ejemplo pese a figurar en el sitemap. Se corrige sin alterar sus formularios ni su diseño.
- Hosting, precio de renovación del mantenimiento, plazos, método de pago y alcance detallado de cada iteración deben quedar definidos en presupuesto. No se inventan tarifas de ecommerce, costes de terceros ni SLA.
- La seguridad y el SEO no implican inmunidad a incidencias ni posiciones garantizadas.

## Acciones manuales pendientes
1. Validar copy comercial y diseño en móvil, tablet y escritorio antes de publicar.
2. Publicar los archivos en GitHub Pages solo tras aprobación.
3. Verificar las cinco nuevas URLs en producción: HTTP 200, canonical, barra final, HTTPS y ausencia de cadenas de redirecciones.
4. En Search Console, enviar el sitemap y solicitar indexación en este orden:
   - https://webcharra.es/
   - https://webcharra.es/disenador-web-freelance-salamanca/
   - https://webcharra.es/paginas-web-autonomos-salamanca/
   - https://webcharra.es/paginas-web-pequenas-empresas-salamanca/
   - https://webcharra.es/mantenimiento-web-salamanca/
   - https://webcharra.es/blog/cuanto-cuesta-pagina-web-salamanca/
5. Google Business Profile: comprobar nombre, web, teléfono, categoría y área de servicio. Solo usar el domicilio como ubicación visible si cumple los requisitos reales de atención presencial; no añadir sedes para posicionar.
6. Solicitar enlaces legítimos a proyectos o colaboradores cuando proceda; evitar compra masiva de enlaces y directorios sin relevancia.
7. Registrar línea base de impresiones, clics, consultas y páginas; revisar a 4–8 semanas si varias URLs compiten por la misma consulta. Consolidar si hay solapamiento real.
8. Validar schemas con las herramientas de Google/Schema.org, y medir PageSpeed/Lighthouse y Core Web Vitals de campo tras el despliegue.
9. Obtener permiso y evidencia antes de publicar nuevas métricas o testimonios de proyectos. No se añaden resultados no comprobados.

## Inventario final de metadatos

### Home — `/`
- **Title:** Diseño Web en Salamanca para Autónomos y Empresas | WebCharra
- **Meta description:** Diseño y desarrollo web en Salamanca para autónomos y pequeños negocios. Web adaptable, contacto y un año de mantenimiento desde 200 €. Pide presupuesto.
- **H1:** Diseño web en Salamanca para autónomos y pequeños negocios.

### `/disenador-web-freelance-salamanca/`
- **Title:** Diseñador web freelance en Salamanca | WebCharra
- **Meta description:** Diseñador web freelance en Salamanca para crear o mejorar tu web. Trato directo, alcance definido, dos iteraciones de cambios y un año de mantenimiento.
- **H1:** Diseñador web freelance en Salamanca

### `/paginas-web-autonomos-salamanca/`
- **Title:** Páginas web para autónomos en Salamanca | WebCharra
- **Meta description:** Páginas web para autónomos en Salamanca: presenta tus servicios y facilita el contacto. Oferta de 200 € con IVA incluido, alcance y mantenimiento definidos.
- **H1:** Páginas web para autónomos en Salamanca

### `/paginas-web-pequenas-empresas-salamanca/`
- **Title:** Diseño web para pequeñas empresas en Salamanca | WebCharra
- **Meta description:** Diseño web para pequeñas empresas en Salamanca: servicios, portfolio y formularios claros. Valora SEO local, Google Business Profile y analítica según tu alcance.
- **H1:** Diseño web para pequeñas empresas en Salamanca

### `/mantenimiento-web-salamanca/`
- **Title:** Mantenimiento web en Salamanca | WebCharra
- **Meta description:** Mantenimiento web en Salamanca: actualizaciones, copias de seguridad y resolución de incidencias. Conoce el año incluido y el alcance que acordamos contigo.
- **H1:** Mantenimiento web en Salamanca

### `/blog/cuanto-cuesta-pagina-web-salamanca/`
- **Title:** ¿Cuánto cuesta una página web en Salamanca en 2026? | WebCharra
- **Meta description:** Precios reales de WebCharra en 2026: Inicial Salamanca 200 € e Inicial 250 €, IVA incluido. Qué incluyen y qué valorar de dominio, hosting, mantenimiento y SEO.
- **H1:** ¿Cuánto cuesta una página web en Salamanca?

## Comprobaciones ejecutadas
- Auditoría de los 13 HTML: decodificación UTF-8 estricta, búsqueda de secuencias habituales de corrupción, un H1 por página y JSON-LD parseable. Sin errores detectados.
- Enlaces internos, anclas y rutas de assets de los 13 HTML: sin destinos locales inexistentes.
- FAQ visible frente a FAQPage: coincidencia de preguntas y respuestas en las seis páginas comerciales. Recuentos: home 6, freelance 6, autónomos 7, pequeñas empresas 6, mantenimiento 6, artículo 6.
- XML del sitemap válido, con seis URLs.
- Chrome headless con emulación real de viewport a 320, 390, 768 y 1280 px: 24 comprobaciones de las seis páginas comerciales, sin desbordamiento horizontal del documento. Revisión de capturas móviles de mantenimiento y autónomos. Esto no equivale a una revisión visual completa de todos los bloques ni a pruebas en dispositivos físicos.
- Servidor estático local: las seis URLs comerciales y el sitemap responden HTTP 200; canonicals e `index,follow` comprobados. Páginas y recursos se sirven desde los archivos de producción, sin compilación. El proyecto no dispone de comando de build; no se añade uno ni se afirma haber ejecutado un build inexistente.
- Sintaxis del JavaScript existente comprobada con Node; no se modifica el JavaScript.
- Sitio público anterior al despliegue: home, siete rutas existentes, robots y sitemap devuelven HTTP 200. `http://webcharra.es/` y `https://www.webcharra.es/` devuelven 301 hacia `https://webcharra.es/`.
- No se envían formularios, se publica, se hace push, se solicita indexación ni se realiza commit.
- Sin Python, scripts temporales en el repositorio, dependencias nuevas ni CSS/JS de interfaz adicionales. Las capturas de prueba se guardan fuera del proyecto, en el directorio temporal aprobado.
