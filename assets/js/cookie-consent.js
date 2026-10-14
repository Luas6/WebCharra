/* Opt-in simple: no se solicita GTM ni Clarity hasta aceptar. */
(function () {
  'use strict';
  const key = 'wc_consent';
  const lifetime = 180 * 24 * 60 * 60 * 1000;
  const assetBase = new URL('../', document.currentScript.src);
  const siteBase = new URL('../', assetBase);
  let choice = null;
  let trackingLoaded = false;
  let banner;
  let settings;

  function readChoice() {
    // Protección al revocar si el navegador impide guardar el rechazo.
    if (location.href && new URL(location.href).searchParams.get('wc_cookies') === 'rejected') return 'rejected';
    try {
      const raw = localStorage.getItem(key);
      // Compatibilidad con los valores del banner anterior.
      if (['accept', 'accepted', 'reject', 'rejected'].includes(raw)) {
        const value = raw.startsWith('accept') ? 'accepted' : 'rejected';
        saveChoice(value);
        return value;
      }
      const saved = JSON.parse(raw);
      if (saved && saved.version === 1 && Date.now() < saved.expires &&
          ['accepted', 'rejected'].includes(saved.value)) return saved.value;
    } catch (_) { /* Si el almacenamiento está bloqueado, pedir consentimiento. */ }
    return null;
  }

  function saveChoice(value) {
    try {
      localStorage.setItem(key, JSON.stringify({version: 1, value, expires: Date.now() + lifetime}));
      return true;
    } catch (_) { return false; /* La elección sigue siendo válida para esta página. */ }
  }

  function loadScript(src) {
    const script = document.createElement('script');
    script.async = true;
    script.src = src;
    document.head.appendChild(script);
  }

  function loadTracking() {
    if (trackingLoaded || choice !== 'accepted') return;
    trackingLoaded = true;
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({'gtm.start': Date.now(), event: 'gtm.js'});
    loadScript('https://www.googletagmanager.com/gtm.js?id=GTM-W9F727R7');
    window.clarity = window.clarity || function () {
      (window.clarity.q = window.clarity.q || []).push(arguments);
    };
    window.clarity('consentv2', {analytics_Storage: 'granted', ad_Storage: 'denied'});
    loadScript('https://www.clarity.ms/tag/ywr07kcar3');
    // Sin iframe noscript: no debe existir una vía de seguimiento sin consentimiento.
  }

  function clearAnalyticsCookies() {
    // Solo cookies analíticas conocidas y accesibles desde este dominio.
    document.cookie.split(';').forEach(function (cookie) {
      const name = cookie.split('=')[0].trim();
      if (!/^(_ga($|_)|_gid$|_gat($|_)|_clck$|_clsk$)/.test(name)) return;
      const parts = location.hostname.split('.');
      const domains = [''];
      for (let i = 0; i < parts.length; i++) domains.push(parts.slice(i).join('.'));
      const paths = ['/'];
      const segments = location.pathname.split('/').filter(Boolean);
      for (let i = 1; i <= segments.length; i++) paths.push('/' + segments.slice(0, i).join('/'));
      domains.forEach(function (domain) {
        paths.forEach(function (path) {
          document.cookie = name + '=; Max-Age=0; path=' + path +
            (domain ? '; domain=' + domain : '');
        });
      });
    });
  }

  function choose(value) {
    choice = value;
    const persisted = saveChoice(value);
    banner.hidden = true;
    settings.hidden = false;
    if (value === 'accepted') {
      if (location.href) {
        const url = new URL(location.href);
        if (url.searchParams.has('wc_cookies')) {
          url.searchParams.delete('wc_cookies');
          window.history.replaceState(null, '', url.href);
        }
      }
      loadTracking();
    }
    else {
      if (window.clarity) window.clarity('consentv2', {analytics_Storage: 'denied', ad_Storage: 'denied'});
      clearAnalyticsCookies();
      // Descargar GTM no detiene las etiquetas ya ejecutadas: recargar al revocar.
      if (trackingLoaded) {
        if (persisted) location.reload();
        else {
          const url = new URL(location.href);
          url.searchParams.set('wc_cookies', 'rejected');
          location.replace(url.href);
        }
      }
    }
  }

  function init() {
    const style = document.createElement('link');
    style.rel = 'stylesheet';
    style.href = new URL('css/cookie-consent.css', assetBase).href;
    document.head.appendChild(style);
    banner = document.createElement('section');
    banner.id = 'wc-cookie-banner';
    banner.setAttribute('role', 'dialog');
    banner.setAttribute('aria-labelledby', 'wc-cookie-title');
    banner.innerHTML = '<div class="wc-cookie-inner"><div><h2 id="wc-cookie-title">Cookies de análisis</h2>' +
      '<p>Con tu permiso usamos Google Analytics (a través de Google Tag Manager) y Microsoft Clarity para medir visitas y analizar el uso de la web con mapas de calor y grabaciones de sesiones. Puedes rechazar sin dejar de navegar. <a href="' +
      new URL('politica-cookies/', siteBase).href + '">Política de cookies</a>.</p></div>' +
      '<div class="wc-cookie-actions"><button type="button" data-choice="accepted">Aceptar</button>' +
      '<button type="button" data-choice="rejected">Rechazar</button></div></div>';
    banner.querySelectorAll('[data-choice]').forEach(function (button) {
      button.addEventListener('click', function () { choose(button.dataset.choice); });
    });
    settings = document.createElement('button');
    settings.type = 'button';
    settings.id = 'wc-cookie-settings';
    settings.textContent = 'Cookies';
    settings.setAttribute('aria-label', 'Cambiar o retirar consentimiento de cookies');
    settings.addEventListener('click', function () {
      banner.hidden = false;
      settings.hidden = true;
      banner.querySelector('button').focus();
    });
    choice = readChoice();
    banner.hidden = choice !== null;
    settings.hidden = choice === null;
    document.body.append(banner);
    // Mantén el acceso a preferencias en el pie, sin un control flotante permanente.
    const settingsHost = document.querySelector('footer .legal-links, footer .footer-links, footer') || document.body;
    settings.className = 'wc-cookie-settings-link';
    settings.textContent = 'Preferencias de cookies';
    settingsHost.append(settings);
    if (choice === 'accepted') loadTracking();
    else if (choice === 'rejected') clearAnalyticsCookies();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, {once: true});
  else init();
})();
