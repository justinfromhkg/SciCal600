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

function loadAdditionalLocales() {
  const context = { window: {} };
  vm.runInNewContext(read("additional-locales.js"), context, { filename: "additional-locales.js" });
  return {
    locales: context.window.SciCalAdditionalLocales,
    manuals: context.window.SciCalAdditionalManuals,
  };
}

test("ships complete calculator translation key sets for all languages", () => {
  for (const [file, name] of [["linear-algebra-i18n.js","SciCalLinearTranslations"],["computer-i18n.js","SciCalComputerTranslations"],["economics-i18n.js","SciCalEconomicsTranslations"]]) {
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
  for (const asset of ["linear-algebra-i18n.js","additional-locales.js","computer-core.js","computer-calculator.js","computer-calculator.css","economics-core.js","economics-calculator.js","economics-calculator.css"]) {
    assert.ok(html.includes(asset) || asset.endsWith(".css") && html.includes(asset), `${asset} in HTML`);
    assert.ok(build.includes(`"${asset}"`), `${asset} in build manifest`);
  }
  for (const id of ["matrix-a","matrix-b"]) {
    assert.match(html, new RegExp(`<textarea id="${id}"[^>]*inputmode="text"[^>]*enterkeyhint="enter"`));
  }
  assert.match(html, /<option value="th">🇹🇭 ไทย<\/option>/);
  assert.match(html, /<option value="yue-Hant-HK">🇭🇰 粵語<\/option>/);
  assert.match(html, /data-i18n="aboutTitle">Maths made simple<\/h1>/);
});

test("adds substantial Thai and Hong Kong Cantonese locale overlays", () => {
  const { locales, manuals } = loadAdditionalLocales();
  assert.deepEqual(Object.keys(locales).sort(), ["th", "yue-Hant-HK"].sort());
  assert.equal(locales.th.fallback, "en-GB");
  assert.equal(locales["yue-Hant-HK"].fallback, "zh-Hant");
  assert.match(locales.th.aboutTitle, /[\u0E00-\u0E7F]/);
  assert.match(locales.th.linearTitle, /[\u0E00-\u0E7F]/);
  assert.match(locales["yue-Hant-HK"].aboutTitle, /搞掂/);
  assert.match(locales["yue-Hant-HK"].matrixSwap, /同/);
  assert.ok(manuals.th.length >= 5);
  assert.ok(manuals["yue-Hant-HK"].length >= 5);
});

test("does not ship known client-side secret patterns", () => {
  const client = ["index.html","linear-algebra.js","linear-algebra-i18n.js","additional-locales.js","computer-calculator.js","economics-calculator.js","computer-i18n.js","economics-i18n.js"].map(read).join("\n");
  assert.doesNotMatch(client, /api[_-]?key\s*[:=]\s*["'][A-Za-z0-9_-]{12,}/i);
  assert.doesNotMatch(client, /ExchangeRate-API.*key=/i);
});
