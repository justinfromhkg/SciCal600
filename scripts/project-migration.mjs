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
const nativeSection = `\n## Native clients\n\n- **Android:** GitHub Actions builds and emulator-tests an installable APK.\n- **Windows:** GitHub Actions packages a portable Electron executable.\n- **macOS:** GitHub Actions packages Intel and Apple-silicon Electron app archives. Unsigned development builds may require the standard macOS manual-open flow.\n- **iOS:** GitHub Actions builds the Capacitor iOS app for the simulator and an unsigned device archive for development. A directly installable physical-device IPA requires Apple signing credentials; the web app remains installable from Safari as a Home Screen app without those credentials.\n\nAll native clients reuse the same SciCal600 web calculation code and tests.\n`;
if (!readme.includes('## Native clients')) {
  readme = readme.replace('\n## Run it\n', `${nativeSection}\n## Run it\n`);
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
