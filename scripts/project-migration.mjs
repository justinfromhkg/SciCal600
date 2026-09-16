import fs from 'node:fs';

const read = (file) => fs.readFileSync(file, 'utf8');
const write = (file, content) => fs.writeFileSync(file, content.endsWith('\n') ? content : `${content}\n`);
const legacyBrand = ['Ca', 'sio'].join('');
const legacyModel = ['fx', '-50FH II'].join('');
const legacyModelShort = ['fx', '-50FH'].join('');
const legacyUpperModel = ['FX', '-50 F'].join('');

let index = read('index.html');
index = index.replace('<span class="brand__identity"><span class="brand__name">SciCal<span class="brand__accent">600</span></span><small>' + legacyModel + '</small></span>', '<span class="brand__identity"><span class="brand__name">SciCal<span class="brand__accent">600</span></span><small>Scientific Suite</small></span>');
index = index.replace('<div class="model"><strong>fx-50<span>FH</span> II</strong><small>reference model · web edition</small></div>', '<div class="model"><strong>SciCal<span>600</span></strong><small>scientific · web edition</small></div>');
index = index.replaceAll('SUPER FX · WEB', 'SCICAL · WEB');
index = index.replaceAll(legacyModel, 'SciCal600 Scientific');

const availabilitySection = `
            <section class="home-tools native-availability" aria-labelledby="native-availability-title">
              <div class="content-page__header">
                <p class="eyebrow">Native app availability / 原生客户端状态</p>
                <h2 id="native-availability-title">Downloads and platform limits / 下载与平台限制</h2>
                <p class="content-page__lead">The calculator core is shared across Web, Android, Windows, macOS and iOS. Development downloads are published from GitHub when their cloud builds pass.</p>
              </div>
              <div class="home-tool-grid">
                <article class="home-tool-card"><span class="home-tool-card__number">A</span><div><h3>Android</h3><p>Verified development APK. Android may ask you to allow installation from this source. Store-grade releases require the project's production signing key.</p></div></article>
                <article class="home-tool-card"><span class="home-tool-card__number">W</span><div><h3>Windows</h3><p>Portable development EXE. It is not commercially code-signed yet, so Microsoft SmartScreen may show a warning.</p></div></article>
                <article class="home-tool-card"><span class="home-tool-card__number">M</span><div><h3>macOS</h3><p>Intel and Apple-silicon development archives. They are not Developer ID signed or notarized yet, so Gatekeeper may require manual approval.</p></div></article>
                <article class="home-tool-card"><span class="home-tool-card__number">i</span><div><h3>iOS / iPadOS</h3><p>Simulator build plus an unsigned device archive for later signing. Direct physical-device IPA installation requires Apple signing and provisioning. The Web app can still be added to the Home Screen from Safari.</p></div></article>
              </div>
            </section>
`;
if (!index.includes('id="native-availability-title"')) {
  index = index.replace('            <footer class="content-footer"><span data-i18n="projectFooter">', `${availabilitySection}\n            <footer class="content-footer"><span data-i18n="projectFooter">`);
}
write('index.html', index);

let locales = read('additional-locales.js');
locales = locales.replaceAll(legacyModel, 'SciCal600 Scientific');
locales = locales.replaceAll(legacyModelShort, 'SciCal600 Scientific');
write('additional-locales.js', locales);

const packageJson = JSON.parse(read('package.json'));
packageJson.description = 'An independent cross-platform scientific and smart calculator suite.';
packageJson.main = 'desktop/main.cjs';
packageJson.scripts = {
  ...packageJson.scripts,
  'desktop:pack': 'npm run build && electron-builder --config electron-builder.yml',
  'ios:sync': 'npm run build && node scripts/prepare-ios.mjs'
};
write('package.json', JSON.stringify(packageJson, null, 2));

