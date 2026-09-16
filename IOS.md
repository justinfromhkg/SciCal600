# SciCal600 for iOS

SciCal600 uses the same HTML, CSS, and JavaScript application on the web,
Android, and iOS. Capacitor packages those files inside the iOS application, so
the calculator UI and core calculations start without a network connection.
The packaged build removes hosted Google Fonts and uses the existing system-font
fallbacks. Optional live-data tools still need a network connection when the
user explicitly requests their external data.

The iOS bundle identifier is:

```text
io.github.justinfromhkg.scical600
```

## Build outputs

The `iOS packages` GitHub Actions workflow builds two unsigned outputs on a
GitHub-hosted macOS runner:

- `SciCal600-iOS-Simulator.app.zip` is ad-hoc signed and smoke-tested in Apple's
  iOS Simulator. It is not an iPhone installation package.
- `SciCal600-iOS-UNSIGNED.ipa` is an intentionally unsigned device archive for
  inspection or downstream signing. **It cannot be installed on an ordinary
  iPhone or iPad.**

Pull requests and pushes to `main` retain both files as workflow artifacts.
Tags named `multiplatform-v<version>-preview.<number>` publish them alongside
Android, Windows and macOS in one clearly marked GitHub prerelease, with
SHA-256 checksums and an unsigned-artifact notice.

To run the Simulator package on a Mac with Xcode installed:

```bash
unzip SciCal600-iOS-Simulator.app.zip
xcrun simctl boot "iPhone 16" || true
xcrun simctl bootstatus booted -b
xcrun simctl install booted SciCal600.app
xcrun simctl launch booted io.github.justinfromhkg.scical600
```

The exact Simulator model depends on the runtimes installed with Xcode.

## Local project generation

The generated `ios/` directory is recreated from the shared web source and is
not committed by this build workflow. On macOS with Xcode and CocoaPods
installed:

```bash
npm ci
npm run ios:sync
open ios/App/App.xcworkspace
```

If the workspace does not exist, open `ios/App/App.xcodeproj`. The preparation
script is idempotent, injects the iOS bootstrap only once, removes remote font
resources, runs Capacitor sync, and refuses to continue if the generated Xcode
project does not contain the expected bundle identifier.

## Production signing

Apple requires a valid Apple Developer Program signing identity and matching
provisioning profile for a device-installable or App Store IPA. This repository
does not create, commit, or publish a private production key.

Configure the protected GitHub environment named `ios-release`, then add these
environment secrets:

| Secret | Contents |
| --- | --- |
| `IOS_DISTRIBUTION_CERTIFICATE_P12_BASE64` | Base64-encoded Apple Distribution `.p12` certificate and private key |
| `IOS_DISTRIBUTION_CERTIFICATE_PASSWORD` | Password protecting that `.p12` file |
| `IOS_PROVISIONING_PROFILE_BASE64` | Base64-encoded App Store Connect provisioning profile for `io.github.justinfromhkg.scical600` |
| `IOS_TEAM_ID` | Apple Developer Team ID that owns the certificate and profile |

Add the repository variable `IOS_SIGNED_RELEASE_ENABLED=true` only after all
four secrets are configured. Protect the `ios-release` environment with
required reviewers. A pushed `v*` tag then:

1. creates an ephemeral runner keychain;
2. validates that the profile Team ID and application identifier exactly match;
3. archives the app with manual `Apple Distribution` signing;
4. exports an App Store Connect IPA;
5. verifies the signature and bundle identifier;
6. uploads `SciCal600-iOS.ipa` and its checksum to that tag's GitHub Release;
7. removes temporary certificate copies and the imported keychain even when the
   job fails; the installed profile disappears with the ephemeral runner.

The App Store Connect IPA is intended for TestFlight/App Store submission. iOS
does not permit a public GitHub download to be installed on arbitrary devices
unless the IPA is distributed through a permitted Apple channel (for example,
TestFlight, the App Store, or a correctly provisioned Ad Hoc/Enterprise flow).
For TestFlight upload, add a later deployment step using an App Store Connect
API key; keep its issuer ID, key ID, and private `.p8` key in the same protected
environment rather than in this repository.
