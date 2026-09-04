"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const http = require("node:http");
const path = require("node:path");

const playwrightModule = process.env.SCICAL_PLAYWRIGHT_MODULE || "playwright";
const { chromium } = require(playwrightModule);
const projectRoot = path.resolve(__dirname, "..");
const root = path.join(projectRoot, "dist");
const chromePath = process.env.SCICAL_CHROME_PATH || "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

const mimeTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
};

function startServer() {
  const server = http.createServer((request, response) => {
    const pathname = new URL(request.url, "http://localhost").pathname;
    const requestedRoot = pathname.startsWith("/tests/") ? projectRoot : root;
    const candidate = path.join(requestedRoot, pathname === "/" ? "index.html" : pathname);
    const file = candidate.startsWith(requestedRoot) && fs.existsSync(candidate) && fs.statSync(candidate).isFile()
      ? candidate
      : path.join(root, "index.html");
    response.writeHead(200, { "content-type": mimeTypes[path.extname(file)] || "application/octet-stream" });
    fs.createReadStream(file).pipe(response);
  });
  return new Promise((resolve) => server.listen(0, "127.0.0.1", () => resolve(server)));
}

async function chooseMode(page, mode) {
  await page.locator('.utility-key[data-action="mode"]').click();
  await page.locator(`[data-mode="${mode}"]`).click();
}

async function checkLayout(page, viewport) {
  await page.goto("/scientific-calculator", { waitUntil: "networkidle" });
  await page.waitForFunction(() => window.SciCalApp && window.SciCalUI);
  assert.equal(new URL(page.url()).pathname, "/scientific-calculator", `${viewport.name}: scientific calculator route`);
  assert.equal(await page.locator('[data-view-panel="calculator"]').isVisible(), true, `${viewport.name}: calculator is visible`);
  const metrics = await page.evaluate(() => {
    const keys = [...document.querySelectorAll(".calc-key")].map((key) => key.getBoundingClientRect());
    const canvas = document.querySelector("#calculator-space").getBoundingClientRect();
    const calculator = document.querySelector(".calculator").getBoundingClientRect();
    return {
      documentWidth: document.documentElement.scrollWidth,
      innerWidth: window.innerWidth,
      minKeyHeight: Math.min(...keys.map((key) => key.height)),
      minKeyWidth: Math.min(...keys.map((key) => key.width)),
      calculatorWidth: calculator.width,
      canvasRight: canvas.right,
      canvasLeft: canvas.left,
      viewportWidth: document.querySelector("#calculator-viewport").clientWidth,
      viewportScrollHeight: document.querySelector("#calculator-viewport").scrollHeight,
      viewportClientHeight: document.querySelector("#calculator-viewport").clientHeight,
      viewportOverflowing: document.querySelector("#calculator-viewport").classList.contains("is-overflowing"),
      hasViewportFit: document.querySelector('meta[name="viewport"]').content.includes("viewport-fit=cover"),
      usesSafeArea: [...document.styleSheets].some((sheet) => {
        try { return [...sheet.cssRules].some((rule) => rule.cssText.includes("safe-area-inset")); } catch { return false; }
      }),
    };
  });
  assert.ok(metrics.documentWidth <= metrics.innerWidth, `${viewport.name}: horizontal document overflow`);
  assert.ok(metrics.canvasLeft >= -1, `${viewport.name}: canvas is clipped on the left`);
  assert.ok(metrics.canvasRight <= metrics.innerWidth + 1, `${viewport.name}: canvas is clipped on the right`);
  assert.ok(metrics.minKeyWidth >= 40, `${viewport.name}: key width ${metrics.minKeyWidth} is too small`);
  assert.ok(metrics.minKeyHeight >= 40, `${viewport.name}: key height ${metrics.minKeyHeight} is too small`);
  assert.equal(metrics.hasViewportFit, true, `${viewport.name}: viewport-fit is missing`);
  assert.equal(metrics.usesSafeArea, true, `${viewport.name}: safe-area CSS is missing`);
  if (viewport.landscape) {
    assert.equal(metrics.viewportOverflowing, true, `${viewport.name}: compact landscape should pan vertically`);
    assert.ok(metrics.viewportScrollHeight > metrics.viewportClientHeight, `${viewport.name}: landscape content should be scrollable`);
  } else {
    assert.ok(metrics.calculatorWidth >= metrics.innerWidth * 0.9, `${viewport.name}: calculator should fill the phone width`);
    assert.ok(metrics.minKeyHeight >= 48, `${viewport.name}: portrait key height ${metrics.minKeyHeight} is too small`);
    assert.equal(metrics.viewportOverflowing, true, `${viewport.name}: enlarged portrait calculator should scroll vertically`);
    assert.ok(metrics.viewportScrollHeight > metrics.viewportClientHeight, `${viewport.name}: portrait calculator should have an internal vertical scroll area`);
    await page.locator("#calculator-viewport").evaluate((element) => { element.scrollTop = element.scrollHeight; });
    const stickyDisplay = await page.evaluate(() => {
      const viewportBox = document.querySelector("#calculator-viewport").getBoundingClientRect();
      const displayBox = document.querySelector(".display").getBoundingClientRect();
      return { viewportTop: viewportBox.top, viewportBottom: viewportBox.bottom, displayTop: displayBox.top, displayBottom: displayBox.bottom };
    });
    assert.ok(stickyDisplay.displayTop >= stickyDisplay.viewportTop - 2, `${viewport.name}: sticky display is clipped above the viewport`);
    assert.ok(stickyDisplay.displayBottom < stickyDisplay.viewportBottom, `${viewport.name}: sticky display is hidden by the bottom dock`);
    await page.locator("#calculator-viewport").evaluate((element) => { element.scrollTop = 0; });
  }
  return metrics;
}

