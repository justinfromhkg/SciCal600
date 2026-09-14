# Android delivery checkpoint — complete

Base main: `24daa23f42e2edd65dd261062f9d2013049770ee`.
APK source commit: `b3780b0a55fefa26d2138209443097894ed0b401`.
Branch: `codex/android-apk`. PR: https://github.com/justinfromhkg/SciCal600/pull/4
main was not modified.

## Delivered APK

[Download SciCal600-debug.apk](https://github.com/justinfromhkg/SciCal600/releases/download/android-debug-b3780b0a55fe/SciCal600-debug.apk)

- Build path: `android/app/build/outputs/apk/debug/app-debug.apk`
- Delivery path: `artifacts/SciCal600-debug.apk`
- Size: 4,231,613 bytes
- SHA-256: `64991003fe3bc4372d9760467e30e1f2fd7156c338a51bbd2def1ec275498cfc`
- App ID: `io.github.justinfromhkg.scical600`
- App name: SciCal600

## Actual verification

[Successful cloud run](https://github.com/justinfromhkg/SciCal600/actions/runs/34875429542)

46 unit/integration tests passed; Web build and the existing mobile browser regression suite passed. Two consecutive Android syncs passed. Gradle assembleDebug and lintDebug passed. SDK apksigner verified the APK; aapt verified the package identity.

Android 15 emulator adb install returned Success. With Wi-Fi and mobile data disabled, the app launched successfully. The dedicated Android WebView smoke test passed all four workspaces, 1+1=2, native Back closing a dialog before navigation, native history Back, and no horizontal document overflow. Screenshot evidence is attached to the Actions run.

This establishes installation and the listed emulator interactions, not exhaustive physical-device coverage.

## Remaining owner release configuration

Implementation and debug delivery are complete. Merge/review the PR when desired. Configure the four production signing secrets documented in ANDROID.md before pushing a v* release tag. No production key was generated and no signed production release was attempted. The website's latest Release link becomes downloadable after the first production release; this delivered debug prerelease has its own direct link above.

No further automatic implementation work is needed unless the owner requests a change or CI regresses.
