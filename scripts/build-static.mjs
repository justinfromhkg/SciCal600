import { mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const outputDirectory = resolve("dist");
const publicFiles = [
  "index.html",
  "styles.css",
  "android-download.css",
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

const legacyVendor = ["Ca", "sio"].join("");
const legacyModel = ["fx", "-50FH II"].join("");
const legacyModelShort = ["fx", "-50FH"].join("");
const shippedName = "SciCal600 Scientific";

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function makeProductNeutral(source) {
  return source
    .replace(new RegExp(`${escapeRegExp(legacyVendor)}\\s+${escapeRegExp(legacyModel)}`, "gi"), shippedName)
    .replace(new RegExp(escapeRegExp(legacyModel), "gi"), shippedName)
    .replace(new RegExp(escapeRegExp(legacyModelShort), "gi"), shippedName)
    .replace(new RegExp(escapeRegExp(legacyVendor), "gi"), "third-party calculator vendor");
}

rmSync(outputDirectory, { force: true, recursive: true });
mkdirSync(outputDirectory, { recursive: true });

for (const file of publicFiles) {
  const source = readFileSync(resolve(file), "utf8");
  writeFileSync(resolve(outputDirectory, file), makeProductNeutral(source));
}

console.log(`Prepared ${publicFiles.length} product-neutral website files in dist/.`);
