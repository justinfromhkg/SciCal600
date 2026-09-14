# Android continuation checkpoint

Base main: 24daa23f42e2edd65dd261062f9d2013049770ee.
Work branch: codex/android-apk. Do not push to main.

Implementation: Capacitor 7.4.3, generated native project plus maintained overrides, Back integration, local-only Android Web bundle, icon/insets, debug and secret-signed release Actions.

Next: inspect Android APK Actions on this branch; fix any unit/browser/Gradle failures; obtain generated debug artifact and record real size/SHA-256; confirm emulator installation; create/update PR and deliver actual APK. Do not claim completion until those results exist.
Current session has GitHub tools but no shell/filesystem execution tool; use GitHub Actions for builds.

2026-09-14 checkpoint: commit 8b483ff built a 4,231,610-byte APK; 46 tests, Web browser suite, Gradle assembleDebug/lintDebug and apksigner passed. Android 15 adb install and offline launch succeeded. The extra UI test failed at ordinary CDP connection (unsupported Browser.setDownloadBehavior), so switch to Playwright's dedicated Android API. Next commit also adds npm lockfile and direct debug prerelease delivery.
