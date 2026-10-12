# Analítica y consentimiento

Integración sencilla, sin Google Consent Mode: GTM `GTM-W9F727R7` y Clarity
`ywr07kcar3` se solicitan solo después de aceptar. Sin aceptación, no se
cargan estos proveedores, ni siquiera con JavaScript desactivado.

## Configuración externa pendiente

En la comprobación del 12 de octubre de 2026, el recurso público
`https://www.googletagmanager.com/gtm.js?id=GTM-W9F727R7` devuelve
`"tags": []` y `"rules": []`: el contenedor publicado no tiene etiquetas.
Por tanto, actualmente no hay una etiqueta GA4 publicada que mida visitas.

- GTM no es GA4: crear y publicar una etiqueta de Google con el ID de medición
  `G-…` de la propiedad GA4 y activador de todas las páginas. Si ya existe,
  comprobarla en Preview de GTM y en Tiempo real/DebugView de GA4.
- No añadir otra etiqueta Clarity en GTM: el sitio ya lo carga directamente.
- Limitar el contenedor a las herramientas analíticas informadas en el panel;
  no añadir publicidad u otras finalidades sin revisar el consentimiento.
- Revisar en Clarity el enmascaramiento de contenido sensible, especialmente
  formularios, y configurar retención y privacidad en ambos proveedores.
- El script comunica a Clarity `analytics_Storage: granted` y `ad_Storage: denied`
  mediante su API `consentv2` tras aceptar. Esta API de Microsoft no implica
  implementar Google Consent Mode ni cargar Clarity antes de aceptar.
- Confirmar el inventario real de cookies y sus duraciones con la configuración
  publicada antes de dar por cerrada la documentación legal.

## Comprobación local

Servir la carpeta por HTTP (por ejemplo con Live Server), en lugar de `file://`.
Las rutas relativas admiten páginas anidadas. El 404 usa la raíz del dominio.

1. Borrar `wc_consent` del almacenamiento local o usar un perfil nuevo.
2. Abrir Network: sin elegir o al rechazar no debe haber solicitudes a
   `googletagmanager.com` ni `clarity.ms` procedentes de esta integración.
3. Aceptar: deben aparecer ambos scripts, una sola vez por página.
4. Recargar y navegar: la elección debe mantenerse.
5. Pulsar «Cookies» y rechazar: se guarda el rechazo, se eliminan cookies
   analíticas propias conocidas y se recarga para detener las etiquetas activas.
   No se pueden eliminar desde aquí cookies de dominios de terceros ni datos ya enviados.

La decisión caduca a los 180 días. Si localStorage está bloqueado, se aplica
solo a la página actual y se volverá a pedir en la siguiente navegación.

Pruebas sin dependencias: `node tests/cookie-consent.test.cjs`.
Usan un DOM simulado, no sustituyen una prueba de Network en navegador ni
validan la configuración publicada del contenedor GTM.

También se comprobó el script compartido en Chrome headless con una página
local de prueba: banner visible, rechazo sin solicitudes analíticas, aceptación
con una solicitud de GTM y otra de Clarity y sin excepciones JavaScript.
Las solicitudes a los proveedores se bloquearon durante esa prueba;
no se validó la recepción de datos en sus paneles.
