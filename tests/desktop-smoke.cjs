const assert = require('node:assert/strict');
const { existsSync, readdirSync } = require('node:fs');
const path = require('node:path');
const { _electron: electron } = require('playwright');

function findPackagedExecutable(root) {
  const requested = process.env.SCICAL_DESKTOP_EXECUTABLE;
  if (requested) return path.resolve(requested);
  const candidates = [];
  const visit = (directory) => {
    for (const entry of readdirSync(directory, { withFileTypes: true })) {
      const absolute = path.join(directory, entry.name);
      if (entry.isDirectory()) visit(absolute);
      if (entry.isFile() && (entry.name === 'SciCal600.exe' || entry.name === 'SciCal600')) {
        candidates.push(absolute);
      }
    }
  };
  visit(root);
  const preferred = candidates.find((candidate) => /win-unpacked|\.app[\\/]Contents[\\/]MacOS/.test(candidate));
  return preferred || candidates[0];
}

(async () => {
  const executablePath = findPackagedExecutable(path.resolve('release'));
  assert.ok(executablePath && existsSync(executablePath), 'packaged desktop executable exists');
  const desktopApp = await electron.launch({ executablePath });
  try {
    const page = await desktopApp.firstWindow();
    await page.waitForFunction(() => window.SciCalUI && document.documentElement.dataset.native === 'desktop');
    assert.equal(new URL(page.url()).protocol, 'app:', 'desktop uses the private app protocol');
    const isolation = await page.evaluate(() => ({
      nodeRequire: typeof window.require,
      nodeProcess: typeof window.process,
      remoteAssets: [...document.querySelectorAll('script[src],link[rel="stylesheet"]')]
        .map((element) => element.src || element.href)
        .filter((url) => new URL(url).origin !== location.origin),
    }));
    assert.equal(isolation.nodeRequire, 'undefined', 'Node require is not exposed');
    assert.equal(isolation.nodeProcess, 'undefined', 'Node process is not exposed');
    assert.deepEqual(isolation.remoteAssets, [], 'initial scripts and styles are local');
    for (const view of ['calculator', 'linear-algebra', 'computer-calculator', 'economics-calculator']) {
      await page.evaluate((nextView) => window.SciCalUI.showView(nextView), view);
      assert.ok(await page.locator(`[data-view-panel="${view}"]`).isVisible(), `${view} opens`);
    }
    await page.evaluate(() => window.SciCalUI.showView('calculator'));
    for (const key of ['AC', '1', '+', '1', 'EXE']) {
      await page.locator(`.calc-key[data-key-label="${key}"]`).click();
    }
    assert.equal((await page.locator('#result').textContent()).trim(), '2', 'desktop 1+1');
    console.log(`DESKTOP_SMOKE_OK: ${page.url()}, isolated renderer, four workspaces, 1+1`);
  } finally {
    await desktopApp.close();
  }
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
