const assert = require('node:assert/strict');
const { execFileSync } = require('node:child_process');
const { _android: android } = require('playwright');
const adb = (...args) => execFileSync('adb', args, { encoding: 'utf8' });
(async () => {
  const [device] = await android.devices();
  assert.ok(device, 'Android emulator exists');
  try {
    const webview = await device.webView({ pkg: 'io.github.justinfromhkg.scical600' });
    const page = await webview.page();
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
    const pressBackUntil = async (description, condition) => {
      for (let attempt = 1; attempt <= 3; attempt += 1) {
        adb('shell', 'input', 'keyevent', 'KEYCODE_BACK');
        for (let poll = 0; poll < 20; poll += 1) {
          if (await condition()) return;
          await page.waitForTimeout(250);
        }
      }
      throw new Error(`Android Back did not ${description} after 3 attempts`);
    };
    await page.evaluate(() => document.querySelector('#settings-dialog').showModal());
    await pressBackUntil('close the settings dialog', () => page.evaluate(() => !document.querySelector('#settings-dialog').open));
    assert.equal(await page.evaluate(() => window.SciCalUI.view), 'calculator', 'Back closes dialog before navigation');
    await page.evaluate(() => window.SciCalUI.showView('linear-algebra'));
    await pressBackUntil('return to the calculator', () => page.evaluate(() => window.SciCalUI.view === 'calculator'));
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), 'no horizontal document overflow');
    await page.screenshot({ path: 'artifacts/android-offline.png' });
    console.log('ANDROID_SMOKE_OK: installed APK, offline four workspaces, 1+1, native Back, viewport');
  } finally {
    await device.close();
  }
})().catch(error => { console.error(error); process.exit(1); });
