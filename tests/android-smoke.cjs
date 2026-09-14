const assert = require('node:assert/strict');
const { execFileSync } = require('node:child_process');
const { chromium } = require('playwright');
const adb = (...args) => execFileSync('adb', args, { encoding: 'utf8' });
(async () => {
  let socket;
  for (let i = 0; i < 60; i++) {
    socket = adb('shell', 'cat', '/proc/net/unix').match(/@(webview_devtools_remote[^\s]*)/)?.[1];
    if (socket) break;
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  assert.ok(socket, 'debug WebView socket exists');
  adb('forward', 'tcp:9222', 'localabstract:' + socket);
  const browser = await chromium.connectOverCDP('http://127.0.0.1:9222');
  try {
    const context = browser.contexts()[0];
    const page = context.pages()[0];
    assert.ok(page, 'offline WebView page exists');
    await page.waitForFunction(() => window.SciCalUI && document.documentElement.dataset.native === 'android');
    const external = await page.evaluate(() => [...document.querySelectorAll('script[src],link[rel="stylesheet"]')].map(e => e.src || e.href).filter(url => new URL(url).origin !== location.origin));
    assert.deepEqual(external, [], 'all application scripts/styles are bundled locally');
    for (const view of ['calculator', 'linear-algebra', 'computer-calculator', 'economics-calculator']) {
      await page.evaluate(view => window.SciCalUI.showView(view), view);
      assert.ok(await page.locator('[data-view-panel="' + view + '"]').isVisible(), view + ' works offline');
    }
    await page.evaluate(() => window.SciCalUI.showView('calculator'));
    for (const key of ['AC', '1', '+', '1', 'EXE']) await page.locator('.calc-key[data-key-label="' + key + '"]').click();
    assert.equal((await page.locator('#result').textContent()).trim(), '2', 'offline 1+1');
    await page.evaluate(() => document.querySelector('#settings-dialog').showModal());
    adb('shell', 'input', 'keyevent', 'KEYCODE_BACK');
    await page.waitForFunction(() => !document.querySelector('#settings-dialog').open);
    assert.equal(await page.evaluate(() => window.SciCalUI.view), 'calculator', 'Back closes dialog before navigation');
    await page.evaluate(() => window.SciCalUI.showView('linear-algebra'));
    adb('shell', 'input', 'keyevent', 'KEYCODE_BACK');
    await page.waitForFunction(() => window.SciCalUI.view === 'calculator');
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), 'no horizontal document overflow');
    await page.screenshot({ path: 'artifacts/android-offline.png' });
    console.log('ANDROID_SMOKE_OK: installed APK, offline four workspaces, 1+1, native Back, viewport');
  } finally {
    await browser.close();
    adb('forward', '--remove', 'tcp:9222');
  }
})().catch(error => { console.error(error); process.exit(1); });
