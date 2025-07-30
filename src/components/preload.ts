import { ipcRenderer, contextBridge } from "electron";



window.addEventListener('contextmenu', (event) => {
  event.preventDefault();
  const selectionText = window.getSelection().toString();
  const isEditable = event.target.matches('input, textarea, [contenteditable="true"]');
  ipcRenderer.sendToHost('context-menu-event', {
    x: event.x,
    y: event.y,
    selectionText:selectionText,
    hasText: !!window.getSelection().toString(),
    isEditable:isEditable,
    // می‌توانید اطلاعات بیشتری مانند URL یا موقعیت موس را اضافه کنید
  });
});

// --------- Expose some API to the Renderer process ---------
contextBridge.exposeInMainWorld("ipcRenderer", {
  on(...args: Parameters<typeof ipcRenderer.on>) {
    const [channel, listener] = args;
    return ipcRenderer.on(channel, (event, ...args) =>
      listener(event, ...args)
    );
  },
  off(...args: Parameters<typeof ipcRenderer.off>) {
    const [channel, ...omit] = args;
    return ipcRenderer.off(channel, ...omit);
  },
  send(...args: Parameters<typeof ipcRenderer.send>) {
    const [channel, ...omit] = args;
    return ipcRenderer.send(channel, ...omit);
  },
  invoke(...args: Parameters<typeof ipcRenderer.invoke>) {
    const [channel, ...omit] = args;
    return ipcRenderer.invoke(channel, ...omit);
  },
  // receive: (channel: any, func: any) => {
  //   console.log('recieve method called with channel:', channel);
  //   const validChannels = ["fromMain"];
  //   if (validChannels.includes(channel)) {
  //     // Deliberately strip event as it includes `sender`
  //     ipcRenderer.on(channel, (event, ...args) => func(...args));
  //   }
  // },

  // receiveMessage: (callback: any) =>
  //   ipcRenderer.on("message", (_, data) => callback(data)),

  // You can expose other APIs you need here.
  // ...
  showWebviewContextMenu: (params: any) => ipcRenderer.send('show-webview-context-menu', params),
  toggleFullscreen: () => ipcRenderer.send("toggle-fullscreen"),
  minimize: () => ipcRenderer.send("minimize"),
  close: () => ipcRenderer.send("close"),
  clearSession: () => ipcRenderer.send("clearSession"),
  clearPartition: (partition: any) =>
    ipcRenderer.send("clearPartition", partition),
  receiveMessage: (callback: any) => {
    ipcRenderer.on("message-to-parent", (_, message) => callback(message)); // Send to parent window
  },
});
