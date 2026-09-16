# Security Policy

## Supported versions

Security fixes are applied to the current `main` branch and the newest GitHub
Release. Older previews are retained as historical build artifacts and should
not be treated as supported releases.

## Reporting a vulnerability

Use GitHub's **Security → Report a vulnerability** flow for this repository
when it is available. Please do not publish exploit details in a public issue.
If private vulnerability reporting is unavailable, open a public issue that
contains no sensitive technical details and asks the maintainer to establish a
private contact channel.

Include the affected version or commit, platform, impact, reproduction outline,
and any suggested mitigation. The maintainer should acknowledge a complete
report within seven days and coordinate disclosure after a fix is available.

## Build and signing scope

Cloud workflows run `npm audit`, pin third-party GitHub Actions to immutable
commits, and publish SHA-256 checksums. Checksums detect accidental corruption;
they do not replace platform code signing. Production signing keys are supplied
only through protected GitHub Environments and are never generated or committed
by this repository.
