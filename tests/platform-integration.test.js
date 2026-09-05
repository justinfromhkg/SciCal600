"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const root = path.resolve(__dirname, "..");
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");

function loadTranslations(file, globalName) {
  const context = { window: {} };
  vm.runInNewContext(read(file), context, { filename: file });
  return context.window[globalName];
}

test("ships complete Computer and Economics translation key sets for all languages", () => {
  for (const [file, name] of [["computer-i18n.js","SciCalComputerTranslations"],["economics-i18n.js","SciCalEconomicsTranslations"]]) {
    const dictionaries = loadTranslations(file, name);
    assert.deepEqual(Object.keys(dictionaries).sort(), ["ar","de","en-GB","es","fr","ja","ko","ms","zh-Hans","zh-Hant"].sort());
    const englishKeys = Object.keys(dictionaries["en-GB"]).sort();
    for (const [language, dictionary] of Object.entries(dictionaries)) {
      assert.ok(englishKeys.every((key) => Object.hasOwn(dictionary, key)), `${file}: ${language} key coverage`);
      assert.ok(Object.values(dictionary).every((value) => typeof value === "string" && value.trim()), `${file}: ${language} values`);
    }
  }
});

test("wires formal routes, static assets and mobile-friendly matrix inputs", () => {
  const html = read("index.html");
  const redirects = read("_redirects");
  const build = read("scripts/build-static.mjs");
  assert.match(html, /data-view-panel="computer-calculator"/);
  assert.match(html, /data-view-panel="economics-calculator"/);
  assert.match(redirects, /\/about\/ \/about 301/);
  assert.doesNotMatch(redirects, /^\/about \/ 301/m);
  assert.match(redirects, /\/computer-calculator\/ \/computer-calculator 301/);
  assert.match(redirects, /\/economics-calculator\/ \/economics-calculator 301/);
  for (const asset of ["computer-core.js","computer-calculator.js","computer-calculator.css","economics-core.js","economics-calculator.js","economics-calculator.css"]) {
    assert.ok(html.includes(asset) || asset.endsWith(".css") && html.includes(asset), `${asset} in HTML`);
    assert.ok(build.includes(`"${asset}"`), `${asset} in build manifest`);
  }
  for (const id of ["matrix-a","matrix-b"]) {
    assert.match(html, new RegExp(`<textarea id="${id}"[^>]*inputmode="text"[^>]*enterkeyhint="enter"`));
  }
});

test("does not ship known client-side secret patterns", () => {
  const client = ["index.html","computer-calculator.js","economics-calculator.js","computer-i18n.js","economics-i18n.js"].map(read).join("\n");
  assert.doesNotMatch(client, /api[_-]?key\s*[:=]\s*["'][A-Za-z0-9_-]{12,}/i);
  assert.doesNotMatch(client, /ExchangeRate-API.*key=/i);
});
