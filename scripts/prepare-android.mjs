import { existsSync, readFileSync, writeFileSync, mkdirSync, cpSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { resolve } from 'node:path';
import { build } from 'esbuild';

const capacitorCli = resolve('node_modules', '@capacitor', 'cli', 'bin', 'capacitor');
const run = (...args) => execFileSync(process.execPath, [capacitorCli, ...args], { stdio: 'inherit' });
if (!existsSync('android')) run('add', 'android');
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
let manifest = readFileSync('android/app/src/main/AndroidManifest.xml', 'utf8');
manifest = manifest.replace('android:allowBackup="true"', 'android:allowBackup="false"');
manifest = manifest.replace(/ android:usesCleartextTraffic="[^"]*"/g, '');
manifest = manifest.replace('<application', '<application android:usesCleartextTraffic="false"');
manifest = manifest.replace('@mipmap/ic_launcher_round', '@drawable/scical_icon').replace('@mipmap/ic_launcher', '@drawable/scical_icon');
writeFileSync('android/app/src/main/AndroidManifest.xml', manifest);
let gradle = readFileSync('android/app/build.gradle', 'utf8');
if (!gradle.includes('scical.gradle')) gradle += "\napply from: 'scical.gradle'\n";
writeFileSync('android/app/build.gradle', gradle);
run('sync', 'android');
