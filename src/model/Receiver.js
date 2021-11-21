//Electron
const { ipcRenderer } = require("electron");

//NodeJS
const express = require("express");
const { networkInterfaces } = require("os");

const path = require("path");

class Receiver {
  constructor(stop, play, statusDiv, port = 3000) {
    this.port = port;
    this.app = null;
    this.server = null;
    this.router = null;
    //HTML elements
    this.stop = stop;
    this.play = play;
    this.statusDiv = statusDiv;
  }

  setUpServer() {
    this.router.get("/", (req, res, next) => {
      res.sendFile(path.join(__dirname, "./../view/serverView.html"));
    });

    this.app.use("/", this.router);
  }
  start() {
    this.app = express();
    this.router = express.Router();
    this.setUpServer();
    this.server = this.app.listen(
      3000,
      onConnectHandler.bind(this, this.statusDiv, this.port)
    );

    const io = require("socket.io")(this.server);
    io.on("connection", con => {
      console.log("Someone is connected");
      con.on("disconnect", () => console.log("client disconnected"));
      con.on("type", typeHandler);
      con.on("move", moveHandler);
      con.on("mousePress", pressHandler);
    });

    //Set STOP listener
    this.stop.addEventListener("click", stopHandler.bind(this, this.server));
  }
}

let stopHandler = (server, event) => {
  event.preventDefault();
  server.close(() => console.log("Server Closed"));
};

let typeHandler = data => {
  ipcRenderer.send("type", data);
};

let moveHandler = data => {
  ipcRenderer.send("move", data);
};

let pressHandler = data => {
  ipcRenderer.send("mouseClick", data);
};

let onConnectHandler = (status, port) => {
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

  status.innerHTML = `Listening on <span>${address}:${port}</span>`;
};

module.exports = Receiver;
