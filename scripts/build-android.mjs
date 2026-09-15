import { execFileSync } from 'node:child_process';
import { resolve } from 'node:path';

const androidDirectory = resolve('android');
const command = process.platform === 'win32' ? (process.env.ComSpec || 'cmd.exe') : './gradlew';
const args = process.platform === 'win32'
  ? ['/d', '/s', '/c', 'gradlew.bat assembleDebug']
  : ['assembleDebug'];

execFileSync(command, args, {
  cwd: androidDirectory,
  stdio: 'inherit',
});
