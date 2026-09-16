# Multi-platform releases / 多端发布

SciCal600 keeps one calculation and interface codebase, then packages it for
the Web, Android, Windows, macOS and iOS.

| Platform | Preview download | Production-signing status |
| --- | --- | --- |
| Web | [scical600.pages.dev](https://scical600.pages.dev/) | HTTPS deployment |
| Android | Development-signed APK | Production keystore workflow is ready |
| Windows | x64 Setup and Portable `.exe` | Preview is unsigned |
| macOS | Intel and Apple Silicon `.dmg` / `.zip` | Preview is unsigned |
| iOS | Simulator `.app.zip` and clearly labelled unsigned IPA | Apple distribution workflow is ready |

## One cloud-built Release

Tags named `multiplatform-v<version>-preview.<number>` call the already-tested
Android, desktop and iOS workflows and publish their outputs in one GitHub
prerelease. The tag version must equal `package.json`. The release is created
only after all platform jobs succeed, including Android emulator installation,
the iOS Simulator launch, unit/browser tests, native lint, identity checks and
the dependency vulnerability gate.

[Open all downloadable Releases](https://github.com/justinfromhkg/SciCal600/releases)

The Release includes one combined `SHA256SUMS.txt` and an explicit signing
notice. An unsigned iOS IPA cannot be installed on a normal iPhone or iPad;
use the Simulator ZIP with Xcode until Apple signing is configured. Windows and
macOS previews may show operating-system publisher warnings.

## Production credentials

Signing keys and passwords belong in protected GitHub Environments, never in
Git history. See [ANDROID.md](ANDROID.md) and [IOS.md](IOS.md) for the exact
secret names. Windows Authenticode and Apple Developer ID/notarization can be
enabled later when the owner supplies those identities.
