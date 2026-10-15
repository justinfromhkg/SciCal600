const test = require('node:test');
const assert = require('node:assert/strict');

function fakeDocument(theme = 'dark') {
  const listeners = new Map();
  return {
    documentElement: { dataset: { theme } },
    addEventListener(name, listener) { listeners.set(name, listener); },
    removeEventListener(name, listener) {
      if (listeners.get(name) === listener) listeners.delete(name);
    },
    dispatchTheme(theme) { listeners.get('scical600:themechange')?.({ detail: { theme } }); },
    hasThemeListener() { return listeners.has('scical600:themechange'); },
  };
}

test('keeps Android system-bar content synchronized with the app theme', async () => {
  const { installAndroidSystemBars } = await import('../native/system-bars.js');
  const calls = [];
  const document = fakeDocument();
  const systemBars = {
    setStyle: async (options) => calls.push(['style', options]),
    show: async () => calls.push(['show']),
  };

  const installed = installAndroidSystemBars({
    document,
    systemBars,
    styles: { Dark: 'DARK', Light: 'LIGHT' },
  });
  assert.equal(await installed.ready, true);
  assert.deepEqual(calls, [['style', { style: 'DARK' }], ['show']]);
  assert.equal(document.documentElement.dataset.androidSystemBars, 'ready');
  assert.equal(document.documentElement.dataset.androidSystemBarsStyle, 'DARK');

  document.dispatchTheme('bright');
  await new Promise(resolve => setImmediate(resolve));
  assert.deepEqual(calls.slice(-2), [['style', { style: 'LIGHT' }], ['show']]);
  assert.equal(document.documentElement.dataset.androidSystemBarsStyle, 'LIGHT');

  installed.dispose();
  assert.equal(document.hasThemeListener(), false);
});

test('keeps the Android calculator usable when system-bar control is unavailable', async () => {
  const { configureAndroidSystemBars } = await import('../native/system-bars.js');
  const document = { documentElement: { dataset: {} } };
  const result = await configureAndroidSystemBars({
    document,
    systemBars: { setStyle: async () => { throw new Error('unavailable'); } },
    style: 'DARK',
  });
  assert.equal(result, false);
  assert.equal(document.documentElement.dataset.androidSystemBars, 'unavailable');
  assert.equal(document.documentElement.dataset.androidSystemBarsStyle, undefined);
});
