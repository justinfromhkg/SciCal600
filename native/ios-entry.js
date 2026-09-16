import { Capacitor } from '@capacitor/core';

if (Capacitor.isNativePlatform()) {
  document.documentElement.dataset.native = 'ios';
}
