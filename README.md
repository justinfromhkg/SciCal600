# SciCal600

SciCal600 is a responsive Smart Calculator platform. It combines a scientific calculator inspired by the Casio fx-50FH II workflow with Linear Algebra, Computer Calculator, and Economics Calculator workspaces.

> The physical Casio fx-50FH II is listed by Casio as HKEAA-approved. This independent web simulator is not a Casio product and is not approved for use in examinations.

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
- A prominent fx-50FH II model identity and a ten-language Manual designed for both physical-calculator and web-simulator users
- Automatic system-language selection plus a persistent ten-language picker, including French, German, Spanish and Arabic
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
- English, Traditional Chinese, Simplified Chinese, Japanese, Korean, Malay, French, German, Spanish, and Arabic interface support

## Verified reference feature set

Casio describes the fx-50FH II as a programmable, non-graphing model with 406 functions, a 10+2 digit two-line dot-matrix display, four program areas and 680 bytes of program memory. Its published functions include complex calculations, 23 built-in formulas, 40 scientific constants, fraction calculations, standard-deviation and regression statistics, base-n conversion, logical operations, combination/permutation, coordinate conversion, random numbers and summation.

The calculator exposes six working modes: `COMP`, `CMPLX`, `BASE`, `SD`, `REG`, and `PRGM`. Web mode keeps the direct mode dialog and specialist workbenches. Simulator mode reproduces the two-page numbered MODE menu on the LCD; BASE uses the green `DEC`, `HEX`, `BIN`, `OCT`, `LOGIC`, and `A`–`F` markings on their shared physical keys. `FMLA` opens the interactive formula catalogue; `SHIFT` + `7` opens scientific constants.

The formula and constant tables are versioned study data. They use modern values and common educational formulas; they do not claim to reproduce the exact internal table or rounding of a particular physical calculator revision.

## References

- [Casio fx-50FH II product page](https://www.casio.com/intl/scientific-calculators/product.FX-50FHII/)
- [Casio 2025 general calculator catalogue](https://www.casio.com/content/dam/casio/global/calculator/scientific-calculators/catalog/2025-general-catalog.pdf)
- [Casio fx-50F PLUS English user guide](https://support.casio.com/pdf/004/fx-50F_PLUS_E.pdf) — the official guide for the closely matching fx-50F family workflow and six modes
- [HKEAA 2026 examination notes](https://www.hkeaa.edu.hk/DocLibrary/IPE/em/EM_NotesOnExam2026.pdf) — points candidates to the current permitted-calculator list
- [HKEAA 2019 permitted-calculator list](https://www.hkeaa.edu.hk/DocLibrary/IPE/cal/CAL2019.pdf) — explicitly includes `FX-50 F/FH/FH II`
- [8tatTV fx-50FH II calculator walkthrough](https://www.youtube.com/watch?v=K_vaEZOcUQE&list=PLZlgLmMyC71dKgWb_p1zI9ssXf85RKdVw) — chaptered Cantonese demonstration of setup, COMP input, variables, fractions, powers, trigonometry, coordinate conversion, engineering notation, constants, rounding, and angle conversion
- [Frankfurter v2](https://frankfurter.dev/) — no-key foreign-exchange reference data; values are not executable trading quotes
- [HKMA Open API](https://apidocs.hkma.gov.hk/) — official Hong Kong interest-rate and interbank-liquidity series

## Scope note

This remains an independent educational simulator. It does not claim complete parity with all “406 functions,” examination approval, or byte-for-byte compatibility with Casio programs.
