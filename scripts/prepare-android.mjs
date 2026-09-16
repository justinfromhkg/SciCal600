import { existsSync, readFileSync, writeFileSync, cpSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { resolve } from 'node:path';
import { build } from 'esbuild';

const capacitorCli = resolve('node_modules', '@capacitor', 'cli', 'bin', 'capacitor');
const run = (...args) => execFileSync(process.execPath, [capacitorCli, ...args], { stdio: 'inherit' });
if (!existsSync('android')) run('add', 'android');
const manifestPath = resolve('android', 'app', 'src', 'main', 'AndroidManifest.xml');
if (!existsSync(manifestPath)) {
  throw new Error('The generated android/ directory is incomplete. Remove that disposable directory and run npm run android:sync again.');
}
await build({
  entryPoints: [resolve('native', 'android-entry.js')],
  bundle: true,
  outfile: resolve('dist', 'android.js'),
  format: 'iife',
  target: 'chrome89',
});
let html = readFileSync('dist/index.html', 'utf8');
// Native resources are entirely local, including fonts (system fallbacks).
html = html.replace(/<link[^>]+https:\/\/fonts\.[^>]+>/g, '');
html = html.replace('</body>', '<script src="android.js"></script></body>');
writeFileSync('dist/index.html', html);
cpSync('native/android', 'android', { recursive: true });
let manifest = readFileSync(manifestPath, 'utf8');
if (!/<application\b/.test(manifest)) throw new Error('Generated AndroidManifest.xml has no <application> element.');
manifest = manifest.replace(/<application\b([^>]*)>/, (_match, attributes) => {
  const hardenedAttributes = attributes
    .replace(/\sandroid:allowBackup="[^"]*"/g, '')
    .replace(/\sandroid:usesCleartextTraffic="[^"]*"/g, '')
    .replace(/\sandroid:icon="[^"]*"/g, '')
    .replace(/\sandroid:roundIcon="[^"]*"/g, '');
  return `<application${hardenedAttributes} android:allowBackup="false" android:usesCleartextTraffic="false" android:icon="@drawable/scical_icon" android:roundIcon="@drawable/scical_icon">`;
});
writeFileSync(manifestPath, manifest);
let gradle = readFileSync('android/app/build.gradle', 'utf8');
if (!gradle.includes('scical.gradle')) gradle += "\napply from: 'scical.gradle'\n";
writeFileSync('android/app/build.gradle', gradle);
run('sync', 'android');

const syncedManifest = readFileSync(manifestPath, 'utf8');
for (const requiredSetting of [
  'android:allowBackup="false"',
  'android:usesCleartextTraffic="false"',
  'android:icon="@drawable/scical_icon"',
]) {
  if (!syncedManifest.includes(requiredSetting)) {
    throw new Error(`Android hardening postcondition is missing: ${requiredSetting}`);
  }
}
const syncedGradle = readFileSync('android/app/build.gradle', 'utf8');
if ((syncedGradle.match(/scical\.gradle/g) || []).length !== 1) {
  throw new Error('Expected exactly one scical.gradle include in android/app/build.gradle.');
}
