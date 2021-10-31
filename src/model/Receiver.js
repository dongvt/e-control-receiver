const express = require("express");

const path = require("path");

class Receiver {
  constructor(stop,play,port = 3000) {
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

    //Set STOP listener
    stop.addEventListener('click',stopHandler.bind(this,server));
    // const io = require("socket.io")(server);

    // io.on("connection", (stream) => {
    //   console.log("someone connected!");
    // });
  }
  stop(){
    return `<p> some HTML </p>`;
  }
}

let stopHandler = (reciever,event) => {
  event.preventDefault();
  console.log(reciever.server);
  reciever.server.close(() => console.log("Server Closed"));
}

module.exports = Receiver;
