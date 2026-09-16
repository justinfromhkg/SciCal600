import { copyFileSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const indexPath = resolve('dist', 'index.html');
const rendererName = 'desktop-renderer.js';

copyFileSync(resolve('desktop', 'renderer.js'), resolve('dist', rendererName));

let html = readFileSync(indexPath, 'utf8');
html = html.replace(/\s*<link\b[^>]*href=["']https:\/\/fonts\.(?:googleapis|gstatic)\.com[^>]*>\s*/gi, '\n');
html = html.replace(/\s*<script\s+data-scical-platform=["']desktop["'][^>]*><\/script>\s*/gi, '\n');
html = html.replace(
  '</body>',
  `  <script data-scical-platform="desktop" src="${rendererName}"></script>\n  </body>`,
);
writeFileSync(indexPath, html);

console.log('Prepared offline desktop renderer assets in dist/.');
