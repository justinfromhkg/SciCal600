'use strict';

const { app, BrowserWindow, protocol, shell, session } = require('electron');
const fs = require('node:fs/promises');
const path = require('node:path');
const { URL } = require('node:url');

const APP_SCHEME = 'app';
const APP_HOST = 'scical600.local';
const START_URL = `${APP_SCHEME}://${APP_HOST}/`;
const DIST_DIRECTORY = path.resolve(__dirname, '..', 'dist');
const ALLOWED_EXTERNAL_ORIGINS = new Set([
  'https://github.com',
  'https://frankfurter.dev',
  'https://apidocs.hkma.gov.hk',
]);
const CONTENT_SECURITY_POLICY = [
  "default-src 'self'",
  "base-uri 'none'",
  "connect-src 'self' https://api.frankfurter.dev https://api.hkma.gov.hk",
  "font-src 'self' data:",
  "form-action 'none'",
  "frame-ancestors 'none'",
  "frame-src 'none'",
  "img-src 'self' data:",
  "object-src 'none'",
  "script-src 'self'",
  "style-src 'self' 'unsafe-inline'",
  "worker-src 'none'",
].join('; ');

// Register the privileged scheme before app.ready so Chromium treats app:// as
// a secure, standard origin while the renderer never needs file:// access.
protocol.registerSchemesAsPrivileged([
  {
    scheme: APP_SCHEME,
    privileges: {
      standard: true,
      secure: true,
      supportFetchAPI: true,
      corsEnabled: true,
      allowServiceWorkers: false,
    },
  },
]);

const MIME_TYPES = {
  '.css': 'text/css; charset=utf-8',
  '.gif': 'image/gif',
  '.html': 'text/html; charset=utf-8',
  '.ico': 'image/x-icon',
  '.jpeg': 'image/jpeg',
  '.jpg': 'image/jpeg',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.txt': 'text/plain; charset=utf-8',
  '.webp': 'image/webp',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
};

function secureHeaders(contentType) {
  return {
    'cache-control': 'no-cache',
    'content-security-policy': CONTENT_SECURITY_POLICY,
    'content-type': contentType,
    'referrer-policy': 'no-referrer',
    'x-content-type-options': 'nosniff',
  };
}

function response(status, body = '') {
  return new Response(body, {
    status,
    headers: secureHeaders('text/plain; charset=utf-8'),
  });
}

async function serveAppRequest(request) {
  let requestUrl;
  try {
    requestUrl = new URL(request.url);
  } catch {
    return response(400, 'Bad request');
  }

  if (requestUrl.protocol !== `${APP_SCHEME}:` || requestUrl.hostname !== APP_HOST) {
    return response(403, 'Forbidden');
  }

  let pathname;
  try {
    pathname = decodeURIComponent(requestUrl.pathname);
  } catch {
    return response(400, 'Bad request');
  }

  if (pathname.includes('\0')) return response(400, 'Bad request');
  if (pathname === '/' || pathname.endsWith('/')) pathname += 'index.html';

  // Resolve the decoded path and enforce that it remains below dist/ to block
  // encoded and platform-specific traversal attempts.
  const relativePath = pathname.replace(/^\/+/, '').replaceAll('\\', '/');
  const filePath = path.resolve(DIST_DIRECTORY, relativePath);
  const distPrefix = `${DIST_DIRECTORY}${path.sep}`;
  if (filePath !== DIST_DIRECTORY && !filePath.startsWith(distPrefix)) {
    return response(403, 'Forbidden');
  }

  try {
    const file = await fs.readFile(filePath);
    const contentType = MIME_TYPES[path.extname(filePath).toLowerCase()] || 'application/octet-stream';
    return new Response(request.method === 'HEAD' ? null : file, {
      status: 200,
      headers: secureHeaders(contentType),
    });
  } catch (error) {
    if (error && error.code === 'ENOENT') return response(404, 'Not found');
    return response(500, 'Unable to read resource');
  }
}

function isInternalAppUrl(rawUrl) {
  try {
    const url = new URL(rawUrl);
    return url.protocol === `${APP_SCHEME}:` && url.hostname === APP_HOST;
  } catch {
    return false;
  }
}

function isAllowedExternalUrl(rawUrl) {
  try {
    const url = new URL(rawUrl);
    return (
      url.protocol === 'https:' &&
      ALLOWED_EXTERNAL_ORIGINS.has(url.origin) &&
      !url.username &&
      !url.password
    );
  } catch {
    return false;
  }
}

function openExternalUrl(rawUrl) {
  if (!isAllowedExternalUrl(rawUrl)) return;
  void shell.openExternal(new URL(rawUrl).toString()).catch(() => {});
}

function secureWebContents(contents) {
  contents.setWindowOpenHandler(({ url }) => {
    openExternalUrl(url);
    return { action: 'deny' };
  });

  contents.on('will-navigate', (event, navigationUrl) => {
    if (isInternalAppUrl(navigationUrl)) return;
    event.preventDefault();
    openExternalUrl(navigationUrl);
  });

  contents.on('will-attach-webview', (event) => {
    event.preventDefault();
  });
}

function createMainWindow() {
  const mainWindow = new BrowserWindow({
    width: 1280,
    height: 860,
    minWidth: 720,
    minHeight: 540,
    show: false,
    webPreferences: {
      allowRunningInsecureContent: false,
      contextIsolation: true,
      devTools: !app.isPackaged,
      nodeIntegration: false,
      sandbox: true,
      webSecurity: true,
      webviewTag: false,
    },
  });

  secureWebContents(mainWindow.webContents);
  mainWindow.once('ready-to-show', () => mainWindow.show());
  void mainWindow.loadURL(START_URL);
  return mainWindow;
}

app.whenReady().then(() => {
  protocol.handle(APP_SCHEME, serveAppRequest);
  session.defaultSession.setPermissionCheckHandler(() => false);
  session.defaultSession.setPermissionRequestHandler((_webContents, _permission, callback) => {
    callback(false);
  });

  createMainWindow();
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createMainWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
