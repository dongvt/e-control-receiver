const { ipcRenderer } = require("electron");
const express = require("express");

const path = require("path");

class Receiver {
  constructor(stop, play, port = 3000) {
    this.port = port;
    this.app = null;
    this.server = null;
    this.router = null;
    this.stop = stop;
    this.play = play;
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
    this.server = this.app.listen(3000, () => console.log("listening"));

    const io = require("socket.io")(this.server);
    io.on("connection", (con) => {
      console.log("someone connected!");
      con.on("disconnect", () => console.log("client disconnected"));
      con.on("type", typeHandler);
    });

    //Set STOP listener
    this.stop.addEventListener("click", stopHandler.bind(this, this.server));
  }
}

let stopHandler = (server, event) => {
  event.preventDefault();
  server.close(() => console.log("Server Closed"));
};

let typeHandler = (data) => {
  ipcRenderer.send("type", data);
};

module.exports = Receiver;
