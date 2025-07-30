const { contextBridge, ipcRenderer } = require("electron");

// Expose safe methods to send and receive messages
contextBridge.exposeInMainWorld("electronAPI", {
  sendToMain: (message) => {
    ipcRenderer.send("message-from-child", message); // Send to main process
  },
  receiveMessage: (callback) => {
    ipcRenderer.on("message-to-parent", (event, message) => callback(message)); // Send to parent window
  },
});
