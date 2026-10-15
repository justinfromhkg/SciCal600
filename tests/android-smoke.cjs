const assert = require('node:assert/strict');
const { _android: android } = require('playwright');
const { attachStableAppPage, ensureAppWindowFocus } = require('./android-webview-ready.cjs');
(async () => {
  const [device] = await android.devices();
  assert.ok(device, 'Android emulator exists');
  try {
    // A fresh API 35 emulator reports boot complete before its final package
    // and display-asset updates. Those updates can legitimately relaunch the
    // foreground Activity and replace its WebView, so attach only after the
    // short system-settling window. The override is useful for local devices.
    const startupSettleMs = Number(process.env.ANDROID_SMOKE_SETTLE_MS || 20_000);
    assert.ok(Number.isFinite(startupSettleMs) && startupSettleMs >= 0, 'valid Android startup settle time');
    await new Promise(resolve => setTimeout(resolve, startupSettleMs));
    await ensureAppWindowFocus(device, {
      onRetry: ({ attempt, focus }) => {
        console.warn(`Android focus attempt ${attempt} found a non-app window; restoring SciCal600: ${focus || 'unknown'}`);
      },
    });
    const page = await attachStableAppPage(device, {
      onRetry: ({ attempt, error, pid, processIds }) => {
        console.warn(`Android startup WebView attempt ${attempt} (WebView pid ${pid || 'unknown'}, app pid ${processIds}) closed; reconnecting: ${error.message}`);
      },
    });
    assert.ok(page, 'offline WebView page exists');
    assert.equal(await page.locator('html').getAttribute('data-android-back-ready'), 'true', 'native Back listener registered');
    await page.waitForFunction(() => document.documentElement.dataset.androidSystemBars === 'ready');
    const initialTheme = await page.locator('html').getAttribute('data-theme');
    const initialSystemBarsStyle = initialTheme === 'bright' ? 'LIGHT' : 'DARK';
    assert.equal(await page.locator('html').getAttribute('data-android-system-bars-style'), initialSystemBarsStyle, 'system bars match the saved theme');
    await page.locator('#theme-toggle').click();
    const toggledSystemBarsStyle = initialSystemBarsStyle === 'DARK' ? 'LIGHT' : 'DARK';
    await page.waitForFunction(style => document.documentElement.dataset.androidSystemBarsStyle === style, toggledSystemBarsStyle);
    await page.locator('#theme-toggle').click();
    await page.waitForFunction(style => document.documentElement.dataset.androidSystemBarsStyle === style, initialSystemBarsStyle);
    assert.ok(['ready', 'active'].includes(await page.locator('html').getAttribute('data-android-haptics')), 'native button haptics registered');
    await page.waitForFunction(() => document.documentElement.dataset.androidCopy === 'ready');
    await page.waitForFunction(() => document.documentElement.dataset.androidShare === 'ready');
    const external = await page.evaluate(() => [...document.querySelectorAll('script[src],link[rel="stylesheet"]')].map(e => e.src || e.href).filter(url => new URL(url).origin !== location.origin));
    assert.deepEqual(external, [], 'all application scripts/styles are bundled locally');
    for (const view of ['calculator', 'linear-algebra', 'statistics-calculator', 'probability-calculator', 'computer-calculator', 'economics-calculator']) {
      await page.evaluate(view => window.SciCalUI.showView(view), view);
      assert.ok(await page.locator('[data-view-panel="' + view + '"]').isVisible(), view + ' works offline');
    }
    await device.shell('am start -W -a android.intent.action.VIEW -d scical600://linear-algebra -n io.github.justinfromhkg.scical600/.MainActivity');
    await page.waitForFunction(() => window.SciCalUI.view === 'linear-algebra');
    assert.equal(await page.locator('html').getAttribute('data-android-shortcut'), 'linear-algebra', 'launcher shortcut opens its offline workspace');
    await page.evaluate(() => window.SciCalUI.showView('calculator'));
    assert.ok(await page.locator('#android-copy-result').isVisible(), 'native result copying is available');
    assert.ok(await page.locator('#android-share-result').isVisible(), 'native result sharing is available');
    for (const key of ['AC', '1', '+', '1', 'EXE']) await page.locator('.calc-key[data-key-label="' + key + '"]').click();
    assert.equal((await page.locator('#result').textContent()).trim(), '2', 'offline 1+1');
    const copyEvents = Number(await page.locator('html').getAttribute('data-android-copy-events') || '0');
    await page.locator('#android-copy-result').click();
    await page.waitForFunction((previous) => Number(document.documentElement.dataset.androidCopyEvents || '0') > previous, copyEvents);
    await page.waitForFunction(() => document.documentElement.dataset.androidHaptics === 'active');
    const pressBackOnce = async (description, condition) => {
      const before = Number(await page.locator('html').getAttribute('data-android-back-events') || '0');
      await device.shell('input keyevent KEYCODE_BACK');
      await page.waitForFunction((previous) => Number(document.documentElement.dataset.androidBackEvents || '0') > previous, before);
      const after = Number(await page.locator('html').getAttribute('data-android-back-events') || '0');
      assert.equal(after, before + 1, `${description}: exactly one native Back event`);
      for (let poll = 0; poll < 20; poll += 1) {
        if (await condition()) return;
        await page.waitForTimeout(250);
      }
      throw new Error(`Android Back event fired once but did not ${description}`);
    };
    for (let cycle = 1; cycle <= 3; cycle += 1) {
      await page.evaluate(() => document.querySelector('#settings-dialog').showModal());
      await pressBackOnce(`close the settings dialog (cycle ${cycle})`, () => page.evaluate(() => !document.querySelector('#settings-dialog').open));
      assert.equal(await page.evaluate(() => window.SciCalUI.view), 'calculator', 'Back closes dialog before navigation');
      await page.evaluate(() => window.SciCalUI.showView('linear-algebra'));
      await pressBackOnce(`return to the calculator (cycle ${cycle})`, () => page.evaluate(() => window.SciCalUI.view === 'calculator'));
    }
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), 'no horizontal document overflow');
    await page.screenshot({ path: 'artifacts/android-offline.png' });
    console.log('ANDROID_SMOKE_OK: installed APK, offline workspaces, launcher shortcut, theme-aware native system bars, haptics, copy and sharing, 1+1, six native Back events, viewport');
  } finally {
    await device.close();
  }
})().catch(error => { console.error(error); process.exit(1); });
