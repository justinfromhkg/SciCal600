import { Capacitor, SystemBars, SystemBarsStyle } from '@capacitor/core';
import { App } from '@capacitor/app';
import { Clipboard } from '@capacitor/clipboard';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { Share } from '@capacitor/share';
import { handleBack } from './back.js';
import { viewFromAndroidShortcutUrl } from './android-shortcuts.js';
import { installResultCopy } from './copy-result.js';
import { installButtonHaptics } from './haptics.js';
import { installResultShare } from './share-result.js';
import { installAndroidSystemBars } from './system-bars.js';

if (Capacitor.isNativePlatform()) {
  document.documentElement.dataset.native = 'android';
  installAndroidSystemBars({ document, systemBars: SystemBars, styles: SystemBarsStyle });
  installButtonHaptics({
    document,
    impact: () => Haptics.impact({ style: ImpactStyle.Light }).then(() => {
      document.documentElement.dataset.androidHaptics = 'active';
    }).catch(() => {
      document.documentElement.dataset.androidHaptics = 'unavailable';
    }),
  });
  document.documentElement.dataset.androidHaptics = 'ready';
  installResultCopy({
    document,
    write: (options) => Clipboard.write(options),
    translate: (key) => window.SciCalUI?.translate(key) || key,
  });
  installResultShare({
    document,
    canShare: () => Share.canShare(),
    share: (options) => Share.share(options),
    translate: (key) => window.SciCalUI?.translate(key) || key,
  });
  const openShortcut = ({ url } = {}) => {
    const view = viewFromAndroidShortcutUrl(url);
    if (!view) return false;
    if (document.documentElement.dataset.androidShortcutUrl !== url || window.SciCalUI?.view !== view) {
      window.SciCalUI?.showView(view);
      document.documentElement.dataset.androidShortcutUrl = url;
      document.documentElement.dataset.androidShortcut = view;
    }
    return true;
  };
  App.addListener('appUrlOpen', openShortcut).catch((error) => console.error(error));
  App.getLaunchUrl().then(openShortcut).catch((error) => console.error(error));
  App.addListener('backButton', ({ canGoBack }) => {
    const handled = Number(document.documentElement.dataset.androidBackEvents || '0') + 1;
    document.documentElement.dataset.androidBackEvents = String(handled);
    handleBack({ window, document, canGoBack, minimize: () => App.minimizeApp() });
  }).then(async () => {
    // addListener posts registration to Capacitor's native handler. A native
    // App call queued behind it is the readiness barrier used by CI before
    // sending exactly one system Back event.
    await App.getState();
    document.documentElement.dataset.androidBackReady = 'true';
  }).catch((error) => {
    document.documentElement.dataset.androidBackReady = 'error';
    console.error(error);
  });
}
