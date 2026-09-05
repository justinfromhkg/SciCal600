import { copyFileSync, mkdirSync, rmSync } from "node:fs";
import { resolve } from "node:path";

const outputDirectory = resolve("dist");
const publicFiles = [
  "index.html",
  "styles.css",
  "calculator-core.js",
  "calculator-data.js",
  "linear-algebra-core.js",
  "linear-algebra-i18n.js",
  "additional-locales.js",
  "computer-core.js",
  "economics-core.js",
  "app.js",
  "linear-algebra.js",
  "computer-i18n.js",
  "economics-i18n.js",
  "computer-calculator.js",
  "computer-calculator.css",
  "economics-calculator.js",
  "economics-calculator.css",
  "site-ui.js",
  "_redirects",
];

rmSync(outputDirectory, { force: true, recursive: true });
mkdirSync(outputDirectory, { recursive: true });

for (const file of publicFiles) {
  copyFileSync(resolve(file), resolve(outputDirectory, file));
}

console.log(`Prepared ${publicFiles.length} website files in dist/.`);
