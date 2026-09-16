import { Capacitor } from '@capacitor/core';
import { App } from '@capacitor/app';
import { handleBack } from './back.js';

if (Capacitor.isNativePlatform()) {
  document.documentElement.dataset.native = 'android';
  App.addListener('backButton', ({ canGoBack }) => {
    handleBack({ window, document, canGoBack, minimize: () => App.minimizeApp() });
  }).catch(console.error);
}
