# SciCal600 for Windows and macOS

SciCal600 uses Electron only as a secure desktop shell around the same local Web
bundle used by the other editions. The renderer is loaded through the private
`app://scical600.local` protocol rather than `file://`; Node.js integration is
disabled, context isolation and Chromium sandboxing are enabled, permissions
are denied by default, and navigation is restricted to the app plus a small
allowlist of project links.

## Downloads

Open [GitHub Releases](https://github.com/justinfromhkg/SciCal600/releases).
The multi-platform preview contains:

- Windows x64 one-click installer (`Setup.exe`)
- Windows x64 portable executable (`Portable.exe`)
- macOS Intel x64 (`.dmg` and `.zip`)
- macOS Apple Silicon arm64 (`.dmg` and `.zip`)

Automated preview packages are intentionally unsigned unless the owner provides
private code-signing credentials. Windows SmartScreen and macOS Gatekeeper may
therefore display an unknown-publisher warning. Verify the SHA-256 file in the
same Release; a public project must not manufacture a replacement production
identity.

## Local build

With Node.js 22 or newer:

```text
npm ci
npm test
npm run desktop:build
```

The current platform's packages are written to `release/`. CI builds Windows
x64 and both macOS architectures on their corresponding GitHub-hosted runners.
