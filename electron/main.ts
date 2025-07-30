import { app, BrowserWindow, ipcMain, session , dialog ,Menu ,webContents } from "electron";
import { autoUpdater } from "electron-updater";
// import dns from 'dns';

 
// import { createRequire } from 'node:module'
import { fileURLToPath } from "node:url";
import path from "node:path";

// const require = createRequire(import.meta.url)
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// The built directory structure
//
// ├─┬─┬ dist
// │ │ └── index.html
// │ │
// │ ├─┬ dist-electron
// │ │ ├── main.js
// │ │ └── preload.mjs
// │
process.env.APP_ROOT = path.join(__dirname, "..");

// 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
export const VITE_DEV_SERVER_URL = process.env["VITE_DEV_SERVER_URL"];
export const MAIN_DIST = path.join(process.env.APP_ROOT, "dist-electron");
export const RENDERER_DIST = path.join(process.env.APP_ROOT, "dist");

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL
  ? path.join(process.env.APP_ROOT, "public")
  : RENDERER_DIST;

let mainWindow: BrowserWindow | null;

function createWindow() {
  mainWindow = new BrowserWindow({
    icon: path.join(process.env.VITE_PUBLIC, "icon.png"),
    title: "Fanap Med Windows Application",
    width: 1500,
    height: 800,
    minHeight: 450,
    minWidth: 700,
    titleBarStyle: "hidden",
    webPreferences: {
      preload: path.join(__dirname, "preload.mjs"),
      webviewTag: true,
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      // allowDisplayingInsecureContent: true,
      // allowRunningInsecureContent: true,
    },
  });

  mainWindow.setMenu(null);
//  mainWindow.webContents.openDevTools();


  
ipcMain.on('show-webview-context-menu', (event, params) => {
  const template = [
    {
      label: 'هوش مصنوعی',
      click: () => {
        mainWindow?.webContents.send("ai-context-menu-selecttext", {
          selectionText: params.selectionText
        });
      }
    },
    { type: 'separator' },
    ...((params.hasText||params.isEditable) ? [
      {
        label: 'رونوشت',
        role: 'copy',
      },
      {
        label: 'بریدن',
        role: 'cut',
      },
      {
        label: 'جایگذاری',
        role: 'paste',
      },
      { type: 'separator' },
    ] : []),
    {
      label: 'بازگشت به صفحه قبل',
      enabled: params.canGoBack,
      click: () => {
        event.sender.goBack();
      }
    },
    {
      label: 'رفتن به صفحه بعد',
      enabled: params.canGoForward,
      click: () => {
        event.sender.goForward();
      }
    },
    {
      label: 'بازگذاری صفحه',
      click: () => {
        event.sender.reload();
      }
    },
    // {
    //   label: 'پرینت',
    //   click: () => {
    //     event.sender.print();
    //   }
    // },
    { type: 'separator' },
    {
      label: 'بررسی کد صفحه',
      click: () => {
        // دریافت webContents مربوط به webview
        const guestWebContents = webContents.fromId(params.webContentsId);
        guestWebContents.inspectElement(params.x, params.y);

        // فوکوس روی DevTools
        if (guestWebContents.isDevToolsOpened()) {
          guestWebContents.devToolsWebContents.focus();
        }
      }
    },
  ];

  const menu = Menu.buildFromTemplate(template);
  menu.popup({ window: event.sender.getOwnerBrowserWindow() });
});


  ipcMain.on("toggle-fullscreen", () => {
    const isFullscreen = mainWindow?.isMaximized();
    isFullscreen ? mainWindow?.unmaximize() : mainWindow?.maximize();
  });

  ipcMain.on("minimize", () => {
    mainWindow?.minimize();
  });

  ipcMain.on("close", () => {
    mainWindow?.close();
  });

  ipcMain.on("clearSession", async () => {
    const webviewSessions = session.defaultSession;
    await webviewSessions.clearStorageData();
    console.log("session cleared");
  });

  ipcMain.on("clearPartition", async (_, partition) => {
    const partitionSession = session.fromPartition(partition);
    await partitionSession.clearStorageData();
    console.log("partition cleared");
  });

  ipcMain.on("login-success", (event) => {
    console.log("Login successful from the webview", event);
  });

  ipcMain.on("message-from-webview", (_event, message) => {
    // Handle message from the webview
    console.log("Received message from webview:", message);
  });

  // Listen for messages from the child webview
  ipcMain.on("message-from-child", (_event, message) => {
    console.info("message-from-child => " + message);
    mainWindow?.webContents.send("message-to-parent", message); // Forward to parent
  });

  ipcMain.on("getAppPathMain", (_event, _message) => {
    console.info("message-from-child => " );
    mainWindow?.webContents.send("message-to-parent-app", path.join(__dirname)); // Forward to parent
  });


  // Test active push message to Renderer-process.
  mainWindow.webContents.on("did-finish-load", () => {
    mainWindow?.webContents.send(
      "main-process-message",
      new Date().toLocaleString()
    );
  });

  // mainWindow.webContents.setWindowOpenHandler(({ url }) => {
  //   alert("hi");

  //   if (url === "about:blank") {
  //     alert("hi");

  //     // return {
  //     //   action: "allow",
  //     //   overrideBrowserWindowOptions: {
  //     //     frame: false,
  //     //     fullscreenable: false,
  //     //     backgroundColor: "black",
  //     //     webPreferences: {
  //     //       preload: "my-child-window-preload-script.js",
  //     //     },
  //     //   },
  //     // };
  //   }
  //   return { action: "allow" };
  // });

  if (VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(VITE_DEV_SERVER_URL);
  } else {
    // mainWindow.loadFile('dist/index.html')
    mainWindow.loadFile(path.join(RENDERER_DIST, "index.html"));
  }

  // Set the feed URL for updates
  autoUpdater.setFeedURL({
    provider: "generic",
    url: "https://fanap.mizBunny.com/updates",
  });

  autoUpdater.forceDevUpdateConfig = true;
  // Check for updates after creating the window
  autoUpdater.checkForUpdatesAndNotify();

  // mainWindow.loadFile(path.join(__dirname, "test.html"));
  // mainWindow.loadFile(path.join(__dirname, "vue-dist/index.html"));

  // Open the DevTools.
  // else
    // mainWindow.webContents.openDevTools();

  // set user-agent
  mainWindow.webContents.userAgent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36" 

  // Handle auto-updater events
  autoUpdater.on("update-available", () => {
    console.log("Update available.");
    // dialog.showMessageBox({
    //   type: "info",
    //   title: "بروزرسانی موجود است",
    //   message: "نسخه جدید از نرم افزار موجود و در حال بارگیری است.",
    // });
  });
  autoUpdater.on("update-downloaded", () => {
    console.log("Update downloaded.");

    dialog
      .showMessageBox({
        type: "info",
        title: "بروزرسانی میزکار فناپ",
        message: "نسخه جدیدی از میزکار فناپ دانلود شده است. نرم افزار را ببند و نسخه جدید را نصب کن?",
        buttons: ["نصب کن", "بعدا"],
      })
      .then((result) => {
        if (result.response === 0) {
          autoUpdater.quitAndInstall();
        }
      });
    // autoUpdater.quitAndInstall();
  });
}