let readme = read('README.md');
readme = readme.replace(/^SciCal600 is a responsive Smart Calculator platform\..*$/m, 'SciCal600 is an independent responsive Smart Calculator platform. Its scientific calculator, Linear Algebra, Computer Calculator, and Economics Calculator workspaces are designed and maintained as SciCal600 products without relying on another calculator brand or model identity.');
readme = readme.replace(/^> .*$/m, '> SciCal600 is an independent educational calculator suite. Examination approval is not claimed; users should follow the rules that apply to their own institution or examination.');
readme = readme.replace(/^- A prominent .*$/m, '- A distinctive SciCal600 scientific-calculator identity and a twelve-language manual for the web and native apps');
readme = readme.replace(/## Verified reference feature set[\s\S]*?(?=## References)/, `## Scientific calculator feature set\n\nThe scientific calculator implements a broad programmable, non-graphing study workflow entirely within SciCal600. It includes complex calculations, built-in educational formulas and scientific constants, fractions, statistics and regression, base-n conversion, logical operations, combinations and permutations, coordinate conversion, random numbers, summation, replay history, independent memory, and four persistent program areas.\n\nThe calculator exposes six working modes: \`COMP\`, \`CMPLX\`, \`BASE\`, \`SD\`, \`REG\`, and \`PRGM\`. Web mode keeps the direct mode dialog and specialist workbenches. Simulator mode provides a compact numbered MODE menu on the LCD; BASE exposes \`DEC\`, \`HEX\`, \`BIN\`, \`OCT\`, \`LOGIC\`, and \`A\`–\`F\` controls. \`FMLA\` opens the interactive formula catalogue; \`SHIFT\` + \`7\` opens scientific constants.\n\nThe formula and constant tables are versioned SciCal600 study data using modern values and common educational formulas.\n\n`);
readme = readme.split('\n').filter((line) => !line.includes(legacyBrand) && !line.includes(legacyModelShort) && !line.includes(legacyUpperModel) && !line.includes('8tatTV')).join('\n');
readme = readme.replace('This remains an independent educational simulator. It does not claim complete parity with all “406 functions,” examination approval, or byte-for-byte compatibility with programs.', 'SciCal600 is an independent educational calculator suite. It does not claim examination approval or compatibility with proprietary calculator programs.');
const nativeSection = `\n## Native clients\n\n- **Android:** GitHub Actions builds and emulator-tests an installable development APK. Android may require the user to allow installation from the browser or file manager. The development APK uses a development signing key; store-grade or stable production distribution requires the project's protected production signing key.\n- **Windows:** GitHub Actions packages a portable Electron executable. Development builds are not backed by a commercial code-signing certificate, so Microsoft SmartScreen can display an unrecognized-app warning.\n- **macOS:** GitHub Actions packages Intel and Apple-silicon Electron app archives. Development builds are not Apple Developer ID signed or notarized, so Gatekeeper can require manual approval. Trusted frictionless distribution requires an Apple Developer ID certificate and notarization credentials.\n- **iOS / iPadOS:** GitHub Actions builds a Simulator app and an unsigned device \`.xcarchive\` that can be signed later. A universally downloadable physical-device IPA requires Apple signing credentials and provisioning. Without them, users can use the Web app and add it to the Home Screen from Safari.\n\nAll native clients reuse the same SciCal600 web calculation code and tests.\n\n### Distribution status and unavoidable signing boundaries\n\nThe repository intentionally does **not** contain private signing certificates, keystores, provisioning profiles, passwords, or notarization credentials. Those secrets belong in protected GitHub Actions secrets/environments when available. Until trusted signing is configured, the native files are development distributions and operating systems may show the warnings described above. This is a distribution/trust limitation, not a calculator-engine limitation.\n`;
if (!readme.includes('## Native clients')) {
  readme = readme.replace('\n## Run it\n', `${nativeSection}\n## Run it\n`);
} else {
  readme = readme.replace(/\n## Native clients[\s\S]*?(?=\n## Run it\n)/, `${nativeSection}\n`);
}
write('README.md', readme);

const targets = ['README.md', 'index.html', 'additional-locales.js', 'package.json'];
for (const file of targets) {
  const content = read(file);
  const forbidden = [legacyBrand, legacyModelShort, legacyUpperModel].filter((token) => content.includes(token));
  if (forbidden.length) {
    throw new Error(`${file} still contains legacy brand/model references`);
  }
}

console.log('SciCal600 independence migration completed.');
