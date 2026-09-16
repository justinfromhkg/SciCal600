# SciCal600

SciCal600 is an independent Smart Calculator platform for Web, Android, iOS, macOS, and Windows. The same product-neutral calculation engines power the scientific, Linear Algebra, Computer Calculator, and Economics Calculator workspaces.

## Download and use

- **Web:** https://scical600.pages.dev/
- **macOS / Windows / iOS Simulator:** open this repository's **Releases** page and download the client build for the desired commit/version.
- **Android:** install the verified APK published by the Android GitHub Actions workflow/release.
- Detailed packaging and signing notes: [CLIENTS.md](CLIENTS.md)

Main-branch client builds are automated. macOS and Windows packages are currently unsigned, so their operating systems can show publisher warnings. The iOS artifact is an unsigned Simulator build; a physical iPhone/iPad build requires Apple Developer signing credentials and provisioning.

## Product independence

SciCal600 does not require a specific third-party calculator, firmware, ROM, manual, logo, product artwork, or proprietary calculator service to run. Calculation behavior is implemented in this repository. Production bundles are checked for legacy third-party product labels before native packaging.

See [BRAND-INDEPENDENCE.md](BRAND-INDEPENDENCE.md) for the repository policy. This engineering policy reduces avoidable brand/copying risk but is not a substitute for legal review before commercial distribution or advertising.

## Workspaces

Direct Web routes:

- `/scientific-calculator`
- `/linear-algebra`
- `/computer-calculator`
- `/economics-calculator`
- `/manual`
- `/about`

The project has no browser runtime package dependency. Native wrappers bundle the same static `dist/` application for offline use.

## Test and build

```text
npm ci
npm test
npm run brand:check
```

`npm run brand:check` first builds `dist/`, then verifies that the shipped bundle does not contain the retired third-party model/vendor labels.

Browser regression tests:

```text
npx playwright install chromium
npm run test:browser
```

## Native clients

Android:

```text
npm run android:debug
```

Desktop staging:

```text
npm run desktop:prepare
```

The GitHub workflow packages the staged app with pinned Electron/electron-builder versions on native macOS and Windows runners.

iOS project generation:

```text
npm install --no-save @capacitor/ios@7.4.3
npm run ios:sync
```

The iOS GitHub job builds an unsigned Simulator app. Physical-device distribution requires Apple signing/provisioning credentials; they must be supplied through secure CI secrets rather than committed to the repository.

## Implemented calculation features

- Two-line editable expression/result display with replay history
- Calculation priority, brackets, implicit multiplication, percentages, powers, roots, factorial, and absolute value
- Trigonometric, inverse/hyperbolic, exponential, logarithmic, permutation, and combination functions
- Degree, radian, and grad angle units
- `Ans`, independent memory, fractions/decimals, DMS, normal/fixed/scientific/engineering notation
- Complex arithmetic in rectangular and polar form
- BASE-N arithmetic and logical operations
- Weighted single-variable statistics and multiple regression models
- Four persistent program areas with safe execution controls
- Searchable educational formula and scientific-constant catalogues
- Linear Algebra operations including inverse, determinant, adjugate, eigenvalues, and eigenvectors
- Computer-number-system, ALU, IEEE 754, LMC, memory, bus, cache, disk, DMA, and performance tools
- Economics tools for FX reference data, Hong Kong public rates, interest, savings, mortgage scenarios, APR/IRR, amortization, budgeting, and real returns
- Twelve interface languages and responsive phone/desktop layouts
- Parser implementation without JavaScript `eval`

## Cloudflare Pages

The production deployment workflow is `.github/workflows/cloudflare-pages.yml`. To enable automatic production deployment, configure the repository's Cloudflare credentials and `CLOUDFLARE_PAGES_ENABLED=true`; secrets must not be committed.

Manual deployment:

```text
npm run deploy
```

## GitHub Actions

- `.github/workflows/cloudflare-pages.yml`: Web deployment
- `.github/workflows/android.yml`: Android build, verification, emulator smoke test, APK publishing
- `.github/workflows/clients.yml`: product-neutral validation, macOS/Windows packaging, iOS Simulator build, GitHub Release publishing

The workflows are intentionally separated so a platform-specific packaging failure does not overwrite or silently replace another platform's build logic.
