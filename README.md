# SciCal600 multi-platform / 多端应用

[Download Android, Windows, macOS and iOS builds / 下载多端安装包](https://github.com/justinfromhkg/SciCal600/releases)

[Platform and signing guide / 多端与签名说明](MULTIPLATFORM.md) · [Android](ANDROID.md) · [Windows and macOS](DESKTOP.md) · [iOS](IOS.md)

SciCal600 is an independent Smart Calculator platform for Web, Android, Windows, macOS and iOS. All editions share the same calculator code, and GitHub Actions builds and tests downloadable packages in the cloud. Preview signing limitations are stated on each Release; production signing requires the project owner's private platform credentials.

SciCal600 是独立开发的智能计算器平台，支持网页、Android、Windows、macOS 与 iOS。各平台共用同一套计算代码，并由 GitHub Actions 在云端完成构建与测试。预览包的签名限制会在 Release 中明确标注；正式签名使用项目所有者自己的平台凭证。

## Use it online

**Production website:** [Open SciCal600](https://scical600.pages.dev/)

Direct workspaces: [Scientific Calculator](https://scical600.pages.dev/scientific-calculator) · [Linear Algebra](https://scical600.pages.dev/linear-algebra) · [Computer Calculator](https://scical600.pages.dev/computer-calculator) · [Economics Calculator](https://scical600.pages.dev/economics-calculator) · [About](https://scical600.pages.dev/about)

## Product independence

SciCal600 is not a simulator, clone, skin, or endorsed edition of another calculator product. Its identity, user-facing branding, distribution packages and release pipeline are SciCal600-specific. The scientific workspace implements general mathematical capabilities using project-owned source code and generic mathematical conventions.

Distributed builds are checked automatically so third-party calculator brand/model names cannot appear in shipped Web or native application assets. This helps keep future commercial distribution, including advertising-supported editions, separated from third-party product identity.

## Run it

Serve the repository root with any static HTTP server and open `/`. The stable routes are `/scientific-calculator`, `/linear-algebra`, `/computer-calculator`, `/economics-calculator`, `/manual`, and `/about`.

To run the calculation-engine tests:

```text
npm test
```

To build the independently branded distributable Web bundle:

```text
npm run build
```

The build writes public assets to `dist/` and fails if prohibited third-party calculator branding is detected in distributable HTML, CSS, or JavaScript.

## Main capabilities

- Scientific expression input with editable cursor, history, memory and multiple result formats
- Trigonometric, inverse trigonometric, hyperbolic, exponential and logarithmic functions
- Degree, radian and grad angle units
- Powers, roots, factorials, percentages, permutations and combinations
- Complex arithmetic, coordinate conversion and base-N arithmetic
- Weighted statistics and regression tools
- Scientific constants and interactive formula catalogue
- Four persistent programmable study areas with bounded execution
- Linear Algebra matrix operations including inverse, determinant and eigen tools
- Computer Calculator tools for integer bases, ALU flags, BCD and IEEE 754 inspection
- Little Man's Computer teaching simulator and computer-architecture calculations
- Economics Calculator tools for FX, rates, loans, savings, amortization and real returns
- English, Traditional Chinese, Simplified Chinese, Japanese, Korean, Malay, French, German, Spanish, Arabic, Thai and Hong Kong Cantonese interfaces
- Responsive phone/desktop layouts and keyboard input
- Parser implemented without JavaScript `eval`

## Multi-platform delivery

Android uses Capacitor and GitHub-hosted builds. Windows and macOS use Electron packaging. iOS uses Capacitor and Xcode cloud runners. See the platform-specific documentation linked above for build outputs, signing requirements and installation limitations.

Preview packages are intended for testing. Production Android, iOS, Windows and macOS releases require platform-appropriate signing credentials controlled by the project owner. No private signing key should be committed to this repository.

## Publish with Cloudflare Pages

The production site is deployed through `.github/workflows/cloudflare-pages.yml`. Configure these under **GitHub repository Settings → Secrets and variables → Actions**:

- Repository secret: `CLOUDFLARE_API_TOKEN`
- Repository variable: `CLOUDFLARE_ACCOUNT_ID`
- Repository variable: `CLOUDFLARE_PAGES_ENABLED=true`

The Cloudflare token should have only the minimum Pages permission needed for this project.

## External data sources

Some Economics Calculator views use public reference data from:

- [Frankfurter v2](https://frankfurter.dev/) for reference foreign-exchange data
- [HKMA Open API](https://apidocs.hkma.gov.hk/) for Hong Kong interest-rate and interbank-liquidity series

These external data sources are informational inputs only and are not part of SciCal600's calculator branding or application identity.

## Scope

SciCal600 is an independent educational and general-purpose calculator project. It does not claim examination approval or compatibility with any particular physical calculator model.
