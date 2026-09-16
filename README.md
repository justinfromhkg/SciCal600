# Android app / Android 应用

[Download the verified Android APK / 下载已验证 Android APK](https://github.com/justinfromhkg/SciCal600/releases/download/android-debug-b3780b0a55fe/SciCal600-debug.apk)

[Android download and cloud build instructions / 下载与云端构建说明](ANDROID.md)

The Web app and Android app share the same calculator code. GitHub Actions produces installable debug APKs; version tags publish a production-signed `SciCal600-Android.apk` when signing secrets are configured.
Web 与 Android 共用计算代码；Actions 生成可安装 debug APK，配置正式签名 secrets 后可通过版本标签发布正式版。

# SciCal600

SciCal600 is an independent responsive Smart Calculator platform. Its scientific calculator, Linear Algebra, Computer Calculator, and Economics Calculator workspaces are designed and maintained as SciCal600 products without relying on another calculator brand or model identity.

## Use it online

**Production website:** [Open SciCal600](https://scical600.pages.dev/)

Direct workspaces: [Scientific Calculator](https://scical600.pages.dev/scientific-calculator) · [Linear Algebra](https://scical600.pages.dev/linear-algebra) · [Computer Calculator](https://scical600.pages.dev/computer-calculator) · [Economics Calculator](https://scical600.pages.dev/economics-calculator) · [About](https://scical600.pages.dev/about)

> SciCal600 is an independent educational calculator suite. Examination approval is not claimed; users should follow the rules that apply to their own institution or examination.

## Native clients

- **Android:** GitHub Actions builds and emulator-tests an installable APK.
- **Windows:** GitHub Actions packages a portable Electron executable.
- **macOS:** GitHub Actions packages Intel and Apple-silicon Electron app archives. Unsigned development builds may require the standard macOS manual-open flow.
- **iOS:** GitHub Actions builds the Capacitor iOS app for the simulator and an unsigned device archive for development. A directly installable physical-device IPA requires Apple signing credentials; the web app remains installable from Safari as a Home Screen app without those credentials.

All native clients reuse the same SciCal600 web calculation code and tests.

## Run it

Serve the repository root with any static HTTP server and open `/`. The root and the stable `/about` route present the Smart Calculator platform. Direct tool routes are `/scientific-calculator`, `/linear-algebra`, `/computer-calculator`, `/economics-calculator`, and `/manual`. The project has no browser runtime dependencies.

To run the calculation-engine tests:

```text
npm test
```

## Publish with Cloudflare Pages

The repository uses Cloudflare Pages rather than a `workers.dev` site so the production hostname is under `pages.dev`. After signing in to Cloudflare, publish the current version with:

```text
npm run deploy
```

The build copies only public website files into `dist/`; source tests and project notes are not uploaded. Cloudflare Pages' SPA routing serves direct visits to every workspace and `/about`; `_redirects` only canonicalizes trailing-slash variants, so `/about` remains visible and refreshable.

### GitHub Actions connection

The production deployment workflow lives at `.github/workflows/cloudflare-pages.yml`. Cloudflare credentials must never be committed to this repository. Configure these names under **GitHub repository Settings → Secrets and variables → Actions**:

- Repository secret: `CLOUDFLARE_API_TOKEN`
- Repository variables: `CLOUDFLARE_ACCOUNT_ID` and `CLOUDFLARE_PAGES_ENABLED=true`

Create the API token in Cloudflare with the minimum **Account / Cloudflare Pages / Edit** permission for the account that owns the `scical600` Pages project. The account ID is not confidential, so it is stored as an Actions variable; the workflow also accepts a legacy `CLOUDFLARE_ACCOUNT_ID` secret when present. Pushes to `main` deploy automatically only after the enable variable is set, so a checkout without credentials does not generate failing production runs. The workflow can also be started manually from GitHub Actions after the token and account ID are configured.

## Implemented

- Two-line expression/result display with an editable cursor
- Larger top controls and integrated SHIFT/ALPHA legends inside each key for easier reading
- Calculation priority, brackets, implicit multiplication, percentage and automatic closing brackets
- Powers, square/cube/nth roots, factorial and absolute value
- Trigonometric, inverse trigonometric, hyperbolic, exponential and logarithmic functions
- Degree, radian and grad angle units
- Permutation (`nPr`) and combination (`nCr`)
- `Ans`, independent `M` memory, replay history, decimal/fraction display and DMS conversion
- Normal, fixed-decimal, scientific and engineering notation
- A locked, full-screen calculator view with automatic fit and button-controlled zoom
- Live device-battery percentage and charging state when the browser exposes the Battery Status API
- Panning only when the enlarged calculator exceeds the available viewport
- A distinctive SciCal600 scientific-calculator identity and a twelve-language manual for the web and native apps
- Automatic system-language selection plus a persistent twelve-language picker, including Thai and Hong Kong Cantonese
- Keyboard input and responsive phone/desktop layouts
- A parser written without JavaScript `eval`
- Complex arithmetic in rectangular and polar form, including `arg` and conjugates
- Reference-style BASE-N arithmetic: 10-bit BIN, 30-bit OCT, 32-bit DEC/HEX, A–F digits, mixed-base prefixes, and AND/OR/XOR/XNOR/Not/Neg logic
- Weighted single-variable statistics and seven regression models
- Four persistent program areas with prompt input, assignment, byte accounting, and safe execution
- Searchable catalogues containing 23 interactive formulas and 40 scientific constants
- Web and simulator interaction modes for calculation modes 02–06
- Linear Algebra matrix addition, subtraction, multiplication, inverse, transpose, adjugate, determinant, eigenvalue, and eigenvector tools
- Mobile-friendly matrix entry with text-keyboard Return/space support and strict LF, CRLF, tab, NBSP, comma, semicolon and bracketed-paste parsing
- Computer Calculator base 2–36 conversion, 8/16/32/64-bit `BigInt` interpretation, ALU flags, BCD, IEEE 754 single/double inspection and configurable teaching floats
- A sandboxed 100-mailbox Little Man's Computer assembler/simulator with fetch-decode-execute state, RTL steps, breakpoints and loop limits
- Computer architecture calculations for address capacity, clock timing, bus throughput, recursive cache AMAT, disk access, DMA and approximate wafer yield
- Economics Calculator reference FX with Frankfurter v2 attribution, timeout/schema checks, last-success cache, stale/offline state and manual-rate fallback
- Official HKMA public-API views for the HSBC quoted best lending rate series, HIBOR fixing tenors and Discount Window Base Rate
- Explicit-assumption interest/EAR/savings tools, educational P-plan/H-plan mortgage scenarios, fee-aware IRR/APR estimates, amortization, budget and real-return tools
- English, Traditional Chinese, Simplified Chinese, Japanese, Korean, Malay, French, German, Spanish, Arabic, Thai, and Hong Kong Cantonese interface support

## Scientific calculator feature set

The scientific calculator implements a broad programmable, non-graphing study workflow entirely within SciCal600. It includes complex calculations, built-in educational formulas and scientific constants, fractions, statistics and regression, base-n conversion, logical operations, combinations and permutations, coordinate conversion, random numbers, summation, replay history, independent memory, and four persistent program areas.

The calculator exposes six working modes: `COMP`, `CMPLX`, `BASE`, `SD`, `REG`, and `PRGM`. Web mode keeps the direct mode dialog and specialist workbenches. Simulator mode provides a compact numbered MODE menu on the LCD; BASE exposes `DEC`, `HEX`, `BIN`, `OCT`, `LOGIC`, and `A`–`F` controls. `FMLA` opens the interactive formula catalogue; `SHIFT` + `7` opens scientific constants.

The formula and constant tables are versioned SciCal600 study data using modern values and common educational formulas.

## References

- [HKEAA 2026 examination notes](https://www.hkeaa.edu.hk/DocLibrary/IPE/em/EM_NotesOnExam2026.pdf) — points candidates to the current permitted-calculator list
- [Frankfurter v2](https://frankfurter.dev/) — no-key foreign-exchange reference data; values are not executable trading quotes
- [HKMA Open API](https://apidocs.hkma.gov.hk/) — official Hong Kong interest-rate and interbank-liquidity series

## Scope note

