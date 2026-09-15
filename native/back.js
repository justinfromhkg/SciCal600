export function handleBack({ window, document, canGoBack, minimize }) {
  const dialog = [...document.querySelectorAll('dialog[open]')].at(-1);
  if (dialog) { dialog.close(); return 'dialog'; }
  if (window.SciCalApp?.closeScreenMenu()) return 'menu';
  if (canGoBack) { window.history.back(); return 'history'; }
  if (window.SciCalUI?.view !== 'about') {
    window.SciCalUI?.showView('about', false);
    window.history.replaceState({ view: 'about' }, '', '/');
    return 'home';
  }
  minimize();
  return 'minimize';
}