async function checkCompactHome(page, viewport) {
  await page.goto("/", { waitUntil: "networkidle" });
  const metrics = await page.evaluate(() => {
    const cards = [...document.querySelectorAll(".home-tool-card")].map((card) => card.getBoundingClientRect());
    const buttons = [...document.querySelectorAll(".home-tool-card .primary-action")].map((button) => button.getBoundingClientRect());
    return {
      cardCount: cards.length,
      buttonCount: buttons.length,
      cardBottoms: cards.map((card) => card.bottom),
      buttonHeights: buttons.map((button) => button.height),
      documentWidth: document.documentElement.scrollWidth,
      innerWidth: window.innerWidth,
      innerHeight: window.innerHeight,
      removedCopyCount: document.querySelectorAll(".reference-model-banner, .feature-pills, .exam-note, .tool-card--future").length,
    };
  });
  assert.equal(metrics.cardCount, 2, `${viewport.name}: both calculator choices should be present`);
  assert.equal(metrics.buttonCount, 2, `${viewport.name}: both calculator choices should have direct actions`);
  assert.ok(metrics.cardBottoms.every((bottom) => bottom <= metrics.innerHeight), `${viewport.name}: both calculator choices should be visible without scrolling`);
  assert.ok(metrics.buttonHeights.every((height) => height >= 44), `${viewport.name}: home actions should have mobile touch targets`);
  assert.ok(metrics.documentWidth <= metrics.innerWidth, `${viewport.name}: home page horizontal overflow`);
  assert.equal(metrics.removedCopyCount, 0, `${viewport.name}: redundant home-page copy should be removed`);
  return metrics;
}

