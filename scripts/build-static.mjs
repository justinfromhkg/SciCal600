import { copyFileSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
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

const textFiles = publicFiles.filter((file) => /\.(?:html|css|js)$/.test(file));

// SciCal600 ships as its own calculator product. The source tree contains some
// historical compatibility copy, but no distributed build may present itself as
// another manufacturer's model or depend on that model's branding.
const independentBrandReplacements = [
  [/Casio\s+fx-50FH\s+II/gi, "SciCal600 Scientific"],
  [/fx-50FH\s+II/gi, "SciCal600 Scientific"],
  [/fx-50F\s+PLUS/gi, "SciCal600 Scientific"],
  [/<strong>fx-50<span>FH<\/span>\s+II<\/strong><small>reference model · web edition<\/small>/gi,
    "<strong>SciCal<span>600</span></strong><small>independent scientific calculator</small>"],
  [/<small>fx-50FH\s+II<\/small>/gi, "<small>Scientific Calculator</small>"],
  [/SUPER\s+FX\s+·\s+WEB/gi, "SCICAL · WEB"],
];

const forbiddenDistributionPatterns = [
  /\bCasio\b/i,
  /fx-50(?:FH|F)/i,
];

rmSync(outputDirectory, { force: true, recursive: true });
mkdirSync(outputDirectory, { recursive: true });

for (const file of publicFiles) {
  const source = resolve(file);
  const destination = resolve(outputDirectory, file);
  copyFileSync(source, destination);

  if (!textFiles.includes(file)) continue;
  let content = readFileSync(destination, "utf8");
  for (const [pattern, replacement] of independentBrandReplacements) {
    content = content.replace(pattern, replacement);
  }
  writeFileSync(destination, content, "utf8");
}

const violations = [];
for (const file of textFiles) {
  const content = readFileSync(resolve(outputDirectory, file), "utf8");
  for (const pattern of forbiddenDistributionPatterns) {
    if (pattern.test(content)) violations.push(`${file}: ${pattern}`);
  }
}

if (violations.length) {
  throw new Error(`Independent-brand build check failed:\n${violations.join("\n")}`);
}

console.log(`Prepared ${publicFiles.length} independently branded website files in dist/.`);
