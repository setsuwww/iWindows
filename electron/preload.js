/* eslint-env node */

const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("api", {
  close: () => ipcRenderer.send("win:close"),
  minimize: () => ipcRenderer.send("win:minimize"),
  toggleMax: () => ipcRenderer.send("win:toggleMax"),
});