async function runFunctionalChecks(page) {
  const firstKey = page.locator(".calc-key").first();
  await firstKey.dispatchEvent("pointerdown", { pointerId: 41, pointerType: "touch", isPrimary: true, buttons: 1 });
  assert.equal(await firstKey.evaluate((element) => element.classList.contains("is-pressed")), true, "touch pointerdown should press immediately");
  await firstKey.dispatchEvent("pointerup", { pointerId: 41, pointerType: "touch", isPrimary: true, buttons: 0 });
  assert.equal(await firstKey.evaluate((element) => element.classList.contains("is-pressed")), false, "pointerup should clear press state");
  await firstKey.dispatchEvent("pointerdown", { pointerId: 42, pointerType: "touch", isPrimary: true, buttons: 1 });
  await firstKey.dispatchEvent("pointercancel", { pointerId: 42, pointerType: "touch", isPrimary: true, buttons: 0 });
  assert.equal(await firstKey.evaluate((element) => element.classList.contains("is-pressed")), false, "pointercancel should clear press state");

  await chooseMode(page, "CMPLX");
  assert.equal(await page.locator("#mode-workbench").isVisible(), true, "web mode should show the complex workbench");
  await page.locator("#interface-mode-toggle").click();
  assert.equal(await page.evaluate(() => window.SciCalApp.getState().interfaceMode), "simulator");
  assert.equal(await page.locator("#mode-workbench").isHidden(), true, "simulator mode should hide the specialist workbench");
  await page.keyboard.type("(2+3i)+(4-5i)");
  await page.keyboard.press("Enter");
  assert.equal(await page.locator("#result").textContent(), "6 − 2i", "complex simulator calculation");

  await chooseMode(page, "BASE");
  await page.keyboard.type("10+1");
  await page.keyboard.press("Enter");
  assert.equal(await page.locator("#result").textContent(), "11", "base simulator calculation");

  await chooseMode(page, "SD");
  await page.keyboard.type("12");
  await page.keyboard.press("Backspace");
  assert.equal(await page.evaluate(() => window.SciCalApp.getState().expression), "1", "simulator DEL state");
  await page.keyboard.press("Escape");
  assert.equal(await page.evaluate(() => window.SciCalApp.getState().expression), "", "simulator AC state");
  await page.keyboard.type("1,1");
  await page.keyboard.press("Enter");
  await page.keyboard.type("3,2");
  await page.keyboard.press("Enter");
  assert.equal(await page.evaluate(() => window.SciCalApp.getState().sdEntries), 2, "SD continuous sample entry");
  assert.match(await page.locator("#result").textContent(), /n=3\s+x̄=2\.333/);

  await chooseMode(page, "REG");
  for (const sample of ["1,3", "2,5", "3,7"]) {
    await page.keyboard.type(sample);
    await page.keyboard.press("Enter");
  }
  assert.equal(await page.evaluate(() => window.SciCalApp.getState().regEntries), 3, "REG continuous sample entry");
  assert.match(await page.locator("#result").textContent(), /a=1 b=2/);

  await chooseMode(page, "PRGM");
  await page.keyboard.type("2");
  await page.keyboard.press("Enter");
  assert.equal(await page.locator("#result").textContent(), "5.08", "program simulator execution");
  await page.locator("#interface-mode-toggle").click();
  assert.equal(await page.evaluate(() => window.SciCalApp.getState().interfaceMode), "web");
  assert.equal(await page.locator("#mode-workbench").isVisible(), true, "returning to web mode should restore the program workbench");
  assert.match(await page.locator("[data-program-source]").inputValue(), /A×2\.54/);

  await page.goto("/", { waitUntil: "networkidle" });
  assert.equal(await page.locator('[data-view-panel="about"]').isVisible(), true, "root platform page");
  assert.match(await page.locator('[data-view-panel="about"] h1').textContent(), /math/i);
  assert.equal(await page.locator(".home-tool-card").count(), 2, "home should show both calculators at equal prominence");
  for (const [language, expected, direction] of [
    ["fr", /maths/i, "ltr"],
    ["de", /Mathematik/i, "ltr"],
    ["es", /Matemáticas/i, "ltr"],
    ["ar", /رياضيات/, "rtl"],
  ]) {
    await page.locator("#language-select").selectOption(language);
    assert.equal(await page.locator("html").getAttribute("lang"), language, `${language} language selection`);
    assert.equal(await page.locator("html").getAttribute("dir"), direction, `${language} writing direction`);
    assert.match(await page.locator('[data-view-panel="about"] h1').textContent(), expected, `${language} About translation`);
  }
  await page.goto("/about", { waitUntil: "networkidle" });
  assert.equal(new URL(page.url()).pathname, "/", "legacy /about route is canonicalized to root");
  assert.equal(await page.locator('[data-view-panel="about"]').isVisible(), true, "legacy /about route opens platform page");
  await page.locator("#language-select").selectOption("en-GB");
  await page.locator('[data-view-target="linear-algebra"]').first().click();
  assert.equal(new URL(page.url()).pathname, "/linear-algebra", "linear algebra navigation path");
  await page.locator("#matrix-operation").selectOption("multiply");
  await page.locator("#matrix-calculate").click();
  assert.deepEqual(await page.locator("#matrix-result td").allTextContents(), ["19", "22", "43", "50"], "matrix multiplication UI");
  await page.locator("#matrix-operation").selectOption("determinant");
  await page.locator("#matrix-calculate").click();
  assert.equal(await page.locator("#matrix-result").textContent(), "-2", "determinant UI");
  await page.reload({ waitUntil: "networkidle" });
  assert.equal(await page.locator('[data-view-panel="linear-algebra"]').isVisible(), true, "direct /linear-algebra refresh route");
}

