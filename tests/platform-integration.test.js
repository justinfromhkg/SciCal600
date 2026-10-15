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

test("resolves every calculator translation key for all languages", () => {
  for (const [file, name] of [["linear-algebra-i18n.js","SciCalLinearTranslations"],["statistics-probability-i18n.js","SciCalAnalysisTranslations"],["computer-i18n.js","SciCalComputerTranslations"],["economics-i18n.js","SciCalEconomicsTranslations"]]) {
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
  assert.match(html, /data-view-panel="statistics-calculator"/);
  assert.match(html, /data-view-panel="probability-calculator"/);
  assert.match(redirects, /\/about\/ \/about 301/);
  assert.doesNotMatch(redirects, /^\/about \/ 301/m);
  assert.match(redirects, /\/computer-calculator\/ \/computer-calculator 301/);
  assert.match(redirects, /\/economics-calculator\/ \/economics-calculator 301/);
  assert.match(redirects, /\/statistics-calculator\/ \/statistics-calculator 301/);
  assert.match(redirects, /\/probability-calculator\/ \/probability-calculator 301/);
  assert.match(redirects, /\/lmc \/lmc\/ 301/);
  assert.match(redirects, /\/systembussing \/systembussing\/ 301/);
  assert.match(html, /href="https:\/\/lmc\.scical600\.pages\.dev\/"/);
  assert.match(html, /href="https:\/\/systembussing\.scical600\.pages\.dev\/"/);
  for (const auxiliaryFile of ["lmc/index.html", "systembussing/index.html", "systembussing/i18n.js", "systembussing/sw.js", "systembussing/manifest.webmanifest", "systembussing/icon.svg"]) {
    assert.ok(build.includes(`"${auxiliaryFile}"`), `${auxiliaryFile} in build manifest`);
  }
  const deploymentWorkflow = read(".github/workflows/cloudflare-pages.yml");
  assert.match(deploymentWorkflow, /pages deploy dist\/lmc --project-name=scical600 --branch=lmc/);
  assert.match(deploymentWorkflow, /pages deploy dist\/systembussing --project-name=scical600 --branch=systembussing/);
  for (const easterEggAsset of ["love-heart.js", "love-heart.c"]) {
    assert.ok(build.includes(`"${easterEggAsset}"`), `${easterEggAsset} in build manifest`);
  }
  assert.match(html, /id="theme-toggle"[^>]*data-i18n-aria="themeToggleAria"/);
  assert.match(html, /href="bright-theme\.css"/);
  assert.ok(build.includes('"bright-theme.css"'), "bright theme stylesheet in build manifest");
  const themeSource = read("site-ui.js");
  for (const language of ["en-GB", "zh-Hant", "zh-Hans", "yue-Hant-HK", "ja", "ko", "fr", "de", "es", "ms", "ar", "th"]) {
    assert.match(themeSource, new RegExp(`(?:"${language}"|${language}): \\{ brightMode:`), `${language} has explicit theme labels`);
  }
  const brightTheme = read("bright-theme.css");
  assert.match(brightTheme, /html\[data-theme="bright"\]/);
  assert.match(brightTheme, /\.computer-tool-card/);
  assert.match(brightTheme, /\.matrix-workspace/);
  assert.match(brightTheme, /\.panel-dialog/);
  assert.match(html, /id="love-egg-button"/);
  assert.match(html, /id="love-egg-dialog"/);
  assert.match(html, /src="love-heart\.js"/);
  const loveHeartSource = read("love-heart.c");
  assert.match(loveHeartSource, /int main\(void\)/);
  assert.match(loveHeartSource, /pow\(x \* x \+ y \* y - 1\.0, 3\.0\)/);
  assert.match(loveHeartSource, /38;2;%d;%d;%dm/);
  for (const asset of ["linear-algebra-i18n.js","statistics-core.js","statistics-calculator.js","probability-core.js","probability-calculator.js","statistics-probability-i18n.js","statistics-probability.css","additional-locales.js","computer-core.js","computer-calculator.js","computer-calculator.css","economics-core.js","economics-calculator.js","economics-calculator.css"]) {
    assert.ok(html.includes(asset) || asset.endsWith(".css") && html.includes(asset), `${asset} in HTML`);
    assert.ok(build.includes(`"${asset}"`), `${asset} in build manifest`);
  }
  for (const id of ["matrix-a","matrix-b"]) {
    assert.match(html, new RegExp(`<textarea id="${id}"[^>]*inputmode="text"[^>]*enterkeyhint="enter"`));
  }
  assert.match(html, /<option value="th">🇹🇭 ไทย<\/option>/);
  assert.match(html, /<option value="yue-Hant-HK">🇭🇰 粵語<\/option>/);
  assert.match(html, /data-i18n="aboutTitle">Maths made simple<\/h1>/);
  assert.match(html, /releases\/download\/android-debug-latest\/SciCal600-debug\.apk/);
  assert.match(html, /releases\/tag\/android-debug-latest/);
  assert.match(html, /data-i18n="androidDownload">Android APK · Verified testing build<\/span>/);
  assert.match(html, /data-i18n-aria="androidDownloadAria"/);
  assert.doesNotMatch(html, /fonts\.googleapis\.com|fonts\.gstatic\.com/, "native clients must not depend on remote font stylesheets");
  for (const key of [
    "nativeAvailabilityEyebrow", "nativeAvailabilityTitle", "nativeAvailabilityIntro",
    "nativeAndroidDescription", "nativeWindowsDescription", "nativeMacosDescription", "nativeIosDescription",
  ]) {
    assert.match(html, new RegExp(`data-i18n="${key}"`), `${key} is declared in static HTML`);
  }
  assert.doesNotMatch(html, /已验证测试版|原生客户端状态|下载与平台限制/);
});

test("localizes the Android download and native availability content in all twelve languages", () => {
  const { locales, manuals } = loadAdditionalLocales();
  assert.deepEqual(Object.keys(locales).sort(), ["ar","de","en-GB","es","fr","ja","ko","ms","th","yue-Hant-HK","zh-Hans","zh-Hant"].sort());
  const requiredKeys = [
    "androidDownload", "androidDownloadAria", "androidReleaseDetails", "androidChecksum", "androidFileSize",
    "androidDownloadDisclosure", "nativeAvailabilityEyebrow", "nativeAvailabilityTitle", "nativeAvailabilityIntro",
    "nativeAndroidDescription", "nativeWindowsDescription", "nativeMacosDescription", "nativeIosDescription",
  ];
  for (const [language, dictionary] of Object.entries(locales)) {
    for (const key of requiredKeys) {
      assert.equal(Object.hasOwn(dictionary, key), true, `${language}.${key} should be explicit`);
      assert.equal(typeof dictionary[key], "string", `${language}.${key} should be text`);
      assert.ok(dictionary[key].trim(), `${language}.${key} should not be empty`);
    }
    assert.match(dictionary.androidDownload, /Android|APK/);
    assert.doesNotMatch(dictionary.androidDownload, /↓/, `${language} label should not contain the decorative arrow`);
    if (language !== "en-GB") {
      assert.notEqual(dictionary.nativeAvailabilityTitle, locales["en-GB"].nativeAvailabilityTitle, `${language} native title should not fall back to English`);
      assert.notEqual(dictionary.nativeAndroidDescription, locales["en-GB"].nativeAndroidDescription, `${language} Android disclosure should not fall back to English`);
    }
  }
  assert.equal(locales.th.fallback, "en-GB");
  assert.equal(locales["yue-Hant-HK"].fallback, "zh-Hant");
  assert.match(locales.th.aboutTitle, /[\u0E00-\u0E7F]/);
  assert.match(locales.th.linearTitle, /[\u0E00-\u0E7F]/);
  assert.match(locales["yue-Hant-HK"].aboutTitle, /搞掂/);
  assert.match(locales["yue-Hant-HK"].matrixSwap, /同/);
  assert.ok(manuals.th.length >= 5);
  assert.ok(manuals["yue-Hant-HK"].length >= 5);
});

test("keeps locale composition static and preserves the existing dictionaries", () => {
  const siteUi = read("site-ui.js");
  const overlays = read("additional-locales.js");
  assert.match(siteUi, /ui\[language\] = \{ \.\.\.ui\[fallback\], \.\.\.\(ui\[language\] \|\| \{\}\), \.\.\.dictionary \}/);
  assert.doesNotMatch(overlays, /querySelector\("\.android-download"\)|androidDownload\.href/);
});

test("keeps both desktop packaging paths on the same isolated app protocol shell", () => {
  const desktopMain = read("desktop/main.cjs");
  const stagedMain = read("native/desktop/main.cjs");
  const releaseConfig = read("electron-builder.yml");
  const stagedConfig = read("native/desktop/electron-builder.yml");
  assert.equal(
    stagedMain.replace(/\r\n/g, "\n"),
    desktopMain.replace(/\r\n/g, "\n"),
    "root and staged desktop shells must stay identical",
  );
  assert.match(desktopMain, /registerSchemesAsPrivileged/);
  assert.match(desktopMain, /protocol\.handle\("app"/);
  assert.match(desktopMain, /APP_HOST = "scical600\.local"/);
  assert.ok(desktopMain.includes('const APP_ORIGIN = `app://${APP_HOST}`;'));
  assert.match(desktopMain, /contextIsolation: true/);
  assert.match(desktopMain, /nodeIntegration: false/);
  assert.match(desktopMain, /sandbox: true/);
  assert.match(desktopMain, /setPermissionRequestHandler/);
  assert.match(desktopMain, /EXTERNAL_ORIGINS/);
  assert.doesNotMatch(desktopMain, /loadFile\(/);
  assert.match(stagedConfig, /electronVersion: 44\.3\.0/);
  assert.match(releaseConfig, /target: nsis/);
  assert.match(releaseConfig, /target: portable/);
  assert.match(releaseConfig, /target: dmg/);
  assert.match(releaseConfig, /target: zip/);
  assert.match(releaseConfig, /artifactName: SciCal600-Windows-\$\{version\}-\$\{arch\}-Setup\.\$\{ext\}/);
  assert.match(releaseConfig, /artifactName: SciCal600-Windows-\$\{version\}-\$\{arch\}-Portable\.\$\{ext\}/);
  assert.match(releaseConfig, /artifactName: SciCal600-macOS-\$\{version\}-\$\{arch\}\.\$\{ext\}/);
});

test("keeps the multi-platform preview asset contract synchronized", () => {
  const config = read("electron-builder.yml");
  const desktopWorkflow = read(".github/workflows/desktop.yml");
  const releaseWorkflow = read(".github/workflows/multiplatform-release.yml");
  const expected = [
    "SciCal600-Windows-${RELEASE_VERSION}-x64-Setup.exe",
    "SciCal600-Windows-${RELEASE_VERSION}-x64-Portable.exe",
    "SciCal600-macOS-${RELEASE_VERSION}-x64.dmg",
    "SciCal600-macOS-${RELEASE_VERSION}-x64.zip",
    "SciCal600-macOS-${RELEASE_VERSION}-arm64.dmg",
    "SciCal600-macOS-${RELEASE_VERSION}-arm64.zip",
  ];
  assert.match(desktopWorkflow, /command: --win --x64/);
  assert.match(desktopWorkflow, /command: --mac --x64/);
  assert.match(desktopWorkflow, /command: --mac --arm64/);
  assert.match(config, /target: nsis/);
  assert.match(config, /target: portable/);
  assert.match(config, /target: dmg/);
  assert.match(config, /target: zip/);
  assert.match(releaseWorkflow, /android:[\s\S]*permissions:\s*\n\s*contents: write[\s\S]*uses: \.\/\.github\/workflows\/android\.yml/);
  assert.match(releaseWorkflow, /ios:[\s\S]*permissions:\s*\n\s*contents: write[\s\S]*uses: \.\/\.github\/workflows\/ios\.yml/);
  for (const asset of expected) {
    assert.ok(releaseWorkflow.includes(`test -f "publish/${asset}"`), `${asset} preview contract`);
  }
  assert.match(releaseWorkflow, /test "\$\(wc -l < publish\/SHA256SUMS\.txt\)" -eq 9/);
});

test("ships a branded adaptive Android launcher icon with themed-icon support", () => {
  const prepareAndroid = read("scripts/prepare-android.mjs");
  const fallback = read("native/android/app/src/main/res/mipmap-anydpi/scical_launcher.xml");
  const adaptive = read("native/android/app/src/main/res/mipmap-anydpi-v26/scical_launcher.xml");
  const themed = read("native/android/app/src/main/res/mipmap-anydpi-v33/scical_launcher.xml");
  const foreground = read("native/android/app/src/main/res/drawable/scical_icon_foreground.xml");
  const monochrome = read("native/android/app/src/main/res/drawable/scical_icon_monochrome.xml");
  assert.match(prepareAndroid, /android:icon="@mipmap\/scical_launcher"/);
  assert.match(prepareAndroid, /android:roundIcon="@mipmap\/scical_launcher"/);
  assert.match(fallback, /<vector/);
  assert.match(adaptive, /<adaptive-icon/);
  assert.match(adaptive, /@color\/scical_launcher_background/);
  assert.match(adaptive, /@drawable\/scical_icon_foreground/);
  assert.match(themed, /<monochrome android:drawable="@drawable\/scical_icon_monochrome"/);
  assert.match(foreground, /#A7EDCE/);
  assert.match(monochrome, /android:strokeColor="#FFFFFFFF"/);
});

test("ships a branded Android launch screen on modern and legacy devices", () => {
  const prepareAndroid = read("scripts/prepare-android.mjs");
  const splash = read("native/android/app/src/main/res/drawable/scical_splash.xml");
  const splashColors = read("native/android/app/src/main/res/values/scical_splash.xml");
  assert.match(prepareAndroid, /windowSplashScreenBackground[^\n]*@color\/scical_splash_background/);
  assert.match(prepareAndroid, /windowSplashScreenAnimatedIcon[^\n]*@drawable\/scical_icon_foreground/);
  assert.match(prepareAndroid, /postSplashScreenTheme[^\n]*@style\/AppTheme\.NoActionBar/);
  assert.match(prepareAndroid, /android:background[^\n]*@drawable\/scical_splash/);
  assert.match(splash, /@color\/scical_splash_background/);
  assert.match(splash, /@drawable\/scical_icon_foreground/);
  assert.match(splashColors, /<color name="scical_splash_background">#071019<\/color>/);
});

test("ships localized Android launcher shortcuts for every calculator workspace", () => {
  const prepareAndroid = read("scripts/prepare-android.mjs");
  const shortcuts = read("native/android/app/src/main/res/xml/scical_shortcuts.xml");
  const nativeIdentifiers = read("native/android/app/src/main/res/values/strings.xml");
  assert.match(prepareAndroid, /android\.app\.shortcuts/);
  assert.match(prepareAndroid, /@xml\/scical_shortcuts/);
  for (const route of ["scientific-calculator", "linear-algebra", "computer-calculator", "economics-calculator"]) {
    assert.match(shortcuts, new RegExp(`android:data="scical600:\/\/${route}"`));
  }
  const localizedDirectories = [
    "values", "values-ar", "values-b+yue+Hant+HK", "values-b+zh+Hans", "values-b+zh+Hant",
    "values-de", "values-es", "values-fr", "values-ja", "values-ko", "values-ms", "values-th",
  ];
  for (const directory of localizedDirectories) {
    const strings = read(`native/android/app/src/main/res/${directory}/scical_shortcuts.xml`);
    for (const key of ["shortcut_scientific", "shortcut_linear", "shortcut_computer", "shortcut_economics"]) {
      assert.match(strings, new RegExp(`<string name="${key}">[^<]+<\\/string>`), `${directory}.${key}`);
    }
  }
  for (const key of ["app_name", "title_activity_main", "package_name", "custom_url_scheme"]) {
    assert.match(nativeIdentifiers, new RegExp(`<string name="${key}" translatable="false">`), `${key} is a native identifier, not untranslated copy`);
  }
});

test("keeps the rolling Android testing Release public, prerelease and non-destructive", () => {
  const workflow = read(".github/workflows/android.yml");
  const androidSmoke = read("tests/android-smoke.cjs");
  const clientWorkflows = [
    read(".github/workflows/clients.yml"),
    read(".github/workflows/native-clients.yml"),
  ].join("\n");
  const iosWorkflow = read(".github/workflows/ios.yml");
  const manifest = JSON.parse(read("package.json"));
  assert.equal(manifest.dependencies["@capacitor/android"], "8.5.2");
  assert.equal(manifest.dependencies["@capacitor/clipboard"], "8.0.1");
  assert.equal(manifest.dependencies["@capacitor/haptics"], "8.0.2");
  assert.equal(manifest.dependencies["@capacitor/share"], "8.0.3");
  assert.equal(manifest.devDependencies["@capacitor/ios"], "8.5.2");
  assert.equal(manifest.devDependencies["electron-builder"], "26.17.0");
  assert.equal(manifest.engines.node, ">=22.12.0");
  assert.match(workflow, /npm audit --audit-level=high/);
  assert.doesNotMatch(workflow, /npm audit[^\n]*--omit=dev/);
  assert.match(workflow, /SCICAL_VERSION_CODE: \$\{\{ github\.run_number \}\}/);
  assert.match(workflow, /versionCode='\$\{GITHUB_RUN_NUMBER\}'/);
  assert.match(workflow, /versionName='\$EXPECTED_VERSION_NAME'/);
  assert.match(workflow, /version_code=%s\\nversion_name=%s/);
  const androidVersioning = read("native/android/app/scical.gradle");
  assert.match(androidVersioning, /packageVersion\}-dev\.\$\{buildNumber\}/);
  assert.match(androidVersioning, /SCICAL_VERSION_NAME/);
  assert.match(androidSmoke, /device\.shell\('input keyevent KEYCODE_BACK'\)/, "Back smoke uses the selected device's ADB connection");
  assert.doesNotMatch(androidSmoke, /device\.input\.press/, "Back smoke must not require Playwright's optional Android driver APKs");
  assert.match(workflow, /node tests\/android-smoke\.cjs \|\| \(adb logcat/);
  assert.doesNotMatch(workflow, /if ! node tests\/android-smoke\.cjs; then/, "emulator-runner executes script lines independently");
  assert.match(workflow, /ROLLING_TAG="android-debug-latest"/);
  assert.match(workflow, /IMMUTABLE_TAG="android-debug-\$\{GITHUB_SHA:0:12\}"/);
  assert.match(workflow, /gh release (?:create|edit) "\$ROLLING_TAG"[\s\S]*--prerelease --latest=false/);
  assert.match(workflow, /gh release upload "\$ROLLING_TAG"[\s\S]*--clobber/);
  assert.match(workflow, /curl --fail --location[\s\S]*SciCal600-debug\.apk/);
  assert.match(workflow, /--connect-timeout 15 --max-time 120/);
  assert.match(workflow, /sha256sum "\$destination\/SciCal600-debug\.apk"[\s\S]*= "\$APK_SHA256"/);
  assert.match(workflow, /cmp -s "\$destination\/SHA256SUMS" artifacts\/SHA256SUMS/);
  assert.ok(
    workflow.indexOf('verify_public_release "$IMMUTABLE_TAG"') < workflow.indexOf('gh release upload "$ROLLING_TAG"'),
    "the immutable public fallback is verified before rolling assets are replaced",
  );
  assert.match(workflow, /fixed download tag; that tag is not the asset source revision/);
  assert.match(workflow, /Immutable audit Release:/);
  assert.doesNotMatch(workflow, /gh release delete "\$(?:ROLLING_TAG|LATEST_TAG)"/);
  assert.doesNotMatch(workflow, /gh release edit "\$ROLLING_TAG"[\s\S]{0,200}--target/);
  assert.doesNotMatch(clientWorkflows, /gh release delete "\$LATEST_TAG"/);
  assert.doesNotMatch(clientWorkflows, /LATEST_TAG=/);
  assert.doesNotMatch(clientWorkflows, /npm install --save-dev --package-lock-only/, "client CI must consume the committed lockfile without rewriting exact versions");
  assert.doesNotMatch(clientWorkflows, /project-migration/, "client CI must build the reviewed sources without rewriting them first");
  for (const standalone of [workflow, clientWorkflows, iosWorkflow]) {
    assert.doesNotMatch(standalone, /tags:\s*\[['"]v\*['"]\]/, "standalone platform workflows must not publish competing stable v* Releases");
  }
});

test("adds native Android haptic feedback without changing the web calculator", () => {
  const nativeEntry = read("native/android-entry.js");
  const haptics = read("native/haptics.js");
  const androidSmoke = read("tests/android-smoke.cjs");
  assert.match(nativeEntry, /@capacitor\/haptics/);
  assert.match(nativeEntry, /ImpactStyle\.Light/);
  assert.match(nativeEntry, /installButtonHaptics/);
  assert.match(haptics, /closest\('button'\)/);
  assert.match(haptics, /event\.isPrimary === false/);
  assert.match(androidSmoke, /data-android-haptics/);
  assert.doesNotMatch(read("index.html"), /@capacitor\/haptics/, "web HTML stays independent of the native plugin");
});

test("shares the current result through Android while remaining hidden on the web", () => {
  const html = read("index.html");
  const nativeEntry = read("native/android-entry.js");
  const shareResult = read("native/share-result.js");
  const siteUi = read("site-ui.js");
  const additionalLocales = read("additional-locales.js");
  assert.match(html, /id="android-share-result"[^>]*hidden[^>]*data-i18n-aria="shareResult"/);
  assert.match(nativeEntry, /@capacitor\/share/);
  assert.match(nativeEntry, /installResultShare/);
  assert.match(shareResult, /translate\('shareResult'\)/);
  assert.match(shareResult, /dialogTitle/);
  assert.equal((siteUi.match(/shareResult:/g) || []).length, 10, "ten core dictionaries localize sharing");
  assert.equal((additionalLocales.match(/shareResult:/g) || []).length, 2, "Thai and Cantonese localize sharing");
  assert.match(read("tests/android-smoke.cjs"), /dataset\.androidShare/);
});

test("copies the current result through Android with localized confirmation", () => {
  const html = read("index.html");
  const nativeEntry = read("native/android-entry.js");
  const copyResult = read("native/copy-result.js");
  const siteUi = read("site-ui.js");
  const additionalLocales = read("additional-locales.js");
  assert.match(html, /id="android-copy-result"[^>]*hidden[^>]*data-i18n-aria="copyResult"/);
  assert.match(nativeEntry, /@capacitor\/clipboard/);
  assert.match(nativeEntry, /installResultCopy/);
  assert.match(copyResult, /await write\(\{ string \}\)/);
  assert.match(copyResult, /setLabel\('copiedResult'/);
  assert.equal((siteUi.match(/copyResult:/g) || []).length, 10, "ten core dictionaries localize copying");
  assert.equal((siteUi.match(/copiedResult:/g) || []).length, 10, "ten core dictionaries localize copy confirmation");
  assert.equal((additionalLocales.match(/copyResult:/g) || []).length, 2, "Thai and Cantonese localize copying");
  assert.equal((additionalLocales.match(/copiedResult:/g) || []).length, 2, "Thai and Cantonese localize copy confirmation");
  assert.match(read("tests/android-smoke.cjs"), /dataset\.androidCopy/);
});

test("keeps Android system-bar content legible across saved and runtime themes", () => {
  const config = JSON.parse(read("capacitor.config.json"));
  const nativeEntry = read("native/android-entry.js");
  const systemBars = read("native/system-bars.js");
  assert.deepEqual(config.plugins.SystemBars, {
    insetsHandling: "css",
    initialViewportFitValueHint: "cover",
    style: "DARK",
    hidden: false,
  });
  assert.match(nativeEntry, /installAndroidSystemBars/);
  assert.match(nativeEntry, /styles: SystemBarsStyle/);
  assert.match(systemBars, /styles\.Light/);
  assert.match(systemBars, /styles\.Dark/);
  assert.match(systemBars, /scical600:themechange/);
  assert.match(systemBars, /systemBars\.setStyle/);
  assert.match(systemBars, /systemBars\.show/);
  assert.match(read("site-ui.js"), /scical600:themechange/);
  assert.match(read("tests/android-smoke.cjs"), /dataset\.androidSystemBarsStyle/);
  assert.match(read("index.html"), /viewport-fit=cover/);
  assert.match(read("styles.css"), /env\(safe-area-inset-top\)/);
});

test("does not ship known client-side secret patterns", () => {
  const client = ["index.html","linear-algebra.js","linear-algebra-i18n.js","statistics-calculator.js","probability-calculator.js","statistics-probability-i18n.js","additional-locales.js","computer-calculator.js","economics-calculator.js","computer-i18n.js","economics-i18n.js","systembussing/index.html","systembussing/i18n.js"].map(read).join("\n");
  assert.doesNotMatch(client, /api[_-]?key\s*[:=]\s*["'][A-Za-z0-9_-]{12,}/i);
  assert.doesNotMatch(client, /ExchangeRate-API.*key=/i);
});
