const express = require("express");
const router = express.Router();
const path = require("path");

const app = express();

router.get("/", (req, res, next) => {
  console.log(res);
  res.sendFile(path.join(__dirname, "/serverView.html"));
});

app.use("/", router);

const server = app.listen(3000, () => console.log("listening"));

const io = require("socket.io")(server);

io.on("connection", (stream) => {
  console.log("someone connected!");
});
