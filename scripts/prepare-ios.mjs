import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { resolve } from "node:path";
import { build } from "esbuild";

const capacitorCli = resolve("node_modules", "@capacitor", "cli", "bin", "capacitor");
const capacitorIos = resolve("node_modules", "@capacitor", "ios");
const run = (...args) => execFileSync(process.execPath, [capacitorCli, ...args], { stdio: "inherit" });

if (!existsSync(capacitorIos)) {
  throw new Error("@capacitor/ios is required. Install the matching 7.4.3 package before running ios:sync.");
}
if (!existsSync("ios")) run("add", "ios");

await build({
  entryPoints: [resolve("native", "ios-entry.js")],
  bundle: true,
  outfile: resolve("dist", "ios.js"),
  format: "iife",
  target: "safari15",
});

let html = readFileSync("dist/index.html", "utf8");
html = html.replace(/<link[^>]+https:\/\/fonts\.[^>]+>/g, "");
if (!html.includes('src="ios.js"')) html = html.replace("</body>", '<script src="ios.js"></script></body>');
writeFileSync("dist/index.html", html);

run("sync", "ios");
