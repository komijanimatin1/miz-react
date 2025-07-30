"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
var electron_1 = require("electron");
var electron_updater_1 = require("electron-updater");
// import dns from 'dns';
// import { createRequire } from 'node:module'
var path = require("node:path");
var __dirname = path.dirname(new URL(import.meta.url).pathname);
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
var mainWindow;
function createWindow() {
    var _this = this;
    mainWindow = new electron_1.BrowserWindow({
        icon: path.join(process.env.APP_ROOT, "public", "icon.png"),
        title: "Fanap Med Windows Application",
        width: 1500,
        height: 800,
        minHeight: 450,
        minWidth: 700,
        titleBarStyle: "hidden",
        webPreferences: {
            preload: path.join(__dirname, "preload.js"),
            webviewTag: true,
            nodeIntegration: false,
            contextIsolation: true,
        },
    });
    mainWindow.setMenu(null);
    electron_1.ipcMain.on('show-webview-context-menu', function (event, params) {
        var template = __spreadArray(__spreadArray([
            {
                label: 'هوش مصنوعی',
                click: function () {
                    mainWindow === null || mainWindow === void 0 ? void 0 : mainWindow.webContents.send("ai-context-menu-selecttext", {
                        selectionText: params.selectionText
                    });
                }
            },
            { type: 'separator' }
        ], ((params.hasText || params.isEditable) ? [
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
        ] : []), true), [
            {
                label: 'بازگشت به صفحه قبل',
                enabled: params.canGoBack,
                click: function () {
                    event.sender.goBack();
                }
            },
            {
                label: 'رفتن به صفحه بعد',
                enabled: params.canGoForward,
                click: function () {
                    event.sender.goForward();
                }
            },
            {
                label: 'بازگذاری صفحه',
                click: function () {
                    event.sender.reload();
                }
            },
            { type: 'separator' },
            {
                label: 'بررسی کد صفحه',
                click: function () {
                    var guestWebContents = electron_1.webContents.fromId(params.webContentsId);
                    guestWebContents.inspectElement(params.x, params.y);
                    if (guestWebContents.isDevToolsOpened()) {
                        guestWebContents.devToolsWebContents.focus();
                    }
                }
            },
        ], false);
        var menu = electron_1.Menu.buildFromTemplate(template);
        menu.popup({ window: event.sender.getOwnerBrowserWindow() });
    });
    electron_1.ipcMain.on("toggle-fullscreen", function () {
        var isFullscreen = mainWindow === null || mainWindow === void 0 ? void 0 : mainWindow.isMaximized();
        isFullscreen ? mainWindow === null || mainWindow === void 0 ? void 0 : mainWindow.unmaximize() : mainWindow === null || mainWindow === void 0 ? void 0 : mainWindow.maximize();
    });
    electron_1.ipcMain.on("minimize", function () {
        mainWindow === null || mainWindow === void 0 ? void 0 : mainWindow.minimize();
    });
    electron_1.ipcMain.on("close", function () {
        mainWindow === null || mainWindow === void 0 ? void 0 : mainWindow.close();
    });
    electron_1.ipcMain.on("clearSession", function () { return __awaiter(_this, void 0, void 0, function () {
        var webviewSessions;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    webviewSessions = electron_1.session.defaultSession;
                    return [4 /*yield*/, webviewSessions.clearStorageData()];
                case 1:
                    _a.sent();
                    console.log("session cleared");
                    return [2 /*return*/];
            }
        });
    }); });
    electron_1.ipcMain.on("clearPartition", function (_, partition) { return __awaiter(_this, void 0, void 0, function () {
        var partitionSession;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    partitionSession = electron_1.session.fromPartition(partition);
                    return [4 /*yield*/, partitionSession.clearStorageData()];
                case 1:
                    _a.sent();
                    console.log("partition cleared");
                    return [2 /*return*/];
            }
        });
    }); });
    electron_1.ipcMain.on("login-success", function (event) {
        console.log("Login successful from the webview", event);
    });
    electron_1.ipcMain.on("message-from-webview", function (_event, message) {
        // Handle message from the webview
        console.log("Received message from webview:", message);
    });
    // Listen for messages from the child webview
    electron_1.ipcMain.on("message-from-child", function (_event, message) {
        console.info("message-from-child => " + message);
        mainWindow === null || mainWindow === void 0 ? void 0 : mainWindow.webContents.send("message-to-parent", message); // Forward to parent
    });
    electron_1.ipcMain.on("getAppPathMain", function (_event, _message) {
        console.info("message-from-child => ");
        mainWindow === null || mainWindow === void 0 ? void 0 : mainWindow.webContents.send("message-to-parent-app", path.join(__dirname)); // Forward to parent
    });
    // Test active push message to Renderer-process.
    mainWindow.webContents.on("did-finish-load", function () {
        mainWindow === null || mainWindow === void 0 ? void 0 : mainWindow.webContents.send("main-process-message", new Date().toLocaleString());
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
    if (process.env.NODE_ENV === 'development') {
        mainWindow.loadURL('http://localhost:3000');
        mainWindow.webContents.openDevTools();
    }
    else {
        mainWindow.loadFile(path.join(__dirname, '..', 'out', 'index.html'));
    }
    // Set the feed URL for updates
    electron_updater_1.autoUpdater.setFeedURL({
        provider: "generic",
        url: "https://fanap.mizBunny.com/updates",
    });
    electron_updater_1.autoUpdater.forceDevUpdateConfig = true;
    // Check for updates after creating the window
    electron_updater_1.autoUpdater.checkForUpdatesAndNotify();
    // mainWindow.loadFile(path.join(__dirname, "test.html"));
    // mainWindow.loadFile(path.join(__dirname, "vue-dist/index.html"));
    // Open the DevTools.
    // else
    // mainWindow.webContents.openDevTools();
    // set user-agent
    mainWindow.webContents.userAgent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36";
    // Handle auto-updater events
    electron_updater_1.autoUpdater.on("update-available", function () {
        console.log("Update available.");
        // dialog.showMessageBox({
        //   type: "info",
        //   title: "بروزرسانی موجود است",
        //   message: "نسخه جدید از نرم افزار موجود و در حال بارگیری است.",
        // });
    });
    electron_updater_1.autoUpdater.on("update-downloaded", function () {
        console.log("Update downloaded.");
        electron_1.dialog
            .showMessageBox({
            type: "info",
            title: "بروزرسانی میزکار فناپ",
            message: "نسخه جدیدی از میزکار فناپ دانلود شده است. نرم افزار را ببند و نسخه جدید را نصب کن?",
            buttons: ["نصب کن", "بعدا"],
        })
            .then(function (result) {
            if (result.response === 0) {
                electron_updater_1.autoUpdater.quitAndInstall();
            }
        });
        // autoUpdater.quitAndInstall();
    });
}
var gotTheLock = electron_1.app.requestSingleInstanceLock();
if (!gotTheLock) {
    electron_1.app.quit();
}
else {
    electron_1.app.on("second-instance", function () {
        // Someone tried to run a second instance, we should focus our window.
        if (mainWindow) {
            if (mainWindow.isMinimized())
                mainWindow.restore();
            mainWindow.focus();
        }
    });
    electron_1.app.on("web-contents-created", function (_e, wc) {
        // wc: webContents of <webview> is now under control
        wc.setWindowOpenHandler(function (handler) {
            // console.log("url is : " + JSON.stringify(handler));
            mainWindow === null || mainWindow === void 0 ? void 0 : mainWindow.webContents.send("new-tab", handler.url);
            // mainWindow.webContents.send("submitted-form", null);
            return { action: "deny" }; // deny or allow
        });
    });
    electron_1.app.on('certificate-error', function (event, _webContents, _url, _error, _certificate, callback) {
        // Prevent having error
        event.preventDefault();
        // and continue
        callback(true);
    });
    electron_1.app.on('login', function (_event, _webContents, _details, _authInfo, callback) {
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
    });
    // Quit when all windows are closed, except on macOS. There, it's common
    // for applications and their menu bar to stay active until the user quits
    // explicitly with Cmd + Q.
    electron_1.app.on("window-all-closed", function () {
        if (process.platform !== "darwin") {
            electron_1.app.quit();
            mainWindow = null;
        }
    });
    electron_1.app.on("activate", function () {
        // On OS X it's common to re-create a window in the app when the
        // dock icon is clicked and there are no other windows open.
        if (electron_1.BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
    electron_1.app.whenReady().then(function () {
        // app.configureHostResolver({
        //   secureDnsMode: 'secure',
        //   secreDnsServers: [
        //     'https://free.shecan.ir/dns-query'
        //   ]
        // });
        createWindow();
        // download
        electron_1.session.defaultSession.on('will-download', function (_event, item, _webContents) {
            // Get details about the download
            var url = item.getURL();
            var filename = item.getFilename();
            var totalBytes = item.getTotalBytes();
            console.log("Downloading: ".concat(filename));
            console.log("URL: ".concat(url));
            console.log("Total Bytes: ".concat(totalBytes));
            // Optionally set save path
            // item.setSavePath('/path/to/save/' + filename);
            // Monitor download progress
            item.on('updated', function (_, state) {
                if (state === 'progressing') {
                    if (item.isPaused()) {
                        console.log('Download is paused');
                    }
                    else {
                        console.log("Received bytes: ".concat(item.getReceivedBytes()));
                    }
                }
                else if (state === 'interrupted') {
                    console.log('Download interrupted');
                }
            });
            // Detect when download is complete
            item.once('done', function (_, state) {
                if (state === 'completed') {
                    console.log('Download completed successfully');
                }
                else {
                    console.log("Download failed: ".concat(state));
                }
            });
        });
    });
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
