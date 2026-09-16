# Product independence policy

SciCal600 is an independent calculator implementation. Its calculation engines, parser, datasets, interface code, and native wrappers are maintained in this repository and do not require a specific third-party calculator product, firmware image, ROM, manual, logo, industrial design asset, or proprietary service at runtime.

## Shipping rule

Production Web and native bundles are built from `dist/`. The build normalizes legacy model/vendor labels to SciCal600-owned generic naming, and `npm run brand:check` fails if those legacy labels remain in the shipping bundle. GitHub Actions runs that check before desktop and iOS packaging.

New features should be specified from mathematical/technical behavior and public standards rather than by copying a third-party calculator's expression, artwork, manual text, or exact key-face design. When reference behavior matters, document the mathematical requirement directly and add tests for that requirement.

## Assets and dependencies

Do not add third-party logos, product photos, manual scans, firmware, ROMs, proprietary fonts, sound assets, or copied product artwork. Open-source software dependencies remain subject to their own licenses and notices.

## Commercialization note

This policy reduces avoidable product-brand and copied-expression risk, but it is not a legal clearance opinion. Before advertising, app-store distribution, or other commercial use, review the repository name, artwork, dependency licenses, privacy disclosures, store requirements, and applicable trademark/copyright rules for the markets where the app will be offered.
