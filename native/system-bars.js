export function systemBarsStyleForTheme(theme, styles) {
  return theme === 'bright' ? styles.Light : styles.Dark;
}

export async function configureAndroidSystemBars({ document, systemBars, style }) {
  try {
    await systemBars.setStyle({ style });
    await systemBars.show();
    document.documentElement.dataset.androidSystemBars = 'ready';
    document.documentElement.dataset.androidSystemBarsStyle = style;
    return true;
  } catch {
    document.documentElement.dataset.androidSystemBars = 'unavailable';
    delete document.documentElement.dataset.androidSystemBarsStyle;
    return false;
  }
}

export function installAndroidSystemBars({ document, systemBars, styles }) {
  let pending = Promise.resolve();
  const sync = (theme = document.documentElement.dataset.theme) => {
    const style = systemBarsStyleForTheme(theme, styles);
    pending = pending.then(() => configureAndroidSystemBars({ document, systemBars, style }));
    return pending;
  };
  const onThemeChange = (event) => {
    void sync(event.detail?.theme);
  };

  document.addEventListener('scical600:themechange', onThemeChange);
  return {
    ready: sync(),
    dispose: () => document.removeEventListener('scical600:themechange', onThemeChange),
  };
}
