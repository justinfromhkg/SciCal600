const { test } = require('node:test');
const assert = require('node:assert/strict');
test('Android Back prioritizes dialogs, LCD menu, history, home and minimize', async () => {
  const { handleBack } = await import('../native/back.js');
  let closed = false, navigated = false, minimized = false;
  const window = { SciCalApp: { closeScreenMenu: () => false },
    SciCalUI: { view: 'calculator', showView: v => { window.SciCalUI.view = v; } },
    history: { back: () => { navigated = true; }, replaceState: () => {} } };
  let dialogs = [{ close: () => { closed = true; } }];
  const args = { window, document: { querySelectorAll: () => dialogs }, canGoBack: true,
    minimize: () => { minimized = true; } };
  assert.equal(handleBack(args), 'dialog'); assert.ok(closed); assert.ok(!navigated);
  dialogs = []; window.SciCalApp.closeScreenMenu = () => true;
  assert.equal(handleBack(args), 'menu'); assert.ok(!navigated);
  window.SciCalApp.closeScreenMenu = () => false;
  assert.equal(handleBack(args), 'history'); assert.ok(navigated);
  args.canGoBack = false; assert.equal(handleBack(args), 'home');
  assert.equal(window.SciCalUI.view, 'about');
  assert.equal(handleBack(args), 'minimize'); assert.ok(minimized);
});
