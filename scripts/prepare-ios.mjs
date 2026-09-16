import { execFileSync } from "node:child_process";
import {
  existsSync,
  readFileSync,
  writeFileSync,
} from "node:fs";
import { resolve } from "node:path";
import { build } from "esbuild";

const bundleId = "io.github.justinfromhkg.scical600";
const capacitorCli = resolve(
  "node_modules",
  "@capacitor",
  "cli",
  "bin",
  "capacitor",
);
const iosPackage = resolve("node_modules", "@capacitor", "ios", "package.json");
const indexPath = resolve("dist", "index.html");
const xcodeProject = resolve("ios", "App", "App.xcodeproj", "project.pbxproj");

function fail(message) {
  throw new Error(`[prepare-ios] ${message}`);
}

function runCapacitor(...args) {
  execFileSync(process.execPath, [capacitorCli, ...args], { stdio: "inherit" });
}

if (!existsSync(capacitorCli)) {
  fail("Capacitor CLI is missing. Run npm ci before preparing iOS.");
}

if (!existsSync(iosPackage)) {
  fail(
    "@capacitor/ios is missing. Run npm ci to install the locked native dependencies.",
  );
}

if (!existsSync(indexPath)) {
  fail("dist/index.html is missing. Run npm run build first.");
}

await build({
  entryPoints: [resolve("native", "ios", "ios-entry.js")],
  bundle: true,
  outfile: resolve("dist", "ios.js"),
  format: "iife",
  target: "safari14",
});

let html = readFileSync(indexPath, "utf8");

// A native build must not need Google Fonts (or any other hosted resource) to
// render its initial UI. The existing system-font fallbacks remain available.
html = html.replace(
  /\s*<link\b[^>]*href=["']https:\/\/fonts\.(?:googleapis|gstatic)\.com[^>]*>\s*/gi,
  "\n",
);

// Keep repeated preparation deterministic and avoid injecting the bootstrap
// more than once when CI checks that syncing is idempotent.
html = html.replace(
  /\s*<script\s+data-scical-platform=["']ios["'][^>]*><\/script>\s*/gi,
  "\n",
);
html = html.replace(
  "</body>",
  '  <script data-scical-platform="ios" src="ios.js"></script>\n  </body>',
);
writeFileSync(indexPath, html);

if (!existsSync(xcodeProject)) {
  runCapacitor("add", "ios");
}
runCapacitor("sync", "ios");

if (!existsSync(xcodeProject)) {
  fail("Capacitor did not generate ios/App/App.xcodeproj.");
}

const project = readFileSync(xcodeProject, "utf8");
if (!project.includes(`PRODUCT_BUNDLE_IDENTIFIER = ${bundleId};`)) {
  fail(`Generated Xcode project does not use the expected bundle ID ${bundleId}.`);
}

console.log(
  `Prepared the offline iOS project for ${bundleId} in ios/App (generated; not committed).`,
);