(async () => {
  const server = await startServer();
  const address = server.address();
  const browser = await chromium.launch({ headless: true, executablePath: chromePath });
  const viewports = [
    { name: "iPhone 13", width: 390, height: 844 },
    { name: "iPhone 15", width: 393, height: 852 },
    { name: "iPhone 16/17 Pro", width: 402, height: 874 },
    { name: "iPhone 17 Pro browser toolbar", width: 402, height: 720 },
    { name: "iPhone 17 Pro Max", width: 440, height: 956 },
    { name: "Xiaomi 13+", width: 393, height: 873 },
    { name: "iPhone landscape", width: 844, height: 390, landscape: true },
    { name: "Xiaomi landscape", width: 873, height: 393, landscape: true },
  ];
  let iPhone17Metrics;
  try {
    {
      const context = await browser.newContext({ baseURL: `http://127.0.0.1:${address.port}` });
      const page = await context.newPage();
      await page.goto("/tests/ui-smoke.html", { waitUntil: "networkidle" });
      await page.waitForFunction(() => document.querySelector("#report")?.dataset.status);
      assert.equal(await page.locator("#report").getAttribute("data-status"), "passed", await page.locator("#report").textContent());
      console.log("PASS existing UI smoke test");
      await context.close();
    }
    for (const viewport of viewports) {
      const context = await browser.newContext({
        baseURL: `http://127.0.0.1:${address.port}`,
        viewport: { width: viewport.width, height: viewport.height },
        deviceScaleFactor: 3,
        hasTouch: true,
        isMobile: true,
        userAgent: viewport.name.startsWith("Xiaomi")
          ? "Mozilla/5.0 (Linux; Android 15; 23127PN0CC) AppleWebKit/537.36 Chrome/140 Mobile Safari/537.36"
          : "Mozilla/5.0 (iPhone; CPU iPhone OS 19_0 like Mac OS X) AppleWebKit/605.1.15 Mobile/15E148 Safari/604.1",
      });
      const page = await context.newPage();
      const metrics = await checkLayout(page, viewport);
      if (viewport.name === "iPhone 16/17 Pro") iPhone17Metrics = metrics;
      if (viewport.name === "iPhone 17 Pro browser toolbar") {
        assert.ok(iPhone17Metrics, "standard iPhone 17 Pro metrics should be available");
        assert.ok(Math.abs(metrics.minKeyHeight - iPhone17Metrics.minKeyHeight) < 0.5, "browser toolbar height changes should not shrink calculator keys");
        assert.ok(Math.abs(metrics.calculatorWidth - iPhone17Metrics.calculatorWidth) < 0.5, "browser toolbar height changes should not shrink the calculator body");
        const homeMetrics = await checkCompactHome(page, viewport);
        console.log(`PASS ${viewport.name} home: ${homeMetrics.cardCount} primary calculator choices above the fold`);
      }
      console.log(`PASS ${viewport.name}: keys ${metrics.minKeyWidth.toFixed(1)} × ${metrics.minKeyHeight.toFixed(1)} CSS px`);
      if (viewport.name === "iPhone 16/17 Pro") await runFunctionalChecks(page);
      await context.close();
    }
    console.log("PASS touch feedback, modes 02–06, direct routes, four added languages, and Linear Algebra UI");
  } finally {
    await browser.close();
    await new Promise((resolve) => server.close(resolve));
  }
})().catch((error) => {
  console.error(error.stack || error);
  process.exitCode = 1;
});
