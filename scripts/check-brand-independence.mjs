import { readdirSync, readFileSync, statSync } from "node:fs";
import { extname, join, resolve } from "node:path";

const root = resolve(process.argv[2] || "dist");
const blocked = [
  ["Ca", "sio"].join(""),
  ["fx", "-50FH"].join(""),
];
const textExtensions = new Set([".html", ".js", ".css", ".json", ".txt", ".md", ""]);
const hits = [];

function scan(path) {
  const stat = statSync(path);
  if (stat.isDirectory()) {
    for (const name of readdirSync(path)) scan(join(path, name));
    return;
  }
  if (!textExtensions.has(extname(path).toLowerCase())) return;
  const text = readFileSync(path, "utf8");
  for (const marker of blocked) {
    if (text.toLowerCase().includes(marker.toLowerCase())) hits.push(`${path}: ${marker}`);
  }
}

scan(root);
if (hits.length) {
  console.error("Product-neutrality check failed:\n" + hits.join("\n"));
  process.exit(1);
}
console.log(`Product-neutrality check passed for ${root}.`);