const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) {
  app.quit();
} else {
  app.on("second-instance", () => {
    // Someone tried to run a second instance, we should focus our window.
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
    }
  });

  app.on("web-contents-created", (_e, wc) => {
    // wc: webContents of <webview> is now under control
    wc.setWindowOpenHandler((handler) => {
      // console.log("url is : " + JSON.stringify(handler));
      mainWindow?.webContents.send("new-tab", handler.url);

      // mainWindow.webContents.send("submitted-form", null);
      return { action: "deny" }; // deny or allow
    });
  });

  app.on('certificate-error', (event, _webContents, _url, _error, _certificate, callback) => {
  
    // Prevent having error
    event.preventDefault()
    // and continue
    callback(true)

})

app.on('login', (_event, _webContents, _details, _authInfo, callback) => {
 
  // if (authInfo.isProxy) {
  //   console.info("**************************************************------PROXY------**********************************************");

  //   callback('user_yegane1980', 'user_yegane1980');
  // }
  // else if ((details.url.startsWith('http://37.152.190.148/powerbi/'))) {
  //   event.preventDefault()
  //   console.info("**************************************************------------**********************************************");
  //   //console.info(JSON.stringify(details));

    // callback('viewer', 'Zaq!@#$1234')
    //callback('developer1', 'dev1403@Fanap')
  // }
})

  // Quit when all windows are closed, except on macOS. There, it's common
  // for applications and their menu bar to stay active until the user quits
  // explicitly with Cmd + Q.
  app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
      app.quit();
      mainWindow = null;
    }
  });

  app.on("activate", () => {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });

 
  app.whenReady().then(() => {
    // app.configureHostResolver({
    //   secureDnsMode: 'secure',
    //   secreDnsServers: [
    //     'https://free.shecan.ir/dns-query'
    //   ]
    // });
    createWindow()
  

    // download 

    session.defaultSession.on('will-download', (_event, item, _webContents) => {
      // Get details about the download
      const url = item.getURL();
      const filename = item.getFilename();
      const totalBytes = item.getTotalBytes();
  
      console.log(`Downloading: ${filename}`);
      console.log(`URL: ${url}`);
      console.log(`Total Bytes: ${totalBytes}`);
  
      // Optionally set save path
      // item.setSavePath('/path/to/save/' + filename);
  
      // Monitor download progress
      item.on('updated', (_, state) => {
        if (state === 'progressing') {
          if (item.isPaused()) {
            console.log('Download is paused');
          } else {
            console.log(`Received bytes: ${item.getReceivedBytes()}`);
          }
        } else if (state === 'interrupted') {
          console.log('Download interrupted');
        }
      });
  
      // Detect when download is complete
      item.once('done', (_, state) => {
        if (state === 'completed') {
          console.log('Download completed successfully');
        } else {
          console.log(`Download failed: ${state}`);
        }
      });
    });

  
  })

//   dns.setServers(['10.202.10.202', '10.202.10.102']);

// app.on('ready', () => {
//   const defaultSession = session.defaultSession;

//   // Intercept requests to openai API and resolve using custom DNS IPs
//   defaultSession.webRequest.onBeforeRequest(async (details, callback) => {
//     const url = new URL(details.url);

//     if (url.hostname === 'api.openai.com') {
//       // Resolve the hostname using the custom DNS servers
//       dns.resolve4(url.hostname, (err, addresses) => {
//         if (err) {
//           console.error('DNS resolution failed:', err);
//           callback({ cancel: true });
//         } else {
//           // Use the resolved IP from the custom DNS servers
//           const ipAddress = addresses[0];
//           console.log(`Resolved IP for ${url.hostname}: ${ipAddress}`);
          
//           // Rewrite the request to use the resolved IP address
//           url.hostname = ipAddress;

//           // Pass the new IP-based URL to the callback
//           callback({ redirectURL: url.toString() });
//         }
//       });
//     } else {
//       callback({ cancel: false }); // Continue normally for other URLs
//     }
//   });
// });


}