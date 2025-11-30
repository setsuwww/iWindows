/* eslint-env node */

const { app, BrowserWindow, ipcMain, screen } = require("electron");
const path = require("path");

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 700,
    minWidth: 900,
    minHeight: 600,
    frame: false,
    transparent: true,
    backgroundColor: "#00000000",
    titleBarStyle: "hidden",
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  mainWindow.loadURL(
    process.env.VITE_DEV_SERVER_URL ||
      `file://${path.join(__dirname, "../dist/index.html")}`
  );
}

ipcMain.on("win:close", () => {
  if (mainWindow) mainWindow.close();
});

ipcMain.on("win:minimize", () => {
  if (mainWindow) mainWindow.minimize();
});

ipcMain.on("win:toggleMax", () => {
  if (mainWindow.isMaximized()) {
    mainWindow.unmaximize();
  } else {
    const { width, height } = screen.getPrimaryDisplay().workAreaSize;
    mainWindow.setBounds({ x: 0, y: 0, width, height });
  }
});


app.whenReady().then(createWindow);
