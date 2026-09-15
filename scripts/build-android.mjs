import { execFileSync } from 'node:child_process';
import { resolve } from 'node:path';

const wrapper = resolve('android', process.platform === 'win32' ? 'gradlew.bat' : 'gradlew');
execFileSync(wrapper, ['assembleDebug'], {
  cwd: resolve('android'),
  stdio: 'inherit',
});
