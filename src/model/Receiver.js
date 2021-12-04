//Electron
const { ipcRenderer, Menu } = require("electron");

//Control
const OSControl = require("./OSControl");
const osControl = new OSControl();

//NodeJS
const express = require("express");
const { networkInterfaces } = require("os");

const path = require("path");

class Receiver {
  constructor(port = 3000) {
    this.port = port;
    this.app = null;
    this.server = null;
    this.router = null;
    //Tray
    this.menu = null;
    this.tray = null;
  }

  setUpServer(tray, menu) {
    if (tray !== null && menu.length > 0) {
      this.tray = tray;
      this.menu = menu;
    }
    this.app = express();
    this.router = express.Router();
    this.router.get("/", (req, res, next) => {
      res.sendFile(path.join(__dirname, "./../view/serverView.html"));
    });

    this.app.use("/", this.router);
  }
  start(tray, menu) {
    
    this.setUpServer(tray, menu);
    this.server = this.app.listen(
      this.port,
      onConnectHandler.bind(this, this.port, this.tray, this.menu)
    );

    const io = require("socket.io")(this.server);
    io.on("connection", (con) => {
      console.log("Someone is connected");
      con.on("disconnect", () => console.log("client disconnected"));
      con.on("type", typeHandler);
      con.on("move", moveHandler);
      con.on("mousePress", pressHandler);
      con.on("scroll",scrollHandler)
    });
    
    this.menu[3].click = stopHandler.bind(this,this.server,this.tray,this.menu);
  }
}

let stopHandler = (server,tray,menu) => {
  server.close(() => console.log("Server Closed"));
  menu[0].label = `Stopped`;
  tray.setContextMenu(Menu.buildFromTemplate(menu));
};

let typeHandler = (data) => {
  osControl.type(data);
};

let moveHandler = (data) => {
  osControl.move(data[0],data[1])
};

let pressHandler = (data) => {
  if (data) {
    osControl.mouseClick();
  } else {
    osControl.mouseClickRelease();
  }
};

let onConnectHandler = (port, tray, menu) => {
  let interfaces = networkInterfaces();
  let address = "";

  //Very old but needed for break
  outterLoopLabel: for (let devName in interfaces) {
    let interface = interfaces[devName];

    for (let i = 0; i < interface.length; i++) {
      if (
        interface[i].family === "IPv4" && //Working just with ip V4
        interface[i].address !== "127.0.0.1" && //Ignore the local address
        !interface[i].internal //Ignore internal address (like the local one)
      ) {
        address = interface[i].address;
        break outterLoopLabel; //Early return for crazy interface setUp in some computers
      }
    }
  }

  menu[0].label = `Listening on ${address}:${port}`;
  tray.setContextMenu(Menu.buildFromTemplate(menu));
};

let scrollHandler = (data) => {
  osControl.scroll(data)
}

module.exports = Receiver;
