const { app, BrowserWindow, Tray } = require("electron");

const Receiver = require("./model/Receiver");

const path = require("path");
let tray = null;
let menuStructure = [];


const server = new Receiver();

app.allowRendererProcessReuse = false;
// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) {
  // eslint-disable-line global-require
  app.quit();
}

const createWindow = () => {
  //Tray
  tray = new Tray(path.join(__dirname, "img", "mainIcon.png"));
  menuStructure = [
    /*0*/ { label: "listening/running", enabled:false },
    /*1*/ { type: 'separator' },
    /*2*/ { label: "Run", click: server.start.bind(server,tray,menuStructure)},
    /*3*/ { label: "Stop" },
    /*4*/ { type: 'separator' },
    /*5*/ { label: "Quit", click: () => app.exit(0) }
  ];

  tray.setToolTip("External control");

  server.start(tray,menuStructure);

};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
