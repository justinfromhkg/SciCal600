# SciCal600

SciCal600 is a responsive browser calculator inspired by the interaction model and key grouping of the Casio fx-50FH II. It combines a dependable scientific-expression parser with six calculation modes, searchable study catalogues, and responsive data-entry workbenches.

> The physical Casio fx-50FH II is listed by Casio as HKEAA-approved. This independent web simulator is not a Casio product and is not approved for use in examinations.

## Run it

Open `index.html` in a modern browser. The project has no runtime dependencies and does not need a build step.

To run the calculation-engine tests:

```text
npm test
```

## Publish with Cloudflare Workers

The repository includes a static-assets Workers configuration. After signing in to Cloudflare, publish the current version with:

```text
npm run deploy
```

The build copies only the five public website files into `dist/`; source tests and project notes are not uploaded. Wrangler returns a public `https://scical600.<account>.workers.dev` address after deployment.

## Implemented

- Two-line expression/result display with an editable cursor
- Calculation priority, brackets, implicit multiplication, percentage and automatic closing brackets
- Powers, square/cube/nth roots, factorial and absolute value
- Trigonometric, inverse trigonometric, hyperbolic, exponential and logarithmic functions
- Degree, radian and grad angle units
- Permutation (`nPr`) and combination (`nCr`)
- `Ans`, independent `M` memory, replay history, decimal/fraction display and DMS conversion
- Normal, fixed-decimal, scientific and engineering notation
- Keyboard input and responsive phone/desktop layouts
- A parser written without JavaScript `eval`
- Complex arithmetic in rectangular and polar form, including `arg` and conjugates
- Binary, octal, decimal, and hexadecimal arithmetic with 32-bit logical operations
- Weighted single-variable statistics and seven regression models
- Four persistent program areas with prompt input, assignment, byte accounting, and safe execution
- Searchable catalogues containing 23 interactive formulas and 40 scientific constants

## Verified reference feature set

Casio describes the fx-50FH II as a programmable, non-graphing model with 406 functions, a 10+2 digit two-line dot-matrix display, four program areas and 680 bytes of program memory. Its published functions include complex calculations, 23 built-in formulas, 40 scientific constants, fraction calculations, standard-deviation and regression statistics, base-n conversion, logical operations, combination/permutation, coordinate conversion, random numbers and summation.

The calculator exposes six working modes: `COMP`, `CMPLX`, `BASE`, `SD`, `REG`, and `PRGM`. Select a mode with the `MODE` button. Specialist modes open a workbench beneath the calculator for shortcuts, sample entry, regression output, or program editing. `FMLA` opens the interactive formula catalogue; `SHIFT` + `7` opens scientific constants.

The formula and constant tables are versioned study data. They use modern values and common educational formulas; they do not claim to reproduce the exact internal table or rounding of a particular physical calculator revision.

## Primary references

- [Casio fx-50FH II product page](https://www.casio.com/intl/scientific-calculators/product.FX-50FHII/)
- [Casio 2025 general calculator catalogue](https://www.casio.com/content/dam/casio/global/calculator/scientific-calculators/catalog/2025-general-catalog.pdf)
- [Casio fx-50F PLUS English user guide](https://support.casio.com/pdf/004/fx-50F_PLUS_E.pdf) — the official guide for the closely matching fx-50F family workflow and six modes
- [HKEAA 2026 examination notes](https://www.hkeaa.edu.hk/DocLibrary/IPE/em/EM_NotesOnExam2026.pdf) — points candidates to the current permitted-calculator list
- [HKEAA 2019 permitted-calculator list](https://www.hkeaa.edu.hk/DocLibrary/IPE/cal/CAL2019.pdf) — explicitly includes `FX-50 F/FH/FH II`

## Scope note

This remains an independent educational simulator. It does not claim complete parity with all “406 functions,” examination approval, or byte-for-byte compatibility with Casio programs.
