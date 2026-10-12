// Prueba sin dependencias: DOM simulado, sin solicitudes a proveedores.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const source = fs.readFileSync(require('node:path').join(__dirname, '../assets/js/cookie-consent.js'), 'utf8');

function page(saved, blocked = false, href = 'http://localhost:8080/', scriptSrc = 'http://localhost:8080/assets/js/cookie-consent.js') {
  const nodes = [];
  const requests = [];
  const styles = [];
  let ready;
  let reloads = 0;
  let redirected;
  const store = new Map(saved ? [['wc_consent', saved]] : []);
  function element(tag) {
    return {
      tag, dataset: {}, hidden: false, listeners: {},
      setAttribute() {}, focus() {},
      addEventListener(type, fn) { this.listeners[type] = fn; },
      querySelectorAll() {
        return this.buttons ||= ['accepted', 'rejected'].map(value => {
          const button = element('button');
          button.dataset.choice = value;
          return button;
        });
      },
      querySelector() { return this.querySelectorAll()[0]; }
    };
  }
  const document = {
    readyState: 'loading', cookie: '',
    currentScript: {src: scriptSrc},
    head: {appendChild(node) {
      if (node.tag === 'script') requests.push(node.src);
      if (node.tag === 'link') styles.push(node.href);
    }},
    body: null,
    createElement: element,
    addEventListener(type, fn) { if (type === 'DOMContentLoaded') ready = fn; }
  };
  const context = {
    document, URL, Date, window: {history: {replaceState() {}}},
    location: {href, hostname: 'localhost', pathname: '/', reload() { reloads++; }, replace(url) { redirected = url; }},
    localStorage: {
      getItem(key) { if (blocked) throw Error('blocked'); return store.get(key) || null; },
      setItem(key, value) { if (blocked) throw Error('blocked'); store.set(key, value); }
    }
  };
  vm.runInNewContext(source, context);
  assert.equal(requests.length, 0, 'No tracking antes de DOMContentLoaded');
  document.body = {append(...elements) { nodes.push(...elements); }};
  ready();
  return {
    banner: nodes[0], settings: nodes[1], requests, styles, store, window: context.window,
    get reloads() { return reloads; },
    get redirected() { return redirected; },
    choose(value) { nodes[0].buttons.find(b => b.dataset.choice === value).listeners.click(); }
  };
}

const fresh = page();
assert.equal(fresh.banner.hidden, false);
assert.equal(fresh.requests.length, 0);
assert.equal(fresh.window.clarity, undefined);
fresh.choose('accepted');
assert.equal(fresh.banner.hidden, true);
assert.equal(fresh.requests.length, 2);
assert.match(fresh.requests[0], /GTM-W9F727R7/);
assert.match(fresh.requests[1], /ywr07kcar3/);
assert.equal(fresh.window.clarity.q[0][0], 'consentv2');
assert.equal(fresh.window.clarity.q[0][1].analytics_Storage, 'granted');
assert.equal(fresh.window.clarity.q[0][1].ad_Storage, 'denied');
const accepted = fresh.store.get('wc_consent');
assert.equal(page(accepted).requests.length, 2);
fresh.settings.listeners.click();
assert.equal(fresh.banner.hidden, false);
fresh.choose('accepted');
assert.equal(fresh.requests.length, 2, 'No duplicar scripts');
fresh.choose('rejected');
assert.equal(fresh.reloads, 1, 'Recargar para detener etiquetas activas');
assert.equal(page(fresh.store.get('wc_consent')).requests.length, 0);

const rejected = page();
rejected.choose('rejected');
assert.equal(rejected.requests.length, 0);
assert.equal(rejected.window.clarity, undefined);
assert.equal(page(rejected.store.get('wc_consent')).banner.hidden, true);
const unavailable = page(null, true);
assert.equal(unavailable.banner.hidden, false);
unavailable.choose('accepted');
assert.equal(unavailable.requests.length, 2);
unavailable.choose('rejected');
assert.match(unavailable.redirected, /wc_cookies=rejected/);
assert.equal(page(accepted, true, unavailable.redirected).requests.length, 0);
assert.equal(page('accept').requests.length, 2);
assert.equal(page('reject').requests.length, 0);
assert.equal(page('{invalid').banner.hidden, false);
assert.equal(page(JSON.stringify({version: 1, value: 'accepted', expires: 1})).requests.length, 0);
const nested = page(null, false, 'http://localhost:8080/blog/articulo/');
assert.equal(nested.styles[0], 'http://localhost:8080/assets/css/cookie-consent.css');
assert.match(nested.banner.innerHTML, /href="http:\/\/localhost:8080\/politica-cookies\/"/);
const subdirectory = page(null, false, 'http://localhost:8080/web/templates/demo/', 'http://localhost:8080/web/assets/js/cookie-consent.js');
assert.equal(subdirectory.styles[0], 'http://localhost:8080/web/assets/css/cookie-consent.css');
assert.match(subdirectory.banner.innerHTML, /href="http:\/\/localhost:8080\/web\/politica-cookies\/"/);
console.log('OK: inicio, aceptar, rechazar, persistencia, revocación, caducidad, migración y almacenamiento bloqueado.');
