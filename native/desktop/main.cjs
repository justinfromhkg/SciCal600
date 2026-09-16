const { app, BrowserWindow, shell } = require("electron");
const path = require("node:path");

const appRoot = path.join(__dirname, "dist");

function createWindow() {
  const window = new BrowserWindow({
    width: 1280,
    height: 840,
    minWidth: 860,
    minHeight: 620,
    autoHideMenuBar: true,
    backgroundColor: "#071019",
    title: "SciCal600",
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
      webSecurity: true,
      webviewTag: false,
    },
  });

  window.webContents.setWindowOpenHandler(({ url }) => {
    if (/^https?:\/\//i.test(url)) void shell.openExternal(url);
    return { action: "deny" };
  });

  window.webContents.on("will-navigate", (event, url) => {
    if (!url.startsWith("file:")) {
      event.preventDefault();
      if (/^https?:\/\//i.test(url)) void shell.openExternal(url);
    }
  });

  window.loadFile(path.join(appRoot, "index.html"));
}

app.setName("SciCal600");
if (process.platform === "win32") app.setAppUserModelId("io.github.justinfromhkg.scical600");

app.whenReady().then(() => {
  createWindow();
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
