# SciCal600 client builds

The Web app remains the single calculation-code source. Native packages wrap the product-neutral `dist/` bundle so calculation behavior stays aligned across platforms.

## GitHub downloads

Every push to `main` builds macOS, Windows, and iOS Simulator packages in `.github/workflows/clients.yml`. Successful main builds are published as a GitHub prerelease named `client-<commit>`. Android remains covered by `.github/workflows/android.yml`, which publishes an installable debug APK after its emulator/offline checks. Version tags (`v*`) publish release assets.

Open the repository **Releases** page and choose the release matching the commit or version you want.

## macOS

The workflow packages Intel and Apple Silicon builds with Electron 44.4.1 using `electron-builder` 26.15.3. The generated DMG/ZIP packages are currently unsigned, so macOS Gatekeeper can show an unidentified-developer warning until Apple signing/notarization credentials are configured.

## Windows

The workflow produces x64 NSIS installer and ZIP packages. They are currently unsigned, so Windows SmartScreen can warn until a trusted code-signing certificate is configured.

## Android

The existing Android workflow builds, signature-checks, installs, launches, and exercises the APK in an Android emulator with networking disabled. Main-branch builds use a development signing key. Production APK signing on version tags uses the repository's Android signing secrets when configured.

## iOS

The workflow generates a Capacitor iOS project and publishes an unsigned iOS Simulator `.app` ZIP. This can be downloaded and used with the iOS Simulator on macOS.

A physical iPhone/iPad install requires Apple code signing and a valid provisioning path. Those credentials cannot be safely invented or committed. To publish an installable device IPA, configure Apple Developer signing in GitHub Secrets/your release environment and extend the archive/export step with the corresponding certificate, provisioning profile, Team ID, and export options.

## Local preparation

```text
npm ci
npm test
npm run brand:check
npm run desktop:prepare
```

For iOS, install the matching platform package without committing it, then sync:

```text
npm install --no-save @capacitor/ios@7.4.3
npm run ios:sync
```

For Android:

```text
npm run android:debug
```
